COMPOSE=docker-compose


all:
	$(COMPOSE) up --build

up:
	$(COMPOSE) up

build:
	$(COMPOSE) build

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
