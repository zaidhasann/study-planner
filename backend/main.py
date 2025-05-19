from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from datetime import datetime, timedelta

app = FastAPI()

# Allow React frontend (adjust origin if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev, allow all origins; for production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models for request validation
class Subject(BaseModel):
    name: str
    chapters: int
    examDate: datetime

class StudyPlanRequest(BaseModel):
    subjects: List[Subject]
    hoursPerDay: int

@app.post("/generate-schedule")
def generate_schedule(data: StudyPlanRequest):
    schedule = []

    for subject in data.subjects:
        today = datetime.now().date()
        exam_date = subject.examDate.date()
        days_until_exam = (exam_date - today).days

        if days_until_exam <= 0 or subject.chapters <= 0:
            continue  # Skip past exams or invalid input

        chapters_left = subject.chapters

        for day_offset in range(days_until_exam):
            date = today + timedelta(days=day_offset)
            # Distribute chapters evenly, at least 1 chapter per day
            chapters_today = max(1, chapters_left // (days_until_exam - day_offset))

            schedule.append({
                "date": date.isoformat(),
                "subject": subject.name,
                "study": f"Study {chapters_today} chapter(s)"
            })

            chapters_left -= chapters_today

            if chapters_left <= 0:
                break

    return schedule
