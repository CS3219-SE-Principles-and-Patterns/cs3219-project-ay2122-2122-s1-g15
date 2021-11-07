import React from "react";

import { Layout } from "antd";
import SelectionView from "./SelectionView";
import LoadingView from "./LoadingView";
import TimeoutView from "./TimeoutView";
import {
  postMatchRequest,
  cancelMatchRequest,
  findMatch,
} from "../../api/matching";
import { UserContext } from "../../util/UserProvider";
import { SessionContext } from "../../util/SessionProvider";
const { Content } = Layout;

const views = {
  loading: "LOADING",
  selection: "SELECTION",
  timeout: "TIMEOUT",
};

const questionDifficulties = [
  { key: "easy", value: "Easy" },
  { key: "medium", value: "Medium" },
  { key: "hard", value: "Hard" },
];

const MATCH_DURATION = process.env.REACT_APP_MATCH_DURATION || 60;
const MATCH_POLL_INTERVAL = process.env.REACT_APP_MATCH_POLL_INTERVAL || 2000;

const MatchingPage = (props) => {
  var userContext = React.useContext(UserContext);
  const [view, setView] = React.useState(views.selection);
  const sessionContext = React.useContext(SessionContext);
  const { session, setSession } = sessionContext;
  const [timerStart, setTimerStart] = React.useState(false);
  const [remainingTime, setRemainingTime] = React.useState(MATCH_DURATION);
  const [selected, setSelected] = React.useState(null);
  const [matchFound, setMatchFound] = React.useState(false);
  const [requestId, setRequestId] = React.useState();
  const [userToken, setUserToken] = React.useState();
  const [user, setUser] = React.useState();
  // for selection view
  const handleSubmitMatchRequest = () => {
    // setView(views.loading);
    // setTimerStart(true);
    submitMatchRequest(selected);
  };

  const handleQuestionSelect = (index) => {
    setSelected(index);
  };

  // call matching api to submit a request
  // receive the requestId to listen to
  const submitMatchRequest = async (index) => {
    var difficulty = questionDifficulties[index];
    var response = await postMatchRequest(user, difficulty.key, userToken);
    if (response && response.requestId) {
      console.log("Received request id: " + response.requestId);
      setRequestId(response.requestId);
      setView(views.loading);
      setTimerStart(true);
      return;
    }
    console.log(
      "Error occured: response or requestId null when sending matching request"
    );
  };

  // for timeout view
  const handleMatchTimeout = () => {
    setTimerStart(false);
    setRemainingTime(MATCH_DURATION);
    setView(views.timeout);
  };

  const handleRetryMatch = () => {
    setRemainingTime(MATCH_DURATION);
    handleSubmitMatchRequest();
  };

  const handleReturnToSelection = () => {
    setView(views.selection);
    setRequestId(null);
    setSelected(null);
  };

  const handleMatchCancel = () => {
    setRemainingTime(MATCH_DURATION);
    setTimerStart(false);
    
    // send update api call to matching to inform of cancel
    cancelMatchRequest(requestId, userToken);
    handleReturnToSelection();
  };

  // for loading view
  const handleMatchFound = (session) => {
    setTimerStart(false);
    setMatchFound(true);

    // introduce a delay before switching over to session page
    setTimeout(() => setSession(session), 2500);
  };

  // timer hook
  React.useEffect(() => {
    const listenForMatch = async () => {
      console.log("Listen for match");
      var response = await findMatch(requestId, userToken);
      if (response && response.found) {
        return handleMatchFound(response.session);
      }
    };
    let interval = null;
    let listenInterval = null;
    if (timerStart && requestId) {
      if (remainingTime === 0 && !matchFound) {
        console.log("handle match timeout");
        handleMatchTimeout();
      } else {
        console.log("set interval")
        listenForMatch();
        interval = setInterval(() => {
          setRemainingTime((remainingTime) => remainingTime - 1);
        }, 1000);
        listenInterval = setInterval(() => {
          listenForMatch();
        }, MATCH_POLL_INTERVAL)
      }
    } else if (!timerStart && remainingTime !== 0) {
      clearInterval(interval);
      clearInterval(listenInterval);
    }
    return () => {
      clearInterval(interval);
      clearInterval(listenInterval);
    }
  }, [timerStart, remainingTime, matchFound, requestId]);

  React.useEffect(() => {
 
    if (userContext && userContext.user && Object.keys(userContext.user).length != 0) {
      userContext.user.getIdToken(false).then((idToken) => {
        setUserToken(idToken)
        console.log("User idtoken found")
      })
    }
    setUser(userContext?.user);
  }, [userContext, userContext?.user]);

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
        {userToken ? renderView(): null}
      </Content>
    </Layout>
  );
};

export default MatchingPage;
