from flask import Flask, render_template, request, jsonify
import requests
import os
from dotenv import load_dotenv

# Загрузка переменных окружения из .env файла
load_dotenv()

app = Flask(__name__)

# Получение токена DaData из переменных окружения
DADATA_TOKEN = os.getenv('DADATA_TOKEN', '')
if not DADATA_TOKEN:
    raise ValueError("Необходимо установить DADATA_TOKEN в переменных окружения или .env файле")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/geocode', methods=['POST'])
def geocode():
    data = request.get_json()
    address = data.get('address', '')
    url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address'
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': f'Token {DADATA_TOKEN}'
    }
    payload = {
        "query": address,
        "language": "ru"
    }
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()  # Проверка на ошибки HTTP
        result = response.json()
        if 'suggestions' in result and result['suggestions']:
            suggestion = result['suggestions'][0]
            data = suggestion.get('data', {})
            lat = data.get('geo_lat')
            lon = data.get('geo_lon')
            if lat and lon:
                return jsonify({'latitude': float(lat), 'longitude': float(lon)})
    except Exception as e:
        app.logger.error(f'Error in geocode: {str(e)}')
    return jsonify({'latitude': 0, 'longitude': 0}), 400

@app.route('/suggest_address', methods=['POST'])
def suggest_address():
    data = request.get_json()
    query = data.get('query', '')
    url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address'
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': f'Token {DADATA_TOKEN}'
    }
    payload = {
        "query": query,
        "language": "ru",
        "count": 3
    }
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()
        suggestions = [s['value'] for s in result.get('suggestions', [])]
        return jsonify({'suggestions': suggestions})
    except Exception as e:
        app.logger.error(f'Error in suggest_address: {str(e)}')
        return jsonify({'suggestions': []}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
    
