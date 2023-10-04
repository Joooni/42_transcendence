
FOLDER_NAME := $(shell basename $(realpath .))
PROD		:= ./docker-compose.prod.yaml
DEV			:= ./docker-compose.yaml


all: up

prod: $(PROD)
	docker compose -f $(PROD) up --build --remove-orphans -d

dev: $(DEV)
	cp actual.env .env
	docker compose -f $(DEV) up --build --remove-orphans -d
	docker compose -f $(DEV) logs --tail 100 -f

up:
	docker-compose -f $(PROD) up --remove-orphans -d

logs:
	docker compose -f $(DEV) logs --tail 100 -f

frontend:
	docker compose exec -it frontend sh

backend:
	docker compose exec -it backend sh

database:
	docker exec -it postgresql_database bash -c "psql -h localhost -U user postgres_db"
#	psql -h localhost -U user postgres_db
#	\dt for overview of all tables
#	SELECT * FROM "table you want to see";
#

stop:
	docker compose -f $(DEV) stop
	docker compose -f $(PROD) stop

down:
	docker compose down

ps:
	docker compose ps

clean:
	docker volume rm $(FOLDER_NAME)_postgres-data

fclean: down clean
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