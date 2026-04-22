import anthropic
import json
import os
import re
from dotenv import load_dotenv

load_dotenv()

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

SYSTEM_PROMPT = """You are an elite competitor intelligence analyst and business strategist. You think like a founder, analyze like a McKinsey consultant, and write like a top growth hacker.

Your goal is to give founders ACTIONABLE intelligence they can use immediately to beat their competitors.

STRICT RULES:
- Return ONLY valid JSON array — zero markdown, zero backticks, zero extra text
- Be brutally honest and specific — no generic advice
- Every insight must be actionable
- Label estimated data as "(estimated)"
- All scores must be numbers 0-100
- threat_level must be exactly "High", "Medium", or "Low"

REQUIRED JSON FORMAT:
[
  {
    "name": "Competitor name",
    "url": "their url",
    "tagline": "Their exact tagline",
    "threat_level": "High",

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
      "market_share": 0,
      "conversion_score": 0,
      "funnel_strength": 0
    },

    "executive_summary": {
      "what_they_do": "What this company does in 1-2 lines",
      "who_they_target": "Who they target specifically",
      "how_they_make_money": "Their revenue model",
      "why_they_are_winning": "Key reason they are winning or not",
      "key_opportunity": "Single biggest opportunity to beat them"
    },

    "icp": {
      "target_audience": "Industry, type of customer",
      "pain_points": "Pain points they are solving",
      "customer_sophistication": "Beginner / Intermediate / Advanced",
      "pricing_sensitivity": "Low-ticket / Mid-market / Premium"
    },

    "offer_monetization": {
      "core_product": "Core product or service",
      "offer_structure": "Packages, tiers, subscriptions",
      "pricing": "Estimated pricing with numbers",
      "revenue_model": "How they make money",
      "perceived_vs_actual_value": "Perceived value vs actual value assessment"
    },

    "value_proposition": {
      "main_headline": "Their main headline or promise",
      "emotional_triggers": ["fear", "speed", "status"],
      "messaging_clarity": "Assessment of how clear their messaging is",
      "what_works": "What works well in their messaging",
      "what_can_improve": "What can be improved"
    },

    "funnel": {
      "traffic_sources": ["SEO", "Paid Ads", "Social"],
      "landing_page_structure": "How their landing page is structured",
      "lead_magnets": "Lead magnets they use if any",
      "conversion_method": "CTA type - book call, trial, buy now etc",
      "follow_up_system": "Email, retargeting etc",
      "funnel_type": "High-ticket, SaaS trial, webinar etc",
      "funnel_weaknesses": "Specific weaknesses and leaks in their funnel"
    },

    "marketing_strategy": {
      "primary_channels": ["SEO", "LinkedIn", "YouTube"],
      "content_strategy": "Educational, viral, authority-based etc",
      "platform_focus": ["Instagram", "LinkedIn"],
      "frequency": "How often they post",
      "growth_driver": "What is primarily driving their growth"
    },

    "seo": {
      "monthly_traffic": "estimated number",
      "domain_authority": 0,
      "top_keywords": ["keyword1", "keyword2", "keyword3"],
      "backlinks": "estimated number",
      "strategy": "Their SEO approach"
    },

    "paid_ads": {
      "monthly_spend": "estimated spend",
      "platforms": ["Google", "Facebook"],
      "ad_strategy": "Their ad approach",
      "top_performing_ad": "Description of their best ad"
    },

    "website_cro": {
      "page_speed": "Fast / Medium / Slow",
      "mobile_optimization": "Good / Average / Poor",
      "cta_clarity": "Assessment of CTA placement",
      "trust_elements": "Testimonials, case studies, logos etc",
      "conversion_score": 0,
      "improvement_suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
    },

    "branding": {
      "positioning": "Premium / Budget / Niche / Mass Market",
      "social_proof_quality": "Assessment of their social proof",
      "brand_type": "Personal brand / Company brand",
      "credibility_level": "High / Medium / Low"
    },

    "tech_stack": {
      "website_platform": "WordPress / Webflow / Custom etc",
      "tools": ["Google Analytics", "HubSpot"],
      "integrations": ["Stripe", "Zapier"]
    },

    "strengths": [
      "Strength 1",
      "Strength 2",
      "Strength 3",
      "Strength 4",
      "Strength 5"
    ],

    "weaknesses": [
      "Weakness 1",
      "Weakness 2",
      "Weakness 3",
      "Weakness 4",
      "Weakness 5"
    ],

    "opportunities": {
      "market_gaps": "Market gaps they are not addressing",
      "underserved_segments": "Underserved audience segments",
      "missing_features": "Missing features or services",
      "customer_dissatisfaction": "Where customers may be dissatisfied"
    },

    "how_to_beat": {
      "short_term": [
        {"action": "Quick win 1", "timeline": "Week 1", "impact": "High"},
        {"action": "Quick win 2", "timeline": "Week 2", "impact": "High"},
        {"action": "Quick win 3", "timeline": "Week 3-4", "impact": "Medium"}
      ],
      "mid_term": [
        {"action": "Strategic move 1", "timeline": "Month 1-2", "impact": "High"},
        {"action": "Strategic move 2", "timeline": "Month 2-3", "impact": "High"}
      ],
      "long_term": [
        {"action": "Positioning advantage 1", "timeline": "Month 3-6", "impact": "High"},
        {"action": "Brand advantage", "timeline": "Month 6-12", "impact": "High"}
      ]
    },

    "positioning_map": {
      "their_position": "Where they sit - cheap vs premium, simple vs advanced",
      "positioning_gap": "Suggested positioning gap for you to enter"
    },

    "founder_insight": {
      "doing_right": "What they are doing right",
      "vulnerable": "Where they are most vulnerable",
      "winning_strategy": "Exact strategy to outperform them"
    },

    "vs_you": {
      "their_advantage": "What they do better",
      "your_advantage": "What you do better",
      "price_comparison": "How pricing compares",
      "feature_gap": "Features they have that you lack"
    }
  }
]"""


