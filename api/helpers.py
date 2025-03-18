import requests
import re
import yt_dlp

# Extract video id from the URL
def extract_video_id(youtube_url):
    """Extracts the video ID from a YouTube URL."""
    pattern = r"(?:v=|\/|youtu\.be\/|embed\/)([0-9A-Za-z_-]{11})"
    match = re.search(pattern, youtube_url)
    return match.group(1) if match else None

# Use oEmbed YouTube API to check if a video exists
def check_youtube_video_exists(video_id):
    """Checks if a YouTube video exists using the oEmbed API."""
    url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"
    response = requests.get(url)
    return response.status_code != 404  # Returns True if video exists, False otherwise

# Get subtitles and transcript the video in a string using yt-dlp
def youtube_transcript_video(url):
    video_id = extract_video_id(url)
    
    ydl_opts = {
        'writesubtitles': True,  # Download subtitles if available
        'subtitleslangs': ['en'],  # Choose the language, 'en' for English
        'quiet': True,  # Suppress output
        'outtmpl': '%(id)s.%(ext)s'  # Save subtitles in a file named by the video ID
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        try:
            # Extract the video information
            result = ydl.extract_info(url, download=False)
            
            # Check if subtitles are available
            if 'requested_subtitles' in result and 'en' in result['requested_subtitles']:
                subtitle_url = result['requested_subtitles']['en']['url']
                subtitles = requests.get(subtitle_url).text  # Get subtitle content
                
                return subtitles
            else:
                raise Exception("No subtitles found for this video.")
        except Exception as e:
            raise Exception(f"Error retrieving subtitles: {str(e)}")

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
