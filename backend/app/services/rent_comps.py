from typing import Any, Dict, List


class RentCompsService:
    """Service to provide rental comparables."""

    async def fetch_comparables(self, address: str, radius_miles: float = 1.0) -> List[Dict[str, Any]]:
        return [
            {
                "address": "125 Main St",
                "rent": 2400,
                "bedrooms": 3,
                "bathrooms": 2,
                "square_feet": 1700,
                "distance_miles": 0.5,
            },
            {
                "address": "98 Market Ave",
                "rent": 2550,
                "bedrooms": 3,
                "bathrooms": 2,
                "square_feet": 1650,
                "distance_miles": 0.8,
            },
        ]
