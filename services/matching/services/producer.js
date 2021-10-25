var amqp = require("amqplib/callback_api");

class Producer {
  constructor(queueName, connectionURL) {
    this.queue = queueName;
    this.url = connectionURL;
    this.channel = null;
    this.exchange = "MATCHING";
    this.routingKey = "";
  }

  connect() {
    if (this.channel != null) {
      return this.channel
    }
    amqp.connect(this.url, (err, conn) => {
        if (err) {
          throw err;
        }
  
        conn.createChannel((err, ch) => {
          if (err) {
            throw err
          }
          console.log(">> Connected to RMQ");
          this.channel = ch;
        });
      });
  }

  publish(payload) {
      var ch = this.connect()
      ch.assertExchange(this.exchange, "direct", {
        durable: true,
      });

      var payloadStr = JSON.stringify(payload);

      ch.publish(this.exchange, this.routingKey, Buffer.from(payloadStr));

      console.log("> Published to RMQ: %s", payloadStr)
  }
}

module.exports = Producer;
