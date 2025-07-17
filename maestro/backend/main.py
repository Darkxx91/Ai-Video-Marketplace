from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session
from transformers import pipeline

from . import crud, models, schemas
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# AI Model
generator = pipeline("text-to-video", model="damo-vilab/text-to-video-ms-1.7b")

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

@app.get("/videos/", response_model=list[schemas.Video])
def read_videos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    videos = crud.get_videos(db, skip=skip, limit=limit)
    return videos
