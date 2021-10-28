const service = require("../services/service");
const Connection = require("../connectionModel");
class ConnectionController {
  constructor() {}

  index(req, res) {
    Connection.get_all_connections(function (err, connections) {
      if (err) {
        return res.status(400).json({
          status: "error",
          message: err,
        });
      }
      res.json({
        status: "success",
        message: "Connections retrieved successfully",
        data: connections,
      });
    });
  }

  create(req, res) {
    // TODO: should have some validation to check that session id is not being used.
    var session_id = req.body.session_id;
    console.log("Session_id:", session_id);

    var query_for_ports = Connection.find({}).select("port");
    query_for_ports.exec(function (err, connections) {
      if (err) {
        return res.status(400).json({
          status: "error",
          message: err,
        });
      }
      // Check for unused ports, quite naive at the moment, need to refine..
      for (var i = 6002; i < 6100; i++) {
        var is_used = false;
        for (var j = 0; j < connections.length; j++) {
          var connection = connections[j];
          if (i == connection["port"]) {
            is_used = true;
            break;
          }
        }
        if (!is_used) {
          var port = i;
          var document_key = "document_" + port;
          // console.log(port);
          const new_connection = new Connection({
            port: port,
            session_id: session_id,
            document_key: document_key,
          });
          new_connection.save(function (err) {
            if (err) {
              return res.status(400).json({
                status: "error",
                message: err,
              });
            }
            res.json({
              message: "New Connection Created!",
              data: new_connection,
            });
          });
          service.start_server(port, document_key);
          break;
        }
      }
    });
  }

  delete(req, res) {
    console.log("deleting connection entry...");
    var delete_query = Connection.findOneAndDelete({
      session_id: req.params.session_id,
    });
    delete_query.exec(function (err, result) {
      if (err) {
        return res.status(400).json({
          status: "error",
          message: err,
        });
      }
      if (!result || result["deletedCount"] < 1) {
        return res.status(400).json({
          status: "error",
          message: "Session ID not found!",
        });
      }
      var document_key = result["document_key"];
      try {
        service.remove_document(document_key);
      } catch (err) {
        return res.status(400).json({
          status: "error",
          message: err,
        });
      }
      res.json({
        message: "Connection deleted",
        data: result,
      });
    });
  }

  retrieve(req, res) {
    var query = Connection.find({ session_id: req.params.session_id });
    query.exec(function (err, connection) {
      if (err) {
        return res.status(400).json({
          status: "error",
          message: err,
        });
      }

      if (connection.length < 1) {
        return res.status(400).json({
          status: "error",
          message: "Session ID not found!",
        });
      }
      res.json({
        message: "Connection retrieved",
        data: connection,
      });
    });
  }
}

let connectionController = new ConnectionController();
module.exports = connectionController;
