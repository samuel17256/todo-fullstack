from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.todo import Todo, TodoStatus


def get_todos_by_user(db: Session, user_id: int) -> list[Todo]:
    return db.query(Todo).filter(Todo.user_id == user_id).order_by(Todo.created_at.desc()).all()


def get_todo_by_id(db: Session, todo_id: int) -> Todo | None:
    return db.query(Todo).filter(Todo.id == todo_id).first()


def create_todo(
    db: Session,
    user_id: int,
    title: str,
    body: str | None,
    status: TodoStatus,
) -> Todo:
    todo = Todo(user_id=user_id, title=title, body=body, status=status)
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo


def update_todo(
    db: Session,
    todo: Todo,
    title: str | None = None,
    body: str | None = None,
    status: TodoStatus | None = None,
) -> Todo:
    if title is not None:
        todo.title = title
    if body is not None:
        todo.body = body
    if status is not None:
        todo.status = status
    todo.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(todo)
    return todo


def delete_todo(db: Session, todo: Todo) -> None:
    db.delete(todo)
    db.commit()
