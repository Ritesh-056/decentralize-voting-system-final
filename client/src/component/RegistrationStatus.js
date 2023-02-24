import React from "react";

export const  RegistrationInit =() => {
  // Component: Displaying election not initialize message.
  return (
    <div className="container-item info">
      <center>
        <h3>Registration is not Started yet</h3>
        <p>Have patience..</p>
      </center>
    </div>
  );
};



export const  RegistrationEnded =() => {
  // Component: Displaying election not initialize message.
  return (
    <div className="container-item info">
      <center>
        <h3>Oops! registration is closed.</h3>
        <p>Registration is not available after election start.</p>
      </center>
    </div>
  );
};


export const  RegistrationDenied =() => {
  // Component: Displaying election not initialize message.
  return (
    <div className="container-item info">
      <center>
        <h3>Oops! You are trying to register again.</h3>
        <p>Registration is not available after asscociation with other elections.</p>
      </center>
    </div>
  );
};


export default {RegistrationInit,RegistrationEnded,RegistrationDenied};