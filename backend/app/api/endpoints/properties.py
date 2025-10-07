import uuid
from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_authenticated_user, get_session
from app.models.property import Property
from app.services.property_enrichment import PropertyEnrichmentService

router = APIRouter()


@router.post("/lookup")
async def lookup_property(
    address: str,
    enrich: bool = True,
    _session: AsyncSession = Depends(get_session),
    _current_user: str = Depends(get_authenticated_user),
) -> Dict[str, Any]:
    if enrich:
        enrichment_service = PropertyEnrichmentService()
        property_data = await enrichment_service.enrich_property(address)
        return property_data
    return {"address": address, "message": "Enrichment disabled"}


@router.post("/")
async def create_property(
    property_data: Dict[str, Any],
    session: AsyncSession = Depends(get_session),
    current_user: str = Depends(get_authenticated_user),
) -> Property:
    required_fields = ["street_address", "city", "state", "zip_code", "property_type"]
    missing = [field for field in required_fields if field not in property_data]
    if missing:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Missing required fields: {', '.join(missing)}",
        )

    property_obj = Property(owner_id=uuid.UUID(current_user), **property_data)

    session.add(property_obj)
    await session.commit()
    await session.refresh(property_obj)

    return property_obj


@router.get("/")
async def list_properties(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    session: AsyncSession = Depends(get_session),
    current_user: str = Depends(get_authenticated_user),
) -> Dict[str, Any]:
    result = await session.execute(
        select(Property)
        .where(Property.owner_id == uuid.UUID(current_user))
        .offset(skip)
        .limit(limit)
    )

    properties = result.scalars().all()
    return {"properties": properties, "total": len(properties)}


@router.get("/{property_id}")
async def get_property(
    property_id: str,
    session: AsyncSession = Depends(get_session),
    current_user: str = Depends(get_authenticated_user),
) -> Property:
    result = await session.execute(select(Property).where(Property.id == uuid.UUID(property_id)))

    property_obj = result.scalar_one_or_none()

    if not property_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")

    if str(property_obj.owner_id) != current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    return property_obj
