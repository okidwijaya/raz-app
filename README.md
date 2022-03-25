> ### Example Node (Express + mySql) codebase containing CRUD and auth to provide client side for our project https://github.com/anshoriacc/raz-webapp-nextjs


# Getting started

To get the Node server running locally:

- Clone this repo
- `npm install` to install all required dependencies
- `npm run dev` to start the local server


## Dependencies

- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - For generating JWTs used by authentication

## Application Structure

- `app.js` - The entry point to our application. This file defines our express server and connects it to MongoDB using mongoose. It also requires the routes and models we'll be using in the application.
- `config/` - This folder contains configuration for passport as well as a central location for configuration/environment variables.
- `routes/` - This folder contains the route definitions for our API.
- `models/` - This folder contains the schema definitions for our sql models.
- `controller/` - This folder contains the schema definitions for unctions that separate out the code to route requests from the code that actually processes requests.
- `middleware/` - This folder contains the schema definitions for middleware .

## Documentation

[Documentation](https://www.postman.com/collections/4d374ffde5756cac4265)


## Features

- CRUD data transaction, user and product
    - create transaction an
    - create and update user
    - forgot password
    - update password
    - get product list
    - manage product -- update and delete

## Authentication

Requests are authenticated using the `Authorization` header with a valid JWT. We define two express middlewares in `routes/auth.js` that can be used to authenticate requests. The `required` middleware configures the `express-jwt` middleware using our application's secret and will return a 401 status code if the request cannot be authenticated. The payload of the JWT can then be accessed from `req.payload` in the endpoint. The `optional` middleware configures the `express-jwt` in the same way as `required`, but will *not* return a 401 status code if the request cannot be authenticated.


## API Reference Example

```http
  GET, POST /products
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | :------------------------- |


```http
  GET, POST, PATCH, DELETE /products/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | :-------------------------------- |

```http
  GET, POST, UPDATE /transasction
```

| Parameter | value    | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | :------------------------- |

```http
  DELETE /transasction/${id}
```

| Parameter | value    | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `number` | :------------------------- |


## ENVIRONMENT VARIABLE

# App name
APP_NAME = # default App Name


# JWT
JWT_ACCESS_TOKEN_EXPIRATION_MINUTES = # default 240 minutes


# Configuration DB
HOST = "localhost"
USER = "root"
PASS = " "
DB = "your db"

SECRET_KEY="Your secret key"
ISSUER="Your issuer"


## Authors

- [@okidwijaya]( https://github.com/okidwijaya)
- [@anshoriacc]( https://github.com/anshoriacc)
- [@ahmadFauxan]( https://github.com/special-snowflake)
- [@fajarpratama](https://github.com/ikehikeh151   )