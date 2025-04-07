from flask import Flask, request, send_from_directory, jsonify, render_template
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS

app = Flask(__name__)  # Define the app object
CORS(app)  # Enable CORS after defining the app

UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return 'No file part', 400
    file = request.files['image']
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        return jsonify({'filename': filename}), 201
    return 'Invalid file type', 400

@app.route('/static/uploads/<filename>', methods=['GET'])
def serve_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/images', methods=['GET'])
def get_images():
    try:
        images = os.listdir(app.config['UPLOAD_FOLDER'])
        return jsonify(images), 200
    except FileNotFoundError:
        return jsonify([]), 200  # Return an empty list if the folder doesn't exist

@app.route('/', methods=['GET'])
def home():
    images = os.listdir(app.config['UPLOAD_FOLDER']) if os.path.exists(app.config['UPLOAD_FOLDER']) else []
    return render_template('index.html', images=images)

@app.route('/delete/<filename>', methods=['DELETE'])
def delete_image(filename):
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if os.path.exists(filepath):
        os.remove(filepath)
        return '', 204
    return 'File not found', 404

if __name__ == '__main__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(host='0.0.0.0', port=5000)
