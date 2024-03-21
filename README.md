# NestJS template

This is a template to start a new NestJS project.

# Getting started

```bash
$ npm install -g pnpm nx @nestjs/cli
$ pnpm install
$ nx serve apps/backend
```

# Useful commands

```bash
// Display the graph of component dependencies
$ nx graph

// Run the application in watch mode
$ nx serve apps/backend

// Format all the monorepository
$ nx format --all

// Lint all the source code
$ nx run-many --target lint

// Lint the OpenAPI specification
$ nx run-many --target lint:api

// Run all tests
$ nx run-many --target test

// Check the test coverage
$ nx run-many --target test:coverage --verbose --parallel 1

// Delete all generated files
$ nx run-many --target clear

// Build the application
$ nx build apps/backend

// Build the Docker image
$ nx docker:build apps/backend

// Run the Docker image locally
$ nx docker:start apps/backend

// Kill the running Docker image
$ docker rm -f backend
```
