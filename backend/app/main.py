import logging
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse, JSONResponse
import pandas as pd
import os
import matplotlib.pyplot as plt
import seaborn as sns
import json

from preprocessing import preprocess
from inference import predict
from feature_importance import get_feature_importance
from middleware import setup_cors

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Применение CORS middleware
setup_cors(app)


@app.post("/uploadfile/")
async def upload_file(file: UploadFile = File(...)):
    logger.info("Received file for upload: %s", file.filename)
    try:
        df = pd.read_csv(file.file)
        logger.info("File read into DataFrame with shape: %s", df.shape)

        processed_df = preprocess(df)
        logger.info("Data preprocessed with shape: %s", processed_df.shape)

        predictions = predict(processed_df)
        logger.info("Inference completed. Predictions shape: %s", predictions.shape)

        processed_file_path = "processed_sample_submission.csv"
        predictions.to_csv(processed_file_path, index=False)
        logger.info("Predictions saved to: %s", processed_file_path)

        # Create density plot
        plt.figure(figsize=(10, 6))
        sns.kdeplot(predictions['score'], fill=True, warn_singular=False)
        density_plot_path = "density_plot.png"
        plt.savefig(density_plot_path)
        logger.info("Density plot saved to: %s", density_plot_path)

        # Get top-5 feature importances
        feature_importance = get_feature_importance()
        top_5_features = dict(sorted(feature_importance.items(), key=lambda item: item[1], reverse=True)[:5])
        feature_importance_path = "feature_importance.json"
        with open(feature_importance_path, "w") as f:
            json.dump(top_5_features, f)
        logger.info("Top-5 feature importances saved to: %s", feature_importance_path)

        return JSONResponse(content={
            "message": "File processed successfully.",
            "processed_file": processed_file_path,
            "density_plot": density_plot_path,
            "feature_importance": feature_importance_path
        })
    except Exception as e:
        logger.error("Error processing file: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/download/{filename}")
async def download_file(filename: str):
    return FileResponse(filename)
