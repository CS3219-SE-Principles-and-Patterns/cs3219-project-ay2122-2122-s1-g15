import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./Home";
import MatchingPage from "./components/matching/MatchingPage";
import SessionPage from "./components/session/SessionPage";

function App() {
  return (
    <Router>
      <div id="root">
        <Header />

        <Switch>
          <Route exact path="/">
            <Home />
          </Route>

          <Route exact path="/matching">
            <MatchingPage />
          </Route>

          <Route exact path="/session">
            <SessionPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
