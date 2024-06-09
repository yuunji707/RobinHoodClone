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

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

@app.route('/query', methods=['GET'])
def query_stock():
    ticker = request.args.get('ticker')
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        if info:
            logo_url = info.get('logo_url', '')
            preMarketPrice = info.get('preMarketPrice', None)
            regularMarketPrice = info.get('regularMarketPrice', None)
            stock_info = {
                'logo_url': logo_url,
                'preMarketPrice': preMarketPrice,
                'regularMarketPrice': regularMarketPrice
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
    data = request.get_json()
    ticker = data['ticker']
    quantity = data['quantity']

    stock = Stock.query.filter_by(ticker=ticker).first()
    if stock:
        stock.quantity += quantity
    else:
        stock = Stock(ticker=ticker, quantity=quantity)
        db.session.add(stock)

    db.session.commit()

    portfolio = Stock.query.all()
    portfolio_list = [{'ticker': stock.ticker, 'quantity': stock.quantity} for stock in portfolio]
    socketio.emit('portfolioUpdated', portfolio_list)

    return jsonify({'message': 'Stock purchased successfully'})

@app.route('/portfolio', methods=['GET'])
def view_portfolio():
    portfolio = Stock.query.all()
    portfolio_list = [{'ticker': stock.ticker, 'quantity': stock.quantity} for stock in portfolio]
    return jsonify(portfolio_list)


def generate_portfolio_review(portfolio_data):
    ticker_quantities = defaultdict(int)
    for stock in portfolio_data:
        ticker_quantities[stock['ticker']] += stock['quantity']
    
    portfolio_review = "Please review this stock portfolio. The portfolio consists of the following stocks:\n"
    for ticker, quantity in ticker_quantities.items():
        portfolio_review += f"{ticker}: {quantity}\n"

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": portfolio_review,
            }
        ],
        model="gpt-3.5-turbo"
    )

    message_content = chat_completion.choices[0].message.content
    return message_content

@app.route('/portfolio/review', methods=['POST'])
def get_portfolio_review():
    portfolio_data = request.json.get('portfolio_data')
    review = generate_portfolio_review(portfolio_data)
    return review

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    socketio.run(app, debug=True)

