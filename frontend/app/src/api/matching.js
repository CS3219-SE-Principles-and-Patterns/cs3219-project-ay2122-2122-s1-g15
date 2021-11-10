import axios from "axios";

const MATCHING_ENDPOINT =
  process.env.REACT_APP_MATCHING_ENDPOINT || "https://peerprep.ninja/matching";
const API_SUBMIT =
  process.env.REACT_APP_MATCHING_API_SUBMIT || "/api/match/submit";
const API_CANCEL =
  process.env.REACT_APP_MATCHING_API_CANCEL || "/api/match/cancel";
const API_FIND = process.env.REACT_APP_MATCHING_API_FIND || "/api/match/find";

const getHeaders = (userToken) => {
  return {
    headers: { Authorization: `Bearer ${userToken}` },
  };
};
export const postMatchRequest = async (userObj, difficulty, userToken) => {
  var user = {
    email: userObj.data.email,
    displayName: userObj.data.name,
  };
  return axios
    .post(
      `${MATCHING_ENDPOINT}${API_SUBMIT}`,
      { user, difficulty },
      getHeaders(userToken)
    )
    .then((res) => {
      return res.data;
    })
};

export const cancelMatchRequest = async (requestId, userToken) => {
  return axios
    .put(
      `${MATCHING_ENDPOINT}${API_CANCEL}`,
      { requestId },
      getHeaders(userToken)
    )
    .then((res) => {
      return res
    })
};

export const findMatch = async (requestId, userToken) => {
  return axios
    .put(
      `${MATCHING_ENDPOINT}${API_FIND}`,
      { requestId },
      getHeaders(userToken)
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return null;
    });
};
