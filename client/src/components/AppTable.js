import React, { Fragment, useEffect, useContext } from "react";
import MyContext from "../context/table/myContext";
import AuthContext from "../context/auth/authContext";
import LangContext from "../context/lang/langContext";
// import Spinner from "./layout/Spinner";
import {
  SELECT_PJID,
  SELECT_PJNAME,
  SELECT_SUBID,
  SELECT_SUBNAME,
  RESET_PROJECTS,
  START_TIME,
  END_TIME,
  ADD_ROW,
  DELETE_ROW,
  STATUS,
  COMMENT,
  SET_SAME_AS_DATE,
  DRAG_ROW
} from "../context/types";
import {
  Button,
  Select,
  Table,
  TimePicker,
  DatePicker,
  Popconfirm,
  Input,
  InputNumber,
  AutoComplete,
  message
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import { EditableRow } from "./helpers/EditableCell.js";
import ProgressBar from "./layout/ProgressBar";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import update from "immutability-helper";

const AppTable = () => {
  const myContext = useContext(MyContext);
  const authContext = useContext(AuthContext);
  const langContext = useContext(LangContext);

  const { lang, currentLangData } = langContext;
  const {
    alert: {
      _selectProject,
      _cannotBeEmpty,
      _inputCorrectTime,
      _pleaseSelectDate,
      _saved,
      _pleaseChangeData,
      _sureToDelete
    },
    inputDailyData: {
      _addARow,
      _sameAsDate,
      _projectId,
      _projectName,
      _subId,
      _subName,
      _startTime,
      _endTime,
      _workTime,
      _status,
      _comment,
      _totalWorkTime,
      _hours,
      _saveData,
      _cancel,
      _select,
      _selectDate
    }
  } = currentLangData
    ? currentLangData
    : {
        alert: {
          _selectProject: "Please select Project and Sub-project!",
          _cannotBeEmpty: "Start time/End time CANNOT be empty!",
          _inputCorrectTime: "Please input correct Start time/End time!",
          _pleaseSelectDate: "Please select date!",
          _saved: "SUCCESSFULLY SAVED!",
          _pleaseChangeData: "Please save your data or cancel changes first!",
          _sureToDelete: "Are you sure you want to delete this item?"
        },
        inputDailyData: {
          _addARow: "Add a row",
          _sameAsDate: "Same as date:",
          _projectId: "Project ID",
          _projectName: "Project Name",
          _subId: "Sub ID",
          _subName: "Sub Name",
          _startTime: "Start Time",
          _endTime: "End Time",
          _workTime: "Work Time",
          _status: "Status (%)",
          _comment: "Comment",
          _totalWorkTime: "Total Work Time",
          _hours: "hours",
          _saveData: "Save Data",
          _cancel: "Cancel",
          _select: "Select",
          _selectDate: "Select Date"
        }
      };

  // console.log(langContext.currentLangData);

  const { user, isAuthenticated } = authContext;
  const name = user && user.name;

  const {
    selectedDate,
    sameAsDate,
    projects,
    subs,
    dataSource,
    oldCount,
    loading,
    dispatch,
    getProject,
    getDataFromDate,
    getDataFromSameAsDate,
    onSave,
    isDataEdited
  } = myContext;

  useEffect(() => {
    if (loading && isAuthenticated) {
      ProgressBar.start();
    }
    if (!loading && isAuthenticated) {
      ProgressBar.done();
    }
  }, [loading, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) getProject();

    // ComponentWillUnmount
    return () => {
      dispatch({ type: RESET_PROJECTS });
    };
    // eslint-disable-next-line
  }, [isAuthenticated]);

  useEffect(() => {
    getDataFromDate(name, selectedDate, lang);
    // eslint-disable-next-line
  }, [name, selectedDate, lang]);

  useEffect(() => {
    getDataFromSameAsDate(name, sameAsDate, lang);
    // eslint-disable-next-line
  }, [name, sameAsDate, lang]);

  const columns = [
    {
      title: _projectId,
      dataIndex: "selectedProjectId",
      key: "selectedProjectId",
      align: "center",

      render: (selectedProjectId, record, rowIndex) => {
        const mySelect = projects.map((obj, index) => {
          return (
            <Select.Option key={index} id={index} value={obj.pjid}>
              {obj.pjid}
            </Select.Option>
          );
        });
        // console.log(dataSource[rowIndex]);
        return (
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            style={{ width: "100px" }}
            value={
              dataSource[rowIndex].selectedProjectId
                ? dataSource[rowIndex].selectedProjectId
                : _select
            }
            onChange={value => {
              dispatch({
                type: SELECT_PJID,
                rowIndex,
                value,
                projects,
                lang
              });

              // console.log(dataSource[rowIndex]);
            }}
          >
            {mySelect}
          </Select>
        );
      }
    },
    {
      title: _projectName,
      dataIndex: "selectedProjectName",
      key: "selectedProjectName",
      align: "center",

      render: (selectedProjectName, record, rowIndex) => {
        const mySelect = projects.map((obj, index) => {
          return (
            <Select.Option
              key={index}
              id={index}
              value={lang === "ja" ? obj.pjname_jp : obj.pjname_en}
            >
              {lang === "ja" ? obj.pjname_jp : obj.pjname_en}
            </Select.Option>
          );
        });
        return (
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            style={lang === "ja" ? { width: "300px" } : { width: "200px" }}
            value={
              dataSource[rowIndex].selectedProjectName
                ? dataSource[rowIndex].selectedProjectName
                : _select
            }
            onChange={value => {
              dispatch({
                type: SELECT_PJNAME,
                rowIndex,
                value,
                projects,
                lang
              });

              // console.log(dataSource[rowIndex]);
            }}
          >
            {mySelect}
          </Select>
        );
      }
    },
    {
      title: _subId,
      dataIndex: "selectedSubId",
      key: "selectedSubId",
      align: "center",

      render: (selectedSubId, record, rowIndex) => {
        const mySelect = subs.map((obj, index) => {
          return (
            <Select.Option key={index} id={index} value={obj.subid}>
              {obj.subid}
            </Select.Option>
          );
        });
        return (
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            style={{ width: "85px" }}
            value={
              dataSource[rowIndex].selectedSubId
                ? dataSource[rowIndex].selectedSubId
                : _select
            }
            onChange={value => {
              dispatch({ type: SELECT_SUBID, rowIndex, value, subs, lang });

              // console.log(dataSource[rowIndex]);
            }}
          >
            {mySelect}
          </Select>
        );
      }
    },
    {
      title: _subName,
      dataIndex: "selectedSubName",
      key: "selectedSubName",
      align: "center",

      render: (selectedSubName, record, rowIndex) => {
        const mySelect = subs.map((obj, index) => {
          return (
            <Select.Option
              key={index}
              id={index}
              value={lang === "ja" ? obj.subname_jp : obj.subname_en}
            >
              {lang === "ja" ? obj.subname_jp : obj.subname_en}
            </Select.Option>
          );
        });
        return (
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            style={{ width: "200px" }}
            value={
              dataSource[rowIndex].selectedSubName
                ? dataSource[rowIndex].selectedSubName
                : _select
            }
            onChange={value => {
              dispatch({ type: SELECT_SUBNAME, rowIndex, value, subs, lang });

              // console.log(dataSource[rowIndex]);
            }}
          >
            {mySelect}
          </Select>
        );
      }
    },
    {
      title: _startTime,
      dataIndex: "startTime",
      key: "startTime",
      align: "center",
      render: (startTime, record, rowIndex) => (
        <TimePicker
          style={{ width: "85px" }}
          placeholder={_select}
          minuteStep={5}
          defaultValue={moment("00:00", "HH:mm")}
          format={"HH:mm"}
          value={dataSource[rowIndex].startTime}
          onChange={value => {
            dispatch({ type: START_TIME, rowIndex, value });
          }}
        />
      )
    },
    {
      title: _endTime,
      dataIndex: "endTime",
      key: "endTime",
      align: "center",
      render: (endTime, record, rowIndex) => (
        <TimePicker
          style={{ width: "85px" }}
          placeholder={_select}
          minuteStep={5}
          defaultValue={moment("00:00", "HH:mm")}
          format={"HH:mm"}
          value={dataSource[rowIndex].endTime}
          onChange={value => {
            dispatch({ type: END_TIME, rowIndex, value });
          }}
        />
      )
    },
    {
      title: _workTime,
      dataIndex: "workTime",
      key: "workTime",
      align: "center",
      render: (text, record, rowIndex) => (
        <Input
          style={{ width: "60px" }}
          disabled
          value={dataSource[rowIndex].workTime}
        />
      )
    },
    {
      title: _status,
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (text, record, rowIndex) => (
        <InputNumber
          style={{ width: "70px" }}
          // value={dataSource[rowIndex].status}
          min={0}
          max={100}
          value={dataSource[rowIndex].status}
          onChange={value => {
            dispatch({ type: STATUS, rowIndex, value });
          }}
        />
      )
    },
    {
      title: _comment,
      dataIndex: "comment",
      key: "comment",
      align: "center",
      render: (text, record, rowIndex) => (
        <AutoComplete
          style={{ width: "250px" }}
          options={dataSource[rowIndex].option}
          filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          value={dataSource[rowIndex].comment}
          onChange={value => {
            dispatch({ type: COMMENT, rowIndex, value: value });
          }}
        />
      )
    },
    {
      title: "",
      dataIndex: "operation",
      align: "center",
      render: (text, record, rowIndex) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title={_sureToDelete}
            onConfirm={() => onDelete(record.key)}
          >
            <a href="/">
              <DeleteOutlined />
            </a>
          </Popconfirm>
        ) : null
    }
  ];

  const components = {
    body: {
      row: EditableRow
    }
  };

  const moveRow = (dragIndex, hoverIndex) => {
    const dragRow = dataSource[dragIndex];

    dispatch({
      type: DRAG_ROW,
      payload: update(dataSource, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRow]
        ]
      })
    });
  };

  const onAdd = () => {
    dispatch({ type: ADD_ROW });
  };

  const onDelete = key => {
    dispatch({ type: DELETE_ROW, key });
  };

  // if (loading) return <Spinner />;
  const totalWorkTime =
    dataSource.length === 0
      ? 0
      : dataSource.reduce(
          (sum, item, idx) => {
            if (idx !== dataSource.length - 1) {
              sum[0] += parseInt(item.workTime.slice(0, 2));
              sum[1] += parseInt(item.workTime.slice(3, 5));
              return sum;
            } else {
              sum[0] += parseInt(item.workTime.slice(0, 2));
              sum[1] += parseInt(item.workTime.slice(3, 5));
              return sum[0] + sum[1] / 60;
            }
          },
          [0, 0]
        );

  const onClickSave = () => {
    onSave(
      oldCount,
      dataSource,
      name,
      selectedDate,
      _selectProject,
      _cannotBeEmpty,
      _inputCorrectTime,
      _pleaseSelectDate,
      _saved
    );
  };

  return (
    <Fragment>
      <Button
        size="large"
        onClick={onAdd}
        type="primary"
        style={{ margin: "0px 50px 16px 0" }}
      >
        {_addARow}
      </Button>
      <Button size="middle" style={{ margin: "0px 5px 16px 0" }}>
        {_sameAsDate}
      </Button>
      <DatePicker
        showToday={false}
        placeholder={_selectDate}
        value={sameAsDate}
        onChange={date => {
          isDataEdited
            ? message.error(_pleaseChangeData)
            : dispatch({ type: SET_SAME_AS_DATE, payload: date });
        }}
      />
      <DndProvider backend={HTML5Backend}>
        <Table
          className="table-striped-rows"
          style={{ overflowX: "auto" }}
          components={components}
          columns={columns}
          dataSource={dataSource}
          onRow={(record, index) => ({
            index,
            moveRow: moveRow
          })}
          rowKey={record => record.key}
          size="middle"
          bordered
          pagination={false}
          loading={loading ? true : false}
        />
      </DndProvider>
      <div style={{ textAlign: "center" }}>
        <Button size="large" type="dashed" style={{ margin: "2px 2px 0 0" }}>
          {_totalWorkTime}
        </Button>
        <Button size="large" type="dashed" style={{ margin: "2px 2px 0 0" }}>
          =
        </Button>
        <Button size="large" type="default" style={{ marginTop: "2px" }}>
          {totalWorkTime > 0 ? totalWorkTime.toPrecision(3) : 0}{" "}
          {lang === "en-US" && totalWorkTime <= 1 ? "hour" : _hours}
        </Button>
      </div>
      {isDataEdited && (
        <div style={{ textAlign: "center" }}>
          <Button
            size="large"
            onClick={onClickSave}
            type="primary"
            style={{ margin: "16px 10px 0 0" }}
          >
            {_saveData}
          </Button>
          <Button
            size="large"
            type="primary"
            style={{ marginTop: "16px" }}
            onClick={() => {
              selectedDate !== null
                ? getDataFromDate(name, selectedDate, lang)
                : message.error(_pleaseSelectDate);
            }}
          >
            {_cancel}
          </Button>
        </div>
      )}
    </Fragment>
  );
};

export default AppTable;
