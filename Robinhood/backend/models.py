from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Initialize SQLAlchemy for database interactions
db = SQLAlchemy()

# Define the Stock model for the database
class Stock(db.Model):
    # Primary key for the Stock table
    id = db.Column(db.Integer, primary_key=True)
    # Stock ticker symbol (e.g., AAPL, GOOGL), max length 10 characters
    ticker = db.Column(db.String(10), nullable=False)
    # Quantity of stocks bought
    quantity = db.Column(db.Integer, nullable=False)
    # Date and time when the stock was bought, defaults to the current time
    date_bought = db.Column(db.DateTime, default=datetime.utcnow)

# Define the SoldStock model for the database
class SoldStock(db.Model):
    # Primary key for the SoldStock table
    id = db.Column(db.Integer, primary_key=True)
    # Stock ticker symbol (e.g., AAPL, GOOGL), max length 10 characters
    ticker = db.Column(db.String(10), nullable=False)
    # Quantity of stocks sold
    quantity = db.Column(db.Integer, nullable=False)
    # Date and time when the stock was sold, defaults to the current time
    date_sold = db.Column(db.DateTime, default=datetime.utcnow)
