from celery import Celery

from app.core.config import settings

CELERY_BROKER_URL = settings.REDIS_URL
CELERY_RESULT_BACKEND = settings.REDIS_URL

celery_app = Celery(
    "propanalyzer",
    broker=CELERY_BROKER_URL,
    backend=CELERY_RESULT_BACKEND,
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
)


@celery_app.task
def recalculate_analysis(analysis_id: str) -> str:
    # Placeholder task for recalculation
    return f"Recalculated analysis {analysis_id}"
