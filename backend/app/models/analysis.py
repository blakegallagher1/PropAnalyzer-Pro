import uuid

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Analysis Info
    name = Column(String(255), nullable=False)
    deal_type = Column(String(50), nullable=False)
    status = Column(String(50), default="draft")

    # Version Control
    version = Column(Integer, default=1)
    parent_analysis_id = Column(UUID(as_uuid=True), ForeignKey("analyses.id"))

    # Financial Data (stored as JSONB)
    acquisition = Column(JSON, nullable=False)
    renovation = Column(JSON)
    financing = Column(JSON, nullable=False)
    income = Column(JSON, nullable=False)
    expenses = Column(JSON, nullable=False)
    exit_strategy = Column(JSON)

    # Calculated Metrics
    metrics = Column(JSON)
    assumptions = Column(JSON)

    notes = Column(Text)
    tags = Column(JSON)

    # Sharing
    is_public = Column(Boolean, default=False)
    share_token = Column(String(255), unique=True)
    shared_with_user_ids = Column(JSON)

    # Metadata
    last_calculated_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    property = relationship("Property", back_populates="analyses")
    owner = relationship("User", back_populates="analyses")
    parent_analysis = relationship("Analysis", remote_side=[id])
