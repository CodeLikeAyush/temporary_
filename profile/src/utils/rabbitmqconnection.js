require('dotenv').config()
const amqp = require("amqplib");

const connection = amqp.connect(process.env.MSG_QUEUE_URL);
function connect() {
      return connection
}

module.exports = { connect };