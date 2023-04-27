// Node module
import React from "react";

const ElectionNotStarted = (props) => {
  const electionStartTime = props.data;

  return (
    <div className="container-item info">
      <center>
        <h3>Oops! Have patience until election is started</h3>
        <p>
          Election will be started in <bold>{electionStartTime}</bold>
        </p>
      </center>
    </div>
  );
};

export default ElectionNotStarted;
