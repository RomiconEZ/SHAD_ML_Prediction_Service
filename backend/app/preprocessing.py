import pandas as pd


def preprocess(df: pd.DataFrame) -> (pd.DataFrame, pd.DataFrame):
    # Implement preprocessing logic
    target = ["binary_target"]
    features2drop = [
        "mrg_",
        "регион",
        "использование",
        "pack",
        "доход",
        "зона_2",
        "зона_1",
    ]
    filtered_features = [
        i for i in df.columns if (i not in target and i not in features2drop)
    ]
    return df[filtered_features]
