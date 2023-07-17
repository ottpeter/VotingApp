import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

function sleep(ms: Number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


describe("VotingApp", function () {

  async function defaultFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount, thirdAccount] = await ethers.getSigners();

    const VotingApp = await ethers.getContractFactory("VotingApp");
    const votingApp = await VotingApp.deploy();

    return {votingApp, owner, otherAccount, thirdAccount};
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

  function defaultOptionsObject() {
    return [
      {
        optionName: "Alice", 
        voteCount: 0
      },
      {
        optionName: "Bob",
        voteCount: 0
      },
      {
        optionName: "Carol",
        voteCount: 0
      },
      {
       optionName: "Diana",
       voteCount: 0
      }
    ]
  }

  function listWithThreeElement() {
    return {
      "1": "First Poll",
      "2": "Second Poll",
      "3": "Third Poll"
    }
  }
  
  function parsePollView([x, y]: [any[], any[][]]) {
    const result = {
      name: x[0],
      description: x[1],
      start: x[2],
      end: x[3],
      totalVoteCount: Number(x[4][0]),
      options: y.map((value) => ({
        optionName: value[0],
        voteCount: Number(value[1][0])
      }))
    }

    return result;
  }

  function parseList(input: VotingApp.IndexWithNameStructOutput[]) {
    const result = {};
    input.map((element) => result[element[0]] = element[1]);

    return result;
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

  describe('Vote on Poll', async function () {
    it('User should be able to vote and result should change', async function () {
      const { votingApp } = await loadFixture(defaultFixture);

      const inputArgs = createTestPollArgs();
      await votingApp.createPoll(inputArgs.name, inputArgs.desc, inputArgs.end, inputArgs.options);

      const afterVote = defaultOptionsObject();                               // This will be an options array,
      afterVote[0].voteCount = 1;                                             // where vote count for Alice is 1

      await votingApp.vote(1, 0);

      const rawPollView = await votingApp.viewPoll(1);
      const pollData = parsePollView(rawPollView);

      expect(JSON.stringify(pollData.options)).to.be.equal(JSON.stringify(afterVote));
      expect(pollData.totalVoteCount).to.be.equal(1);
    });

    it('User should not be allowed to vote on expired poll', async function () {
      const { votingApp } = await loadFixture(defaultFixture);

      const inputArgs = createTestPollArgs();
      inputArgs.end = Math.floor(new Date().getTime()/1000) + 1;
      await votingApp.createPoll(inputArgs.name, inputArgs.desc, inputArgs.end, inputArgs.options);
      await sleep(2100);

      await expect(votingApp.vote(1,0)).to.be.revertedWith("This poll is expired!");
    });

    it('User should not be able to vote 2 times for the same poll', async function () {
      const { votingApp } = await loadFixture(defaultFixture);

      const inputArgs = createTestPollArgs();
      await votingApp.createPoll(inputArgs.name, inputArgs.desc, inputArgs.end, inputArgs.options);

      await votingApp.vote(1, 0);

      await expect(votingApp.vote(1,0)).to.be.revertedWith("This user has already voted!");
    });

    it('Contract should revert when option is out of range', async function () {
      const { votingApp } = await loadFixture(defaultFixture);

      const inputArgs = createTestPollArgs();
      await votingApp.createPoll(inputArgs.name, inputArgs.desc, inputArgs.end, inputArgs.options);

      await expect(votingApp.vote(1, 4)).to.be.revertedWith("selectedOption points to a non-existent option (out of range)!");
    });
  });

  describe('Display functions', async function () {
    it('viewPoll should display current state of the poll', async function () {
      const { votingApp, otherAccount, thirdAccount } = await loadFixture(defaultFixture);

      const inputArgs = createTestPollArgs();
      await votingApp.createPoll(inputArgs.name, inputArgs.desc, inputArgs.end, inputArgs.options);
      const optionsObject = defaultOptionsObject();

      const beforeVote = parsePollView(await votingApp.viewPoll(1));
      expect(beforeVote.name).to.be.equal(inputArgs.name);
      expect(beforeVote.description).to.be.equal(inputArgs.desc);
      expect(beforeVote.end).to.be.equal(inputArgs.end);
      expect(beforeVote.totalVoteCount).to.be.equal(0);
      expect(JSON.stringify(beforeVote.options)).to.be.equal(JSON.stringify(optionsObject));

      await votingApp.vote(1, 0);                         // Alice
      await votingApp.connect(otherAccount).vote(1,1);    // Bob
      await votingApp.connect(thirdAccount).vote(1,2);    // Carol

      optionsObject[0].voteCount = 1;
      optionsObject[1].voteCount = 1;
      optionsObject[2].voteCount = 1;

      const afterVote = parsePollView(await votingApp.viewPoll(1));
      expect(afterVote.name).to.be.equal(inputArgs.name);
      expect(afterVote.description).to.be.equal(inputArgs.desc);
      expect(afterVote.end).to.be.equal(inputArgs.end);
      expect(afterVote.totalVoteCount).to.be.equal(3);
      expect(JSON.stringify(afterVote.options)).to.be.equal(JSON.stringify(optionsObject));
    });

    it('viewPoll should give out-of-range error for non-existent poll', async function() {
      const { votingApp } = await loadFixture(defaultFixture);

      const inputArgs = createTestPollArgs();
      await votingApp.createPoll(inputArgs.name, inputArgs.desc, inputArgs.end, inputArgs.options);

      await votingApp.vote(1, 0);
      await expect(votingApp.viewPoll(2)).to.be.revertedWith("That poll does not exist (out-of-range)!");
    });

    it('listAll should give correct list of polls', async function() {
      const { votingApp } = await loadFixture(defaultFixture);

      const inputArgs = createTestPollArgs();
      await votingApp.createPoll("First Poll", inputArgs.desc, inputArgs.end, inputArgs.options);
      await votingApp.createPoll("Second Poll", inputArgs.desc, inputArgs.end, inputArgs.options);
      await votingApp.createPoll("Third Poll", inputArgs.desc, inputArgs.end, inputArgs.options);

      expect(JSON.stringify(parseList(await votingApp.listAll(0, 10)))).to.be.equal(JSON.stringify(listWithThreeElement()));
    });

    it('listAll should give out-of-range error if start is higher than current nonce', async function () {
      const { votingApp } = await loadFixture(defaultFixture);

      const inputArgs = createTestPollArgs();
      await votingApp.createPoll("First Poll", inputArgs.desc, inputArgs.end, inputArgs.options);
      await votingApp.createPoll("Second Poll", inputArgs.desc, inputArgs.end, inputArgs.options);
      await votingApp.createPoll("Third Poll", inputArgs.desc, inputArgs.end, inputArgs.options);

      await expect(votingApp.listAll(4,10)).to.be.rejectedWith("From index must be smaller then polls.length");
    });

    it('listActive should give correct list of polls', async function () {
      const { votingApp } = await loadFixture(defaultFixture);

      const inputArgs = createTestPollArgs();
      await votingApp.createPoll("First Poll", inputArgs.desc, inputArgs.end, inputArgs.options);
      await votingApp.createPoll("Second Poll", inputArgs.desc, inputArgs.end, inputArgs.options);
      await votingApp.createPoll("Third Poll", inputArgs.desc, inputArgs.end, inputArgs.options);

      expect(JSON.stringify(parseList(await votingApp.listActive()))).to.be.equal(JSON.stringify(listWithThreeElement()));
    });
  });
});