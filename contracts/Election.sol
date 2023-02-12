// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;

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

    constructor()  {
        // Initilizing default values
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

    // Election attrb
    struct ElectionDetails {
        string adminName;
        string adminEmail;
        string adminTitle;
        string electionTitle;
        string organizationTitle;
    }
    ElectionDetails electionDetails;


    // Voter attrb 
        struct Voter {
            address voterAddress;
            string name;
            string phone;
            bool isVerified;
            bool hasVoted;
            bool isRegistered;
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

    // Adding new candidates
    // function addCandidate(
    //     string memory _header,
    //     string memory _slogan
    // )
    //     public
    //     // Only admin can add
    //     onlyAdmin
    // {
    //     Candidate memory newCandidate = Candidate({
    //         candidateId: candidateCount,
    //         header: _header,
    //         symbol: _slogan,
    //         voteCount: 0

    //     });
    //     candidateDetails[candidateCount] = newCandidate;
    //     candidateCount += 1;
    // }




    function setElectionDetails(
        string memory _adminName,
        string memory _adminEmail,
        string memory _adminTitle,
        string memory _electionTitle,
        string memory _organizationTitle
    )
        public
        // Only admin can add
        onlyAdmin
    {
        electionDetails = ElectionDetails(
            _adminName,
            _adminEmail,
            _adminTitle,
            _electionTitle,
            _organizationTitle
        );
        start = true;
        end = false;
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

    function getElectionTitle() public view returns (string memory) {
        return electionDetails.electionTitle;
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
    function registerAsCandidate(string memory _header,string memory _slogan) public{
        Candidate memory newCandidate = Candidate({
                    candidateAddress:msg.sender,
                    candidateId: candidateCount,
                    header: _header,
                    slogan: _slogan,
                    voteCount: 0,
                    isVerified:false,
                    isRegistered:true 
                });
                candidateDetails[msg.sender] = newCandidate; 
                candidates.push(msg.sender);
                candidateCount += 1;
    }

    //verify candidate
    function verifyCandidate(
        bool _verifedStatus,
        address candidateAddress
    )public onlyAdmin {
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
    function vote(address _candidateAddress) public {
        require(voterDetails[msg.sender].hasVoted == false);
        require(voterDetails[msg.sender].isVerified == true);
        require(start == true);
        require(end == false);
        candidateDetails[_candidateAddress].voteCount += 1;
        voterDetails[msg.sender].hasVoted = true;
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
