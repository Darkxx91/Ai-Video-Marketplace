from sqlalchemy.orm import Session

from . import models, schemas

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    fake_hashed_password = user.password + "notreallyhashed"
    db_user = models.User(email=user.email, hashed_password=fake_hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_videos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Video).offset(skip).limit(limit).all()

def create_user_video(db: Session, video: schemas.VideoCreate, user_id: int):
    db_video = models.Video(**video.dict(), owner_id=user_id)
    db.add(db_video)
    db.commit()
    db.refresh(db_video)
    return db_video

def like_video(db: Session, user_id: int, video_id: int):
    db_like = models.Like(user_id=user_id, video_id=video_id)
    db.add(db_like)
    db.commit()
    db.refresh(db_like)
    return db_like

def create_comment(db: Session, user_id: int, video_id: int, text: str):
    db_comment = models.Comment(user_id=user_id, video_id=video_id, text=text)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

def follow_user(db: Session, follower_id: int, followed_id: int):
    db_follow = models.Follow(follower_id=follower_id, followed_id=followed_id)
    db.add(db_follow)
    db.commit()
    db.refresh(db_follow)
    return db_follow

def create_subscription(db: Session, user_id: int, plan: str):
    # This is a placeholder for the actual subscription logic.
    # You will need to integrate with a payment provider like Stripe to handle payments.
    db_subscription = models.Subscription(user_id=user_id, plan=plan, start_date="today", end_date="in one month")
    db.add(db_subscription)
    db.commit()
    db.refresh(db_subscription)
    return db_subscription

def upgrade_user_plan(db: Session, user_id: int, plan: str):
    db.query(models.User).filter(models.User.id == user_id).update({"plan": plan})
    db.commit()
