const fs = require('fs');
const beautify = require('js-beautify').js;
const { uppercase } = require('../utils');

module.exports = ({ destination, flavor, name }) => {
  const modelFolder = `${destination}/graphql`;
  const indexFile = `${modelFolder}/resolvers.js`;
  const code = `
    const ${uppercase(name)} = require('../models/${name}');
    const prepare = require('./prepare');
    const { ObjectId } = require('mongodb');

    module.exports = {
      Query: {
        ${name}: async (root, {_id}) => {
          // // @TODO Permissions,
          // if (!permission) throw new Error('Permission denied for userCan getOne ${name}');,
          return await ${uppercase(name)}.findOne({ _id });
        },
        ${name}s: async () => {
          // // @TODO Permissions,
          // const permission = userCan('get', '${name}', req.user, args);,
          // if (!permission) throw new Error('Permission denied for userCan get ${name}');,
          return await ${uppercase(name)}.find({});
        },
      },
      Mutation: {
        create${uppercase(name)}: async (root, args, context, info) => {
          // // @TODO Permissions,
          // const permission = userCan('create', '${name}', req.user, args);,
          // if (!permission) throw new Error('Permission denied for userCan create ${name}');,
          const new${uppercase(name)} = await ${uppercase(name)}.create(args);
          return new${uppercase(name)};
        },
        update${uppercase(name)}: async (root, args, context, info) => {
          const argscopy = Object.assign({}, args);
          delete argscopy._id;
          let getOne = await ${uppercase(name)}.findOne({ _id: args._id });

          Object.keys(args).forEach(key => getOne[key] = args[key]);
          // // @TODO Permissions,
          // const permission = userCan('update', '${name}', req.user, args);,
          // if (!permission) throw new Error('Permission denied for userCan update ${name}');,
          await getOne.save();
          return getOne;
        },
        delete${uppercase(name)}: async (root, args, context, info) => {
          const getOne = await ${uppercase(name)}.findOne({ _id: args._id });
          // // @TODO Permissions,
          // const permission = userCan('delete', '${name}', req.user, args);,
          // if (!permission) throw new Error('Permission denied for userCan delete ${name}');,
          if (!getOne) throw new Error('not found')
          await getOne.delete();
          return getOne;
        },
      },
    };


  `;

  // if (logging) console.log('checking user-can');
  if (!fs.existsSync(modelFolder)) {
    // if (logging) console.log('creating user-can');
    fs.mkdirSync(modelFolder);
  }
  const pretty = beautify(code, { indent_size: 2, space_in_empty_paren: true });
  fs.writeFileSync(indexFile, pretty);
};
