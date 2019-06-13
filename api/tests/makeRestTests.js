const fs = require('fs');
const beautify = require('js-beautify').js;
const { uppercase } = require('../utils');

module.exports = ({ originalSchema, schema, destination, logging, }) => {
  const fakeObject = require('./fakeObject');
  const randomPropertyChange = require('./randomPropertyChange');

  const name = schema.name;
  schema = schema.schema;
  const modelFolder = `${destination}/test`;
  const testFile = `${modelFolder}/${name}-rest.js`;

  const fake1 = fakeObject(schema);
  const fake2 = fakeObject(schema);
  const fake3 = fakeObject(schema);
  const { fake3A, changedKey } = randomPropertyChange(schema, fake3);
  const fake4 = fakeObject(schema);
  const fake5 = fakeObject(schema);
  const fake6 = fakeObject(schema);

  const s = schema;
  const jsonSchema = JSON.stringify(s);

  const code = `
  //During the test the env variable is set to test
  process.env.NODE_ENV = 'test';
  const mongoose = require("mongoose");
  const chai = require('chai');
  const chaiHttp = require('chai-http');

  const server = require('../index');
  const ${uppercase(name)} = require('../models/${uppercase(name)}');
  const should = chai.should();
  chai.use(chaiHttp);


  const genData = (type, value, isEnum = false) => {
    if (isEnum) return isEnum[0];
    if (!type) {
      return subDocHelper(value);
    }
    switch (type.toLowerCase()) {
      case 'string':
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      case 'number':
        return Math.floor(Math.random() * 1000);
      case 'object':
        return { hi: true, cool: "okay", bean: 123 };
      case 'boolean':
        return Math.floor(Math.random() * 1000) > 500 ? true : false;
      case 'enum':
      default:

    }
  };

  const subDocHelper = (obj) => {
    if (!obj) throw new Error('subdocument is undefined');
    let fake = {};
    if (Array.isArray(obj)) {
      fake = [];
      obj.forEach((o) => {
        if (o.type) {
          fake.push(genData(o.type));
        } else {
          Object.keys(o).forEach(key => {
            fake.push({ [key]: genData(o[key].type) });
          });
        }
      });
    } else {
      Object.keys(obj).forEach(key => {
        fake[key] = genData(obj[key].type);
      });
    }
    return fake;
  };

  const fakeObject = (schema, asString = false) => {
    const fakeObject = {};
    Object.keys(schema).forEach((key) => {
      fakeObject[key] = genData(schema[key].type, schema[key], schema[key].enum);
    });

    if (!asString) return fakeObject;

    // into string
    const str = [];
    Object.keys(fakeObject).forEach(key => {

      const value = schema[key].type === 'String' ? \`"\${fakeObject[key]}"\` : fakeObject[key];
      const isObject = typeof value === 'object';
      let abstractedValue = value;
      if (isObject) {
        if (asString) {
          const _str = [];
          Object.keys(value).forEach(_key => {
            _str.push(\`\${_key}: \${value[_key]}\`);
          });
          abstractedValue = \`" \${_str.join(', ')} "\`;
        }
      }
      str.push(\`\${key}: \${abstractedValue}\`);
    });
  };

  describe('REST: ${uppercase(name)}', () => {
    before((done) => {
      ${uppercase(name)}.deleteMany({}, () => {})
      setTimeout(() => {
        [1,2,3,4,5].forEach(() => {
          const obj = fakeObject(${jsonSchema});
          ${uppercase(name)}.create(obj)
        });
        done()
      }, 1000)
    });
  /*
    * Test the /GET route
    */
    describe('/GET ${uppercase(name)}', () => {
        it('it should GET all the ${uppercase(name)}s', (done) => {
          chai.request(server)
              .get('/${name}s')
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('${name}s');
                    res.body.${name}s.docs.should.have.lengthOf(5);
                    res.body.${name}s.should.have.property('totalDocs');
                    res.body.${name}s.should.have.property('limit');
                    res.body.${name}s.should.have.property('offset');
                done();
              });
        });
    });

    /*
    * Test the /POST route
    */
    describe('/POST ${uppercase(name)}', () => {
        it('it should POST a ${uppercase(name)}', (done) => {
          const _${name} = ${JSON.stringify(fake1)};
          chai.request(server)
              .post('/${name}')
              .send(_${name})
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('${name}');
                    res.body.${name}.should.include.any.keys("${Object.keys(fake1).join('","')}");
                done();
              });
        });
    });

    /*
     * Test the /GET/:id route
     */
     describe('/GET/:id ${name}', () => {
         it('it should GET a ${name} by the given id', (done) => {
             let _${name} = new ${uppercase(name)}(${JSON.stringify(fake2)});
             _${name}.save((err, ${name}) => {
                 chai.request(server)
               .get('/${name}/' + ${name}.id)
               .send(${name})
               .end((err, res) => {
                     res.should.have.status(200);
                     res.body.should.be.a('object');
                     res.body.${name}.should.have.include.any.keys("${Object.keys(fake1).join('","')}");
                     res.body.${name}.should.have.property('_id').eql(${name}.id);
                 done();
               });
             });

         });
     });

     /*
      * Test the /GET route
      */
      describe('/GET/ ${name}s', () => {
          it('it should GET many ${name}s', (done) => {
              const _fake5 = new ${uppercase(name)}(${JSON.stringify(fake5)});
              _fake5.save((err, inner5) => {
                const _fake6 = new ${uppercase(name)}(${JSON.stringify(fake6)});
                _fake6.save((err, inner6) => {
                    chai.request(server)
                    .get('/${name}s')
                    .end((err, res) => {
                          res.should.have.status(200);
                          res.body.should.be.a('object');
                          res.body.${name}s.should.have.include.keys("docs", "totalDocs", "limit");
                          res.body.${name}s.should.have.property('docs')
                          res.body.${name}s.docs.should.be.a('array');
                          res.body.${name}s.docs[0].should.have.include.any.keys("${Object.keys(fake1).join('","')}");
                      done();
                    });
                  });
              });
          });
      });

     /*
     * Test the /PUT/:id route
     */
     describe('/PUT/:id ${name}', () => {
         it('it should UPDATE a ${name} given the id', (done) => {
             const _${name} = new ${uppercase(name)}(${JSON.stringify(fake3)})
             _${name}.save((err, ${name}) => {
                   chai.request(server)
                   .put('/${name}/' + ${name}.id)
                   .send(${JSON.stringify(fake3A)})
                   .end((err, res) => {
                         res.should.have.status(200);
                         res.body.should.be.a('object');
                         res.body.should.have.property('${name}')

                         const stringCheck = String(res.body.${name}.${changedKey})
                         stringCheck.should.equal("${fake3A[changedKey]}");
                     done();
                   });
             });
         });
     });

     /*
     * Test the /DELETE/:id route
     */
     describe('/DELETE/:id ${name}', () => {
         it('it should DELETE a ${name} given the id', (done) => {
             const _${name} = new ${uppercase(name)}(${JSON.stringify(fake4)})
             _${name}.save((err, ${name}) => {
                   chai.request(server)
                   .delete('/${name}/' + ${name}.id)
                   .end((err, res) => {
                         res.should.have.status(200);
                         res.body.should.be.a('object');
                         res.body.should.have.property("${name}");
                         res.body.${name}.should.be.a('object');
                         res.body.${name}.should.have.property('_id').eql(_${name}.id);
                     done();
                   });
             });
         });
     });
  });
  `;
  const pretty = beautify(code, { indent_size: 2, space_in_empty_paren: true });
  fs.writeFileSync(testFile, pretty);
};
