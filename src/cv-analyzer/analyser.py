from flask import Flask, request, jsonify
import requests
import fitz  # PyMuPDF
from flask_cors import CORS
from datetime import datetime
import re
import spacy
from langdetect import detect
from sentence_transformers import SentenceTransformer, util
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.model_selection import train_test_split
import numpy as np
import os
import tempfile
from dateutil import parser

app = Flask(__name__)
CORS(app)

bert_model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

spacy_models = {
    "en": spacy.load("en_core_web_sm"),
    "fr": spacy.load("fr_core_news_md")
}

hard_skills = set(skill.lower() for skill in """Java,JavaScript,Python, C++ , C# , CSS , SQL , R , HTML , ML ,Machine Learning,Keycloak, ORM ,
Angular,jQuery,React,Backbone, Ember , Vue.js , Vue , Express.js,Node.js,Python, Scala ,
 GitHub, Git ,Spring,Spring boot,PHP,Tailwind,Digital Marketing,Figma,Photoshop,
Adobe Illustrator,Canva,Blockchain,Truffle,Ganache,.NET,LinkedIn,Facebook,
Instagram,gestion de contenu optimisé,copywriting,Next.js,TypeScript,GraphQL,
 MySQL ,MongoDB,PostgreSQL,SQLite, Oracle,Server,Redis,Cassandra,DynamoDB,Docker,
Kubernetes,Jenkins,GitLab CI/CD,Travis CI,AWS,Azure,Google Cloud Platform,GCP,
Terraform,Ansible,Bash Scripting,Heroku,Firebase,Netlify,Vercel,Django,Flask,
Ruby on Rails,Laravel,REST API, Go , Rust ,Kotlin,OAuth2, JWT , SSO ,Android, iOS ,Swift,
React Native,Flutter,Xamarin,Pandas,NumPy,Scikit-learn,TensorFlow,PyTorch,
Apache Spark,Power BI,Tableau,Linux,Deep Learning,AutoCAD, CAM ,Matlab,
Manufacturing Engineering,Quality Control,Thermal Engineering,Heat Transfer,
Machine Design,Fluid Mechanics,GD&T,Engineering Drawings,Blueprint reading,
Product Design,FEA Analysis,Project Management,Marketing,Business Analysis,
Sales,Finance,Consulting,Market Research,Graphic Design,Content Writing,
UI/UX Design,Video Production, SEO ,Social Media Marketing,Patient Care,
Medical Research,Healthcare Administration,Medical Technology,Anatomy,
Physiology,Pharmacology,Cybersecurity,Web Development,Software Development,
Database Management,Infrastructure as Code,Networking,Neural Networks,
Computer Vision,Natural Language Processing,Statistics,Data Visualization,
Data Analysis,Agile Methodologies,Visual Communication,Branding,Copywriting,
Wireframing,Prototyping,User Research,Interaction Design,PPC Advertising,
Email Marketing,Healthcare Management,Healthcare Policy,Healthcare Finance,
Medical Terminology,Clinical Procedures,Vital Signs,Electronic Health Records,
Lean Manufacturing,Six Sigma,Production Planning,Supply Chain Management,
ISO Standards,Statistical Process Control,Inspection,Testing,Requirements Gathering,
Process Improvement,Eclipse,NetBeans,Adobe Dreamweaver,Visual Studio,BigQuery,
Snowflake,Microsoft SQL,Bootstrap""".split(','))

