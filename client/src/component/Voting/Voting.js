// Node modules
import React, { Component } from "react";
import { Link } from "react-router-dom";

// Components
import Navbar from "../Navbar/Navigation";
import NavbarAdmin from "../Navbar/NavigationAdmin";
import NotInit from "../NotInit";

// Contract
import getWeb3 from "../../getWeb3";
import Election from "../../artifacts/contracts/Election.sol/Election.json";
import ElectionNotStarted from "../ElectionNotStarted";

// CSS
import "./Voting.css";
import NotCandidateCounted from "../NoCandidateCounted";
import { getLocalDateTime } from "../../DateTimeLocal";
import SingleCandidateStatus from "./SingleCandidateStatus";


export default class Voting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ElectionInstance: undefined,
      account: null,
      web3: null,
      isAdmin: false,
      electionTitles: [],
      candidateCount: undefined,
      candidates: [],
      electionStarted: false,
      electionInitStatus: false,
      isSingleElectionAndCandidate:false,
      currentVoter: {
        address: undefined,
        name: null,
        phone: null,
        hasVoted: false,
        isVerified: false,
        isRegistered: false,
        voteCastedTitles:[]
      },
    };
  }
  componentDidMount = async () => {
    // refreshing once
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Election.networks[networkId];
      const instance = new web3.eth.Contract(
        Election.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        web3: web3,
        ElectionInstance: instance,
        account: accounts[0],
      });

      // Get start and end values
      const currentTimeStamp = Math.floor(Date.now() / 1000);
      console.log("Current send time is", getLocalDateTime(currentTimeStamp));

      // Admin account and verification
      const admin = await this.state.ElectionInstance.methods.getAdmin().call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }

      // Get total number of candidates
      const candidateCount = await this.state.ElectionInstance.methods
        .getTotalCandidate()
        .call();
      this.setState({ candidateCount: candidateCount });

      // Loading Candidates details
      for (let i = 0; i < this.state.candidateCount; i++) {
        const candidateAddress = await this.state.ElectionInstance.methods
          .approvedCandidates(i)
          .call();
        const candidate = await this.state.ElectionInstance.methods
          .candidateDetails(candidateAddress)
          .call();
        this.state.candidates.push({
          candidateAddress: candidate.candidateAddress,
          candidateId: candidate.candidateId,
          header: candidate.header,
          slogan: candidate.slogan,
          electionTitleIndex: candidate.electionTitleIndex,
          isVerified: candidate.isVerified,
          isRegistered: candidate.isRegistered,
        });
      }

      this.setState({ candidates: this.state.candidates });

      // Loading current voter
      const voter = await this.state.ElectionInstance.methods
        .voterDetails(this.state.account)
        .call();
      this.setState({
        currentVoter: {
          address: voter.voterAddress,
          name: voter.name,
          phone: voter.phone,
          hasVoted: voter.hasVoted,
          isVerified: voter.isVerified,
          isRegistered: voter.isRegistered,
          voteCastedTitles:voter.voteCastedTitles
        },
      });

      const electionInitStatus = await this.state.ElectionInstance.methods
        .getElectionInitStatus()
        .call();
      this.setState({ electionInitStatus: electionInitStatus });

      const electionTitles = await this.state.ElectionInstance.methods
        .getElectionTitles()
        .call();
      this.setState({ electionTitles: electionTitles });

      const votingstartedTime = await this.state.ElectionInstance.methods
        .getVotingStartTime()
        .call();
      const votingEndedTime = await this.state.ElectionInstance.methods
        .getVotingEndTime()
        .call();

      console.log("Voting started time:", getLocalDateTime(votingstartedTime));
      console.log("Voting end time:", getLocalDateTime(votingEndedTime));

      // Get start and end values
      const isElectionEnded = await this.state.ElectionInstance.methods
        .getElectionEndedStatus(currentTimeStamp)
        .call();
      this.setState({ isElectionEnded: isElectionEnded });

      console.log("Election ended status", this.state.isElectionEnded);

      const electionStarted = await this.state.ElectionInstance.methods
        .getElectionStatus(currentTimeStamp)
        .call();
      this.setState({ electionStarted: electionStarted });
      console.log("Election started", this.state.electionStarted);


      if(this.state.electionTitles.length == 1 ){
        const isSingleElectionAndCandidate = await this.state.ElectionInstance.methods
        .checkForSingleElectionAndCandidate(0)
        .call();
        this.setState({isSingleElectionAndCandidate : isSingleElectionAndCandidate});
        
      }

      if(this.state.isSingleElectionAndCandidate && this.state.registrationEnded){
        this.setState({isElectionEnded :true});
      }

      console.log("Vote casted titles is", this.state.voteCastedTitles); 
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  renderElectionCategories = (electionTitles, electionTitleIndex) => {
    const candidates = this.state.candidates
      .filter((candidate) => candidate.electionTitleIndex == electionTitleIndex)
      .sort((a, b) => a.candidateId - b.candidateId);

    return (
      <>
        <div className="container-item-election-category">
          <div className="candidate-info-header-title">
            <h2 style={{ padding: 32 }}>{electionTitles}</h2>
          </div>
          {candidates.length >= 1 ? (
            candidates.length == 1 ? (
              <>
                <SingleCandidateStatus candidate={candidates[0]} />
              </>
            ) : (
              candidates.map((candidates) =>
                this.renderCandidates(candidates, electionTitleIndex)
              )
              // candidates.map(this.renderCandidates,)
            )
          ) : (
            <>
              <NotCandidateCounted />
            </>
          )}
        </div>
      </>
    );
  };

  renderCandidates = (candidate) => {
    const castVote = async (candidateAddress) => {
      await this.state.ElectionInstance.methods
        .vote(candidateAddress)
        .send({ from: this.state.account, gas: 1000000 });
      window.location.reload();
    };

    const confirmVote = (candidateAddress, header) => {
      var r = window.confirm(
        "Vote for " +
          header +
          " with id " +
          candidate.candidateId +
          ".\nAre you sure?"
      );
      if (r === true) {
        castVote(candidateAddress);
      }
    };
    return (
      <div className="container-item">
        x
        <div className="candidate-data">
          <h2>
            {`[${candidate.candidateId}] `}
            {candidate.header}
          </h2>{" "}
          <small>{candidate.slogan}</small>
        </div>
        <div className="vote-btn-container">
          <button
            onClick={() =>
              confirmVote(candidate.candidateAddress, candidate.header)
            }
            className="vote-bth"
            disabled={
              !this.state.currentVoter.isRegistered ||
              !this.state.currentVoter.isVerified ||
              this.state.currentVoter.hasVoted
            }
          >
            Vote
          </button>
        </div>
      </div>
    );
  };

  render() {
    if (!this.state.web3) {
      return (
        <>
          {this.state.isAdmin ? <NavbarAdmin /> : <Navbar />}
          <center>
            <div className="loader">
              <div className="spinner"></div>
              <div className="spin-text">
                {" "}
                Loading Web3, accounts, and contract !
              </div>
            </div>
          </center>
        </>
      );
    }

    return (
      <>
        {this.state.isAdmin ? <NavbarAdmin /> : <Navbar />}
        <div>
          {this.state.electionInitStatus ? (
            this.state.electionStarted ? (
              <>
                {this.state.currentVoter.isRegistered ? (
                  this.state.currentVoter.isVerified ? (
                    this.state.currentVoter.hasVoted ? (
                      <div className="container-item success">
                        <div>
                          <strong>You've casted your vote.</strong>
                          <p />
                          <center>
                            <Link
                              to="/Results"
                              style={{
                                color: "white",
                                textDecoration: "underline",
                              }}
                            >
                              <button className="btn-election">
                                View result
                              </button>
                            </Link>
                          </center>
                        </div>
                      </div>
                    ) : (
                      <div className="container-item info">
                        <center>Go ahead and cast your vote.</center>
                      </div>
                    )
                  ) : (
                    <div className="container-item attention">
                      <center>Please wait for admin to verify.</center>
                    </div>
                  )
                ) : (
                  <>
                    <div className="container-item attention">
                      <center>
                        <p>You're not registered. Please register first.</p>
                        <br />
                        <Link
                          to="/Registration"
                          style={{
                            color: "black",
                            textDecoration: "underline",
                          }}
                        >
                          <button className="btn-election">
                            Register here
                          </button>
                        </Link>
                      </center>
                    </div>
                  </>
                )}

                <div className="container-main">
                  <h2>Elections Categories</h2>
                  <small>
                    Total Category: {this.state.electionTitles.length}
                  </small>
                  {this.state.electionTitles.length < 1 ? (
                    <div className="container-item attention">
                      <center>No any election to vote for.</center>
                    </div>
                  ) : (
                    <>
                      {this.state.electionTitles.map((electionTitle, electionTitleIndex) =>
                        this.renderElectionCategories(electionTitle, electionTitleIndex)
                      )}
                    </>
                  )}
                </div>
              </>
            ) : this.state.isElectionEnded ? (
              <>
                <div className="container-item attention">
                  <center>
                    <h3>
                      Oops! Election is already ended. You can view the results.
                    </h3>
                    <br />
                    <Link
                      to="/Results"
                      style={{ color: "white", textDecoration: "underline" }}
                    >
                      <button className="btn-election">View result</button>
                    </Link>
                  </center>
                </div>
              </>
            ) : (
              <>
                <ElectionNotStarted />
              </>
            )
          ) : (
            <>
              <NotInit />
            </>
          )}
        </div>
      </>
    );
  }
}
