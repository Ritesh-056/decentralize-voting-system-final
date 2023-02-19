require("@nomicfoundation/hardhat-toolbox");
/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.11",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
    },
  },
  paths: {
    sources: "./contracts", 
    tests: "./test",
    cache: "./cache",
    artifacts: "./client/src/artifacts",
  },
};
