from fastapi import APIRouter

from app.routes.auth import router as auth_router
from app.routes.guest_todos import router as guest_todos_router
from app.routes.todos import router as todos_router

api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
api_router.include_router(todos_router, prefix="/todos", tags=["Todos"])
api_router.include_router(guest_todos_router, prefix="/guest/todos", tags=["Guest Todos"])
