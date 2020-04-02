import React from "react";
import { Layout, Breadcrumb } from "antd";

const NotFound = () => {
  const { Content } = Layout;

  return (
    <Layout style={{ padding: "0 15px 15px" }}>
      <Breadcrumb style={{ margin: "16px 0" }} />
      <Content
        style={{
          padding: "20px 50px",
          borderRadius: "2px",
          position: "relative",
          transition: "all .3s",
          textAlign: "center"
        }}
      >
        <h1 style={{ fontSize: "50px", marginTop: "150px" }}>Not Found</h1>
        <p style={{ fontSize: "50px" }}>
          The page you are looking for does not exist!
        </p>
      </Content>
    </Layout>
  );
};

export default NotFound;
