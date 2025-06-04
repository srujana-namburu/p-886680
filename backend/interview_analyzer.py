import pandas as pd
from transformers import pipeline
import torch
import requests
from io import StringIO
import os
from dotenv import load_dotenv
import json
import sys

# Load environment variables
load_dotenv()

# Initialize transformers pipelines
summarizer = pipeline("summarization", model="facebook/bart-large-cnn", device=0 if torch.cuda.is_available() else -1)
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli", device=0 if torch.cuda.is_available() else -1)

# Trait labels to classify
traits = ["Confidence", "Communication", "Technical Ability"]

# Recommendation logic
def get_recommendation(avg_score):
    if avg_score >= 0.85:
        return "Hire"
    elif avg_score >= 0.65:
        return "Consider"
    else:
        return "Reject"

# Process a single feedback entry
def process_feedback(feedback_text):
    # 1. Summarization
    summary_output = summarizer(
        feedback_text,
        max_length=80,
        min_length=25,
        do_sample=False,
        no_repeat_ngram_size=3,
        early_stopping=True
    )
    summary = summary_output[0]['summary_text']

    # 2. Trait scoring using zero-shot classification
    score_output = classifier(feedback_text, candidate_labels=traits)
    scores_dict = dict(zip(score_output["labels"], score_output["scores"]))

    # 3. Average score and recommendation
    avg_score = sum(scores_dict.values()) / len(traits)
    recommendation = get_recommendation(avg_score)

    return summary, scores_dict, avg_score, recommendation

