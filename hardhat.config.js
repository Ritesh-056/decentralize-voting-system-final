require("@nomicfoundation/hardhat-toolbox");
/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.1",
  // networks: {
  //   hardhat: {
  //     chainId: 1337,
  //   },
  //   ganache: {
  //     url: "http://127.0.0.1:8545",
  //     accounts: [
  //       `d7b29d2317b6362af1290f397c8705d1c775036a615071d28e126e48f6d65c50`,
  //     ],
  //   }
  networks: {
    hardhat: {
      chainId: 1337
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./client/src/artifacts",
  },
};