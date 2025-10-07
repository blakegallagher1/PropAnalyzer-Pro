from typing import Any, Dict

import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_authenticated_user, get_session
from app.models.portfolio import Portfolio, PortfolioProperty

router = APIRouter()


@router.post("/")
async def create_portfolio(
    payload: Dict[str, Any],
    session: AsyncSession = Depends(get_session),
    current_user: str = Depends(get_authenticated_user),
) -> Portfolio:
    if "name" not in payload:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Portfolio name is required")

    portfolio = Portfolio(
        owner_id=uuid.UUID(current_user),
        name=payload["name"],
        description=payload.get("description"),
    )

    session.add(portfolio)
    await session.commit()
    await session.refresh(portfolio)
    return portfolio


@router.get("/")
async def list_portfolios(
    session: AsyncSession = Depends(get_session),
    current_user: str = Depends(get_authenticated_user),
) -> Dict[str, Any]:
    result = await session.execute(
        select(Portfolio).where(Portfolio.owner_id == uuid.UUID(current_user))
    )

    portfolios = result.scalars().all()
    return {"portfolios": portfolios, "total": len(portfolios)}


@router.post("/{portfolio_id}/properties")
async def add_property_to_portfolio(
    portfolio_id: str,
    payload: Dict[str, Any],
    session: AsyncSession = Depends(get_session),
    current_user: str = Depends(get_authenticated_user),
) -> PortfolioProperty:
    if "property_id" not in payload:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Property ID is required")

    result = await session.execute(select(Portfolio).where(Portfolio.id == uuid.UUID(portfolio_id)))
    portfolio = result.scalar_one_or_none()

    if not portfolio:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Portfolio not found")

    if str(portfolio.owner_id) != current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    association = PortfolioProperty(
        portfolio_id=portfolio.id,
        property_id=uuid.UUID(payload["property_id"]),
        equity=payload.get("equity"),
        loan_balance=payload.get("loan_balance"),
    )

    session.add(association)
    await session.commit()
    await session.refresh(association)

    return association
