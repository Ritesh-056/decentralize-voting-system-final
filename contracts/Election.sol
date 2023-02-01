// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Election {
    address public owner;
    uint public candidateCount;
    uint public electionCount;
    uint public voteCount;

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public voters;
    mapping(uint => CreateElection) public elections;

    event NewCreateElection(uint electionID, string name, string department);
    event NewCandidate(uint candidateID, string name, string department);
    event NewVote(uint candidateID);

    struct Candidate {
        string name;
        string department;
        uint voteCount;
    }

    struct CreateElection {
        uint electionId;
        string name;
        string department;
        uint electionDate;
    }

    constructor() {
        owner = msg.sender;
    }


    function createElection(
        string memory _electionName,
        string memory _electionDepartment,
        uint _electionDate
    ) public {
        require(
            msg.sender == owner,
            "Only the contract owner can create election"
        );
        electionCount++;
        elections[electionCount] = CreateElection(
            electionCount,
            _electionName,
            _electionDepartment,
            _electionDate
        );
        emit NewCandidate(electionCount, _electionName, _electionDepartment);
    }

    function addCandidate(
        string memory _name,
        string memory _department
    ) public {
        require(
            msg.sender == owner,
            "Only the contract owner can add candidates."
        );
        candidateCount++;
        candidates[candidateCount] = Candidate(_name, _department, 0);
        emit NewCandidate(candidateCount, _name, _department);
    }

    function vote(uint _candidateID) public {
        require(!voters[msg.sender], "You have already voted.");
        require(
            _candidateID > 0 && _candidateID <= candidateCount,
            "Invalid candidate ID."
        );
        voters[msg.sender] = true;
        candidates[_candidateID].voteCount++;
        voteCount++;
        emit NewVote(_candidateID);
    }

    function winner() public view returns (uint) {
        uint winningCandidateID = 0;
        uint winningVoteCount = 0;
        for (uint i = 1; i <= candidateCount; i++) {
            if (candidates[i].voteCount > winningVoteCount) {
                winningCandidateID = i;
                winningVoteCount = candidates[i].voteCount;
            }
        }
        return winningCandidateID;
    }
}
