// SPDX-License-Identifier: MIT
pragma solidity >=0.8.11 <0.9.0;

contract Election {
    bool isElectionInit;

    uint256 voterCount;
    uint256 candidateCount;
    address public admin;
    address[] public voters; // array to store address of voters
    address[] public candidates; //array to store address of voters

    address[] public approvedVoters; //array to store address of approved voters
    address[] public approvedCandidates; //array to store address of approved candidates

    mapping(address => Voter) public voterDetails;
    mapping(address => Candidate) public candidateDetails;

    //voting and registration start and end time
    uint256  registrationStartTime;
    uint256  registrationEndTime;
    uint256  votingStartTime;
    uint256  votingEndTime;



    constructor() {
        admin = msg.sender;
        candidateCount = 0;
        voterCount = 0;
        isElectionInit = false;
        registrationStartTime = 0;
        registrationEndTime = 0 ;
        votingStartTime = 0;
        votingEndTime = 0;
    }

    // Candidate attrb
    struct Candidate {
        uint256 candidateId;
        address candidateAddress;
        string header;
        string slogan;
        uint256 electionTitleIndex;
        uint256 voteCount;
        bool isVerified;
        bool isRegistered;
    }

    struct ElectionsCategory {
        uint256 electionId;
        string electionTitle;
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
        isElectionInit =true;
        
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

    // Get candidates count
    function getTotalCandidate() public view returns (uint256) {
        // Returns total number of candidates
        return candidateCount;
    }

    // Get voters count
    function getTotalVoter() public view returns (uint256) {
        // Returns total number of voters
        return voterCount;
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


    // Request to be added as voter
    function registerAsVoter(
        string memory _name,
        string memory _phone
    ) public {
        Voter memory newVoter = Voter({
            voterAddress: msg.sender,
            name: _name,
            phone: _phone,
            hasVoted: false,
            isVerified: false,
            isRegistered: true
        });
        voterDetails[msg.sender] = newVoter;
        voters.push(msg.sender);
        voterCount += 1;
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

    // Vote
    function vote(address _candidateAddress) public votingTimeOnGoing {
        require(voterDetails[msg.sender].hasVoted == false);
        require(voterDetails[msg.sender].isVerified == true);
        candidateDetails[_candidateAddress].voteCount += 1;
        voterDetails[msg.sender].hasVoted = true;
    }

    function getWinner() public view returns (address) {
        uint256 winnerVoteCount = 0;
        address winnerAddress;
        for (uint256 i = 0; i < candidateCount; i++) {
            address candidateAddress = candidates[i];
            uint256 miniVote = candidateDetails[candidateAddress].voteCount;
            if (miniVote > winnerVoteCount) {
                winnerVoteCount = miniVote;
                winnerAddress = candidateAddress;
            }
        }
        return winnerAddress;
    }


    function getElectionInitStatus() public view returns(bool){
       return isElectionInit; 
    }

    function getElectionEndedStatus(uint256 _timeStamp) public view returns (bool) {
        bool isElectionEnded = false; 
        if(isElectionInit){
            if(_timeStamp >= votingEndTime){
                isElectionEnded = true; 
            }
        }
       
        return isElectionEnded;
    }

    function getAlreadyRegisteredCandidateStatus(address _currentAddress) public view returns(bool){
        bool isAlreadyRegistered = false; 
        for (uint i = 0; i < candidates.length; i++) {
            if (_currentAddress == candidates[i]) {
                isAlreadyRegistered = true;
                break;
            }
        }
        return isAlreadyRegistered ;
    }

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

    function getElectionStatus(
        uint256 _timeStamp
    ) public view returns (bool) {
        bool isVotingOnGoing;
        if (
            _timeStamp >= votingStartTime &&
            _timeStamp <= votingEndTime
        ) {
            isVotingOnGoing = true;
        } else {
            isVotingOnGoing = false;
        }
        return isVotingOnGoing;
    }

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

    //get voting registration start and end times
    function getRegistrationStartTime() public view returns (uint256) {
        return registrationStartTime;
    }

    function getRegistrationEndTime() public view returns (uint256) {
        return registrationEndTime;
    }

    // get voting start and end times
    function getVotingStartTime() public view returns (uint256) {
        return votingStartTime;
    }

    function getVotingEndTime() public view returns (uint256) {
        return votingEndTime;
    }

    //get candidate associated with the elections
    function getCandidatesForAssociatedElections(
        uint256 _electionTitleIndex
    ) public view returns (Candidate[] memory) {
        Candidate[] memory candidatesTemp = new Candidate[](
            approvedCandidates.length
        );
        uint256 numCandidates = 0;

        for (uint256 i = 0; i < approvedCandidates.length; i++) {
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



    function getCandidateCountForAsscociatedElection(
        uint256 _electionTitleIndex
    ) public view returns (uint256) {
        uint256 candidateListCount = 0;
        for (uint256 i = 0; i < approvedCandidates.length; i++) {
            if (
                candidateDetails[approvedCandidates[i]].electionTitleIndex ==
                _electionTitleIndex
            ) {
                candidateListCount++;
            }
        }
        return candidateListCount;
    }
}
