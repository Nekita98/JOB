from flask import Flask, render_template, request, jsonify
import requests
import os
from dotenv import load_dotenv  # Добавлен новый импорт

# Загрузка переменных окружения из файла .env
load_dotenv()

# Инициализация Flask-приложения
app = Flask(__name__)

# Конфигурация DaData
DADATA_TOKEN = os.getenv('DADATA_TOKEN')
if not DADATA_TOKEN:
    raise ValueError("Не задан DADATA_TOKEN в переменных окружения")

DADATA_URL = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address'
HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': f'Token {DADATA_TOKEN}'
}

# Главная страница
@app.route('/')
def index():
    """Рендеринг главной страницы с формой ввода адреса"""
    return render_template('index.html')

# API для геокодирования адреса
@app.route('/geocode', methods=['POST'])
def geocode():
    """
    Получение координат по адресу через API DaData
    Возвращает JSON с широтой, долготой и нормализованным адресом
    """
    try:
        # Проверка входных данных
        data = request.get_json()
        if not data or 'address' not in data:
            return jsonify({'error': 'Неверный запрос: отсутствует поле address'}), 400

        address = data['address'].strip()
        if not address:
            return jsonify({'error': 'Пустой адрес'}), 400

        # Формирование запроса к DaData
        payload = {
            "query": address,
            "language": "ru"
        }

        # Отправка запроса к DaData
        response = requests.post(DADATA_URL, headers=HEADERS, json=payload)
        response.raise_for_status()  # Проверка на ошибки HTTP

        # Обработка ответа
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

        return jsonify({'error': 'Координаты для данного адреса не найдены'}), 404

    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Ошибка соединения с DaData: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Внутренняя ошибка сервера: {str(e)}'}), 500

# API для подсказок адресов
@app.route('/suggest_address', methods=['POST'])
def suggest_address():
    """
    Получение подсказок адресов через API DaData
    Возвращает JSON со списком подсказок
    """
    try:
        # Проверка входных данных
        data = request.get_json()
        if not data or 'query' not in data:
            return jsonify({'error': 'Неверный запрос: отсутствует поле query'}), 400

        query = data['query'].strip()
        if not query:
            return jsonify({'suggestions': []})

        # Формирование запроса к DaData
        payload = {
            "query": query,
            "language": "ru",
            "count": 5  # Количество подсказок
        }

        # Отправка запроса к DaData
        response = requests.post(DADATA_URL, headers=HEADERS, json=payload)
        response.raise_for_status()  # Проверка на ошибки HTTP

        # Обработка ответа
        result = response.json()
        suggestions = [s['value'] for s in result.get('suggestions', [])]
        return jsonify({'suggestions': suggestions})

    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Ошибка соединения с DaData: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Внутренняя ошибка сервера: {str(e)}'}), 500

# Обработка ошибки 404
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

# Обработка ошибки 500
@app.errorhandler(500)
def internal_server_error(e):
    return render_template('500.html'), 500
