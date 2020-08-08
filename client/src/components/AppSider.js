import React, { useEffect, useContext } from "react";
import { Layout, Menu, message } from "antd";
import { withRouter } from "react-router-dom";
import { SELECT_PAGE } from "../context/types";
import MyContext from "../context/table/myContext";
import LangContext from "../context/lang/langContext";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import AssignmentIcon from "@material-ui/icons/Assignment";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import BarChartIcon from "@material-ui/icons/BarChart";
import DashboardIcon from "@material-ui/icons/Dashboard";
import Typography from "@material-ui/core/Typography";

const AppSider = (props) => {
  const myContext = useContext(MyContext);
  const langContext = useContext(LangContext);

  const { lang, currentLangData } = langContext;

  const {
    alert: { _pleaseChangeData },
    inputDailyData: { _inputDailyData },
    weeklyReview: { _weeklyReview },
    monthlyReview: { _monthlyReview },
    dailyHistory: { _dailyHistory },
    weeklyWorkload: { _weeklyWorkload },
  } = currentLangData
      ? currentLangData
      : {
        alert: {
          _pleaseChangeData: "Please save your data or cancel changes first!",
        },
        inputDailyData: {
          _inputDailyData: "Input Daily Data",
        },
        weeklyReview: {
          _weeklyReview: "Weekly Review",
        },
        monthlyReview: {
          _monthlyReview: "Monthly Review",
        },
        dailyHistory: {
          _dailyHistory: "Daily History",
        },
        weeklyWorkload: {
          _weeklyWorkload: "Weekly Workload",
        },
      };

  const { selectedKeys, dispatch, isDataEdited, collapsed, isDark } = myContext;

  const { Sider } = Layout;

  useEffect(() => {
    dispatch({ type: SELECT_PAGE, payload: "/" });
    // eslint-disable-next-line
  }, []);

  return (
    <Sider
      width={lang === "vi" ? "210px" : "190px"}
      style={{
        backgroundColor: isDark ? "#424242" : "#fff",
        borderColor: isDark ? "#424242" : "#fff",
      }}
      trigger={null}
      collapsible
      collapsedWidth={0}
      collapsed={collapsed}
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
      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        style={{
          backgroundColor: isDark ? "#424242" : "#fff",
          borderColor: isDark ? "#424242" : "#fff",
          color: isDark ? "#fff" : "#595959",
        }}
        className={isDark ? "menustyle" : ""}
        onClick={({ key }) => {
          switch (key) {
            case "/":
              dispatch({ type: SELECT_PAGE, payload: "/" });
              props.history.push("/");
              break;

            case "/weeklyreview":
              if (isDataEdited) {
                message.error(_pleaseChangeData);
              } else {
                dispatch({ type: SELECT_PAGE, payload: "/weeklyreview" });
                props.history.push("/weeklyreview");
              }
              break;

            case "/monthlyreview":
              if (isDataEdited) {
                message.error(_pleaseChangeData);
              } else {
                dispatch({ type: SELECT_PAGE, payload: "/monthlyreview" });
                props.history.push("/monthlyreview");
              }
              break;

            case "/dailyhistory":
              if (isDataEdited) {
                message.error(_pleaseChangeData);
              } else {
                dispatch({ type: SELECT_PAGE, payload: "/dailyhistory" });
                props.history.push("/dailyhistory");
              }
              break;

            case "/weeklyworkload":
              if (isDataEdited) {
                message.error(_pleaseChangeData);
              } else {
                dispatch({ type: SELECT_PAGE, payload: "/weeklyworkload" });
                props.history.push("/weeklyworkload");
              }
              break;

            case "/dashboard":
              if (isDataEdited) {
                message.error(_pleaseChangeData);
              } else {
                dispatch({ type: SELECT_PAGE, payload: "/dashboard" });
                props.history.push("/dashboard");
              }
              break;

            default:
              break;
          }
        }}
      >
        <Menu.Item
          key="/dashboard"
          style={{ display: "flex", alignItems: "center" }}
        >
          <DashboardIcon style={{ margin: "0 8px 0 -5px" }} />
          <span>
            <Typography variant="body1" noWrap>
              Dashboard
            </Typography>
          </span>
        </Menu.Item>
        <Menu.Item key="/" style={{ display: "flex", alignItems: "center" }}>
          <BorderColorIcon style={{ margin: "0 8px 0 -5px" }} />
          <span>
            <Typography variant="body1" noWrap>
              {_inputDailyData}
            </Typography>
          </span>
        </Menu.Item>
        <Menu.Item
          key="/weeklyreview"
          style={{ display: "flex", alignItems: "center" }}
        >
          <AssignmentIcon style={{ margin: "0 8px 0 -5px" }} />
          <span>
            <Typography variant="body1" noWrap>
              {_weeklyReview}
            </Typography>
          </span>
        </Menu.Item>
        <Menu.Item
          key="/monthlyreview"
          style={{ display: "flex", alignItems: "center" }}
        >
          <AssignmentTurnedInIcon style={{ margin: "0 8px 0 -5px" }} />
          <span>
            <Typography variant="body1" noWrap>
              {_monthlyReview}
            </Typography>
          </span>
        </Menu.Item>
        <Menu.Item
          key="/dailyhistory"
          style={{ display: "flex", alignItems: "center" }}
        >
          <CalendarTodayIcon style={{ margin: "0 8px 0 -5px" }} />
          <span>
            <Typography variant="body1" noWrap>
              {_dailyHistory}
            </Typography>
          </span>
        </Menu.Item>
        <Menu.Item
          key="/weeklyworkload"
          style={{ display: "flex", alignItems: "center" }}
        >
          <BarChartIcon style={{ margin: "0 8px 0 -5px" }} />
          <span>
            <Typography variant="body1" noWrap>
              {_weeklyWorkload}
            </Typography>
          </span>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default withRouter(AppSider);
