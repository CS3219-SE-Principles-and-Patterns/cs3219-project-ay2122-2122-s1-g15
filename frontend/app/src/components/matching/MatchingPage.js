import React from "react";

import { Layout } from "antd";
import { io } from "socket.io-client";
import SelectionView from "./SelectionView";
import LoadingView from "./LoadingView";
import TimeoutView from "./TimeoutView";
import {postMatchRequest} from "../../api/matching"
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

const MATCH_DURATION = process.env.MATCH_DURATION || 120;

const matchingEndpoint = process.env.MATCHING_ENDPOINT || "https://34.79.116.255/matching"

const MatchingPage = (props) => {
  const user = React.useContext(UserContext).user
  const [view, setView] = React.useState(views.selection);
  const sessionContext = React.useContext(SessionContext);
  const { session, setSession } = sessionContext;
  const [timerStart, setTimerStart] = React.useState(false);
  const [remainingTime, setRemainingTime] = React.useState(MATCH_DURATION);
  const [selected, setSelected] = React.useState(null);
  const [matchFound, setMatchFound] = React.useState(false);
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
  const handleMatchFound = (session) => {
    setMatchFound(true)
    setTimerStart(false)
    setSession(session)
  }

  const listenForMatch = (requestId) => {
    var socket = io(matchingEndpoint, {
      path: "/matching/socket/socket.io/",
    });
    // submit
    // client-side
    socket.on("connect", () => {
      // emit the wait event and send the requestId along with it
      console.log("connected to socket");
      socket.emit("wait", {requestId})
      console.log("Sent requestId to socket")
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
