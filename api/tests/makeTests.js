const fs = require('fs');
const mkdirp = require('mkdirp');
const beautify = require('js-beautify').js;

module.exports = ({ schema, destination, logging, name }) => {
  const { uppercase } = require('../utils');
  const fakeObject = require('./fakeObject');
  const randomPropertyChange = require('./randomPropertyChange');

  const modelFolder = `${destination}/test`;
  mkdirp.sync(modelFolder);
  const indexFile = `${modelFolder}/index.js`;

  const fake1 = fakeObject(schema);
  const fake2 = fakeObject(schema);
  const fake3 = fakeObject(schema);
  const { fake3A, changedKey } = randomPropertyChange(schema, fake3);
  const fake4 = fakeObject(schema);

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
  //Our parent block
  describe('${uppercase(name)}', () => {
      beforeEach((done) => {
          ${name}.deleteMany({}, (err) => {
             done();
          });
      });
  /*
    * Test the /GET route
    */
    describe('/GET ${name}', () => {
        it('it should GET all the ${name}s', (done) => {
          chai.request(server)
              .get('/${name}')
              .end((err, res) => {
                    res.should.have.status(200);
                    console.log('res body', res.body);
                    res.body.should.have.property('${name}');
                    res.body.${name}.docs.length.should.be.eql(0);
                    res.body.${name}.should.have.property('totalDocs');
                    res.body.${name}.should.have.property('limit');
                    res.body.${name}.should.have.property('offset');
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
                    res.body.${name}.should.have.include.keys("${Object.keys(fake1).join('","')}");
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
                         // res.body.should.have.property('message').eql('Book updated!');
                         res.body.${name}.should.have.property('${changedKey}').eql("${fake3A[changedKey]}");
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
