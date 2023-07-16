import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";


describe("VotingApp", function () {

  async function defaultFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const VotingApp = await ethers.getContractFactory("VotingApp");
    const votingApp = await VotingApp.deploy();

    return {votingApp, owner, otherAccount};
  }

  function createTestPollArgs() {
    let oneWeekLater = new Date();
    oneWeekLater.setDate(oneWeekLater.getDate() + 7);

    const inputArgs = {
      name: "Test Poll",
      desc: "Test description for the test poll",
      end: Math.floor((oneWeekLater.getTime()/1000)),
      options: ["Alice", "Bob", "Carol", "Diana"]
    }

    return inputArgs;
  }

  describe('After deployment', function () {
    it('List of polls should be empty', async function () {
      const { votingApp } = await loadFixture(defaultFixture);

      expect((await votingApp.listAll(0, 10)).length).to.equal(0);
      expect((await votingApp.listActive()).length).to.be.equal(0);
    });
  });

  describe('Create Poll', function () {
    it('Should be possible to create poll', async function () {
      const { votingApp } = await loadFixture(defaultFixture);

      const inputArgs = createTestPollArgs();

      await votingApp.createPoll(inputArgs.name, inputArgs.desc, inputArgs.end, inputArgs.options);

      expect((await votingApp.listAll(0, 10)).length).to.equal(1);
      expect((await votingApp.listActive()).length).to.be.equal(1);
    });

    it('Should revert when title is too long', async function () {
      const { votingApp } = await loadFixture(defaultFixture);

      const inputArgs = createTestPollArgs();
      inputArgs.name = "A title that is too long and will be rejected";

      await expect(votingApp.createPoll(inputArgs.name, inputArgs.desc, inputArgs.end, inputArgs.options))
        .to.be.revertedWith("The title is too long!");
    });

    it('Should revert when the description is too long', async function () {
      const { votingApp } = await loadFixture(defaultFixture);

      const inputArgs = createTestPollArgs();
      inputArgs.desc = "This description is too long. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut \
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea \
                        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. \
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

      await expect(votingApp.createPoll(inputArgs.name, inputArgs.desc, inputArgs.end, inputArgs.options))
        .to.be.revertedWith("The description is too long!");
    });

    it('Should revert when there are too many options', async function () {
      const { votingApp } = await loadFixture(defaultFixture);

      const inputArgs = createTestPollArgs();
      inputArgs.options = ["Alice", "Bob", "Carol", "Diana", "Emma", "Frank", "Sophia", "Luna", "Mia", "Evelyn", "Penelope", "Gianna", "Violet", "Hazel", "Nora", "Lily"];

      await expect(votingApp.createPoll(inputArgs.name, inputArgs.desc, inputArgs.end, inputArgs.options))
        .to.be.revertedWith("Too many options were provided for the poll!");
    });

    it('Should revert when expiration date is smaller than current timestamp', async function () {
      const { votingApp } = await loadFixture(defaultFixture);

      const inputArgs = createTestPollArgs();
      let oneWeekBefore = new Date();
      oneWeekBefore.setDate(oneWeekBefore.getDate() - 7);
      inputArgs.end = Math.floor(oneWeekBefore.getDate()/1000);

      await expect(votingApp.createPoll(inputArgs.name, inputArgs.desc, inputArgs.end, inputArgs.options))
        .to.be.revertedWith("Expiration date has to be bigger then current time!");
    });

    it('Should panic if one of the option is too long', async function () {
      const { votingApp } = await loadFixture(defaultFixture);

      const inputArgs = createTestPollArgs();
      inputArgs.options = ["Alice", "Candidate-with-a-very-long-name-instead-of-simply-Bob-very-very-long-name-very-long-name-very-long-name-very-very-very-long-name", "Carol"];

      await expect(votingApp.createPoll(inputArgs.name, inputArgs.desc, inputArgs.end, inputArgs.options))
        .to.be.revertedWith("Some of the option string is too long!");
    });
  });

});