training_data = [
    # EXPERIENCE (20)
    ("Développeur backend chez IBM pendant 3 ans", "EXPERIENCE"),
    ("Stage de 6 mois chez Orange en développement mobile", "EXPERIENCE"),
    ("Chef de projet chez Capgemini durant 2 ans", "EXPERIENCE"),
    ("Ingénieur logiciel chez Atos pendant 4 ans", "EXPERIENCE"),
    ("Consultant technique chez Deloitte", "EXPERIENCE"),
    ("Développeur web freelance depuis 2019", "EXPERIENCE"),
    ("Responsable produit chez Airbus", "EXPERIENCE"),
    ("Data analyst chez BNP Paribas pendant 1 an", "EXPERIENCE"),
    ("Développeur React chez Amazon", "EXPERIENCE"),
    ("Analyste développeur chez Crédit Agricole", "EXPERIENCE"),
    ("Stage en cybersécurité chez Thalès", "EXPERIENCE"),
    ("Ingénieur DevOps chez OVH", "EXPERIENCE"),
    ("Développeur Python chez Ubisoft", "EXPERIENCE"),
    ("Administrateur systèmes chez HP", "EXPERIENCE"),
    ("Développeur fullstack chez Socotec", "EXPERIENCE"),
    ("Support IT chez Veolia", "EXPERIENCE"),
    ("Développeur mobile chez Ubisoft", "EXPERIENCE"),
    ("Alternance en développement web chez L'Oréal", "EXPERIENCE"),
    ("Stage chez Whitecape Technologies", "EXPERIENCE"),
    ("Développeur logiciel chez Ericsson", "EXPERIENCE"),
    # EDUCATION (20)
    ("Licence en informatique à l’Université de Tunis", "EDUCATION"),
    ("Diplôme d’ingénieur en intelligence artificielle", "EDUCATION"),
    ("Master en Data Science", "EDUCATION"),
    ("Formation en développement web à OpenClassrooms", "EDUCATION"),
    ("Baccalauréat scientifique", "EDUCATION"),
    ("Cycle préparatoire en mathématiques-physique", "EDUCATION"),
    ("Master professionnel en cybersécurité", "EDUCATION"),
    ("Diplôme BTS SIO", "EDUCATION"),
    ("Doctorat en informatique", "EDUCATION"),
    ("Certification Google Cloud Architect", "EDUCATION"),
    ("Diplôme d’ingénieur logiciel ENSI", "EDUCATION"),
    ("Formation Udemy sur React.js", "EDUCATION"),
    ("Licence en systèmes embarqués", "EDUCATION"),
    ("Master 2 en IA à l’UPMC", "EDUCATION"),
    ("Formation AWS Certified Developer", "EDUCATION"),
    ("Diplôme en réseau informatique", "EDUCATION"),
    ("Cours de spécialisation NLP", "EDUCATION"),
    ("Formation Microsoft Azure", "EDUCATION"),
    ("Bootcamp Le Wagon - Développement Web", "EDUCATION"),
    ("Certification Machine Learning Stanford", "EDUCATION"),
    # PROJECT (15)
    ("Développement d'une plateforme e-commerce", "PROJECT"),
    ("Création d’un chatbot RH avec Python", "PROJECT"),
    ("Conception d'une application mobile de santé", "PROJECT"),
    ("Réalisation d’un système de recommandation de films", "PROJECT"),
    ("Application web de gestion de stock", "PROJECT"),
    ("Détection de fraudes par machine learning", "PROJECT"),
    ("Projet de fin d’études : application météo connectée", "PROJECT"),
    ("Plateforme collaborative pour étudiants", "PROJECT"),
    ("Jeu mobile en React Native", "PROJECT"),
    ("Bot de trading automatique", "PROJECT"),
    ("Développement d’un portfolio en React", "PROJECT"),
    ("Création d’un système de notes scolaires", "PROJECT"),
    ("Application de reconnaissance faciale", "PROJECT"),
    ("Site web pour association humanitaire", "PROJECT"),
    ("Outil de visualisation de données avec D3.js", "PROJECT"),
    ("Création d’un outil de reporting avec Power BI", "PROJECT"),
    ("Développement d’un simulateur d'entretien d'embauche", "PROJECT"),
    ("Intégration API météo dans une application mobile", "PROJECT"),
    ("Conception d'un projet étudiant de reconnaissance d’images", "PROJECT"),
    ("Hackathon sur l’environnement : application mobile réalisée", "PROJECT"),
    ("Travail personnel : création d’un site de recettes", "PROJECT"),
    # SKILL (15)
    ("Python, Java, C++", "SKILL"),
    ("React.js, Vue.js, Angular", "SKILL"),
    ("SQL, MongoDB, PostgreSQL", "SKILL"),
    ("Docker, Kubernetes, Jenkins", "SKILL"),
    ("Git, GitHub, GitLab", "SKILL"),
    ("Spring Boot, Hibernate", "SKILL"),
    ("TensorFlow, PyTorch", "SKILL"),
    ("Figma, Adobe XD", "SKILL"),
    ("Node.js, Express.js", "SKILL"),
    ("Bash, Linux", "SKILL"),
    ("AWS, GCP, Azure", "SKILL"),
    ("HTML, CSS, JavaScript", "SKILL"),
    ("FastAPI, Flask, Django", "SKILL"),
    ("NLP, Computer Vision", "SKILL"),
    ("CI/CD, DevOps", "SKILL"),
    # OTHER (10)
    ("Je suis rigoureux et autonome", "OTHER"),
    ("Capacité d'adaptation rapide", "OTHER"),
    ("Travail en équipe apprécié", "OTHER"),
    ("Motivé à apprendre et évoluer", "OTHER"),
    ("Bonne communication orale et écrite", "OTHER"),
    ("Volontaire et engagé", "OTHER"),
    ("Disponible immédiatement", "OTHER"),
    ("Permis de conduire catégorie B", "OTHER"),
    ("Mobilité nationale et internationale", "OTHER"),
    ("Anglais courant", "OTHER"),
    ("Je suis dynamique et autonome", "OTHER"),
    ("Excellente capacité de gestion du stress", "OTHER"),
    ("Passionné par les nouvelles technologies", "OTHER"),
    ("Connaissance de Git, GitHub, GitLab", "SKILL"),
    ("Compétences solides en FastAPI et Flask", "SKILL")
]
sentences = [x[0] for x in training_data]
labels = [x[1] for x in training_data]
# Étape 2 : encodage BERT
X = bert_model.encode(sentences)
y = labels
# Étape 3 : séparation train/test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
# Étape 4 : entraînement du modèle
section_classifier = LogisticRegression(max_iter=1000, random_state=42)
section_classifier.fit(X_train, y_train)
# Étape 5 : prédiction
y_pred = section_classifier.predict(X_test)
# Étape 6 : évaluation
print("Rapport de classification :")
print(classification_report(y_test, y_pred))
print("Matrice de confusion :")
print(confusion_matrix(y_test, y_pred))


