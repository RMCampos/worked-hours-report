# Tools

All kind of tools and useful links and commands can be found here!

## Links

- **GitHub Container Registry:** https://ghcr.io/
- **Time tracking:** https://track.toggl.com/timer

## Building locally

**Client - Frontend Web App:**

Before building, you need define some env vars:

```bash
export VITE_BUILD=<branch-name-and-PR-number>
```

Then you can call the install and build scripts (from the `client` folder):

```bash
npm ci --ignore-scripts --no-update-notifier --omit=dev \
 && npm run build \
 && rm -rf node_modules
```

That's it!

**Server - Backend REST API:**

For the backend there's a Dockerfile ready, just run (from the project root):

```bash
docker build -t server ./server
```

That's it!

## Deploying manually

1. Connect into the server via SSH
2. Run deploy scripts

Here are a few steps:

```bash
export SERVER_IP=
export SERVER_ADDRESS=

npm ci --ignore-scripts --no-update-notifier --omit=dev
export VITE_BACKEND_SERVER=$SERVER_ADDRESS/server
npm run build
zip -r "client_$VERSION.zip" dist/
scp "client_$VERSION.zip" root@$SERVER_IP:/root/
```

## Running with Docker

**DB:**

```bash
docker run -d --rm \
  --name db \
  --network=host \
  -e POSTGRES_DB=$POSTGRES_DB \
  -e POSTGRES_USER=$POSTGRES_USER \
  -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
  -e PGDATA=/tmp \
  -v ./data:/tmp \
  postgres:15.8-bookworm
```

**Server:**

```bash
docker run -d --rm \
  --name server \
  --network=host \
  -e POSTGRES_DB=$POSTGRES_DB \
  -e POSTGRES_USER=$POSTGRES_USER \
  -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
  -e POSTGRES_PORT=$POSTGRES_PORT \
  -e POSTGRES_HOST=$POSTGRES_HOST \
  -e CORS_ALLOWED_ORIGINS=$CORS_ALLOWED_ORIGINS \
  ghcr.io/ricardo-campos-org/react-typescript-todolist/server:<PR-Number>
```

Build Cloud Native: `./mvnw -B package -Pnative -DskipTests`

**Client:**

The frontend app will run on Nginx.

## Interacting with GitHub Package and Container Registry

**Login in:**

```
export CR_PAT=YOUR_TOKEN
echo $CR_PAT | docker login ghcr.io -u RMCampos --password-stdin
```

**Pulling images:**

```sh
docker pull ghcr.io/ricardo-campos-org/react-typescript-todolist/client:50
docker pull ghcr.io/ricardo-campos-org/react-typescript-todolist/server:50
```

- Get container IP
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' db
