FROM node:20

WORKDIR /usr/src/app

COPY --chown=node:node ./back-end/*.json 							./
COPY --chown=node:node ./back-end/*.js 								./
COPY --chown=node:node ./back-end/.prettierrc 				./

RUN npm install

CMD [ "npm", "run", "start:dev" ]
