from datasets import load_dataset
import pandas as pd

# Charger le dataset depuis Hugging Face
dataset = load_dataset("AzharAli05/Resume-Screening-Dataset")

# Convertir en DataFrame pandas (format tabulaire)
df = pd.DataFrame(dataset["train"])

# Aperçu des colonnes
print("Colonnes :", df.columns)
print(df.head(2))

import re

def clean_text(text):
    text = text.lower()
    text = re.sub(r'\s+', ' ', text)  # supprime les retours à la ligne multiples
    text = re.sub(r'[^\w\s@.+]', '', text)  # supprime les caractères spéciaux
    return text.strip()

# Appliquer le nettoyage sur les CV
df['Resume'] = df['Resume'].apply(clean_text)

# Uniformiser les labels
df['Decision'] = df['Decision'].str.strip().str.lower()

# Garder seulement les CV avec Result bien défini
df = df[df['Decision'].isin(['select', 'reject'])]

print(df.head(3))

df.to_csv("resume_cleaned.csv", index=False)
print("✅ Fichier nettoyé enregistré dans resume_cleaned.csv")

