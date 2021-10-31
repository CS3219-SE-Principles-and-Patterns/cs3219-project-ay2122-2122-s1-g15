import axios from "axios"
const MATCHING_ENDPOINT = process.env.MATCHING_ENDPOINT || "http://34.79.116.255/matching"
const API_SUBMIT = process.env.MATCHING_API_SUBMIT || "/match/submit"

export const postMatchRequest = async (userObj, difficulty) => {
  var user = {
    email: userObj.data.email,
    displayName: userObj.data.name
  }
  return axios.post(`${MATCHING_ENDPOINT}${API_SUBMIT}`, {user, difficulty})
  .then(res => {
    console.log(res)
    return res.data
  })
  .catch(err => {
    console.log(err)
    return null
  })
}
