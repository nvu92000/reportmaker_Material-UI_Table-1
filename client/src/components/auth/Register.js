import React, { useRef, useContext, useEffect } from "react";
import AuthContext from "../../context/auth/authContext";
import LangContext from "../../context/lang/langContext";
import "antd/dist/antd.css";
import "../Style.css";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Form, Input, Button, Tooltip, Card, message } from "antd";

const Register = (props) => {
  const authContext = useContext(AuthContext);
  const langContext = useContext(LangContext);

  const {
    login: {
      _accountRegister,
      _username,
      _email,
      _password,
      _confirmPassword,
      _register,
      _usernamePrompt,
      _emailPrompt,
      _passwordPrompt,
      _confirmPasswordPrompt,
      _usernameAlreadyExists,
      _emailAlreadyinUse,
      _whatIsYourUsername,
      _whatIsYourEmail,
      _notaValidEmail,
      _enterMorethan6,
      _passwordNotMatch,
      _emailNotExists,
    },
  } = langContext.currentLangData
    ? langContext.currentLangData
    : {
        login: {
          _accountRegister: "Account Register",
          _username: "Username",
          _email: "Email",
          _password: "Password",
          _confirmPassword: "Confirm Password",
          _register: "Register",
          _usernamePrompt: "Please input your username!",
          _emailPrompt: "Please input your TechnoStar email!",
          _passwordPrompt: "Please input your password!",
          _confirmPasswordPrompt: "Please confirm your password!",
          _usernameAlreadyExists: "Username already exists",
          _emailAlreadyinUse: "This email is already in use",
          _whatIsYourUsername: "What is your username in the old desktop app?",
          _whatIsYourEmail: "What is your TechnoStar email?",
          _notaValidEmail: "The input is not a valid TechnoStar email!",
          _enterMorethan6: "Please enter a password with 6 or more characters",
          _passwordNotMatch: "The two passwords that you entered do not match!",
          _emailNotExists:
            "This email does not exist in TechnoStar's database. Please contact your admin for assistance!",
        },
      };

  const { register, error, clearErrors, isAuthenticated } = authContext;

  const [form] = Form.useForm();

  const usernameRef = useRef(null);

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      props.history.push("/");
    }

    if (
      error ===
      "This email does not exist in TechnoStar's database. Please contact your admin for assistance!"
    ) {
      message.error(_emailNotExists);
      clearErrors();
    }

    if (error === "Username already exists") {
      message.error(_usernameAlreadyExists);
      clearErrors();
    }

    if (error === "This email is already in use") {
      message.error(_emailAlreadyinUse);
      clearErrors();
    }

    // eslint-disable-next-line
  }, [error, isAuthenticated, props.history]);

  const onFinish = ({ name, email, password }) => {
    register({
      name,
      email,
      password,
    });
  };

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
    },
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
        width: "500px",
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
        {_accountRegister}
      </h1>
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        className="login-form"
        onFinish={onFinish}
      >
        <Form.Item
          label={
            <span>
              {_username}&nbsp;
              <Tooltip title={_whatIsYourUsername}>
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          name="name"
          rules={[
            {
              required: true,
              message: _usernamePrompt,
              validateTrigger: "onClick",
            },
          ]}
        >
          <Input ref={usernameRef} />
        </Form.Item>
        <Form.Item
          label={
            <span>
              {_email}&nbsp;
              <Tooltip title={_whatIsYourEmail}>
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          name="email"
          rules={[
            {
              required: true,
              message: _emailPrompt,
              validateTrigger: "onClick",
            },
            {
              pattern: new RegExp(
                "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(e-technostar|etechnostar.onmicrosoft).com(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
              ),
              message: _notaValidEmail,
              validateTrigger: "onClick",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={_password}
          name="password"
          hasFeedback
          rules={[
            {
              required: true,
              message: _passwordPrompt,
              validateTrigger: "onClick",
            },
            {
              min: 6,
              message: _enterMorethan6,
              validateTrigger: "onClick",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label={_confirmPassword}
          name="confirm"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: _confirmPasswordPrompt,
              validateTrigger: "onClick",
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }

                return Promise.reject(_passwordNotMatch);
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Button
          size="large"
          type="primary"
          htmlType="submit"
          className="login-form-button"
        >
          {_register}
        </Button>
      </Form>
    </Card>
  );
};

export default Register;
