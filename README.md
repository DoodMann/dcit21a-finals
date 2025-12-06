# DCIT 21A Finals - Campus Map Concept

> **Note:** This is a **Concept Prototype** for the final examination project.

## Status
**Current Branch:** Concept / Prototype  
**Main Branch Status:** Not yet merged. This code serves as the reference implementation.

## Project Overview
This project is an **Interactive Campus Map** for CvSU, featuring:
- **Role-Based Access Control:**
  - **Admins:** Can view the map, add pins, and delete pins.
  - **Guests:** Can view the map and pins but cannot modify them.
- **Interactive Map:** A custom-built JavaScript engine allow panning, zooming, and coordinate tracking.
- **Backend persistence:** Pins are saved to a JSON file via a PHP API, allowing data to persist across sessions.

## Development Approach
This prototype was developed with the assistance of **AI** to establish a high-quality "Gold Standard" for the project. 

### Goals for the Student
1.  **Replication:** The primary goal is to use this concept as a blueprint. I will be rewriting and analyzing the logic to implement it using my own coding style and understanding.
2.  **Code Analysis:** I will study every block of this codebase (PHP Sessions, JS Event Listeners, CSS Glassmorphism) to ensure I can fully explain and defend the logic during the final presentation.
3.  **Customization:** The final version pushed to `main` will reflect my personal implementation details and any additional custom features specific to the course requirements.

## Technical Stack
- **Frontend:** HTML5, CSS3 (Modern Variables & Layouts), Vanilla JavaScript (No frameworks).
- **Backend:** PHP (Session Management, API Endpoints).
- **Data:** JSON (Flat-file database for simplicity).
