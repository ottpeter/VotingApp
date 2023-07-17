import { ethers } from "hardhat";

async function main() {
  const votingApp = await ethers.deployContract('VotingApp');

  await votingApp.waitForDeployment();

  console.log(`Contract deployed to ${votingApp.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
