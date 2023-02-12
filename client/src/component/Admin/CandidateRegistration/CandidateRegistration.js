import React, { Component } from "react";

import Navbar from "../../Navbar/Navigation";
import NavbarAdmin from "../../Navbar/NavigationAdmin";

import getWeb3 from "../../../getWeb3";
import Election from "../../../artifacts/contracts/Election.sol/Election.json";
import NotInit from "../../NotInit";
import "./CandidateRegistration.css";

export default class CandidateRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ElectionInstance: undefined,
      web3: null,
      account: null,
      isAdmin: false,
      isElStarted: false,
      isElEnded: false,
      header: "",
      slogan: "",
      candidates: [],
      candidateCount: undefined,
      currentCandidate:{
        candidateAddress:undefined,
        candidateId: null,
        header: null,
        slogan: null,
        voteCount:null,
        isVerified: false,
        isRegistered: false,
      }
    };
  }

  componentDidMount = async () => {
    // refreshing page only once
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

      const admin = await this.state.ElectionInstance.methods.getAdmin().call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }

      // Get start and end values
      const start = await this.state.ElectionInstance.methods.getStart().call();
      this.setState({ isElStarted: start });
      const end = await this.state.ElectionInstance.methods.getEnd().call();
      this.setState({ isElEnded: end });

      // Total number of candidates
      const candidateCount = await this.state.ElectionInstance.methods
        .getTotalCandidate()
        .call();
      this.setState({ candidateCount: candidateCount });

      // Loading Candidates details
      for (let i = 0; i < this.state.candidateCount; i++) {
        const candidateAddress = await this.state.ElectionInstance.methods
          .candidates(i)
          .call();
        
          const candidate = await this.state.ElectionInstance.methods
          .candidateDetails(candidateAddress)
          .call();

        this.state.candidates.push({
          candidateAddress:candidate.candidateAddress,
          candidateId: candidate.candidateId,
          header: candidate.header,
          slogan: candidate.slogan,
          voteCount:candidate.voteCount,
          isVerified: candidate.isVerified,
          isRegistered: candidate.isRegistered,
        });
      }

      this.setState({ candidates: this.state.candidates });

      // Loading current candidate
      const candidate = await this.state.ElectionInstance.methods
        .candidateDetails(this.state.account)
        .call();
      this.setState({
        currentCandidate: {
          candidateAddress:candidate.candidateAddress,
          candidateId: candidate.candidateId,
          header: candidate.header,
          slogan: candidate.slogan,
          voteCount:candidate.voteCount,
          isVerified: candidate.isVerified,
          isRegistered: candidate.isRegistered,
        },
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      console.error(error);
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
    }
  };
  updateHeader = (event) => {
    this.setState({ header: event.target.value });
  };
  updateSlogan = (event) => {
    this.setState({ slogan: event.target.value });
  };
  
  registerAsCandidate = async () => {
    await this.state.ElectionInstance.methods
      .registerAsCandidate(this.state.header, this.state.slogan)
      .send({ from: this.state.account, gas: 1000000 });
    window.location.reload();
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
        {!this.state.isElStarted && !this.state.isElEnded ? (
          <NotInit />
        ) : (
        <>  
        <div className="container-main">
          <h2>Add candidate</h2>
          <small>Total candidates: {this.state.candidateCount}</small>
          <div className="container-item">
            <form className="form">
              <label className={"label-ac"}>
                Candidate Header
                <input
                  className={"input-ac"}
                  type="text"
                  placeholder="Candidate "
                  value={this.state.header}
                  onChange={this.updateHeader}
                />
              </label>
              <label className={"label-ac"}>
                Candidate Symbol
                <input
                  className={"input-ac"}
                  type="text"
                  placeholder="Candidate Symbol"
                  value={this.state.slogan}
                  onChange={this.updateSlogan}
                />
              </label>
              <center>
                <button
                  className="btn-add"
                  disabled={
                    this.state.header.length < 3 ||
                    this.state.header.length > 21
                  }
                  onClick={this.registerAsCandidate}
                >
                  Add
                </button>
              </center>
            </form>
          </div>
        </div>
         {this.state.isAdmin ? (
          <div
            className="container-main"
            style={{ borderTop: "1px solid" }}
          >
            <small>TotalCandidates: {this.state.candidates.length}</small>
            {loadAdded(this.state.candidates)}
          </div>
        ) : null}
        </>
      )}
      </>
    );
  }
}


export function loadAdded(candidates) {
  const renderAdded = (candidate) => {
    return (
      <>
        <div className="container-list success">
          <div
            style={{
              maxHeight: "21px",
              overflow: "auto",
            }}
          >
            {candidate.candidateAddress}. <strong>{candidate.header}</strong>:{" "}
            {candidate.slogan}
          </div>
        </div>
      </>
    );
  };
  return (
    <div className="container-main" style={{ borderTop: "1px solid" }}>
      <div className="container-item info">
        <center>Candidates </center>
      </div>
      {candidates.length < 1 ? (
        <div className="container-item alert">
          <center>No candidates </center>
        </div>
      ) : (
        <div
          className="container-item"
          style={{
            display: "block",
            backgroundColor: "#DDFFFF",
          }}
        >
          {candidates.map(renderAdded)}
        </div>
      )}
    </div>
  );
}

export function loadAllCandidates(candidates) {
  const renderAllCandidates = (candidate) => {
    return (
      <>
        <div className="container-list success">
          <table>
            <tr>
              <th>Candidate Address</th>
              <td>{candidate.candidateAddress}</td>
            </tr>
            <tr>
              <th>Candidate Header</th>
              <td>{candidate.header}</td>
            </tr>
            <tr>
              <th>Candidate Slogan</th>
              <td>{candidate.slogan}</td>
            </tr>
            <tr>
              <th>Verified</th>
              <td>{candidate.isVerified ? "True" : "False"}</td>
            </tr>
            <tr>
              <th>Registered</th>
              <td>{candidate.isRegistered ? "True" : "False"}</td>
            </tr>
          </table>
        </div>
      </>
    );
  };
  return (
    <>
      <div className="container-item success">
        <center>List of Candidates</center>
      </div>
      {candidates.map(renderAllCandidates)}
    </>
  );
}
