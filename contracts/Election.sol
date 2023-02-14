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

    constructor() {
        admin = msg.sender;
        candidateCount = 0;
        voterCount = 0;
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

    modifier registrationTimeOnGoing() {
        require(true);
        _;
    }

    modifier votingTimeOnGoing() {
        require(true);
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

    // function setElectionDetails(
    //     string memory _adminName,
    //     string memory _adminEmail,
    //     string memory _adminTitle,
    //     string memory _organizationTitle,
    //     uint256 _votingStartDate,
    //     uint256 _votingEndDate,
    //     uint256 _registrationStartDate,
    //     uint256 _registrationEndDate,
    //     string[] memory _elections
    // )
    //     public
    //     // Only admin can add
    //     onlyAdmin
    // {
    //     for (uint256 i = 0; i < _elections.length; i++) {
    //         // electionsData.push();
    //         // Elections storage new_election = electionsData[
    //         //     electionsData.length
    //         // ];
    //         // new_election.electionId = i;
    //         // new_election.electionTitle = _elections[i];
    //         electionsData.push(Elections(i, _elections[i]));
    //     }

    //     ElectionDetails memory new_election = ElectionDetails(
    //         _adminName,
    //         _adminEmail,
    //         _adminTitle,
    //         _organizationTitle,
    //         _votingStartDate,
    //         _votingEndDate,
    //         _registrationStartDate,
    //         _registrationEndDate,
    //         electionsData
    //     );

    //     electionDetails = new_election;
    //     start = true;
    //     end = false;
    // }

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
    function registerAsCandidate(string memory _header, string memory _slogan)
        public
    {
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
    function verifyCandidate(bool _verifedStatus, address candidateAddress)
        public
        onlyAdmin
    {
        candidateDetails[candidateAddress].isVerified = _verifedStatus;
    }

    // Request to be added as voter
    function registerAsVoter(string memory _name, string memory _phone) public {
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
    function verifyVoter(bool _verifedStatus, address voterAddress)
        public
        // Only admin can verify
        onlyAdmin
    {
        voterDetails[voterAddress].isVerified = _verifedStatus;
    }

    // Vote
    function vote(address _candidateAddress) public {
        require(voterDetails[msg.sender].hasVoted == false);
        require(voterDetails[msg.sender].isVerified == true);
        require(start == true);
        require(end == false);
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
