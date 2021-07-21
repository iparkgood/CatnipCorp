import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import { Products, AdminUserInfoPage } from "./index";
import { Link } from "react-router-dom";

const Admin = () => {
  return (
    <>
      <h1>Admin Tools</h1>
      <Tabs defaultActiveKey="users">
        <Tab eventKey="users" title="Users">
          <AdminUserInfoPage />
        </Tab>
          <Tab eventKey="products" title="Products">
            <Products />
          </Tab>
      </Tabs>
    </>
  );
};

export default Admin;
