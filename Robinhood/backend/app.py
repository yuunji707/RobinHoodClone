from collections import defaultdict
from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
from openai import OpenAI
from models import db, Stock
from flask_socketio import SocketIO, emit

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

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
        print(info.get('currentPrice', None))
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
    Accepts a JSON body with 'ticker' and 'quantity' and updates the database accordingly.
    Emits a 'portfolioUpdated' event to all connected clients.
    """
    data = request.get_json()
    ticker = data['ticker']
    quantity = data['quantity']

    # Check if the stock already exists in the portfolio
    stock = Stock.query.filter_by(ticker=ticker).first()
    if stock:
        # If stock exists, update the quantity
        stock.quantity += quantity
    else:
        # If stock doesn't exist, create a new entry
        stock = Stock(ticker=ticker, quantity=quantity)
        db.session.add(stock)

    db.session.commit()

    # Fetch updated portfolio and emit 'portfolioUpdated' event
    portfolio = Stock.query.all()
    portfolio_list = [{'ticker': stock.ticker, 'quantity': stock.quantity} for stock in portfolio]
    socketio.emit('portfolioUpdated', portfolio_list)

    return jsonify({'message': 'Stock purchased successfully'})

@app.route('/portfolio', methods=['GET'])
def view_portfolio():
    """
    Endpoint to view the current portfolio.
    Returns a JSON list of all stocks in the portfolio.
    """
    portfolio = Stock.query.all()
    portfolio_list = [{'ticker': stock.ticker, 'quantity': stock.quantity} for stock in portfolio]
    return jsonify(portfolio_list)

def generate_portfolio_review(portfolio_data):
    """
    Generates a portfolio review using OpenAI's GPT-3.5-turbo model.
    Aggregates the quantities for each stock ticker and sends a formatted string to OpenAI for review.
    """
    # Aggregate quantities for each stock ticker
    ticker_quantities = defaultdict(int)
    for stock in portfolio_data:
        ticker_quantities[stock['ticker']] += stock['quantity']
    
    # Create a formatted string with aggregated quantities
    portfolio_review = "Please review this stock portfolio. The portfolio consists of the following stocks:\n"
    for ticker, quantity in ticker_quantities.items():
        portfolio_review += f"{ticker}: {quantity}\n"
        
    # Initialize OpenAI client with API key
    client = OpenAI(api_key='')

    # Generate completion based on aggregated portfolio review
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": portfolio_review,
            }
        ],
        model="gpt-3.5-turbo"
    )

    # Extract content from the first choice
    message_content = chat_completion.choices[0].message.content
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