def detect_language(text):
    try:
        return detect(text)
    except:
        return "en"


def extract_named_entities(text):
    lang = detect_language(text)
    nlp = spacy_models.get(lang, spacy_models["en"])
    doc = nlp(text)
    labels = ["PERSON", "ORG", "GPE", "LOC", "PRODUCT", "LANGUAGE", "WORK_OF_ART", "EVENT", "DATE", "TIME", "MONEY", "PERCENT"]
    return [{"text": ent.text, "label": ent.label_, "description": spacy.explain(ent.label_)} for ent in doc.ents if ent.label_ in labels]


def extract_experience_phrases(text):
    lang = detect_language(text)
    nlp = spacy_models.get(lang, spacy_models["en"])
    doc = nlp(text)
    sentences = [sent.text.strip() for sent in doc.sents if len(sent.text.strip()) > 10]
    patterns = [
        r"(plus de|environ|près de|au moins|quelques|une|un|\d+|deux|trois|cinq)\s*(ans?|années?)\s+d'expérience",
        r"(\d+|une|deux|trois|cinq)\s+(years?|ans?)\s+(of\s+)?(experience|expérience)"
    ]
    matched = []
    for sent in sentences:
        for pat in patterns:
            if re.search(pat, sent, re.IGNORECASE):
                matched.append(sent)
                break
    return list(set(matched))


def extract_custom_entities(text):
    emails = re.findall(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text)
    phones = re.findall(r"(\+?\d[\d\s\-.]{8,})", text)
    skills = [skill for skill in hard_skills if skill in text.lower()]
    degree_patterns = [
        r"(licence|bachelor|license)\s+[^\n]*", r"(master|maîtrise|m\.sc|msc)\s+[^\n]*",
        r"(engineering cycle|cycle ingénieur|ingénieur)\s+[^\n]*", r"(doctorat|phd|ph\.d|doctorate)\s+[^\n]*",
        r"(bac\+3|bac\+5|bac\+8)\s+[^\n]*", r"(diploma|diplôme)\s+[^\n]*", r"(degree|degré)\s+in\s+[^\n]*"
    ]
    degrees = []
    for pat in degree_patterns:
        degrees.extend(re.findall(pat, text, re.IGNORECASE))
    experiences = extract_experience_phrases(text)
    return {
        "emails": emails,
        "phones": phones,
        "skills": skills,
        "degrees": degrees,
        "experiences": experiences
    }

