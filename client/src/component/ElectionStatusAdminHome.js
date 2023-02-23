// Node module
import React from "react";

function ElectionStatusAdminHome(props) {
  return (
    <div className="container-item info">
      <center>
      <h3>Election has been intialized</h3>        
      <p>Verify election details  </p>   
      <p>{props.el.organizationTitle} </p>   
      </center>
    </div>
  );
}

export default ElectionStatusAdminHome;