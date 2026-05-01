set dotenv-load := false

[private]
default:
    @just --list --unsorted

[group('Development')]
dev:
    @if [ ! -f .env ]; then cp .env.example .env; fi
    @MB_VERSION=$(git describe --tags --always) docker compose -f docker-compose.yml up --build --remove-orphans

[group('Build')]
build image="alcyondev/mookbars":
    @docker build -t {{image}} --build-arg MB_VERSION=$(git describe --tags --always) .

[group('Build')]
run image="alcyondev/mookbars":
    @just build {{image}}
    @docker run --rm --name mookbars --env-file .env -p 8007:8007 {{image}}

[group('Deployment')]
deploy version image="alcyondev/mookbars":
  @git tag -a {{version}} -m "{{version}}"
  @git push --tags
  @just build {{image}}
  @docker tag {{image}} {{image}}:{{version}}
  @docker tag {{image}} {{image}}:latest
  @docker push {{image}}:{{version}}
  @docker push {{image}}:latest
