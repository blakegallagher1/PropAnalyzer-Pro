import uuid
from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_authenticated_user, get_session
from app.models.analysis import Analysis
from app.services.deal_calculator import DealCalculator

router = APIRouter()


@router.get("/")
async def list_analyses(
    session: AsyncSession = Depends(get_session),
    current_user: str = Depends(get_authenticated_user),
) -> Dict[str, Any]:
    result = await session.execute(
        select(Analysis).where(Analysis.owner_id == uuid.UUID(current_user))
    )

    analyses = result.scalars().all()
    return {"analyses": analyses, "total": len(analyses)}


@router.post("/")
async def create_analysis(
    analysis_data: Dict[str, Any],
    session: AsyncSession = Depends(get_session),
    current_user: str = Depends(get_authenticated_user),
) -> Dict[str, Any]:
    required_fields = ["property_id", "name", "deal_type", "acquisition", "financing", "income", "expenses"]
    missing = [field for field in required_fields if field not in analysis_data]
    if missing:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Missing required fields: {', '.join(missing)}",
        )

    calculator = DealCalculator(analysis_data)
    results = calculator.calculate()

    analysis = Analysis(
        owner_id=uuid.UUID(current_user),
        property_id=uuid.UUID(analysis_data["property_id"]),
        name=analysis_data["name"],
        deal_type=analysis_data["deal_type"],
        acquisition=analysis_data.get("acquisition"),
        financing=analysis_data.get("financing"),
        income=analysis_data.get("income"),
        expenses=analysis_data.get("expenses"),
        exit_strategy=analysis_data.get("exit_strategy"),
        metrics={
            "monthly_cash_flow": float(results.monthly_cash_flow),
            "cap_rate": float(results.cap_rate),
            "cash_on_cash_return": float(results.cash_on_cash_return),
            "irr": float(results.irr),
            "dscr": float(results.dscr),
        },
    )

    session.add(analysis)
    await session.commit()
    await session.refresh(analysis)

    return {
        "id": str(analysis.id),
        "metrics": analysis.metrics,
        "created_at": analysis.created_at,
    }


@router.get("/{analysis_id}")
async def get_analysis(
    analysis_id: str,
    session: AsyncSession = Depends(get_session),
    current_user: str = Depends(get_authenticated_user),
) -> Analysis:
    result = await session.execute(select(Analysis).where(Analysis.id == uuid.UUID(analysis_id)))

    analysis = result.scalar_one_or_none()

    if not analysis:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis not found")

    if str(analysis.owner_id) != current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    return analysis
