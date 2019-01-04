'use strict';

const mongoose = require("mongoose")
var mosca = require('mosca');
var serverSettings = require('./app/config/mqttconfig');

var connect = function(){
   var options = {
      server: {
         socketOptions:{
            keepAlive : 1
         }
      }
   };
   mongoose.connect(serverSettings.db,options);
};
connect();

mongoose.connection.on('error',console.log);
mongoose.connection.on('disconnected',connect);
console.log('Broker Mongo db connected');

var ObjectId = require('mongodb').ObjectID;

// Topics Collection
var topics = {};

let broker = new mosca.Server(serverSettings.mqtt, (err, broker) => {
  // assume no errors
  console.log('MQTT broker is up and running');
  //setInterval(publishMessage, 30000);
  //setInterval(verifyConnected, 1000);
});

// Accepts the connection if the username and password are valid
broker.authenticate = (client, username, password, callback) => {
  console.log('autenticando: ',client.id);

  var authorized = true;
  //var authorized = (username === 'xrufgoyx' && password.toString() === 'oWzHcp2N5M4f');
  //if (authorized) client.user = username;
  //if (!username && !password) return callback(null, true);
  //if (!mongoose.Types.ObjectId.isValid(client.id)) return callback({ data: client.id, code: 422, messageKeys: ['not-found'] }, false);
  return callback(null, authorized);
}
// In this case the client authorized as alice can publish to /users/alice taking
// the username from the topic and verifing it is the same of the authorized user
broker.authorizePublish = (client, topic, payload, callback) => {
  console.log("client: " + client.id);
  console.log("topic: " + topic);

  let topicSplitted = topic.split('/');
  //if (!mongoose.Types.ObjectId.isValid(client.id)) return callback({ data: client.id, code: 422, messageKeys: ['not-found'] }, false);
  //if (!mongoose.Types.ObjectId.isValid(topicSplitted[0])) return callback({ data: client.id, code: 422, messageKeys: ['not-found'] }, false);
  //console.log("length: " + topicSplitted.length);

  if (topicSplitted.length > 3) return callback(null, false);
  //else if (topicSplitted.length === 3) return callback(null, (topicSplitted[1] === client.id));
  else if (topicSplitted.length === 3) {
    console.log("topicSplitted[2]: " + topicSplitted[2]);
    return callback(null, true);
  }else if (topicSplitted.length === 2) {
    console.log("topicSplitted[1]: " + topicSplitted[1]);
    return callback(null, true);
  }else return callback(null, false);
}
// In this case the client authorized as alice can subscribe to /users/alice taking
// the username from the topic and verifing it is the same of the authorized user
broker.authorizeSubscribe = (client, topic, callback) => {
  console.log("client: " + client.id);
  console.log("topic: " + topic);
  //if (!mongoose.Types.ObjectId.isValid(client.id)) return callback({ data: client.id, code: 422, messageKeys: ['not-found'] }, false);
  let topicSplitted = topic.split('/')
  //if (!mongoose.Types.ObjectId.isValid(topicSplitted[0])) return callback({ data: client.id, code: 422, messageKeys: ['not-found'] }, false);
  console.log("topicSplitted1: " + topicSplitted[0]);
  console.log("topicSplitted2: " + topicSplitted[1]);

  if (topicSplitted.length > 3) return callback(null, false);
  else if (topicSplitted.length === 2){
    console.log("_id: " + topicSplitted[0]);
    console.log("_sub: " + topicSplitted[1]);
    console.log("subscriber: " + client.id);
    return callback(null, true);
  } else if (topicSplitted[2] === "action") return callback(null, (client.id === topicSplitted[1]));
  else if ((topicSplitted[2] === "RAW")||(topicSplitted[2] === "BPM")||(topicSplitted[2] === "IBI")||(topicSplitted[2] === "AMP")) {
    console.log("topicSplitted3: " + topicSplitted[2]);
    return callback(null, true);
  }else return callback("", false);
}

broker.clientConnected = (client) => {
    console.log('client connected', client.id);
    //startBasicTopic(client.id);
};

broker.published = (packet, client, cb) => {
  if(!client){
    // new subscription
    console.log('Server internals!!');
  }else if ((packet.topic.indexOf('echo') === 0) ||
      (packet.topic.indexOf('connected') === 0) ||
      (packet.topic.indexOf('disconnected') === 0)){
    //console.log('published server: ', packet.toString('utf8'));
    console.log('Server echo!!');
    return cb();
    //(topicSplitted[1] === "offline")
  }else if (packet.topic.split('/')[1] === 'offline'){
    //console.log('published server: ', packet.toString('utf8'));
    console.log('offline msg!!');
    const buf = Buffer.from(packet.payload);
	  console.log(buf.toString('utf8'));
    return cb();
  }else{
    let localPacket = packet;
    // regular client message
    //if (!client) {}
    console.log('Regular message');
    console.log('publish client: ', client.id);
    console.log('published packet: ', localPacket);
    let buf = Buffer.from(localPacket.payload);
    let message = buf.toString('utf8');
    console.log("mensagem: ", message);
    let messageObject = {};
    console.log('client published message from type: ', typeof message);
    if (typeof message !== 'object'){
      messageObject = JSON.parse(message);
      //console.log('published value: ', messageObject.data);
    }else{
      messageObject = message;
      //console.log('published value: ', messageObject);
    }
    return cb();
  }
};

// fired when a client subscribes to a topic
broker.subscribed = (topic, client) => {
  console.log('subscribed : ', topic);
  console.log('client : ', client.id);
  //publishMessage();
};

// fired when a client subscribes to a topic
broker.unsubscribed = (topic, client) => {
  console.log('unsubscribed : ', topic);
  console.log('client : ', client.id);
};
// fired when a client is disconnecting
broker.clientDisconnecting = (client) => {
  console.log('clientDisconnecting : ', client.id);
};
// fired when a client disconnects
broker.clientDisconnected = (client) => {
  console.log('Client Disconnected:', client.id);
  delete topics[client.id];
};

broker.forwardRetained = (topic, client, cb) => {
  cb(true);
}

broker.forwardOfflinePackets = (client, cb) => {
  cb(true);
}

console.log(process.pid);

module.exports = broker;
