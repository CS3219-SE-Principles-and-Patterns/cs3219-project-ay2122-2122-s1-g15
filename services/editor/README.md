# Editor Service

## Overview

Editor service provide functionalities for a real-time collaborative editor with [ShareDB](https://share.github.io/sharedb/) for the implementation of Operational Transformations and [Quill](https://quilljs.com/) to provide a rich text editor.

# Set Up Guide

## Installing Dependencies

Run `npm install` to install dependencies

## Running Locally

1. After installing dependencies, run `npm start` to start the application.
2. The application should be started on http://localhost:6001.

Note: .env file is included for the ease of reproducibility.

## Running Tests

Run `npm run test` to execute tests.

## Endpoints

### Getting all existing Connections

GET request to http://localhost:6001/editor/api/connection/

### Creating a new Connection

POST request to http://localhost:6001/editor/api/connection/

Example request body:
```
{
    "session_id": "1234"
}
```

### Getting Connection with session_id

GET request to http://localhost:6001/editor/api/connection/:session_id

### Deleting a Connection

DELETE request to http://localhost:6001/editor/api/connection/:session_id