FROM node:20-alpine

WORKDIR /usr/src/app

# Install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy app sources
COPY . .

# Ensure upload dir exists and is writable
RUN mkdir -p tmp/uploads-cert && chown -R node:node tmp

USER node

ENV NODE_ENV=production
EXPOSE 3002

CMD ["node", "app.js"]
