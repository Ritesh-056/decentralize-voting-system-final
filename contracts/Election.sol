// SPDX-License-Identifier: MIT
pragma solidity >=0.8.11 <0.9.0;

contract Election {
    bool start;
    bool end;
    bool registrationStart;
    bool registrationEnd;
    uint256 voterCount;
    uint256 candidateCount;
    address public admin;
    address[] public voters; // array to store address of voters
    address[] public candidates; //array to store address of voters

    mapping(address => Voter) public voterDetails;
    mapping(address => Candidate) public candidateDetails;

    ElectionsCategory[] electionsData;


    //voting and registration start and end time
    uint registrationStartTime;
    uint registrationEndTime;
    uint votingStartTime;
    uint votingEndTime;

    constructor() {
        admin = msg.sender;
        candidateCount = 0;
        voterCount = 0;
        registrationStart = false;
        registrationEnd = false; 
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
        // mapping(uint=>ElectionsCategory)  electionsCategory;
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
    uint256 _votingStartDate,
    uint256 _votingEndDate,
    uint256 _registrationStartDate,
    uint256 _registrationEndDate,
    bytes32[] memory _electionCategories
)
    public
    // Only admin can add
    onlyAdmin
{
    //    uint256 numCategories = _electionCategories.length;
    // mapping(uint256 => ElectionsCategory) storage categories = electionDetails.electionsCategory;

    // // Create a new ElectionsCategory struct in storage for each element in _electionCategories
    // for (uint256 i = 0; i < numCategories; i++) {
    //     categories[i] = ElectionsCategory({
    //         electionId: i,
    //         electionTitle: bytes32ToString(_electionCategories[i])
    //     });
    // }

    // Create a new ElectionDetails object with the input parameters and the new election categories array
    ElectionDetails memory newElectionDetails = ElectionDetails({
        adminName: _adminName,
        adminEmail: _adminEmail,
        adminTitle: _adminTitle,
        organizationTitle: _organizationTitle,
        votingStartDate: _votingStartDate,
        votingEndDate: _votingEndDate,
        registrationStartDate: _registrationStartDate,
        registrationEndDate: _registrationEndDate
        // electionCategories: categories
    });
    
    // Assign the new election details to the contract state variable
    electionDetails = newElectionDetails;
    
    // Set the registration start, end, voting start, and end times
    registrationStartTime = _registrationStartDate;
    registrationEndTime = _registrationEndDate;
    votingStartTime = _votingStartDate;
    votingEndTime = _votingEndDate;
    
}




    // Function to convert bytes32 to string
    function bytes32ToString(
        bytes32 _bytes32
    ) public pure returns (string memory) {
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

    // function getElectionTitles() public view returns (string[] memory) {
    //     string[] memory titles = new string[](
    //         electionDetails.electionCategories.length
    //     );
    //     for (
    //         uint256 i = 0;
    //         i < electionDetails.electionCategories.length;
    //         i++
    //     ) {
    //         titles[i] = electionDetails.electionCategories[i].electionTitle;
    //     }
    //     return titles;
    // }

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
    ) public registrationOnGoing {
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
    function registerAsVoter(
        string memory _name,
        string memory _phone
    ) public registrationOnGoing {
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

    // Get election start and end values
    function getStart() public view returns (bool) {
        return start;
    }

    function getEnd() public view returns (bool) {
        return end;
    }
}
