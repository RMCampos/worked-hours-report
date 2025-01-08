#!/bin/bash
# Client - Front-end

npm ci
if [ $? -eq 1 ]; then
  echo "Issues when installing dependencies. Please review.."
  exit 1
fi

if [ -z "$CHECK" ]; then
  npm start
else
  echo "Running checks..."
  echo "1/3 - Lint started..."
  npm run lint:fix
  if [ $? -eq 1 ]; then
    echo "Issues when running lint. Please review.."
    exit 1
  fi

  echo "2/3 - Build started..."
  npm run build
  if [ $? -eq 1 ]; then
    echo "Issues when running build. Please review.."
    exit 1
  fi

  echo "3/3 - Tests started..."
  npm run test
  if [ $? -eq 1 ]; then
    echo "Issues when running test. Please review.."
    exit 1
  fi

  echo "You're good to go! Good job!"
  exit 0
fi
