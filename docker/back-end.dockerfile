FROM node:20

WORKDIR /usr/src/app

COPY ./back-end/package*.json ./


RUN npm install

COPY ./back-end .

RUN 	rm -rf shared
RUN 	mkdir shared;
COPY ./front-end/src/types/types.ts ./shared/types.ts
COPY  ./front-end/src/types/routesApi.ts ./shared/routesApi.ts

CMD [ "npm", "run", "start:dev" ]
