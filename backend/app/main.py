from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import analysis, auth

app = FastAPI(title="SpyLens API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["analysis"])

@app.get("/")
def root():
    return {"message": "SpyLens API is running!", "status": "active"}

@app.get("/health")
def health():
    return {"status": "healthy"}