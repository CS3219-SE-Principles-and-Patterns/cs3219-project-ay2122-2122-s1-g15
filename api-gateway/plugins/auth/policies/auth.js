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

      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: "https://peerprep-2d654.firebaseio.com",
        });
      }

      const getAuthToken = (req, res, next) => {
        if (
          req.headers &&
          req.headers['bearer']
        ) {
          req.authToken = req.headers['bearer'];
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
