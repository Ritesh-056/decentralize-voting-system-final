// SPDX-License-Identifier: MIT
pragma solidity >=0.8.11 <0.9.0;

import "hardhat/console.sol";

contract Election {
    bool isElectionInit;

    address public admin;
    uint8 candidateCount;
    address[] public voters; // array to store address of voters
    address[] public candidates; //array to store address of voters

    address[] public approvedVoters; //array to store address of approved voters
    address[] public approvedCandidates; //array to store address of approved candidates

    mapping(address => Voter) public voterDetails;
    mapping(address => Candidate) public candidateDetails;

    //voting and registration start and end time
    uint256 registrationStartTime;
    uint256 registrationEndTime;
    uint256 votingStartTime;
    uint256 votingEndTime;

    constructor() {
        admin = msg.sender;
        candidateCount =0;
        isElectionInit = false;
        registrationStartTime = 0;
        registrationEndTime = 0;
        votingStartTime = 0;
        votingEndTime = 0;
    }

    // Candidate attrb
    struct Candidate {
        uint8 candidateId;
        address candidateAddress;
        string header;
        string slogan;
        uint256 electionTitleIndex;
        uint256 voteCount;
        bool isVerified;
        bool isRegistered;
    }

    // Election attrb
    struct ElectionDetails {
        string adminName;
        string adminEmail;
        string adminTitle;
        string organizationTitle;
        uint256 votingStartDate;
        uint256 votingEndDate;
        uint256 registrationStartDate;
        uint256 registrationEndDate;
        string[] elections;
    }

    ElectionDetails electionDetails;

    struct Voter {
        address voterAddress;
        string name;
        string phone;
        bool isVerified;
        bool hasVoted;
        bool isRegistered;
        uint8[] voteCastedTitles;
    }

    modifier registrationOnGoing() {
        require(
            block.timestamp >= registrationStartTime,
            "Registration is not started yet"
        );
        require(
            block.timestamp <= registrationEndTime,
            "Registration is already ended."
        );
        _;
    }

    modifier votingTimeOnGoing() {
        require(
            block.timestamp >= votingStartTime,
            "Voting is not started yet"
        );
        require(block.timestamp <= votingEndTime, "Voting is already ended");
        _;
    }

    modifier onlyAdmin() {
        // Modifier for only admin access
        require(msg.sender == admin);
        _;
    }

    function getAdmin() public view returns (address) {
        // Returns account address used to deploy contract (i.e. admin)
        return admin;
    }

    //setElectionDetails
    function setElectionDetails(
        string memory _adminName,
        string memory _adminEmail,
        string memory _adminTitle,
        string memory _organizationTitle,
        uint256 _votingStartTime,
        uint256 _votingEndTime,
        uint256 _registrationStartTime,
        uint256 _registrationEndTime,
        string[] memory _elections
    )
        public
        // Only admin can add
        onlyAdmin
    {
        string[] memory electionTitles = new string[](_elections.length);
        for (uint256 i = 0; i < _elections.length; i++) {
            electionTitles[i] = _elections[i];
        }

        ElectionDetails memory new_election = ElectionDetails(
            _adminName,
            _adminEmail,
            _adminTitle,
            _organizationTitle,
            _votingStartTime,
            _votingEndTime,
            _registrationStartTime,
            _registrationEndTime,
            electionTitles
        );

        electionDetails = new_election;
        isElectionInit = true;

        //set registration start,end and voting start,end
        registrationStartTime = _registrationStartTime;
        registrationEndTime = _registrationEndTime;
        votingStartTime = _votingStartTime;
        votingEndTime = _votingEndTime;
    }

    //conversion of byte32 string
    function bytes32ToString(
        bytes32 _bytes32
    ) private pure returns (string memory) {
        uint8 i = 0;
        while (i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }

    // Get Elections details
    function getAdminName() public view returns (string memory) {
        return electionDetails.adminName;
    }

    function getAdminEmail() public view returns (string memory) {
        return electionDetails.adminEmail;
    }

    function getAdminTitle() public view returns (string memory) {
        return electionDetails.adminTitle;
    }

    function getOrganizationTitle() public view returns (string memory) {
        return electionDetails.organizationTitle;
    }

    function getElectionTitles() public view returns (string[] memory) {
        string[] memory titles = new string[](electionDetails.elections.length);
        for (uint256 i = 0; i < electionDetails.elections.length; i++) {
            titles[i] = electionDetails.elections[i];
        }
        return titles;
    }

    // Get total unverified candidates count
    function getUnVerifiedCandidates() public view returns (uint256) {
        return candidates.length;
    }

    // Get total inverified voters count
    function getUnVerifiedVoters() public view returns (uint256) {
        return voters.length;
    }


    // Get verified candidates count
    function getVerifiedCandidates() public view returns (uint256) {
        return approvedCandidates.length;
    }

    // Get total inverified voters count
    function getVerifiedVoters() public view returns (uint256) {
        return approvedVoters.length;
    }


    //Request to be added as candidate
    function registerAsCandidate(
        string memory _header,
        string memory _slogan,
        uint256 _electionTitleIndex
    ) public registrationOnGoing {
        Candidate memory newCandidate = Candidate({
            candidateAddress: msg.sender,
            candidateId:candidateCount,
            header: _header,
            slogan: _slogan,
            electionTitleIndex: _electionTitleIndex,
            voteCount: 0,
            isVerified: false,
            isRegistered: true
        });
        candidateDetails[msg.sender] = newCandidate;
        candidates.push(msg.sender);
        candidateCount +=1;

    }

    //verify candidate
    function verifyCandidate(
        bool _verifedStatus,
        address candidateAddress
    ) public onlyAdmin {
        candidateDetails[candidateAddress].isVerified = _verifedStatus;
        approvedCandidates.push(candidateAddress);
    }

    // Request to be added as voter
    function registerAsVoter(string memory _name, string memory _phone) public {
        Voter memory newVoter = Voter({
            voterAddress: msg.sender,
            name: _name,
            phone: _phone,
            hasVoted: false,
            isVerified: false,
            isRegistered: true,
            voteCastedTitles: new uint8[](0)
        });
        voterDetails[msg.sender] = newVoter;
        voters.push(msg.sender);
    }

    // Verify voter
    function verifyVoter(
        bool _verifedStatus,
        address voterAddress
    )
        public
        // Only admin can verify
        onlyAdmin
    {
        voterDetails[voterAddress].isVerified = _verifedStatus;
        approvedVoters.push(voterAddress);
    }

    // function to handle vote [checks if the voter
    // has already voted to the particular elections]
    function vote(
        address _candidateAddress,
        uint8 _electionTitleIndex
    ) public votingTimeOnGoing {
        // require(voterDetails[msg.sender].hasVoted == false);

        bool isAlreadyVoteToElectionTitle = false;
        for (
            uint256 i = 0;
            i < voterDetails[msg.sender].voteCastedTitles.length;
            i++
        ) {
            if (
                voterDetails[msg.sender].voteCastedTitles[i] ==
                _electionTitleIndex
            ) {
                isAlreadyVoteToElectionTitle = true;
                break;
            }
        }
        require(
            isAlreadyVoteToElectionTitle == false,
            "You have already voted to election title"
        );
        require(voterDetails[msg.sender].isVerified == true);
        candidateDetails[_candidateAddress].voteCount += 1;
        voterDetails[msg.sender].hasVoted = true;
        voterDetails[msg.sender].voteCastedTitles.push(_electionTitleIndex);
    }

    //get voting initization status
    function getElectionInitStatus() public view returns (bool) {
        return isElectionInit;
    }

    //get voting registration start
    function getRegistrationStartTime() public view returns (uint256) {
        return registrationStartTime;
    }

    //get voting registration end time
    function getRegistrationEndTime() public view returns (uint256) {
        return registrationEndTime;
    }

    // get voting start
    function getVotingStartTime() public view returns (uint256) {
        return votingStartTime;
    }

    //get voting end time
    function getVotingEndTime() public view returns (uint256) {
        return votingEndTime;
    }

    ///function gives the regsitration ended status.
    function getElectionEndedStatus(
        uint256 _timeStamp
    ) public view returns (bool) {
        bool isElectionEnded = false;
        if (isElectionInit) {
            if (_timeStamp >= votingEndTime) {
                isElectionEnded = true;
            }
        }

        return isElectionEnded;
    }

    ///function gives the registration ongoing status.
    function getRegistrationStatus(
        uint256 _timeStamp
    ) public view returns (bool) {
        bool isRegistrationOnGoing;
        if (
            _timeStamp >= registrationStartTime &&
            _timeStamp <= registrationEndTime
        ) {
            isRegistrationOnGoing = true;
        } else {
            isRegistrationOnGoing = false;
        }
        return isRegistrationOnGoing;
    }

    //check if the election is running or not.
    //[Only vote is done within the election time]
    function getElectionStatus(uint256 _timeStamp) public view returns (bool) {
        bool isVotingOnGoing;
        if (_timeStamp >= votingStartTime && _timeStamp <= votingEndTime) {
            isVotingOnGoing = true;
        } else {
            isVotingOnGoing = false;
        }
        return isVotingOnGoing;
    }

    //get already registered candidate or not status.
    function getAlreadyRegisteredCandidateStatus(
        address _currentAddress
    ) public view returns (bool) {
        bool isAlreadyRegistered = false;
        for (uint i = 0; i < candidates.length; i++) {
            if (_currentAddress == candidates[i]) {
                isAlreadyRegistered = true;
                break;
            }
        }
        return isAlreadyRegistered;
    }

    //checks if the candidate is voter or not [Checks the egibility to be a voter]
    function getVoterStatusForCandidate(
        address _currentAddress
    ) public view returns (bool) {
        bool isCandidateAlreayAVoter = false;
        for (uint i = 0; i < approvedVoters.length; i++) {
            if (_currentAddress == approvedVoters[i]) {
                isCandidateAlreayAVoter = true;
                break;
            }
        }
        return isCandidateAlreayAVoter;
    }

    //get registration started status
    function getRegistrationStartedStatus(
        uint256 _timeStamp
    ) public view returns (bool) {
        bool isRegistrationStarted = false;
        if (
            _timeStamp >= registrationStartTime &&
            _timeStamp <= registrationEndTime
        ) {
            isRegistrationStarted = true;
        }
        return isRegistrationStarted;
    }

    //get registration ended status
    function getRegistrationEndedStatus(
        uint256 _timeStamp
    ) public view returns (bool) {
        bool isRegistrationEnded = false;
        if (_timeStamp >= registrationEndTime) {
            isRegistrationEnded = true;
        }
        return isRegistrationEnded;
    }

    ///get total number of candidates count for the associated election
    function getCandidateCountForAsscociatedElection(
        uint8 _electionTitleIndex
    ) public view returns (uint8) {
        uint8 candidateListCount = 0;
        for (uint i = 0; i < approvedCandidates.length; i++) {
            if (
                candidateDetails[approvedCandidates[i]].electionTitleIndex ==
                _electionTitleIndex
            ) {
                candidateListCount++;
            }
        }
        return candidateListCount;
    }

    //get total candidates for the associated election
    function getCandidatesForAssociatedElections(
        uint8 _electionTitleIndex
    ) public view returns (Candidate[] memory) {
        Candidate[] memory candidatesTemp = new Candidate[](
            approvedCandidates.length
        );
        uint8 numCandidates = 0;

        for (uint i = 0; i < approvedCandidates.length; i++) {
            if (
                candidateDetails[approvedCandidates[i]].electionTitleIndex ==
                _electionTitleIndex
            ) {
                candidatesTemp[numCandidates] = candidateDetails[
                    approvedCandidates[i]
                ];
                numCandidates++;
            }
        }

        // Create a new array with the correct length
        Candidate[] memory candidateListNumber = new Candidate[](numCandidates);

        // Copy the elements from candidatesTemp to the new array
        for (uint i = 0; i < numCandidates; i++) {
            candidateListNumber[i] = candidatesTemp[i];
        }

        return candidateListNumber;
    }

    ///function to get the winner candidate
    /// for particular election title.
    function getWinnerCandidate(
        uint _electionTitleIndex
    ) public view returns (address) {
        uint256 winnerVoteCount = 0;
        address winnerAddress;
        for (uint i = 0; i < approvedCandidates.length; i++) {
            if (
                candidateDetails[approvedCandidates[i]].electionTitleIndex ==
                _electionTitleIndex
            ) {
                uint256 miniVote = candidateDetails[approvedCandidates[i]].voteCount;
                if (miniVote > winnerVoteCount) {
                  winnerVoteCount = miniVote;
                  winnerAddress = approvedCandidates[i];
                }
            }
        }
        return winnerAddress;
    }
}
