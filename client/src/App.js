import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Home from "./component/Home";

import Voting from "./component/Voting/Voting";
import Results from "./component/Results/Results";
import Registration from "./component/Registration/Registration";

import Verification from "./component/Admin/Verification/Verification";
import CandidateVerification from "./component/Admin/CandidateVerification/CandidateVerification";
import CandidateRegistration from "./component/CandidateRegistration/CandidateRegistration";
import Notification from "./component/Notification";
import test from "./component/test";
// import StartEnd from "./component/Admin/StartEnd/StartEnd";

import Footer from "./component/Footer/Footer";

import "./App.css";

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/RegisterCandidate" component={CandidateRegistration} />
            <Route exact path="/Voting" component={Voting} />
            <Route exact path="/Results" component={Results} />
            <Route exact path="/Registration" component={Registration} />
            <Route exact path="/Verification" component={Verification} />
            <Route exact path="/CandidateVerification" component={CandidateVerification} />
            <Route exact path="/Notification"  component={Notification} />
            <Route exact path="/test" component={test} />
            <Route exact path="*" component={NotFound} />
          </Switch>
        </Router>
        <Footer />
      </div>
    );
  }
}
class NotFound extends Component {
  render() {
    return (
      <>
        <h1>404 NOT FOUND!</h1>
        <center>
          <p>
            The page your are looking for doesn't exist.
            <br />
            Go to{" "}
            <Link
              to="/"
              style={{ color: "black", textDecoration: "underline" }}
            >
              Home
            </Link>
          </p>
        </center>
      </>
    );
  }
}
