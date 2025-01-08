# 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

This project is an opensource project, meaning you can contribute as many times as you want! We work with the **Fork & Merge** flow.

If you want to contribute, please create a fork and a Merge Request. Take a look [here to learn more.](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork)

## Steps to Contribute

1. Fork the Project
2. Clone it on your local (`git clone https://github.com/ricardo-campos-org/react-typescript-todolist`)
3. Develop your amazing feature/changes
4. Make sure your name is set (`git config user.name 'YOUR NAME'; git config user.email 'YOUR EMAIL'`)
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the Branch (`git push`)
7. Open a Merge Request

## 🏃‍♀️ Running locally

> If your OS is Microsoft Windows, make sure to run this on a Linux VM over WSL2.

The easiest way of having the app up and running is using [Docker](https://www.docker.com/). Once you're all set, follow these steps to see it live locally:

1. Start the database engine (PostgreSQL)
   ```sh
   bash tools/run-docker-db.sh
   ```
2. Start the back-end engine (Java & Spring Boot)
   ```sh
   bash tools/run-docker-server.sh
   ```
3. Start the app server
   ```sh
   bash tools/run-docker-client.sh
   ```

>  Remember to follow up logs with 'docker ps' and 'docker logs -f <name>'

If everything went well, you can head to [http://localhost:5000](http://localhost:5000) and create your user.

## 🦾 Automation

Once you finish your changes, just create a Merge Request to get started.

This project has workflows to ensure quality code, including linting, testing and security checks. Your changes will be merged only after all check passes.

You can check locally if changes are passing:

1. Back-end
   ```sh
   bash tools/check-backend.sh
   ```
2. Front-end
   ```sh
   bash tools/check-frontend.sh
   ```

>  Remember to follow up logs with 'docker ps' and 'docker logs -f <name>'

## Debugging Java

You might need to create a `launch.json` file. Here's a working one

```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "java",
      "name": "Debug (Attach)",
      "request": "attach",
      "hostName": "localhost",
      "port": 5005
     }
  ]
}
```
