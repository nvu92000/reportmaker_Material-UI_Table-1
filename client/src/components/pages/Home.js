import React, {
  useState,
  useContext,
  useEffect,
  useLayoutEffect,
  Fragment,
} from "react";
import { Row, Layout, Menu, Dropdown, message, Drawer, Card } from "antd";
import {
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { QUOTES } from "../../context/types";

import Login from "../auth/Login";
import PrivateRoute from "../routing/PrivateRoute";
import AppContent from "../AppContent";
import AppSider from "../AppSider";
import WeeklyReview from "../WeeklyReview";
import MonthlyReview from "../MonthlyReview";
import DailyHistory from "../DailyHistory";
import WeeklyWorkload from "../WeeklyWorkload";
import "../Style.css";
import "antd/dist/antd.css";
import AuthContext from "../../context/auth/authContext";
import MyContext from "../../context/table/myContext";
import DailyContext from "../../context/daily/dailyContext";
import LangContext from "../../context/lang/langContext";
import axios from "axios";
import { SET_LANG } from "../../context/types";
import Register from "../auth/Register";
import ForgotPassword from "../auth/ForgotPassword";
import ResetPassword from "../auth/ResetPassword";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { ReactComponent as Language } from "./Language.svg";

const Home = () => {
  const authContext = useContext(AuthContext);
  const myContext = useContext(MyContext);
  const dailyContext = useContext(DailyContext);
  const langContext = useContext(LangContext);

  const { logout, user, loadUser } = authContext;

  const { clearLogout, quotes, dispatch, isDataEdited } = myContext;

  const { clearDailyLogout } = dailyContext;

  const { switchLang, lang, currentLangData } = langContext;
  const {
    home: { _myAccount, _logOut },
    alert: { _pleaseChangeData, _logout },
  } = currentLangData
    ? currentLangData
    : {
        home: {
          _myAccount: "My Account",
          _logOut: "Log out",
        },
        alert: {
          _pleaseChangeData: "Please save your data or cancel changes first!",
          _logout: "LOGGED OUT",
        },
      };

  useLayoutEffect(() => {
    const selectedLang = window.localStorage.getItem("appUILang");

    if (selectedLang) {
      dispatch({ type: SET_LANG, payload: selectedLang });
    }
    // eslint-disable-next-line
  }, [lang]);

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const randomQuote = async () => {
      try {
        const res = await axios.get("https://api.quotable.io/random");
        // console.log(res.data);
        dispatch({ type: QUOTES, payload: res.data.content });
      } catch (error) {
        console.log(error);
      }
    };
    randomQuote();
  }, [dispatch]);

  const onLogout = () => {
    logout();
    clearLogout();
    clearDailyLogout();
    message.info(_logout);
    setVisible(false);
  };

  const [collapsed, setCollapsed] = useState(true);
  const [visible, setVisible] = useState(false);

  const { Header, Footer } = Layout;

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const onNameClick = () => {
    setVisible(true);
  };

  const langMenu = (
    <Menu>
      <Menu.Item
        key="1"
        onClick={() =>
          isDataEdited ? message.error(_pleaseChangeData) : switchLang("en-US")
        }
      >
        <Typography variant="body1" noWrap style={{ marginLeft: "5px" }}>
          English
        </Typography>
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={() =>
          isDataEdited ? message.error(_pleaseChangeData) : switchLang("ja")
        }
      >
        <Typography variant="body1" noWrap style={{ marginLeft: "5px" }}>
          日本語
        </Typography>
      </Menu.Item>
      <Menu.Item
        key="3"
        onClick={() =>
          isDataEdited ? message.error(_pleaseChangeData) : switchLang("vi")
        }
      >
        <Typography variant="body1" noWrap style={{ marginLeft: "5px" }}>
          Tiếng Việt
        </Typography>
      </Menu.Item>
      <Menu.Item
        key="4"
        onClick={() =>
          isDataEdited ? message.error(_pleaseChangeData) : switchLang("zh")
        }
      >
        <Typography variant="body1" noWrap style={{ marginLeft: "5px" }}>
          中文
        </Typography>
      </Menu.Item>
      <Menu.Item
        key="5"
        onClick={() =>
          isDataEdited ? message.error(_pleaseChangeData) : switchLang("ko")
        }
      >
        <Typography variant="body1" noWrap style={{ marginLeft: "5px" }}>
          한국어
        </Typography>
      </Menu.Item>
    </Menu>
  );

  const onClose = () => {
    setVisible(false);
  };

  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/forgotpassword" component={ForgotPassword} />
        <Route
          exact
          path="/resetpassword/:resetToken"
          component={ResetPassword}
        />
        <Fragment>
          <Layout>
            <AppSider isCollapsed={collapsed} />
            <Layout>
              <Layout>
                <Header>
                  <AppBar
                    className="AppBar"
                    position="relative"
                    color="transparent"
                  >
                    <Row type="flex" justify="space-between">
                      {React.createElement(
                        collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                        {
                          className: "trigger",
                          onClick: toggle,
                        }
                      )}
                      <Toolbar
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <Dropdown overlay={langMenu}>
                          <Button
                            style={{
                              marginRight: "25px",
                              color: " #fff",
                            }}
                          >
                            <Language style={{ marginRight: "5px" }} />
                            {lang === "en-US"
                              ? "English"
                              : lang === "ja"
                              ? "日本語"
                              : lang === "vi"
                              ? "Tiếng Việt"
                              : lang === "zh"
                              ? "中文"
                              : lang === "ko"
                              ? "한국어"
                              : "Language"}
                          </Button>
                        </Dropdown>

                        <Button
                          style={{ marginRight: "35px", color: " #fff" }}
                          onClick={onNameClick}
                        >
                          {user ? user.name : "Welcome!"}
                        </Button>
                        <Drawer
                          title={_myAccount}
                          placement="right"
                          closable={false}
                          onClose={onClose}
                          visible={visible}
                          width="280px"
                          bodyStyle={{
                            backgroundColor: "#faf9f8",
                            padding: "0 0",
                          }}
                          headerStyle={{ backgroundColor: "#faf9f8" }}
                        >
                          <Card
                            style={{
                              float: "left",
                              position: "absolute",
                              backgroundColor: "#fff",
                              borderWidth: "2px",
                              borderTopColor: "#e8e7e7",
                              borderBottomColor: "#e8e7e7",
                              width: "280px",
                              padding: "0 0",
                              textAlign: "center",
                            }}
                            bordered={true}
                          >
                            <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                              {user ? user.name : "Welcome!"}
                            </p>
                            <p style={{ fontSize: "16px" }}>
                              {user ? user.email : "Your email here"}
                            </p>
                            <Button
                              size="large"
                              variant="contained"
                              color="primary"
                              onClick={onLogout}
                              className="logout-button"
                            >
                              {_logOut}
                              <LogoutOutlined style={{ marginLeft: "5px" }} />
                            </Button>
                          </Card>
                        </Drawer>
                      </Toolbar>
                    </Row>
                  </AppBar>
                </Header>
              </Layout>
              <PrivateRoute key="/" path="/" exact component={AppContent} />
              <PrivateRoute
                key="/weeklyreview"
                path="/weeklyreview"
                exact
                component={WeeklyReview}
              />
              <PrivateRoute
                key="/monthlyreview"
                path="/monthlyreview"
                exact
                component={MonthlyReview}
              />
              <PrivateRoute
                key="/dailyhistory"
                path="/dailyhistory"
                exact
                component={DailyHistory}
              />
              <PrivateRoute
                key="/weeklyworkload"
                path="/weeklyworkload"
                exact
                component={WeeklyWorkload}
              />
              <Footer>
                <Paper elevation={10}>
                  <AppBar position="relative" color="transparent">
                    <h3 style={{ margin: "20px 10px 5px" }}>
                      {quotes === null ? null : `"${quotes}"`}
                    </h3>
                    <h3 style={{ margin: "5px 10px 20px" }}>
                      Copyright © 2002-2020 TechnoStar Co., Ltd.
                    </h3>
                  </AppBar>
                </Paper>
              </Footer>
            </Layout>
          </Layout>
        </Fragment>
      </Switch>
    </Router>
  );
};

export default Home;
