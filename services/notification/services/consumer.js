var amqp = require("amqplib/callback_api");

class Consumer {
  constructor(queueName, connectionURL) {
    this.queue = queueName;
    this.url = connectionURL;
    this.routingKey = "";
    this.exchange = "MATCHING";
    this.handler = null;
  }

  registerHandler(handler) {
    this.handler = handler;
  }

  connect() {
    amqp.connect(this.url, (err, conn) => {
      if (err) {
        console.log(err);
        throw err;
      }

      conn.createChannel((err, ch) => {
        if (err) {
          console.log(err);
          throw err;
        }

        // set prefetch to 1
        ch.prefetch(1)

        ch.assertExchange(this.exchange, "direct", {
          durable: true,
        });

        ch.assertQueue(this.queue, { durable: true });

        console.log(">> Connected to RMQ, waiting for messages in %s", this.queue);

        ch.bindQueue(this.queue, this.exchange, "");

        ch.consume(
          this.queue,
          (msg) => {
            if (msg.content) {
              console.log("> Received from RMQ: %s", msg.content.toString());
              this.handler.handleMessage(JSON.parse(msg.content.toString()));
            }
          },
          {
            noAck: true,
          }
        );
      });
    });
  }
}

module.exports = Consumer;
