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
import { QUOTES, RESET_PROJECTS } from "../../context/types";

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
import {
  AppBar,
  Tooltip,
  Toolbar,
  Button,
  Typography,
  Paper,
  Popper,
  Fade,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@material-ui/core";
import ListAltIcon from "@material-ui/icons/ListAlt";
import { ReactComponent as Language } from "./Language.svg";

const Home = () => {
  const authContext = useContext(AuthContext);
  const myContext = useContext(MyContext);
  const dailyContext = useContext(DailyContext);
  const langContext = useContext(LangContext);

  const { logout, user, loadUser, isAuthenticated } = authContext;

  const {
    clearLogout,
    quotes,
    dispatch,
    isDataEdited,
    projects,
    getProject,
  } = myContext;

  const { clearDailyLogout } = dailyContext;

  const { switchLang, lang, currentLangData } = langContext;
  const {
    home: { _myAccount, _logOut },
    alert: { _pleaseChangeData, _logout },
    inputDailyData: { _projectId, _projectName },
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
        inputDailyData: {
          _projectId: "Project ID",
          _projectName: "Project Name",
        },
      };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
    if (isAuthenticated) getProject();

    // ComponentWillUnmount
    return () => {
      dispatch({ type: RESET_PROJECTS });
    };
    // eslint-disable-next-line
  }, [isAuthenticated]);

  useEffect(() => {
    const randomQuote = async () => {
      try {
        const res = await axios.get("https://api.quotable.io/random");
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

  const handleClick = (newPlacement) => (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => placement !== newPlacement || !prev);
    setPlacement(newPlacement);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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
                              marginRight: "20px",
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
                        <Popper
                          open={open}
                          anchorEl={anchorEl}
                          placement={placement}
                          transition
                          style={{ zIndex: 800 }}
                        >
                          {({ TransitionProps }) => (
                            <Fade {...TransitionProps} timeout={350}>
                              <Paper elevation={2} style={{ minwidth: 200 }}>
                                <TableContainer style={{ maxHeight: 500 }}>
                                  <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell align="center">
                                          {_projectId}
                                        </TableCell>
                                        <TableCell align="center">
                                          {_projectName}
                                        </TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {projects
                                        .slice(
                                          page * rowsPerPage,
                                          page * rowsPerPage + rowsPerPage
                                        )
                                        .map((obj, index) => {
                                          return (
                                            <TableRow key={index} hover>
                                              <TableCell align="center">
                                                {obj.pjid}
                                              </TableCell>
                                              <TableCell align="center">
                                                {lang === "ja"
                                                  ? obj.pjname_jp
                                                  : obj.pjname_en}
                                              </TableCell>
                                            </TableRow>
                                          );
                                        })}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                                <TablePagination
                                  rowsPerPageOptions={[10, 25, 100]}
                                  component="div"
                                  count={projects.length}
                                  rowsPerPage={rowsPerPage}
                                  page={page}
                                  onChangePage={handleChangePage}
                                  onChangeRowsPerPage={handleChangeRowsPerPage}
                                />
                              </Paper>
                            </Fade>
                          )}
                        </Popper>
                        <Tooltip title={"Project List"}>
                          <IconButton
                            aria-label="projectlist"
                            onClick={handleClick("bottom-start")}
                          >
                            <ListAltIcon style={{ color: "#fff" }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={_myAccount}>
                          <Button
                            style={{ marginLeft: "20px", color: " #fff" }}
                            onClick={onNameClick}
                          >
                            {user ? user.name : "Welcome!"}
                          </Button>
                        </Tooltip>
                        <Drawer
                          title={_myAccount}
                          placement="right"
                          closable={false}
                          onClose={onClose}
                          visible={visible}
                          width="305px"
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
                              width: "305px",
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
                  <AppBar
                    position="relative"
                    color="transparent"
                    style={{ zIndex: 10 }}
                  >
                    <h3 style={{ margin: "20px 10px 5px" }}>
                      {quotes === null ? null : `"${quotes}"`}
                    </h3>
                    <h3 style={{ margin: "5px 10px 20px" }}>
                      {lang === "ja"
                        ? "© 2002-2020 株式会社テクノスター"
                        : "© 2002-2020 TechnoStar Co., Ltd."}
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
