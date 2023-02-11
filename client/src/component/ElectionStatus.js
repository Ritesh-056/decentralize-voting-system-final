import React from "react";

const ElectionStatus = (props) => {
  const electionStatus = {
    padding: "11px",
    margin: "7px",
    width: "100%",
    border: "1.5px solid green",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
    borderRadius: "0.5em",
    overflow: "auto",
    alignItems: "center",
    justifyContent: "space-around",
    display: "flex",
  };
  return (
    <div
      className="container-main"
      style={{ borderTop: "1px solid", marginTop: "0px" }}
    >
      <h3>Election Status</h3>
      <div style={electionStatus}>
        <p>Started: {props.elStarted ? "Yes" : "- - -"}</p>
        <p>Ended: {props.elEnded ? "Yes" : "- - -"}</p>
      </div>
      <div className="container-item" />
    </div>
  );
};

export default ElectionStatus;
