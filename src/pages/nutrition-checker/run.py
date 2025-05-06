import os
import re
import pickle
import cv2
import pytesseract
from flask import Flask, render_template, request, jsonify

app = Flask(__name__, template_folder="templates", static_folder="static")

# -----------------------------------------------------------------------------
# 1. Load the Machine Learning Models
# -----------------------------------------------------------------------------
diabetes_model = pickle.load(open('Saved Models/diabetes_model.sav', 'rb'))
heart_disease_model = pickle.load(open('Saved Models/heart_disease_model.sav', 'rb'))
parkinsons_model = pickle.load(open('Saved Models/parkinsons_model.sav', 'rb'))

# -----------------------------------------------------------------------------
# 2. Disease-Specific Nutrient Limits
# -----------------------------------------------------------------------------
DISEASE_LIMITS = {
    "default": {
        "Total Fat": 70,
        "Saturated Fat": 20,
        "Trans Fat": 0,
        "Cholesterol": 300,
        "Sodium": 2300,
        "Dietary Fiber": 25,
        "Total Sugars": 50,
        "Added Sugars": 10,
    },
    "diabetes": {
        "Total Fat": 70,
        "Saturated Fat": 20,
        "Trans Fat": 0,
        "Cholesterol": 300,
        "Sodium": 2300,
        "Dietary Fiber": 25,
        # Stricter sugar limits for diabetes
        "Total Sugars": 30,
        "Added Sugars": 5,
    },
    "heart": {
        "Total Fat": 60,
        "Saturated Fat": 15,
        "Trans Fat": 0,
        # Lower cholesterol & sodium for heart disease
        "Cholesterol": 200,
        "Sodium": 1500,
        "Dietary Fiber": 25,
        "Total Sugars": 50,
        "Added Sugars": 10,
    },
    "parkinsons": {
        "Total Fat": 70,
        "Saturated Fat": 20,
        "Trans Fat": 0,
        "Cholesterol": 300,
        "Sodium": 2300,
        "Dietary Fiber": 25,
        "Total Sugars": 50,
        "Added Sugars": 10,
    }
}

def get_acceptable_limits(disease: str) -> dict:
    """
    Return the nutrient limit dictionary for a given disease,
    or default limits if the disease is None or not in the dictionary.
    """
    if disease and disease in DISEASE_LIMITS:
        return DISEASE_LIMITS[disease]
    return DISEASE_LIMITS["default"]

# -----------------------------------------------------------------------------
# 3. OCR & Nutrition Functions
# -----------------------------------------------------------------------------
def extract_text_from_image(image_path: str) -> str:
    """
    Extract text from an image using Tesseract OCR.
    """
    image = cv2.imread(image_path)
    if image is None:
        return ""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    enhanced = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
    text = pytesseract.image_to_string(enhanced, lang="eng")
    return text

def parse_nutritional_info(text: str) -> dict:
    """
    Parse nutritional information from text using regex.
    Expected format: "Nutrient: value unit" (unit can be 'g' or 'mg').
    """
    pattern = r"(Total Fat|Saturated Fat|Trans Fat|Cholesterol|Sodium|Dietary Fiber|Total Sugars|Added Sugars):?\s*([\d.]+)\s*(mg|g)?"
    matches = re.findall(pattern, text)
    nutrition = {}
    for nutrient, value, unit in matches:
        try:
            val = float(value)
            if unit == "mg":
                val /= 1000  # Convert mg to g
            nutrition[nutrient] = val
        except ValueError:
            continue
    return nutrition

def validate_nutrition(nutrition: dict, acceptable_limits: dict) -> dict:
    """
    Validate extracted nutritional values against the specified limits.
    """
    results = {}
    for nutrient, value in nutrition.items():
        if nutrient in acceptable_limits:
            limit = acceptable_limits[nutrient]
            results[nutrient] = (value <= limit)
    return results

# -----------------------------------------------------------------------------
# 4. Routes
# -----------------------------------------------------------------------------

# Home route
@app.route('/')
def home():
    """
    Render the landing page (home.html).
    """
    return render_template('home.html')


