#!/bin/bash

if [ ! -f "server/.env" ]; then
  echo "No env file found for front-end. Creating one for you.."
  bash tools/run-create-env.sh "front"
else
  echo "Env file in place. Moving on.."
fi

echo "Getting env vars and making them visible"
cd client/
export $(cat .env | xargs)
echo "Done!"

cd ..

docker build --file client/Dockerfile.dev --tag client:nightly .

if [ $? -eq 1 ]; then
  echo "Issues when building Docker image. Please review.."
  exit 1
fi

SERVER_HOST="http://"$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' server)":8585"

if [ "$SERVER_HOST" == "http://:8585" ]; then
  echo "Back-end server not running. Make sure to run it before starting the web app."
  exit 0
fi

echo "SERVER_HOST=$SERVER_HOST"

docker run -d --rm \
  --name client \
  -p 5000:5000 \
  -e VITE_BACKEND_SERVER="$SERVER_HOST" \
  -e VITE_BUILD="$VITE_BUILD" \
  -v ./client:/app \
  client:nightly  
