from google import genai
from pydantic import BaseModel, Field
from typing import List, Optional
import json
from scraper import sarasavi
import logging

# Init Gemini Client
client = genai.Client(api_key="AIzaSyDpuOxaeT2h2RqlJMTUphQ5iCTB9tPLj4I")

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============================================================
# ⭐ SCHEMAS
# ============================================================

class RankedBook(BaseModel):
    title: str
    author: str
    genre: list
    summary: str
    why_it_matches: str
    similarity_to_liked_books: str
    genre_match: float
    mood_match: float
    pacing_match: float
    theme_match: float
    match_score: float = Field(description="Average match score 0–1")
    total_score: Optional[float] = Field(description="Weighted total score 0–1")
    scrape_data: Optional[dict] = Field(default_factory=dict)


class RankedResults(BaseModel):
    books: List[RankedBook]

# ============================================================
# ⭐ SINGLE-STAGE RECOMMENDATION GENERATOR
# ============================================================

def generate_ranked_recommendations(user_profile: dict, top_k: int = 5):
    schema = RankedResults.model_json_schema()

    prompt = f"""
    You are an expert book recommendation model.

    Your task:
    1. Generate **{top_k + 3} diverse candidate books** aligned with the user's preferences.
    2. Score each book on:
       - genre_match (0–1)
       - mood_match (0–1)
       - pacing_match (0–1)
       - theme_match (0–1)
    3. Compute match_score = average of the four scores.
    4. Return ONLY the **top {top_k} books** ranked by match_score.
    
    You MUST provide diversity: different genres, themes, pacing, and authors while still respecting the user's preferences.

    User Profile:
    {json.dumps(user_profile, indent=2)}

    For each returned book, include:
    - title
    - author
    - genre
    - summary
    - why_it_matches
    - similarity_to_liked_books
    - genre_match
    - mood_match
    - pacing_match
    - theme_match
    - match_score

    Respond ONLY with valid JSON.
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_json_schema": schema
            }
        )

        parsed = json.loads(response.text)
        validated = RankedResults.model_validate(parsed)
        return validated.books

    except Exception as e:
        logger.error("Recommendation generation failed", exc_info=True)
        return {"error": "Recommendation generation failed", "details": str(e), "raw": response.text}


# ============================================================
# ⭐ TOTAL SCORE CALCULATION
# ============================================================

def compute_total_score(book: RankedBook, weights=None):
    if weights is None:
        weights = {
            "genre_match": 0.4,
            "mood_match": 0.3,
            "pacing_match": 0.2,
            "theme_match": 0.1
        }

    total = (
        book.genre_match * weights["genre_match"] +
        book.mood_match * weights["mood_match"] +
        book.pacing_match * weights["pacing_match"] +
        book.theme_match * weights["theme_match"]
    )

    return round(total, 4)


# ============================================================
# ⭐ MAIN ENTRY POINT
# ============================================================

def get_recommendations(user_profile: dict, count: int = 5, scrape=False):
    ranked = generate_ranked_recommendations(user_profile, top_k=count)

    if isinstance(ranked, dict) and "error" in ranked:
        return ranked

    # Compute total_score
    for book in ranked:
        book.total_score = compute_total_score(book)

    if(scrape):
        for book in ranked:
            try:
                if not isinstance(book.scrape_data, dict) or book.scrape_data is None:
                    book.scrape_data = {}  # ensure dict exists

                sarasavi_scraped_books = sarasavi(book.title)
                book.scrape_data["sarasavi"] = sarasavi_scraped_books if sarasavi_scraped_books else []
            except Exception as e:
                logger.warning(f"Sarasavi scraping failed for '{book.title}': {e}")
                book.scrape_data["sarasavi"] = []


    # Sort by total_score
    ranked_sorted = sorted(ranked, key=lambda b: b.total_score, reverse=True)

    return ranked_sorted[:count]
