// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");

async function main() {
  // contract instance
  const Election = await ethers.getContractFactory("Election");
  // deploy contract
  const election = await Election.deploy();

  console.log("Deployed Contract Address: ", election.address);
  /*
    Steps to deploy:
      -> npx hardhat node
      -> open new terminal:
      -> npx hardhat run --network localhost scripts/deploy.js
  */
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
