from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

# Конфигурация DaData
DADATA_TOKEN = "9ee3572f0816f9d08d81c76773769f83c08d3289"
DADATA_URL = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address'
HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': f'Token {DADATA_TOKEN}'
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/geocode', methods=['POST'])
def geocode():
    try:
        data = request.get_json()
        if not data or 'address' not in data:
            return jsonify({'error': 'Неверный запрос'}), 400

        address = data['address'].strip()
        if not address:
            return jsonify({'error': 'Пустой адрес'}), 400

        payload = {
            "query": address,
            "language": "ru"
        }

        response = requests.post(DADATA_URL, headers=HEADERS, json=payload)
        response.raise_for_status()

        result = response.json()
        if 'suggestions' in result and result['suggestions']:
            suggestion = result['suggestions'][0]
            data = suggestion.get('data', {})
            lat = data.get('geo_lat')
            lon = data.get('geo_lon')

            if lat and lon:
                return jsonify({
                    'latitude': float(lat),
                    'longitude': float(lon),
                    'address': suggestion['value']
                })

        return jsonify({'error': 'Координаты не найдены'}), 404

    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Ошибка соединения с DaData: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Внутренняя ошибка сервера: {str(e)}'}), 500

@app.route('/suggest_address', methods=['POST'])
def suggest_address():
    try:
        data = request.get_json()
        if not data or 'query' not in data:
            return jsonify({'error': 'Неверный запрос'}), 400

        query = data['query'].strip()
        if not query:
            return jsonify({'suggestions': []})

        payload = {
            "query": query,
            "language": "ru",
            "count": 5
        }

        response = requests.post(DADATA_URL, headers=HEADERS, json=payload)
        response.raise_for_status()

        result = response.json()
        suggestions = [s['value'] for s in result.get('suggestions', [])]
        return jsonify({'suggestions': suggestions})

    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Ошибка соединения с DaData: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Внутренняя ошибка сервера: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)