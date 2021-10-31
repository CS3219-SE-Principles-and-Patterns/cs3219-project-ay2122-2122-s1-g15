import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./Home";
import MatchingPage from "./components/matching/MatchingPage";
import SessionPage from "./components/session/SessionPage";
import Register from "./components/user-management/Register";
import Login from "./components/user-management/Login";

import { SessionContext } from "./util/SessionProvider";

function App() {
  const sessionContext = React.useContext(SessionContext);
  const { session, setSession } = sessionContext;
  return (
    <Router>
      <div id="root">
        <Header />

        <Switch>
          <Route exact path="/">
            <Home />
          </Route>

          <Route exact path="/session">
            {!session && <MatchingPage />}
            {session && <SessionPage />}
          </Route>

          <Route exact path="/register">
            <Register />
          </Route>

          <Route exact path="/login">
            <Login />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
