import anthropic
import json
import os
import re
from dotenv import load_dotenv

load_dotenv()

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

SYSTEM_PROMPT = """You are an expert competitor analysis strategist specializing in digital businesses, SaaS, personal brands, and marketing funnels.

Your goal is NOT to just provide data, but to:
1. Identify key competitors
2. Analyze their strengths, weaknesses, and strategies
3. Compare them with the user's business
4. Extract meaningful insights
5. Provide actionable recommendations to outperform competitors

Always follow these rules:
- Be concise but insightful
- Avoid generic statements
- Focus on actionable intelligence
- Prioritize clarity over complexity
- Use structured output format
- Highlight what matters most first

When analyzing competitors, consider:
- SEO (keywords, backlinks, traffic)
- Paid ads (platforms, creatives, funnels)
- Content strategy (social media, blogs, engagement)
- Product/service positioning
- Pricing strategy
- Unique selling points (USP)
- Growth patterns

STRICT JSON OUTPUT RULES:
- Return ONLY a valid JSON array — zero extra text, zero markdown, zero backticks
- threat_level MUST be exactly "High", "Medium", or "Low"
- key_features MUST be exactly 4 specific features
- pricing MUST include real numbers found on their website
- All assumptions MUST be labeled as "estimated"
- End each competitor object with a clear action_plan array

REQUIRED JSON FORMAT:
[
  {
    "name": "Competitor name",
    "url": "their url",
    "positioning": "Their exact value proposition in one punchy sentence",
    "pricing": "Real pricing with numbers",
    "target_market": "Who they target specifically",
    "key_features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
    "seo_strategy": "Their SEO approach — keywords they rank for, estimated traffic",
    "paid_ads": "Platforms they advertise on and their ad strategy",
    "content_strategy": "Their content approach — social media, blogs, engagement style",
    "growth_pattern": "How they are growing — estimated or confirmed",
    "usp": "Their single biggest unique selling point",
    "recent_moves": "Something specific from last 3-6 months",
    "main_weakness": "Their biggest vulnerability",
    "threat_level": "High",
    "opportunity": "Specific actionable way to beat this competitor",
    "action_plan": [
      "Step 1 — do this immediately",
      "Step 2 — do this this week",
      "Step 3 — do this this month"
    ]
  }
]"""


async def analyze_competitors(company_name: str, competitor_urls: list[str]):
    urls_text = "\n".join([f"- {url}" for url in competitor_urls])

    prompt = f"""Analyze these competitor websites for "{company_name}":

{urls_text}

For EACH competitor:
1. Search their website, pricing page, blog, and social media
2. Find their SEO keywords and estimated traffic
3. Check what paid ads they are running
4. Analyze their content strategy
5. Find their biggest weakness vs {company_name}
6. Create a 3-step action plan for {company_name} to beat them

Compare each competitor directly against {company_name} and tell us exactly how to win.

IMPORTANT: Label any estimated data clearly. Return ONLY valid JSON array — no markdown, no extra text."""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=6000,
        system=SYSTEM_PROMPT,
        tools=[{"type": "web_search_20250305", "name": "web_search"}],
        messages=[{"role": "user", "content": prompt}]
    )

    response_text = ""
    for block in message.content:
        if hasattr(block, "text"):
            response_text += block.text

    # Clean response
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
            if not comp.get('key_features'):
                comp['key_features'] = ['Not available']
            if not comp.get('action_plan'):
                comp['action_plan'] = ['Retry analysis for action plan']
            required = ['name', 'url', 'positioning', 'pricing', 'target_market',
                       'key_features', 'seo_strategy', 'paid_ads', 'content_strategy',
                       'growth_pattern', 'usp', 'recent_moves', 'main_weakness',
                       'threat_level', 'opportunity', 'action_plan']
            for field in required:
                if field not in comp:
                    comp[field] = 'Not available'
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
            "target_market": "Not available",
            "key_features": ["Please retry the analysis"],
            "seo_strategy": "Not available",
            "paid_ads": "Not available",
            "content_strategy": "Not available",
            "growth_pattern": "Not available",
            "usp": "Not available",
            "recent_moves": "Not available",
            "main_weakness": "Not available",
            "threat_level": "Medium",
            "opportunity": "Please retry the analysis",
            "action_plan": ["Retry the analysis", "Check the URL is correct", "Try again in a moment"]
        }]