from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder='dist')

# Route for serving the home page or any initial page
@app.route('/')
def home():
    return 'Welcome to Flask App'

# Route to serve assets from the 'dist/assets' directory
@app.route('/project-g/assets/<path:filename>')
def serve_assets(filename):
    print(f"Requested file: {filename}")  # This will print the requested file to help with debugging
    return send_from_directory(os.path.join(app.static_folder, 'assets'), filename)

if __name__ == "__main__":
    # Running the Flask app
    app.run(debug=True)
