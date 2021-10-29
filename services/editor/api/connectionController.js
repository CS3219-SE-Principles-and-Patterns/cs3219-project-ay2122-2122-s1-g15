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
    var session_id = req.body.session_id;
    console.log("Session_id:", session_id);
    var document_key = "document_" + session_id;
    const new_connection = new Connection({
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
      service.start_server(document_key);
      res.json({
        message: "New Connection Created!",
        data: new_connection,
      });
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
      } else if (!result || result["deletedCount"] < 1) {
        return res.status(400).json({
          status: "error",
          message: "Session ID not found!",
        });
      } else {
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
      }
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
