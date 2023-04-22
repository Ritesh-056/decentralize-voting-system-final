import React, { memo } from "react";

const AboutAdmin = ({ register, errors, EMsg }) => {
  return (
    <>
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
                // value={elDetails.adminFirstName}
                onChange={(e) => { }}
              />
              <input
                className="input-home"
                type="text"
                placeholder="Doe"
                {...register("adminLName")}
                // value={elDetails.adminLastName}
                onChange={(e) => { }}
              />
            </label>

            <label className="label-home">
              <p className="label-home-title">
                Email
                {errors.adminEmail && <EMsg msg={errors.adminEmail.message} />}
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
    </>
  );
};

export default memo(AboutAdmin);
