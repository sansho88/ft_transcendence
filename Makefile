COMPOSE=docker-compose

all: up

re: fclean all

redev: fclean dev

up: build
	$(COMPOSE) up -d

dev: build
	$(COMPOSE) up

build:
	$(COMPOSE) build --parallel

start:
	$(COMPOSE) start
restart:
	$(COMPOSE) restart
stop:
	$(COMPOSE) stop

down:
	$(COMPOSE) down

ps:
	$(COMPOSE) ps --all

npm:
	npm --prefix ./front-end install ./front-end && npm --prefix ./back-end install ./back-end

fclean:
	./docker/fclean_docker.sh
