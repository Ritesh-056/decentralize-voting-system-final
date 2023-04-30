async function signVoterWithAddressAndMessage(web3, accountAddress) {
  // Check if MetaMask is available
  if (!window.ethereum) {
    console.error("MetaMask not detected");
    return false;
  }

  try {
    // Prompt the user to enter a message to sign
    const message = prompt(
      "Dear voter, please insert a message to continue.",
      ""
    );

    // Validate the message
    if (!message) {
      throw new Error("No message to sign");
    }

    // Sign the message with the account address
    const signature = await web3.eth.personal.sign(message, accountAddress);

    // Store the signature in local storage for later verification
    const username = accountAddress;
    localStorage.setItem(`voterSignature_${username}`, signature);

    console.log("Message signed:", message);
    console.log("Address signed:", accountAddress);
    console.log("Signature:", signature);

    return true;
  } catch (error) {
    // Log and handle any errors that occur during signing
    console.error("Error signing message with MetaMask:", error);
    return false;
  }
}

export { signVoterWithAddressAndMessage };
