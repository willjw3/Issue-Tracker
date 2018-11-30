/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
//require('dotenv').config();

const CONNECTION_STRING = process.env.MONGO_URI;


module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(function (req, res){
      var project = req.params.project;
      var query = {};
      var input = req.query;
      if (input._id) {query._id = new ObjectId(input._id);}
      if (input.issue_title) {query.issue_title = input.issue_title;}
      if (input.issue_text) {query.issue_text = input.issue_text;}
      if (input.created_on) {query.created_on = input.created_on;}
      if (input.updated_on) {query.updated_on = input.updated_on;}
      if (input.created_by) {query.created_by = input.created_by;}
      if (input.assigned_to) {query.assigned_to = input.assigned_to;}
      if (input.open === 'false') {query.open = false;}
      if (input.open === 'true') {query.open = true;}
      if (input.status_text) {query.status_text = input.status_text}
      MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, client) {
        if (!err) {
          console.log('Database connection established...');
        }
        var db = client.db('infosecqa');
        db.collection('issues').find(query).toArray(function(err, result) {
          if (err) {console.error(err);}
          res.send(result);
          client.close();
        });
      });
      return;
    })

    .post(function (req, res){
      var project = req.params.project;
      var input = req.body;
      var created_on = new Date;
      var issue = {
        "issue_title": input.issue_title,
        "issue_text": input.issue_text,
        "created_on": created_on,
        "updated_on": created_on,
        "created_by": input.created_by,
        "assigned_to": input.assigned_to,
        "open": true,
        "status_text": input.status_text
      };

      MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, client) {
        if (!err) {
          console.log('Database connection established...');
        }
        var db = client.db('infosecqa');
        db.collection('issues').insertOne(issue, function(err, result) {
          if (err) {console.error(err);}
          console.log('Document successfully inserted');
          //console.log(result);
          client.close();
          res.json({
            "_id": result.insertedId,
            "issue_title": input.issue_title,
            "issue_text": input.issue_text,
            "created_on": created_on,
            "updated_on": created_on,
            "created_by": input.created_by,
            "assigned_to": input.assigned_to,
            "open": true,
            "status_text": input.status_text
          });
        });
      });
      return;
    })

    .put(function (req, res){
      var project = req.params.project;
      var input = req.body;
      var arr = [];
      for (var key in input) {
        if (input[key] != '' && input[key] != input._id) {
          console.log(input[key]);
          arr.push('true');
        }
      }
      console.log(arr);
      var updatedOn = new Date;
      MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, client) {
        if (!err) {
          console.log('Database connection established...');
        }
        var count = 0;
        var db = client.db('infosecqa');
        var eyedee = new ObjectId(input._id);
        var query = {_id: eyedee};
        if (input.issue_title === '' && input.issue_text === '' && input.created_by === ""
            && input.assigned_to === '' && input.status_text === '' && input.open != false) {
              return res.send('no updated field sent');
        }
        var updateOrNo = false;
        if (input.issue_title != '') {
          var newTitle = { $set: {issue_title: input.issue_title}}
          db.collection('issues').updateOne(query, newTitle, (err, result) => {
            if (err) {console.error(err);}
            console.log('issue_title updated');
            client.close();
          });
          updateOrNo = true;
          console.log('updated: ' + updateOrNo);
          count += 1;
        }
        if (input.issue_text != '') {
          var newText = { $set: {issue_text: input.issue_text}}
          db.collection('issues').updateOne(query, newText, (err, result) => {
            if (err) {console.error(err);}
            console.log('issue_text updated');
            client.close();
          });
          updateOrNo = true;
          console.log('updated: ' + updateOrNo);
          count += 1;
        }
        if (input.created_by != '') {
          var newCreator = { $set: {created_by: input.created_by}}
          db.collection('issues').updateOne(query, newCreator, (err, result) => {
            if (err) {console.error(err);}
            console.log('created_by updated');
            client.close();
          });
          updateOrNo = true;
          console.log('updated: ' + updateOrNo);
          count += 1;
        }
        if (input.assigned_to != '') {
          var newAssignee = { $set: {assigned_to: input.assigned_to}}
          db.collection('issues').updateOne(query, newAssignee, (err, result) => {
            if (err) {console.error(err);}
            console.log('assigned_to updated');
            client.close();
          });
          updateOrNo = true;
          console.log('updated: ' + updateOrNo);
          count += 1;
        }
        if (input.open === 'false') {
          var newOpen = { $set: {open: false}}
          db.collection('issues').updateOne(query, newOpen, (err, result) => {
            if (err) {console.error(err);}
            console.log('open updated')
            client.close();
          });
          updateOrNo = true;
          console.log('updated: ' + updateOrNo);
          count += 1;
        }
        if (input.status_text != '') {
          var newStatus = { $set: {status_text: input.status_text}}
          db.collection('issues').updateOne(query, newStatus, (err, result) => {
            if (err) {console.error(err);}
            console.log('status_text updated');
            client.close();
          });
          updateOrNo = true;
          console.log('updated: ' + updateOrNo);
          count +=1;
        }
        if (updateOrNo == true && count == arr.length) {
          var newUpdate = { $set: {updated_on: updatedOn }};
          db.collection('issues').updateOne(query, newUpdate, (err, result) => {
            if (err) {console.error(err);}
            console.log('updated, yo!');
            client.close();
          });
          res.send('successfully updated');
        }
        if (updateOrNo == false) {
          res.send('could not update '+input._id);
        }
      });
      return;
    })

    .delete(function (req, res){
      var project = req.params.project;
      var input = req.body;

      MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, client) {
        if (!err) {
          console.log('Database connection established...');
        }
        var db = client.db('infosecqa');
        var eyedee;
        try {
          eyedee = new ObjectId(input._id);
        }
        catch(err) {
          console.log('error message: ' + err.message);
          return res.send('_id error');
        }
        var query = {_id: eyedee};
        db.collection('issues').find(query).toArray((err, result) => {
          if (err) {console.log(err.message);}
          if (result.length === 0) {
            console.log("No document with that _id found in database");
            return res.send('could not delete '+input._id);
          }
          else {
            db.collection('issues').deleteOne(query, (err, obj) => {
              if (err) {console.log(err.message);
                return res.send('could not delete '+input._id);
              }
              console.log('1 document deleted');
              res.send('deleted '+input._id);
              client.close();
            });
          }
        });
      });
      return;
    });

};
