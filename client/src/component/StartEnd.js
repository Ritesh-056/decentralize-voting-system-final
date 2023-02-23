import React from "react";
import { Link } from "react-router-dom";

const StartEnd = (props) => {
  return (
    <div
      className="container-main"
      style={{ borderTop: "1px solid", marginTop: "0px" }}
    >
      {props.electionInitStatus ? (
        <>
              <div className="container-item">
                <button type="submit" className="btn-election">
                  Save Election {props.elEnded ? "Again" : null}
                </button>
              </div>
        </>
      ) :null}
    </div>
  );
};

export default StartEnd;


