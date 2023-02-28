// Node modules
import React, { Component } from "react";
import { Link } from "react-router-dom";

// Components
import Navbar from "../Navbar/Navigation";
import NavbarAdmin from "../Navbar/NavigationAdmin";
import NotInit from "../NotInit";
import ElectionNotStarted from "../ElectionNotStarted";
import { getLocalDateTime } from "../../DateTimeLocal";

// Contract
import getWeb3 from "../../getWeb3";
import Election from "../../artifacts/contracts/Election.sol/Election.json";

// CSS
import "./Results.css";
import NotCandidateCounted from "../NoCandidateCounted";

export default class Result extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ElectionInstance: undefined,
      account: null,
      web3: null,
      isAdmin: false,
      candidateCount: undefined,
      candidates: [],
      electionTitles: [],
      isElectionEnded: false,
      electionStarted: false,
      electionInitStatus: false,
      winnerCandidates: [],
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
      this.setState({ web3, ElectionInstance: instance, account: accounts[0] });

      // Get start and end values
      const currentTimeStamp = Math.floor(Date.now() / 1000);
      console.log("Current send time is", getLocalDateTime(currentTimeStamp));

      // Get total number of candidates
      const candidateCount = await this.state.ElectionInstance.methods
        .getTotalCandidate()
        .call();
      this.setState({ candidateCount: candidateCount });

      // Loadin Candidates detials
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
          voteCount: candidate.voteCount,
          isVerified: candidate.isVerified,
          isRegistered: candidate.isRegistered,
        });
      }

      this.setState({ candidates: this.state.candidates });

      //winner candidate details
      const winnerAddress = await this.state.ElectionInstance.methods
        .getWinner()
        .call();
      const winnerCandidate = await this.state.ElectionInstance.methods
        .candidateDetails(winnerAddress)
        .call();

      this.state.winnerCandidates.push({
        candidateAddress: winnerCandidate.candidateAddress,
        candidateId: winnerCandidate.candidateId,
        header: winnerCandidate.header,
        slogan: winnerCandidate.slogan,
        electionTitleIndex: winnerCandidate.electionTitleIndex,
        isVerified: winnerCandidate.isVerified,
        isRegistered: winnerCandidate.isRegistered,
        voteCount: winnerCandidate.voteCount,
      });

      this.setState({ winnerCandidates: this.state.winnerCandidates });

      // Admin account and verification
      const admin = await this.state.ElectionInstance.methods.getAdmin().call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }

      const electionInitStatus = await this.state.ElectionInstance.methods
        .getElectionInitStatus()
        .call();
      this.setState({ electionInitStatus: electionInitStatus });
      console.log("Is Election init", electionInitStatus);

      // Get start and end values
      const isElectionEnded = await this.state.ElectionInstance.methods
        .getElectionEndedStatus(currentTimeStamp)
        .call();
      this.setState({ isElectionEnded: isElectionEnded });
      console.log("Is election ended:", this.state.isElectionEnded);

      const electionStarted = await this.state.ElectionInstance.methods
        .getElectionStatus(currentTimeStamp)
        .call();
      this.setState({ electionStarted: electionStarted });
      console.log("Election started", this.state.electionStarted);

      const electionTitles = await this.state.ElectionInstance.methods
        .getElectionTitles()
        .call();
      this.setState({ electionTitles: electionTitles });
      console.log(this.state.electionTitles);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  renderElectionCategories = (electionTitles, index) => {
    const candidates = this.state.candidates
      .filter((candidate) => candidate.electionTitleIndex == index)
      .sort((a, b) => a.candidateId - b.candidateId);

    return (
      <>
        <div className="container-item-election-category">
          <div className="candidate-info-header-title">
            <h2 style={{ padding: 32 }}>{electionTitles}</h2>
          </div>
          {candidates.length >= 1 ? (
            displayResults(candidates)
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
    return (
      <div className="container-item">
        <div className="candidate-data">
          <h2>
            {`[${candidate.candidateId}] `}
            {candidate.header}
          </h2>{" "}
          <small>{candidate.slogan}</small>
        </div>
        <div className="vote-btn-container">
          <small>{candidate.voteCount}</small>
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
        <br />
        <div>
          {!this.state.electionInitStatus ? (
            <NotInit />
          ) : this.state.electionStarted ? (
            <div className="container-item attention">
              <center>
                <h3>The election is being conducted at the movement.</h3>
                <p>Result will be displayed once the election has ended.</p>
                <p>Go ahead and cast your vote {"(if not already)"}.</p>
                <br />
                <Link
                  to="/Voting"
                  style={{ color: "black", textDecoration: "underline" }}
                >
                  <button className="btn-election">Vote Candidate</button>
                </Link>
              </center>
            </div>
          ) : this.state.isElectionEnded ? (
            <>
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
                    {this.state.electionTitles.map((electionTitle, index) =>
                      this.renderElectionCategories(electionTitle, index)
                    )}
                  </>
                )}
              </div>
            </>
          ) : 
          null}
        </div>
      </>
    );
  }
}
function displayWinner(candidates) {
  const getWinner = (candidates) => {
    // Returns an object having maxium vote count
    let maxVoteRecived = 0;
    let winnerCandidate = [];
    for (let i = 0; i < candidates.length; i++) {
      if (candidates[i].voteCount > maxVoteRecived) {
        maxVoteRecived = candidates[i].voteCount;
        winnerCandidate = [candidates[i]];
      } else if (candidates[i].voteCount === maxVoteRecived) {
        winnerCandidate.push(candidates[i]);
      }
    }
    return winnerCandidate;
  };
  const renderWinner = (winner) => {
    return (
      <div className="container-winner-test">

        <div className="candidate-data">
        <h2>Winner</h2>
          <h2>
            {`[${winner.candidateId}] `}
            {winner.header}
          </h2>{" "}
          <small>{winner.slogan}</small><br/><br/>
          <small>Total Vote : </small>{" "}<br/>
          <p style={{ fontSize:45,fontWeight:"bold",textAlign:"center"}}>{winner.voteCount}</p>
        </div>
       
      </div>
    );
  };
  const winnerCandidate = getWinner(candidates);
  return <>{winnerCandidate.map(renderWinner)}</>;
}

export function displayResults(candidates) {
  const renderResults = (candidate) => {
    return (
      <tr style={{ backgroundColor: "transparent" }}>
        <td>{candidate.candidateId}</td>
        <td>{candidate.header}</td>
        <td>{candidate.voteCount}</td>
      </tr>
    );
  };
  return (
    <>
      {candidates.length > 0 ? (
        <div className="container-main">{displayWinner(candidates)}</div>
      ) : null}
      <div className="container-main" style={{ borderTop: "1px solid" }}>
        <h2>Results</h2>
        <small>Total candidates: {candidates.length}</small>
        {candidates.length < 1 ? (
          <div className="container-item attention">
            <center>No candidates.</center>
          </div>
        ) : (
          <>
            <div className="container-item">
              <table>
                <tr>
                  <th>Id</th>
                  <th>Candidate</th>
                  <th>Votes</th>
                </tr>
                {candidates.map(renderResults)}
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}
