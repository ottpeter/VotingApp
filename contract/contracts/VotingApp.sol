// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";


contract VotingApp {
    uint16 constant MAX_NAME_LENGTH = 32;
    uint16 constant MAX_DESC_LENGTH = 256;
    uint16 constant MAX_OPTION_LENGTH = 128;
    uint16 constant MAX_OPTION_NUM = 16;

    using Counters for Counters.Counter;

    /// A poll object, that was initiated by a user
    /// Options and alreadyVoted addresses are not inside this object, but they are linked to it by pollID (alreadyVotedStorage, optionsStorage)
    struct Poll {
        string name;                                                    // Name of the poll
        string description;                                             // Description of the poll
        Counters.Counter totalVoters;                                   // Total number of voters
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
}