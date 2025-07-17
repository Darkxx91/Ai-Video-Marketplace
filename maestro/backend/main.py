import logging
import time
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from transformers import pipeline

from . import crud, models, schemas
from .database import SessionLocal, engine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    logger.info(f"method={request.method} path={request.url.path} status_code={response.status_code} duration={duration:.2f}s")
    return response

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail},
    )

# AI Model
# This is a placeholder for the actual model.
# I will replace this with a state-of-the-art model once I have had a chance to research the latest models.
generator = pipeline("text-to-video", model="some-advanced-text-to-video-model")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

import os
import json
from . import animations

@app.post("/generate-video/")
def generate_video(prompt: str):
    video = generator(prompt)
    return {"video": video}

@app.post("/generate-animation/")
def generate_animation(prompt: str):
    animation = animations.generate_animation(prompt)
    return {"animation": animation}

@app.get("/templates/")
def get_templates():
    templates = []
    for filename in os.listdir("maestro/backend/templates"):
        if filename.endswith(".json"):
            with open(os.path.join("maestro/backend/templates", filename)) as f:
                templates.append(json.load(f))
    return templates

@app.post("/users/{user_id}/videos/", response_model=schemas.Video)
def create_video_for_user(
    user_id: int, video: schemas.VideoCreate, db: Session = Depends(get_db)
):
    return crud.create_user_video(db=db, video=video, user_id=user_id)

from . import style_transfer

@app.get("/videos/", response_model=list[schemas.Video])
def read_videos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    videos = crud.get_videos(db, skip=skip, limit=limit)
    return videos

@app.post("/style-transfer/")
def style_transfer_video(content_video_id: int, style_video_id: int, db: Session = Depends(get_db)):
    content_video = db.query(models.Video).filter(models.Video.id == content_video_id).first()
    style_video = db.query(models.Video).filter(models.Video.id == style_video_id).first()
    new_video = style_transfer.transfer_style(content_video, style_video)
    return {"video": new_video}
