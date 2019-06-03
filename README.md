# Instantly Generate OAS 3.0 compliant APIs 🔥

![Sugar Generator - API Edition](./logo.png)


## Features 🙉
- Generates simple Nodejs code
- Uses Mongodb with Mongoose ORM
- Easy to build / deploy
- Dockerfile included
- Generates CRUD APIs
  - create
  - get (many, with pagination; supports search, sort, filter, pagination out of the box)
  - getOne
  - update
  - delete

## What it's good at 🙊

- Generating an initial API
- Microservice oriented
- Ready to deploy (build with docker => deploy)

## What it's not good at (yet) 🙈

- idempotent changes (i.e. it doesn't know if you wrote code in there or changed things around)
- working with modified code
- populating table joins
- custom actions inside controller functions

## TODO

- generator tests
- tests for generated code
- other databases?
- **your ideas?**
- react components for the api?!?!


# How It Works

1. Feed it a json schema (see below's [Example Schema](#Example-Schema))
2. Name it
3. Tell it where to put the code.
4. Build your generated code with the docker file
5. Deploy it and move on

## Generate api endpoint

```sh
node index.js \
--type api \
--name user \
--schema ./samples/user.json \
--destination /wrannaman/generator
```


## Example Schema

```js
{
  "schema": {
    "first_name": {
      "type": "String",
      "default": ""
    },
    "last_name": {
      "type": "String",
      "default": ""
    },
    "email": {
      "type": "String",
      "trim": true,
      "required": true,
      "unique": true,
      "immutable": true, // Don't let this change from api on update
    },
    "password": {
      "type": "String",
      "trim": true,
      "select": false,
      "immutable": true, // Don't let this change from api on update
    },
    "intro": {
      "type": "Boolean",
      "default": false
    },
    "team": {
      "type": "ObjectId", // This references another collection
      "ref": "Team"
    },
    "sub": {
      "one": {
        "type": "String",
        "trim": true,
        "required": true
      },
      "two": {
        "type": "Number",
        "required": true
      }
    },
    "role": {
      "type": "String",
      "enum": ["user", "maker"],
      "default": "user"
    }
  },
  "statics": {
    "statuses": ["created", "under_review", "listed", "deleted"],
    "status": {
      "active": "active",
      "inactive": "inactive",
      "deleted": "deleted"
    }
  }
}

```


## Generated project structure

    .
    ├── configs                 # config file
    ├── connection              # db connections (mongo, redis)
    ├── controller              # Controllers
    │   ├── <model name>        # Functions (one file, one function) create, delete, update, get, getOne
    ├── models                  # db models
    ├── router                  # endpoint routes
    ├── tests                   # @TODO
