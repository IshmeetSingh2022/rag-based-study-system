from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from sqlalchemy.orm import Session
from langchain_core.messages import HumanMessage, AIMessage
from app.models.message import Message
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from app.core.config import settings
from langchain_core.output_parsers import StrOutputParser
from langchain_chroma import Chroma
from langchain_core.runnables import RunnablePassthrough, RunnableLambda, RunnableParallel

CHROMA_DIR = "./chroma_db"

prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        """You are a helpful study assistant.
        The context below is extracted from a PDF document the user uploaded.
        
        IMPORTANT RULES:
        - Always answer based on the context provided
        - For generic questions like "summarize", "key concepts", "main topics" — 
          use ALL the context to give a comprehensive answer
        - Never say you cannot access the PDF
        - Only say "not covered" if context is completely empty
        
        Context from document:
        {context}
        """
    ),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{question}"),
])


def format_docs(docs) -> str:
    return "\n\n".join(doc.page_content for doc in docs)


def get_chat_history(db: Session, user_id: int, document_id: int) -> list:
    messages = db.query(Message).filter(
        Message.user_id == user_id,
        Message.document_id == document_id
    ).order_by(Message.created_at).all()

    history = []
    for message in messages:
        if message.role == "user":
            history.append(HumanMessage(content=message.content))
        else:
            history.append(AIMessage(content=message.content))
    return history


def save_messages(db: Session, user_id: int, document_id: int, question: str, ans: str):
    user_message = Message(
        user_id=user_id,
        document_id=document_id,
        role="user",
        content=question
    )
    system_message = Message(
        user_id=user_id,
        document_id=document_id,
        role="assistant",
        content=ans
    )
    db.add(user_message)
    db.add(system_message)
    db.commit()


def get_rag_response(question: str, document_id: int, user_id: int, db: Session) -> str:
    embeddings = OpenAIEmbeddings(api_key=settings.OPENAI_API_KEY)

    vector_store = Chroma(
        persist_directory=CHROMA_DIR,
        embedding_function=embeddings,
        collection_name=f"document_{document_id}"
    )

    retriever = vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 10}
    )

    llm = ChatOpenAI(
        api_key=settings.OPENAI_API_KEY,
        model="gpt-3.5-turbo",
        temperature=0.3
    )

    parallel_chain = RunnableParallel({
        "context": retriever | RunnableLambda(format_docs),
        "question": RunnablePassthrough(),
        "chat_history": RunnableLambda(lambda _: get_chat_history(db, user_id, document_id))
    })

    chain = parallel_chain | prompt | llm | StrOutputParser()

    answer = chain.invoke(question)

    save_messages(db, user_id, document_id, question, answer)

    return answer