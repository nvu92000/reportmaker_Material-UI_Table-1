import React, { useContext, useEffect, useRef } from "react";
import "antd/dist/antd.css";
import "../Style.css";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Card,
  message,
  Row,
  Col,
  Divider,
} from "antd";
import { cypher, decypher } from "./Cypher";
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

  const { switchLang, lang, currentLangData } = langContext;

  const {
    alert: { _loginSuccess },
    login: {
      _reportMaker,
      _username,
      _password,
      _rememberMe,
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
          _rememberMe: "Remember me",
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

  const myCypher = cypher("myscrets");
  const myDecypher = decypher("myscrets");

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

  const getCookie = (name) => {
    const re = new RegExp(name + "=([^;]+)");
    const value = re.exec(document.cookie);

    return value !== null ? myDecypher(unescape(value[1])) : null;
  };

  const onFinish = (values) => {
    // console.log("Received values of form: ", values);

    if (values.remember === true) {
      const today = new Date();
      const expiry = new Date(today.getTime() + 30 * 24 * 3600 * 1000); // plus 30 days

      const setCookie = (name, value) => {
        document.cookie =
          name +
          "=" +
          escape(value) +
          "; path=/; expires=" +
          expiry.toGMTString();
      };

      setCookie("gaz9me37", myCypher(values.username));
      setCookie("tu01dfr43", myCypher(values.password));
    }

    if (values.remember === false) {
      const today = new Date();
      const expired = new Date(today.getTime() - 24 * 3600 * 1000); // less 24 hours

      const deleteCookie = (name) => {
        document.cookie =
          name + "=null; path=/; expires=" + expired.toGMTString();
      };
      deleteCookie("gaz9me37");
      deleteCookie("tu01dfr43");
    }

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
        borderColor: "#1890ff",
        borderWidth: "1.5px",
        padding: "40px 20px",
        textAlign: "center",
        width: lang === "ja" ? "500px" : "450px",
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
          marginBottom: "50px",
        }}
      >
        {_reportMaker}
      </h1>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          username: getCookie("gaz9me37"),
          password: getCookie("tu01dfr43"),
          remember: true,
        }}
        onFinish={onFinish}
      >
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
          <Col span={12}>
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>{_rememberMe}</Checkbox>
            </Form.Item>
          </Col>
          <Col span={12}>
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
