from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from typing import Optional
from helpers import check_youtube_video_exists, clean_transcript, extract_video_id, youtube_transcript_video
from transcript import sumarry_key_points_ai

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://devutilities.vercel.app", "http://localhost:3000", "*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


class UserYoutubeUrl(BaseModel):
    youtube_url: str


# Process function to avoid duplication
async def process_youtube_url(url: str):
    # Extract the video ID
    video_id = extract_video_id(url)
    if not video_id:
        raise HTTPException(
            status_code=400, detail="Incorrect YouTube URL. Please check."
        )

    # Check if the video exists on YouTube
    if not check_youtube_video_exists(video_id):
        raise HTTPException(
            status_code=404, detail="YouTube video not found or unavailable."
        )

    try:
        # Get the transcription and clean the text
        transcription = youtube_transcript_video(url)
        cleaned_text = clean_transcript(transcription)
        
        if not cleaned_text:
            raise HTTPException(
                status_code=404, detail="Could not get transcript for this video."
            )
        
        # The function returns a properly structured dictionary
        result = sumarry_key_points_ai(cleaned_text)
        
        # Return the result directly as it's already in the correct format
        return result
    
    except Exception as e:
        print(f"Error processing video: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error processing video: {str(e)}"
        )


@app.get("/youtube/summarize")
async def summarize_youtube_video_get(url: str = Query(..., description="YouTube video URL")):
    """GET endpoint that expects a 'url' query parameter"""
    return await process_youtube_url(url)


@app.post("/youtube/summarize")
async def summarize_youtube_video_post(data: UserYoutubeUrl):
    """POST endpoint that expects a JSON body with 'youtube_url' field"""
    return await process_youtube_url(data.youtube_url)


# For backward compatibility - handle the old endpoint with trailing slash
@app.post("/youtube/summarize/")
async def summarize_youtube_video_post_old(data: UserYoutubeUrl):
    """Legacy POST endpoint with trailing slash"""
    return await process_youtube_url(data.youtube_url)


# SERVER Running 
@app.get("/")
def read_root():
    return {"message": "BiteCast AI API is running 🚀"}


# Start server
if __name__ == "__main__":
    import uvicorn 
    uvicorn.run("app:app", host="127.0.0.1", port=8001, reload=True)