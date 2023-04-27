
async function recoverSignerAccount(web3, accountAddress) {

  var isSignatureRecovered = false;

  const signature = localStorage.getItem("voterSignature");
  console.log("Got signature from the local stored data", signature);

  if (window.ethereum) {
    try {
      let message = prompt("Dear voter, Please insert a message to verify as a voter ", "enter message");
      if (message == null || message == "") {
        throw new Error("No message to sign");
      }

      const signer = web3.eth.accounts.recover(message, signature);

      // Compare the recovered address to the expected address
      if (signer.toLowerCase() !== accountAddress.toLowerCase()) {
        throw new Error("Invalid signature");
      }else{
        isSignatureRecovered = true;
      }

    // Log the signed message, account address, and signature for debugging purposes
    console.log("Signer address or signer data: ", signer);
    console.log("Message signed:", message);
    console.log("Account Address:", accountAddress);
    console.log("Signature:", signature);


    } catch (error) {
      // Display an error message to the user
      console.error("Error recovering signer account with MetaMask:", error);
    }
  } else {
    // Display an error message to the user if MetaMask is not detected
    console.error("MetaMask not detected");
  }

  return isSignatureRecovered;
}

export { recoverSignerAccount };
