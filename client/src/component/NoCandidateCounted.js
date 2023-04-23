// Node module
import React from "react";

export const NotCandidateCounted = () => {
  return (
    <div className="container-item info">
      <center>
        <h3>No candidate registered. </h3>
        <p>Have patience..</p>
      </center>
    </div>
  );
};


 export const NotAnyCandidateOnElectionCounted = () => {
  return (
    <div className="container-item info">
      <center>
        <h3>No candidate registered in the election. </h3>
        <p>Voting is not available...Stay updated</p>
      </center>
    </div>
  );
};

