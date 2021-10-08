import React from "react";

import { Layout } from "antd";
import SelectionView from "./SelectionView";
import LoadingView from "./LoadingView";
import TimeoutView from "./TimeoutView";

const { Content } = Layout;


const views = {
  loading: "LOADING",
  selection: "SELECTION",
  timeout: "TIMEOUT",
};

const questionDifficulties = [
  { title: "Easy" },
  { title: "Medium" },
  { title: "Hard" },
];

const MATCH_DURATION = 10;

const MatchingPage = () => {
  const [view, setView] = React.useState(views.selection);
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

  const submitMatchRequest = (index) => {
    var questionDifficulty = questionDifficulties[index];
    console.log("submitting for " + questionDifficulty.title);
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
    // modify prop to show session page
    console.log("handle match found")
    setTimerStart(false)
  }

  // timer hook
  React.useEffect(() => {
    let interval = null;
    if (timerStart) {
      if (remainingTime === 0 && !matchFound) {
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
