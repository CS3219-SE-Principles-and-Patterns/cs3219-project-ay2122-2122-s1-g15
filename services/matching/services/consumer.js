class Consumer {
  constructor()
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

  consume() {
    return new Promise((resolve, reject) => {
      this.connect()
        .then((ch) => {
          ch.assertQueue(this.queue, {
            durable: true,
          });

          ch.prefetch(1); // prefetch 1 message at a time

          console.log(`waiting for message from ${this.queue}...`);
          ch.consume(
            this.queue,
            (payload) => {
              var msg = payload.content.toString();
              var msgJSON = JSON.parse(msg);

              // this.handler(msgJSON) // call worker
              console.log(
                `>> SUCCESS [receiveFromQueue]: received message: ${msg}`
              );
              resolve(msgJSON);
            },
            { noAck: true }
          );
        })
        .catch((err) => {
          console.log(
            `>>ERROR [receiveFromQueue]: connection error for ${this.queue}`
          );
          reject(err);
        });
    });
  }
}