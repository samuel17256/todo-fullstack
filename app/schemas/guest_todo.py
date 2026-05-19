from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class GuestTodoCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    body: str | None = None


class GuestTodoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    body: str | None
    created_at: datetime
