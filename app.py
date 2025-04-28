from flask import Flask, request, jsonify, redirect, url_for, send_file, send_from_directory
from flask_sqlalchemy import SQLAlchemy
import requests
import os
from dotenv import load_dotenv
import uuid
from flask_bcrypt import Bcrypt
import spotipy
from flask_cors import CORS
from spotipy.oauth2 import SpotifyClientCredentials
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user

load_dotenv()

app = Flask(__name__, static_folder='dist', static_url_path='')
CORS(app, resources={r"/*": {"origins": "*"}})

# Конфигурация API
tr_url = "https://spotify-downloader9.p.rapidapi.com/downloadSong"
headers = {
    "x-rapidapi-key": os.getenv("RAPIDAPI_KEY"),
    "x-rapidapi-host": os.getenv("RAPIDAPI_HOST")
}

# Инициализация Spotify клиента
sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(
    client_id=os.getenv("SPOTIFY_CLIENT_ID"),
    client_secret=os.getenv("SPOTIFY_CLIENT_SECRET")
))

# Конфигурация БД
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key'

# Инициализация расширений
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)
login_manager = LoginManager(app)
login_manager.login_view = 'auth_page'

# Модель пользователя
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

def download_track(url, save_path):
    try:
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            with open(save_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
            return True
        else:
            return False
    except Exception as e:
        print(f"Произошла ошибка: {e}")
        return False

# Загрузка пользователя по ID
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Создание таблиц в базе данных
with app.app_context():
    db.create_all()

# Маршрут для главной страницы (защищенный)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


# Маршрут для регистрации
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    if len(password) < 6:  # Минимальная длина пароля
        return jsonify({"error": "Password must be at least 6 characters long"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "User already exists"}), 400

    new_user = User(username=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

# Маршрут для входа
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    login_user(user)  # Авторизуем пользователя
    return jsonify({
        "message": "Login successful",
        "user_id": user.id,
        "username": user.username
    }), 200

# Маршрут для выхода
@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logout successful"}), 200

@app.route('/api/search', methods=['GET'])
def search_tracks():
    try:
        query = request.args.get('q')
        print(f"Получен запрос поиска с параметром q: {query}")

        if not query:
            return jsonify({"error": "Необходимо указать параметр q для поиска"}), 400

        results = sp.search(q=query, type='track', limit=10)
        print(f"Получены результаты от Spotify API: {len(results['tracks']['items'])} треков")

        tracks = []
        for track in results['tracks']['items']:
            track_info = {
                "id": track['id'],
                "title": track['name'],
                "artist": track['artists'][0]['name'],
                "album": track['album']['name'],
                "cover_url": track['album']['images'][0]['url'] if track['album']['images'] else None,
                "duration_ms": track['duration_ms'],
                "spotify_url": track['external_urls']['spotify'],
                "preview_url": track['preview_url'],
                "track_url": f"https://open.spotify.com/track/{track['id']}"
            }
            tracks.append(track_info)

        response_data = {
            "total_results": len(tracks),
            "tracks": tracks
        }
        print(f"Отправляем ответ: {response_data}")
        return jsonify(response_data)

    except Exception as e:
        print(f"Произошла ошибка: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/download', methods=['POST'])
def download_spotify_track():
    try:
        data = request.json
        if not data or 'track_url' not in data:
            return jsonify({"error": "Необходимо указать track_url"}), 400

        track_url = data['track_url']
        querystring = {"songId": track_url.split('/')[-1]}  # Извлекаем ID трека из URL

        response = requests.get(tr_url, headers=headers, params=querystring)
        if response.status_code != 200:
            return jsonify({"error": "Ошибка при получении ссылки на скачивание"}), 500

        data = response.json()
        download_url = data['data']['downloadLink']

        filename = f"{uuid.uuid4()}.mp3"
        save_path = os.path.join("downloads", filename)

        os.makedirs("downloads", exist_ok=True)

        if download_track(download_url, save_path):
            return send_file(save_path, as_attachment=True)
        else:
            return jsonify({"error": "Ошибка при скачивании трека"}), 500

    except Exception as e:
        print(f"Произошла ошибка: {str(e)}")
        return jsonify({"error": str(e)}), 500



@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"})


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
