
FOLDER_NAME := $(shell basename $(realpath .))

all: up

up:
	docker-compose -f docker-compose.yaml up --remove-orphans -d
	docker compose -f docker-compose.yaml logs --tail 100 -f

dev:
	cp actual.env .env
	docker compose -f docker-compose.yaml up --build --remove-orphans -d
	docker compose -f docker-compose.yaml logs --tail 100 -f

logs:
	docker compose -f docker-compose.yaml logs --tail 100 -f

database:
	docker exec -it postgresql_database bash -c "psql -h localhost -U user postgres_db"
#	psql -h localhost -U user postgres_db
#	\dt for overview of all tables
#	SELECT * FROM "table you want to see";
#

down:
	docker compose -f docker-compose.yaml down

ps:
	docker compose -f docker-compose.yaml ps

clean:
	docker volume rm $(FOLDER_NAME)_postgres-data

fclean: down
	rm .env
	docker system prune -af --volumes

re: fclean up

norm:
	npm --prefix backend run format
	npm --prefix backend run lint

ci:
	npm --prefix backend ci
	npm --prefix frontend ci

test:
	npm --prefix backend run test

.PHONY: all dev down ps fclean re norm ci test