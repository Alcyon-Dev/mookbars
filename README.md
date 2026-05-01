# Mookbars

A lightweight self-hosted bookmark page. Configure your links via environment
variables and Mookbars generates and serves a static HTML page.

## Playing with Mookbars locally

Copy the example env file, fill in your links, and run:

```sh
cp .env.example .env

# edit .env

docker run --rm --name mookbars --env-file .env -p 8007:8007 alcyondev/mookbars:latest
```

Open [http://localhost:8007](http://localhost:8007).

## Deploying Mookbars in production

Add the `alcyondev/mookbars:0.1` docker image to your favorite stack, configure
the environment variables, are you are done !

## Environment variables

### Page

| Variable       | Required | Default    | Description                                                               |
| -------------- | -------- | ---------- | ------------------------------------------------------------------------- |
| `MB_TITLE`     | No       | `Mookbars` | Page title and header                                                     |
| `MB_NO_HEADER` | No       | `false`    | Set to `true` to hide the header                                          |
| `MB_NO_FOOTER` | No       | `false`    | Set to `true` to hide the footer                                          |
| `MB_DELAY`     | No       | `0`        | Seconds to wait before generating (useful for testing during development) |

### Groups

Links are organised into groups. `MB_GROUPS` is a comma-separated list of group
keys.

| Variable               | Description                                               |
| ---------------------- | --------------------------------------------------------- |
| `MB_GROUPS`            | Comma-separated list of group keys, e.g. `db,tools,sites` |
| `MB_GROUP_<KEY>_TITLE` | Display title for a group                                 |
| `MB_GROUP_<KEY>_LINKS` | Comma-separated list of link keys for this group          |

### Links

| Variable              | Description              |
| --------------------- | ------------------------ |
| `MB_LINK_<KEY>_LABEL` | Display label for a link |
| `MB_LINK_<KEY>_URL`   | URL for a link           |

### Example

```env
MB_TITLE=My Bookmarks

MB_GROUPS=db,tools

MB_GROUP_db_TITLE=Database
MB_GROUP_db_LINKS=pgadmin,dbgate

MB_GROUP_tools_TITLE=Tools
MB_GROUP_tools_LINKS=console

MB_LINK_pgadmin_LABEL=PgAdmin
MB_LINK_pgadmin_URL=https://pgadmin.example.com

MB_LINK_dbgate_LABEL=DbGate
MB_LINK_dbgate_URL=https://dbgate.example.com

MB_LINK_console_LABEL=Console
MB_LINK_console_URL=https://console.example.com
```

## Development

Requires [just](https://github.com/casey/just).

```sh
just dev    # Start dev containers with live reload
just build  # Build the production image
just run    # Build and run the production image locally
```

## Deployment

```sh
just deploy 1.0  # Build the production image, tags git + Docker, pushes both
```
