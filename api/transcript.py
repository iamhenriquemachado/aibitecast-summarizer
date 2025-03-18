import google.generativeai as genai
import re
from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = os.getenv("API_KEY")

API_KEY = "YOUR_KEY"

def sumarry_key_points_ai(text):
    client = genai.Client(api_key=API_KEY)
    
    # Modify the prompt to ask for structured output
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[
            f"""Analyze this transcript and create a structured summary with these exact fields:
            
1. A "title" that captures the main topic of the video
2. A "summary" paragraph that gives an overview of the main ideas and concepts (limit to 2-3 paragraphs)
3. A list of 3-7 "keyPoints" that highlight the most important takeaways

Format your response as follows:
TITLE: [The title you've created]

SUMMARY: [Your summary paragraph(s)]

KEY POINTS:
- [First key point]
- [Second key point]
- [Continue with remaining key points]

Transcript to analyze:
{text}"""
        ],
    )
    
    # Parse the response text into the expected structure
    response_text = response.text
    
    # Extract title
    title_match = re.search(r"TITLE:(.*?)(?:\n|$)", response_text, re.IGNORECASE)
    title = title_match.group(1).strip() if title_match else "Video Summary"
    
    # Extract summary
    summary_match = re.search(r"SUMMARY:(.*?)(?=KEY POINTS:|$)", response_text, re.IGNORECASE | re.DOTALL)
    summary = summary_match.group(1).strip() if summary_match else ""
    
    # Extract key points
    key_points_section = re.search(r"KEY POINTS:(.*?)(?=$)", response_text, re.IGNORECASE | re.DOTALL)
    key_points = []
    
    if key_points_section:
        # Extract bullet points
        points_text = key_points_section.group(1)
        # Match lines starting with - or *
        points = re.findall(r"[-*]\s*(.*?)(?:\n|$)", points_text)
        key_points = [point.strip() for point in points if point.strip()]
    
    # If no key points were found with bullets, try to split by numbers
    if not key_points and key_points_section:
        points_text = key_points_section.group(1)
        # Try to match numbered points like "1. Point" or "1) Point"
        points = re.findall(r"\d+[.)]\s*(.*?)(?:\n|$)", points_text)
        key_points = [point.strip() for point in points if point.strip()]
    
    # If still no key points, split by newlines as a fallback
    if not key_points and key_points_section:
        points_text = key_points_section.group(1)
        key_points = [line.strip() for line in points_text.split('\n') if line.strip()]
    
    # Create the structured response expected by the frontend
    structured_response = {
        "title": title,
        "summary": summary,
        "keyPoints": key_points
    }
    
    return structured_response
