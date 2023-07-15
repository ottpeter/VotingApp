// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";


contract VAppProto {
    uint16 constant MAX_NAME_LENGTH = 32;
    uint16 constant MAX_DESC_LENGTH = 256;
    uint16 constant MAX_OPTION_LENGTH = 128;
    uint16 constant MAX_OPTION_NUM = 16;

    using Counters for Counters.Counter;

    event CustomLog(string message);
    event CustomNumber(uint256 number);

    struct Poll {
        string name;
        string description;
        uint256 createdTime;         // unix timestamp           THIS SHOULD BE BLOCK NUMBER
        uint256 endTime;             // unix timestamp. Before 2109
        Counters.Counter totalVoteCount;
        //mapping(address => bool) alreadyVoted;
        //Option[] options;
        uint256 pollID;             // will connect alreadyVoted and Options
    }

    struct Option {
        string optionName;
        Counters.Counter voteCount;
    }

    struct PollView {
        string name;
        string description;
        uint256 createdTime;         // unix timestamp
        uint256 endTime;             // unix timestamp. Before 2109
        Counters.Counter totalVoteCount;
    }

    struct IndexWithName {
        uint index;
        string name;
    }

    //Poll[] public polls;
    mapping(uint256 => Poll) polls;
    uint256[] public activePolls;                                           // This is a list of indexes
//    mapping(address => bool)[] arrayOfAlreadyVotedMappings;
    mapping(uint256 => address[]) alreadyVotedStorage;                      // ...
    mapping(uint256 => Option[]) optionsStorage;                            // This stores all Option-s tables, not just one
    Counters.Counter private pollNonce;

    constructor() {
        pollNonce = Counters.Counter(0);
    }

    function createPoll(
        string calldata name, 
        string calldata desc, 
        uint256 end, 
        string[] calldata options
    ) public payable returns(uint256) {
        require(bytes(name).length < MAX_NAME_LENGTH, string(abi.encodePacked("The max length for the title is ", MAX_NAME_LENGTH)));
        require(bytes(desc).length < MAX_DESC_LENGTH, string(abi.encodePacked("The max length for the description is ", MAX_DESC_LENGTH)));
        require(end > block.timestamp, "Expiration date has to be bigger then current time!");
        require(options.length < MAX_OPTION_NUM, string(abi.encodePacked("The max number of options ", MAX_OPTION_NUM)));
        emit CustomLog(string(abi.encodePacked(block.timestamp)));
        pollNonce.increment();
        emit CustomNumber(pollNonce.current());

        Poll memory newPoll = Poll(
            name,
            desc,
            block.timestamp,
            end,
            Counters.Counter(0),
            pollNonce.current()
        );
        
        for (uint16 i = 0; i < options.length; i++) {
            require(bytes(options[i]).length < MAX_OPTION_LENGTH, string(abi.encodePacked("The max length for an option is ", MAX_OPTION_LENGTH)));
            
            Option memory tempOption = Option(
                options[i],
                Counters.Counter(0)
            );
            optionsStorage[pollNonce.current()].push(tempOption);
        }

        polls[pollNonce.current()] = newPoll;

        //removeExpired();        // will cost some gas, but keeps the contract clean

        return pollNonce.current();
    }

    function vote(uint256 pollId, uint256 selectedOption) public payable returns(Option[] memory){
        require(!hasAlreadyVoted(msg.sender, pollId), "This user has already voted!");
        require(pollId < pollNonce.current(), "This poll does not exist!");
        require(polls[pollId].endTime > block.timestamp, "This poll is expired!");
        require(optionsStorage[pollId].length > selectedOption, "selectedOption points to a non-existent option (out of range)!");

        alreadyVotedStorage[pollId].push(msg.sender);

        optionsStorage[pollId][selectedOption].voteCount.increment();

        //removeExpired();       // will cost some gas, but keep the contract clean

        return optionsStorage[pollId];
    }

    function viewPoll(uint pollNumber) public view returns(PollView memory, Option[] memory){
        PollView memory viewedPoll;
        viewedPoll.name = polls[pollNumber].name;
        viewedPoll.description = polls[pollNumber].description;
        viewedPoll.createdTime = polls[pollNumber].createdTime;
        viewedPoll.endTime = polls[pollNumber].endTime;
        viewedPoll.totalVoteCount = polls[pollNumber].totalVoteCount;
        Option[] memory viewedPollOptions = optionsStorage[pollNumber];

        return (viewedPoll, viewedPollOptions);
    }

    function listAll(uint from, uint limit) public view returns(IndexWithName[] memory){
        require(from < pollNonce.current(), "From index must be smaller then polls.length");
        if (from+limit > pollNonce.current()) {
            limit = pollNonce.current();
        }
        IndexWithName[] memory resultArray = new IndexWithName[](limit+1);

        for (uint i = from; i <= limit; i++) {
            resultArray[i-from] = IndexWithName(i,polls[i].name);
        }

        return resultArray;
    }

    function listActive() public view returns(IndexWithName[] memory){
        IndexWithName[] memory resultArray = new IndexWithName[](activePolls.length);

        for (uint i = 0; i < activePolls.length; i++) {
            resultArray[i] = IndexWithName(i,polls[i].name);
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
                i--;
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

