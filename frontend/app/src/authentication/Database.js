import * as firebase from "firebase/app";
import "firebase/firestore";

export default class Database {
  static addNewUser(userId, userData) {
    // TODO: update rules on firebase db console
    firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .set(userData)
      .catch(error => console.error("Error adding user to DB: ", error));
  }

  // returns an object containing user's data
  static async getUserData(userId) {
    const doc = await firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .get();

    return doc.data();
  }
}
