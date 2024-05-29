import lleaves
import pandas as pd

llvm_model = lleaves.Model(model_file="model.txt")
llvm_model.compile(use_fp64=False, fblocksize=llvm_model.num_trees())


def predict(df: pd.DataFrame) -> pd.DataFrame:
    prediction = (llvm_model.predict(df, n_jobs=1) >= 0.5).astype(int)
    predictions_df = pd.DataFrame({"client_id": df.index, "preds": prediction})

    return predictions_df
