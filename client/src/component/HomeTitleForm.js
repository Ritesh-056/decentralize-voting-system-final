import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewTitle } from "../redux/action/index";

const HomeTitleForm = () => {
  const [electionTitle, setElectionTitle] = useState("");
  // const [elections, setElections] = useState([]);
  const elections = useSelector((state) => state.electionTitlesReducer);
  const dispatch = useDispatch();
  return (
    <>
      <label className="label-home">
        <p className="label-home-title">Elections Title</p>
        {/* {errors.electionTitles && <EMsg msg="*required" />} */}
        <div className="election-title-container">
          <input
            className="input-home"
            type="text"
            placeholder="Choosing president"
            // {...register("electionTitles", {
            //   required: true,
            // })}
            value={electionTitle}
            onChange={(e) => {
              setElectionTitle(e.target.value);
            }}
          />
        </div>
        <button
          className=""
          onClick={(e) => {
            e.preventDefault();
            if (electionTitle == "") {
              alert("Oops! Election title is empty.");
            } else {
              dispatch(addNewTitle(electionTitle));
              setElectionTitle("");
            }
          }}
        >
          Add Title
        </button>
        <ul className="titles">
          {elections.map((value, index) => {
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

export default HomeTitleForm;
