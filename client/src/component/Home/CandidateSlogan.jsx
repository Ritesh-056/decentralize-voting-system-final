import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewSlogan } from "../../redux/action/index";
import { useEffect } from "react";

const HomeCandidateSloganForm = () => {
  const [sloganTitle, setCandidateSlogan] = useState("");
  const slogans = useSelector((state) => state.candidateElectionSloganReducer)
  const dispatch = useDispatch();
  return (
    <>
      <label className="label-home">
        <p className="label-home-title"> Election Slogan </p>
        {/* {errors.electionTitles && <EMsg msg="*required" />} */}
        <div className="election-title-container">
          <input
            className="input-home"
            type="text"
            placeholder="bell"
            // {...register("electionTitles", {
            //   required: true,
            // })}
            value={sloganTitle}
            onChange={(e) => {
              setCandidateSlogan(e.target.value);
            }}
          />
        </div>
        <button
          className=""
          onClick={(e) => {
            e.preventDefault();
            if (sloganTitle == "") {
              alert("Oops! Slogan title title is empty.");
            } else {
              dispatch(addNewSlogan(sloganTitle));
              setCandidateSlogan("");
            }
          }}
        >
          Add Slogan
        </button>
        <ul className="titles">
          {slogans.map((value, index) => {
            return (
              <li key={index}>
                {index + 1}. {value}
              </li>
            );
          })}
        </ul>
      </label>
    </>
  );
};

export default HomeCandidateSloganForm;
