FROM postgres:15.3

COPY ./sql/init.sql /docker-entrypoint-initdb.d/init.sql

CMD [ "postgres" ]
