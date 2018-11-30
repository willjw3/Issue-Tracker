/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

chai.use(chaiHttp);

suite('Functional Tests', function() {
    var eyedee = '';
    var creator = 'Functional Test - Every field filled in';
    var assignee = 'Chai and Mocha';
    suite('POST /api/issues/{project} => object with issue data', function() {

      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isNotEmpty(res.body.issue_title);
          assert.isNotEmpty(res.body.issue_text);
          assert.isNotEmpty(res.body.created_by);
          assert.isNotEmpty(res.body.assigned_to);
          assert.isNotEmpty(res.body.status_text);
          done();
          eyedee = res.body._id;
        });
      });

      test('Required fields filled in', function(done) {
        chai.request(server)
         .post('/api/issues/test')
         .send({
           issue_title: 'Title',
           issue_text: 'text',
           created_by: 'Functional Test - Required fields filled in'
         })
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.isNotEmpty(res.body.issue_title);
           assert.isNotEmpty(res.body.issue_text);
           assert.isNotEmpty(res.body.created_by);
           done();
         });

      });

      test('Missing required fields', function(done) {
        chai.request(server)
         .post('/api/issues/test')
         .send({
           issue_title: 'Jakey',
           issue_text: 'shakey',
           created_by: ''
         })
         .end(function(err, res){
           assert.equal(res.status, 200);
           var count = 0;
           if (res.body.issue_title === '') {count += 1;}
           if (res.body.issue_text === '') {count += 1;}
           if (res.body.created_by === '') {count += 1;}
           assert.isAtLeast(count, 1);
           done();
         });
      });
    });

    suite('PUT /api/issues/{project} => text', function() {

      test('No body', function(done) {
        chai.request(server)
         .put('/api/issues/test')
         .send({
           _id: eyedee,
           issue_title: '',
           issue_text: '',
           created_by: '',
           assigned_to: '',
           status_text: ''
         })
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.equal(res.type, 'text/html');
           assert.equal(res.text, 'no updated field sent');
           done();
         });

      });

      test('One field to update', function(done) {
        chai.request(server)
         .put('/api/issues/test')
         .send({
           _id: eyedee,
           issue_title: '',
           issue_text: '',
           created_by: '',
           assigned_to: 'Kevin',
           status_text: ''
         })
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.equal(res.type, 'text/html');
           assert.equal(res.text, 'successfully updated');
           done();
           assignee = 'Kevin';
         });
      });

      test('Multiple fields to update', function(done) {
        chai.request(server)
         .put('/api/issues/test')
         .send({
           _id: eyedee,
           issue_title: '',
           issue_text: '',
           created_by: '',
           assigned_to: 'Sara',
           status_text: 'Updated Status'
         })
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.equal(res.type, 'text/html');
           assert.equal(res.text, 'successfully updated')
           done();
           assignee = 'Sara';
         });

      });

    });

    suite('GET /api/issues/{project} => Array of objects with issue data', function() {

      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });

      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({created_by: creator})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.equal(res.type, 'application/json');
          for (var i=0; i<res.body.length; i++) {
            assert.propertyVal(res.body[i], 'created_by', creator);
          }
          done();
        });

      });

      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({created_by: creator, assigned_to: assignee})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.equal(res.type, 'application/json');
          for (var i=0; i<res.body.length; i++) {
            assert.propertyVal(res.body[i], 'created_by', creator);
            assert.propertyVal(res.body[i], 'assigned_to', assignee);
          }
          done();
        });

      });

    });

    suite('DELETE /api/issues/{project} => text', function() {
      var theIds = ['scooby47', '5c00cc51e372832ac4899f40'];
      test('No _id (test for invalid ids or ids known not to be in the db)', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({_id: theIds[1] })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.type, 'text/html');
          var truthCheck = ObjectId.isValid(theIds[1]);
          if (truthCheck === false) {
            assert.equal(res.text, '_id error');
          }
          else {
            assert.equal(res.text, 'could not delete ' + theIds[1]);
          }
          done();
        });
      });

      test('Valid _id (known to be in the database)', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({_id: eyedee })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.type, 'text/html');
          assert.equal(res.text, 'deleted '+eyedee);
          done();
        });
      });

    });

});
