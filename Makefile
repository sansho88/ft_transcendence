COMPOSE=docker-compose

all: up

up: build
	$(COMPOSE) up -d

dev: build
	$(COMPOSE) up

build:
	$(COMPOSE) build --parallel --no-cache

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

fclean:
	./docker/fclean_docker.sh
