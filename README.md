# CanUMeetMe (canumeet.me)

[todo]: # (add build status badge here)

![CanUMeetMe](client/src/assets/logo.png)

Online collaborative tool that facilitates meeting scheduling, built using Node.js, NestJS, Prisma, PostgreSQL, and React.

## Table of Contents

- [Initial Setup](#initial-setup)
  - [Requirements](#requirements)
  - [API](#api)
  - [Frontend](#frontend)
- [Running](#running)
- [Testing](#testing)
- [Seed Data](#seed-data)

## Initial Setup

### Requirements

- Node.js
- npm
- PostgreSQL

### API

1. **Navigate to the `server` directory:**
    ```bash
    cd server
    ```

2. **Initialize the npm project:**
    ```bash
    npm install
    ```

3. **Set up your `.env` file inside the root directory:**
    ```env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    ```

4. **Generate the Prisma client:**
    ```bash
    npx prisma generate
    ```

5. **Run the migration:**
    ```bash
    npx prisma migrate dev
    ```

6. **Run the seed command:**
    ```bash
    npx prisma db seed
    ```

### Frontend

1. **Navigate to the `client` directory:**
    ```bash
    cd client
    ```

2. **Initialize the npm project:**
    ```bash
    npm install
    ```

3. **Set up your `.env` file inside the `client` directory:**
    ```env
    REACT_APP_API_URL="http://localhost:3000/api"
    ```

## Running

To run the server, use the following command:

```bash 
cd server
npm run dev
```

To see the API documentation and test the endpoints using Swagger UI, navigate to `http://localhost:3000/api` in your browser.

To run the client, use the following command:

```bash
cd client
npm start
```

## Testing

*work in progress*

## Seed Data

*work in progress*