import React, { Component } from "react";

import Navbar from "../Navbar/Navigation";
import NavbarAdmin from "../Navbar/NavigationAdmin";

import getWeb3 from "../../getWeb3";
import Election from "../../artifacts/contracts/Election.sol/Election.json";
import "./CandidateRegistration.css";
import RegistrationInit from "../RegistrationStatus";
import NotVoter from "../NotVoter";
import { getLocalDateTime } from "../../DateTimeLocal";

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
      selectedElectionIndex:0,
      selectedElection: "",
      electionTitles: [],
      registrationStatus: false,
      candidates: [],
      voterStatusForCandidate: false,
      candidateCount: undefined,
      currentCandidate: {
        candidateAddress: undefined,
        candidateId: null,
        header: null,
        slogan: null,
        voteCount: null,
        isVerified: false,
        isRegistered: false,
      },
    };

    this.handleSelectChange = this.handleSelectChange.bind(this);
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
      const currentTimeStamp = Math.floor(Date.now() / 1000);
      console.log("Window date time request time: ", getLocalDateTime(currentTimeStamp));

      // Get start and end values
      const registrationStatus = await this.state.ElectionInstance.methods
        .getRegistrationStatus(currentTimeStamp)
        .call();
      this.setState({ registrationStatus: registrationStatus });

      const accountAddress = this.state.account;
      console.log(accountAddress);
      const voterStatusForCandidate = await this.state.ElectionInstance.methods
        .getVoterStatusForCandidate(accountAddress)
        .call();
      this.setState({ voterStatusForCandidate: voterStatusForCandidate });

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
          candidateAddress: candidate.candidateAddress,
          candidateId: candidate.candidateId,
          header: candidate.header,
          slogan: candidate.slogan,
          voteCount: candidate.voteCount,
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
          candidateAddress: candidate.candidateAddress,
          candidateId: candidate.candidateId,
          header: candidate.header,
          slogan: candidate.slogan,
          voteCount: candidate.voteCount,
          isVerified: candidate.isVerified,
          isRegistered: candidate.isRegistered,
        },
      });

      //get election titles
      const electionTitles = await this.state.ElectionInstance.methods
        .getElectionTitles()
        .call();
      this.setState({ electionTitles: electionTitles });
      this.setState({ selectedElection: electionTitles[0] });
      this.setState({ selectedElectionIndex: 0 });




      //get registration start and end time
      const registrationStartTimeUnixStamp =
        await this.state.ElectionInstance.methods
          .getRegistrationStartTime()
          .call();
      const registrationEndTimeUnixTimeStamp =
        await this.state.ElectionInstance.methods
          .getRegistrationEndTime()
          .call();

      const registrationStartDateTimeLocal = getLocalDateTime(
        registrationStartTimeUnixStamp
      );
      const registrationEndDateTimeLocal = getLocalDateTime(
        registrationEndTimeUnixTimeStamp
      );

      console.log(registrationStartDateTimeLocal);
      console.log(registrationEndDateTimeLocal);

      this.setState({
        registrationStartDateTimeLocal: registrationStartDateTimeLocal,
        registrationEndDateTimeLocal: registrationEndDateTimeLocal,
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      console.error(error);
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
    }
  };

  handleSelectChange(event) {
    this.setState({ selectedElection: event.target.value });
    this.setState({selectedElectionIndex:event.target.selectedIndex})
    console.log(this.state.selectedElectionIndex);
  }

  updateHeader = (event) => {
    this.setState({ header: event.target.value });
  };
  updateSlogan = (event) => {
    this.setState({ slogan: event.target.value });
  };

  registerAsCandidate = async () => {
    await this.state.ElectionInstance.methods
      .registerAsCandidate(this.state.header, this.state.slogan,this.state.selectedElectionIndex)
      .send({ from: this.state.account, gas: 1000000 });
    alert("Candidate registration successful");
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
        {!this.state.registrationStatus ? (
          <RegistrationInit />
        ) : (
          <>
            <div className="container-main">
              <div className="container-item">
                <div className="candidate-info-header">
                  <h2>Registration End Date</h2>
                  <center>
                    <small>{this.state.registrationEndDateTimeLocal}</small>
                  </center>
                </div>
              </div>
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

                  <label className={"label-ac"}>
                    Select an election title
                    <select
                      className={"select-election-ac"}
                      // value={this.state.selectedElection}
                      value={this.state.selectedElection}
                      onChange={this.handleSelectChange}
                    >
                      {this.state.electionTitles.map((title, index) => (
                        <option key={index} value={title}>
                          {title}
                        </option>
                      ))}
                    </select>
                  </label>

                  {!this.state.voterStatusForCandidate ? (
                    <></>
                  ) : (
                    <>
                      <center>
                        <button
                          className="btn-add"
                          onClick={(e) => {
                            console.log("Button clicked from here");
                            e.preventDefault();
                            if (
                              this.state.header == "" ||
                              this.state.slogan == "" ||
                              this.state.selectedElectionIndex < 0
                            ) {
                              alert("Please check your candidates details.");
                            } else {
                              console.log(
                                this.state.header,
                                this.state.slogan,
                                this.state.selectedElectionIndex
                              );
                              this.registerAsCandidate();
                            }
                          }}
                        >
                          Add
                        </button>
                      </center>
                    </>
                  )}
                </form>
              </div>
            </div>

            {!this.state.voterStatusForCandidate ? <NotVoter /> : null}

            {this.state.isAdmin ? (
              <div
                className="container-main"
                style={{ borderTop: "1px solid" }}
              >
                <small>Total Candidates: {this.state.candidates.length}</small>
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
            }}
          >
            {"["}
            {candidate.candidateId}
            {"] "}
            <strong>{candidate.header}</strong>:{"  "}
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