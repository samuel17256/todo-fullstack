from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.todo import TodoStatus


class TodoCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    body: str | None = None
    status: TodoStatus = TodoStatus.PENDING


class TodoUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=255)
    body: str | None = None
    status: TodoStatus | None = None


class TodoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    title: str
    body: str | None
    status: TodoStatus
    created_at: datetime
    updated_at: datetime
