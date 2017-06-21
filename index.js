var app = require('express')();
var bodyParser = require('body-parser');
//var users = require('./users.json');
var fs = require('fs');
var _ = require('lodash');
var cuid = require('cuid');

// firebase---------------------------------------------
var firebase = require("firebase");
var config = {
  apiKey: "AIzaSyBNT7fF4sORljZwPR01Fyiy5JGz8oyvxzk",
  authDomain: "mynode-797a7.firebaseapp.com",
  databaseURL: "https://mynode-797a7.firebaseio.com",
  projectId: "mynode-797a7",
  storageBucket: "mynode-797a7.appspot.com",
  messagingSenderId: "1008842348237"
};
firebase.initializeApp(config);
var database = firebase.database();

// firebase---------------------------------------------

var port = process.env.PORT || 8000;
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
// -----------------------------------------------------

// -----------------------------------------------------
app.get('/', function (req, res) {
    res.send('<h1>Hello Node.js</h1>');
});
 
app.get('/application', function (req, res) {
    database.ref('users').once("value", 
      function(snapshot){
        res.json(snapshot.val());
      },function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
});
 
app.get('/application/:id', function (req, res) {
    var id = req.params.id;
    database.ref('users/'+id).once("value", 
      function(snapshot){
        res.json(snapshot.val());
      },function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
});
 
app.post('/application', function (req, res) {
    var json = req.body;

    for(var i = 0; i < Object.keys(json).length; i++){
        let user = [];
        user['name'] = json[i].hasOwnProperty('name') ? json[i].name : "";
        user['description'] = json[i].hasOwnProperty('description') ? json[i].description : "";
        user['redirectURL'] = json[i].hasOwnProperty('redirectURL') ? json[i].redirectURL : "";
        user['read'] = json[i].hasOwnProperty('read') ? json[i].read : true;
        user['write'] = json[i].hasOwnProperty('write') ? json[i].write : false;
        database.ref('users/'+cuid()).set(user);
    }

    setTimeout(function() {
        res.send('Add new ' + "users" + ' Completed!');
    }, 1000);
    
});

app.put('/application/:id', function (req, res) {
  var id = req.params.id;
  var json = req.body;
  var user = {}

  if(json.hasOwnProperty('name')) user['name'] = json.name
  if(json.hasOwnProperty('description')) user['description'] = json.description
  if(json.hasOwnProperty('redirectURL')) user['redirectURL'] = json.redirectURL
  if(json.hasOwnProperty('read')) user['read'] = json.read
  if(json.hasOwnProperty('write')) user['write'] = json.write

  database.ref('users/'+id).update(user).then(function () {
    res.send('Edit ' + "users" + ' Completed!');
  });

});

app.delete('/application/:id', function (req, res) {
    var id = req.params.id;
    try {
      database.ref('users/'+id).remove();
      res.json({
        status: 'SUCCESS'
      });
    } catch (e) {
      console.log(e);
      res.json({
        status: 'ERROR'
      })
    }
});

app.listen(port, function() {
    console.log('Starting node.js on port ' + port);
});



