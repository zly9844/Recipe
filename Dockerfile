FROM node:24-alpine

WORKDIR /app
COPY package.json ./
COPY index.html styles.css app.js server.js ./

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=5173
ENV DATA_DIR=/app/data

RUN mkdir -p /app/data

EXPOSE 5173
VOLUME ["/app/data"]
CMD ["npm", "start"]
