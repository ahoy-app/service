# Service

![GIF Demo](https://media.giphy.com/media/pjG0OSRCk0yJGMc5Ru/giphy.gif)

## Install

### Services

Run a Rabbit instance

```sh
docker run --rm -p 5672:5672 rabbitmq:3
```

Run a MongoDB instance

```sh
docker run --rm -p 27017:27017 mongo:4
```

### Config

Create a file in the root called `.env`

```
SERVER_PORT=8080

JWT_SECRET=mysecret

AMQP_HOST=localhost
AMQP_PORT=5672
AMQP_USER=guest
AMQP_PASS=guest

MDB_HOST=localhost
MDB_PORT=27017
MDB_USER=
MDB_PASS=
```

### Run

```sh
yarn start
```
