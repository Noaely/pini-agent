# Backend image: Node + Python3 (the menu/discount scrapers run as child processes)
FROM node:20-slim

# Python 3 + pip for scrape_json.py / scrape_discounts.py
RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 python3-pip ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Python dependencies for the scrapers
COPY requirements.txt ./
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

# Node dependencies
COPY package.json ./
RUN npm install --omit=dev

# Application source
COPY . .

ENV NODE_ENV=production
# Render injects $PORT; the app falls back to 3001 locally
EXPOSE 3001
CMD ["node", "server.js"]