async def analyze_competitors(company_name: str, competitor_urls: list[str]):
    urls_text = "\n".join([f"- {url}" for url in competitor_urls])

    prompt = f"""Analyze these competitor websites for "{company_name}":

{urls_text}

For EACH competitor thoroughly analyze:
1. Executive summary — what they do, who they target, how they make money
2. Their ideal customer profile (ICP)
3. Full offer and monetization breakdown
4. Value proposition and messaging analysis
5. Complete funnel and customer journey
6. Marketing strategy across all channels
7. SEO data — traffic, keywords, domain authority
8. Paid ads strategy and estimated spend
9. Website CRO and conversion analysis
10. Trust, authority and branding assessment
11. Tech stack they use
12. Top 5 strengths AND top 5 weaknesses (be brutally honest)
13. Opportunity analysis — market gaps and underserved segments
14. Complete action plan to beat them (short/mid/long term)
15. Positioning map and gap analysis
16. Final founder insight

Compare everything directly against {company_name}.
Be strategic, direct, no fluff, no generic advice.
Return ONLY valid JSON array — no markdown, no extra text."""

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
                comp['scores'] = {k: 50 for k in ['overall_threat', 'seo_strength', 'content_quality', 'paid_ads_spend', 'product_strength', 'pricing_competitiveness', 'brand_strength', 'growth_rate', 'customer_satisfaction', 'market_share', 'conversion_score', 'funnel_strength']}
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
            "threat_level": "Medium",
            "scores": {k: 0 for k in ['overall_threat', 'seo_strength', 'content_quality', 'paid_ads_spend', 'product_strength', 'pricing_competitiveness', 'brand_strength', 'growth_rate', 'customer_satisfaction', 'market_share', 'conversion_score', 'funnel_strength']},
            "executive_summary": {"what_they_do": "Could not retrieve data", "who_they_target": "N/A", "how_they_make_money": "N/A", "why_they_are_winning": "N/A", "key_opportunity": "Please retry"},
            "icp": {"target_audience": "N/A", "pain_points": "N/A", "customer_sophistication": "N/A", "pricing_sensitivity": "N/A"},
            "offer_monetization": {"core_product": "N/A", "offer_structure": "N/A", "pricing": "N/A", "revenue_model": "N/A", "perceived_vs_actual_value": "N/A"},
            "value_proposition": {"main_headline": "N/A", "emotional_triggers": [], "messaging_clarity": "N/A", "what_works": "N/A", "what_can_improve": "N/A"},
            "funnel": {"traffic_sources": [], "landing_page_structure": "N/A", "lead_magnets": "N/A", "conversion_method": "N/A", "follow_up_system": "N/A", "funnel_type": "N/A", "funnel_weaknesses": "N/A"},
            "marketing_strategy": {"primary_channels": [], "content_strategy": "N/A", "platform_focus": [], "frequency": "N/A", "growth_driver": "N/A"},
            "seo": {"monthly_traffic": "N/A", "domain_authority": 0, "top_keywords": [], "backlinks": "N/A", "strategy": "N/A"},
            "paid_ads": {"monthly_spend": "N/A", "platforms": [], "ad_strategy": "N/A", "top_performing_ad": "N/A"},
            "website_cro": {"page_speed": "N/A", "mobile_optimization": "N/A", "cta_clarity": "N/A", "trust_elements": "N/A", "conversion_score": 0, "improvement_suggestions": []},
            "branding": {"positioning": "N/A", "social_proof_quality": "N/A", "brand_type": "N/A", "credibility_level": "N/A"},
            "tech_stack": {"website_platform": "N/A", "tools": [], "integrations": []},
            "strengths": ["Please retry"],
            "weaknesses": ["Please retry"],
            "opportunities": {"market_gaps": "N/A", "underserved_segments": "N/A", "missing_features": "N/A", "customer_dissatisfaction": "N/A"},
            "how_to_beat": {"short_term": [], "mid_term": [], "long_term": []},
            "positioning_map": {"their_position": "N/A", "positioning_gap": "N/A"},
            "founder_insight": {"doing_right": "N/A", "vulnerable": "N/A", "winning_strategy": "N/A"},
            "vs_you": {"their_advantage": "N/A", "your_advantage": "N/A", "price_comparison": "N/A", "feature_gap": "N/A"}
        }]