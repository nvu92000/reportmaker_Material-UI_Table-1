import React, { useState, useContext, useEffect } from "react";
import MyContext from "../context/table/myContext";
import DailyContext from "../context/daily/dailyContext";
import AuthContext from "../context/auth/authContext";
import LangContext from "../context/lang/langContext";
import ProgressBar from "./layout/ProgressBar";
import { SELECT_PAGE, SORT } from "../context/types";
import { Layout, Breadcrumb, Table, Input, Button, Select } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";

const DailyHistory = props => {
  // console.log(props.match.path);
  const myContext = useContext(MyContext);
  const dailyContext = useContext(DailyContext);
  const authContext = useContext(AuthContext);
  const langContext = useContext(LangContext);

  const {
    dailyHistory: {
      _sortDate,
      _date,
      _projectId,
      _projectName,
      _deadline,
      _expectedDate,
      _subId,
      _subName,
      _status,
      _comment,
      _workTime,
      _startHour,
      _startMin,
      _endHour,
      _endMin
    }
  } = langContext.currentLangData
    ? langContext.currentLangData
    : {
        dailyHistory: {
          _dailyHistory: "Daily History",
          _sortDate: "Sort by date",
          _date: "Date",
          _projectId: "Project ID",
          _projectName: "Project Name",
          _deadline: "Deadline",
          _expectedDate: "Expected Date",
          _subId: "Sub ID",
          _subName: "Sub Name",
          _status: "Status (%)",
          _comment: "Comment",
          _workTime: "Work Time",
          _startHour: "Start Hour",
          _startMin: "Start Min",
          _endHour: "End Hour",
          _endMin: "End Min"
        }
      };

  const { user, isAuthenticated } = authContext;

  const [memberSelect, setMemberSelect] = useState("");

  const name = user && user.name;

  useEffect(() => {
    setMemberSelect(name);
    // eslint-disable-next-line
  }, [name]);

  const { Content } = Layout;

  const { dispatch: myDispatch } = myContext;

  const {
    dispatch: dailyDispatch,
    sort,
    loading,
    members,
    getMembers,
    getDailyData,
    dailySource
  } = dailyContext;

  useEffect(() => {
    if (loading && isAuthenticated) {
      ProgressBar.start();
    }
    if (!loading && isAuthenticated) {
      ProgressBar.done();
    }
  }, [loading, isAuthenticated]);

  useEffect(() => {
    myDispatch({ type: SELECT_PAGE, payload: "/dailyhistory" });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getDailyData(memberSelect, sort);
    // eslint-disable-next-line
  }, [memberSelect, sort]);

  useEffect(() => {
    getMembers();
    // eslint-disable-next-line
  }, []);

  const mySelect = members.map((obj, index) => {
    return (
      <Select.Option key={index} id={index} value={obj.name}>
        {obj.name}
      </Select.Option>
    );
  });

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  let searchInput;

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.select());
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      )
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText("");
  };

  const columns = [
    {
      title: _date,
      dataIndex: "Date",
      key: "Date",
      align: "center",
      ...getColumnSearchProps("Date")
    },
    {
      title: _projectId,
      dataIndex: "Project ID",
      key: "Project ID",
      align: "center",
      ...getColumnSearchProps("Project ID")
    },
    {
      title: _projectName,
      dataIndex: "Project Name",
      key: "Project Name",
      align: "center",
      ...getColumnSearchProps("Project Name")
    },
    {
      title: _deadline,
      dataIndex: "Deadline",
      key: "Deadline",
      align: "center",
      ...getColumnSearchProps("Deadline")
    },
    {
      title: _expectedDate,
      dataIndex: "Expected Date",
      key: "Expected Date",
      ...getColumnSearchProps("Expected Date")
    },
    {
      title: _subId,
      dataIndex: "SubId",
      key: "SubId",
      align: "center",
      ...getColumnSearchProps("SubId")
    },
    {
      title: _subName,
      dataIndex: "SubName",
      key: "SubName",
      align: "center",
      ...getColumnSearchProps("SubName")
    },
    {
      title: _status,
      dataIndex: "Status (%)",
      key: "Status (%)",
      align: "center",
      ...getColumnSearchProps("Status (%)")
    },
    {
      title: _comment,
      dataIndex: "Comment",
      key: "Comment",
      align: "center",
      ...getColumnSearchProps("Comment")
    },
    {
      title: _workTime,
      dataIndex: "Work Time",
      key: "Work Time",
      align: "center",
      ...getColumnSearchProps("Work Time")
    },
    {
      title: _startHour,
      dataIndex: "Start Hour",
      key: "Start Hour",
      align: "center",
      ...getColumnSearchProps("Start Hour")
    },
    {
      title: _startMin,
      dataIndex: "Start Min",
      key: "Start Min",
      align: "center",
      ...getColumnSearchProps("Start Min")
    },
    {
      title: _endHour,
      dataIndex: "End Hour",
      key: "End Hour",
      align: "center",
      ...getColumnSearchProps("End Hour")
    },
    {
      title: _endMin,
      dataIndex: "End Min",
      key: "End Min",
      align: "center",
      ...getColumnSearchProps("End Min")
    }
  ];

  return (
    <Layout style={{ padding: " 15px 15px" }}>
      <Breadcrumb />
      <Content
        style={{
          padding: "20px 50px",
          borderRadius: "2px",
          position: "relative",
          transition: "all .3s"
        }}
      >
        <Button
          type="primary"
          style={{ margin: "0px 10px 16px 0" }}
          onClick={() => {
            dailyDispatch({ type: SORT });
          }}
        >
          {_sortDate}
        </Button>
        <Select
          showSearch
          style={{ width: 120 }}
          optionFilterProp="children"
          value={memberSelect}
          onChange={member => {
            setMemberSelect(member);
          }}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {mySelect}
        </Select>
        <Table
          columns={columns}
          dataSource={dailySource}
          bordered
          className="table-striped-rows"
          style={{ overflowX: "auto" }}
          loading={loading ? true : false}
        />
      </Content>
    </Layout>
  );
};

export default DailyHistory;
