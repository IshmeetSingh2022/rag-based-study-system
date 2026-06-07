from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from app.core.config import settings
import os

CHROMA_DIR = "./chroma_db"
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200


def process_pdf(file_path:str,document_id:int)->int:
    file_size=os.path.getsize(file_path)
    
    loader=PyPDFLoader(file_path)
    splitter=RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP
    )
    all_chunks=[]
    
    for page in loader.lazy_load():
        chunks=splitter.split_documents([page])
        all_chunks.extend(chunks)

    embeddings=OpenAIEmbeddings(api_key=settings.OPENAI_API_KEY)

    vectorstore=Chroma(
        embedding_function=embeddings,
        collection_name=f"document_{document_id}",
        persist_directory=CHROMA_DIR,
    )

    vectorstore.add_documents(all_chunks)

    return len(all_chunks)