def estimate_total_experience_years(text):
    now = datetime.now()
    total_months = 0

    # Normalisation du texte
    text = text.lower()

    # Expression 1 : périodes avec deux années (2018 à 2021)
    matches = re.findall(r'(\d{4})\s*(?:-|à|to)\s*(\d{4})', text)
    for start, end in matches:
        try:
            start, end = int(start), int(end)
            if 1900 < start <= end <= now.year:
                total_months += (end - start) * 12
        except:
            pass

    # Expression 2 : "depuis 2019"
    matches = re.findall(r'depuis\s+(\d{4})', text)
    for start in matches:
        try:
            start = int(start)
            if 1900 < start <= now.year:
                total_months += (now.year - start) * 12
        except:
            pass

    # Expression 3 : X ans / années / mois d'expérience
    matches = re.findall(r'(\d+)\s*(ans?|années?|mois)', text)
    for number, unit in matches:
        number = int(number)
        if "mois" in unit:
            total_months += number
        else:
            total_months += number * 12

    # Expression 4 : "pendant 3 ans", "for 2 years"
    matches = re.findall(r'(?:pendant|for)\s+(\d+)\s*(ans?|années?|mois)', text)
    for number, unit in matches:
        number = int(number)
        if "mois" in unit:
            total_months += number
        else:
            total_months += number * 12

    return round(total_months / 12, 2)

def estimate_experience_from_sections(sections):
    now = datetime.now()
    total_months = 0

    # Expressions couvrant plusieurs cas, y compris :
    # - "2022 Aug – 2023 Jun"
    # - "Mai 2023 - Aujourd’hui"
    # - "Août 2021"
    patterns = [
        r'(\w+\s+\d{4})\s*(?:–|-|to|à)?\s*(\w+\s+\d{4}|present|aujourd’hui)?',
        r'(\d{4})\s*(?:–|-|to|à)?\s*(\d{4}|present|aujourd’hui)?'
    ]

    for s in sections:
        if s["section"] == "EXPERIENCE":
            phrase = s["phrase"].lower()
            for pattern in patterns:
                matches = re.findall(pattern, phrase, re.IGNORECASE)
                for start_str, end_str in matches:
                    try:
                        phrase = phrase.replace("aujourd’hui", "present").replace("Aujourd’hui", "present")
                        start_date = parser.parse(start_str, fuzzy=True, default=datetime(1900, 1, 1))
                        end_date = parser.parse(end_str, fuzzy=True, default=now) if end_str else now
                        if "present" in end_str or "aujourd" in end_str:
                            end_date = now
                        if start_date < end_date:
                            delta = (end_date.year - start_date.year) * 12 + (end_date.month - start_date.month)
                            total_months += delta
                    except Exception:
                        continue

    return round(total_months / 12, 2)


def classify_cv_sections(cv_text):
    lang = detect_language(cv_text)
    nlp = spacy_models.get(lang, spacy_models["en"])
    doc = nlp(cv_text)
    result = []
    for sent in doc.sents:
        text = sent.text.strip()
        if len(text) < 5:
            continue
        vec = bert_model.encode([text])
        label = section_classifier.predict(vec)[0]
        confidence = max(section_classifier.predict_proba(vec)[0])
        result.append({
            "phrase": text,
            "section": label,
            "confidence": round(confidence, 3)
        })
    return result


def calculate_profile_score(word_count, sentence_count, skills_count, experience_years):
    score = 0
    score += 25 if word_count >= 300 else (word_count / 300) * 25
    score += 35 if skills_count >= 8 else (skills_count / 8) * 35
    score += 40 if experience_years >= 5 else (experience_years / 5) * 40
    return round(min(score, 100), 2)


