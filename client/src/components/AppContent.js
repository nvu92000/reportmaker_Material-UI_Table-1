import React, { useContext } from "react";
import MyContext from "../context/table/myContext";
import LangContext from "../context/lang/langContext";
import { DatePicker, Row, Breadcrumb, Layout, message } from "antd";
import AppTable from "./AppTable";
import { SET_DATE } from "../context/types";

const AppContent = () => {
  const myContext = useContext(MyContext);
  const langContext = useContext(LangContext);

  const {
    alert: { _pleaseChangeData },
    inputDailyData: { _reportDate, _selectDate }
  } = langContext.currentLangData
    ? langContext.currentLangData
    : {
        alert: {
          _pleaseChangeData: "Please save your data or cancel changes first!"
        },
        inputDailyData: {
          _reportDate: "Report date:",
          _selectDate: "Select Date"
        }
      };

  const { dispatch, isDataEdited, selectedDate } = myContext;

  const { Content } = Layout;
  const onChange = date => {
    if (isDataEdited && selectedDate) {
      message.error(_pleaseChangeData);
    } else {
      dispatch({ type: SET_DATE, payload: date });
    }
  };

  return (
    <Layout style={{ padding: "15px 15px" }}>
      <Breadcrumb />
      <Content
        style={{
          padding: "20px 20px",
          borderRadius: "2px",
          position: "relative",
          transition: "all .3s"
        }}
      >
        <Row type="flex" justify="end">
          <span style={{ margin: "5px 5px 0 0" }}>{_reportDate}</span>
          <DatePicker
            showToday={false}
            placeholder={_selectDate}
            value={selectedDate}
            onChange={onChange}
          />
        </Row>

        <AppTable />
      </Content>
    </Layout>
  );
};

export default AppContent;
