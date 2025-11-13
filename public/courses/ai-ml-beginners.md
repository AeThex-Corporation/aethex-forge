# AI & Machine Learning Beginners

## Table of Contents

1. [Introduction to AI and ML](#introduction)
2. [Machine Learning Fundamentals](#fundamentals)
3. [Supervised Learning](#supervised)
4. [Unsupervised Learning](#unsupervised)
5. [Model Evaluation](#evaluation)
6. [Practical Implementation](#implementation)
7. [Real-World Applications](#applications)
8. [Getting Started](#getting-started)

## Introduction to AI and ML

Artificial Intelligence (AI) and Machine Learning (ML) are transforming how we solve problems. This course introduces fundamental concepts needed to understand and build ML systems.

### AI vs Machine Learning vs Deep Learning

**Artificial Intelligence**
- Broad field: machines doing tasks requiring human intelligence
- Includes robotics, natural language processing, computer vision
- Includes both rule-based and learning systems

**Machine Learning**
- Subset of AI: systems that learn from data
- No explicit programming for each case
- Improve performance with more data

**Deep Learning**
- Subset of ML: neural networks with many layers
- Powers image recognition, language models
- Requires significant computational resources

### Why Machine Learning?

Traditional programming is limited:
- Writing rules for every scenario is impractical
- Rules can't adapt to new data
- Pattern recognition is difficult for humans

Machine learning solves this:
- System learns patterns from examples
- Automatically adapts to new data
- Discovers non-obvious relationships

## Machine Learning Fundamentals

### The ML Workflow

```
1. Problem Definition
   ↓
2. Data Collection
   ↓
3. Data Preparation
   ↓
4. Model Selection
   ↓
5. Training
   ↓
6. Evaluation
   ↓
7. Deployment
   ↓
8. Monitoring
```

### Types of Learning

**Supervised Learning**
- You provide labeled examples
- System learns to predict based on examples
- Example: Email spam classification

**Unsupervised Learning**
- Data has no labels
- System finds patterns or structure
- Example: Customer segmentation

**Reinforcement Learning**
- System learns through trial and error
- Receives rewards for good actions
- Example: Game playing AI

### Training and Testing

```
Dataset
  ↓
├─→ Training Set (70%)    → Train Model
│
├─→ Validation Set (15%)  → Tune Model
│
└─→ Test Set (15%)        → Final Evaluation
```

Never test on training data!

## Supervised Learning

### Classification vs Regression

**Classification**
- Predict category (discrete output)
- Example: Dog or Cat?
- Example: Email spam (yes/no)?

**Regression**
- Predict numerical value (continuous output)
- Example: House price
- Example: Temperature tomorrow

### Decision Trees

Simple, interpretable models:

```python
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

# Load data
iris = load_iris()
X = iris.data
y = iris.target

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Create and train model
model = DecisionTreeClassifier(max_depth=5)
model.fit(X_train, y_train)

# Make predictions
predictions = model.predict(X_test)

# Evaluate
accuracy = model.score(X_test, y_test)
print(f"Accuracy: {accuracy:.2%}")
```

### Linear Models

Quick, efficient baseline models:

```python
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler

# Prepare data
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Logistic Regression (classification)
model = LogisticRegression(max_iter=1000)
model.fit(X_train_scaled, y_train)

# Predictions with probabilities
probabilities = model.predict_proba(X_test_scaled)
predictions = model.predict(X_test_scaled)
```

### Support Vector Machines (SVM)

Powerful for classification:

```python
from sklearn.svm import SVC

# Create SVM model
model = SVC(kernel='rbf', C=1.0, gamma='scale')
model.fit(X_train_scaled, y_train)

# Evaluate
accuracy = model.score(X_test_scaled, y_test)
print(f"SVM Accuracy: {accuracy:.2%}")
```

### Neural Networks

Deep learning basics:

```python
import tensorflow as tf
from tensorflow import keras

# Build model
model = keras.Sequential([
    keras.layers.Dense(128, activation='relu', input_shape=(784,)),
    keras.layers.Dropout(0.2),
    keras.layers.Dense(64, activation='relu'),
    keras.layers.Dropout(0.2),
    keras.layers.Dense(10, activation='softmax')
])

# Compile model
model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

# Train model
history = model.fit(
    X_train, y_train,
    epochs=10,
    batch_size=32,
    validation_split=0.2
)

# Evaluate
test_loss, test_accuracy = model.evaluate(X_test, y_test)
print(f"Test Accuracy: {test_accuracy:.2%}")

# Make predictions
predictions = model.predict(X_test)
```

## Unsupervised Learning

### Clustering

Grouping similar data points:

```python
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt

# K-Means clustering
kmeans = KMeans(n_clusters=3, random_state=42)
clusters = kmeans.fit_predict(X)

# Visualize
plt.scatter(X[:, 0], X[:, 1], c=clusters, cmap='viridis')
plt.scatter(
    kmeans.cluster_centers_[:, 0],
    kmeans.cluster_centers_[:, 1],
    marker='X',
    s=200,
    c='red'
)
plt.title('K-Means Clustering')
plt.show()
```

### Dimensionality Reduction

Reducing features while preserving information:

```python
from sklearn.decomposition import PCA

# Principal Component Analysis
pca = PCA(n_components=2)
X_reduced = pca.fit_transform(X)

# Explained variance
print(f"Explained variance ratio: {pca.explained_variance_ratio_}")

# Visualize
plt.scatter(X_reduced[:, 0], X_reduced[:, 1], c=y, cmap='viridis')
plt.xlabel(f'PC1 ({pca.explained_variance_ratio_[0]:.1%})')
plt.ylabel(f'PC2 ({pca.explained_variance_ratio_[1]:.1%})')
plt.title('PCA Visualization')
plt.show()
```

### Anomaly Detection

Finding unusual patterns:

```python
from sklearn.ensemble import IsolationForest

# Isolation Forest for anomaly detection
model = IsolationForest(contamination=0.1)
anomalies = model.fit_predict(X)

# -1 indicates anomaly, 1 indicates normal
anomaly_count = (anomalies == -1).sum()
print(f"Anomalies detected: {anomaly_count}")
```

## Model Evaluation

### Metrics for Classification

```python
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, confusion_matrix, roc_auc_score, roc_curve
)

y_pred = model.predict(X_test)

# Basic metrics
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)

print(f"Accuracy:  {accuracy:.2%}")
print(f"Precision: {precision:.2%}")
print(f"Recall:    {recall:.2%}")
print(f"F1 Score:  {f1:.2%}")

# Confusion matrix
cm = confusion_matrix(y_test, y_pred)
print("Confusion Matrix:")
print(cm)
```

### Metrics for Regression

```python
from sklearn.metrics import (
    mean_squared_error, mean_absolute_error, r2_score
)

y_pred = model.predict(X_test)

# Regression metrics
mse = mean_squared_error(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)
rmse = mse ** 0.5
r2 = r2_score(y_test, y_pred)

print(f"Mean Squared Error: {mse:.4f}")
print(f"Root Mean Squared Error: {rmse:.4f}")
print(f"Mean Absolute Error: {mae:.4f}")
print(f"R² Score: {r2:.4f}")
```

### Cross-Validation

Better evaluation of model performance:

```python
from sklearn.model_selection import cross_val_score, KFold

# K-Fold Cross-Validation
kfold = KFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(model, X_train, y_train, cv=kfold, scoring='accuracy')

print(f"Cross-validation scores: {scores}")
print(f"Mean CV Score: {scores.mean():.2%}")
print(f"Std Dev: {scores.std():.4f}")
```

## Practical Implementation

### Complete ML Pipeline

```python
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

# Load data
df = pd.read_csv('data.csv')

# Handle missing values
df = df.dropna()

# Separate features and target
X = df.drop('target', axis=1)
y = df['target']

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Create pipeline
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('classifier', RandomForestClassifier(n_estimators=100))
])

# Train
pipeline.fit(X_train, y_train)

# Evaluate
predictions = pipeline.predict(X_test)
print(classification_report(y_test, predictions))
```

### Hyperparameter Tuning

Finding optimal parameters:

```python
from sklearn.model_selection import GridSearchCV

# Define parameter grid
param_grid = {
    'max_depth': [5, 10, 20],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4],
    'n_estimators': [50, 100, 200]
}

# Grid search
grid_search = GridSearchCV(
    RandomForestClassifier(),
    param_grid,
    cv=5,
    n_jobs=-1
)

grid_search.fit(X_train, y_train)

print(f"Best parameters: {grid_search.best_params_}")
print(f"Best CV score: {grid_search.best_score_:.2%}")

# Use best model
best_model = grid_search.best_estimator_
accuracy = best_model.score(X_test, y_test)
print(f"Test accuracy: {accuracy:.2%}")
```

## Real-World Applications

### Fraud Detection

```python
# Detect fraudulent transactions
from sklearn.ensemble import IsolationForest

# Train on historical data (mostly non-fraud)
model = IsolationForest(contamination=0.05)
model.fit(historical_transactions)

# Detect fraud in new transactions
predictions = model.predict(new_transactions)
fraud_mask = predictions == -1
flagged_transactions = new_transactions[fraud_mask]
```

### Recommendation Systems

```python
from sklearn.neighbors import NearestNeighbors

# Find similar users
model = NearestNeighbors(n_neighbors=5)
model.fit(user_features)

# Find neighbors for a user
distances, indices = model.kneighbors(target_user)

# Recommend items liked by similar users
recommendations = items[indices].mean(axis=0)
```

### Sentiment Analysis

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB

# Vectorize text
vectorizer = TfidfVectorizer(max_features=1000)
X = vectorizer.fit_transform(texts)

# Train classifier
classifier = MultinomialNB()
classifier.fit(X, sentiments)

# Predict sentiment of new text
new_text_vector = vectorizer.transform(new_texts)
sentiments = classifier.predict(new_text_vector)
```

## Getting Started

### Essential Libraries

```python
# Data manipulation
pip install pandas numpy

# Machine Learning
pip install scikit-learn

# Deep Learning
pip install tensorflow keras torch

# Visualization
pip install matplotlib seaborn

# Jupyter for experimentation
pip install jupyter
```

### Learning Path

1. **Understand the fundamentals**: Variables, data types, control flow
2. **Learn data preprocessing**: Cleaning, normalization, feature engineering
3. **Implement simple models**: Decision trees, linear models
4. **Understand evaluation**: Metrics, validation strategies
5. **Explore complex models**: Ensemble methods, neural networks
6. **Work on projects**: Compete on Kaggle, contribute to open source

### Resources

- **Kaggle**: Datasets and competitions to practice
- **Papers with Code**: Latest research implementations
- **Fast.ai**: Practical deep learning courses
- **Google Colab**: Free GPU for experimentation
- **Scikit-learn documentation**: Comprehensive API reference

## Conclusion

Machine learning is a powerful tool for solving complex problems. Master these fundamentals and you'll have the foundation to explore advanced topics like deep learning, reinforcement learning, and specialized applications.

Start small with simple datasets, understand each component deeply, and gradually take on more complex challenges. The field rewards both theoretical understanding and practical experience.
