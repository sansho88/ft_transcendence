COMPOSE=docker-compose

all: up

up: build
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
