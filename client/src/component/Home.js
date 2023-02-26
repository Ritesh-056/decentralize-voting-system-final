// Node modules
import React, { Component } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

// Components
import Navbar from "./Navbar/Navigation";
import NavbarAdmin from "./Navbar/NavigationAdmin";
import UserHome from "./UserHome";
import StartEnd from "./StartEnd";
import { connect } from "react-redux";
import { addElectionDetail } from "../redux/action/index";
import { getLocalDateTime } from "../DateTimeLocal";

// Contract
import getWeb3 from "../getWeb3";
import Election from "../artifacts/contracts/Election.sol/Election.json";

// CSS
import "./Home.css";
import HomeTitleForm from "./HomeTitleForm";
import ElectionStatusAdminHome from "./ElectionStatusAdminHome";
import ElectionNotStarted from "./ElectionNotStarted";
import NotInit from "./NotInit";

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
      electionStatus: false,
      electionInitStatus: false,
      isElectionEnded:false,
      elEnded: false,
      elDetails: {
        adminName:null,
        adminEmail:null,
        adminTitle:null,
        organizationTitle:null,
        electionTitles:[],
        registrationStartTime: null,
        registrationEndTime: null,
        votingStartTime: null,
        votingEndTime: null,
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

      const admin = await this.state.ElectionInstance.methods.getAdmin().call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }
      // end values of election
      const currentTimeStamp = Math.floor(Date.now() / 1000);
      console.log("Current send time is", getLocalDateTime(currentTimeStamp));

      const isElectionEnded = await this.state.ElectionInstance.methods
        .getElectionEndedStatus(currentTimeStamp)
        .call();
      this.setState({ isElectionEnded: isElectionEnded });
      console.log("Is election endeded", isElectionEnded);

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
      const electionTitles = await this.state.ElectionInstance.methods
        .getElectionTitles()
        .call();
      const organizationTitle = await this.state.ElectionInstance.methods
        .getOrganizationTitle()
        .call();

      const electionInitStatus = await this.state.ElectionInstance.methods
        .getElectionInitStatus()
        .call();
      this.setState({ electionInitStatus: electionInitStatus });

      console.log(this.state.electionInitStatus);

      this.props.addElectionDetail({
        adminName: adminName,
        adminEmail: adminEmail,
        adminTitle: adminTitle,
        organizationTitle: organizationTitle,
      });

      const votingstartedTime = await this.state.ElectionInstance.methods
        .getVotingStartTime()
        .call();
      const votingEndedTime = await this.state.ElectionInstance.methods
        .getVotingEndTime()
        .call();

           //get registration start and end time
      const registrationStartTimeUnixStamp =
      await this.state.ElectionInstance.methods
        .getRegistrationStartTime()
        .call();
    const registrationEndTimeUnixTimeStamp =
      await this.state.ElectionInstance.methods
        .getRegistrationEndTime()
        .call();

      console.log("Registration started time:", getLocalDateTime(registrationStartTimeUnixStamp));
      console.log("Registration end time:", getLocalDateTime(registrationEndTimeUnixTimeStamp));
      console.log("Voting started time:", getLocalDateTime(votingstartedTime));
      console.log("Voting end time:", getLocalDateTime(votingEndedTime));
   

      this.setState({
        elDetails: {
          adminName:adminName,
          adminEmail:adminEmail,
          adminTitle:adminTitle,
          organizationTitle:organizationTitle,
          electionTitles:electionTitles,
          registrationStartTime:  getLocalDateTime(registrationStartTimeUnixStamp),
          registrationEndTime: getLocalDateTime(registrationEndTimeUnixTimeStamp),
          votingStartTime: getLocalDateTime(votingstartedTime),
          votingEndTime: getLocalDateTime(votingEndedTime),
        },
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  //convert local time into unix timestamp
  convertDateTimeToUnix = (dateTime) => {
    const dateObj = new Date(dateTime);
    const unixTimestamp = Math.floor(dateObj.getTime() / 1000);
    return unixTimestamp;
  };

  // register and start election
  registerElection = async (data) => {
    await this.state.ElectionInstance.methods
      .setElectionDetails(
        data.adminFName.toLowerCase() + " " + data.adminLName.toLowerCase(),
        data.adminEmail.toLowerCase(),
        data.adminTitle.toLowerCase(),
        data.organizationTitle.toLowerCase(),
        this.convertDateTimeToUnix(data.votingStartDateTime),
        this.convertDateTimeToUnix(data.votingEndDateTime),
        this.convertDateTimeToUnix(data.registrationStartDateTime),
        this.convertDateTimeToUnix(data.registrationEndDateTime),
        this.props.electionTitles
      )
      .send({ from: this.state.account, gas: 1000000 });

    alert("Election saved successful");
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
          {/* {!this.state.elStarted & !this.state.elEnded ? (
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
          ) : null} */}
        </div>
        {this.state.isAdmin ? (
          <>
            <this.renderAdminHome />
          </>
        ) : this.state.electionInitStatus ? (
          <>
            <UserHome el={this.state.elDetails} />
          </>
        ) : this.state.isElectionEnded? (
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
        ) : <><NotInit/></>}
      </>
    );
  }

  renderAdminHome = () => {
    const EMsg = (props) => {
      return (
        <span style={{ color: "red", fontSize: 12, paddingLeft: 32 }}>
          {props.msg}
        </span>
      );
    };

    const AdminHome = () => {
      // Contains of Home page for the Admin
      const {
        handleSubmit,
        register,
        formState: { errors },
      } = useForm();

      const onSubmit = (data) => {
        const votingstartTime = this.convertDateTimeToUnix(
          data.votingStartDateTime
        );
        const votingEndTime = this.convertDateTimeToUnix(
          data.votingEndDateTime
        );
        const registrationStartTime = this.convertDateTimeToUnix(
          data.registrationStartDateTime
        );
        const registrationEndTime = this.convertDateTimeToUnix(
          data.registrationEndDateTime
        );

        if (registrationEndTime <= registrationStartTime) {
          return alert(
            "Registration end time should be greater than registration start time"
          );
        }

        if (votingstartTime <= registrationEndTime) {
          return alert(
            "Voting start time should be greater than registration end time"
          );
        }

        if (votingEndTime <= votingstartTime) {
          return alert(
            "Voting end time should be greater than voting start time"
          );
        }

        this.registerElection(data);
      };

      return (
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            {!this.state.electionInitStatus ? (
              <div className="container-main">
                {/* about-admin */}
                <div className="about-admin">
                  <h2>About Admin</h2>
                  <div className="container-item center-items">
                    <div className="container-item-inside">
                      <label className="label-home">
                        <p className="label-home-title">
                          Full Name
                          {errors.adminFName && <EMsg msg="*required" />}
                        </p>
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
                        <p className="label-home-title">
                          Email
                          {errors.adminEmail && (
                            <EMsg msg={errors.adminEmail.message} />
                          )}
                        </p>

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
                          {errors.adminTitle && <EMsg msg="*required" />}
                        </p>

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
                        <p className="label-home-title">
                          Organization Name
                          {errors.organizationTitle && <EMsg msg="*required" />}
                        </p>
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
                          {errors.registrationStartDateTime && (
                            <EMsg msg="*required" />
                          )}
                        </p>

                        <input
                          className="input-home"
                          type="datetime-local"
                          placeholder="registration start date"
                          {...register("registrationStartDateTime", {
                            required: true,
                          })}
                        />
                      </label>

                      <label className="label-home">
                        <p className="label-home-title">
                          Registration End At
                          {errors.registrationEndDateTime && (
                            <EMsg msg="* required" />
                          )}
                        </p>

                        <input
                          className="input-home"
                          type="datetime-local"
                          placeholder="registration end date"
                          {...register("registrationEndDateTime", {
                            required: true,
                          })}
                        />
                      </label>

                      <label className="label-home">
                        <p className="label-home-title">
                          Election Start From
                          {errors.votingStartDateTime && (
                            <EMsg msg="*required" />
                          )}
                        </p>

                        <input
                          className="input-home"
                          type="datetime-local"
                          placeholder="election start date"
                          {...register("votingStartDateTime", {
                            required: true,
                          })}
                        />
                      </label>

                      <label className="label-home">
                        <p className="label-home-title">
                          Elections End At
                          {errors.votingEndDateTime && <EMsg msg="*required" />}
                        </p>

                        <input
                          className="input-home"
                          type="datetime-local"
                          placeholder="election end date"
                          {...register("votingEndDateTime", {
                            required: true,
                          })}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ) : !this.state.isAdmin ? (
              <UserHome el={this.state.elDetails} />
            ) : (
              <ElectionStatusAdminHome el={this.state.elDetails} />
            )}
            {this.state.electionInitStatus ? null : (
              <>
                <StartEnd
                  elStarted={this.state.elStarted}
                  elEnded={this.state.elEnded}
                  endElFn={this.endElection}
                />
              </>
            )}
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