# ------------------------------
# Disease Check: Diabetes
# ------------------------------
@app.route('/diabetes', methods=['GET', 'POST'])
def diabetes():
    diagnosis = None
    if request.method == 'POST':
        try:
            data = [
                float(request.form['Pregnancies']),
                float(request.form['Glucose']),
                float(request.form['BloodPressure']),
                float(request.form['SkinThickness']),
                float(request.form['Insulin']),
                float(request.form['BMI']),
                float(request.form['DiabetesPedigreeFunction']),
                float(request.form['Age'])
            ]
            prediction = diabetes_model.predict([data])
            diagnosis = "The person is diabetic" if prediction[0] == 1 else "The person is not diabetic"
        except Exception as e:
            diagnosis = f"Error processing input data: {str(e)}"
    
    return render_template('diabetes.html', diagnosis=diagnosis)

# ------------------------------
# Disease Check: Heart Disease
# ------------------------------
@app.route('/heart-disease', methods=['GET', 'POST'])
def heart_disease():
    diagnosis = None
    if request.method == 'POST':
        try:
            data = [
                float(request.form['age']),
                float(request.form['sex']),
                float(request.form['cp']),
                float(request.form['trestbps']),
                float(request.form['chol']),
                float(request.form['fbs']),
                float(request.form['restecg']),
                float(request.form['thalach']),
                float(request.form['exang']),
                float(request.form['oldpeak']),
                float(request.form['slope']),
                float(request.form['ca']),
                float(request.form['thal'])
            ]
            prediction = heart_disease_model.predict([data])
            diagnosis = "The person has heart disease" if prediction[0] == 1 else "The person does not have heart disease"
        except Exception as e:
            diagnosis = f"Error processing input data: {str(e)}"
    
    return render_template('heart_disease.html', diagnosis=diagnosis)

# ------------------------------
# Disease Check: Parkinson's
# ------------------------------
@app.route('/parkinsons', methods=['GET', 'POST'])
def parkinsons():
    diagnosis = None
    if request.method == 'POST':
        try:
            data = [
                float(request.form['fo']),
                float(request.form['fhi']),
                float(request.form['flo']),
                float(request.form['Jitter_percent']),
                float(request.form['Jitter_Abs']),
                float(request.form['RAP']),
                float(request.form['PPQ']),
                float(request.form['DDP']),
                float(request.form['Shimmer']),
                float(request.form['Shimmer_dB']),
                float(request.form['APQ3']),
                float(request.form['APQ5']),
                float(request.form['APQ']),
                float(request.form['DDA']),
                float(request.form['NHR']),
                float(request.form['HNR']),
                float(request.form['RPDE']),
                float(request.form['DFA']),
                float(request.form['spread1']),
                float(request.form['spread2']),
                float(request.form['D2']),
                float(request.form['PPE'])
            ]
            prediction = parkinsons_model.predict([data])
            diagnosis = "The person has Parkinson's disease" if prediction[0] == 1 else "The person does not have Parkinson's disease"
        except Exception as e:
            diagnosis = f"Error processing input data: {str(e)}"
    
    return render_template('parkinsons.html', diagnosis=diagnosis)

# ------------------------------
# Nutrition Routes
# ------------------------------
@app.route('/nutrition')
def nutrition_page():
    """
    Renders the nutrition.html template, optionally with disease context
    via query parameters like ?disease=diabetes
    """
    disease = request.args.get('disease', None)
    return render_template('nutrition.html', disease=disease)


@app.route('/upload', methods=["POST"])
def upload_image():
    """
    Endpoint to handle image upload, OCR, and validation based on disease.
    """
    disease = request.form.get("disease", None)

    # Check if an image is provided
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400

    image = request.files["image"]
    if image.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    # Save the image
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    image_path = os.path.join(upload_dir, image.filename)
    image.save(image_path)

    # Perform OCR to extract text
    text = extract_text_from_image(image_path)

    # Parse nutrition and apply disease-specific limits
    nutrition = parse_nutritional_info(text)
    chosen_limits = get_acceptable_limits(disease)
    validation_results = validate_nutrition(nutrition, chosen_limits)

    return jsonify({
        "nutrition": nutrition,
        "validation": validation_results,
        "disease": disease
    })

# -----------------------------------------------------------------------------
# 5. Run the Application
# -----------------------------------------------------------------------------
if __name__ == '__main__':
    app.run(debug=True)
