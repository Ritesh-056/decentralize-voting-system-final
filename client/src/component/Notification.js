import React, { Component } from "react";

import Navbar from "../../src/component/Navbar/Navigation";
import NavbarAdmin from "../../src/component/Navbar/NavigationAdmin";

import AdminOnly from "../../src/component/AdminOnly";

import getWeb3 from "../../src/getWeb3";
import Election from "../../src/artifacts/contracts/Election.sol/Election.json";

import "../../src/component/Admin/Verification/Verification.css";

export default class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ElectionInstance: undefined,
      account: null,
      web3: null,
      isAdmin: false,
      Count: undefined,
      rejectedVoter: {
        address: undefined,
        name: undefined,
        phone: null,
        message: undefined,
      },
      rejectedCandidate: {
        candidateId: null,
        candidateAddress: undefined,
        header: undefined,
        slogan: undefined,
        rejectionMessage: undefined,
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
      this.setState({ web3, ElectionInstance: instance, account: accounts[0] });

      // Admin account and verification
      const admin = await this.state.ElectionInstance.methods.getAdmin().call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }

      const rejectedVoterDetails = await this.state.ElectionInstance.methods
        .rejectedVoterDetails(this.state.account)
        .call();

      this.setState({
        rejectedVoter: {
          address: rejectedVoterDetails.voterAddress,
          name: rejectedVoterDetails.name,
          phone: rejectedVoterDetails.phone,
          message: rejectedVoterDetails.message,
        },
      });

      // this.setState({
      //   rejectedVoter: {
      //     address: "089hxbsacdbxhjksnskujsi093423d",
      //     name: "Ritesh Baral",
      //     phone: "9806045065",
      //     message: "You are rejected successfuly",
      //   },
      // });
      console.log("Rejected rejectedVoter details:", this.state.rejectedVoter);

      const rejectedCandidateDetails = await this.state.ElectionInstance.methods
        .rejectedCandidateDetails(this.state.account)
        .call();

      this.setState({
        rejectedCandidate: {
          candidateId: rejectedCandidateDetails.candidateId,
          candidateAddress: rejectedCandidateDetails.candidateAddress,
          header: rejectedCandidateDetails.header,
          slogan: rejectedCandidateDetails.slogan,
          rejectionMessage: rejectedCandidateDetails.message,
        },
      });
      console.log("Rejected Candidate details:", this.state.rejectedCandidate);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
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
    const { address, name, phone, message } = this.state.rejectedVoter;
    const { candidateId, candidateAddress, header, slogan, rejectionMessage } =
      this.state.rejectedCandidate;

    return (
      <>
        <NavbarAdmin />
        <div className="container-main">
          <h2>Notifications</h2>

          <>
            <h2 className="notification-category">For Voter</h2>

            <div className="container-item info">
              {name || phone || message ? (
                <div
                  className="container-list attention"
                  style={{ color: "white" }}
                >
                  <table>
                    <tr>
                      <th>Rejection message</th>
                      <td>{message}</td>
                    </tr>

                    <tr style={{ background: "transparent" }}>
                      <th>Account address</th>
                      <td>{address}</td>
                    </tr>
                    <tr>
                      <th>Name</th>
                      <td>{name}</td>
                    </tr>
                    <tr style={{ background: "transparent" }}>
                      <th>Phone</th>
                      <td>{phone}</td>
                    </tr>
                  </table>
                </div>
              ) : (
                <>
                  <p color="white">No any message yet.</p>
                </>
              )}
            </div>

            <h2 className="notification-category">For Candidate</h2>
            <div className="container-item info">
              { header || slogan || rejectionMessage ? (
                <div
                  className="container-list attention"
                  style={{  color: "white" }}
                >
                  <table>
                    <tr>
                      <th>Rejection message</th>
                      <td>{rejectionMessage}</td>
                    </tr>

                    <tr style={{ background: "transparent" }}>
                      <th>Candidate Id</th>
                      <td>{candidateId}</td>
                    </tr>

                    <tr>
                      <th>Account address</th>
                      <td>{candidateAddress}</td>
                    </tr>

                    <tr style={{ background: "transparent" }}>
                      <th>Name</th>
                      <td>{header}</td>
                    </tr>

                    <tr >
                      <th>Slogan</th>
                      <td>{slogan}</td>
                    </tr>
                  </table>
                </div>
              ) : (
                <>
                  <p color="white">No any message yet.</p>
                </>
              )}
            </div>
          </>
        </div>
      </>
    );
  }
}
