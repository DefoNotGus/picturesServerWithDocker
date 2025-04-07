# picturesServerWithDocker

This project is a Dockerized application that consists of two main components:

1. **flask-app**: A Flask-based backend that allows users to upload, view, and delete images. It stores uploaded images in the `static/uploads` directory and provides APIs for managing these images.
2. **frontend**: A React-based frontend that interacts with the Flask backend to provide a user-friendly interface for uploading and viewing images.

---

## Table of Contents
1. [Overview](#overview)
2. [Deployment Instructions](#deployment-instructions)
   - [Prerequisites](#prerequisites)
   - [For Windows](#for-windows)
   - [For Linux](#for-linux)
3. [Notes](#notes)
4. [Project Structure](#project-structure)

---

## Overview

This project is designed to provide a seamless experience for uploading, viewing, and managing images. The backend is powered by Flask, while the frontend is built using React. Both components are containerized using Docker for easy deployment.

---

## Deployment Instructions

### Prerequisites
- Install [Docker](https://www.docker.com/) on your system.
- Ensure Docker is running in the background.

---

### For Windows
1. Open a terminal (e.g., Command Prompt, PowerShell, or Windows Terminal).
2. Navigate to the project directory:
   ```sh
   cd c:\whatever-is-the-path\picturesServerWithDocker
   ```
3. Build and start the containers:
   ```sh
   docker-compose up --build
   ```
4. Once the containers are running:
   - Access the Flask backend at [http://localhost:5000](http://localhost:5000).
   - Access the React frontend at [http://localhost:3000](http://localhost:3000).

---

### For Linux
1. Open a terminal.
2. Navigate to the project directory:
   ```sh
   cd /path/to/picturesServerWithDocker
   ```
3. Build and start the containers:
   ```sh
   docker-compose up --build
   ```
4. Once the containers are running:
   - Access the Flask backend at [http://localhost:5000](http://localhost:5000).
   - Access the React frontend at [http://localhost:3000](http://localhost:3000).

---

## Notes
- To stop the containers, press `Ctrl+C` in the terminal where `docker-compose` is running or use:
  ```sh
  docker-compose down
  ```
- If you want to run the containers in detached mode (in the background), add the `-d` flag:
  ```sh
  docker-compose up --build -d
  ```

---

## Project Structure
```
picturesServerWithDocker/
├── flask-app/
│   ├── app.py               # Flask backend logic
│   ├── dockerfile           # Dockerfile for Flask app
│   ├── requirements.txt     # Python dependencies
│   ├── latest.txt           # Python dependencies
│   ├── static/uploads/      # Uploaded images
│   └── templates/index.html # HTML template for Flask
├── frontend/
│   ├── src/                 # React source code
│   ├── public/              # Public assets
│   ├── Dockerfile           # Dockerfile for React app
│   └── package.json         # React dependencies and scripts
├── docker-compose.yml       # Docker Compose configuration
└── README.md                # Project documentation
```