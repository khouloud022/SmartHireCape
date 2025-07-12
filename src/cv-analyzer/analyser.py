from flask import Flask, request, jsonify
import requests
import fitz  # PyMuPDF
from flask_cors import CORS
import re

import spacy
from sentence_transformers import SentenceTransformer, util

app = Flask(__name__)
CORS(app)

# Charger le modèle BERT pour l'encodage sémantique
bert_model = SentenceTransformer('all-MiniLM-L6-v2')

# Charger modèle NER (anglais par défaut)
nlp = spacy.load("en_core_web_sm")


def extract_named_entities(text):
    doc = nlp(text)
    entities = [ent.text for ent in doc.ents if ent.label_ in ["ORG", "PERSON", "GPE", "SKILL", "WORK_OF_ART", "LANGUAGE", "PRODUCT"]]
    return list(set(entities))  # Supprimer les doublons


@app.route('/analyse', methods=['POST'])
def analyse():
    data = request.get_json()
    poste = data.get("poste", "").lower()
    cv_url = data.get("cvUrl")

    try:
        print("Analyse du poste :", poste)
        print("URL du CV :", cv_url)

        # 1. Télécharger le CV
        r = requests.get(cv_url)
        if r.status_code != 200:
            raise Exception(f"Téléchargement échoué : code {r.status_code}")
        with open("cv_temp.pdf", "wb") as f:
            f.write(r.content)

        # 2. Extraire le texte du PDF
        doc = fitz.open("cv_temp.pdf")
        cv_text = "".join([page.get_text() for page in doc])

        # 3. Extraction NER 
        ner_entities = extract_named_entities(cv_text)
        print("Entités NER trouvées :", ner_entities)

        # 4. Vectorisation BERT
        cv_embedding = bert_model.encode(cv_text, convert_to_tensor=True)
        job_embedding = bert_model.encode(poste, convert_to_tensor=True)

        # 5. Calcul de la similarité cosinus
        similarity = util.pytorch_cos_sim(cv_embedding, job_embedding).item()
        score = round(similarity * 100, 2)

        return jsonify({
            "score": score,
            "message": f"Score de correspondance : {score}%",
            "extraitsNER": ner_entities[:10],  # premiers éléments
            "extraitCV": cv_text[:500]
        })

    except Exception as e:
        print("Erreur :", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
