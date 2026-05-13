from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from .routes import portfolio, market
from .db.init_db import init_db

@asynccontextmanager
async def lifespan(app):
    init_db()
    yield

app = FastAPI(title="Alpha Tracker", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(portfolio.router)
app.include_router(market.router)

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

frontend_dir = os.path.join(os.path.dirname(__file__), "../frontend")

app.mount("/css", StaticFiles(directory=os.path.join(frontend_dir, "css")), name="css")
app.mount("/js", StaticFiles(directory=os.path.join(frontend_dir, "js")), name="js")
assets_dir = os.path.join(frontend_dir, "assets")
if os.path.exists(assets_dir):
    app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

@app.get("/")
def read_index():
    return FileResponse(os.path.join(frontend_dir, "index.html"))

@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return FileResponse(os.path.join(assets_dir, "favicon.ico"))
