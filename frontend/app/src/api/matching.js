
import axios from "axios"

const MATCHING_ENDPOINT = process.env.REACT_APP_MATCHING_ENDPOINT || "https://peerprep.ninja/matching/api"
const API_SUBMIT = process.env.REACT_APP_MATCHING_API_SUBMIT || "/api/match/submit"
const API_CANCEL = process.env.REACT_APP_MATCHING_API_CANCEL || "/api/match/cancel"
const API_FIND = process.env.REACT_APP_MATCHING_API_FIND || "/api/match/find"

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

export const cancelMatchRequest = async (requestId) => {
  return axios.put(
    `${MATCHING_ENDPOINT}${API_CANCEL}`,
    {requestId}
  ).then(res => {
    console.log(res)
  })
  .catch(err => {
    console.log(err)
  })

}

export const findMatch = async (requestId) => {
  console.log(`axios: ${requestId}`)
  return axios.put(
    `${MATCHING_ENDPOINT}${API_FIND}`,
    {requestId}
  ).then(res => {
    console.log(res)
    return res.data
  })
  .catch(err => {
    console.log(err)
    return null
  })
}

