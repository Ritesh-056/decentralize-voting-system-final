async function signVoterWithAddressAndMessage(web3, accountAddress) {
  var isSignatureSigned = false;

  if (window.ethereum) {
    try {
      let message = prompt("Dear voter, Please insert a message to continue as a voter ", "enter message");
      if (message == null || message == "") {
        throw new Error("No message to sign");
      }

     //signing the message and the address
     const signature  =  await web3.eth.personal.sign(message, accountAddress);


      // Store the signature in local storage or a cookie for later verification
      localStorage.setItem("voterSignature", signature);


      // Log the signed message, account address, and signature for debugging purposes
      console.log("Message signed:", message);
      console.log("Address signed:", accountAddress);
      console.log("Signature:", signature);

      isSignatureSigned = true;
    } catch (error) {
      // Display an error message to the user
      console.error("Error signing message with MetaMask:", error);
    }
  } else {
    // Display an error message to the user if MetaMask is not detected
    console.error("MetaMask not detected");
  }
  return isSignatureSigned;
}

export { signVoterWithAddressAndMessage };
