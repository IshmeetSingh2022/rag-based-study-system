from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from app.core.config import settings
import os
import traceback

CHROMA_DIR = "/app/data/chroma_db"
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200


def process_pdf(file_path: str, document_id: int) -> int:
    try:
        print("STEP 1: Loading PDF")

        loader = PyPDFLoader(file_path)

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=CHUNK_SIZE,
            chunk_overlap=CHUNK_OVERLAP
        )

        all_chunks = []

        for page in loader.lazy_load():
            chunks = splitter.split_documents([page])
            all_chunks.extend(chunks)

        print("STEP 2: Total chunks =", len(all_chunks))

        print("STEP 3: OPENAI_API_KEY exists =", settings.OPENAI_API_KEY is not None)

        embeddings = OpenAIEmbeddings(
            api_key=settings.OPENAI_API_KEY
        )

        print("STEP 4: Embeddings object created")

        vectorstore = Chroma(
            embedding_function=embeddings,
            collection_name=f"document_{document_id}",
            persist_directory=CHROMA_DIR,
        )

        print("STEP 5: Chroma object created")

        vectorstore.add_documents(all_chunks)

        print("STEP 6: Documents added successfully")

        return len(all_chunks)

    except Exception as e:
        print("\n========= PROCESS PDF ERROR =========")
        print(type(e).__name__)
        print(repr(e))
        traceback.print_exc()
        print("====================================\n")
        raise