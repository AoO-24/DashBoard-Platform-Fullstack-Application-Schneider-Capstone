import pandas as pd
import matplotlib.pyplot as plt

# Create a DataFrame from the provided data
data = {
    "Service Date": ["2024-04-10", "2024-02-17", "2024-01-01", "2023-11-15"],
    "Cost of Parts": [120, 800, 950, 135],
    "Labor Cost": [200, 300, 350, 100],
    "Total Service Cost": [450, 1100, 1300, 400]  # Adjusted based on the apparent typo in the input
}

df = pd.DataFrame(data)
df["Service Date"] = pd.to_datetime(df["Service Date"])  # Convert dates for better plotting

# Plotting the data
fig, ax = plt.subplots(figsize=(10, 6))
df.set_index("Service Date").plot(kind='bar', ax=ax)
plt.title("Service Costs Over Time")
plt.ylabel("Cost in $")
plt.xlabel("Service Date")
plt.xticks(rotation=45)
plt.legend(title="Cost Type")
plt.tight_layout()
plt.show()
