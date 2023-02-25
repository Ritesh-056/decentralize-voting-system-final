import React from "react";

export function loadAllCandidates(candidates) {
    const renderAllCandidates = (candidate) => {
      return (
        <>
          <div className="container-list success">
            <table>
              <tr>
                <th>Candidate Address</th>
                <td>{candidate.candidateAddress}</td>
              </tr>
              <tr>
                <th>Candidate Header</th>
                <td>{candidate.header}</td>
              </tr>
              <tr>
                <th>Candidate Slogan</th>
                <td>{candidate.slogan}</td>
              </tr>
              <tr>
                <th>Verified</th>
                <td>{candidate.isVerified ? "True" : "False"}</td>
              </tr>
              <tr>
                <th>Registered</th>
                <td>{candidate.isRegistered ? "True" : "False"}</td>
              </tr>
            </table>
          </div>
        </>
      );
    };
    return (
      <>
        <div className="container-item success">
          <center>List of Candidates</center>
        </div>
        {candidates.map(renderAllCandidates)}
      </>
    );
  }

  export function loadAdded(candidates) {
    const renderAdded = (candidate) => {
      return (
        <>
          <div className="container-list success">
            <div
              style={{
                maxHeight: "21px",
              }}
            >
              {"["}
              {candidate.candidateId}
              {"] "}
              <strong>{candidate.header}</strong>:{"  "}
              {candidate.slogan}
            </div>
          </div>
        </>
      );
    };
    return (
      <div className="container-main" style={{ borderTop: "1px solid" }}>
        <div className="container-item info">
          <center>Candidates </center>
        </div>
        {candidates.length < 1 ? (
          <div className="container-item alert">
            <center>No candidates </center>
          </div>
        ) : (
          <div
            className="container-item"
            style={{
              display: "block",
              backgroundColor: "#DDFFFF",
            }}
          >
            {candidates.map(renderAdded)}
          </div>
        )}
      </div>
    );
  }
  