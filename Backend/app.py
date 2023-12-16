from flask import Flask, request, jsonify
import joblib as joblib

app = Flask(helpdesk)

# Load your pre-trained model
model = joblib.load('trainedmodel.joblib')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Assuming input features are sent in JSON format
        input_data = request.json
        prediction = model.predict([input_data['feature']])
        return jsonify({'prediction': prediction[0]})
    except Exception as e:
        print(e)
        return jsonify({'error': 'Internal Server Error'}), 500

if __name__ == '__main__':
    app.run(port=5000)
