async function recoverSignerAccount(web3, accountAddress) {
  try {
    const username = accountAddress; // replace with the user-specific identifier
    const storedSignature = localStorage.getItem(`voterSignature_${username}`);

    console.log("Got signature from local storage:", storedSignature);

    // Check if MetaMask is detected
    if (!window.ethereum) {
      throw new Error("MetaMask not detected");
    }

    // Prompt the user for a message to verify as a voter
    const message = prompt(
      "Dear voter, please insert a message to verify as a voter",
      ""
    );
    if (!message) {
      throw new Error("No message to sign");
    }

    // Recover the signer address from the message and signature
    const signer = web3.eth.accounts.recover(message, storedSignature);
    console.log("Recovered signer address:", signer);

    // Check if the recovered signer address matches the expected account address
    if (signer.toLowerCase() !== accountAddress.toLowerCase()) {
      throw new Error("Invalid signature");
    }

    // Log the signed message, account address, and signature
    console.log("Message signed:", message);
    console.log("Account address:", accountAddress);
    console.log("Signature:", storedSignature);

    return true;
  } catch (error) {
    console.error("Error recovering signer account with MetaMask:", error);
    return false;
  }
}

export { recoverSignerAccount };
