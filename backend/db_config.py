import uuid
from sqlalchemy import create_engine,Integer, Column, String, Boolean, JSON, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID  # optional if using Postgres
from sqlalchemy.orm import DeclarativeBase, sessionmaker, relationship
from sqlalchemy.sql import func

# -----------------------------
# Database Setup
# -----------------------------
engine = create_engine("sqlite:///bookrec.db", echo=False)  # SQLite supports UUID as string
Session = sessionmaker(bind=engine)
session = Session()

class Base(DeclarativeBase):
    pass

# -----------------------------
# Users Table
# -----------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    verified = Column(Boolean, default=False)
    admin = Column(Boolean, default=False)
    avatar_url = Column(String, default="")
    credit_limit = Column(Integer, default=100)

    lists = relationship("UserBookList", back_populates="user")


# -----------------------------
# User Book Lists
# -----------------------------
class UserBookList(Base):
    __tablename__ = "user_lists"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"))
    list_name = Column(String)
    book_ids = Column(JSON, default=[])
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="lists")

# -----------------------------
# Create all tables
# -----------------------------
Base.metadata.create_all(engine)
