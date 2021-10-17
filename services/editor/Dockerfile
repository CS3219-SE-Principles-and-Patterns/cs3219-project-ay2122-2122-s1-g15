FROM node:latest
WORKDIR /app/
COPY package.json .
RUN npm install
COPY . .
EXPOSE 6001
CMD [ "node", "index.js" ]