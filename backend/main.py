from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from py2neo import Graph
from llama_index import ServiceContext, Document, VectorStoreIndex
from llama_index.llms.ollama import Ollama
from llama_index.embeddings.ollama import OllamaEmbedding
from jose import JWTError, jwt
from passlib.context import CryptContext
import os
import time
from typing import List
import shutil

# JWT Config
SECRET_KEY = "supersecret" # ändra till något bättre i .env!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# User fake db
fake_users_db = {
    "admin": {
        "username": "admin",
        "full_name": "Admin User",
        "hashed_password": "$2b$12$ExA6eZLhKkz.XNzZh0ybVugjFJc1bcx7jHvm5Ch0wlIasbPiPbChm",  # "password"
    }
}

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Initialize App
app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Neo4j connection
graph = Graph("bolt://neo4j:7687", auth=("neo4j", "password"))

# LLM + Embedding
llm = Ollama(model="mistral")
embed_model = OllamaEmbedding(model_name="mistral")

# Helper functions for Auth
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(username: str, password: str):
    user = fake_users_db.get(username)
    if not user or not verify_password(password, user["hashed_password"]):
        return False
    return user

def create_access_token(data: dict):
    to_encode = data.copy()
    to_encode.update({"exp": time.time() + ACCESS_TOKEN_EXPIRE_MINUTES * 60})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = fake_users_db.get(username)
    if user is None:
        raise credentials_exception
    return user

# AUTH ENDPOINT
@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

# FILE UPLOAD ENDPOINT
@app.post("/upload")
async def upload_file(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    temp_path = f"/tmp/{file.filename}"
    with open(temp_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # Chunk document
    reader = Document.from_file(temp_path)
    chunks = reader.get_chunks(chunk_size=512)

    # Store chunks with embedding
    for chunk in chunks:
        embedding = embed_model.get_text_embedding(chunk.text)
        graph.run("""
            CREATE (c:Chunk {text: $text, embedding: $embedding, user: $user})
        """, text=chunk.text, embedding=embedding, user=current_user["username"])

    os.remove(temp_path)
    return {"message": "File processed and added to graph"}

# CHAT ENDPOINT
@app.get("/ask")
async def ask(query: str, current_user: dict = Depends(get_current_user)):
    # Get embedding for query
    query_embedding = embed_model.get_text_embedding(query)

    # Find similar chunks
    results = graph.run("""
        MATCH (c:Chunk)
        WHERE c.user = $user
        WITH c, gds.similarity.cosine(c.embedding, $query_embedding) AS score
        WHERE score > 0.7
        RETURN c.text AS text
        ORDER BY score DESC LIMIT 5
    """, query_embedding=query_embedding, user=current_user["username"]).data()

    context = "\n\n".join([r["text"] for r in results])

    # Generate answer
    prompt = f"""You are a helpful assistant.
Context:
{context}

Answer the following question:
{query}
"""

    response = llm.complete(prompt)
    return {"answer": response.text}
