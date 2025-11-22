from db_config import session, UserBookList, User

# -----------------------------
# Book List Functions
# -----------------------------

def create_list(user_id: str, list_name: str):
    """Create a new list for a user if it doesn't exist."""
    existing = session.query(UserBookList).filter_by(user_id=user_id, list_name=list_name).first()
    if existing:
        return existing
    new_list = UserBookList(user_id=user_id, list_name=list_name, book_ids=[])
    session.add(new_list)
    session.commit()
    return new_list

def add_book_to_list(user_id: str, list_name: str, book_id: str):
    """Add a book to a user's list (creates the list if missing)."""
    user_list = session.query(UserBookList).filter_by(user_id=user_id, list_name=list_name).first()
    if not user_list:
        user_list = create_list(user_id, list_name)
    if book_id not in user_list.book_ids:
        user_list.book_ids.append(book_id)
        session.commit()

def remove_book_from_list(user_id: str, list_name: str, book_id: str):
    """Remove a book from a user's list."""
    user_list = session.query(UserBookList).filter_by(user_id=user_id, list_name=list_name).first()
    if user_list and book_id in user_list.book_ids:
        user_list.book_ids.remove(book_id)
        session.commit()

def get_user_lists(user_id: str):
    """Return all lists of a user as a dictionary {list_name: [book_ids]}."""
    lists = session.query(UserBookList).filter_by(user_id=user_id).all()
    return {l.list_name: l.book_ids for l in lists}

def get_books_from_list(user_id: str, list_name: str):
    """Return all Google Books IDs from a user's list (frontend will fetch details)."""
    user_list = session.query(UserBookList).filter_by(user_id=user_id, list_name=list_name).first()
    if not user_list:
        return []
    return user_list.book_ids

def delete_list(user_id: str, list_name: str):
    """Delete a user's book list completely."""
    user_list = session.query(UserBookList).filter_by(user_id=user_id, list_name=list_name).first()
    if user_list:
        session.delete(user_list)
        session.commit()
        return True
    return False


# -----------------------------
# Credit Functions
# -----------------------------
def get_user_credit(user_id: str):
    """
    Get's the available credit balance for user
    Returns: (balance: int, message: str)
    """
    user = session.query(User).filter_by(id=user_id).first()

    if not user:
        return False, "User not found"
    
    return user.credit_limit


def deduct_user_credit(user_id: str, amount: int = 20):
    """
    Deduct credit from a user.
    Returns: (success: bool, message: str)
    """
    user = session.query(User).filter_by(id=user_id).first()
    if not user:
        return False, "User not found"
    
    # Admins do not consume credits
    if user.admin:
        return True, "Admin accounts do not consume credits"

    if user.credit_limit < amount:
        return False, "Insufficient credits"

    # Deduct credit
    user.credit_limit -= amount
    session.commit()
    return True, f"{amount} credits deducted. Remaining: {user.credit_limit}"



def add_user_credit(user_id: str, amount: int):
    """
    Add credits to a user's account (for top-ups or rewards).
    """
    user = session.query(User).filter_by(id=user_id).first()
    if not user:
        return {"error": "User not found"}

    user.credit_limit += amount
    session.commit()
    return True
