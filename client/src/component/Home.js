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
import ElectionStatusAdminHome from "./ElectionStatusAdminHome";
import ElectionNotStarted from "./ElectionNotStarted";
import NotInit from "./NotInit";
import modifyUserInputStr from "../../src/Utils";
import AboutElection from "./Home/AboutElection";
import AboutAdmin from "./Home/AboutAdmin";

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
      isElectionEnded: false,
      elEnded: false,
      elDetails: {
        adminName: null,
        adminEmail: null,
        adminTitle: null,
        organizationTitle: null,
        electionTitles: [],
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
      this.setState({ isElectionEnded: false });
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

      console.log(
        "Registration started time:",
        getLocalDateTime(registrationStartTimeUnixStamp)
      );
      console.log(
        "Registration end time:",
        getLocalDateTime(registrationEndTimeUnixTimeStamp)
      );
      console.log("Voting started time:", getLocalDateTime(votingstartedTime));
      console.log("Voting end time:", getLocalDateTime(votingEndedTime));

      this.setState({
        elDetails: {
          adminFirstName: this.state.elDetails.adminFirstName,
          adminLastName: this.state.elDetails.adminLastName,
          adminName: adminName,
          adminEmail: adminEmail,
          adminTitle: adminTitle,
          organizationTitle: organizationTitle,
          electionTitles: electionTitles,
          registrationStartTime: getLocalDateTime(
            registrationStartTimeUnixStamp
          ),
          registrationEndTime: getLocalDateTime(
            registrationEndTimeUnixTimeStamp
          ),
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
    console.log("Btn clicked");
    await this.state.ElectionInstance.methods
      .setElectionDetails(
        data.adminFName + " " + data.adminLName,
        data.adminEmail.toLowerCase(),
        data.adminTitle,
        data.organizationTitle,
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
  addTitle = () => { };
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
        {this.state.isAdmin ? (
          <>
            <this.renderAdminHome />
          </>
        ) : this.state.electionInitStatus ? (
          <>
            <UserHome el={this.state.elDetails} />
          </>
        ) : (
          <>
            <NotInit />
          </>
        )}
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
            {!this.state.isElectionEnded ? (
              this.state.electionInitStatus ? (
                <>
                  <ElectionStatusAdminHome el={this.state.elDetails} />
                </>
              ) : (
                <div className="container-main">
                  <AboutElection
                    register={register}
                    errors={errors}
                    EMsg={EMsg}
                  />
                  <AboutAdmin register={register} errors={errors} EMsg={EMsg} />
                </div>
              )
            ) : (
              <>
                {" "}
                <>
                  <div className="container-item attention">
                    <center>
                      <h3>
                        Oops! Election is already ended. You can view the
                        results.
                      </h3>
                      <br />
                      <Link
                        to="/Results"
                        style={{ color: "black", textDecoration: "underline" }}
                      >
                        <button className="btn-election">View result</button>
                      </Link>
                    </center>
                  </div>
                </>
              </>
            )}

            {this.state.electionInitStatus ? null : (
              <>
                <StartEnd />
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
