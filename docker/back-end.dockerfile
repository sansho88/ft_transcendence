FROM node:20

WORKDIR /usr/src/app

COPY --chown=node:node ./back-end/*.json 							./
COPY --chown=node:node ./back-end/*.js 								./
COPY --chown=node:node ./back-end/.prettierrc 				./
# COPY --chown=node:node ./back-end/ 				./
# RUN rm -fr ./back-end/shared
# COPY --chown=node:node ./front-end/src/shared 				./back-end/shared

RUN npm install
# RUN npm run build

CMD [ "npm", "run", "start:dev" ]
