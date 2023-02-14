// Node modules
import React, { Component } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

// Components
import Navbar from "./Navbar/Navigation";
import NavbarAdmin from "./Navbar/NavigationAdmin";
import UserHome from "./UserHome";
import StartEnd from "./StartEnd";
import ElectionStatus from "./ElectionStatus";
import { connect } from "react-redux";
import { addElectionDetail } from "../redux/action/index";

// Contract
import getWeb3 from "../getWeb3";
import Election from "../artifacts/contracts/Election.sol/Election.json";

// CSS
import "./Home.css";
import HomeTitleForm from "./HomeTitleForm";

// const buttonRef = React.createRef();
class Home extends Component {
  // electionDetail:
  // this.props.electionDetail
  // electionTitle:
  // this.props.electionTitles

  constructor(props) {
    super(props);
    this.state = {
      ElectionInstance: undefined,
      account: null,
      web3: null,
      isAdmin: false,
      elStarted: false,
      elEnded: false,
      elDetails: {},
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

      const admin = await this.state.ElectionInstance.methods.getAdmin().call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }

      // Get election start and end values
      const start = await this.state.ElectionInstance.methods.getStart().call();
      this.setState({ elStarted: start });
      const end = await this.state.ElectionInstance.methods.getEnd().call();
      this.setState({ elEnded: end });

      // Getting election details from the contract
      const adminName = await this.state.ElectionInstance.methods
        .getAdminName()
        .call();
      const adminEmail = await this.state.ElectionInstance.methods
        .getAdminEmail()
        .call();
      const adminTitle = await this.state.ElectionInstance.methods
        .getAdminTitle()
        .call();
      const electionTitle = await this.state.ElectionInstance.methods
        .getElectionTitle()
        .call();
      const organizationTitle = await this.state.ElectionInstance.methods
        .getOrganizationTitle()
        .call();

      this.props.addElectionDetail({
        adminName: adminName,
        adminEmail: adminEmail,
        adminTitle: adminTitle,
        electionTitle: electionTitle,
        organizationTitle: organizationTitle,
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };
  // end election
  endElection = async () => {
    await this.state.ElectionInstance.methods
      .endElection()
      .send({ from: this.state.account, gas: 1000000 });
    window.location.reload();
  };
  // register and start election
  registerElection = async (data) => {
    await this.state.ElectionInstance.methods
      .setElectionDetails(
        data.adminFName.toLowerCase() + " " + data.adminLName.toLowerCase(),
        data.adminEmail.toLowerCase(),
        data.adminTitle.toLowerCase(),
        data.electionTitle.toLowerCase(),
        data.organizationTitle.toLowerCase()
      )
      .send({ from: this.state.account, gas: 1000000 });
    window.location.reload();
  };
  addTitle = () => {};
  currentTitle = (e) => {
    console.log(e.target.value);
  };

  render() {
    if (!this.state.web3) {
      return (
        <>
          <Navbar />
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
        <div className="container-main">
          <div className="container-item center-items info">
            Your Account: {this.state.account}
          </div>
          {!this.state.elStarted & !this.state.elEnded ? (
            <div className="container-item info">
              <center>
                <h3>The election has not been initialize.</h3>
                {this.state.isAdmin ? (
                  <p>Set up the election.</p>
                ) : (
                  <p>Please wait..</p>
                )}
              </center>
            </div>
          ) : null}
        </div>
        {this.state.isAdmin ? (
          <>
            <this.renderAdminHome />
          </>
        ) : this.state.elStarted ? (
          <>
            <UserHome el={this.state.elDetails} />
          </>
        ) : !this.state.elStarted && this.state.elEnded ? (
          <>
            <div className="container-item attention">
              <center>
                <h3>The Election ended.</h3>
                <br />
                <Link
                  to="/Results"
                  style={{ color: "black", textDecoration: "underline" }}
                >
                  See results
                </Link>
              </center>
            </div>
          </>
        ) : null}
      </>
    );
  }

  dummyView = () => {
    return null;
  };

  renderAdminHome = () => {
    const EMsg = (props) => {
      return <span style={{ color: "red", fontSize: 12 }}>{props.msg}</span>;
    };

    const AdminHome = () => {
      // Contains of Home page for the Admin
      const {
        handleSubmit,
        register,
        formState: { errors },
      } = useForm();

      const onSubmit = (data) => {
        this.registerElection(data);
      };

      return (
        <div>
          <this.dummyView />
          <form onSubmit={handleSubmit(onSubmit)}>
            {!this.state.elStarted & !this.state.elEnded ? (
              <div className="container-main">
                {/* about-admin */}
                <div className="about-admin">
                  <h2>About Admin</h2>
                  <div className="container-item center-items">
                    <div className="container-item-inside">
                      <label className="label-home">
                        <p className="label-home-title">Full Name</p>
                        {errors.adminFName && <EMsg msg="*required" />}
                        <input
                          className="input-home"
                          type="text"
                          placeholder="John"
                          {...register("adminFName", {
                            required: true,
                          })}
                        />
                        <input
                          className="input-home"
                          type="text"
                          placeholder="Doe"
                          {...register("adminLName")}
                        />
                      </label>

                      <label className="label-home">
                        <p className="label-home-title">Email</p>
                        {errors.adminEmail && (
                          <EMsg msg={errors.adminEmail.message} />
                        )}
                        <input
                          className="input-home"
                          placeholder="email@gmail.com"
                          name="adminEmail"
                          {...register("adminEmail", {
                            required: "*required",
                            pattern: {
                              value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, // email validation using RegExp
                              message: "*Invalid",
                            },
                          })}
                        />
                      </label>

                      <label className="label-home">
                        <p className="label-home-title">
                          Job Title or Position
                        </p>
                        {errors.adminTitle && <EMsg msg="*required" />}
                        <input
                          className="input-home"
                          type="text"
                          placeholder=" HR HEAD "
                          {...register("adminTitle", {
                            required: true,
                          })}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                {/* about-election */}
                <div className="about-election">
                  <center>
                    <h2>About Election</h2>
                  </center>
                  <div className="container-item center-items">
                    <div className="container-item-inside">
                      <HomeTitleForm />
                      <label className="label-home">
                        <p className="label-home-title">Organization Name</p>
                        {errors.organizationName && <EMsg msg="*required" />}
                        <input
                          className="input-home"
                          type="text"
                          placeholder="Kathford Int'l College"
                          {...register("organizationTitle", {
                            required: true,
                          })}
                        />
                      </label>

                      <label className="label-home">
                        <p className="label-home-title">
                          Registration Start From
                        </p>
                        {errors.registrationStart && <EMsg msg="*required" />}
                        <input
                          className="input-home"
                          type="datetime-local"
                          placeholder="Kathford Int'l College"
                          {...register("registrationStart", {
                            required: true,
                          })}
                        />
                      </label>

                      <label className="label-home">
                        <p className="label-home-title">Registration End At</p>
                        {errors.registrationEnd && <EMsg msg="*required" />}
                        <input
                          className="input-home"
                          type="datetime-local"
                          placeholder="date"
                          {...register("registrationEnd", {
                            required: true,
                          })}
                        />
                      </label>

                      <label className="label-home">
                        <p className="label-home-title">Election Start From</p>
                        {errors.electionStart && <EMsg msg="*required" />}
                        <input
                          className="input-home"
                          type="datetime-local"
                          placeholder="date"
                          {...register("electionStart", {
                            required: true,
                          })}
                        />
                      </label>

                      <label className="label-home">
                        <p className="label-home-title">Elections Title</p>
                        {errors.electionEnd && <EMsg msg="*required" />}
                        <input
                          className="input-home"
                          type="datetime-local"
                          placeholder="date"
                          {...register("electionEnd", {
                            required: true,
                          })}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ) : this.state.elStarted ? (
              <UserHome el={this.state.elDetails} />
            ) : null}
            <StartEnd
              elStarted={this.state.elStarted}
              elEnded={this.state.elEnded}
              endElFn={this.endElection}
            />
            <ElectionStatus
              elStarted={this.state.elStarted}
              elEnded={this.state.elEnded}
            />
          </form>
        </div>
      );
    };
    return <AdminHome />;
  };
}

const mapStateToProps = (state) => {
  return {
    electionDetail: state.electionDetailReducer,
    electionTitles: state.electionTitlesReducer,
  };
};

const mapDispatchToProps = {
  addElectionDetail,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
