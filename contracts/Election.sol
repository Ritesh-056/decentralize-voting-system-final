// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

contract Election {
    bool start;
    bool end;
    uint256 voterCount;
    uint256 candidateCount;
    address public admin;
    address[] public voters; // array to store address of voters
    address[] public candidates; //array to store address of voters

    mapping(address => Voter) public voterDetails;
    mapping(address => Candidate) public candidateDetails;
    mapping(uint256 => ElectionDetails) public elections;

    Elections[] electionsData;

    //registration start and end instance
    //voting start and end instance
    bool isVotingStarted;
    bool isVotingEnded;
    bool isRegistrationStarted;
    bool isRegistrationEnded;

    //voting and registration start and end time
    uint registrationStartTime;
    uint registrationEndTime;
    uint votingStartTime;
    uint votingEndTime;

    constructor() {
        admin = msg.sender;
        candidateCount = 0;
        voterCount = 0;
        isVotingStarted = false;
        isVotingEnded = false;
        isRegistrationStarted = false;
        isRegistrationEnded = true;
        start = false;
        end = false;
    }

    // Candidate attrb
    struct Candidate {
        uint256 candidateId;
        address candidateAddress;
        string header;
        string slogan;
        uint256 voteCount;
        bool isVerified;
        bool isRegistered;
    }

    struct Elections {
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
        Elections[] elections;
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
        require(block.timestamp >=registrationStartTime,"Registration is not started yet");
        require(block.timestamp <=registrationEndTime,"Registration is already ended.");
        _;
    }

    modifier votingTimeOnGoing() {
        require(block.timestamp >=votingStartTime,"Voting is not started yet");
        require(block.timestamp <=votingEndTime,"Voting is already ended");
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
        bytes32[] memory _elections
    )
        public
        // Only admin can add
        onlyAdmin
    {
        string[] memory electionTitles = new string[](_elections.length);
        for (uint256 i = 0; i < _elections.length; i++) {
            electionTitles[i] = bytes32ToString(_elections[i]);
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
            electionsData
        );

        electionDetails = new_election;
        
        //set registration start,end and voting start,end 
        registrationStartTime = _registrationStartTime;
        registrationEndTime = _registrationEndTime;
        votingStartTime = _votingStartTime;
        votingEndTime = _votingEndTime;

        start = true;
        end = false;
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
            titles[i] = electionDetails.elections[i].electionTitle;
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
        string memory _slogan
    ) registrationOnGoing public {
        Candidate memory newCandidate = Candidate({
            candidateAddress: msg.sender,
            candidateId: candidateCount,
            header: _header,
            slogan: _slogan,
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
    }

    // Request to be added as voter
    function registerAsVoter(string memory _name, string memory _phone) registrationOnGoing public {
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
    }

    // Vote
    function vote(address _candidateAddress) votingTimeOnGoing public {
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

    // End election
    function endElection() public onlyAdmin {
        end = true;
        start = false;
    }

    // Get election start and end values
    function getStart() public view returns (bool) {
        return start;
    }

    function getEnd() public view returns (bool) {
        return end;
    }
}
