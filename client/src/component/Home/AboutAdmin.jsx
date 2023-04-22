import React, { memo, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAboutAdmin } from "../../redux/action/index";

const AboutAdmin = ({ register, errors, EMsg }) => {
  const dispatch = useDispatch();
  const aboutAdmin = useSelector((state) => state.aboutAdminReducer);
  return (
    <>
      {/* about-admin */}
      <div className="about-admin">
        <h2>Election Admin</h2>
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
                value={aboutAdmin.adminFName}
                onChange={(e) => {
                  dispatch(
                    addAboutAdmin({
                      ...aboutAdmin,
                      adminFName: e.target.value,
                    })
                  );
                }}
              />
              <input
                className="input-home"
                type="text"
                placeholder="Doe"
                {...register("adminLName")}
                value={aboutAdmin.adminLName}
                onChange={(e) => {
                  dispatch(
                    addAboutAdmin({
                      ...aboutAdmin,
                      adminLName: e.target.value,
                    })
                  );
                }}
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
                value={aboutAdmin.adminEmail}
                onChange={(e) => {
                  dispatch(
                    addAboutAdmin({
                      ...aboutAdmin,
                      adminEmail: e.target.value,
                    })
                  );
                }}
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
                value={aboutAdmin.adminTitle}
                onChange={(e) => {
                  dispatch(
                    addAboutAdmin({
                      ...aboutAdmin,
                      adminTitle: e.target.value,
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

export default memo(AboutAdmin);
