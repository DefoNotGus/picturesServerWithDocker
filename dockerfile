# Use official Python image from DockerHub
FROM python:3.9-slim

# Set working directory inside the container
WORKDIR /app

# Install dependencies
COPY backend/requirements.txt requirements.txt
RUN pip install -r requirements.txt

# Copy application code
COPY . .

# Expose the Flask port
EXPOSE 5000

# Run the database initialization script before starting the app
CMD ["sh", "-c", "python backend/init_db.py && flask run --host=0.0.0.0"]
