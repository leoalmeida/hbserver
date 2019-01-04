var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://localhost:12863');

client.on('connect', function () {
  client.subscribe('esp/000001/RAW', function (err) {
    if (!err) {
      client.publish('esp/000001/IBI', "{\"data\":512}");
    }
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString());
  client.publish('esp/000001/IBI', message.toString());
  //client.end()
})
