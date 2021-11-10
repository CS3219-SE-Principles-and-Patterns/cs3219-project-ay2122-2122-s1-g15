# Matching Service

## Overview

The Matching Service is responsible for receiving match requests, finding a match for users, as well as creating and transmitting the necessary session information required for a session to take place.

# Set Up Guide

## Navigate to the `matching` directory

Run `cd services/matching` from the root of the project.

## Installing Dependencies

Run `npm install` to install dependencies

## Running Locally

1. After installing dependencies, run `npm start` to start the application.
2. The service should be started on http://localhost:4000.

Note: .env file is included for the ease of reproducibility.

## Endpoints

### Submitting a Match Request

POST request to http://localhost:4000/matching/api/match/submit

Request Body:
```
{
    "user": Object,
    "difficulty": String
}
```

**Response**

**200**: Match Request accepted

**400**: Missing fields in request body, or invalid difficulty given

### Cancels a Match Request

PUT request to http://localhost:4000/matching/api/match/cancel

**Request Body:**
```
{
    "requestId": String
}
```

**Response**

**200**: Match Request cancelled

**400**: Invalid or missing requestId provided

### Finding a Match

PUT request to http://localhost:4000/matching/api/match/find

Request Body:
```
{
    "requestId": String
}
```

**Response**

**200**: Match found for user

**400**: Invalid or missing requestId provided
