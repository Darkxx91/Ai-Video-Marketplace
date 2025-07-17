from pydantic import BaseModel

class VideoBase(BaseModel):
    title: str
    description: str | None = None

class VideoCreate(VideoBase):
    pass

class Like(BaseModel):
    id: int
    user_id: int

    class Config:
        orm_mode = True

class Comment(BaseModel):
    id: int
    text: str
    user_id: int

    class Config:
        orm_mode = True

class Video(VideoBase):
    id: int
    owner_id: int
    likes: list[Like] = []
    comments: list[Comment] = []

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class Subscription(BaseModel):
    id: int
    start_date: str
    end_date: str
    plan: str

    class Config:
        orm_mode = True

class User(UserBase):
    id: int
    is_active: bool
    plan: str
    videos: list[Video] = []
    subscriptions: list[Subscription] = []

    class Config:
        orm_mode = True
