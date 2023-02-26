// Node module
import React from "react";

function UserHome(props) {
  const electionDetails = props.el;
  return (
    <div className="container-main">
      <h2>Election Details</h2>
      <small>Election Titles :{electionDetails.electionTitles.length}</small>
        <small>
          <ol type="number" style={{paddingTop:120}}>
            {electionDetails.electionTitles.map((title, index) => (
              <li style={{paddingBottom:8}} key={index}>{index+1}.{' '}{title}</li>
            ))}
          </ol>
        </small>

      <div className="container-list attention">
        <table>
          <tr>
            <th>Admin Name</th>
            <td>{electionDetails.adminName}</td>
          </tr>
          <tr style={{ backgroundColor: "transparent" }}>
            <th>Admin Email</th>
            <td>{electionDetails.adminEmail}</td>
          </tr>
          <tr>
            <th>Admin Title</th>
            <td>{electionDetails.adminTitle}</td>
          </tr>
          <tr style={{ backgroundColor: "transparent" }}>
            <th>Organization Title</th>
            <td>{electionDetails.organizationTitle}</td>
          </tr>
          <tr>
            <th>Registration Start Time</th>
            <td>{electionDetails.registrationStartTime}</td>
          </tr>

          <tr style={{ backgroundColor: "transparent" }}>
            <th>Registration End Time</th>
            <td>{electionDetails.registrationEndTime}</td>
          </tr>

          <tr>
            <th>Voting Start Time</th>
            <td>{electionDetails.votingStartTime}</td>
          </tr>

          <tr style={{ backgroundColor: "transparent" }}>
            <th>Voting End Time</th>
            <td>{electionDetails.votingEndTime}</td>
          </tr>
        </table>
      </div>
    </div>
  );
}

export default UserHome;
