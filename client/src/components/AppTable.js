import React, { Fragment, useEffect, useContext } from "react";
import MyContext from "../context/table/myContext";
import AuthContext from "../context/auth/authContext";
import LangContext from "../context/lang/langContext";
import {
  SELECT_PJID,
  SELECT_PJNAME,
  SELECT_SUBID,
  SELECT_SUBNAME,
  START_TIME,
  END_TIME,
  ADD_ROW,
  DELETE_ROW,
  STATUS,
  COMMENT,
  SET_SAME_AS_DATE,
  DRAG_ROW,
} from "../context/types";
import {
  Button,
  Select,
  DatePicker,
  Popconfirm,
  Input,
  InputNumber,
  AutoComplete,
  message,
  Row,
  Col,
  Empty,
} from "antd";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Fab,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import { KeyboardTimePicker } from "@material-ui/pickers";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import LoadingOverlay from "react-loading-overlay";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { DraggableCell } from "./helpers/DraggableCell.js";

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
      _sureToDelete,
      _exceed256Chars,
    },
    inputDailyData: {
      _addARow,
      _drag,
      _delete,
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
      _selectDate,
      _noData,
    },
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
          _sureToDelete: "Are you sure you want to delete this row?",
          _exceed256Chars: "Each comment must not exceed 256 characters!",
        },
        inputDailyData: {
          _addARow: "Add a row",
          _drag: "Drag",
          _delete: "Delete",
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
          _selectDate: "Select Date",
          _noData: "No data",
        },
      };

  const { user } = authContext;
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
    getDataFromDate,
    getDataFromSameAsDate,
    onSave,
    isDataEdited,
  } = myContext;

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

  const onDelete = (key) => {
    dispatch({ type: DELETE_ROW, key });
  };

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
      _saved,
      _exceed256Chars
    );
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const items = reorder(
      dataSource,
      result.source.index,
      result.destination.index
    );

    dispatch({
      type: DRAG_ROW,
      payload: items,
    });
  };

  return (
    <Fragment>
      <Row style={{ marginTop: "8px" }}>
        <Col>
          <Tooltip title={_addARow} aria-label="add">
            <Fab
              size="medium"
              color="primary"
              aria-label="add"
              onClick={onAdd}
              style={{ margin: "-8px 30px 20px 20px" }}
            >
              <AddIcon />
            </Fab>
          </Tooltip>
        </Col>
        <Col>
          <span style={{ margin: "5px 10px 0 0", fontSize: "17px" }}>
            {_sameAsDate}
          </span>
          <DatePicker
            showToday={false}
            placeholder={_selectDate}
            value={sameAsDate}
            onChange={(date) => {
              isDataEdited
                ? message.error(_pleaseChangeData)
                : dispatch({ type: SET_SAME_AS_DATE, payload: date });
            }}
          />
        </Col>
      </Row>
      <LoadingOverlay
        active={loading}
        spinner
        styles={{
          overlay: (base) => ({
            ...base,
            background: "rgba(24, 144, 255, 0.5)",
          }),
        }}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Paper elevation={3}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell />
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
                      <TableBody ref={provided.innerRef}>
                        {dataSource.map((row, rowIndex) => (
                          <Draggable
                            key={row.key}
                            draggableId={row.key.toString()}
                            index={rowIndex}
                          >
                            {(provided, snapshot) => {
                              return (
                                <TableRow
                                  hover={
                                    droppableSnapshot.isDraggingOver
                                      ? false
                                      : true
                                  }
                                  key={rowIndex}
                                  className={
                                    snapshot.isDragging
                                      ? "draggable-row-dragging"
                                      : "draggable-row"
                                  }
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                >
                                  <DraggableCell
                                    isDragOccurring={snapshot.isDragging}
                                  >
                                    <Tooltip title={_drag}>
                                      <IconButton
                                        id={row.key}
                                        {...provided.dragHandleProps}
                                        aria-label="drag"
                                        style={{
                                          padding: "0 0 0 5px",
                                        }}
                                      >
                                        <DragIndicatorIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </DraggableCell>
                                  <DraggableCell
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
                                      onChange={(value) => {
                                        dispatch({
                                          type: SELECT_PJID,
                                          rowIndex,
                                          value,
                                          projects,
                                          lang,
                                        });
                                      }}
                                    >
                                      {pjidSelect}
                                    </Select>
                                  </DraggableCell>
                                  <DraggableCell
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
                                          ? { minWidth: "300px" }
                                          : { minWidth: "200px" }
                                      }
                                      value={
                                        row.selectedProjectName
                                          ? row.selectedProjectName
                                          : _select
                                      }
                                      onChange={(value) => {
                                        dispatch({
                                          type: SELECT_PJNAME,
                                          rowIndex,
                                          value,
                                          projects,
                                          lang,
                                        });
                                      }}
                                    >
                                      {pjnameSelect}
                                    </Select>
                                  </DraggableCell>
                                  <DraggableCell
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
                                      onChange={(value) => {
                                        dispatch({
                                          type: SELECT_SUBID,
                                          rowIndex,
                                          value,
                                          subs,
                                          lang,
                                        });
                                      }}
                                    >
                                      {subidSelect}
                                    </Select>
                                  </DraggableCell>
                                  <DraggableCell
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
                                      onChange={(value) => {
                                        dispatch({
                                          type: SELECT_SUBNAME,
                                          rowIndex,
                                          value,
                                          subs,
                                          lang,
                                        });
                                      }}
                                    >
                                      {subnameSelect}
                                    </Select>
                                  </DraggableCell>
                                  <DraggableCell
                                    isDragOccurring={snapshot.isDragging}
                                  >
                                    <KeyboardTimePicker
                                      ampm={false}
                                      style={{ width: "96px" }}
                                      showTodayButton
                                      todayLabel="now"
                                      value={row.startTime}
                                      onChange={(value) => {
                                        dispatch({
                                          type: START_TIME,
                                          rowIndex,
                                          value,
                                        });
                                      }}
                                      KeyboardButtonProps={{
                                        "aria-label": "change time",
                                      }}
                                    />
                                  </DraggableCell>
                                  <DraggableCell
                                    isDragOccurring={snapshot.isDragging}
                                  >
                                    <KeyboardTimePicker
                                      ampm={false}
                                      style={{ width: "96px" }}
                                      showTodayButton
                                      todayLabel="now"
                                      value={row.endTime}
                                      onChange={(value) => {
                                        dispatch({
                                          type: END_TIME,
                                          rowIndex,
                                          value,
                                        });
                                      }}
                                      KeyboardButtonProps={{
                                        "aria-label": "change time",
                                      }}
                                    />
                                  </DraggableCell>
                                  <DraggableCell
                                    isDragOccurring={snapshot.isDragging}
                                  >
                                    <Button
                                      className="noHover"
                                      size="middle"
                                      type="default"
                                    >
                                      {row.workTime}
                                    </Button>
                                  </DraggableCell>
                                  <DraggableCell
                                    isDragOccurring={snapshot.isDragging}
                                  >
                                    <InputNumber
                                      style={{ width: "60px" }}
                                      min={0}
                                      max={100}
                                      value={row.status}
                                      onChange={(value) => {
                                        dispatch({
                                          type: STATUS,
                                          rowIndex,
                                          value,
                                        });
                                      }}
                                    />
                                  </DraggableCell>
                                  <DraggableCell
                                    isDragOccurring={snapshot.isDragging}
                                  >
                                    <AutoComplete
                                      style={
                                        lang === "ja"
                                          ? { width: "220px" }
                                          : { width: "220px" }
                                      }
                                      options={row.option}
                                      filterOption={(inputValue, option) =>
                                        option.value
                                          .toUpperCase()
                                          .indexOf(inputValue.toUpperCase()) !==
                                        -1
                                      }
                                      value={row.comment}
                                      onChange={(value) => {
                                        dispatch({
                                          type: COMMENT,
                                          rowIndex,
                                          value,
                                        });
                                      }}
                                    >
                                      <Input.TextArea
                                        style={{ height: 30 }}
                                        autoSize={{ minRows: 1, maxRows: 3 }}
                                        onResize={(w, h) => {
                                          console.log(w, h);
                                        }}
                                      />
                                    </AutoComplete>
                                  </DraggableCell>
                                  <DraggableCell
                                    isDragOccurring={snapshot.isDragging}
                                  >
                                    {dataSource.length >= 1 && (
                                      <Popconfirm
                                        title={_sureToDelete}
                                        onConfirm={() => {
                                          // console.log(row, row.key, rowIndex);
                                          onDelete(row.key);
                                        }}
                                        okText="OK"
                                        cancelText={_cancel}
                                      >
                                        <Tooltip title={_delete}>
                                          <IconButton
                                            aria-label="delete"
                                            style={{ padding: "0 5px 0 0" }}
                                          >
                                            <DeleteIcon
                                              style={{ width: "20px" }}
                                            />
                                          </IconButton>
                                        </Tooltip>
                                      </Popconfirm>
                                    )}
                                  </DraggableCell>
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
            </TableContainer>
          </Paper>
        </DragDropContext>
        {dataSource.length === 0 && (
          <Paper elevation={3}>
            <Empty
              description={_noData}
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{
                height: 100,
              }}
              style={{ padding: "20px 0 20px 0" }}
            />
          </Paper>
        )}
      </LoadingOverlay>
      {dataSource.length > 0 && (
        <div style={{ textAlign: "center", marginTop: "5px" }}>
          <Button
            className="noHover"
            size="large"
            type="default"
            style={{ margin: "2px 2px 0 0" }}
          >
            {_totalWorkTime}:
          </Button>
          <Button
            className="noHover"
            size="large"
            type="default"
            style={{ marginTop: "2px" }}
          >
            {totalWorkTime > 0 ? totalWorkTime.toPrecision(3) : 0}{" "}
            {lang === "en-US" && totalWorkTime <= 1 ? "hour" : _hours}
          </Button>
        </div>
      )}
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
