# Generators



## Generate api endpoint

```
nodemon index.js \
--type api \
--name user \
--schema ./samples/user.json \
--destination /var/andrew/generator
```


## Example Schema

```json
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
