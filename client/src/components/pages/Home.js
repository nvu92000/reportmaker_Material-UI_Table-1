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
import {
  SET_LANG,
  SET_COLLAPSED,
  QUOTES,
  RESET_PROJECTS,
  SET_DARK,
} from "../../context/types";
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
  TextField,
} from "@material-ui/core";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import FilterListIcon from "@material-ui/icons/FilterList";
import ClearIcon from "@material-ui/icons/Clear";
import CancelIcon from "@material-ui/icons/Cancel";
import TranslateIcon from "@material-ui/icons/Translate";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import IOSSwitch from "../helpers/IOSSwitch";

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
    collapsed,
    isDark,
  } = myContext;

  const { clearDailyLogout } = dailyContext;

  const { switchLang, lang, currentLangData } = langContext;
  const {
    home: { _myAccount, _logOut, _projectList, _close },
    alert: { _pleaseChangeData, _logout },
    inputDailyData: { _projectId, _projectName, _filter, _cancel },
  } = currentLangData
    ? currentLangData
    : {
        home: {
          _myAccount: "My Account",
          _logOut: "Log out",
          _projectList: "Project List",
          _close: "Close",
        },
        alert: {
          _pleaseChangeData: "Please save your data or cancel changes first!",
          _logout: "LOGGED OUT",
        },
        inputDailyData: {
          _projectId: "Project ID",
          _projectName: "Project Name",
          _filter: "Filter",
          _cancel: "Cancel",
        },
      };

  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState();

  const [idFiltered, setIdFiltered] = useState(false);
  const [nameFiltered, setNameFiltered] = useState(false);
  const [idValue, setIdValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [myPJ, setMyPJ] = useState([]);

  useEffect(() => {
    if (idFiltered && idValue !== "") {
      setMyPJ(
        projects.filter(
          (obj) => obj.pjid.toLowerCase().indexOf(idValue.toLowerCase()) >= 0
        )
      );
    } else if (nameFiltered && nameValue !== "") {
      setMyPJ(
        projects.filter(
          (obj) =>
            (lang === "ja" ? obj.pjname_jp : obj.pjname_en)
              .toLowerCase()
              .indexOf(nameValue.toLowerCase()) >= 0
        )
      );
    } else setMyPJ(projects);

    // eslint-disable-next-line
  }, [idFiltered, idValue, nameFiltered, nameValue, projects, lang]);

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

  const [visible, setVisible] = useState(false);

  const { Header, Footer } = Layout;

  const toggle = () => {
    dispatch({ type: SET_COLLAPSED, payload: !collapsed });
  };

  const onNameClick = () => {
    setVisible(true);
  };

  const langMenu = (
    <Menu
      style={{
        backgroundColor: isDark ? "#424242" : "#fff",
      }}
    >
      <Menu.Item
        key="1"
        onClick={() =>
          isDataEdited ? message.error(_pleaseChangeData) : switchLang("en-US")
        }
      >
        <Typography
          variant="body1"
          noWrap
          style={{ marginLeft: "5px", color: isDark ? "#fff" : "#595959" }}
        >
          English
        </Typography>
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={() =>
          isDataEdited ? message.error(_pleaseChangeData) : switchLang("ja")
        }
      >
        <Typography
          variant="body1"
          noWrap
          style={{ marginLeft: "5px", color: isDark ? "#fff" : "#595959" }}
        >
          日本語
        </Typography>
      </Menu.Item>
      <Menu.Item
        key="3"
        onClick={() =>
          isDataEdited ? message.error(_pleaseChangeData) : switchLang("vi")
        }
      >
        <Typography
          variant="body1"
          noWrap
          style={{ marginLeft: "5px", color: isDark ? "#fff" : "#595959" }}
        >
          Tiếng Việt
        </Typography>
      </Menu.Item>
      <Menu.Item
        key="4"
        onClick={() =>
          isDataEdited ? message.error(_pleaseChangeData) : switchLang("zh")
        }
      >
        <Typography
          variant="body1"
          noWrap
          style={{ marginLeft: "5px", color: isDark ? "#fff" : "#595959" }}
        >
          中文
        </Typography>
      </Menu.Item>
      <Menu.Item
        key="5"
        onClick={() =>
          isDataEdited ? message.error(_pleaseChangeData) : switchLang("ko")
        }
      >
        <Typography
          variant="body1"
          noWrap
          style={{ marginLeft: "5px", color: isDark ? "#fff" : "#595959" }}
        >
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

  const darkTheme = createMuiTheme({
    palette: {
      type: isDark ? "dark" : "light",
    },
  });

  const onThemeChange = () => {
    dispatch({ type: SET_DARK, payload: !isDark });
    window.localStorage.setItem("theme", !isDark ? "dark" : "light");
  };

  return (
    <ThemeProvider theme={darkTheme}>
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
              <AppSider />
              <Layout>
                <Layout>
                  <Header style={{ borderColor: isDark ? "#242526" : "#fff" }}>
                    <AppBar
                      className="AppBar"
                      position="relative"
                      style={{
                        backgroundColor: isDark
                          ? "#242526"
                          : "rgba(24, 144, 255)",
                      }}
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
                              <TranslateIcon style={{ marginRight: "5px" }} />
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
                          <Tooltip title={isDark ? "Dark Mode" : "Light Mode"}>
                            <IOSSwitch
                              checked={isDark}
                              onChange={onThemeChange}
                            />
                          </Tooltip>
                          <Tooltip title={_myAccount}>
                            <Button
                              style={{
                                marginLeft: "20px",
                                marginRight: "10px",
                                color: " #fff",
                              }}
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
                            className={isDark && "header-text"}
                            bodyStyle={{
                              backgroundColor: isDark ? "#424242" : "#faf9f8",
                              padding: "0 0",
                            }}
                            headerStyle={{
                              backgroundColor: isDark ? "#424242" : "#faf9f8",
                            }}
                          >
                            <Card
                              style={{
                                float: "left",
                                position: "absolute",
                                backgroundColor: isDark ? "#515151" : "#fff",
                                borderWidth: "2px",
                                borderTopColor: "#e8e7e7",
                                borderBottomColor: "#e8e7e7",
                                width: "305px",
                                padding: "0 0",
                                textAlign: "center",
                              }}
                              bordered={true}
                            >
                              <p
                                style={{
                                  fontSize: "20px",
                                  fontWeight: "bold",
                                  color: isDark ? "#fff" : "inherit",
                                }}
                              >
                                {user ? user.name : "Welcome!"}
                              </p>
                              <p
                                style={{
                                  fontSize: "16px",
                                  color: isDark ? "#fff" : "inherit",
                                }}
                              >
                                {user ? user.email : "Your email here"}
                              </p>
                              <Button
                                size="large"
                                variant="contained"
                                color="primary"
                                onClick={onLogout}
                                className={
                                  isDark
                                    ? "logout-button-dark"
                                    : "logout-button"
                                }
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
                <Footer style={{ borderColor: isDark ? "#424242" : "#fff" }}>
                  <Paper elevation={10}>
                    <AppBar
                      position="relative"
                      color="transparent"
                      style={{
                        zIndex: 10,
                        backgroundColor: isDark ? "#424242" : "inherit",
                      }}
                    >
                      <h3
                        style={{
                          margin: "20px 10px 5px",
                          color: isDark ? "#fff" : "inherit",
                        }}
                      >
                        {quotes === null ? null : `"${quotes}"`}
                      </h3>
                      <h3
                        style={{
                          margin: "5px 10px 20px",
                          color: isDark ? "#fff" : "inherit",
                        }}
                      >
                        {lang === "ja"
                          ? "© 2002-2020 株式会社テクノスター"
                          : "© 2002-2020 TechnoStar Co., Ltd."}
                      </h3>
                    </AppBar>
                  </Paper>
                </Footer>
                <div
                  style={{
                    position: "fixed",
                    bottom: 20,
                    right: 20,
                    zIndex: 200,
                  }}
                >
                  <Popper
                    open={open}
                    anchorEl={anchorEl}
                    placement={placement}
                    transition
                    style={{ zIndex: 800 }}
                  >
                    {({ TransitionProps }) => (
                      <Fade {...TransitionProps} timeout={350}>
                        <Paper elevation={2}>
                          <TableContainer
                            style={{
                              maxHeight: "550px",
                              overflowY: "scroll",
                            }}
                          >
                            <Table stickyHeader aria-label="sticky table">
                              <TableHead>
                                <TableRow>
                                  <TableCell align="center">
                                    {!idFiltered ? (
                                      <Tooltip
                                        title={_filter}
                                        aria-label="filter"
                                      >
                                        <IconButton
                                          aria-label="projectlist"
                                          onClick={() => {
                                            setIdFiltered(true);
                                            setNameFiltered(false);
                                            setNameValue("");
                                            setIdValue("");
                                          }}
                                        >
                                          <FilterListIcon />
                                        </IconButton>
                                      </Tooltip>
                                    ) : (
                                      <Tooltip
                                        title={_cancel}
                                        aria-label="cancel"
                                      >
                                        <IconButton
                                          aria-label="clear"
                                          onClick={() => {
                                            setIdFiltered(false);
                                          }}
                                        >
                                          <ClearIcon />
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                    {idFiltered ? (
                                      <TextField
                                        autoFocus
                                        style={{
                                          width: "60px",
                                        }}
                                        onChange={(event) =>
                                          setIdValue(event.target.value)
                                        }
                                      />
                                    ) : (
                                      _projectId
                                    )}
                                  </TableCell>
                                  <TableCell align="center">
                                    {!nameFiltered ? (
                                      <Tooltip
                                        title={_filter}
                                        aria-label="filter"
                                      >
                                        <IconButton
                                          aria-label="projectlist"
                                          onClick={() => {
                                            setNameFiltered(true);
                                            setIdFiltered(false);
                                            setIdValue("");
                                            setNameValue("");
                                          }}
                                        >
                                          <FilterListIcon />
                                        </IconButton>
                                      </Tooltip>
                                    ) : (
                                      <Tooltip
                                        title={_cancel}
                                        aria-label="cancel"
                                      >
                                        <IconButton
                                          aria-label="clear"
                                          onClick={() => setNameFiltered(false)}
                                        >
                                          <ClearIcon />
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                    {nameFiltered ? (
                                      <TextField
                                        autoFocus
                                        style={{ width: "100px" }}
                                        onChange={(event) =>
                                          setNameValue(event.target.value)
                                        }
                                      />
                                    ) : (
                                      _projectName
                                    )}
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {myPJ.length === 0 ? (
                                  <TableRow key={"empty"} hover>
                                    <TableCell
                                      align="right"
                                      style={{
                                        width: "160px",
                                        height: "53px",
                                      }}
                                    >
                                      Not
                                    </TableCell>
                                    <TableCell
                                      align="left"
                                      style={{
                                        width: "200px",
                                        height: "53x",
                                      }}
                                    >
                                      found
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  myPJ.map((obj, index) => {
                                    return (
                                      <TableRow key={index} hover>
                                        <TableCell
                                          align="center"
                                          style={{ width: "160px" }}
                                        >
                                          {obj.pjid}
                                        </TableCell>
                                        <TableCell
                                          align="center"
                                          style={{ width: "200px" }}
                                        >
                                          {lang === "ja"
                                            ? obj.pjname_jp
                                            : obj.pjname_en}
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Paper>
                      </Fade>
                    )}
                  </Popper>
                  {!open ? (
                    <Tooltip title={_projectList}>
                      <IconButton
                        aria-label="projectlist"
                        onClick={handleClick("top-end")}
                      >
                        <MenuBookIcon
                          style={{
                            width: "40px",
                            height: "40px",
                            color: isDark ? "#fff" : "#73a0fa",
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title={_close}>
                      <IconButton
                        aria-label="projectlist"
                        onClick={handleClick("top-end")}
                      >
                        <CancelIcon
                          style={{
                            width: "40px",
                            height: "40px",
                            color: "#ff1818",
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              </Layout>
            </Layout>
          </Fragment>
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default Home;
