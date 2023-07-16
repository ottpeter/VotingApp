import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { VotingApp__factory } from "../typechain-types";


describe("VotingApp", function () {

  async function defaultFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const VotingApp = await ethers.getContractFactory("VotingApp");
    const votingApp = await VotingApp.deploy();

    return {votingApp, owner, otherAccount};
  }

  describe('After deployment', function () {
    it('List of polls should be empty', async function () {
      const { votingApp } = await loadFixture(defaultFixture);

      expect((await votingApp.listAll(0, 10)).length).to.equal(0);
      expect((await votingApp.listActive()).length).to.be.equal(0);
    });

  });


});