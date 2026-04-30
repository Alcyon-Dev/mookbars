set dotenv-load := false

default:
    @just --list

dev:
    docker compose -f docker-compose.dev.yml up --build --remove-orphans

#build:
#    docker build -t mookbars --build-arg VERSION=$(git describe --tags --always) .

#run:
#    VERSION=$(git describe --tags --always) MB_ENV_FILE={{env}} docker compose up --build --remove-orphans
