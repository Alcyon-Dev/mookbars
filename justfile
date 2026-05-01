set dotenv-load := false

default:
    @just --list

dev:
    @if [ ! -f .env ]; then cp .env.example .env; fi
    @MB_VERSION=$(git describe --tags --always) docker compose -f docker-compose.yml up --build --remove-orphans

build:
    @docker build -t alcyondev/mookbars --build-arg MB_VERSION=$(git describe --tags --always) .

run:
    @just build
    @docker run --rm --name mookbars --env-file .env -p 8007:8007 alcyondev/mookbars

deploy version:
  @git tag -a {{version}} -m "{{version}}"
  @git push --tags
  @just build
  @docker tag alcyondev/mookbars alcyondev/mookbars:{{version}}
  @docker tag alcyondev/mookbars alcyondev/mookbars:latest
  @docker push alcyondev/mookbars:{{version}}
  @docker push alcyondev/mookbars:latest