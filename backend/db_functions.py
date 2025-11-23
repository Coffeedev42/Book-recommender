from db_config import session, UserBookList, User

# Book List Functions
def create_list(user, list_name: str):
    """Create a new list for a user if it doesn't exist."""
    existing = session.query(UserBookList).filter_by(user_id=user.id, list_name=list_name).first()
    if existing:
        return existing
    new_list = UserBookList(user_id=user.id, list_name=list_name, books=[])
    session.add(new_list)
    session.commit()
    return new_list


def add_book_to_list(user, list_name: str, list_id: str, book: dict):
    """Add full book data to a user's list."""
    user_list = session.query(UserBookList).filter_by(id=list_id, user_id=user.id).first()
    if not user_list:
        user_list = create_list(user, list_name)

    for b in user_list.books:
        if b["title"] == book["title"] and b["author"] == book["author"]:
            return 
    
    user_list.books.append(book)
    session.commit()


def remove_book_from_list(user, list_id: str, book: dict):
    user_list = session.query(UserBookList).filter_by(id=list_id, user_id=user.id).first()
    if not user_list or not user_list.books:
        return

    # Remove by matching title + author (safer than dict eq)
    user_list.books = [
        b for b in user_list.books
        if not (b.get("title") == book.get("title") and b.get("author") == book.get("author"))
    ]

    session.commit()


def get_user_lists(user):
    lists = session.query(UserBookList).filter_by(user_id=user.id).all()

    result = []
    for l in lists:
        result.append({
            "list_id": str(l.id), # ensure string
            "list_name": l.list_name,
            "books": l.books or [], # never return None
            "book_count": len(l.books or [])
        })

    return result


def get_books_from_list(user, list_id: str):
    user_list = session.query(UserBookList).filter_by(
        user_id=user.id,
        id=list_id
    ).first()

    if not user_list:
        return []

    return user_list.books or []


def delete_list(user, list_id: str):
    user_list = session.query(UserBookList).filter_by(
        user_id=user.id,
        id=list_id
    ).first()

    if not user_list:
        return False

    session.delete(user_list)
    session.commit()
    return True


# Credit Functions
def get_user_credit(user_id: str):
    user = session.query(User).filter_by(id=user_id).first()
    return user.credit_limit


def deduct_user_credit(user, amount: int = 20):
    # Admins do not consume credits
    if user.admin:
        return True, "Admin accounts do not consume credits"

    if user.credit_limit < amount:
        return False, "Insufficient credits. Please purchase"

    # Deduct credit
    user.credit_limit -= amount
    session.commit()
    return True, f"{amount} credits deducted. Remaining: {user.credit_limit}"



def add_user_credit(user_id: str, amount: int):
    user = session.query(User).filter_by(id=user_id).first()
    if not user:
        return {"error": "User not found"}

    user.credit_limit += amount
    session.commit()
    return True
