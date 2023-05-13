
RM_VOL := $(shell basename "${PWD}")

all: up

up:
	docker-compose -f docker-compose.yaml up --remove-orphans -d

dev:
	cp actual.env .env
	docker compose -f docker-compose.yaml up --build --remove-orphans -d
	docker compose -f docker-compose.yaml logs --tail 100 -f

database:
	docker exec -it postgresql_database bash
#	psql -h localhost -U user postgres_db
#	\dt to show tables
#	SELECT * FROM "WhateverTableYouWantToCheck";


down:
	docker-compose -f docker-compose.yaml down

ps:
	docker-compose -f docker-compose.yaml ps

clean:
	docker volume rm ${RM_VOL}_postgres-data

fclean: down
	rm .env
	docker system prune -af --volumes

re: fclean up

.PHONY: all dev down ps fclean re