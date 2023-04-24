// code that will demonstrate how to sign a message in ecrecover:
    const Web3 = require('web3');
    const web3 = new Web3();

    // private key of the account that will sign the message
    const privateKey = '0x0123456789012345678901234567890123456789012345678901234567890123';

    // message to sign
    const message = 'Hello, world!';

    // sign the message
    const signature = web3.eth.accounts.sign(message, privateKey);

    // print the signature
    console.log('Signature:', signature.signature);




///code that will recover the signer address.

    // const Web3 = require('web3');
    // const web3 = new Web3();

    // message hash
    // const messageHash = '0x7a0a9d24b68c509e4c21937c2c1b21a94bfa8d70f79c7daa46f600d6b15ebf45';

    // // signature
    // const signature = '0xc3c59f1dce11ddc9be6e5d5a49f5f5ab5f5a5a5e5f5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5e5f5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5e5f5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5e';

    // // address that signed the message
    // const signerAddress = '0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec';

    // // recover the address
    // const recoveredAddress = web3.eth.accounts.recover(messageHash, signature);

    // // compare the recovered address with the original signer address
    // if (recoveredAddress === signerAddress) {
    // console.log('Address recovered successfully:', recoveredAddress);
    // } else {
    // console.log('Address could not be recovered.');
    // }
