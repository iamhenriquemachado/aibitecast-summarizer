import requests
import re
from youtube_transcript_api import YouTubeTranscriptApi

# Extract video id from the Url
def extract_video_id(youtube_url):
    """Extracts the video ID from a YouTube URL."""
    pattern = r"(?:v=|\/|youtu\.be\/|embed\/)([0-9A-Za-z_-]{11})"
    match = re.search(pattern, youtube_url)
    return match.group(1) if match else None


# Get subtitle and transcript the video in a string
def youtube_transcript_video(url):
    video_id = extract_video_id(url)
    subtitles = YouTubeTranscriptApi.get_transcript(video_id)

    transcript = " ".join(i["text"] for i in subtitles)
    return transcript


# Clean the transcribed text from YouTube subtitles
def clean_transcript(text):

    # Time Format
    text = re.sub(r'\d{5}\s*p\.m\.|\d{1,2}:\s*p\.m\.|\d{1,2}:\s*a\.m\.', '', text)

    # Filler Words/Profanity
    text = re.sub(r'\[\s*__\s*\]', '', text)  # Remove placeholders
    text = re.sub(r'\b[Ff]uck\b|\b[Ss]hit\b', '', text)  # Remove profanity

    # Inconsistent Spacing
    text = re.sub(r'\s+', ' ', text)  # Replace multiple spaces with a single space
    text = re.sub(r'\s([.,?!])', r'\1', text)  # Remove space before punctuation

    # Punctuation
    text = re.sub(r'([a-zA-Z0-9])\.([a-zA-Z0-9])', r'\1. \2', text)  # Fix spacing after periods
    text = re.sub(r'([a-zA-Z0-9])([,.?!])([a-zA-Z0-9])', r'\1\2 \3', text)  # Add space after punctuation

    return text
