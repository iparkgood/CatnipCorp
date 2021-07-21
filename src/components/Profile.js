import React, { useContext } from "react";
import { UserContext } from "..";
import { useHistory } from "react-router-dom";
import { Form, Row, Col, Button } from "react-bootstrap";

const Profile = () => {
  const history = useHistory();
  const { user } = useContext(UserContext);

  return (
    <>
      <h2 style={{fontSize: "1.5rem", marginBottom: "1rem"}}>Profile</h2>
      <Form>
        <Form.Group style={{margin: "0.5rem"}} as={Row} controlId="formUserProfileUsername">
          <Form.Label column sm="4">Username</Form.Label>
          <Col sm="8">
            <Form.Control plaintext readOnly value={user.username} />
          </Col>
        </Form.Group>

        <Form.Group style={{margin: "0.5rem"}} as={Row} controlId="formUserProfileEmail">
          <Form.Label column sm="4">Email</Form.Label>
          <Col sm="8">
            <Form.Control plaintext readOnly value={user.email} />
          </Col>
        </Form.Group>

        <Form.Group style={{margin: "0.5rem"}} as={Row} controlId="formUserProfilePassword">
          <Form.Label column sm="4">
            Password
          </Form.Label>
          <Col sm="8">
            <Form.Control type="password" placeholder="Password" />
          </Col>
        </Form.Group>

        <Form.Group style={{margin: "0.5rem"}} as={Row} controlId="formUserProfileConfirmPassword">
          <Form.Label column sm="4">
            Confirm Password
          </Form.Label>
          <Col sm="8">
            <Form.Control type="password" placeholder="Confirm Password" />
          </Col>
        </Form.Group>

        <Form.Group style={{margin: "0.5rem"}} as={Row}>
          <Col sm={{ span: 8, offset: 4 }}>
            <Button type="submit">Reset Password</Button>
          </Col>
        </Form.Group>

        {user.isAdmin === true ?
          <Col sm={{ span: 8, offset: 4 }}>
            <Button onClick={() => history.push("/admin")}>Admin Access</Button>
          </Col> 
          : 
          null}
      </Form>
    </>
  )
}
export default Profile;