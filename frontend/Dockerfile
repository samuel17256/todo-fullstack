FROM python:3.12-slim
WORKDIR /app
RUN pip install --no-cache-dir fastapi uvicorn
COPY . .
CMD ["python", "-m", "http.server", "80", "--directory", "/app"]