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
import {
  NotAnyCandidateOnElectionCounted,
  NotCandidateCounted,
} from "../NoCandidateCounted";
import { getLocalDateTime } from "../../DateTimeLocal";
import SingleCandidateStatus from "./SingleCandidateStatus";
import { saveVotedElectionIndicesToLocal } from "../../component/VotedElectionHelper";

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
      isSingleElectionAndCandidate: false,
      registrationStartedSatus: false,
      registrationEndedStatus: false,
      isElectionEnded: false,
      voteCastedTitles: [],
      electionStartTime: undefined,
      currentVoter: {
        address: undefined,
        name: null,
        phone: null,
        hasVoted: false,
        isVerified: false,
        isRegistered: false,
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

      // Get total number of verified candidates
      const candidateCount = await this.state.ElectionInstance.methods
        .getVerifiedCandidates()
        .call();
      this.setState({ candidateCount: candidateCount });

      console.log("Get verified candidate", candidateCount);

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
          header: candidate.header,
          slogan: candidate.slogan,
          candidateId: candidate.candidateId,
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

      console.log("Election titles", electionTitles);

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

      //get voting registration start and end times
      const registrationStartedSatus = await this.state.ElectionInstance.methods
        .getRegistrationStartedStatus(currentTimeStamp)
        .call();
      const registrationEndedStatus = await this.state.ElectionInstance.methods
        .getRegistrationEndedStatus(currentTimeStamp)
        .call();

      this.setState({
        registrationStartedSatus: registrationStartedSatus,
        registrationEndedStatus: registrationEndedStatus,
      });

      console.log("Is registration started", registrationStartedSatus);
      console.log("Is registration ended", registrationEndedStatus);
      console.log("ELection voted titles index", this.state.items);

      const votingstartedTime = await this.state.ElectionInstance.methods
        .getVotingStartTime()
        .call();
      const votingEndedTime = await this.state.ElectionInstance.methods
        .getVotingEndTime()
        .call();
      this.setState({ electionStartTime: getLocalDateTime(votingstartedTime) });

      console.log("Voting started time:", getLocalDateTime(votingstartedTime));
      console.log("Voting end time:", getLocalDateTime(votingEndedTime));
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

  renderCandidates = (candidate, electionTitleIndex) => {
    const castVote = async (candidateAddress, electionTitleIndex) => {
      await this.state.ElectionInstance.methods
        .vote(candidateAddress, electionTitleIndex)
        .send({ from: this.state.account, gas: 1000000 });
      saveVotedElectionIndicesToLocal(electionTitleIndex, this.state.account);
      alert("Voted Successful");
      window.location.reload();
    };

    const voteUtil = (alertVoteTitle) => {
      alert(alertVoteTitle);
      confirmVote(
        candidate.candidateAddress,
        candidate.header,
        electionTitleIndex
      );
    };

    const confirmVote = (candidateAddress, header, electionTitleIndex) => {
      var r = window.confirm(
        "Vote for " +
          header +
          " with id " +
          candidate.candidateId +
          ".\nAre you sure?"
      );
      if (r === true) {
        castVote(candidateAddress, electionTitleIndex);
      }
    };

    // Get the stored value for the account
    const storedValue = localStorage.getItem(
      `votedElectionIndices_${this.state.account}`
    );

    //geting the stored election title indexes.
    const indices = storedValue ? JSON.parse(storedValue) : [];
    const isElectiontitleExist = indices.includes(electionTitleIndex);
    console.log(`Has voted ${electionTitleIndex}`, isElectiontitleExist);

    return (
      <div className="container-item-voting">
        <div className="candidate-data">
          <h2>
            {`[${candidate.candidateId}] `}
            {candidate.header}
          </h2>{" "}
          <small>{candidate.slogan}</small>
        </div>
        <div className="vote-btn-container">
          {isElectiontitleExist ? (
            <button className="vote-bth">Voted</button>
          ) : (
            <button
              onClick={() => {
                const voteAlertTitle = `Cast vote [${candidate.candidateId}] to ${candidate.header}.`;
                if (isElectiontitleExist) {
                  return alert("Already Voted to the election title");
                } else {
                  voteUtil(voteAlertTitle);
                }
              }}
              className="vote-bth"
            >
              Vote
            </button>
          )}
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
            this.state.candidateCount == 0 ? (
              <>
                <NotCandidateCounted />
              </>
            ) : this.state.electionStarted ? (
              <>
                {this.state.currentVoter.isRegistered ? (
                  this.state.currentVoter.isVerified ? (
                    this.state.currentVoter.hasVoted ? (
                      <div className="container-item success">
                        <div>
                          <strong>You've casted your vote.</strong>
                          <center>
                            <Link
                              to="/Results"
                              style={{
                                color: "white",
                                textDecoration: "underline",
                              }}
                            >
                              <button
                                style={{ marginTop: 16 }}
                                className="btn-verification-approve"
                              >
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
                          <button className="btn-verification-approve">
                            Register here
                          </button>
                        </Link>
                      </center>
                    </div>
                  </>
                )}

                {this.state.currentVoter.isVerified ? (
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
                        {this.state.electionTitles.map(
                          (electionTitle, electionTitleIndex) =>
                            this.renderElectionCategories(
                              electionTitle,
                              electionTitleIndex
                            )
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <></>
                )}
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
                      <button className="btn-verification-approve">
                        View result
                      </button>
                    </Link>
                  </center>
                </div>
              </>
            ) : (
              <>
                <ElectionNotStarted data={this.state.electionStartTime} />
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
