import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./Home";
import MatchingPage from "./components/matching/MatchingPage";
import SessionPage from "./components/session/SessionPage";
import Register from "./components/user-management/Register";
import Login from "./components/user-management/Login";
import UserProvider from "./util/UserProvider";
import SessionProvider from "./util/SessionProvider";

function App() {
  const [session, setSession] = React.useState()
  const switchToSession = (session) => {
    setSession(session);
    return
  };

  const sessionCleanup = () => {
    setSession(null);
  };

  return (
    <UserProvider>
      <SessionProvider>
        <Router>
          <div id="root">
            <Header />

            <Switch>
              <Route exact path="/">
                <Home />
              </Route>

              <Route exact path="/session">
                {!session && <MatchingPage switchToSession={switchToSession} />}
                {session && (
                  <SessionPage
                    session={session}
                    sessionCleanup={sessionCleanup}
                  />
                )}
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
      </SessionProvider>
    </UserProvider>
  );
}

export default App;
