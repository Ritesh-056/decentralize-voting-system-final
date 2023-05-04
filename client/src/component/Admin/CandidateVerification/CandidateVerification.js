import React, { Component } from "react";

import Navbar from "../../Navbar/Navigation";
import NavbarAdmin from "../../Navbar/NavigationAdmin";

import AdminOnly from "../../AdminOnly";

import getWeb3 from "../../../getWeb3";
import Election from "../../../artifacts/contracts/Election.sol/Election.json";

import "./CandidateVerification.css";

export default class CandidateVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ElectionInstance: undefined,
      account: null,
      web3: null,
      isAdmin: false,
      candidateCount: undefined,
      electionTitles: [],
      candidates: [],
      rejectedCandidateList: [],
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
      this.setState({ web3, ElectionInstance: instance, account: accounts[0] });

      // Admin account and verification
      const admin = await this.state.ElectionInstance.methods.getAdmin().call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }

      //rejection candidate length and add candidate to the rejctedCandidateList address.
      const rejectedCandidateCount = await this.state.ElectionInstance.methods
        .getRejectedCandidates()
        .call();
      for (let i = 0; i < rejectedCandidateCount; i++) {
        const rejectedCandidateAddress =
          await this.state.ElectionInstance.methods
            .rejectedCandidates(i)
            .call();
        this.state.rejectedCandidateList.push(rejectedCandidateAddress);
      }

      console.log("Rejected  candidate count", rejectedCandidateCount);
      console.log("Rejected candidate list", this.state.rejectedCandidateList);

      // Total number of univerified candidates
      const candidateCount = await this.state.ElectionInstance.methods
        .getUnVerifiedCandidates()
        .call();
      this.setState({ candidateCount: candidateCount });
      // Loading all the candidates
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
          voteCount: candidate.voteCount,
          header: candidate.header,
          slogan: candidate.slogan,
          electionTitleIndex: candidate.electionTitleIndex,
          isVerified: candidate.isVerified,
          isRegistered: candidate.isRegistered,
        });
      }
      this.setState({ candidates: this.state.candidates });

      const electionTitles = await this.state.ElectionInstance.methods
        .getElectionTitles()
        .call();

      this.setState({ electionTitles: electionTitles });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  candidateRejectionChecker = (candidateAddress) => {
    const checkCandidateExist =
      this.state.rejectedCandidateList.includes(candidateAddress);
    console.log("Check canidate rejection:", checkCandidateExist);
    return checkCandidateExist;
  };

  renderUnverifiedCandidates = (candidate) => {
    const verifyCandidate = async (verifiedStatus, address) => {
      await this.state.ElectionInstance.methods
        .verifyCandidate(verifiedStatus, address)
        .send({ from: this.state.account, gas: 1000000 });
      window.location.reload();
    };

    const rejectCandidate = async (address) => {
      //prompt the admin to write rejection message
      const message = prompt("Write a reason for rejection.", "");

      // Validate the message
      if (!message || message == "") {
        return alert("No reason submitted for rejection.");
      }

      await this.state.ElectionInstance.methods
        .rejectCandidate(address, message)
        .send({ from: this.state.account, gas: 1000000 });
      alert("Candidate rejection successful");
      window.location.reload();
    };

    const electionTitleOfCandidate = this.state.electionTitles.filter(
      (title, key) => key == candidate.electionTitleIndex
    );
    return (
      <>
        {candidate.isVerified ? (
          <div className="container-list success" style={{ color: "white" }}>
            <p style={{ margin: "7px 0px" }}>
              AC: {candidate.candidateAddress}
            </p>
            <table>
              <tr>
                <th>Header</th>
                <th>Slogan</th>
                <th>Election Title</th>
              </tr>
              <tr style={{ backgroundColor: "transparent" }}>
                <td className="tbl">{candidate.header}</td>
                <td className="tbl">{candidate.slogan}</td>
                <td className="tbl">{electionTitleOfCandidate}</td>
              </tr>
            </table>
          </div>
        ) : null}
        <div
          className="container-list attention"
          style={{ display: candidate.isVerified ? "none" : null }}
        >
          <table>
            <tr>
              <th>Account address</th>
              <td>{candidate.candidateAddress}</td>
            </tr>
            <tr style={{ backgroundColor: "transparent" }}>
              <th>Header</th>
              <td>{candidate.header}</td>
            </tr>
            <tr>
              <th>Slogan</th>
              <td>{candidate.slogan}</td>
            </tr>
            <tr style={{ backgroundColor: "transparent" }}>
              <th>Verified</th>
              <td>{candidate.isVerified ? "True" : "False"}</td>
            </tr>
            <tr>
              <th>Registered</th>
              <td>{candidate.isRegistered ? "True" : "False"}</td>
            </tr>

            <tr style={{ backgroundColor: "transparent" }}>
              <th>Election Title</th>
              <td>{electionTitleOfCandidate}</td>
            </tr>
          </table>

          {!this.candidateRejectionChecker(candidate.candidateAddress) ? (
            <>
              <div style={{}}>
                <center>
                  <button
                    className="btn-verification-approve"
                    disabled={candidate.isVerified}
                    onClick={() =>
                      verifyCandidate(true, candidate.candidateAddress)
                    }
                  >
                    Approve
                  </button>

                  <button
                    className="btn-verification-approve"
                    onClick={() => rejectCandidate(candidate.candidateAddress)}
                  >
                    Reject
                  </button>
                </center>
              </div>
            </>
          ) : (
            <div
              className="container-list attention"
              style={{
                display: candidate.isVerified ? "none" : null,
                color: "white",
              }}
            >
              <center>
                {" "}
                <button className="btn-verification-approve">Rejected</button>
              </center>
            </div>
          )}
        </div>
      </>
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
    if (!this.state.isAdmin) {
      return (
        <>
          <Navbar />
          <AdminOnly page="Verification Page." />
        </>
      );
    }
    return (
      <>
        <NavbarAdmin />
        <div className="container-main">
          <h2>Verification</h2>
          <small>Total Candidates: {this.state.candidates.length}</small>
          {this.state.candidates.length < 1 ? (
            <div className="container-item info">No any account registered</div>
          ) : (
            <>
              <div className="container-item info">
                <center>Registered candidates</center>
              </div>
              {this.state.candidates.map(this.renderUnverifiedCandidates)}
            </>
          )}
        </div>
      </>
    );
  }
}
