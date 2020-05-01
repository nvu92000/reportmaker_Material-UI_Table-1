import React, { useContext, useEffect, useRef } from "react";
import "antd/dist/antd.css";
import "../Style.css";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Form, Input, Button, Card, message, Row, Col, Divider } from "antd";
import US_flag from "./flags/us_flag.png";
import JP_flag from "./flags/jp_flag.png";
import VN_flag from "./flags/vn_flag.png";
import CN_flag from "./flags/cn_flag.png";
import KR_flag from "./flags/kr_flag.png";

import AuthContext from "../../context/auth/authContext";
import LangContext from "../../context/lang/langContext";
import { Link } from "react-router-dom";

const Login = (props) => {
  const authContext = useContext(AuthContext);
  const langContext = useContext(LangContext);

  const { switchLang, currentLangData } = langContext;

  const {
    alert: { _loginSuccess },
    login: {
      _reportMaker,
      _username,
      _password,
      _forgotPassword,
      _login,
      _or,
      _createAnAccount,
      _usernamePrompt,
      _passwordPrompt,
      _invalidCredentials,
    },
  } = currentLangData
    ? currentLangData
    : {
        alert: {
          _loginSuccess: "LOGIN SUCCESSFUL!",
        },
        login: {
          _reportMaker: "Report Maker",
          _username: "Username",
          _password: "Password",
          _forgotPassword: "Forgot password?",
          _login: "Log in",
          _or: "or",
          _createAnAccount: "Create an account",
          _usernamePrompt: "Please input your username!",
          _passwordPrompt: "Please input your password!",
          _invalidCredentials: "Invalid Credentials",
        },
      };

  const { login, error, clearErrors, isAuthenticated } = authContext;

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      props.history.push("/");
    }

    if (error === "Invalid Credentials") {
      message.error(_invalidCredentials);
      clearErrors();
    }
    // eslint-disable-next-line
  }, [error, isAuthenticated, props.history]);

  const onFinish = (values) => {
    login(
      {
        name: values.username,
        password: values.password,
      },
      _loginSuccess
    );
  };

  const firstKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      passwordRef.current.focus();
    }
  };

  return (
    <Card
      style={{
        margin: "auto",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        borderRadius: "8px",
        borderColor: "#1890ff",
        borderWidth: "1.5px",
        padding: "10px 10px",
        textAlign: "center",
        width: "450px",
      }}
      className="responsive-card"
      bordered={true}
    >
      <div className="logo">
        <h2>
          <a
            href="http://www.e-technostar.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              alt="/"
              width={160}
              src="http://www.e-technostar.com/beta2016/wp-content/uploads/2019/04/technostar_logo_w210.png"
            />
          </a>
        </h2>
      </div>
      <h1
        style={{
          color: "#1890ff",
          marginBottom: "30px",
        }}
      >
        {_reportMaker}
      </h1>
      <Form name="normal_login" className="login-form" onFinish={onFinish}>
        <Form.Item
          name="username"
          rules={[{ required: true, message: _usernamePrompt }]}
        >
          <Input
            ref={usernameRef}
            onKeyDown={firstKeyDown}
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder={_username}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: _passwordPrompt,
            },
          ]}
        >
          <Input.Password
            ref={passwordRef}
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder={_password}
          />
        </Form.Item>
        <Row>
          <Col span={24}>
            <Form.Item>
              <Link className="login-form-forgot" to="/forgotpassword">
                {_forgotPassword}
              </Link>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            {_login}
          </Button>
        </Form.Item>
        <Form.Item>
          <Divider>{_or}</Divider>
          <Link className="login-form-forgot" to="/register">
            {_createAnAccount}
          </Link>
        </Form.Item>
        <Link to="" onClick={() => switchLang("en-US")}>
          <img
            src={US_flag}
            alt=""
            width="30px"
            style={{ marginRight: "10px", paddingBottom: "3px" }}
          />
        </Link>
        <Link to="" onClick={() => switchLang("ja")}>
          <img
            src={JP_flag}
            alt=""
            width="30px"
            style={{ marginRight: "10px", paddingBottom: "3px" }}
          />
        </Link>
        <Link to="" onClick={() => switchLang("vi")}>
          <img
            src={VN_flag}
            alt=""
            width="30px"
            style={{ marginRight: "10px", paddingBottom: "3px" }}
          />
        </Link>
        <Link to="" onClick={() => switchLang("zh")}>
          <img
            src={CN_flag}
            alt=""
            width="30px"
            style={{ marginRight: "10px", paddingBottom: "3px" }}
          />
        </Link>
        <Link to="" onClick={() => switchLang("ko")}>
          <img
            src={KR_flag}
            alt=""
            width="30px"
            style={{ marginRight: "10px", paddingBottom: "3px" }}
          />
        </Link>
      </Form>
    </Card>
  );
};

export default Login;
