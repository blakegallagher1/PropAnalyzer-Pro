import uuid

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, JSON, Numeric, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Property(Base):
    __tablename__ = "properties"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Basic Info
    name = Column(String(255))
    property_type = Column(String(50), nullable=False)
    status = Column(String(50), default="analyzing")

    # Address
    street_address = Column(String(255), nullable=False)
    unit_number = Column(String(50))
    city = Column(String(100), nullable=False)
    state = Column(String(50), nullable=False)
    zip_code = Column(String(20), nullable=False)
    county = Column(String(100))
    country = Column(String(50), default="USA")

    # Property Details
    year_built = Column(Integer)
    square_feet = Column(Integer)
    lot_size_sqft = Column(Integer)
    bedrooms = Column(Numeric(3, 1))
    bathrooms = Column(Numeric(3, 1))
    units = Column(Integer, default=1)
    parking_spaces = Column(Integer)
    stories = Column(Integer)

    # Zoning & Legal
    zoning = Column(String(100))
    parcel_number = Column(String(100))
    legal_description = Column(Text)

    # External IDs
    zillow_zpid = Column(String(50))
    attom_id = Column(String(50))
    mls_number = Column(String(50))

    # Coordinates
    latitude = Column(Numeric(10, 8))
    longitude = Column(Numeric(11, 8))

    # Media
    primary_image_url = Column(Text)
    images = Column(JSON)
    documents = Column(JSON)

    # Metadata
    data_last_refreshed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    owner = relationship("User", back_populates="properties")
    analyses = relationship("Analysis", back_populates="property", cascade="all, delete-orphan")
    portfolio_associations = relationship("PortfolioProperty", back_populates="property", cascade="all, delete-orphan")
