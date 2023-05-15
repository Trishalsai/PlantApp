from fastapi.responses import JSONResponse
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from PIL import Image
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model

app = FastAPI()
origins = [
    "http://130.89.87.169:19000",  
    "https://localhost:3000",   
]
# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Load the deep learning model
model = load_model("tomato_new_model.h5")

# Define the class labels
class_labels = ['Tomato_Bacterial_spot','Tomato_Early_blight','Tomato_Late_blight','Tomato_Leaf_Mold','Tomato_Septoria_leaf_spot','Tomato_Spider_mites_Two_spotted_spider_mite','Tomato__Target_Spot','Tomato__Tomato_YellowLeaf__Curl_Virus','Tomato__Tomato_mosaic_virus','Tomato_healthy']
@app.post("/classify")
async def classify(file: UploadFile = File(...)):
    # Load and preprocess the image
    image = Image.open(file.file)
    image = image.resize((256, 256))  # Resize the image to the input shape of the model
    image = np.array(image) / 255.0  # Normalize pixel values
    image = np.expand_dims(image, axis=0)  # Add batch dimension

    # Predict the class label using the loaded model
    prediction = model.predict(image)
    class_index = np.argmax(prediction[0])
    class_label = class_labels[class_index]

    # Return a JSON response with the class label
    return JSONResponse(content={"result": class_label})
{
  "result": "predicted_class_label"
}
