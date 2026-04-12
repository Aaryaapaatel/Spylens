import anthropic
import json
import os
import re
from dotenv import load_dotenv

load_dotenv()

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

SYSTEM_PROMPT = """You are SpyLens AI — the world's most elite competitor intelligence analyst and business strategist.

STRICT OUTPUT RULES:
- Return ONLY a valid JSON array — zero extra text, zero markdown, zero backticks
- All scores MUST be numbers between 0-100
- threat_level MUST be exactly "High", "Medium", or "Low"
- key_features MUST be exactly 4 specific features
- action_plan MUST have exactly 5 steps
- pricing MUST include real numbers
- Never invent data — label assumptions as "(estimated)"

REQUIRED JSON FORMAT:
[
  {
    "name": "Competitor name",
    "url": "their url",
    "tagline": "Their exact tagline from website",
    "positioning": "Their value proposition in one sentence",
    "pricing": "Real pricing with numbers",
    "pricing_model": "Freemium / Subscription / One-time / Usage-based",
    "target_market": "Who they target specifically",
    "founded": "Year founded or estimated",
    "employees": "Employee count or estimated range",
    "funding": "Total funding raised or bootstrapped",

    "scores": {
      "overall_threat": 0,
      "seo_strength": 0,
      "content_quality": 0,
      "paid_ads_spend": 0,
      "product_strength": 0,
      "pricing_competitiveness": 0,
      "brand_strength": 0,
      "growth_rate": 0,
      "customer_satisfaction": 0,
      "market_share": 0
    },

    "seo": {
      "monthly_traffic": "estimated number",
      "domain_authority": 0,
      "top_keywords": ["keyword1", "keyword2", "keyword3"],
      "backlinks": "estimated number",
      "strategy": "Their SEO approach in detail"
    },

    "paid_ads": {
      "monthly_spend": "estimated spend in USD",
      "platforms": ["Google", "Facebook"],
      "ad_strategy": "Their ad approach",
      "top_performing_ad": "Description of their best ad"
    },

    "content": {
      "blog_frequency": "How often they post",
      "social_platforms": ["LinkedIn", "Twitter"],
      "engagement_rate": "estimated engagement",
      "content_strategy": "Their content approach"
    },

    "key_features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
    "usp": "Their single biggest unique selling point",
    "recent_moves": "Something specific from last 3-6 months",
    "main_weakness": "Their biggest vulnerability",
    "threat_level": "High",

    "vs_you": {
      "their_advantage": "What they do better than you",
      "your_advantage": "What you do better than them",
      "price_comparison": "How your pricing compares",
      "feature_gap": "Features they have that you lack"
    },

    "opportunity": "Specific actionable way to beat this competitor",

    "action_plan": [
      {"step": 1, "timeline": "This week", "action": "Specific action to take", "impact": "High"},
      {"step": 2, "timeline": "This month", "action": "Specific action to take", "impact": "High"},
      {"step": 3, "timeline": "Next 3 months", "action": "Specific action to take", "impact": "Medium"},
      {"step": 4, "timeline": "Next 6 months", "action": "Specific action to take", "impact": "Medium"},
      {"step": 5, "timeline": "Next 12 months", "action": "Specific action to take", "impact": "High"}
    ]
  }
]"""


async def analyze_competitors(company_name: str, competitor_urls: list[str]):
    urls_text = "\n".join([f"- {url}" for url in competitor_urls])

    prompt = f"""Analyze these competitor websites for "{company_name}":

{urls_text}

For EACH competitor:
1. Search their website, pricing page, blog, and social media thoroughly
2. Find real traffic numbers, domain authority estimates
3. Identify their paid ad platforms and estimated spend
4. Score them 0-100 on every metric in the scores object
5. Find their biggest weakness vs {company_name}
6. Create a detailed 5-step action plan for {company_name} to beat them

Be very specific with numbers. Use real data where available, label estimates clearly.
Return ONLY valid JSON array — no markdown, no extra text, no backticks."""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=8000,
        system=SYSTEM_PROMPT,
        tools=[{"type": "web_search_20250305", "name": "web_search"}],
        messages=[{"role": "user", "content": prompt}]
    )

    response_text = ""
    for block in message.content:
        if hasattr(block, "text"):
            response_text += block.text

    response_text = response_text.strip()
    response_text = re.sub(r'^```json\s*', '', response_text)
    response_text = re.sub(r'^```\s*', '', response_text)
    response_text = re.sub(r'\s*```$', '', response_text)
    response_text = response_text.strip()

    try:
        competitors = json.loads(response_text)
        for comp in competitors:
            if comp.get('threat_level') not in ['High', 'Medium', 'Low']:
                comp['threat_level'] = 'Medium'
            if not comp.get('scores'):
                comp['scores'] = {k: 50 for k in ['overall_threat','seo_strength','content_quality','paid_ads_spend','product_strength','pricing_competitiveness','brand_strength','growth_rate','customer_satisfaction','market_share']}
            if not comp.get('action_plan'):
                comp['action_plan'] = []
            if not comp.get('key_features'):
                comp['key_features'] = ['Not available']
        return competitors
    except json.JSONDecodeError:
        json_match = re.search(r'\[.*\]', response_text, re.DOTALL)
        if json_match:
            try:
                return json.loads(json_match.group())
            except:
                pass
        return [{
            "name": "Analysis Error",
            "url": competitor_urls[0] if competitor_urls else "",
            "positioning": "Could not retrieve data — please retry",
            "pricing": "Not available",
            "pricing_model": "Not available",
            "target_market": "Not available",
            "founded": "Not available",
            "employees": "Not available",
            "funding": "Not available",
            "tagline": "Not available",
            "scores": {k: 0 for k in ['overall_threat','seo_strength','content_quality','paid_ads_spend','product_strength','pricing_competitiveness','brand_strength','growth_rate','customer_satisfaction','market_share']},
            "seo": {"monthly_traffic": "N/A", "domain_authority": 0, "top_keywords": [], "backlinks": "N/A", "strategy": "Not available"},
            "paid_ads": {"monthly_spend": "N/A", "platforms": [], "ad_strategy": "Not available", "top_performing_ad": "Not available"},
            "content": {"blog_frequency": "N/A", "social_platforms": [], "engagement_rate": "N/A", "content_strategy": "Not available"},
            "key_features": ["Please retry"],
            "usp": "Not available",
            "recent_moves": "Not available",
            "main_weakness": "Not available",
            "threat_level": "Medium",
            "vs_you": {"their_advantage": "N/A", "your_advantage": "N/A", "price_comparison": "N/A", "feature_gap": "N/A"},
            "opportunity": "Please retry",
            "action_plan": []
        }]