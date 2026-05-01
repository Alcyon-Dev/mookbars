set dotenv-load := false

default:
    @just --list

dev:
    @if [ ! -f .env ]; then cp .env.example .env; fi
    @MB_VERSION=$(git describe --tags --always) docker compose -f docker-compose.dev.yml up --build --remove-orphans

#build:
#    docker build -t mookbars --build-arg VERSION=$(git describe --tags --always) .

#run:
#    VERSION=$(git describe --tags --always) MB_ENV_FILE={{env}} docker compose up --build --remove-orphans
