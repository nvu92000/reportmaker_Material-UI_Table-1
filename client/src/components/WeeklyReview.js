import React, { useState, useContext, useEffect } from "react";
import MyContext from "../context/table/myContext";
import AuthContext from "../context/auth/authContext";
import LangContext from "../context/lang/langContext";
import { SELECT_PAGE } from "../context/types";
import {
  Button,
  Layout,
  Breadcrumb,
  DatePicker,
  message,
  Select,
  Row,
  Col,
} from "antd";
import "antd/dist/antd.css";
import axios from "axios";
import moment from "moment";
import { TableContainer } from "@material-ui/core";

const WeeklyReview = (props) => {
  const myContext = useContext(MyContext);
  const authContext = useContext(AuthContext);
  const langContext = useContext(LangContext);

  const { currentLangData } = langContext;
  const {
    alert: { _pleaseSelectWeek, _pleaseSelectRole },
    weeklyReview: { _reportWeek, _selectWeek, _role, _downloadReport },
  } = currentLangData
    ? currentLangData
    : {
        alert: {
          _pleaseSelectWeek: "Please select a week!",
          _pleaseSelectRole: "Please select a role!",
        },
        weeklyReview: {
          _reportWeek: "Report Week:",
          _selectWeek: "Select Week",
          _role: "Select Role",
          _downloadReport: "Download Report",
        },
      };

  const { Content } = Layout;

  const { dispatch, isDark } = myContext;

  const { user } = authContext;
  const name = user && user.name.charAt(0).toUpperCase() + user.name.slice(1);

  const [weekSelect, SetWeekSelect] = useState("");
  const [roleSelect, setRoleSelect] = useState(
    window.localStorage.getItem("role") || ""
  );

  useEffect(() => {
    dispatch({ type: SELECT_PAGE, payload: "/weeklyreview" });
    // eslint-disable-next-line
  }, []);

  const onChangeDate = async (date) => {
    if (date !== null) {
      const sunday = date.startOf("week").format("YYYYMMDD").toString();
      if (roleSelect !== "") {
        await axios.get(`api/weekly/get`, {
          params: {
            name,
            sunday,
            role: roleSelect,
          },
        });
      }
      SetWeekSelect(sunday);
    }
  };

  const onChangeRole = async (role) => {
    if (weekSelect !== "") {
      await axios.get(`api/weekly/get`, {
        params: {
          name,
          sunday: weekSelect,
          role,
        },
      });
    }
    setRoleSelect(role);
    window.localStorage.setItem("role", role);
  };

  const onDownload = async (name, weekSelect) => {
    try {
      const res = await axios.get(`api/xlsx/weekly`, {
        responseType: "blob",
        //Force to receive data in a Blob Format
        params: {
          name,
          sunday: weekSelect,
        },
      });

      //Create a Blob from the PDF Stream
      const file = new Blob([res.data], {
        type: "application/xlsx",
      });
      //Build a URL from the file
      const fileURL = URL.createObjectURL(file);
      //Open the URL on new Window
      const link = document.createElement("a");

      link.href = fileURL;

      link.setAttribute(
        "download",
        `${weekSelect}_${moment(weekSelect, "YYYYMMDD")
          .add(6, "days")
          .format("YYYYMMDD")
          .toString()}_${name}.xlsx`
      );

      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout
      style={{
        padding: "24px 15px 15px",
        backgroundColor: isDark ? "#303030" : "inherit",
      }}
    >
      <Breadcrumb />
      <Content
        style={{
          padding: "20px 20px",
          borderRadius: "2px",
          position: "relative",
          transition: "all .3s",
          backgroundColor: isDark ? "#424242" : "#fff",
          borderColor: isDark ? "#424242" : "#fff",
          color: isDark ? "#C7C7C7" : "#000",
        }}
      >
        <Row style={{ justifyContent: "space-evenly" }}>
          <Col>
            <span style={{ margin: "5px 10px 0 0", fontSize: "17px" }}>
              {_reportWeek}
            </span>
            <DatePicker
              className={isDark ? "datestyle" : ""}
              style={{ backgroundColor: isDark ? "#666666" : "inherit" }}
              placeholder={_selectWeek}
              bordered={true}
              picker="week"
              onChange={(date) => {
                onChangeDate(date);
              }}
            />
          </Col>
          <Col>
            <Select
              className={isDark ? "selectstyle" : ""}
              dropdownClassName={isDark ? "selectdropdownstyle" : ""}
              showSearch
              style={{ width: 120 }}
              optionFilterProp="children"
              value={roleSelect ? roleSelect : _role}
              onChange={(role) => {
                onChangeRole(role);
              }}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Select.Option key="Developer" id="Developer" value="Developer">
                Developer
              </Select.Option>
              <Select.Option key="Engineer" id="Engineer" value="Engineer">
                Engineer
              </Select.Option>
              <Select.Option key="Eng & Dev" id="Eng & Dev" value="Eng & Dev">
                Eng & Dev
              </Select.Option>
            </Select>
          </Col>
          <Col>
            <Button
              size="middle"
              onClick={() => {
                if (weekSelect === "") {
                  message.error(_pleaseSelectWeek);
                } else if (roleSelect === "") {
                  message.error(_pleaseSelectRole);
                } else {
                  onDownload(name, weekSelect);
                }
              }}
              type="primary"
              style={{ margin: "0px 50px 16px 0" }}
            >
              {_downloadReport}
            </Button>
          </Col>
        </Row>
        <Row style={{ justifyContent: "center" }}>
          <Col>
            <TableContainer>
              <iframe
                title="weeklyframe"
                id="weeklyframe"
                // src="https://docs.google.com/spreadsheets/d/0B4t1BAVd8n24Z2E3TFh0eTRPZWc/edit#gid=1485113290"
                height="700"
                width="1200"
              />
            </TableContainer>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default WeeklyReview;
