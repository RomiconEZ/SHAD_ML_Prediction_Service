import pandas as pd


def preprocess(df: pd.DataFrame) -> (pd.DataFrame, pd.DataFrame):
    # Implement preprocessing logic
    filtered_features = [
        "секретный_скор",
        "объем_данных",
        "on_net",
        "продукт_1",
        "частота",
        "сумма",
        "продукт_2",
        "частота_пополнения",
        "pack_freq",
        "сегмент_arpu",
    ]
    return df[filtered_features]
