from pydantic import BaseModel

class VideoBase(BaseModel):
    title: str
    description: str | None = None

class VideoCreate(VideoBase):
    pass

class Video(VideoBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    videos: list[Video] = []

    class Config:
        orm_mode = True
