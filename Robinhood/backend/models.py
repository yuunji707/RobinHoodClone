from flask_sqlalchemy import SQLAlchemy

# Initialize the SQLAlchemy object
db = SQLAlchemy()

# Define the Stock model, which represents a table in the database
class Stock(db.Model):
    # Primary key column, auto-incrementing integer
    id = db.Column(db.Integer, primary_key=True)
    # Ticker column, a string with a maximum length of 20 characters, cannot be null
    ticker = db.Column(db.String(20), nullable=False)
    # Quantity column, an integer, cannot be null
    quantity = db.Column(db.Integer, nullable=False)
