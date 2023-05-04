// SPDX-License-Identifier: MIT
pragma solidity >=0.8.11 <0.9.0;

import "hardhat/console.sol";

contract Election {
    bool isElectionInit;
    bool isElectionResultAvailableToPublic;

    address public admin;
    uint8 candidateCount;
    address[] public voters; // array to store address of voters
    address[] public candidates; //array to store address of voters

    address[] public approvedVoters; //array to store address of approved voters
    address[] public approvedCandidates; //array to store address of approved candidates

    address[] public rejectedVoters; //array to store address of rejected voters
    address[] public rejectedCandidates; //array to store address of rejected candidates

    mapping(address => Voter) public voterDetails;
    mapping(address => Candidate) public candidateDetails;

    //rejection voter & candidate mapping
    mapping(address => RejectedVoter) public rejectedVoterDetails;
    mapping(address => RejectedCandidate) public rejectedCandidateDetails;

    //voting and registration start and end time
    uint256 registrationStartTime;
    uint256 registrationEndTime;
    uint256 votingStartTime;
    uint256 votingEndTime;

    constructor() {
        admin = msg.sender;
        candidateCount = 0;
        isElectionInit = false;
        isElectionResultAvailableToPublic = false;
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
        string[] slogans;
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

    struct RejectedVoter {
        address voterAddress;
        string name;
        string phone;
        string message;
    }

    struct RejectedCandidate {
        uint8 candidateId;
        address candidateAddress;
        string header;
        string slogan;
        string message;
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
        string[] memory _elections,
        string[] memory _slogans
    )
        public
        // Only admin can add
        onlyAdmin
    {
        //set election Tiles
        string[] memory electionTitles = new string[](_elections.length);
        for (uint256 i = 0; i < _elections.length; i++) {
            electionTitles[i] = _elections[i];
        }

        //set election slogans
        string[] memory electionSlogans = new string[](_slogans.length);
        for (uint256 i = 0; i < _slogans.length; i++) {
            electionSlogans[i] = _slogans[i];
        }

        //add election details to ElectionDetails
        ElectionDetails memory new_election = ElectionDetails(
            _adminName,
            _adminEmail,
            _adminTitle,
            _organizationTitle,
            _votingStartTime,
            _votingEndTime,
            _registrationStartTime,
            _registrationEndTime,
            electionTitles,
            electionSlogans
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

    function getElectionSlogans() public view returns (string[] memory) {
        string[] memory slogans = new string[](electionDetails.slogans.length);
        for (uint8 i = 0; i < electionDetails.slogans.length; i++) {
            slogans[i] = electionDetails.slogans[i];
        }
        return slogans;
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

    //get total rejected voters
    function getRejectedVoters() public view returns (uint256) {
        return rejectedVoters.length;
    }

    //get total rejected candidates
    function getRejectedCandidates() public view returns (uint256) {
        return rejectedCandidates.length;
    }

    //Request to be added as candidate
    function registerAsCandidate(
        string memory _header,
        string memory _slogan,
        uint256 _electionTitleIndex
    ) public registrationOnGoing {
        Candidate memory newCandidate = Candidate({
            candidateAddress: msg.sender,
            candidateId: candidateCount,
            header: _header,
            slogan: _slogan,
            electionTitleIndex: _electionTitleIndex,
            voteCount: 0,
            isVerified: false,
            isRegistered: true
        });
        candidateDetails[msg.sender] = newCandidate;
        candidates.push(msg.sender);
        candidateCount += 1;
    }

    //verify candidate
    function verifyCandidate(
        bool _verifedStatus,
        address candidateAddress
    ) public onlyAdmin {
        candidateDetails[candidateAddress].isVerified = _verifedStatus;
        approvedCandidates.push(candidateAddress);
    }

    //reject candiates
    function rejectCandidate(
        address candidateAddress,
        string memory message
    ) public onlyAdmin {
        bool candidatesAddressFound = false;
        bool isAlreadyRejected = false;

        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i] == candidateAddress) {
                candidatesAddressFound = true;
                break;
            }
        }

        ///iterate rejected candidates length
        for (uint256 j = 0; j < rejectedCandidates.length; j++) {
            if (rejectedCandidates[j] == candidateAddress) {
                isAlreadyRejected = true;
            }
        }

        require(candidatesAddressFound == true, "Candidate address not found");
        require(isAlreadyRejected == false, "Candidate already rejected.");

        //rejected candidate details
        rejectedCandidateDetails[candidateAddress]
            .candidateId = candidateDetails[candidateAddress].candidateId;
        rejectedCandidateDetails[candidateAddress]
            .candidateAddress = candidateDetails[candidateAddress]
            .candidateAddress;
        rejectedCandidateDetails[candidateAddress].header = candidateDetails[
            candidateAddress
        ].header;
        rejectedCandidateDetails[candidateAddress].slogan = candidateDetails[
            candidateAddress
        ].slogan;
        rejectedCandidateDetails[candidateAddress].message = message;

        //add the rejected candidates address to the list.
        rejectedCandidates.push(candidateAddress);
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

    function rejectVoter(
        address voterAddress,
        string memory message
    ) public onlyAdmin {
        bool votersAddressFound = false;
        bool isAlreadyRejected = false;

        ///iterate voters length
        for (uint256 i = 0; i < voters.length; i++) {
            if (voters[i] == voterAddress) {
                votersAddressFound = true;
                break;
            }
        }

        ///iterate rejected voters length
        for (uint256 j = 0; j < rejectedVoters.length; j++) {
            if (rejectedVoters[j] == voterAddress) {
                isAlreadyRejected = true;
            }
        }

        require(votersAddressFound == true, "Voters address not found");
        require(isAlreadyRejected == false, "Voter already rejected.");

        //rejected voter details
        rejectedVoterDetails[voterAddress].message = message;
        rejectedVoterDetails[voterAddress].name = voterDetails[voterAddress]
            .name;
        rejectedVoterDetails[voterAddress].phone = voterDetails[voterAddress]
            .phone;
        rejectedVoterDetails[voterAddress].voterAddress = voterDetails[
            voterAddress
        ].voterAddress;

        //add the rejected voter address to the list.
        rejectedVoters.push(voterAddress);
    }

    //function that check if the
    //item is present in the list.
    function iselectionTitleIndexInList(
        uint8[] memory electionTitleList,
        uint8 item
    ) public pure returns (bool) {
        for (uint i = 0; i < electionTitleList.length; i++) {
            if (electionTitleList[i] == item) {
                return true;
            }
        }
        return false;
    }

    // function to handle vote [checks if the voter
    // has already voted to the particular elections]
    function vote(
        address _candidateAddress,
        uint8 _electionTitleIndex
    ) public votingTimeOnGoing {
        bool isItemExisted = iselectionTitleIndexInList(
            voterDetails[msg.sender].voteCastedTitles,
            _electionTitleIndex
        );
        require(!isItemExisted, "Already casted vote to the selected title.");
        require(voterDetails[msg.sender].isVerified == true);
        candidateDetails[_candidateAddress].voteCount += 1;
        voterDetails[msg.sender].hasVoted = true;
        voterDetails[msg.sender].voteCastedTitles.push(_electionTitleIndex);
    }

    ///get voter election titles.
    function getVoterElectionTitles() public view returns (uint8[] memory) {
        uint8[] memory votedCastedTitles = voterDetails[msg.sender]
            .voteCastedTitles;
        return votedCastedTitles;
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
                uint256 miniVote = candidateDetails[approvedCandidates[i]]
                    .voteCount;
                if (miniVote > winnerVoteCount) {
                    winnerVoteCount = miniVote;
                    winnerAddress = approvedCandidates[i];
                }
            }
        }
        return winnerAddress;
    }

    // show the result to public
    function setElectionResultShowFeatureToPublic() public onlyAdmin {
        isElectionResultAvailableToPublic = true;
    }

    //get the status of election show feature
    function electionResultShowFeatureToPublicStatus() public view returns (bool) {
        return isElectionResultAvailableToPublic;
    }
}


