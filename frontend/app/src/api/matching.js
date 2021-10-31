import axios from "axios";
const MATCHING_ENDPOINT =
  process.env.MATCHING_ENDPOINT || "http://localhost:4000";
const API_SUBMIT = process.env.MATCHING_API_SUBMIT || "/api/match/submit";

export const postMatchRequest = async (userObj, difficulty) => {
  var user = {
    email: userObj?.data?.email,
    displayName: userObj?.data?.name,
  };
  return axios
    .post(`${MATCHING_ENDPOINT}${API_SUBMIT}`, { user, difficulty })
    .then((res) => {
      console.log(res);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};
