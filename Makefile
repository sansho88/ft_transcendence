COMPOSE=docker-compose

all: up

up: build
	$(COMPOSE) up -d

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

fclean:
	./docker/fclean_docker.sh
