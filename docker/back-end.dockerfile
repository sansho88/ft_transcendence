FROM node:20

WORKDIR /usr/src/app

COPY ./back-end/package.json ./
COPY ./back-end/package-lock.json ./

RUN npm install

COPY ./back-end/tsconfig.json ./
COPY ./back-end/tsconfig.build.json ./
COPY ./back-end/src ./src
COPY --chown=node:node ./front-end/src/shared 				./back-end/src/

RUN npm run build

CMD [ "npm", "run", "start:prod" ]

