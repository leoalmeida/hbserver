'use strict';

const mongoose = require("mongoose")
var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://localhost:12863');
var serverSettings = require('./app/config/complex.config');
var KnowledgeSchema = require('./app/models/KnowledgeModel');



var connect = function(){
   mongoose.connect(serverSettings.db.url,serverSettings.db.options);
};


mongoose.connection.on('error',console.log);
mongoose.connection.on('disconnected',connect);
console.log('Client Mongo db connected');


var ObjectId = require('mongodb').ObjectID;
var KnowledgeModel = mongoose.model('Knowledge');

client.on('connect', function () {
  client.subscribe('esp/000001/RAW', function (err) {
    if (!err) {
      client.publish('esp/000001/BPM', "{\"data\":512}");
    }
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString());
  if (topic.indexOf('esp/000001/RAW') === 0){
    KnowledgeModel.create(message);
    KnowledgeModel.find({"type": "RAW"})
          .then(items => {
            if (items) {
              console.log('complexItems: ', items.length);
              client.publish('esp/000001/BPM', items.toString());
            }});
  }

  //client.end()
})
