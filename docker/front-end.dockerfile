FROM node:20

RUN apt-get update && apt-get install apt-file -y && apt-file update
RUN apt-get install vim -y

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

CMD ["npm", "run", "dev"]
