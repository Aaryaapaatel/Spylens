import anthropic
import json
import os
from dotenv import load_dotenv

load_dotenv()

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

async def analyze_competitors(company_name: str, competitor_urls: list[str]):

    urls_text = "\n".join([f"- {url}" for url in competitor_urls])

    prompt = f"""You are a world class competitive intelligence analyst.

A company called "{company_name}" wants to analyze their competitors.

Analyze each of these competitor websites:
{urls_text}

For EACH competitor, search the web and return a JSON array with this exact structure:
[
  {{
    "name": "Competitor company name",
    "url": "their website url",
    "positioning": "Their main value proposition in one sentence",
    "pricing": "Their pricing model and price points",
    "target_market": "Who they target",
    "key_features": ["feature 1", "feature 2", "feature 3"],
    "recent_moves": "What they have done recently - launches, changes, news",
    "main_weakness": "Their biggest weakness or gap",
    "threat_level": "High, Medium, or Low",
    "opportunity": "How {company_name} can beat them specifically"
  }}
]

Return ONLY the JSON array. No extra text. No markdown. Just the raw JSON."""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=4000,
        tools=[{"type": "web_search_20250305", "name": "web_search"}],
        messages=[{"role": "user", "content": prompt}]
    )

    response_text = ""
    for block in message.content:
        if hasattr(block, "text"):
            response_text += block.text

    try:
        competitors = json.loads(response_text)
        return competitors
    except json.JSONDecodeError:
        import re
        json_match = re.search(r'\[.*\]', response_text, re.DOTALL)
        if json_match:
            competitors = json.loads(json_match.group())
            return competitors
        else:
            raise Exception("Could not parse competitor analysis results")