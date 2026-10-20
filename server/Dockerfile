# Backend container for Hugging Face Spaces (free, no card required).
FROM node:20-slim

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm install --omit=dev

# Copy the server code
COPY . .

# Hugging Face Spaces routes traffic to port 7860
ENV PORT=7860
EXPOSE 7860

CMD ["node", "server.js"]
