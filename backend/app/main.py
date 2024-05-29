import asyncio
import json
import logging
import os
import shutil
from datetime import datetime
from uuid import uuid4

import pandas as pd
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import FileResponse, JSONResponse
from feature_importance import get_dict_feature_importance
from inference import predict
from middleware import setup_cors
from plot import create_plot_distribution_of_predictions
from preprocessing import preprocess

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Применение CORS middleware
setup_cors(app)

UPLOAD_DIR = "uploaded_files"

# Ensure the upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)


async def remove_file_after_delay(file_path: str, delay: int = 1800):
    """Remove a file after a specified delay (in seconds)."""
    await asyncio.sleep(delay)
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            logger.info(f"Removed file: {file_path}")
    except Exception as e:
        logger.error(f"Error removing file: {file_path}. Error: {str(e)}")


@app.post("/uploadfile/")
async def upload_file(file: UploadFile = File(...)):
    unique_filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid4()}.csv"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    logger.info("Received file for upload: %s", file.filename)
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        df = pd.read_csv(file_path, index_col="client_id")
        logger.info("File read into DataFrame with shape: %s", df.shape)

        df = preprocess(df)
        logger.info("Data preprocessed with shape: %s", df.shape)

        predictions = predict(df)
        logger.info("Inference completed. Predictions shape: %s", predictions.shape)

        processed_file_name = f"submission_{unique_filename}"
        processed_file_path = os.path.join(UPLOAD_DIR, processed_file_name)
        predictions.to_csv(processed_file_path, index=False)
        logger.info("Predictions saved to: %s", processed_file_path)

        # Create density plot
        density_plot_name = f"density_plot_{unique_filename}.png"
        density_plot_path = os.path.join(UPLOAD_DIR, density_plot_name)
        create_plot_distribution_of_predictions(predictions["preds"], density_plot_path)
        logger.info("Density plot saved to: %s", density_plot_path)

        # Get top-5 feature importances
        feature_importance = get_dict_feature_importance()
        feature_importance_name = f"feature_importance_{unique_filename}.json"
        feature_importance_path = os.path.join(UPLOAD_DIR, feature_importance_name)
        with open(feature_importance_path, "w", encoding="utf-8") as f:
            json.dump(feature_importance, f, ensure_ascii=False)
        logger.info("Top-5 feature importances saved to: %s", feature_importance_path)

        # Schedule file deletion after 30 minutes
        asyncio.create_task(remove_file_after_delay(file_path))
        asyncio.create_task(remove_file_after_delay(processed_file_path))
        asyncio.create_task(remove_file_after_delay(density_plot_path))
        asyncio.create_task(remove_file_after_delay(feature_importance_path))

        return JSONResponse(
            content={
                "message": "File processed successfully.",
                "processed_file": processed_file_name,
                "density_plot": density_plot_name,
                "feature_importance": feature_importance_name,
            }
        )
    except Exception as e:
        logger.error("Error processing file: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/download/{filename}")
async def download_file(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    else:
        raise HTTPException(status_code=404, detail="File not found")
