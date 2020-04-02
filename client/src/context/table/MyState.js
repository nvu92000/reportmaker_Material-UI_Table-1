import React, { useReducer } from "react";
import axios from "axios";
import MyContext from "./myContext";
import MyReducer from "./myReducer";
import {
  GET_PROJECT,
  GET_DATA_FROM_DATE,
  GET_DATA_FROM_SAME_AS_DATE,
  SAVE_DATA,
  SET_LOADING,
  CLEAR_LOGOUT
} from "../types";
import { message } from "antd";
import moment from "moment";

const MyState = props => {
  const initialState = {
    selectedDate: moment(),
    sameAsDate: null,
    projects: [],
    subs: [],
    loading: false,
    dataSource: [],
    oldCount: 0,
    rowCount: 0,
    selectedKeys: [],
    quotes: null,
    options: {},
    isDataEdited: false
  };

  const [state, dispatch] = useReducer(MyReducer, initialState);

  const getProject = async () => {
    try {
      const res1 = await axios.get("api/projects");
      const res2 = await axios.get("api/subs");

      dispatch({
        type: GET_PROJECT,
        payload: res1.data.data,
        payload2: res2.data.data
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getDataFromDate = async (name, selectedDate, lang) => {
    if (selectedDate !== null) {
      setLoading();
      const res1 = await axios.get("api/projects");
      const res2 = await axios.get("api/subs");
      const res3 = await axios.get("api/comments", {
        params: {
          name
        }
      });

      const options = res3.data.data.reduce((obj, item) => {
        obj[item.pjid] = obj[item.pjid]
          ? [...obj[item.pjid], { value: item.comment }]
          : [{ value: item.comment }];
        return obj;
      }, {});

      const projects = res1.data.data;
      const subs = res2.data.data;

      const workdate = selectedDate
        .format("YYYY-MM-DD")
        .split("-")
        .join("");

      const res = await axios.get(`api/personal`, {
        params: {
          name,
          workdate
        }
      });

      const newData = res.data.data.map((item, index) => {
        return {
          key: index,
          selectedProjectId: item.pjid,
          selectedProjectName:
            lang === "ja"
              ? projects.find(element => element.pjid === item.pjid).pjname_jp
              : projects.find(element => element.pjid === item.pjid).pjname_en,
          selectedSubId: item.subid,
          selectedSubName:
            lang === "ja"
              ? subs.find(element => element.subid === item.subid).subname_jp
              : subs.find(element => element.subid === item.subid).subname_en,
          startTime: moment(
            `"${item.starthour}:${item.startmin}:00"`,
            "HH:mm:ss"
          ),
          endTime: moment(`"${item.endhour}:${item.endmin}:00"`, "HH:mm:ss"),
          workTime: `${
            parseInt(item.worktime / 60) < 10
              ? "0" + parseInt(item.worktime / 60).toString()
              : parseInt(item.worktime / 60)
          }:${
            item.worktime % 60 < 10
              ? "0" + (item.worktime % 60).toString()
              : item.worktime % 60
          }`,
          status: item.percent,
          comment: item.comment,
          option: options[item.pjid] ? options[item.pjid] : []
        };
      });

      dispatch({
        type: GET_DATA_FROM_DATE,
        payload: newData,
        dataLength: newData.length,
        options
      });
    }
  };

  const getDataFromSameAsDate = async (name, sameAsDate, lang) => {
    if (sameAsDate !== null) {
      setLoading();
      const res1 = await axios.get("api/projects");
      const res2 = await axios.get("api/subs");
      const res3 = await axios.get("api/comments", {
        params: {
          name
        }
      });

      const options = res3.data.data.reduce((obj, item) => {
        obj[item.pjid] = obj[item.pjid]
          ? [...obj[item.pjid], { value: item.comment }]
          : [{ value: item.comment }];
        return obj;
      }, {});

      const projects = res1.data.data;
      const subs = res2.data.data;

      const workdate = sameAsDate
        .format("YYYY-MM-DD")
        .split("-")
        .join("");

      const res = await axios.get(`api/personal`, {
        params: {
          name,
          workdate
        }
      });

      const newData = res.data.data.map((item, index) => {
        return {
          key: index,
          selectedProjectId: item.pjid,
          selectedProjectName:
            lang === "ja"
              ? projects.find(element => element.pjid === item.pjid).pjname_jp
              : projects.find(element => element.pjid === item.pjid).pjname_en,
          selectedSubId: item.subid,
          selectedSubName:
            lang === "ja"
              ? subs.find(element => element.subid === item.subid).subname_jp
              : subs.find(element => element.subid === item.subid).subname_en,
          startTime: moment(
            `"${item.starthour}:${item.startmin}:00"`,
            "HH:mm:ss"
          ),
          endTime: moment(`"${item.endhour}:${item.endmin}:00"`, "HH:mm:ss"),
          workTime: `${
            parseInt(item.worktime / 60) < 10
              ? "0" + parseInt(item.worktime / 60).toString()
              : parseInt(item.worktime / 60)
          }:${
            item.worktime % 60 < 10
              ? "0" + (item.worktime % 60).toString()
              : item.worktime % 60
          }`,
          status: item.percent,
          comment: item.comment,
          option: options[item.pjid] ? options[item.pjid] : []
        };
      });

      dispatch({
        type: GET_DATA_FROM_SAME_AS_DATE,
        payload: newData,
        dataLength: newData.length,
        options
      });
    }
  };

  const onSave = async (
    oldCount,
    dataSource,
    name,
    selectedDate,
    _selectProject,
    _cannotBeEmpty,
    _inputCorrectTime,
    _pleaseSelectDate,
    _saved
  ) => {
    if (
      dataSource.some(
        obj => obj.selectedProjectId === null || obj.selectedSubId === null
      )
    ) {
      message.warning(_selectProject);
    } else if (
      dataSource.some(obj => obj.startTime === null || obj.endTime === null)
    ) {
      message.warning(_cannotBeEmpty);
    } else if (
      dataSource.some(obj => {
        const startHr = Number(obj.startTime.toString().slice(16, 18));
        const startMin = Number(obj.startTime.toString().slice(19, 21));
        const endHr = Number(obj.endTime.toString().slice(16, 18));
        const endMin = Number(obj.endTime.toString().slice(19, 21));

        return startHr * 60 + startMin - (endHr * 60 + endMin) >= 0;
      })
    ) {
      message.warning(_inputCorrectTime);
    } else if (
      dataSource.some((obj, idx, arr) => {
        if (arr[idx + 1]) {
          const startHr = Number(
            arr[idx + 1].startTime.toString().slice(16, 18)
          );
          const startMin = Number(
            arr[idx + 1].startTime.toString().slice(19, 21)
          );
          const endHr = Number(obj.endTime.toString().slice(16, 18));
          const endMin = Number(obj.endTime.toString().slice(19, 21));

          return startHr * 60 + startMin - (endHr * 60 + endMin) < 0;
        }
        return false;
      })
    ) {
      message.warning(_inputCorrectTime);
    } else {
      if (selectedDate === null) {
        message.warning(_pleaseSelectDate);
      } else if (selectedDate !== null) {
        setLoading();

        const workdate = selectedDate
          .format("YYYY-MM-DD")
          .split("-")
          .join("");

        if (oldCount === 0) {
          for (let i = 0; i < dataSource.length; i++) {
            const {
              selectedProjectId,
              selectedProjectName,
              selectedSubId,
              selectedSubName,
              comment,
              status,
              workTime,
              startTime,
              endTime
            } = dataSource[i];

            // INSERT DATA
            await axios.post(`api/projects/add`, {
              params: {
                name,
                workdate,
                count: i + 1,
                pjid: selectedProjectId,
                pjname: selectedProjectName,
                subid: selectedSubId,
                subname: selectedSubName,
                comment,
                status: status ? status : "",
                worktime:
                  parseInt(workTime.slice(0, 2)) * 60 +
                  parseInt(workTime.slice(3, 5)),
                starthour: parseInt(startTime.toString().slice(16, 18)),
                startmin: parseInt(startTime.toString().slice(19, 21)),
                endhour: parseInt(endTime.toString().slice(16, 18)),
                endmin: parseInt(endTime.toString().slice(19, 21))
              }
            });
          }
        } else if (oldCount > 0) {
          if (dataSource.length === oldCount) {
            for (let i = 0; i < dataSource.length; i++) {
              const {
                selectedProjectId,
                selectedProjectName,
                selectedSubId,
                selectedSubName,
                status,
                comment,
                workTime,
                startTime,
                endTime
              } = dataSource[i];

              // UPDATE DATA
              await axios.put(`/api/projects/update`, {
                params: {
                  name,
                  workdate,
                  count: i + 1,
                  pjid: selectedProjectId,
                  pjname: selectedProjectName,
                  subid: selectedSubId,
                  subname: selectedSubName,
                  comment,
                  status: status ? status : "",
                  worktime:
                    parseInt(workTime.slice(0, 2)) * 60 +
                    parseInt(workTime.slice(3, 5)),
                  starthour: parseInt(startTime.toString().slice(16, 18)),
                  startmin: parseInt(startTime.toString().slice(19, 21)),
                  endhour: parseInt(endTime.toString().slice(16, 18)),
                  endmin: parseInt(endTime.toString().slice(19, 21))
                }
              });
            }
          } else if (dataSource.length !== oldCount) {
            for (let i = 0; i < oldCount; i++) {
              // DELETE DATA
              await axios.delete(`/api/projects/delete`, {
                params: {
                  name,
                  workdate,
                  count: i + 1
                }
              });
            }

            for (let i = 0; i < dataSource.length; i++) {
              const {
                selectedProjectId,
                selectedProjectName,
                selectedSubId,
                selectedSubName,
                comment,
                status,
                workTime,
                startTime,
                endTime
              } = dataSource[i];

              // INSERT DATA
              await axios.post(`api/projects/add`, {
                params: {
                  name,
                  workdate,
                  count: i + 1,
                  pjid: selectedProjectId,
                  pjname: selectedProjectName,
                  subid: selectedSubId,
                  subname: selectedSubName,
                  comment,
                  status: status ? status : "",
                  worktime:
                    parseInt(workTime.slice(0, 2)) * 60 +
                    parseInt(workTime.slice(3, 5)),
                  starthour: parseInt(startTime.toString().slice(16, 18)),
                  startmin: parseInt(startTime.toString().slice(19, 21)),
                  endhour: parseInt(endTime.toString().slice(16, 18)),
                  endmin: parseInt(endTime.toString().slice(19, 21))
                }
              });
            }
          }
        }
        dispatch({
          type: SAVE_DATA,
          dataLength: dataSource.length
        });
        message.success(_saved);
      }
    }
  };

  const setLoading = () => dispatch({ type: SET_LOADING });

  const clearLogout = () => {
    dispatch({ type: CLEAR_LOGOUT });
  };

  return (
    <MyContext.Provider
      value={{
        selectedDate: state.selectedDate,
        sameAsDate: state.sameAsDate,
        projects: state.projects,
        subs: state.subs,
        dataSource: state.dataSource,
        oldCount: state.oldCount,
        rowCount: state.rowCount,
        loading: state.loading,
        selectedKeys: state.selectedKeys,
        quotes: state.quotes,
        options: state.options,
        isDataEdited: state.isDataEdited,
        dispatch,
        getProject,
        getDataFromDate,
        getDataFromSameAsDate,
        clearLogout,
        onSave
      }}
    >
      {props.children}
    </MyContext.Provider>
  );
};

export default MyState;
