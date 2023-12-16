// In your Express.js route (e.g., routes/predictions.js)
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/predict', async (req, res) => {
  try {
    const inputData = req.body; // Assuming the input data is sent in the request body

    // Call the Flask API for prediction
    const predictionResponse = await axios.post('http://localhost:5000/predict', inputData);

    // Return the prediction to the frontend
    res.json({ prediction: predictionResponse.data.prediction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
