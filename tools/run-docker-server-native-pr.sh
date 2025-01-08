#!/bin/bash

VERSION="$1"

echo "Received version $VERSION"

if [ ! -f "server/.env" ]; then
  echo "No env file found for back-end. Creating one for you.."
  bash tools/run-create-env.sh "back"
else
  echo "Env file in place. Moving on.."
fi

echo "Getting env vars and making them visible"
cd server/
export $(cat .env | xargs)
echo "Done!"

cd ..

DB_HOST=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' db)

docker run -d --rm \
  --name server \
  -p 8585:8585 \
  -p 5005:5005 \
  -e POSTGRES_DB=$POSTGRES_DB \
  -e POSTGRES_USER=$POSTGRES_USER \
  -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
  -e POSTGRES_PORT=$POSTGRES_PORT \
  -e POSTGRES_HOST=$DB_HOST \
  -e CORS_ALLOWED_ORIGINS=$CORS_ALLOWED_ORIGINS \
  -e SERVER_SERVLET_CONTEXT_PATH=$SERVER_SERVLET_CONTEXT_PATH \
  $VERSION
