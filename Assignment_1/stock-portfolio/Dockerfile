FROM node:18-alpine
LABEL authors="Omri Levy, Roy Harel, Omer Har-Zvi"
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5001
CMD ["npm", "start"]
