module.exports = {
  name: "auth",
  schema: {
    $id: "http://express-gateway.io/schemas/policies/example-policy.json",
    type: "object",
    properties: {
      baseUrl: {
        type: "string",
        format: "url",
        default: "",
      },
    },
  },
  policy: (actionParams) => {
    return (req, res, next) => {
      let serviceAccount = require("../../../serviceAccountKey.json");
      let admin = require("firebase-admin");

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://peerprep-2d654.firebaseio.com",
      });

      const getAuthToken = (req, res, next) => {
        if (
          req.headers.authorization &&
          req.headers.authorization.split(" ")[0] === "Bearer"
        ) {
          req.authToken = req.headers.authorization.split(" ")[1];
        } else {
          req.authToken = null;
        }
        next();
      };

      getAuthToken(req, res, async () => {
        try {
          const { authToken } = req;
          const userInfo = await admin.auth().verifyIdToken(authToken);
          req.authId = userInfo.uid;
          return next();
        } catch (e) {
          return res
            .status(401)
            .send({ error: "You are not authorized to make this request" });
        }
      });
    };
  },
};
