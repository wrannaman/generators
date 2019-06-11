const fs = require('fs');
const beautify = require('js-beautify').js;
const { uppercase } = require('../api/utils');
const uuid = require('uuid').v4;
module.exports = async ({ schema, destination }) => {
  const fileName = `${destination}/${uppercase(schema.name)}/${uppercase(schema.name)}CreateForm.js`;
  const componentName = `${uppercase(schema.name)}CreateForm`;

  const host = "http://localhost:8080";
  console.log('what to do about HOST', host)
  const code = [`
window.${componentName} = zoid.create({
    // The html tag used to render my component
    tag: '${schema.name}-create-form',
    // The url that will be loaded in the iframe or popup, when someone includes my component on their page
    url: '${host}/${componentName}.html',
    autoResize: {
      height: true,
      width: false,
    },
    dimensions: {
      width:  '100%',
      height: '100%'
    },
    attributes: {
      iframe: {
        scrolling: "no"
      }
    },
});

`];

  const pretty = beautify(code.join("\n"), { indent_size: 2, space_in_empty_paren: true });
  fs.writeFileSync(fileName, pretty);
};
