from sqlalchemy.orm import Session

from app.models.guest_todo import GuestTodo


def get_all_guest_todos(db: Session) -> list[GuestTodo]:
    return db.query(GuestTodo).order_by(GuestTodo.created_at.desc()).all()


def create_guest_todo(db: Session, title: str, body: str | None) -> GuestTodo:
    guest_todo = GuestTodo(title=title, body=body)
    db.add(guest_todo)
    db.commit()
    db.refresh(guest_todo)
    return guest_todo
