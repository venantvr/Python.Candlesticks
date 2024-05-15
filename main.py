import pandas as pd
from flask import Flask, jsonify, send_from_directory

app = Flask(__name__, static_folder='static')


@app.route('/')
def index():
    return send_from_directory('static', 'index.html')


# Charger les données CSV
data_12h = pd.read_csv('data_12h.csv')
data_1h = pd.read_csv('data_1h.csv')


@app.route('/data')
def data():
    global data_12h, data_1h

    # Convertir les timestamps en millisecondes pour JavaScript
    data_12h['timestamp'] = pd.to_datetime(data_12h['timestamp']).astype(int) // 10 ** 6
    data_1h['timestamp'] = pd.to_datetime(data_1h['timestamp']).astype(int) // 10 ** 6

    # Assurez-vous de remettre à zéro les données si vous atteignez la fin pour cet exemple
    if len(data_12h) < 10 or len(data_1h) < 120:
        data_12h = pd.read_csv('data_12h.csv')
        data_1h = pd.read_csv('data_1h.csv')
        data_12h['timestamp'] = pd.to_datetime(data_12h['timestamp']).astype(int) // 10 ** 6
        data_1h['timestamp'] = pd.to_datetime(data_1h['timestamp']).astype(int) // 10 ** 6

    # Sélectionner 10 bougies de 12h et 120 bougies de 1h
    response_data = {
        'data_12h': data_12h.head(10).to_dict(orient='records'),
        'data_1h': data_1h.head(120).to_dict(orient='records')
    }

    # Avancer les données
    data_12h = data_12h.iloc[1:]  # Avance d'une bougie de 12h
    data_1h = data_1h.iloc[12:]  # Avance de 12 bougies de 1h

    return jsonify(response_data)


if __name__ == '__main__':
    app.run(debug=True)
