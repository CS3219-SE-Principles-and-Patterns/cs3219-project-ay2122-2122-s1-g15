import React from "react";

import { Layout } from "antd";
import { io } from "socket.io-client";
import SelectionView from "./SelectionView";
import LoadingView from "./LoadingView";
import TimeoutView from "./TimeoutView";
import {postMatchRequest} from "../../api/matching"
import { UserContext } from "../../util/UserProvider";
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

const MATCH_DURATION = (process.env.MATCH_DURATION && parseInt(process.env.MATCH_DURATION)) || 120;

const notificationEndpoint = process.env.NOTIFICATION_SERVICE || "http://localhost:8000"

const MatchingPage = (props) => {
  // const user = React.useContext(UserContext).user
  const user = {
    uid: 1
  }
  const [view, setView] = React.useState(views.selection);
  const [timerStart, setTimerStart] = React.useState(false);
  const [remainingTime, setRemainingTime] = React.useState(MATCH_DURATION);
  const [selected, setSelected] = React.useState(null);
  const [matchFound, setMatchFound] = React.useState(false);
  const [sessionInfo, setSessionInfo] = React.useState();

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
    if (response) {
      console.log("Received request id: " + response.requestId)
      return listenForMatch(response.requestId)
    }
    console.log("Error occured")
  };

  // for timeout view
  const handleMatchTimeout = () => {
    setTimerStart(false);
    setRemainingTime(MATCH_DURATION);
    setView(views.timeout);
  };

  const handleRetryMatch = () => {
    setView(views.loading);
    setTimerStart(true);
    submitMatchRequest(selected);
  };

  const handleReturnToSelection = () => {
    setView(views.selection);
    setSelected(null);
  };

  // for loading view
  const handleMatchFound = () => {
    // ASH TODO: call parent component to show session page
    console.log("handle match found")
    setTimerStart(false)
    props.switchToSession(sessionInfo)
  }

  const listenForMatch = (requestId) => {
    var socket = io(notificationEndpoint);
    console.log(requestId)
    // submit
    // client-side
    socket.on("connect", () => {
      // emit the wait event and send the requestId along with it
      // console.log(socket.connected);
      // socket.emit("wait", {requestId})
    });

    // listen for server response
    socket.on(`${requestId}`, (sessionInfo) => {
      console.log(JSON.stringify(sessionInfo))
      // ASH TODO
      setMatchFound(true)
      setSessionInfo(sessionInfo)
    })

    socket.on("disconnect", () => {
      console.log(socket.id); // undefined
    });
  }

  // timer hook
  React.useEffect(() => {
    let interval = null;
    if (timerStart) {
      if (matchFound) {
        handleMatchFound()
      } else if (remainingTime === 0 && !matchFound) {
        console.log("handle match timeout");
        handleMatchTimeout();
      }
      else if (remainingTime < MATCH_DURATION && matchFound) {
        handleMatchFound();
      }
      else {
        interval = setInterval(() => {
          setRemainingTime((remainingTime) => remainingTime - 1);
        }, 1000);
      }
    } else if (!timerStart && remainingTime !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerStart, remainingTime]);

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
