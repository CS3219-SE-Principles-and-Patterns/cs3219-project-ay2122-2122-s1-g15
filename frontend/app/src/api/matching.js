import axios from "axios"
const MATCHING_ENDPOINT = process.env.MATCHING_ENDPOINT || "http://peerprep-matching:4000"

export const postMatchRequest = async (userObj, difficulty) => {
  var user = {
    email: userObj.email,
    displayName: userObj.displayName
  }
  return axios.post(`${MATCHING_ENDPOINT}/api/match/submit`, {user, difficulty})
  .then(res => {
    console.log(res)
    return res.data
  })
  .catch(err => {
    console.log(err)
    return null
  })
}
