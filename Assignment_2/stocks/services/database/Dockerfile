FROM mongo:latest

COPY mongod.conf /etc/mongod.conf

COPY init-mongo.js /docker-entrypoint-initdb.d/

RUN mkdir -p /logs/mongodb && chown -R mongodb:mongodb /logs/mongodb

EXPOSE 27017

CMD ["mongod", "--config", "/etc/mongod.conf"]
