FROM node:20

RUN apt-get update && apt-get install apt-file -y && apt-file update
RUN apt-get install vim -y

WORKDIR /usr/src/app/front-end

COPY --chown=node:node ./front-end/*.json 							./
COPY --chown=node:node ./front-end/*.js 								./
COPY --chown=node:node ./front-end/*.ts 								./
COPY --chown=node:node ./front-end/*.prettierrc 				./

RUN npm install

CMD ["npm", "run", "dev"]
