import React from "react";

import { Layout } from "antd";
import { io } from "socket.io-client";
import SelectionView from "./SelectionView";
import LoadingView from "./LoadingView";
import TimeoutView from "./TimeoutView";
import {postMatchRequest, cancelMatchRequest} from "../../api/matching"
import { UserContext } from "../../util/UserProvider";
import {SessionContext} from "../../util/SessionProvider"
const { Content } = Layout;


const views = {
  loading: "LOADING",
  selection: "SELECTION",
  timeout: "TIMEOUT",
};

const questionDifficulties = [
  {key: "easy", value: "Easy"},
  {key: "medium", value: "Medium"},
  {key: "hard", value: "Hard"}
];

const MATCH_DURATION = process.env.REACT_APP_MATCH_DURATION || 60;

// const matchingEndpoint = "http://34.76.82.128:4000/matching/socket"
// const matchingEndpoint = "http://localhost:4000/"
// const matchingEndpoint = "https://34.117.253.13/matching/socket"
const matchingEndpoint = "https://peerprep.ninja/matching/socket"
var socket = null;

const MatchingPage = (props) => {
  const user = React.useContext(UserContext).user
  const [view, setView] = React.useState(views.selection);
  const sessionContext = React.useContext(SessionContext);
  const { session, setSession } = sessionContext;
  const [timerStart, setTimerStart] = React.useState(false);
  const [remainingTime, setRemainingTime] = React.useState(MATCH_DURATION);
  const [selected, setSelected] = React.useState(null);
  const [matchFound, setMatchFound] = React.useState(false);
  const [requestId, setRequestId] = React.useState()
  // for selection view
  const handleSubmitMatchRequest = () => {
    setView(views.loading);
    setTimerStart(true);
    submitMatchRequest(selected);
  };

  const handleQuestionSelect = (index) => {
    setSelected(index);
  };

  // call matching api to submit a request
  // receive the requestId to listen to
  const submitMatchRequest = async (index) => {
    var difficulty = questionDifficulties[index];
    var response = await postMatchRequest(user, difficulty.key)
    if (response && response.requestId) {
      console.log("Received request id: " + response.requestId)
      setRequestId(response.requestId)
      return listenForMatch(response.requestId)
    }

    // add error toast
    console.log("Error occured: response or requestId null when sending matching request")
  };

  // for timeout view
  const handleMatchTimeout = () => {
    setTimerStart(false);
    setRemainingTime(MATCH_DURATION);
    setView(views.timeout);

    socket?.close()
  };

  const handleRetryMatch = () => {
    setRemainingTime(MATCH_DURATION);
    handleSubmitMatchRequest()
  };

  const handleReturnToSelection = () => {
    setView(views.selection);
    setRequestId(null)
    setSelected(null);
  };

  const handleMatchCancel = () => {
    setRemainingTime(MATCH_DURATION);
    setTimerStart(false);
    socket?.close()

    // send update api call to matching to inform of cancel
    cancelMatchRequest(requestId)
    handleReturnToSelection()
  }

  // for loading view
  const handleMatchFound = (session) => {
    setTimerStart(false);
    setMatchFound(true)

    // introduce a delay before switching over to session page
    setTimeout(() => setSession(session), 2500)
  }

  const listenForMatch = (requestId) => {
    // var socket = io(matchingEndpoint, {
    //     //   path: "/matching/socket/socket.io/",
    //     // });
    var socket = io(matchingEndpoint, {path: "/matching/socket/socket.io", transports: ['websocket']});
    console.log("Listen for match")
    // socket = io(matchingEndpoint);
    // submit
    // client-side
    socket.on("connect", () => {
      // emit the wait event and send the requestId along with it
      console.log("connected to socket");
      socket.emit("wait", {requestId})
      console.log(`Sent requestId ${requestId} to socket`)
    });

    // listen for server response
    socket.on(`${requestId}`, (res) => {
      // ASH TODO
      setMatchFound(true)
      socket.close()
      return handleMatchFound(res)
    })

    // socket.on("disconnect", () => {
    // });
  }

  // timer hook
  React.useEffect(() => {
    let interval = null;
    if (timerStart) {
      if (remainingTime === 0 && !matchFound) {
        console.log("handle match timeout");
        handleMatchTimeout();
      }
      // else if (remainingTime < MATCH_DURATION && matchFound) {
      //   handleMatchFound();
      // }
      else {
        interval = setInterval(() => {
          setRemainingTime((remainingTime) => remainingTime - 1);
        }, 1000);
      }
    } else if (!timerStart && remainingTime !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerStart, remainingTime, matchFound]);

  const renderView = () => {
    switch (view) {
      case views.selection:
        return (
          <SelectionView
            handleSubmitMatchRequest={handleSubmitMatchRequest}
            questionDifficulties={questionDifficulties}
            handleQuestionSelect={handleQuestionSelect}
            selected={selected}
          />
        );
      case views.loading:
        return (
          <LoadingView
            remainingTime={remainingTime}
            matchFound={matchFound}
            handleMatchCancel={handleMatchCancel}
          />
        );
      case views.timeout:
        return (
          <TimeoutView
            handleRetryMatch={handleRetryMatch}
            handleReturnToSelection={handleReturnToSelection}
          />
        );
    }
  };
  return (
    <Layout className="layout">
      <Content style={{ padding: "0 50px", minHeight: "100vh" }}>
        {renderView()}
      </Content>
    </Layout>
  );
};

export default MatchingPage;
