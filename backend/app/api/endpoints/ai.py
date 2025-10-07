from typing import Any, Dict

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_authenticated_user, get_session
from app.services.ai_analyzer import AIAnalyzerService

router = APIRouter()


@router.post("/insights")
async def generate_insights(
    payload: Dict[str, Any],
    _session: AsyncSession = Depends(get_session),
    _current_user: str = Depends(get_authenticated_user),
) -> Dict[str, Any]:
    service = AIAnalyzerService()
    return await service.generate_insights(payload)


@router.post("/recommendations")
async def recommend_deals(
    preferences: Dict[str, Any],
    _session: AsyncSession = Depends(get_session),
    _current_user: str = Depends(get_authenticated_user),
) -> Dict[str, Any]:
    service = AIAnalyzerService()
    deals = await service.recommend_deals(preferences)
    return {"deals": deals}