class InterviewAnalyzer:
    def __init__(self):
        """Initialize the interview analyzer with Supabase credentials and transformers models"""
        print("\nInitializing Interview Analyzer...")
        
        # Get environment variables
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_KEY')
        
        if not self.supabase_url or not self.supabase_key:
            raise ValueError("Supabase URL and key must be set in environment variables")
            
        print(f"Supabase URL: {self.supabase_url}")
        print("Testing Supabase connection...")
        
        # Test the connection using a valid endpoint
        test_url = f"{self.supabase_url}/rest/v1/interview_feedback_files"
        try:
            # Test with a simple query
            response = requests.get(
                test_url,
                headers={
                    'apikey': self.supabase_key,
                    'Authorization': f'Bearer {self.supabase_key}'
                },
                params={
                    'select': '*',
                    'limit': 1
                }
            )
            
            if response.status_code == 200:
                print("Supabase connection successful!")
                print(f"Test response: {response.json()}")
            else:
                print(f"Warning: Supabase connection test failed with status {response.status_code}")
                print(f"Response: {response.text}")
                
        except Exception as e:
            print(f"Warning: Could not connect to Supabase: {str(e)}")
            print("Continuing with transformers initialization...")
        
        self.headers = {
            'apikey': self.supabase_key,
            'Authorization': f'Bearer {self.supabase_key}'
        }
        
        # Initialize transformers models
        print("\nInitializing transformers models...")
        
        # For summarization
        self.summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
        
        # For classification
        self.classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
        
        print("Models initialized successfully!")
        print("Interview Analyzer initialized!")

    def get_interview_feedback_file(self, job_id):
        """Fetch the interview feedback file URL for a specific job"""
        try:
            # Query Supabase for the file URL
            response = requests.get(
                f"{self.supabase_url}/rest/v1/interview_feedback_files",
                headers=self.headers,
                params={
                    'select': '*'
                }
            )
            
            if response.status_code == 200:
                files = response.json()
                if files:
                    # Find the file for the given job_id
                    file_details = next((f for f in files if f['job_id'] == job_id), None)
                    if file_details:
                        print(f"\nFound file details: {file_details}")
                        return {
                            'file_url': file_details['file_url'],
                            'file_name': file_details['file_name'],
                            'uploaded_by': file_details['uploaded_by']
                        }
            else:
                print(f"Error querying Supabase: {response.status_code}")
                print(f"Response: {response.text}")
            
            return None
            
        except Exception as e:
            print(f"\nError accessing file: {str(e)}")
            return None

    def process_feedback_from_url(self, file_details):
        """Process feedback from a CSV file URL using transformers models"""
        if not isinstance(file_details, dict):
            print("Error: File details must be a dictionary")
            return None
            
        print(f"\nProcessing file from URL: {file_details['file_url']}")
        
        # Download the CSV content
        try:
            response = requests.get(file_details['file_url'])
            if response.status_code != 200:
                print(f"Error downloading file: {response.status_code}")
                print(f"Response: {response.text}")
                return None
            
            # Read CSV content
            try:
                df = pd.read_csv(StringIO(response.text))
                print("\nCSV Content:")
                print("-" * 80)
                print(f"CSV Columns: {df.columns.tolist()}")
                print("-" * 80)
                print(df.to_string())
                print("-" * 80)
            except Exception as e:
                print(f"Error reading CSV: {str(e)}")
                print(f"Response text: {response.text[:500]}...")
                return None
            
            # Process each feedback
            results = []
            for idx, row in df.iterrows():
                try:
                    # Convert row to dictionary
                    row_dict = dict(row)
                    
                    # Get feedback and candidate name
                    feedback = str(row_dict.get('interview_feedback', '')).strip()
                    if not feedback:
                        print(f"Skipping row {idx}: No feedback text found")
                        continue

                    candidate_name = str(row_dict.get('candidate_name', 'Unknown')).strip()
                    print(f"\nProcessing row {idx} for {candidate_name}")
                    print(f"Feedback text: {feedback[:100]}...")
                    
                    # Use transformers for summarization
                    summary = self.summarizer(feedback, max_length=100, min_length=30, do_sample=False)[0]['summary_text']
                    print(f"Summary: {summary}")
                    
                    # Use transformers for classification
                    traits = ["Confidence", "Communication", "Technical Ability"]
                    classification = self.classifier(feedback, candidate_labels=traits)
                    
                    result = {
                        'candidate_name': candidate_name,
                        'original_feedback': feedback,
                        'summary': summary,
                        'sentiment': classification['labels'][0],
                        'confidence': classification['scores'][0],
                        'traits': {
                            trait: score
                            for trait, score in zip(classification['labels'], classification['scores'])
                        }
                    }
                    results.append(result)
                    
                except Exception as e:
                    print(f"Error processing row {idx}: {str(e)}")
                    print(f"Row data: {dict(row)}")
                    continue
            
            if not results:
                print("No valid feedback rows found in the CSV")
                return None
            
            # Convert results to DataFrame
            result_df = pd.DataFrame(results)
            print("\nProcessed Results:")
            print("-" * 80)
            print(result_df.to_string())
            print("-" * 80)
            
            return result_df
            
        except Exception as e:
            print(f"Error processing CSV: {str(e)}")
            return None
        
        # Read CSV directly
        try:
            df = pd.read_csv(StringIO(response.text))
            print("\nCSV Content:")
            print("-" * 80)
            print(f"CSV Columns: {df.columns.tolist()}")
            print("-" * 80)
            print(df.to_string())
            print("-" * 80)
        except Exception as e:
            print(f"Error reading CSV: {str(e)}")
            print(f"Response text: {response.text[:500]}...")
            return None
        
        # Process each feedback
        results = []
        for idx, row in df.iterrows():
            try:
                feedback = str(row.get('interview_feedback', '')).strip()
                if not feedback:
                    print(f"Skipping row {idx}: No feedback text found")
                    continue

                candidate_name = str(row.get('candidate_name', 'Unknown')).strip()
                print(f"\nProcessing row {idx} for {candidate_name}")
                print(f"Feedback text: {feedback[:100]}...")
                
                # Use transformers for summarization
                summary = self.summarizer(feedback, max_length=100, min_length=30, do_sample=False)[0]['summary_text']
                print(f"Summary: {summary}")
                
                # Use transformers for classification
                traits = ["Confidence", "Communication", "Technical Ability"]
                classification = self.classifier(feedback, candidate_labels=traits)
                
                result = {
                    'candidate_name': candidate_name,
                    'original_feedback': feedback,
                    'summary': summary,
                    'sentiment': classification['labels'][0],
                    'confidence': classification['scores'][0],
                    'traits': {
                        trait: score
                        for trait, score in zip(classification['labels'], classification['scores'])
                    }
                }
                results.append(result)
                
            except Exception as e:
                print(f"Error processing row {idx}: {str(e)}")
                print(f"Row data: {row}")
                continue
        
        if not results:
            print("No valid feedback rows found in the CSV")
            return None
        
        # Convert results to DataFrame
        result_df = pd.DataFrame(results)
        print("\nProcessed Results:")
        print("-" * 80)
        print(result_df.to_string())
        print("-" * 80)
        
        return result_df
                


    def save_processed_results(self, result_df, job_id, file_details):
        """Save processed results to Supabase with proper table structure"""
        try:
            # Convert DataFrame to list of dictionaries
            records = result_df.to_dict('records')
            
            # Add job_id and file metadata to each record
            for record in records:
                record['job_id'] = job_id
                record['file_url'] = file_details['file_url']
                record['created_at'] = datetime.now().isoformat()
                record['updated_at'] = datetime.now().isoformat()
                
            # Save to Supabase
            url = f"{self.supabase_url}/rest/v1/processed_interview_feedback"
            headers = self.headers.copy()
            headers['Content-Type'] = 'application/json'
            
            # Display analysis results before saving
            print("\nAnalysis Results:")
            print("-" * 80)
            for record in records:
                print(f"\nCandidate: {record['candidate_name']}")
                print(f"Interviewer: {record['interviewer']}")
                print(f"Summary: {record['summary']}")
                print(f"Confidence Score: {record['confidence_score']}")
                print(f"Communication Score: {record['communication_score']}")
                print(f"Technical Ability Score: {record['technical_ability_score']}")
                print(f"Average Score: {record['average_score']}")
                print(f"Recommendation: {record['recommendation']}")
            print("-" * 80)
            
            # Save to database
            print(f"Saving {len(records)} records to processed_interview_feedback table...")
            response = requests.post(
                url,
                headers=headers,
                json=records
            )
            
            if response.status_code == 201:
                print("Records saved successfully!")
                return response.json()
            else:
                print(f"Error saving records: {response.text}")
                return None
            
        except Exception as e:
            print(f"Error saving processed results: {str(e)}")
            return None

    def analyze_interview_feedback(self, job_id, action='view'):
        """Main function to analyze or view interview feedback for a specific job"""
        print(f"\nAnalyzing interview feedback for job_id: {job_id}")
        
        try:
            # Get file URL and metadata
            file_details = self.get_interview_feedback_file(job_id)
            if not file_details:
                return {'status': 'error', 'message': 'Could not find interview feedback file'}
            
            print(f"Found file details: {file_details}")
            print(f"Action: {action} - {'Processing file' if action == 'download' else 'Viewing file'}")
            
            if action == 'view':
                return {'status': 'success', 'file_details': file_details}
            elif action == 'download':
                result_df = self.process_feedback_from_url(file_details)
                if result_df is None:
                    return {'status': 'error', 'message': 'Failed to process feedback file'}
                
                processed_records = self.save_processed_results(result_df, job_id, file_details)
                if processed_records is None:
                    print("Error: Failed to save processed results")
                    return {
                        'status': 'error',
                        'message': 'Failed to save processed results'
                    }
                
                print("Processing completed successfully!")
                return {
                    'status': 'success',
                    'message': 'File processed and saved successfully',
                    'file_details': file_details,
                    'processed_records': processed_records
                }
            
            else:
                print(f"Error: Invalid action: {action}")
                return {
                    'status': 'error',
                    'message': f'Invalid action: {action}'
                }
            
        except Exception as e:
            print(f"Error in analyze_interview_feedback: {str(e)}")
            return {
                'status': 'error',
                'message': f'Error processing interview feedback: {str(e)}'
            }

# Example usage
if __name__ == "__main__":
    try:
        analyzer = InterviewAnalyzer()
        
        # Get job_id from user input
        job_id = input("Please enter the job_id: ")
        if not job_id:
            raise ValueError("Job ID cannot be empty")
        
        # Ask for action (view or download)
        action = input("\nWhat would you like to do? (view/download): ").lower()
        if action not in ['view', 'download']:
            raise ValueError("Invalid action. Must be 'view' or 'download'")
        
        # Process the feedback
        result = analyzer.analyze_interview_feedback(job_id, action)
        print("\nResult:")
        print(json.dumps(result, indent=2))
        
        if result['status'] == 'success':
            if action == 'view':
                print("\nFile details:")
                print(json.dumps(result['file_details'], indent=2))
            else:  # download
                print("\nProcessed records:")
                print(json.dumps(result['processed_records'], indent=2))
    
    except Exception as e:
        print(f"\nAn error occurred: {str(e)}")
        print("\nPlease make sure:")
        print("1. The job_id exists in your database")
        print("2. The interview_feedback_files table contains a record for this job_id")
        print("3. The file_url in the interview_feedback_files table is accessible")
