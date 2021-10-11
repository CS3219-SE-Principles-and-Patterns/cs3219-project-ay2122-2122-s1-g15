var amqp = require("amqplib/callback_api");

class Publisher {
  constructor(queueName, connectionURL, routingKey = null) {
    this.queue = queueName;
    this.url = connectionURL;
    this.routingKey = routingKey;
    this.channel = null;
    this.exchange = "MATCHING";
  }

  connect() {
    return new Promise((resolve, reject) => {
      if (this.channel !== null) {
        console.log("reusing previously defined channel...");
        resolve(this.channel);
      }

      amqp.connect(this.url, (err, conn) => {
        if (err) {
          console.log(">> ERROR [connect]: error when calling amqp.connect");
          reject(err);
        }
        console.log(">> SUCCESS [connect]: connected to rabbitmq");
        console.log("attempting to create channel...");

        conn.createChannel((err, ch) => {
          if (err) {
            console.log(">> ERROR [connect]: ", err);
            reject(err);
          }
          console.log(">> SUCCESS [connect]: created a channel");
          this.channel = ch;
          resolve(ch);
        });
      });
    });
  }

  publish(payload, routingKey) {
    return new Promise((resolve, reject) => {
      this.connect()
        .then((ch) => {
          ch.assertQueue(this.queue, {
            durable: true,
          });

          ch.assertExchange(this.exchange, "direct", {
            durable: true,
          });

          // ch.sendToQueue(this.queue, Buffer.from(payloadStr), {
          //   persistent: true,
          // });
          var payloadStr = JSON.stringify(payload);
          ch.publish(this.exchange, routingKey, payloadStr);

          resolve(
            console.log(
              ">> SUCCESS [publishToQueue]: published to exchange with message: ",
              payloadStr
            )
          );
        })
        .catch((err) => {
          console.log(
            ">> ERROR [publishToQueue] : error occured when connecting to rabbitmq"
          );
          reject(err);
        });
    });
  }
}

module.exports = Publisher;
