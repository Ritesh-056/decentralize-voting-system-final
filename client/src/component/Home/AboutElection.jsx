import React from "react";
import HomeTitleForm from "./HomeTitleForm";
import { useDispatch, useSelector } from "react-redux";
import { addAboutElection } from "../../redux/action/index";
import HomeCandidateSloganForm from "./CandidateSlogan";

const AboutElection = ({ register, errors, EMsg }) => {
  const dispatch = useDispatch();
  const aboutElection = useSelector((state) => state.aboutElectionReducer);
  return (
    <>
      {/* about-election */}
      <div className="about-election">
        <center>
          <h2>About Election</h2>
        </center>
        <div className="container-item center-items">
          <div className="container-item-inside">
            <HomeTitleForm />
            <HomeCandidateSloganForm />
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
                value={aboutElection.organizationTitle}
                onChange={(e) => {
                  dispatch(
                    addAboutElection({
                      ...aboutElection,
                      organizationTitle: e.target.value,
                    })
                  );
                }}
              />
            </label>

            <label className="label-home">
              <p className="label-home-title">
                Registration Start From
                {errors.registrationStartDateTime && <EMsg msg="*required" />}
              </p>

              <input
                className="input-home"
                type="datetime-local"
                placeholder="registration start date"
                {...register("registrationStartDateTime", {
                  required: true,
                })}
                value={aboutElection.registrationStartTime}
                onChange={(e) => {
                  dispatch(
                    addAboutElection({
                      ...aboutElection,
                      registrationStartTime: e.target.value,
                    })
                  );
                }}
              />
            </label>

            <label className="label-home">
              <p className="label-home-title">
                Registration End At
                {errors.registrationEndDateTime && <EMsg msg="* required" />}
              </p>

              <input
                className="input-home"
                type="datetime-local"
                placeholder="registration end date"
                {...register("registrationEndDateTime", {
                  required: true,
                })}
                value={aboutElection.registrationEndTime}
                onChange={(e) => {
                  dispatch(
                    addAboutElection({
                      ...aboutElection,
                      registrationEndTime: e.target.value,
                    })
                  );
                }}
              />
            </label>

            <label className="label-home">
              <p className="label-home-title">
                Election Start From
                {errors.votingStartDateTime && <EMsg msg="*required" />}
              </p>

              <input
                className="input-home"
                type="datetime-local"
                placeholder="election start date"
                {...register("votingStartDateTime", {
                  required: true,
                })}
                value={aboutElection.votingStartTime}
                onChange={(e) => {
                  dispatch(
                    addAboutElection({
                      ...aboutElection,
                      votingStartTime: e.target.value,
                    })
                  );
                }}
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
                value={aboutElection.votingEndTime}
                onChange={(e) => {
                  dispatch(
                    addAboutElection({
                      ...aboutElection,
                      votingEndTime: e.target.value,
                    })
                  );
                }}
              />
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutElection;
