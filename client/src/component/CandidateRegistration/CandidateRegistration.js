import React, { Component } from "react";

import Navbar from "../Navbar/Navigation";
import NavbarAdmin from "../Navbar/NavigationAdmin";

import getWeb3 from "../../getWeb3";
import Election from "../../artifacts/contracts/Election.sol/Election.json";
import "./CandidateRegistration.css";
import NotVoter from "../NotVoter";
import { getLocalDateTime } from "../../DateTimeLocal";
import NotInit from "../NotInit";
import { recoverSignerAccount } from "../../ecrecover/RecoverOrValidateSigner";

import {
  RegistrationInit,
  RegistrationEnded,
  RegistrationDenied,
} from "../../component/RegistrationStatus";

import {
  saveElectionTitleAndSloganIndexToLocal,
  getElecitonTitleAndSloganIndexFromLocal,
} from "../LocalStoreAndRetrive";

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
      electionInitStatus: false,
      selectedElectionIndex: 0,
      selectedElection: "",
      electionTitles: [],
      electionSlogans: [],
      selectedSloganIndex: 0,
      selectedSlogan: "",
      registrationOnGoing: false,
      candidates: [],
      isRegistrationEnded: false,
      voterStatusForCandidate: false,
      alreadyRegisteredCandidate: false,
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

    this.handleSelectSloganChange = this.handleSelectSloganChange.bind(this);

    this.handleSelectElectionTitleChange =
      this.handleSelectElectionTitleChange.bind(this);
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
      console.log("Current send time is", getLocalDateTime(currentTimeStamp));

      const accountAddress = this.state.account;
      const voterStatusForCandidate = await this.state.ElectionInstance.methods
        .getVoterStatusForCandidate(accountAddress)
        .call();
      this.setState({ voterStatusForCandidate: voterStatusForCandidate });

      // Total number of verified candidate
      const candidateCount = await this.state.ElectionInstance.methods
        .getVerifiedCandidates()
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

      //get election Slogans
      const electionSlogans = await this.state.ElectionInstance.methods
        .getElectionSlogans()
        .call();

      this.setState({ electionSlogans: electionSlogans });
      this.setState({ selectedSlogan: electionSlogans[0] });
      this.setState({ selectedSloganIndex: 0 });

      console.log("Election slogans", electionSlogans);

      //get registration start and end time
      const registrationStartTimeUnixStamp =
        await this.state.ElectionInstance.methods
          .getRegistrationStartTime()
          .call();
      const registrationEndTimeUnixTimeStamp =
        await this.state.ElectionInstance.methods
          .getRegistrationEndTime()
          .call();

      const currentDate = new Date();
      const unixdateTime = this.convertDateTimeToUnix(currentDate);
      this.setState({
        ...this.state,
        isRegistrationEnded:
          unixdateTime >= registrationEndTimeUnixTimeStamp ? true : false,
      });

      console.log(
        "Is registration time closed",
        this.state.isRegistrationEnded
      );

      const registrationOnGoing = await this.state.ElectionInstance.methods
        .getRegistrationStatus(unixdateTime)
        .call();
      this.setState({ registrationOnGoing: registrationOnGoing });
      console.log(
        "Is registration time ongoing",
        this.state.registrationOnGoing
      );

      ///registration start and end times
      const registrationStartDateTimeLocal = getLocalDateTime(
        registrationStartTimeUnixStamp
      );
      const registrationEndDateTimeLocal = getLocalDateTime(
        registrationEndTimeUnixTimeStamp
      );
      this.setState({
        registrationStartDateTimeLocal: registrationStartDateTimeLocal,
        registrationEndDateTimeLocal: registrationEndDateTimeLocal,
      });
      console.log(
        "Registration start time , Registration end time",
        registrationStartDateTimeLocal,
        registrationEndDateTimeLocal
      );

      ///is already a candidate
      const alreadyRegisteredCandidate =
        await this.state.ElectionInstance.methods
          .getAlreadyRegisteredCandidateStatus(this.state.account)
          .call();
      this.setState({ alreadyRegisteredCandidate: alreadyRegisteredCandidate });
      console.log(
        "Is already a register as candidate",
        this.state.alreadyRegisteredCandidate
      );

      const electionInitStatus = await this.state.ElectionInstance.methods
        .getElectionInitStatus()
        .call();
      this.setState({ electionInitStatus: electionInitStatus });

      console.log("Registration started status", this.state.electionInitStatus);

      // Get start and end values
      const isElectionEnded = await this.state.ElectionInstance.methods
        .getElectionEndedStatus(currentTimeStamp)
        .call();
      this.setState({ isElectionEnded: isElectionEnded });

      const electionStarted = await this.state.ElectionInstance.methods
        .getElectionStatus(currentTimeStamp)
        .call();
      this.setState({ electionStarted: electionStarted });
      console.log("Election started", this.state.electionStarted);
    } catch (error) {
      // Catch any errors for any of the above operations.
      console.error(error);
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
    }
  };

  handleSelectElectionTitleChange(event) {
    this.setState({ selectedElection: event.target.value });
    this.setState({ selectedElectionIndex: event.target.selectedIndex });
  }

  handleSelectSloganChange(event) {
    this.setState({ selectedSlogan: event.target.value });
    this.setState({ selectedSloganIndex: event.target.selectedIndex });
  }

  updateHeader = (event) => {
    this.setState({ header: event.target.value });
  };

  registerAsCandidate = async () => {
    const isSignatureRecovered = await recoverSignerAccount(
      this.state.web3,
      this.state.account
    );

    if (isSignatureRecovered == true) {
      await this.state.ElectionInstance.methods
        .registerAsCandidate(
          this.state.header,
          this.state.selectedSlogan,
          this.state.selectedElectionIndex
        )
        .send({ from: this.state.account, gas: 1000000 });
      alert("Candidate registration successful");
      window.location.reload();
    } else {
      return alert("Invalid message recovering");
    }
  };

  convertDateTimeToUnix = (dateTime) => {
    const dateObj = new Date(dateTime);
    const unixTimestamp = Math.floor(dateObj.getTime() / 1000);
    return unixTimestamp;
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
        {this.state.electionInitStatus ? (
          this.state.registrationOnGoing ? (
            this.state.alreadyRegisteredCandidate ? (
              <>
                <RegistrationDenied />
              </>
            ) : (
              <>
                <div className="container-main">
                  <div className="container-item">
                    <div className="candidate-info-header">
                      <h2>Registration End Date</h2>
                      <center>
                        <small id="timer">
                          {this.state.registrationEndDateTimeLocal}
                        </small>
                      </center>
                    </div>
                  </div>
                  <h2>Register candidate</h2>
                  <small>Total candidates: {this.state.candidateCount}</small>
                  <div className="container-item-register">
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
                        Select an election slogan
                        <select
                          className={"select-election-ac"}
                          value={this.state.selectedSlogan}
                          onChange={this.handleSelectSloganChange}
                        >
                          {this.state.electionSlogans.map((title, index) => (
                            <option key={index} value={title}>
                              {title}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className={"label-ac"}>
                        Select an election title
                        <select
                          className={"select-election-ac"}
                          // value={this.state.selectedElection}
                          value={this.state.selectedElection}
                          onChange={this.handleSelectElectionTitleChange}
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
                                e.preventDefault();
                                if (
                                  this.state.header == "" ||
                                  this.state.selectedElectionIndex < 0 ||
                                  this.state.selectedSloganIndex < 0
                                ) {
                                  alert(
                                    "Please check your candidates details."
                                  );
                                } else {
                                  const selectedTitleIndex =
                                    this.state.selectedElectionIndex;
                                  const selectedSloganIndex =
                                    this.state.selectedSloganIndex;

                                  const indices =
                                    getElecitonTitleAndSloganIndexFromLocal(
                                      selectedTitleIndex
                                    );
                                  const isSloganAlreadyTaken =
                                    indices.includes(selectedSloganIndex);
                                  if (isSloganAlreadyTaken) {
                                    return alert(
                                      "Oops, selected slogan is already taken!"
                                    );
                                  } else {
                                    //save to local
                                    saveElectionTitleAndSloganIndexToLocal(
                                      selectedTitleIndex,
                                      selectedSloganIndex
                                    );
                                    this.registerAsCandidate();
                                  }
                                }
                              }}
                            >
                              Register
                            </button>
                          </center>
                        </>
                      )}
                    </form>
                  </div>
                </div>

                {!this.state.voterStatusForCandidate ? <NotVoter /> : null}
              </>
            )
          ) : this.state.isRegistrationEnded ? (
            <>
              <RegistrationEnded />
            </>
          ) : (
            <>
              <RegistrationInit />
            </>
          )
        ) : (
          <>
            <NotInit />
          </>
        )}
      </>
    );
  }
}
function loadAllCandidates(candidates) {
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

function loadAdded(candidates) {
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
