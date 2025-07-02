# analyse_api.py
from flask import Flask, request, jsonify
import requests
import fitz  
from flask_cors import CORS

import re

app = Flask(__name__)
CORS(app)

@app.route('/analyse', methods=['POST'])
def analyse():
    data = request.get_json()
    poste = data.get("poste", "").lower()
    cv_url = data.get("cvUrl")

    try:
        # Télécharger le CV
        r = requests.get(cv_url)
        with open("cv_temp.pdf", "wb") as f:
            f.write(r.content)

        # Extraire texte
        doc = fitz.open("cv_temp.pdf")
        text = "".join([page.get_text() for page in doc])

        # Matching simple par mots-clés
        score = 0
        for keyword in poste.split():
            if keyword in text.lower():
                score += 25 

        return jsonify({"score": min(score, 100)})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000)
