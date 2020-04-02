import React, { useState, useRef, useContext, useEffect } from "react";
import AuthContext from "../../context/auth/authContext";
import LangContext from "../../context/lang/langContext";
import "antd/dist/antd.css";
import "../Style.css";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Form, Input, Button, Tooltip, Card, message, Spin } from "antd";

const ForgotPassword = props => {
  const authContext = useContext(AuthContext);
  const langContext = useContext(LangContext);

  const {
    login: {
      _accountRecovery,
      _email,
      _whatIsYourEmail,
      _emailPrompt,
      _notaValidEmail,
      _sendPasswordResetEmail,
      _noUserWithThatEmail,
      _emailSent,
      _pleaseCheckEmail
    }
  } = langContext.currentLangData
    ? langContext.currentLangData
    : {
        login: {
          _accountRecovery: "Account Recovery",
          _email: "Email",
          _whatIsYourEmail: "What is your TechnoStar's email?",
          _emailPrompt: "Please input your TechnoStar's email!",
          _notaValidEmail: "The input is not a valid Email!",
          _sendPasswordResetEmail: "Send Password Reset Email",
          _noUserWithThatEmail: "There is no user with that email",
          _emailSent: "Email sent",
          _pleaseCheckEmail:
            "An email with a password reset link has been sent to your mailbox! Please check it!"
        }
      };

  const {
    forgotPassword,
    error,
    clearErrors,
    loading,
    msg,
    clearMsg
  } = authContext;

  const [form] = Form.useForm();

  const emailRef = useRef(null);

  const [info, setInfo] = useState(null);

  useEffect(() => {
    if (emailRef.current) emailRef.current.focus();
  }, [loading]);

  useEffect(() => {
    if (error === "There is no user with that email") {
      message.error(_noUserWithThatEmail);
      clearErrors();
      clearMsg();
      setInfo(null);
    }

    if (msg === "Email sent") {
      message.success(_emailSent);
      clearMsg();
      setInfo(_pleaseCheckEmail);
    }

    // eslint-disable-next-line
  }, [info, msg, error, props.history]);

  const onFinish = ({ email }) => {
    forgotPassword({
      email
    });
  };

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24
      },
      sm: {
        span: 8
      }
    },
    wrapperCol: {
      xs: {
        span: 24
      },
      sm: {
        span: 16
      }
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
        width: "500px"
      }}
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
          marginBottom: "50px"
        }}
      >
        {_accountRecovery}
      </h1>
      {loading ? (
        <Spin />
      ) : (
        <Form
          {...formItemLayout}
          form={form}
          name="reset-password"
          className="login-form"
          onFinish={onFinish}
        >
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
                message: _emailPrompt
              },
              {
                type: "email",
                message: _notaValidEmail
              }
            ]}
          >
            <Input ref={emailRef} />
          </Form.Item>
          {info !== null && loading === false && (
            <p style={{ backgroundColor: "#e5ffe0" }}>{info}</p>
          )}
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            {_sendPasswordResetEmail}
          </Button>
        </Form>
      )}
    </Card>
  );
};

export default ForgotPassword;
