
# Raz App Backend

Codebase containing CRUD and auth to provide client side for our [project](##Related) 

![Raz](https://drive.google.com/uc?export=view&id=1FcgncPq7HGnaEXO0tmrE6r2ZykxhtSF)

[![express](https://img.shields.io/npm/v/react-router-dom?label=express)](https://www.npmjs.com/package/express)
[![bcrypt](https://img.shields.io/badge/bcrypt-5.0.1-blue)](https://www.npmjs.com/package/bcrypt)
[![nodemailer](https://img.shields.io/badge/nodemailer-6.7.3-blue)](https://www.npmjs.com/package/nodemailer)
[![jsonwebtoken](https://img.shields.io/badge/jsonwebtoken-8.5.1-blue)](https://www.npmjs.com/package/jsonwebtoken)
[![multer](https://img.shields.io/badge/multer-1.4.4-blue)](https://www.npmjs.com/package/multer)
[![cors](https://img.shields.io/badge/cors-2.8.5-blue)](https://www.npmjs.com/package/cors)

# Installation

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


# Configuration DB

## Deploy

[Heroku](https://raz-furniture-backend.herokuapp.com)

## Screenshot

<div align="center">
<img width="500" src="https://drive.google.com/file/d/1JGGu6ursmkqwlLVFCvNh-Bi3dR34p5Qy/view?usp=sharing" alt="Home page">

<img width="300" src="https://drive.google.com/file/d/1utTXOmKdl3c54jpnxFMIDyPr5ctcAiDW/view?usp=sharing" alt="page">
</div>

## Authors

- [@okidwijaya]( https://github.com/okidwijaya)
- [@anshoriacc]( https://github.com/anshoriacc)
- [@ahmadFauzan]( https://github.com/special-snowflake)
- [@fajarpratama](https://github.com/ikehikeh151)


## Related

Here are some related projects

[click here - README](https://github.com/anshoriacc/raz-webapp-nextjs)
