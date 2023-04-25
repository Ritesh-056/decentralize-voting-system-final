// Node module
import React from "react";

const ElectionNotStarted = (props) => {
  const electionStartTime = props.data;

  return (
    <div className="container-item info">
      <center>
      <p style={{color:"white"}}>Have patience until election is started.</p>
      <h4 style={{color:"white"}}>Election will be started in <bold>{electionStartTime}</bold>  </h4>
      </center>
    </div>
  );
};


export default ElectionNotStarted;

