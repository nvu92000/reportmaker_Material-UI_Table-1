import React, { Fragment, useRef, useContext, useEffect } from "react";
import AuthContext from "../../context/auth/authContext";
import LangContext from "../../context/lang/langContext";
import "antd/dist/antd.css";
import "../Style.css";
import { Form, Input, Button, Card } from "antd";

const ResetPassword = (props) => {
  const authContext = useContext(AuthContext);
  const langContext = useContext(LangContext);

  const {
    login: {
      _codeExpired,
      _returnToLogin,
      _passwordPrompt,
      _enterMorethan6,
      _confirmPasswordPrompt,
      _passwordNotMatch,
      _resetPassword,
      _newPassword,
      _confirmNewPassword,
    },
  } = langContext.currentLangData
    ? langContext.currentLangData
    : {
        login: {
          _codeExpired: "Validation code expired. Please try again later!",
          _returnToLogin: "Return to Login",
          _passwordPrompt: "Please input your password!",
          _enterMorethan6: "Please enter a password with 6 or more characters",
          _confirmPasswordPrompt: "Please confirm your password!",
          _passwordNotMatch: "The two passwords that you entered do not match!",
          _resetPassword: "Reset Password",
          _newPassword: "New Password",
          _confirmNewPassword: "Confirm New Password",
        },
      };

  const {
    updatePassword,
    resetRequest,
    msg,
    error,
    loading,
    isAuthenticated,
  } = authContext;

  const [form] = Form.useForm();

  const passwordRef = useRef(null);

  useEffect(() => {
    resetRequest(props.match.params.resetToken);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (passwordRef.current) passwordRef.current.focus();
    // eslint-disable-next-line
  }, [loading]);

  useEffect(() => {
    if (isAuthenticated) {
      props.history.push("/");
    }

    // eslint-disable-next-line
  }, [isAuthenticated, props.history]);

  const onFinish = ({ newpassword }) => {
    updatePassword({ email: msg, password: newpassword });
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
        borderColor: "#1890ff",
        borderWidth: "1.5px",
        padding: "40px 20px",
        textAlign: "center",
        width: "600px",
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

      {error === "Invalid token" || msg === null ? (
        <Fragment>
          <h2
            style={{
              color: "red",
              marginBottom: "50px",
            }}
          >
            {_codeExpired}
          </h2>
          <Button
            size="large"
            type="primary"
            className="login-form-button"
            onClick={() => props.history.push("/login")}
          >
            {_returnToLogin}
          </Button>
        </Fragment>
      ) : (
        <Fragment>
          <h1
            style={{
              color: "#1890ff",
              marginBottom: "50px",
            }}
          >
            {_resetPassword}
          </h1>
          <Form
            {...formItemLayout}
            form={form}
            name="reset-password"
            className="login-form"
            onFinish={onFinish}
          >
            <Form.Item
              label={_newPassword}
              name="newpassword"
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
              <Input.Password ref={passwordRef} />
            </Form.Item>
            <Form.Item
              label={_confirmNewPassword}
              name="confirm"
              dependencies={["newpassword"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: _confirmPasswordPrompt,
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue("newpassword") === value) {
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
              {_resetPassword}
            </Button>
          </Form>
        </Fragment>
      )}
    </Card>
  );
};

export default ResetPassword;
