// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";


contract VotingApp {
    uint16 constant MAX_NAME_LENGTH = 32;                               // These will be bytes,
    uint16 constant MAX_DESC_LENGTH = 256;                              // because when we are using it we are doing bytes(value).length
    uint16 constant MAX_OPTION_LENGTH = 128;
    uint16 constant MAX_OPTION_NUM = 16;

    using Counters for Counters.Counter;

    /// A poll object, that was initiated by a user
    /// Options and alreadyVoted addresses are not inside this object, but they are linked to it by pollID (alreadyVotedStorage, optionsStorage)
    struct Poll {
        string name;                                                    // Name of the poll
        string description;                                             // Description of the poll
        uint256 createdTime;                                            // block.timestamp (UNIX timestamp)
        uint256 endTime;                                                // UNIX timestamp received from the front end
        Counters.Counter totalVoteCount;                                // Total votes received on this poll
        uint256 pollID;                                                 // ID, that connects to alreadyVoted storage and options storage
    }

    /// PollView: This will be returned on the front end
    struct PollView {
        string name;
        string description;
        uint256 createdTime;         // unix timestamp
        uint256 endTime;             // unix timestamp. Before 2109
        Counters.Counter totalVoteCount;
    }

    /// A struct that we send to the front end when it asks for list of polls
    struct IndexWithName {
        uint index;
        string name;
    }

    /// An option that is associated to a poll.
    /// optionsStorage stores an array of this object, each Poll has an array
    struct Option {
        string optionName;
        Counters.Counter voteCount;
    }

    mapping(uint256 => Poll) polls;
    uint256[] public activePolls;                                       // list of pollIDs that are still active (endTime greater than current time). Needs to be refreshed periodically
    mapping(uint256 => Option[]) optionsStorage;                        // Options associated to a poll
    mapping(uint256 => address[]) alreadyVotedStorage;                  // List of addresses that already voted on a Poll
    Counters.Counter private pollNonce;                                 // This is used as pollId (current nonce points to last created poll)

    constructor() {
        pollNonce = Counters.Counter(0);
    }

    /// This will create a new Poll object, based on data that will come from the front end
    /// Returns the poll ID
    /// @param name Name of the poll
    /// @param desc Description for the poll
    /// @param end poll expire date, UNIX timestamp
    /// @param options String array of option names
    function createPoll(
        string calldata name,
        string calldata desc,
        uint256 end,
        string[] calldata options
    ) public payable returns(uint256) {
        require(bytes(name).length < MAX_NAME_LENGTH, "The title is too long!");
        require(bytes(desc).length < MAX_DESC_LENGTH, "The description is too long!");
        require(end > block.timestamp, "Expiration date has to be bigger then current time!");
        require(options.length < MAX_OPTION_NUM, "Too many options were provided for the poll!");

        // We increment poll nonce. First ID will be 1
        pollNonce.increment();


        // Create the basic poll object
        Poll memory newPoll = Poll(
            name,
            desc,
            block.timestamp,
            end,
            Counters.Counter(0),
            pollNonce.current()
        );

        // This will add the options to the associated optionsStorage array
        for (uint16 i = 0; i < options.length; i++) {
            require(
                bytes(options[i]).length < MAX_OPTION_LENGTH,
                "Some of the option string is too long!"
            );

            Option memory tempOption = Option(
                options[i],
                Counters.Counter(0)
            );
            optionsStorage[pollNonce.current()].push(tempOption);
        }

        polls[pollNonce.current()] = newPoll;                           // Add the poll to the polls mapping
        activePolls.push(pollNonce.current());                          // List the poll as active

        //removeExpired();                                                // This will cost some additional gas,
                                                                        // but activePolls will be more up-to-date (can be removed)
        return pollNonce.current();
    }

    /// Any Ethereum address is allowed to vote once
    /// Returns the current state of the vote
    /// @param pollId ID of the poll that the user wants to vote on (starting from 1)
    /// @param selectedOption Index of the option in the options array, that the user wants to vote on (starting from 0)
    function vote(uint256 pollId, uint256 selectedOption) public payable returns(Option[] memory){
        require(!hasAlreadyVoted(msg.sender, pollId), "This user has already voted!");
        require(pollId <= pollNonce.current(), "This poll does not exist!");
        require(polls[pollId].endTime > block.timestamp, "This poll is expired!");
        require(optionsStorage[pollId].length > selectedOption, "selectedOption points to a non-existent option (out of range)!");

        alreadyVotedStorage[pollId].push(msg.sender);                   // Add this address to the already voted array

        optionsStorage[pollId][selectedOption].voteCount.increment();   // Increment the vote count for the selected option
        polls[pollId].totalVoteCount.increment();                       // Increment the total vote count for the poll

        //removeExpired();                                                // This will cost some additional gas,
                                                                        // but activePolls will be more up-to-date (can be removed)
        return optionsStorage[pollId];
    }

    /// Will return all data for a single poll object, that consist of the PollView object and a separated options object
    /// @param pollNumber ID of the poll
    function viewPoll(uint pollNumber) public view returns(PollView memory, Option[] memory){
        require(pollNumber <= pollNonce.current(), "That poll does not exist (out-of-range)!");
        require(pollNumber != 0, "pollNumber can't be 0");

        PollView memory viewedPoll;                                     // First element of return array is PollView object
        viewedPoll.name = polls[pollNumber].name;
        viewedPoll.description = polls[pollNumber].description;
        viewedPoll.createdTime = polls[pollNumber].createdTime;
        viewedPoll.endTime = polls[pollNumber].endTime;
        viewedPoll.totalVoteCount = polls[pollNumber].totalVoteCount;
        Option[] memory viewedPollOptions = optionsStorage[pollNumber]; // Second element of return array is Options array

        return (viewedPoll, viewedPollOptions);                         // Will return [PollView, Option[]]
    }

    /// Will return a list of pollID->PollName, in a specified range
    /// @param from Starting poll ID
    /// @param limit How many polls max
    function listAll(uint from, uint limit) public view returns(IndexWithName[] memory){
        require(from <= pollNonce.current(), "From index must be smaller then polls.length");
        uint end = limit;
        if (from+limit > pollNonce.current()) {
            end = pollNonce.current();
        }
        IndexWithName[] memory resultArray = new IndexWithName[](end);

        for (uint i = from; i < end; i++) {
            resultArray[i-from] = IndexWithName(i+1,polls[i+1].name);
        }

        return resultArray;
    }

    /// Will return a list of pollID->PollName, that are still active
    function listActive() public view returns(IndexWithName[] memory){
        IndexWithName[] memory resultArray = new IndexWithName[](activePolls.length);

        for (uint i = 0; i < activePolls.length; i++) {
            resultArray[i] = IndexWithName(i+1,polls[i+1].name);
        }

        return resultArray;
    }

    function removeExpired() public payable returns(uint64){
        uint64 numberOfElementsRemoved = 0;

        for (uint64 i = 0; i < activePolls.length; i++) {
            uint256 currentPollId = activePolls[i];
            if (polls[currentPollId].endTime < block.timestamp) {
                delete activePolls[i];
                numberOfElementsRemoved++;
                if (i > 0) {
                    i--;
                }
            }
        }

        return numberOfElementsRemoved;
    }

    function hasAlreadyVoted(address voter, uint256 pollId) internal view returns(bool){
        address[] memory addressArray = alreadyVotedStorage[pollId];

        for (uint64 i = 0; i < addressArray.length; i++) {
            if (addressArray[i] == voter) {
                return true;
            }
        }

        return false;
    }
}