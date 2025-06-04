from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import pdfplumber
import docx
import io

app = Flask(__name__)
CORS(app)  # Allow CORS from all origins

# Load model
model = SentenceTransformer('all-MiniLM-L6-v2')

def extract_text_from_pdf(file_stream):
    text = ""
    with pdfplumber.open(file_stream) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text

def extract_text_from_docx(file_stream):
    doc = docx.Document(file_stream)
    return "\n".join([para.text for para in doc.paragraphs])

@app.route('/analyze', methods=['POST'])
def analyze_resumes():
    try:
        print("[INFO] Request received")

        jd_text = request.form.get("jd")
        n = request.form.get("n")
        top_n = int(n) if n else 5  # Use provided n if available, otherwise default to 5

        if not jd_text:
            return jsonify({"error": "Job description is required"}), 400
        if 'resumes' not in request.files:
            return jsonify({"error": "No resumes uploaded"}), 400
        if len(request.files.getlist('resumes')) == 0:
            return jsonify({"error": "No valid resumes uploaded"}), 400

        print(f"[INFO] JD length: {len(jd_text)}")
        jd_embedding = model.encode([jd_text])

        resumes = request.files.getlist("resumes")
        scores = []

        for resume in resumes:
            filename = resume.filename.lower()
            print(f"[INFO] Processing resume: {filename}")
            file_bytes = resume.read()

            text = ""
            try:
                if filename.endswith('.pdf'):
                    text = extract_text_from_pdf(io.BytesIO(file_bytes))
                elif filename.endswith('.docx'):
                    text = extract_text_from_docx(io.BytesIO(file_bytes))
                elif filename.endswith('.doc'):
                    text = ""  # Skip .doc for now
                else:
                    text = file_bytes.decode('utf-8', errors='ignore')
            except Exception as e:
                app.logger.error(f"TEXT EXTRACTION FAILED for {resume.filename}: {str(e)}", exc_info=True)
                return jsonify({"error": f"Failed to extract text from {resume.filename}: {str(e)}"}), 500

            if not text.strip():
                return jsonify({"error": f"No text extracted from {resume.filename}"}), 400

            embedding = model.encode([text])
            similarity = cosine_similarity(jd_embedding, embedding)[0][0]
            match_percent = float(round(similarity * 100, 2))
            scores.append({
                "filename": resume.filename,
                "match_percent": match_percent
            })

        sorted_scores = sorted(scores, key=lambda x: x["match_percent"], reverse=True)
        print("[INFO] Completed analysis. Returning top results.")
        app.logger.info(f"Scores being returned: {sorted_scores[:top_n]}")

        return jsonify(sorted_scores[:top_n])

    except Exception as e:
        app.logger.error(f"INTERNAL SERVER ERROR DETAILS: {str(e)}", exc_info=True)
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5002)
