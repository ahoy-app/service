init: rabbit mongo start

dev: rabbit mongo test

pre-commit: docker.clean prettify lint test

start:
	yarn start

test:
	yarn test

test.ci:
	yarn test:ci

prettify:
	yarn prettify

lint:
	yarn lint

rabbit:
	docker run --rm -p 5672:5672 --name ahoy-rabbit -d rabbitmq:3
	touch rabbit

mongo:
	docker run --rm -p 27017:27017 --name ahoy-mongo -d mongo:4
	touch mongo

docker.logs:
	-docker logs ahoy-rabbit > rabbit
	-docker logs ahoy-mongo > mongo

docker.clean:
	-docker stop ahoy-rabbit ahoy-mongo
	-rm rabbit
	-rm mongo
