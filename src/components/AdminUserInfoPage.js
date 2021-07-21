import React, { useContext } from "react";
import { UserContext } from "..";
import { Table } from "react-bootstrap";


const AdminUserInfoPage = () => {
  const { users } = useContext(UserContext);

  return (
    <>
      <h3>User Information</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {
            users && users.map(user =>
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
              </tr>
            )
          }
        </tbody>
      </Table>
    </>
  )
}

export default AdminUserInfoPage;