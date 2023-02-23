import React from "react";

function UserHome(props) {
  return (
    <div>
      <div className="container-main" style={{ color: "white" }}>
        <div className="container-list title">
        <h1><center>Election has been initialized.</center></h1>
          <h2><center>{props.el.organizationTitle}</center></h2>
          <table style={{ marginTop: "21px" }}>
            <tr>
              <th>admin</th>
              <td>
                {props.el.adminName} ({props.el.adminTitle})
              </td>
            </tr>
            <tr style={{ backgroundColor: "transparent" }}>
              <th>contact</th>
              <td style={{ textTransform: "none" }}>{props.el.adminEmail}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserHome;
