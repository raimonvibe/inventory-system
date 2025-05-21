from fastapi import APIRouter

from app.database import get_analytics_data
from app.models import AnalyticsData

router = APIRouter(
    prefix="/analytics",
    tags=["analytics"],
)

@router.get("/", response_model=AnalyticsData)
async def read_analytics():
    return get_analytics_data()