@app.route('/analyse', methods=['POST'])
def analyse():
    data = request.get_json()
    poste = data.get("poste", "").lower()
    cv_url = data.get("cvUrl")

    try:
        r = requests.get(cv_url, timeout=30)
        if r.status_code != 200:
            raise Exception(f"Téléchargement échoué : code {r.status_code}")
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            temp_file.write(r.content)
            temp_path = temp_file.name

        try:
            doc = fitz.open(temp_path)
            cv_text = "".join([page.get_text() for page in doc])
            doc.close()
        finally:
            os.unlink(temp_path)

        if not cv_text.strip():
            raise Exception("Impossible d'extraire le texte du PDF")

        lang = detect_language(cv_text)
        nlp = spacy_models.get(lang, spacy_models["en"])
        doc = nlp(cv_text)

        # Analyse
        ner_entities = extract_named_entities(cv_text)
        custom_entities = extract_custom_entities(cv_text)
        sections = classify_cv_sections(cv_text)

        word_count = len(cv_text.split())
        sentence_count = len(list(doc.sents))
        skills_count = len(custom_entities["skills"])
        experience_years = estimate_experience_from_sections(sections)
        profile_score = calculate_profile_score(word_count, sentence_count, skills_count, experience_years)

        if poste.strip():
         print("\n--- Calcul du score de correspondance (via matching des compétences) ---")
         poste_lower = poste.lower()
         poste_skills = [skill for skill in hard_skills if skill in poste_lower]
         print(f"\nCompétences extraites du poste ({len(poste_skills)}): {poste_skills}")

         cv_skills = custom_entities["skills"]
         print(f"Compétences extraites du CV ({len(cv_skills)}): {cv_skills}")

         matching_skills = list(set(poste_skills) & set(cv_skills))
         print(f"Compétences en commun ({len(matching_skills)}): {matching_skills}")

         if poste_skills:
            skills_score = round((len(matching_skills) / len(poste_skills)) * 100, 2)
         else:
            skills_score = 0
            print(f"Score de compétences = {skills_score}%")

         # --- Score d'expérience ---
         experience_years = estimate_total_experience_years(cv_text)
         experience_score = min(experience_years / 10, 1.0) * 100
         print(f"Nombre d'expériences détectées = {experience_years}")
         print(f"Score d'expérience = {experience_score}% (sur 10 expériences max)")

    # --- Similarité BERT ---
         useful_phrases = [s["phrase"] for s in sections if s["section"] in ["SKILL", "EXPERIENCE", "PROJECT"]]
         job_embedding = bert_model.encode(poste, convert_to_tensor=True)

         if useful_phrases:
           print(f"Nombre de phrases utiles détectées pour la similarité sémantique : {len(useful_phrases)}")
           phrase_embeddings = bert_model.encode(useful_phrases, convert_to_tensor=True)
           similarities = util.pytorch_cos_sim(phrase_embeddings, job_embedding)
           mean_similarity = similarities.mean().item()
           semantic_score = round(mean_similarity * 100, 2)
         else:
           cv_embedding = bert_model.encode(cv_text, convert_to_tensor=True)
           similarity = util.pytorch_cos_sim(cv_embedding, job_embedding).item()
           semantic_score = round(similarity * 100, 2)
           print(f"Score de similarité sémantique = {semantic_score}%")

    # --- Score global ---
         final_score = round(0.4 * skills_score + 0.4 * experience_score + 0.2 * semantic_score, 2)
         print(f"Score global final = {final_score}%")

        else:
         final_score = 0
         print("Aucun poste fourni pour la comparaison.")


        return jsonify({
            "score": final_score,
            "details_score": {
              "skills_score": skills_score,
              "experience_score": experience_score,
              "semantic_score": semantic_score
              },
            "message": f"Score de correspondance avec le poste : {final_score}%",
            "profil": {
                "langue": lang,
                "word_count": word_count,
                "sentence_count": sentence_count,
                "skills_count": skills_count,
                "experience_years": experience_years,
                "profile_score": profile_score
            },
            "extraitsNER": ner_entities,
            "sectionsCV": sections,
            "customEntities": custom_entities
        })

    except Exception as e:
        return jsonify({
            "error": f"Erreur lors de l'analyse : {str(e)}",
            "success": False
        }), 500


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "OK",
        "message": "API d'analyse de CV opérationnelle",
        "models_loaded": {
            "bert_model": bert_model is not None,
            "embedding_model": embedding_model is not None,
            "spacy_models": list(spacy_models.keys()),
            "classifier_trained": section_classifier is not None
        }
    })


if __name__ == "__main__":
    print("Démarrage de l'API d'analyse de CV...")
    print(f"Modèles chargés : {list(spacy_models.keys())}")
    print(f"Compétences techniques : {len(hard_skills)} compétences")
    app.run(host="0.0.0.0", port=5000, debug=True)
