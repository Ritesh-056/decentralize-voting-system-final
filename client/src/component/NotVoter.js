import React from "react";

const NotVoter = () => {
  // Component: Displaying election not initialize message.
  return (
    <div className="container-item info">
      <center>
        <h3>You are not a voter.</h3>
        <p>Please register first as a voter or wait for admin approval.</p>
      </center>
    </div>
  );
};
export default NotVoter;