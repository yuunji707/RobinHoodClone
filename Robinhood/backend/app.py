from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import pandas as pd
from models import db, Stock

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

@app.route('/query', methods=['GET'])
def query_stock():
    ticker = request.args.get('ticker')
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        #this is a bigass pd file. you need to extract symbol, currentPrice, and marketCap
        if info:
            # Extract specific attributes
            logo_url = info.get('symbol', '')
            preMarketPrice = info.get('currentPrice', None)
            regularMarketPrice = info.get('marketCap', None)
            
            # Return the extracted attributes
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
    stock = Stock(ticker=ticker, quantity=quantity)
    db.session.add(stock)
    db.session.commit()
    return jsonify({'message': 'Stock purchased successfully'})

@app.route('/portfolio', methods=['GET'])
def view_portfolio():
    portfolio = Stock.query.all()
    portfolio_list = [{'ticker': stock.ticker, 'quantity': stock.quantity} for stock in portfolio]
    return jsonify(portfolio_list)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)

