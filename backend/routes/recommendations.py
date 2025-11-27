from flask import Blueprint, request, jsonify
from auth import get_current_user
from recommender import get_recommendations
from db_functions import deduct_user_credit

recommendations_bp = Blueprint('recommendations', __name__)

# Recommendations Route
@recommendations_bp.route("/recommend", methods=["POST"])
def recommend():
    data = request.json

    # Check if user is authenticated
    user = get_current_user()
    if not user:
        return jsonify({"authenticated": False}), 401

    profile = data.get("profile")
    count = data.get("rec_count")

    # Calculate credit cost
    credit_cost = count * 5

    # Check if enough credit to proceed
    credit_balance = user.credit_limit
    if(not credit_balance >= credit_cost):
        return jsonify({"error": "Not enough credits"}), 400

    # 1 — Run the recommender
    results = get_recommendations(profile, count, scrape=False)

    # 2 — Check for failure
    if isinstance(results, dict) and "error" in results:
        return jsonify({
            "success": False,
            "error": results["error"],
            "details": results.get("details", "")
        }), 500

    # 3 — Deduct credits ONLY after success
    ok, msg = deduct_user_credit(user, amount=credit_cost)

    if not ok:
        return jsonify({"success": False, "error": msg}), 402  # payment required / insufficient credits

    # 4 — Return recommendations
    return jsonify({
        "success": True,
        "credits_message": msg,
        "results": [r.model_dump() for r in results]
    })

