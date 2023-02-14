import React, { useState } from "react";

const HomeTitleForm = () => {
  const [electionTitle, setElectionTitle] = useState("");
  const [elections, setElections] = useState([]);
  return (
    <>
      <label className="label-home">
        <p className="label-home-title">Elections Title</p>
        {/* {errors.electionTitles && <EMsg msg="*required" />} */}
        <div className="election-title-container">
          <input
            className="input-home"
            type="text"
            placeholder="Kathford Int'l College"
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
            setElections([...elections, electionTitle]);
            setElectionTitle("");
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
