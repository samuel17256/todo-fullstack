from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud.todo import create_todo, delete_todo, get_todo_by_id, get_todos_by_user, update_todo
from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.todo import TodoCreate, TodoResponse, TodoUpdate

router = APIRouter()


@router.post("", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
def create_user_todo(
    payload: TodoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    todo = create_todo(
        db=db,
        user_id=current_user.id,
        title=payload.title,
        body=payload.body,
        status=payload.status,
    )
    return todo


@router.get("", response_model=list[TodoResponse])
def get_user_todos(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_todos_by_user(db, current_user.id)


@router.put("/{todo_id}", response_model=TodoResponse)
def update_user_todo(
    todo_id: int,
    payload: TodoUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    todo = get_todo_by_id(db, todo_id)
    if todo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    if todo.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this todo")

    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")

    return update_todo(
        db=db,
        todo=todo,
        title=update_data.get("title"),
        body=update_data.get("body"),
        status=update_data.get("status"),
    )


@router.delete("/{todo_id}", status_code=status.HTTP_200_OK)
def delete_user_todo(
    todo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    todo = get_todo_by_id(db, todo_id)
    if todo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    if todo.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this todo")

    delete_todo(db, todo)
    return {"detail": "Todo deleted successfully"}
