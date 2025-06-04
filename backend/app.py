from flask import Flask, request, jsonify
from flask_cors import CORS
from interview_analyzer import InterviewAnalyzer
import os
import requests

app = Flask(__name__)
CORS(app, resources={r"/analyze-interview": {"origins": "http://localhost:8080", "supports_credentials": True}}, methods=['POST'], allow_headers=['Content-Type'])

analyzer = InterviewAnalyzer()

@app.route('/analyze-interview', methods=['POST'])
def analyze_interview():
    try:
        print("Received request")
        data = request.json
        print(f"Request data: {data}")
        
        if not data:
            return jsonify({'status': 'error', 'message': 'No data received'}), 400

        job_name = data.get('job_name')
        if not job_name:
            return jsonify({'status': 'error', 'message': 'Job name is required'}), 400

        print(f"Looking up job ID for job name: {job_name}")
        job_id = get_job_id_from_name(job_name)
        
        if not job_id:
            return jsonify({'status': 'error', 'message': f'No job found with name: {job_name}'}), 404

        print(f"Found job ID: {job_id}, starting analysis...")
        result = analyzer.analyze_interview_feedback(job_id, action='download')
        print(f"Analysis completed. Result: {result}")
        return jsonify(result)
            
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_job_id_from_name(job_name):
    """Get job ID from job name using Supabase"""
    print(f"\nLooking up job ID for job name: {job_name}")
    
    # Clean up the job name
    search_terms = job_name.lower().split()
    
    supabase_url = os.getenv('SUPABASE_URL')
    supabase_key = os.getenv('SUPABASE_KEY')
    
    if not supabase_url or not supabase_key:
        raise ValueError("Supabase URL and key must be set in environment variables")
    
    headers = {
        'apikey': supabase_key,
        'Authorization': f'Bearer {supabase_key}'
    }
    
    try:
        # Get all jobs
        response = requests.get(
            f"{supabase_url}/rest/v1/jobs",
            headers=headers,
            params={
                'select': '*'  # Get all fields
            }
        )
        
        if response.status_code == 200:
            jobs = response.json()
            print(f"\nAvailable jobs in database:")
            for job in jobs:
                print(f"- {job.get('title', 'No title')} (ID: {job.get('id', 'No ID')})")
            
            # Try different matching strategies
            for job in jobs:
                title = job.get('title', '').lower()
                
                # Strategy 1: Direct match
                if job_name.lower() == title:
                    print(f"\nFound exact match: {job['title']}")
                    return job['id']
                
                # Strategy 2: Partial word match
                if any(term in title for term in search_terms):
                    print(f"\nFound partial match: {job['title']}")
                    return job['id']
                
                # Strategy 3: Handle common variations
                if 'frontend' in title and 'developer' in title:
                    print(f"\nFound frontend developer match: {job['title']}")
                    return job['id']
                
            print(f"\nNo jobs found matching: {job_name}")
            return None
        else:
            print(f"\nError querying jobs: {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"\nError in job lookup: {str(e)}")
        return None

if __name__ == '__main__':
    app.run(debug=True, port=5000)
