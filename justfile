set dotenv-load := false

default:
    @just --list

dev:
    @if [ ! -f .env ]; then cp .env.example .env; fi
    @MB_VERSION=$(git describe --tags --always) docker compose -f docker-compose.yml up --build --remove-orphans

build:
    @docker build -t alcyondev/mookbars --build-arg MB_VERSION=$(git describe --tags --always) .

run:
    @docker build -t alcyondev/mookbars --build-arg MB_VERSION=$(git describe --tags --always) .
    @docker run --rm --name mookbars --env-file .env -p 8007:8007 mookbars
