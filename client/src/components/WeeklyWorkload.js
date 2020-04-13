import React, { useState, useContext, useEffect, useRef } from "react";
import MyContext from "../context/table/myContext";
import LangContext from "../context/lang/langContext";
import { SELECT_PAGE } from "../context/types";
import { Layout, Breadcrumb, DatePicker, Row, Col, Select, Empty } from "antd";
import { Paper } from "@material-ui/core";
import "antd/dist/antd.css";
import axios from "axios";
import { StackColumn } from "@antv/g2plot";
import moment from "moment";

const WeeklyWorkload = (props) => {
  const myContext = useContext(MyContext);
  const langContext = useContext(LangContext);

  const { Content } = Layout;

  const { dispatch } = myContext;

  const { currentLangData } = langContext;
  const {
    weeklyWorkload: {
      _week,
      _workload,
      _byMembers,
      _byProjects,
      _workloadByMembers,
      _workloadByProjects,
      _hours,
    },
    inputDailyData: { _noData },
  } = currentLangData
    ? currentLangData
    : {
        weeklyWorkload: {
          _week: "Week:",
          _workload: "Workload:",
          _byMembers: "By Members",
          _byProjects: "By Projects",
          _workloadByMembers: "Workload By Members",
          _workloadByProjects: "Workload By Projects",
          _hours: "Hours",
        },
        inputDailyData: {
          _noData: "No data",
        },
      };

  const [weekSelect, setWeekSelect] = useState(moment().subtract(6, "days"));
  const [dataSource, setDataSource] = useState([]);
  const [bySelect, setBySelect] = useState("By Members");
  const G1 = useRef(null);

  useEffect(() => {
    dispatch({ type: SELECT_PAGE, payload: "/weeklyworkload" });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    onChangeDate(weekSelect);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (dataSource.length !== 0) {
      const element = G1.current;

      const columnPlot = new StackColumn(element, {
        forceFit: true,
        title: {
          visible: true,
          text:
            bySelect === "By Members"
              ? _workloadByMembers
              : _workloadByProjects,
        },
        padding: "auto",
        data:
          bySelect === "By Members"
            ? dataSource
            : dataSource
                .slice()
                .sort((a, b) => Number(a.pjid) - Number(b.pjid)),
        xField: bySelect === "By Members" ? "name" : "pjid",
        yField: "worktime",
        xAxis: {
          title: false,
          autoRotateLabel: true,
        },
        yAxis: {
          title: { text: _hours },
          min: 0,
        },
        label: {
          visible: false,
        },
        stackField: bySelect === "By Members" ? "pjid" : "name",
      });

      columnPlot.render();

      return () => {
        columnPlot.destroy();
      };
    }
  }, [dataSource, bySelect, _workloadByMembers, _workloadByProjects, _hours]);

  const onChangeDate = async (date) => {
    if (date !== null) {
      const sunday = date.startOf("week").format("YYYYMMDD").toString();

      const res = await axios.get(`api/workload/get`, {
        params: {
          sunday,
        },
      });

      const res1 = res.data.data.reduce((group, itm) => {
        group[itm.name] = group[itm.name]
          ? [...group[itm.name], { pjid: itm.pjid, worktime: itm.worktime }]
          : [{ pjid: itm.pjid, worktime: itm.worktime }];
        return group;
      }, {});

      for (let i of Object.keys(res1)) {
        res1[i] = res1[i].reduce((group, itm) => {
          group[itm.pjid] = group[itm.pjid]
            ? [...group[itm.pjid], itm.worktime]
            : [itm.worktime];
          return group;
        }, {});

        for (let j of Object.keys(res1[i])) {
          res1[i][j] = res1[i][j].reduce((s, a) => s + a);
        }
      }

      const res2 = [];

      for (let i of Object.keys(res1)) {
        for (let j of Object.keys(res1[i])) {
          res2.push({ name: i, pjid: j, worktime: res1[i][j] });
        }
      }
      // console.log(res2);

      setDataSource(res2);
      setWeekSelect(date);
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
              {_week}
            </span>
            <DatePicker
              bordered={true}
              picker="week"
              value={weekSelect}
              onChange={(date) => {
                onChangeDate(date);
              }}
            />
          </Col>

          <Col>
            <span style={{ margin: "5px 10px 0 0", fontSize: "17px" }}>
              {_workload}
            </span>
            <Select
              showSearch
              style={{ width: 140 }}
              optionFilterProp="children"
              value={bySelect ? bySelect : "Select Role"}
              onChange={(value) => {
                setBySelect(value);
              }}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Select.Option
                key="By Members"
                id="By Members"
                value="By Members"
              >
                {_byMembers}
              </Select.Option>
              <Select.Option
                key="By Projects"
                id="By Projects"
                value="By Projects"
              >
                {_byProjects}
              </Select.Option>
            </Select>
          </Col>
        </Row>
        {dataSource.length !== 0 ? (
          <div ref={G1} style={{ height: "40rem" }} />
        ) : (
          <Paper elevation={3}>
            <Empty
              description={_noData}
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{
                height: 100,
              }}
              style={{ padding: "20px 0 20px 0", marginTop: "16px" }}
            />
          </Paper>
        )}
      </Content>
    </Layout>
  );
};

export default WeeklyWorkload;
