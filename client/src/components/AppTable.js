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
  TimePicker,
  DatePicker,
  Popconfirm,
  Input,
  InputNumber,
  AutoComplete,
  message
} from "antd";
import { DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import moment from "moment";
import ProgressBar from "./layout/ProgressBar";
import update from "immutability-helper";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import LoadingOverlay from "react-loading-overlay";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
});

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9)
];

const AppTable = () => {
  const classes = useStyles();

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

  const pjidSelect = projects.map((obj, index) => {
    return (
      <Select.Option key={index} id={index} value={obj.pjid}>
        {obj.pjid}
      </Select.Option>
    );
  });

  const pjnameSelect = projects.map((obj, index) => {
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

  const subidSelect = subs.map((obj, index) => {
    return (
      <Select.Option key={index} id={index} value={obj.subid}>
        {obj.subid}
      </Select.Option>
    );
  });

  const subnameSelect = subs.map((obj, index) => {
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

  const onDragEnd = () => {};

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
      <LoadingOverlay
        active={loading}
        spinner
        styles={{
          overlay: base => ({
            ...base,
            background: "rgba(24, 144, 255, 0.5)"
          })
        }}
      >
        <TableContainer>
          <DragDropContext onDragEnd={onDragEnd}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell isMinimum />
                  <TableCell align="center">{_projectId}</TableCell>
                  <TableCell align="center">{_projectName}</TableCell>
                  <TableCell align="center">{_subId}</TableCell>
                  <TableCell align="center">{_subName}</TableCell>
                  <TableCell align="center">{_startTime}</TableCell>
                  <TableCell align="center">{_endTime}</TableCell>
                  <TableCell align="center">{_workTime}</TableCell>
                  <TableCell align="center">{_status}</TableCell>
                  <TableCell align="center">{_comment}</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <Droppable droppableId="droppable">
                {(provided, droppableSnapshot) => {
                  return (
                    <TableBody
                      ref={provided.innerRef}
                      isDraggingOver={droppableSnapshot.isDraggingOver}
                    >
                      {dataSource.map((row, rowIndex) => (
                        <Draggable
                          key={row.key}
                          draggableId={row.key.toString()}
                          index={rowIndex}
                        >
                          {(provided, snapshot) => {
                            return (
                              <TableRow
                                key={rowIndex}
                                ref={provided.innerRef}
                                isDragging={snapshot.isDragging}
                                isDraggingOver={
                                  droppableSnapshot.isDraggingOver
                                }
                                isHovered={snapshot.isDragging}
                                isFocused={
                                  droppableSnapshot.isDraggingOver
                                    ? snapshot.isDragging
                                    : undefined
                                }
                                {...provided.draggableProps.style}
                                {...provided.draggableProps}
                              >
                                <TableCell
                                  align="center"
                                  isMinimum
                                  isDragOccurring={snapshot.isDragging}
                                >
                                  <div
                                    id={row.key}
                                    {...provided.dragHandleProps}
                                  >
                                    {/* <GripIcon /> */}
                                    <MoreOutlined />
                                  </div>
                                </TableCell>
                                <TableCell
                                  align="center"
                                  isDragOccurring={snapshot.isDragging}
                                >
                                  <Select
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                      option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                    }
                                    style={{ width: "100px" }}
                                    value={
                                      row.selectedProjectId
                                        ? row.selectedProjectId
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
                                    }}
                                  >
                                    {pjidSelect}
                                  </Select>
                                </TableCell>
                                <TableCell
                                  align="center"
                                  isDragOccurring={snapshot.isDragging}
                                >
                                  <Select
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                      option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                    }
                                    style={
                                      lang === "ja"
                                        ? { width: "300px" }
                                        : { width: "200px" }
                                    }
                                    value={
                                      row.selectedProjectName
                                        ? row.selectedProjectName
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
                                    }}
                                  >
                                    {pjnameSelect}
                                  </Select>
                                </TableCell>
                                <TableCell
                                  align="center"
                                  isDragOccurring={snapshot.isDragging}
                                >
                                  <Select
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                      option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                    }
                                    style={{ width: "70px" }}
                                    value={
                                      row.selectedSubId
                                        ? row.selectedSubId
                                        : _select
                                    }
                                    onChange={value => {
                                      dispatch({
                                        type: SELECT_SUBID,
                                        rowIndex,
                                        value,
                                        subs,
                                        lang
                                      });
                                    }}
                                  >
                                    {subidSelect}
                                  </Select>
                                </TableCell>
                                <TableCell
                                  align="center"
                                  isDragOccurring={snapshot.isDragging}
                                >
                                  <Select
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                      option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                    }
                                    style={{ width: "200px" }}
                                    value={
                                      row.selectedSubName
                                        ? row.selectedSubName
                                        : _select
                                    }
                                    onChange={value => {
                                      dispatch({
                                        type: SELECT_SUBNAME,
                                        rowIndex,
                                        value,
                                        subs,
                                        lang
                                      });
                                    }}
                                  >
                                    {subnameSelect}
                                  </Select>
                                </TableCell>
                                <TableCell
                                  align="center"
                                  isDragOccurring={snapshot.isDragging}
                                >
                                  <TimePicker
                                    style={{ width: "80px" }}
                                    placeholder={_select}
                                    minuteStep={5}
                                    defaultValue={moment("00:00", "HH:mm")}
                                    format={"HH:mm"}
                                    value={row.startTime}
                                    onChange={value => {
                                      dispatch({
                                        type: START_TIME,
                                        rowIndex,
                                        value
                                      });
                                    }}
                                  />
                                </TableCell>
                                <TableCell
                                  align="center"
                                  isDragOccurring={snapshot.isDragging}
                                >
                                  <TimePicker
                                    style={{ width: "80px" }}
                                    placeholder={_select}
                                    minuteStep={5}
                                    defaultValue={moment("00:00", "HH:mm")}
                                    format={"HH:mm"}
                                    value={row.endTime}
                                    onChange={value => {
                                      dispatch({
                                        type: END_TIME,
                                        rowIndex,
                                        value
                                      });
                                    }}
                                  />
                                </TableCell>
                                <TableCell
                                  align="center"
                                  isDragOccurring={snapshot.isDragging}
                                >
                                  <Input
                                    style={{ width: "60px" }}
                                    disabled
                                    value={row.workTime}
                                  />
                                </TableCell>
                                <TableCell
                                  align="center"
                                  isDragOccurring={snapshot.isDragging}
                                >
                                  <InputNumber
                                    style={{ width: "60px" }}
                                    min={0}
                                    max={100}
                                    value={row.status}
                                    onChange={value => {
                                      dispatch({
                                        type: STATUS,
                                        rowIndex,
                                        value
                                      });
                                    }}
                                  />
                                </TableCell>
                                <TableCell
                                  align="center"
                                  isDragOccurring={snapshot.isDragging}
                                >
                                  <AutoComplete
                                    style={{ width: "250px" }}
                                    options={row.option}
                                    filterOption={(inputValue, option) =>
                                      option.value
                                        .toUpperCase()
                                        .indexOf(inputValue.toUpperCase()) !==
                                      -1
                                    }
                                    value={row.comment}
                                    onChange={value => {
                                      dispatch({
                                        type: COMMENT,
                                        rowIndex,
                                        value: value
                                      });
                                    }}
                                  />
                                </TableCell>
                                <TableCell
                                  align="center"
                                  isDragOccurring={snapshot.isDragging}
                                >
                                  {dataSource.length >= 1 && (
                                    <Popconfirm
                                      title={_sureToDelete}
                                      onConfirm={() => {
                                        console.log(row, row.key, rowIndex);
                                        onDelete(row.key);
                                      }}
                                    >
                                      <a href="/">
                                        <DeleteOutlined />
                                      </a>
                                    </Popconfirm>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          }}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </TableBody>
                  );
                }}
              </Droppable>
            </Table>
          </DragDropContext>
        </TableContainer>
      </LoadingOverlay>
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
