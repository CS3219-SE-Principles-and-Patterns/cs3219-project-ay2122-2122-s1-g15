class Errors {
  static ERROR_STORE_REQUEST = "error occured when storing user match request";
  static ERROR_NO_QUESTION =
    "no question with difficulty: %s found in database";
  static ERROR_FETCH_QUESTION =
    "error occured when fetching question from database";
  static ERROR_MATCHING =
    "error occured when searching for a match in database";
}

module.exports = Errors;
