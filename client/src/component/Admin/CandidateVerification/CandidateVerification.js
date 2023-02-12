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
      candidates: [],
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

      // Total number of candidates
      const candidateCount = await this.state.ElectionInstance.methods
        .getTotalCandidate()
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
          candidateId:candidate.candidateId,
          voteCount:candidate.voteCount,
          header: candidate.header,
          slogan: candidate.slogan,
          isVerified: candidate.isVerified,
          isRegistered: candidate.isRegistered,
        });
      }
      this.setState({ candidates: this.state.candidates });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };
  renderUnverifiedCandidates = (candidate) => {
    const verifyCandidate = async (verifiedStatus, address) => {
      await this.state.ElectionInstance.methods
        .verifyCandidate(verifiedStatus, address)
        .send({ from: this.state.account, gas: 1000000 });
      window.location.reload();
    };
    return (
      <>
        {candidate.isVerified ? (
          <div className="container-list success">
            <p style={{ margin: "7px 0px" }}>AC: {candidate.candidateAddress}</p>
            <table>
              <tr>
                <th>Header</th>
                <th>Slogan</th>
              </tr>
              <tr>
                <td>{candidate.header}</td>
                <td>{candidate.slogan}</td>
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
            <tr>
              <th>Header</th>
              <td>{candidate.header}</td>
            </tr>
            <tr>
              <th>Slogan</th>
              <td>{candidate.phone}</td>
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
          <div style={{}}>
            <center>
              <button
                // className="btn-verification approve"
                className="btn-election"
                disabled={candidate.isVerified}
                onClick={() => verifyCandidate(true, candidate.candidateAddress)}
              >
                Approve
              </button>
            </center>
          </div>
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
