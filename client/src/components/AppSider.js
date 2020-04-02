import React, { useEffect, useContext } from "react";
import { Layout, Menu, message } from "antd";
import {
  FormOutlined,
  SnippetsOutlined,
  CarryOutOutlined,
  CalendarOutlined,
  BarChartOutlined
} from "@ant-design/icons";
import { withRouter } from "react-router-dom";
import { SELECT_PAGE } from "../context/types";
import MyContext from "../context/table/myContext";
import LangContext from "../context/lang/langContext";

const AppSider = props => {
  // console.log(typeof props.match.url);
  const myContext = useContext(MyContext);
  const langContext = useContext(LangContext);

  const {
    alert: { _pleaseChangeData },
    inputDailyData: { _inputDailyData },
    weeklyReview: { _weeklyReview },
    monthlyReview: { _monthlyReview },
    dailyHistory: { _dailyHistory },
    weeklyWorkload: { _weeklyWorkload }
  } = langContext.currentLangData
    ? langContext.currentLangData
    : {
        alert: {
          _pleaseChangeData: "Please save your data or cancel changes first!"
        },
        inputDailyData: {
          _inputDailyData: "Input Daily Data"
        },
        weeklyReview: {
          _weeklyReview: "Weekly Review"
        },
        monthlyReview: {
          _monthlyReview: "Monthly Review"
        },
        dailyHistory: {
          _dailyHistory: "Daily History"
        },
        weeklyWorkload: {
          _weeklyWorkload: "Weekly Workload"
        }
      };

  const { selectedKeys, dispatch, isDataEdited } = myContext;

  const { Sider } = Layout;

  useEffect(() => {
    dispatch({ type: SELECT_PAGE, payload: "/" });
    // eslint-disable-next-line
  }, []);

  return (
    <Sider
      width={200}
      style={{ background: "#fff" }}
      trigger={null}
      collapsible
      collapsedWidth={0}
      collapsed={props.isCollapsed}
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

            default:
              break;
          }
        }}
      >
        <Menu.Item key="/">
          <FormOutlined />
          <span>{_inputDailyData}</span>
        </Menu.Item>
        <Menu.Item key="/weeklyreview">
          <SnippetsOutlined />
          <span>{_weeklyReview}</span>
        </Menu.Item>
        <Menu.Item key="/monthlyreview">
          <CarryOutOutlined />
          <span>{_monthlyReview}</span>
        </Menu.Item>
        <Menu.Item key="/dailyhistory">
          <CalendarOutlined />
          <span>{_dailyHistory}</span>
        </Menu.Item>
        <Menu.Item key="/weeklyworkload">
          <BarChartOutlined />
          <span>{_weeklyWorkload}</span>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default withRouter(AppSider);
