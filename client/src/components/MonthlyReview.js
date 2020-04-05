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
  Row,
  Col,
} from "antd";
import axios from "axios";
import moment from "moment";
import { TableContainer } from "@material-ui/core";

const MonthlyReview = (props) => {
  const myContext = useContext(MyContext);
  const authContext = useContext(AuthContext);
  const langContext = useContext(LangContext);

  const { currentLangData } = langContext;
  const {
    alert: { _pleaseSelectMonth },
    monthlyReview: { _reportMonth, _selectMonth, _downloadTimeSheet },
  } = currentLangData
    ? currentLangData
    : {
        alert: {
          _pleaseSelectMonth: "Please select a month!",
        },
        monthlyReview: {
          _reportMonth: "Report Month:",
          _selectMonth: "Select Month",
          _downloadTimeSheet: "Download Time Sheet",
        },
      };

  const { Content } = Layout;

  const { dispatch } = myContext;

  const { user } = authContext;
  const name = user && user.name;

  const [monthSelect, setMonthSelect] = useState("");

  useEffect(() => {
    dispatch({
      type: SELECT_PAGE,
      payload: "/monthlyreview",
    });
    // eslint-disable-next-line
  }, []);

  const onChangeDate = async (date) => {
    if (date !== null) {
      const monthStartDate = date
        .startOf("month")
        .format("YYYYMMDD")
        .toString();
      await axios.get(`api/timesheet/get`, {
        params: {
          name,
          monthStartDate,
        },
      });
      setMonthSelect(monthStartDate);
    }
  };

  const onDownload = async (name, monthSelect) => {
    try {
      const res = await axios.get(`api/xlsx/timesheet`, {
        responseType: "blob",
        //Force to receive data in a Blob Format
        params: {
          name,
          monthStartDate: monthSelect,
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
        `FlextimeSheetForm_${moment(monthSelect, "YYYYMM")
          .format("YYYYMM")
          .toString()}_${name}.xlsx`
      );

      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout style={{ padding: "24px 15px 15px" }}>
      <Breadcrumb />
      <Content
        style={{
          padding: "20px 20px",
          borderRadius: "2px",
          position: "relative",
          transition: "all .3s",
        }}
      >
        <Row style={{ justifyContent: "space-evenly" }}>
          <Col>
            <span style={{ margin: "5px 10px 0 0", fontSize: "17px" }}>
              {_reportMonth}
            </span>
            <DatePicker
              placeholder={_selectMonth}
              picker="month"
              bordered={true}
              onChange={(date) => {
                onChangeDate(date);
              }}
            />
          </Col>
          <Col>
            <Button
              size="middle"
              onClick={() => {
                if (monthSelect === "") {
                  message.error(_pleaseSelectMonth);
                } else {
                  onDownload(name, monthSelect);
                }
              }}
              type="primary"
              style={{ margin: "0px 50px 16px 0" }}
            >
              {_downloadTimeSheet}
            </Button>
          </Col>
        </Row>
        <Row style={{ justifyContent: "center" }}>
          <Col>
            <TableContainer>
              <iframe
                title="monthlyframe"
                id="monthlyframe"
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

export default MonthlyReview;
