.PHONY: init

init:
	yarn

run: rabbit mongo start

dev: rabbit mongo test

demo: docker.clean rabbit mongo
	yarn initDb

pre-commit: docker.clean prettify lint test.ci
	# This is not executed by hooks.
	# Just helps developer to automate clean, lint and test

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
	docker run --rm -p 5672:5672 -p 15672:15672 --name ahoy-rabbit -d rabbitmq:3-management
	touch rabbit

mongo:
	docker run --rm -p 27017:27017 --name ahoy-mongo -d mongo:4
	touch mongo

oauth:
	docker run --rm -p 80:80 --name gitlab --hostname localhost -d gitlab/gitlab-ce:latest
	touch oauth

docker.logs:
	-docker logs ahoy-rabbit > rabbit
	-docker logs ahoy-mongo > mongo

docker.clean:
	-docker stop ahoy-rabbit ahoy-mongo
	-rm rabbit
	-rm mongo
	-rm oauth
