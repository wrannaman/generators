const fs = require('fs');
const mkdirp = require('mkdirp');
const beautify = require('js-beautify').js;

module.exports = ({ schema, destination, logging, name }) => {
  const { uppercase } = require('../utils');
  const fakeObject = require('./fakeObject');
  const graphqlSafe = require('./graphqlSafe');
  const randomPropertyChange = require('./randomPropertyChange');

  const modelFolder = `${destination}/test`;
  mkdirp.sync(modelFolder);
  const indexFile = `${modelFolder}/index.js`;

  const fake1 = fakeObject(schema);
  const fake2 = fakeObject(schema);
  const fake3 = fakeObject(schema);
  const { fake3A, changedKey } = randomPropertyChange(schema, fake3);
  const fake4 = fakeObject(schema);
  const fake5 = fakeObject(schema);
  const fake6 = fakeObject(schema);


  const g1 = fakeObject(schema, true);
  const g1fakeObject = g1.obj;
  const g1fakeString = g1.str;

  const g2 = fakeObject(schema, true);
  const g2fakeObject = g2.obj;
  const g2fakeString = g2.str;

  const g3 = fakeObject(schema, true);
  const g3fakeObject = g3.obj;
  const g3fakeString = g3.str;

  const gchanged = randomPropertyChange(schema, g3fakeObject);

  const g3AfakeObject = gchanged.fake3A;
  const gchangedKey = gchanged.changedKey;

  const code = `
  //During the test the env variable is set to test
  process.env.NODE_ENV = 'test';
  const mongoose = require("mongoose");
  const chai = require('chai');
  const chaiHttp = require('chai-http');

  const server = require('../index');
  const { ${name} } = require('../models');
  const should = chai.should();
  chai.use(chaiHttp);


  describe('GRAPHQL: ${uppercase(name)}', () => {
    beforeEach((done) => {
        [1].forEach(() => ${name}.create(${JSON.stringify(fakeObject(schema))}));
        setTimeout(() => {
          done()
        }, 1000)
    });


      describe('query ${name}s', () => {
          it('it should get all the ${name}s', (done) => {

            chai.request(server)
            .post('/graphql')
            .send({ query:\`
              query {
                ${name}s {
                  _id
                  ${changedKey}
                }
              }
            \` })
            .end((err, res) => {
                  const data = res.body.data;
                  res.should.have.status(200);
                  data.should.have.property('${name}s');
                  data.${name}s.length.should.be.above(3);
                  data.${name}s[0].should.have.property('${changedKey}');
                  data.${name}s[0].should.have.property('_id');
              done();
            });
          });
      });

      describe('mutation create${uppercase(name)}', () => {
          it('it should create a ${name}', (done) => {

            chai.request(server)
            .post('/graphql')
            .send({ query: \`
              mutation {
                createMonkey(${g1fakeString}) {
                  _id
                  first_name
                  last_name
                  isDead
                }
              }
            \` })
            .end((err, res) => {
                  const data = res.body.data;
                  res.should.have.status(200);
                  data.should.have.property('create${uppercase(name)}');
                  data.create${uppercase(name)}.should.have.property('first_name');
                  data.create${uppercase(name)}.should.have.property('last_name');
                  data.create${uppercase(name)}.should.have.property('isDead');
                  data.create${uppercase(name)}.should.not.have.property('age');
                  data.create${uppercase(name)}.first_name.should.eql('${g1fakeObject.first_name}');
              done();
            });
          });
      });


      describe('query get one ${uppercase(name)}', () => {
          it('it should create then get the created ${name}', (done) => {
            chai.request(server)
            .post('/graphql')
            .send({ query: \`
              mutation {
                createMonkey(${g2fakeString}) {
                  _id
                }
              }
            \` })
            .end((err, res) => {

              const data = res.body.data;
              res.should.have.status(200);
              data.should.have.property('create${uppercase(name)}');
              data.create${uppercase(name)}.should.have.property('_id');
              const createdID = data.create${uppercase(name)}._id;
              chai.request(server)
              .post('/graphql')
              .send({ query: \`
                query {
                  ${name}(_id: "\${createdID}") {
                    _id
                    ${changedKey}
                  }
                }
              \`})
              .end((err, res) => {
                  const data = res.body.data;
                  res.should.have.status(200);
                  data.should.have.property('${name}');
                  data.${name}.should.have.property('${changedKey}');
                  data.${name}.should.have.property('_id');
                  data.${name}._id.should.eql(createdID);
                done();
              });

            });
          });
      });


      describe('mutate ${uppercase(name)}', () => {
          it('it should create then mutate ${name}', (done) => {

            chai.request(server)
            .post('/graphql')
            .send({ query: \`
              mutation {
                create${uppercase(name)}(${g3fakeString}) {
                  _id
                }
              }
            \` })
            .end((err, res) => {
              const data = res.body.data;
              res.should.have.status(200);
              data.should.have.property('create${uppercase(name)}');
              data.create${uppercase(name)}.should.have.property('_id');
              const createdID = data.create${uppercase(name)}._id;

              chai.request(server)
              .post('/graphql')
              .send({ query: \`
                mutation {
                  update${uppercase(name)}(_id: "\${createdID}", ${gchangedKey}: ${graphqlSafe(g3AfakeObject[gchangedKey])}) {
                    _id
                    ${gchangedKey}
                  }
                }
              \`})
              .end((err, res) => {
                  const data = res.body.data;
                  res.should.have.status(200);
                  data.should.have.property('update${uppercase(name)}');
                  data.update${uppercase(name)}.should.have.property('${gchangedKey}');
                  data.update${uppercase(name)}.should.have.property('_id');
                  // const changedString = String(data.update${uppercase(name)}.${gchangedKey})
                  // changedString.should.eql("${fake3A[changedKey]}");
                done();
              });

            });
          });
      });

  });



  describe('REST: ${uppercase(name)}', () => {
    beforeEach((done) => {
        ${name}.deleteMany({}, (err) => {
          done()
        });
    });
  /*
    * Test the /GET route
    */
    describe('/GET ${name}', () => {
        it('it should GET all the ${name}s', (done) => {
          chai.request(server)
              .get('/${name}s')
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('${name}s');
                    res.body.${name}s.docs.length.should.be.eql(0);
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
    describe('/POST ${name}', () => {
        it('it should POST an empty ${name}', (done) => {
          const _${name} = {}
          chai.request(server)
              .post('/${name}')
              .send(_${name})
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('${name}');
                done();
              });
        });
    });

    /*
    * Test the /POST route
    */
    describe('/POST ${name}', () => {
        it('it should POST a ${name}', (done) => {
          const _${name} = ${JSON.stringify(fake1)};
          chai.request(server)
              .post('/${name}')
              .send(_${name})
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('${name}');
                    res.body.${name}.should.include.keys("${Object.keys(fake1).join('","')}");
                done();
              });
        });
    });

    /*
     * Test the /GET/:id route
     */
     describe('/GET/:id ${name}', () => {
         it('it should GET a ${name} by the given id', (done) => {
             let _${name} = new ${name}(${JSON.stringify(fake2)});
             _${name}.save((err, ${name}) => {
                 chai.request(server)
               .get('/${name}/' + ${name}.id)
               .send(${name})
               .end((err, res) => {
                     res.should.have.status(200);
                     res.body.should.be.a('object');
                     res.body.${name}.should.have.include.keys("${Object.keys(fake1).join('","')}");
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
              const _fake5 = new ${name}(${JSON.stringify(fake5)});
              _fake5.save((err, inner5) => {
                const _fake6 = new ${name}(${JSON.stringify(fake6)});
                _fake6.save((err, inner6) => {
                    chai.request(server)
                    .get('/${name}s')
                    .end((err, res) => {
                          res.should.have.status(200);
                          res.body.should.be.a('object');
                          res.body.${name}s.should.have.include.keys("docs", "totalDocs", "limit");
                          res.body.${name}s.should.have.property('docs')
                          res.body.${name}s.docs.should.be.a('array');
                          res.body.${name}s.docs[0].should.have.include.keys("${Object.keys(fake1).join('","')}");
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
             const _${name} = new ${name}(${JSON.stringify(fake3)})
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
             const _${name} = new ${name}(${JSON.stringify(fake4)})
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

  fs.writeFileSync(indexFile, pretty);
}
