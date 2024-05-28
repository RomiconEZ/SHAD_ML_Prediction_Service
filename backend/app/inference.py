import pandas as pd

def predict(df: pd.DataFrame) -> pd.DataFrame:
    # Implement inference logic
    # This is just a placeholder
    df['score'] = df.apply(lambda row: 0.5, axis=1)
    return df
