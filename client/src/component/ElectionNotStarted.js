// Node module
import React from "react";

const ElectionNotStarted = (props) => {
  const electionStartTime = props.data;

  return (
    <div className="container-item info">
      <center>
      <p style={{color:"black"}}>Have patience until election is started.</p>
      <br></br>
      <h4 style={{color:"black"}}>Election will be started in <bold>{electionStartTime}</bold>  </h4>
      </center>
    </div>
  );
};


export default ElectionNotStarted;

