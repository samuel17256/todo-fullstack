from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.crud.guest_todo import create_guest_todo, get_all_guest_todos
from app.database import get_db
from app.schemas.guest_todo import GuestTodoCreate, GuestTodoResponse

router = APIRouter()


@router.post("", response_model=GuestTodoResponse, status_code=status.HTTP_201_CREATED)
def create_guest_todo_endpoint(payload: GuestTodoCreate, db: Session = Depends(get_db)):
    return create_guest_todo(db=db, title=payload.title, body=payload.body)


@router.get("", response_model=list[GuestTodoResponse])
def get_guest_todos(db: Session = Depends(get_db)):
    return get_all_guest_todos(db)
