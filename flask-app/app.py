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
        return jsonify({'error': 'No file part'}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Generate a new filename using an index
    index = len(os.listdir(app.config['UPLOAD_FOLDER'])) + 1
    extension = file.filename.rsplit('.', 1)[1].lower()
    filename = f"image_{index}.{extension}"
    save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(save_path)

    # Save filename and timestamp to latest.txt
    with open('latest.txt', 'a') as f:
        f.write(f"{filename},{int(os.path.getmtime(save_path))}\n")

    return jsonify({'filename': filename}), 200

@app.route('/static/uploads/<filename>', methods=['GET'])
def serve_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/download/<filename>')
def download_file(filename):
    return send_from_directory('static/uploads', filename, as_attachment=True)

@app.route('/images', methods=['GET'])
def get_images():
    try:
        # Read and sort images by timestamp from latest.txt
        with open('latest.txt', 'r') as f:
            lines = f.readlines()
        images = [line.strip().split(',')[0] for line in sorted(lines, key=lambda x: int(x.split(',')[1]), reverse=True)]
        return jsonify(images), 200
    except FileNotFoundError:
        return jsonify([]), 200  # Return an empty list if the folder doesn't exist

@app.route('/', methods=['GET'])
def home():
    images = os.listdir(app.config['UPLOAD_FOLDER']) if os.path.exists(app.config['UPLOAD_FOLDER']) else []
    return render_template('index.html', images=images)

@app.route('/latest', methods=['GET'])
def latest_image():
    try:
        with open('latest.txt', 'r') as f:
            latest_filename = f.read().strip()
        return jsonify({'latest': latest_filename})
    except FileNotFoundError:
        return jsonify({'latest': None})

@app.route('/delete/<filename>', methods=['DELETE'])
def delete_image(filename):
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if os.path.exists(filepath):
        os.remove(filepath)
        # Remove the entry from latest.txt
        with open('latest.txt', 'r') as f:
            lines = f.readlines()
        with open('latest.txt', 'w') as f:
            for line in lines:
                if not line.startswith(filename + ','):
                    f.write(line)
        return '', 204
    return 'File not found', 404

if __name__ == '__main__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(host='0.0.0.0', port=5000)
