# Use official Python runtime as a parent image
FROM python:3.13-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend project code
COPY . /app/

# Expose port 8000
EXPOSE 8000

# Run migrations and start Gunicorn server
CMD ["sh", "-c", "python manage.py migrate && gunicorn veloria_backend.wsgi:application --bind 0.0.0.0:8000"]
