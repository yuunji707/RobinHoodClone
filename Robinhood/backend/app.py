from collections import defaultdict
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import openai
from models import db, Stock, SoldStock
from dotenv import load_dotenv
from flask_socketio import SocketIO, emit
from datetime import datetime

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for the app
socketio = SocketIO(app, cors_allowed_origins="*")  # Enable WebSocket support

# Configurations for the SQLAlchemy database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database with the Flask app
db.init_app(app)

@app.route('/query', methods=['GET'])
def query_stock():
    """
    Endpoint to query stock information using yfinance.
    Accepts a 'ticker' as a query parameter and returns the stock's symbol, current price, and market cap.
    """
    ticker = request.args.get('ticker')
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        if info:
            symbol = info.get('symbol', '')
            currentPrice = info.get('currentPrice', None)
            marketCap = info.get('marketCap', None)
            stock_info = {
                'symbol': symbol,
                'currentPrice': currentPrice,
                'marketCap': marketCap
            }
            return jsonify(stock_info), 200
        else:
            return jsonify({'error': 'No information available for the provided ticker'}), 404
    except ValueError as ve:
        return jsonify({'error': f'Invalid ticker symbol: {ticker}'}), 400
    except Exception as e:
        return jsonify({'error': f'Failed to fetch stock information: {str(e)}'}), 500

@app.route('/buy', methods=['POST'])
def buy_stock():
    """
    Endpoint to buy a stock.
    Accepts JSON data with 'ticker' and 'quantity', updates the database, and emits an updated portfolio via WebSocket.
    """
    data = request.get_json()
    ticker = data['ticker']
    quantity = data['quantity']
    date_bought = datetime.now()

    # Check if the stock already exists in the portfolio
    stock = Stock.query.filter_by(ticker=ticker).first()
    if stock:
        stock.quantity += quantity
        stock.date_bought = date_bought  # Update the date_bought if more stock is bought
    else:
        stock = Stock(ticker=ticker, quantity=quantity, date_bought=date_bought)
        db.session.add(stock)

    db.session.commit()

    # Emit updated portfolio to connected clients
    portfolio = Stock.query.all()
    portfolio_list = [{'ticker': stock.ticker, 'quantity': stock.quantity, 'date_bought': stock.date_bought} for stock in portfolio]
    socketio.emit('portfolioUpdated', portfolio_list)

    return jsonify({'message': 'Stock purchased successfully', 'time': date_bought.strftime('%Y-%m-%d %H:%M:%S')})

@app.route('/sell', methods=['POST'])
def sell_stock():
    """
    Endpoint to sell a stock.
    Accepts JSON data with 'ticker' and 'quantity', updates the database, and emits an updated portfolio via WebSocket.
    """
    data = request.get_json()
    ticker = data['ticker']
    quantity = data['quantity']
    date_sold = datetime.now()

    stock = Stock.query.filter_by(ticker=ticker).first()
    if stock:
        if stock.quantity >= quantity:
            stock.quantity -= quantity
            if stock.quantity == 0:
                db.session.delete(stock)
            db.session.commit()

            # Add the sold stock to the SoldStock table
            sold_stock = SoldStock(ticker=ticker, quantity=quantity, date_sold=date_sold)
            db.session.add(sold_stock)
            db.session.commit()

            # Emit updated portfolio to connected clients
            portfolio = Stock.query.all()
            portfolio_list = [{'ticker': stock.ticker, 'quantity': stock.quantity, 'date_bought': stock.date_bought} for stock in portfolio]
            socketio.emit('portfolioUpdated', portfolio_list)

            return jsonify({'message': 'Stock sold successfully', 'time': date_sold.strftime('%Y-%m-%d %H:%M:%S')})
        else:
            return jsonify({'error': 'Not enough quantity to sell', 'time': date_sold.strftime('%Y-%m-%d %H:%M:%S')}), 400
    else:
        return jsonify({'error': 'Stock not found in portfolio', 'time': date_sold.strftime('%Y-%m-%d %H:%M:%S')}), 404

@app.route('/portfolio', methods=['GET'])
def view_portfolio():
    """
    Endpoint to view the current portfolio.
    Returns a list of bought and sold stocks with their details.
    """
    portfolio = Stock.query.all()
    sold_portfolio = SoldStock.query.all()

    portfolio_list = [{'ticker': stock.ticker, 'quantity': stock.quantity, 'date_bought': stock.date_bought.strftime('%Y-%m-%d %H:%M:%S')} for stock in portfolio]
    sold_list = [{'ticker': stock.ticker, 'quantity': stock.quantity, 'date_sold': stock.date_sold.strftime('%Y-%m-%d %H:%M:%S')} for stock in sold_portfolio]

    return jsonify({'bought_stocks': portfolio_list, 'sold_stocks': sold_list})

def generate_portfolio_review(portfolio_data):
    """
    Generates a portfolio review using OpenAI's GPT-3.5-turbo model.
    Aggregates the quantities for each stock ticker and sends a formatted string to OpenAI for review.
    """
    # Create formatted strings for bought and sold stocks
    bought_stocks_review = "Bought Stocks:\n"
    for stock in portfolio_data['bought_stocks']:
        bought_stocks_review += f"{stock['ticker']}: {stock['quantity']} (Bought on {stock['date_bought']})\n"
    
    sold_stocks_review = "Sold Stocks:\n"
    for stock in portfolio_data['sold_stocks']:
        sold_stocks_review += f"{stock['ticker']}: {stock['quantity']} (Sold on {stock['date_sold']})\n"
        
    # Combine both reviews
    portfolio_review = f"Please review this purchased stock portfolio. These stocks are currently held and have not been sold yet.\n\n{bought_stocks_review}\n And please review these stocks that have been sold.{sold_stocks_review}"
        
    # Initialize OpenAI client with API key
    load_dotenv()
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    openai.api_key = OPENAI_API_KEY   
    
    # Generate completion based on the combined portfolio review
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "user",
                "content": portfolio_review,
            }
        ]
    )

    # Extract content from the first choice
    message_content = response.choices[0].message['content']
    return message_content

@app.route('/portfolio/review', methods=['POST'])
def get_portfolio_review():
    """
    Endpoint to get a portfolio review.
    Accepts a JSON body with 'portfolio_data' and returns the generated review.
    """
    portfolio_data = request.json.get('portfolio_data')
    review = generate_portfolio_review(portfolio_data)
    return review

if __name__ == '__main__':
    # Create all database tables and run the Flask app
    with app.app_context():
        db.create_all()
    socketio.run(app, debug=True)
