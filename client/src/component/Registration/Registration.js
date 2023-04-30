// Node modules
import React, { Component } from "react";

// Components
import Navbar from "../Navbar/Navigation";
import NavbarAdmin from "../Navbar/NavigationAdmin";
// CSS
import "./Registration.css";

// Contract
import getWeb3 from "../../getWeb3";
import Election from "../../artifacts/contracts/Election.sol/Election.json";
import { VoterRegistrationEnded } from "../RegistrationStatus";

//get getlocaldataTime func
import { getLocalDateTime } from "../../DateTimeLocal";
import ElectionStatus from "../ElectionStatus";
import { signVoterWithAddressAndMessage } from "../../ecrecover/RegisterSigner";

export default class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ElectionInstance: undefined,
      web3: null,
      account: null,
      isAdmin: false,
      isElStarted: false,
      isElEnded: false,
      electionStarted: false,
      electionInitStatus: false,
      voterCount: undefined,
      voterName: "",
      voterPhone: "",
      voters: [],
      registrationStartDateTimeLocal: "",
      registrationEndDateTimeLocal: "",
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

  // refreshing once
  componentDidMount = async () => {
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

      // Admin account and verification
      const admin = await this.state.ElectionInstance.methods.getAdmin().call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }

      // Get start and end values
      const currentTimeStamp = Math.floor(Date.now() / 1000);
      console.log("Current send time is", getLocalDateTime(currentTimeStamp));

      // Total number of voters
      const voterCount = await this.state.ElectionInstance.methods
        .getVerifiedVoters()
        .call();
      this.setState({ voterCount: voterCount });

      // Loading all the voters
      for (let i = 0; i < this.state.voterCount; i++) {
        const voterAddress = await this.state.ElectionInstance.methods
          .voters(i)
          .call();
        const voter = await this.state.ElectionInstance.methods
          .voterDetails(voterAddress)
          .call();
        this.state.voters.push({
          address: voter.voterAddress,
          name: voter.name,
          phone: voter.phone,
          hasVoted: voter.hasVoted,
          isVerified: voter.isVerified,
          isRegistered: voter.isRegistered,
        });
      }
      this.setState({ voters: this.state.voters });

      // Loading current voters
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
        `Failed to load web3, accounts, or contract. Check console for details (f12).`
      );
    }
  };
  updateVoterName = (event) => {
    this.setState({ voterName: event.target.value });
  };
  updateVoterPhone = (event) => {
    this.setState({ voterPhone: event.target.value });
  };
  registerAsVoter = async () => {
    const voterPhone = this.state.voterPhone;
    const voterName = this.state.voterName;

    if (!voterPhone && !voterName) {
      return alert("Oops! voter details is empty.");
    }
    if (!voterName) {
      return alert("Oops! Insert name to continue.");
    }

    if (!voterPhone) {
      return alert("Oops! Contact number is empty.");
    } else {
      if (voterPhone.length !== 10) {
        return alert("Oops! Contact number is not valid");
      }
    }

    const isSignatureSigned = await signVoterWithAddressAndMessage(
      this.state.web3,
      this.state.account
    );
    if (isSignatureSigned == true) {
      await this.state.ElectionInstance.methods
        .registerAsVoter(this.state.voterName, this.state.voterPhone)
        .send({ from: this.state.account, gas: 1000000 });
      alert("Voter registered successful");
      window.location.reload();
    } else {
      return alert("Oops message signed error");
    }
  };

  render() {
    const voterPhone = this.state.voterPhone;

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
        {this.state.electionStarted ? (
          <VoterRegistrationEnded />
        ) : (
          <>
            <div className="container-main">
              <h2>Registration</h2>
              <small>Register to vote.</small>
              <div className="container-item-register">
                <form>
                  <div className="div-li">
                    <label className={"label-r"}>
                      Account Address
                      <input
                        className={"input-r"}
                        type="text"
                        value={this.state.account}
                        style={{ width: "400px" }}
                      />{" "}
                    </label>
                  </div>
                  <div className="div-li">
                    <label className={"label-r"}>
                      Name
                      <input
                        className={"input-r"}
                        type="text"
                        placeholder="Name"
                        value={this.state.voterName}
                        onChange={this.updateVoterName}
                      />{" "}
                    </label>
                  </div>
                  <div className="div-li">
                    <label className={"label-r"}>
                      Phone number <span style={{ color: "tomato" }}>*</span>
                      <small> {voterPhone.length}</small>
                      <input
                        className={"input-r"}
                        type="number"
                        placeholder="Phone No"
                        value={this.state.voterPhone}
                        onChange={this.updateVoterPhone}
                      />
                    </label>
                  </div>
                  <p className="note">
                    <span style={{ color: "red", paddingTop: "10px" }}>
                      {" "}
                      Note:{" "}
                    </span>
                    <br /> * Please verify before submitting.
                    <br />* Address and phone number should be valid otherwise
                    admin will not verify you as a voter.
                  </p>

                  {this.state.currentVoter.isRegistered ? (
                    <center>
                      <button className="btn-add">Registered</button>
                    </center>
                  ) : (
                    <center>
                      <button
                        className="btn-add"
                        onClick={this.registerAsVoter}
                      >
                        Register
                      </button>
                    </center>
                  )}
                </form>
              </div>
            </div>
            <div
              className="container-main"
              style={{
                borderTop: this.state.currentVoter.isRegistered
                  ? null
                  : "1px solid",
              }}
            >
              {this.state.currentVoter.isVerified ? (
                <>
                  {" "}
                  {loadCurrentVoter(
                    this.state.currentVoter,
                    this.state.currentVoter.isRegistered
                  )}
                </>
              ) : null}
            </div>
            {this.state.isAdmin ? (
              <div className="container-main">
                <h2>Total Voters: {this.state.voters.length}</h2>
                {loadAllVoters(this.state.voters)}
              </div>
            ) : null}
          </>
        )}
      </>
    );
  }
}
export function loadCurrentVoter(voter, isRegistered) {
  return (
    <>
      <div
        className={"container-item " + (isRegistered ? "success" : "attention")}
      >
        <center>Your Registered Information </center>
      </div>
      <div
        style={{ color: "white" }}
        className={"container-list " + (isRegistered ? "success" : "attention")}
      >
        <table>
          <tr>
            <th>Account Address</th>
            <td>{voter.address}</td>
          </tr>
          <tr style={{ backgroundColor: "transparent" }}>
            <th>Name</th>
            <td>{voter.name}</td>
          </tr>
          <tr>
            <th>Phone</th>
            <td>{voter.phone}</td>
          </tr>
          <tr style={{ backgroundColor: "transparent" }}>
            <th>Voted</th>
            <td>{voter.hasVoted ? "True" : "False"}</td>
          </tr>
          <tr>
            <th>Verification</th>
            <td>{voter.isVerified ? "True" : "False"}</td>
          </tr>
          <tr style={{ backgroundColor: "transparent" }}>
            <th>Registered</th>
            <td>{voter.isRegistered ? "True" : "False"}</td>
          </tr>
        </table>
      </div>
    </>
  );
}
export function loadAllVoters(voters) {
  const renderAllVoters = (voter) => {
    return (
      <>
        <div className="container-list success" style={{ color: "white" }}>
          <table>
            <tr>
              <th>Account address</th>
              <td>{voter.address}</td>
            </tr>
            <tr style={{ backgroundColor: "transparent" }}>
              <th>Name</th>
              <td>{voter.name}</td>
            </tr>
            <tr>
              <th>Phone</th>
              <td>{voter.phone}</td>
            </tr>
            <tr style={{ backgroundColor: "transparent" }}>
              <th>Voted</th>
              <td>{voter.hasVoted ? "True" : "False"}</td>
            </tr>
            <tr>
              <th>Verified</th>
              <td>{voter.isVerified ? "True" : "False"}</td>
            </tr>
            <tr style={{ backgroundColor: "transparent" }}>
              <th>Registered</th>
              <td>{voter.isRegistered ? "True" : "False"}</td>
            </tr>
          </table>
        </div>
      </>
    );
  };
  return (
    <>
      <div className="container-item success">
        <center>List of voters</center>
      </div>
      {voters.map(renderAllVoters)}
    </>
  );
}