# Dummy Recommender For Testing
@recommendations_bp.route("/dummy-recommend", methods=["POST"])
def dummy_recommend():

    data = request.json

    # Check if user is authenticated
    user = get_current_user()
    if not user:
        return jsonify({"authenticated": False}), 401

    profile = data.get("profile")
    count = data.get("rec_count")

    # Calculate credit cost
    credit_cost = count * 5

    # Check if enough credit to proceed
    credit_balance = user.credit_limit
    if(not credit_balance >= credit_cost):
        return jsonify({"error": "Not enough credits"}), 400

    results = [
        {
            "author": "Alex Michaelides",
            "genre": [
                "Psychological Thriller",
                "Mystery",
                "Suspense"
            ],
            "genre_match": 0.9,
            "match_score": 0.875,
            "mood_match": 0.9,
            "pacing_match": 0.9,
            "scrape_data": {},
            "similarity_to_liked_books": "Most similar to 'Gone Girl' due to its psychological suspense, unreliable narrators (in a way), and focus on a shocking crime within a relationship. The constant unraveling of truth aligns with the mystery aspect.",
            "summary": "Alicia Berenson, a famous painter, shoots her fashion photographer husband Gabriel five times in the face and then never speaks another word. Theo Faber, a psychotherapist, is convinced he can unravel the mystery of why Alicia committed the murder and get her to speak again, leading him down a dark path into her past and his own.",
            "theme_match": 0.8,
            "title": "The Silent Patient",
            "total_score": 0.89,
            "why_it_matches": "If you enjoyed the intricate plot, shocking twists, and deep psychological exploration of marriage and deceit in 'Gone Girl', 'The Silent Patient' will captivate you. It delves into the dark corners of the human mind and keeps you guessing until the very end."
        },
        {
            "author": "Hermann Hesse",
            "genre": [
                "Philosophical Fiction",
                "Spiritual Journey",
                "Classic"
            ],
            "genre_match": 0.9,
            "match_score": 0.825,
            "mood_match": 0.9,
            "pacing_match": 0.6,
            "scrape_data": {},
            "similarity_to_liked_books": "Strongly aligns with 'The Alchemist' in its genre, mood, and core themes of a spiritual quest, self-realization, and finding meaning in life's journey. It's a classic with enduring philosophical insights, similar to 'To Kill a Mockingbird's' classic status for moral reflection.",
            "summary": "The story of a young man's quest for enlightenment, set in ancient India during the time of the Buddha. Siddhartha leaves his privileged life to seek truth through various spiritual paths, experiencing asceticism, the pleasures of the material world, and finally, finding wisdom through observation and acceptance.",
            "theme_match": 0.9,
            "title": "Siddhartha",
            "total_score": 0.84,
            "why_it_matches": "If 'The Alchemist' resonated with your desire for a philosophical journey of self-discovery, spiritual growth, and the pursuit of one's personal truth, 'Siddhartha' offers a profound and contemplative exploration of similar themes. It is a classic of spiritual literature that encourages deep reflection on the meaning of life."
        },
        {
            "author": "Khaled Hosseini",
            "genre": [
                "Literary Fiction",
                "Historical Fiction",
                "Coming-of-Age"
            ],
            "genre_match": 0.8,
            "match_score": 0.825,
            "mood_match": 0.9,
            "pacing_match": 0.7,
            "scrape_data": {},
            "similarity_to_liked_books": "Shares 'To Kill a Mockingbird's' deep emotional impact, exploration of social and ethnic divisions, and focus on justice and redemption. It also features a complex moral landscape and a coming-of-age narrative.",
            "summary": "The unforgettable story of Amir, a wealthy Pashtun boy, and Hassan, the son of his father's Hazara servant, set against a backdrop of tumultuous events in Afghanistan from the 1970s to the early 2000s. It is a powerful narrative of friendship, betrayal, and the quest for redemption.",
            "theme_match": 0.9,
            "title": "The Kite Runner",
            "total_score": 0.82,
            "why_it_matches": "For readers who appreciated 'To Kill a Mockingbird's' profound exploration of morality, social injustice, and the complexities of human relationships through a child's perspective, 'The Kite Runner' offers a similarly poignant and emotionally resonant journey. It tackles themes of guilt, forgiveness, and the long shadow of past actions, while offering a rich cultural backdrop."
        },
        {
            "author": "Donna Tartt",
            "genre": [
                "Literary Fiction",
                "Dark Academia",
                "Psychological Suspense"
            ],
            "genre_match": 0.8,
            "match_score": 0.825,
            "mood_match": 0.9,
            "pacing_match": 0.7,
            "scrape_data": {},
            "similarity_to_liked_books": "Combines the psychological intensity and moral ambiguity of 'Gone Girl' with the literary quality and exploration of societal/group dynamics found in 'To Kill a Mockingbird'. It features a complex cast of characters and a mystery at its core.",
            "summary": "A group of eccentric and intense classics students at an elite New England college fall under the spell of their charismatic professor, leading them down a path of intellectual obsession, moral ambiguity, and eventually, murder.",
            "theme_match": 0.9,
            "title": "The Secret History",
            "total_score": 0.82,
            "why_it_matches": "If you are drawn to the psychological depth and moral questioning found in 'Gone Girl' and the insightful character studies and profound themes of 'To Kill a Mockingbird', 'The Secret History' will appeal. It masterfully builds suspense not just through plot, but through the intricate psychology of its characters and their descent into darkness."
        },
        {
            "author": "Yann Martel",
            "genre": [
                "Philosophical Fiction",
                "Adventure",
                "Magical Realism"
            ],
            "genre_match": 0.8,
            "match_score": 0.8,
            "mood_match": 0.8,
            "pacing_match": 0.7,
            "scrape_data": {},
            "similarity_to_liked_books": "Similar to 'The Alchemist' in its philosophical underpinnings and allegorical style, focusing on a character's transformative journey. The intense survival aspect and unexpected twists also have a distant echo of the gripping nature of 'Gone Girl'.",
            "summary": "The incredible tale of Pi Patel, a young Indian boy who survives a shipwreck in the Pacific Ocean and is cast adrift on a lifeboat with a Bengal tiger, a hyena, an orangutan, and a zebra. It is a story of survival, faith, and the power of storytelling.",
            "theme_match": 0.9,
            "title": "Life of Pi",
            "total_score": 0.79,
            "why_it_matches": "For those who enjoyed the allegorical nature and philosophical depth of 'The Alchemist', 'Life of Pi' presents a thrilling adventure that is equally rich in symbolic meaning and spiritual contemplation. It's a journey of profound self-discovery and survival against impossible odds, prompting questions about belief and reality."
        }
    ]

    return jsonify({
        "success": True,
        "credits_message": "Using Dummy Recommender",
        "results": results
    })
