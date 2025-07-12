import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import classification_report, confusion_matrix
from sentence_transformers import SentenceTransformer
import numpy as np
import joblib


df = pd.read_csv("resume_cleaned.csv")


df["FullText"] = df["Resume"] + " " + df["Job_Description"]+ " " + df["Role"] 
X = df["FullText"]
y = df["Decision"]


X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Encoder avec Sentence-BERT
print("🔄 Encodage BERT en cours...")
bert_model = SentenceTransformer('all-MiniLM-L6-v2') 
X_train_vec = bert_model.encode(X_train.tolist(), convert_to_numpy=True)
X_test_vec = bert_model.encode(X_test.tolist(), convert_to_numpy=True)
print("✅ Encodage terminé.")

# 5. Définir les modèles à tester
models = {
    "Logistic Regression": LogisticRegression(max_iter=1000),
    "SVM (LinearSVC)": LinearSVC(),
    "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
    "Decision Tree": DecisionTreeClassifier(random_state=42)
}

# 6. Tester chaque modèle
best_model = None
best_score = 0

for name, model in models.items():
    print(f"\n=== 🔍 Test du modèle : {name} ===")
    model.fit(X_train_vec, y_train)
    y_pred = model.predict(X_test_vec)

    # Rapport complet
    print("📊 Rapport de classification :")
    print(classification_report(y_test, y_pred))

    # Accuracy
    report = classification_report(y_test, y_pred, output_dict=True)
    accuracy = report["accuracy"]
    print(f"✅ Accuracy : {accuracy:.4f}")

    # Matrice de confusion
    cm = confusion_matrix(y_test, y_pred)
    print("🧮 Matrice de confusion :")
    print(cm)

    # Enregistrer le meilleur modèle
    if accuracy > best_score:
        best_score = accuracy
        best_model = model
        best_model_name = name

# 7. Sauvegarde du meilleur modèle
joblib.dump(best_model, "cv_best_model_bert.pkl")
bert_model.save("bert_encoder_model")

print(f"\n🏆 Meilleur modèle : {best_model_name} avec une accuracy de {best_score:.4f}")
print("✅ Modèle et encodeur BERT sauvegardés.")
