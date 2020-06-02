import React, { useContext } from "react";
import MyContext from "../context/table/myContext";
import LangContext from "../context/lang/langContext";
import { DatePicker, Row, Breadcrumb, Layout, message, Col } from "antd";
import AppTable from "./AppTable";
import { SET_DATE } from "../context/types";

const AppContent = () => {
  const myContext = useContext(MyContext);
  const langContext = useContext(LangContext);

  const {
    alert: { _pleaseChangeData },
    inputDailyData: { _reportDate, _selectDate },
  } = langContext.currentLangData
    ? langContext.currentLangData
    : {
        alert: {
          _pleaseChangeData: "Please save your data or cancel changes first!",
        },
        inputDailyData: {
          _reportDate: "Report date:",
          _selectDate: "Select Date",
        },
      };

  const { dispatch, isDataEdited, selectedDate, isDark } = myContext;

  const { Content } = Layout;
  const onChange = (date) => {
    if (isDataEdited && selectedDate) {
      message.error(_pleaseChangeData);
    } else {
      dispatch({ type: SET_DATE, payload: date });
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
          color: isDark ? "#C7C7C7" : "inherit",
        }}
      >
        <Row type="flex" justify="end">
          <Col>
            <span style={{ margin: "5px 10px 0 0", fontSize: "17px" }}>
              {_reportDate}
            </span>
            <DatePicker
              className={isDark ? "datestyle" : ""}
              style={{ backgroundColor: isDark ? "#666666" : "inherit" }}
              showToday={false}
              placeholder={_selectDate}
              value={selectedDate}
              onChange={onChange}
            />
          </Col>
        </Row>

        <AppTable />
      </Content>
    </Layout>
  );
};

export default AppContent;
