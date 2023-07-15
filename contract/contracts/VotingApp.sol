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
        require(bytes(name).length < MAX_NAME_LENGTH, string(abi.encodePacked("The max length for the title is ", MAX_NAME_LENGTH)));
        require(bytes(desc).length < MAX_DESC_LENGTH, string(abi.encodePacked("The max length for the description is ", MAX_DESC_LENGTH)));
        require(end > block.timestamp, "Expiration date has to be bigger then current time!");
        require(options.length < MAX_OPTION_NUM, string(abi.encodePacked("The max number of options ", MAX_OPTION_NUM)));

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
                string(abi.encodePacked("The max length for an option is ", MAX_OPTION_LENGTH))
            );

            Option memory tempOption = Option(
                options[i],
                Counters.Counter(0)
            );
            optionsStorage[pollNonce.current()].push(tempOption);
        }

        polls[pollNonce.current()] = newPoll;                           // Add the poll to the polls mapping
        activePolls.push(pollNonce.current());                          // List the poll as active

        removeExpired();                                                // This will cost some additional gas,
                                                                        // but activePolls will be more up-to-date (can be removed)
        return pollNonce.current();
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