FROM node:12
WORKDIR /opt/divergenti/divergenti-api
COPY package*.json ./
RUN npm install
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD [ "node", "index.js" ]