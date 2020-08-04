import React, { useState, useContext, useEffect, useRef } from "react";
import MyContext from "../context/table/myContext";
// import LangContext from "../context/lang/langContext";
import { SELECT_PAGE, SET_COLLAPSED } from "../context/types";
import { Layout, Breadcrumb } from "antd";
import "antd/dist/antd.css";
import BarChart from "./charts/BarChart ";
import DoughnutChart from "./charts/DoughnutChart";
import LineChart from "./charts/LineChart";

function getRandomDateArray(numItems) {
  // Create random array of objects (with date)
  let data = [];
  let baseTime = new Date("2018-05-01T00:00:00").getTime();
  let dayMs = 24 * 60 * 60 * 1000;
  for (var i = 0; i < numItems; i++) {
    data.push({
      time: new Date(baseTime + i * dayMs),
      value: Math.round(20 + 80 * Math.random()),
    });
  }
  return data;
}

function getRandomArray(numItems) {
  // Create random array of objects
  let names = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let data = [];
  for (var i = 0; i < numItems; i++) {
    data.push({
      label: names[i],
      value: Math.round(20 + 80 * Math.random()),
    });
  }
  return data;
}

function getFeeds() {
  let feeds = [];

  feeds.push({
    title: "Visits",
    data: getRandomDateArray(150),
  });

  feeds.push({
    title: "Categories",
    data: getRandomArray(20),
  });

  feeds.push({
    title: "Categories",
    data: getRandomArray(10),
  });

  feeds.push({
    title: "Data 4",
    data: getRandomArray(6),
  });

  return feeds;
}

const Dashboard = (props) => {
  const myContext = useContext(MyContext);
  // const langContext = useContext(LangContext);

  const [feeds, setFeeds] = useState(getFeeds());

  const { Content } = Layout;

  const { dispatch, isDark } = myContext;

  // const { currentLangData } = langContext;

  useEffect(() => {
    dispatch({ type: SELECT_PAGE, payload: "/dashboard" });
    // eslint-disable-next-line
  }, []);

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
          // backgroundColor: isDark ? "#b9b9b9" : "#fff",
          // borderColor: isDark ? "#b9b9b9" : "#fff",
          // color: "#000",
          display: "grid",
          gridTemplateColumns: "30% 30% 30%",
          gridColumnGap: "4em",
          gridRowGap: "4em",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ height: 400 }}>
          <LineChart
            data={feeds[0].data}
            title={feeds[0].title}
            color="#3E517A"
          />
        </div>
        <div style={{ height: 400 }}>
          <BarChart
            data={feeds[1].data}
            title={feeds[1].title}
            color="#70CAD1"
          />
        </div>
        <div style={{ height: 400 }}>
          <BarChart
            data={feeds[2].data}
            title={feeds[2].title}
            color="#70CAD1"
          />
        </div>
        <div style={{ height: 400 }}>
          <DoughnutChart
            data={feeds[3].data}
            title={feeds[3].title}
            colors={[
              "#a8e0ff",
              "#8ee3f5",
              "#70cad1",
              "#3e517a",
              "#b08ea2",
              "#BBB6DF",
            ]}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default Dashboard;
