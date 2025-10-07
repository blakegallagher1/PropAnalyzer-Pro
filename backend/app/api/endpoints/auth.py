from datetime import timedelta
from datetime import timedelta
from typing import Any, Dict

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_session
from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    get_password_hash,
    verify_password,
)
from app.models.user import User

router = APIRouter()


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(
    payload: Dict[str, Any],
    session: AsyncSession = Depends(get_session),
) -> Dict[str, Any]:
    existing = await session.execute(select(User).where(User.email == payload["email"]))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    user = User(
        email=payload["email"],
        hashed_password=get_password_hash(payload["password"]),
        full_name=payload.get("full_name"),
        clerk_user_id=payload.get("clerk_user_id"),
    )

    session.add(user)
    await session.commit()
    await session.refresh(user)

    return {"id": str(user.id), "email": user.email}


@router.post("/login")
async def login_user(
    payload: Dict[str, Any],
    session: AsyncSession = Depends(get_session),
) -> Dict[str, Any]:
    result = await session.execute(select(User).where(User.email == payload["email"]))
    user = result.scalar_one_or_none()

    if not user or not verify_password(payload["password"], user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token = create_access_token({"sub": str(user.id)}, timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    refresh_token = create_refresh_token({"sub": str(user.id)})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }
