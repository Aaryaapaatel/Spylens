from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.claude_service import analyze_competitors

router = APIRouter()

class AnalysisRequest(BaseModel):
    company_name: str
    competitor_urls: list[str]

@router.post("/analyze")
async def analyze(request: AnalysisRequest):
    try:
        if len(request.competitor_urls) == 0:
            raise HTTPException(status_code=400, detail="Please provide at least one competitor URL")
        
        if len(request.competitor_urls) > 5:
            raise HTTPException(status_code=400, detail="Maximum 5 competitors allowed on free plan")
        
        results = await analyze_competitors(
            company_name=request.company_name,
            competitor_urls=request.competitor_urls
        )
        
        return {"success": True, "data": results}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))