import React from "react";
import { Link } from "react-router-dom";

const StartEnd = (props) => {
  const btn = {
    display: "block",
    padding: "21px",
    margin: "7px",
    minWidth: "max-content",
    textAlign: "center",
    width: "333px",
    alignSelf: "center",
  };
  return (
    <div
      className="container-main"
      style={{ borderTop: "1px solid", marginTop: "0px" }}
    >
      {!props.elStarted ? (
        <>
          {/* edit here to display start election Again button */}
          {!props.elEnded ? (
            <>
              {/* <div
                className="container-item attention"
                style={{ display: "block" }}
              >
                <h4>
                  Ensure that you have candidates to start election. If yes
                  start the election otherwise start adding candidate.
                </h4>
                <center>
                  <Link
                    title="Add a new "
                    to="/addCandidate"
                    style={{
                      color: "black",
                      textDecoration: "underline",
                    }}
                  >
                    <button type="submit" className="btn-election">
                      Add Candidate From Here
                    </button>
                  </Link>
                </center>
              </div> */}
              <div className="container-item">
                <button type="submit" className="btn-election">
                  Start Election {props.elEnded ? "Again" : null}
                </button>
              </div>
            </>
          ) : (
            <div className="container-item">
              <center>
                <p>Re-deploy the contract to start election again.</p>
              </center>
            </div>
          )}
          {props.elEnded ? (
            <div className="container-item">
              <center>
                <p>The election ended.</p>
              </center>
            </div>
          ) : null}
        </>
      ) : (
        <>
          <div className="container-item">
            <center>
              <p>Election has been started.</p>
            </center>
          </div>
          <div className="container-item">
            <button
              type="button"
              onClick={props.endElFn}
              className="btn-election"
              
            >
              End
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StartEnd;
