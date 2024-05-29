import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns

plt.set_loglevel("WARNING")
plt.style.use("ggplot")


def create_plot_distribution_of_predictions(preds, density_plot_path):
    """
    Plot distribution of predictions and save to specified path.

    Args:
        preds (list): List of predictions.
        density_plot_path (str): Path to save the density plot.

    Returns:
        None
    """
    plt.figure(figsize=(10, 6))
    unique, counts = np.unique(np.array(preds), return_counts=True)

    sns.barplot(
        x=unique, y=counts, width=0.3, color="#57c78d", label="Actual Predictions"
    )

    plt.xlabel("Prediction Value")
    plt.ylabel("Count")
    plt.title("Distribution of Predictions")

    # Annotate each bar with the count value
    for i, count in enumerate(counts):
        plt.text(i, count + 0.5, str(count), ha="center", va="bottom")

    plt.legend(loc="upper right")
    plt.grid(True)
    plt.savefig(density_plot_path)
    plt.close()
