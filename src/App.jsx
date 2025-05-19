import React, { useState } from "react";

export default function StudyPlanner() {
  const [subjects, setSubjects] = useState([]);
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [schedule, setSchedule] = useState([]);

  const [subjectName, setSubjectName] = useState("");
  const [chapters, setChapters] = useState("");
  const [examDate, setExamDate] = useState("");

  // Add a subject to the list
  const addSubject = () => {
    if (!subjectName || !chapters || !examDate) {
      alert("Please fill all subject fields");
      return;
    }

    setSubjects((prev) => [
      ...prev,
      {
        name: subjectName,
        chapters: parseInt(chapters),
        examDate: new Date(examDate).toISOString(),
      },
    ]);
    setSubjectName("");
    setChapters("");
    setExamDate("");
  };

  // Call backend API to generate schedule
  const generateSchedule = async () => {
    if (subjects.length === 0) {
      alert("Please add at least one subject");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/generate-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjects, hoursPerDay: Number(hoursPerDay) }),
      });

      if (!response.ok) throw new Error("Failed to generate schedule");

      const data = await response.json();
      setSchedule(data);
    } catch (error) {
      alert(error.message);
    }
  };
  return (
  <>
    {/* Navbar */}
    <div className="navbar">
      <i class="fa-solid fa-book-open-reader"></i> Smart Study Planner
    </div>

    {/* Main Container */}
    <div className="app-container">
      <h1>Smart Study Planner</h1>

      {/* Input fields */}
      <form onSubmit={(e) => e.preventDefault()}>
        <label>Subject Name</label>
        <input
          type="text"
          placeholder="e.g. Math"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
        />

        <label>Chapters</label>
        <input
          type="number"
          placeholder="e.g. 10"
          value={chapters}
          onChange={(e) => setChapters(e.target.value)}
          min={1}
        />

        <label>Exam Date</label>
        <input
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
        />

        <button onClick={addSubject} className="button-primary">
          Add Subject
        </button>
      </form>

      {/* Subject List */}
      <div className="subject-list">
        <h3>Subjects to Study</h3>
        {subjects.length === 0 && <p>No subjects added yet.</p>}
        <ul>
          {subjects.map((subj, idx) => (
            <li key={idx} className="subject-item">
              {subj.name} - {subj.chapters} chapters - Exam:{" "}
              {new Date(subj.examDate).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>

      {/* Daily Hours Input */}
      <div>
        <label>
          Hours per Day
          <input
            type="number"
            value={hoursPerDay}
            onChange={(e) => setHoursPerDay(e.target.value)}
            min={1}
          />
        </label>
      </div>

      {/* Generate Schedule Button */}
      <button onClick={generateSchedule} className="button-primary">
        Generate Study Schedule
      </button>

      {/* Generated Schedule */}
      <div className="schedule-list">
        <h2>Your Study Plan</h2>
        {schedule.length === 0 && <p>No schedule generated yet.</p>}
        <ul>
          {schedule.map((item, idx) => (
            <li key={idx} className="schedule-item">
              <strong>{item.date}</strong>: {item.subject} — {item.content}
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* Footer */}
    <div className="footer">
      Made by TechTechnites | © {new Date().getFullYear()}
    </div>
  </>
);
}

  