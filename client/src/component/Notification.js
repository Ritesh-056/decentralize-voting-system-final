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
      console.log("Rejected rejectedVoter details:", this.state.rejectedVoter);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  renderRejectedInfoWithMessage = (rejectedVoter) => {
    return (
      <>
        <div
          className="container-list attention"
          style={{ display: "none", color: "white" }}
        >
          <table>
            <tr>
              <th>Account address</th>
              <td>{rejectedVoter.address}</td>
            </tr>
            <tr style={{ background: "transparent" }}>
              <th>Name</th>
              <td>{rejectedVoter.name}</td>
            </tr>
            <tr>
              <th>Phone</th>
              <td>{rejectedVoter.phone}</td>
            </tr>

            <tr style={{ background: "transparent" }}>
              <th>Voted</th>
              <td>{rejectedVoter.hasVoted ? "True" : "False"}</td>
            </tr>
            <tr>
              <th>Verified</th>
              <td>{rejectedVoter.isVerified ? "True" : "False"}</td>
            </tr>
            <tr style={{ background: "transparent" }}>
              <th>Registered</th>
              <td>{rejectedVoter.isRegistered ? "True" : "False"}</td>
            </tr>
          </table>
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
    // if (!this.state.isAdmin) {
    //   return (
    //     <>
    //       <Navbar />
    //       <AdminOnly page="Verification Page." />
    //     </>
    //   );
    // }

    const { address, name, phone, message } = this.state.rejectedVoter;

    return (
      <>
        <NavbarAdmin />
        <div className="container-main">
          <h2>Notifications</h2>
          <>
            <div className="container-item info">
              <div
                className="container-list attention"
                style={{ color: "white" }}
              >
                <table>
                  <tr>
                    <th> Rejection Message </th>
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
            </div>
          </>
        </div>
      </>
    );
  }
}
