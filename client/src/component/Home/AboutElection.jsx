import React from "react";
import HomeTitleForm from "../HomeTitleForm";

const AboutElection = ({ register, errors, EMsg }) => {
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
                {errors.registrationStartDateTime && <EMsg msg="*required" />}
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
                {errors.registrationEndDateTime && <EMsg msg="* required" />}
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
                {errors.votingStartDateTime && <EMsg msg="*required" />}
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
    </>
  );
};

export default AboutElection;
