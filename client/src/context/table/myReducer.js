import {
  GET_PROJECT,
  GET_DATA_FROM_DATE,
  GET_DATA_FROM_SAME_AS_DATE,
  SAVE_DATA,
  SELECT_PJID,
  SELECT_PJNAME,
  SELECT_SUBID,
  SELECT_SUBNAME,
  START_TIME,
  END_TIME,
  ADD_ROW,
  DELETE_ROW,
  SET_LOADING,
  SET_DATE,
  SET_SAME_AS_DATE,
  STATUS,
  COMMENT,
  CLEAR_LOGOUT,
  SELECT_PAGE,
  RESET_PROJECTS,
  QUOTES,
  DRAG_ROW,
} from "../types";
import moment from "moment";

export default (state, action) => {
  switch (action.type) {
    case DRAG_ROW:
      return {
        ...state,
        dataSource: action.payload,
        isDataEdited: true,
      };

    case QUOTES:
      return { ...state, quotes: action.payload };

    case RESET_PROJECTS:
      return {
        ...state,
        projects: [],
        subs: [],
        dataSource: [],
        sameAsDate: null,
      };

    case SELECT_PAGE:
      return {
        ...state,
        selectedKeys: [action.payload],
      };

    case GET_PROJECT:
      return {
        ...state,
        projects: state.projects.concat(action.payload),
        subs: state.subs.concat(action.payload2),
      };

    case SET_LOADING:
      return { ...state, loading: true };

    case SET_DATE:
      return { ...state, selectedDate: action.payload };

    case SET_SAME_AS_DATE:
      return { ...state, sameAsDate: action.payload };

    case GET_DATA_FROM_DATE:
      return {
        ...state,
        dataSource: action.payload,
        oldCount: action.dataLength,
        rowCount: action.dataLength,
        options: action.options,
        isDataEdited: false,
        loading: false,
        sameAsDate: null,
      };

    case GET_DATA_FROM_SAME_AS_DATE:
      return {
        ...state,
        dataSource: action.payload,
        rowCount: action.dataLength,
        options: action.options,
        isDataEdited: true,
        loading: false,
      };

    case SAVE_DATA:
      return {
        ...state,
        isDataEdited: false,
        oldCount: action.dataLength,
        loading: false,
        sameAsDate: null,
      };

    case SELECT_PJID:
      return {
        ...state,
        isDataEdited: true,
        dataSource: state.dataSource.map((obj, idx) => {
          if (idx === action.rowIndex) {
            obj.selectedProjectId = action.value;
            obj.selectedProjectName =
              action.lang === "ja"
                ? action.projects.find(
                    (element) => element.pjid === action.value
                  ).pjname_jp
                : action.projects.find(
                    (element) => element.pjid === action.value
                  ).pjname_en;
            obj.option = state.options[action.value]
              ? state.options[action.value]
              : [];
          }
          return obj;
        }),
      };

    case SELECT_PJNAME:
      return {
        ...state,
        isDataEdited: true,
        dataSource: state.dataSource.map((obj, idx) => {
          if (idx === action.rowIndex) {
            obj.selectedProjectName = action.value;
            obj.selectedProjectId =
              action.lang === "ja"
                ? action.projects.find(
                    (element) => element.pjname_jp === action.value
                  ).pjid
                : action.projects.find(
                    (element) => element.pjname_en === action.value
                  ).pjid;
            const temp = obj.selectedProjectId;
            obj.option = state.options[temp] ? state.options[temp] : [];
          }
          return obj;
        }),
      };

    case SELECT_SUBID:
      return {
        ...state,
        isDataEdited: true,
        dataSource: state.dataSource.map((obj, idx) => {
          if (idx === action.rowIndex) {
            obj.selectedSubId = action.value;
            obj.selectedSubName =
              action.lang === "ja"
                ? action.subs.find((element) => element.subid === action.value)
                    .subname_jp
                : action.subs.find((element) => element.subid === action.value)
                    .subname_en;
          }
          return obj;
        }),
      };

    case SELECT_SUBNAME:
      return {
        ...state,
        isDataEdited: true,
        dataSource: state.dataSource.map((obj, idx) => {
          if (idx === action.rowIndex) {
            obj.selectedSubName = action.value;
            obj.selectedSubId =
              action.lang === "ja"
                ? action.subs.find(
                    (element) => element.subname_jp === action.value
                  ).subid
                : action.subs.find(
                    (element) => element.subname_en === action.value
                  ).subid;
          }
          return obj;
        }),
      };

    case START_TIME:
      return {
        ...state,
        isDataEdited: true,
        dataSource: state.dataSource.map((obj, idx) => {
          if (idx === action.rowIndex) {
            obj.startTime = action.value;
            if (obj.endTime) {
              if (obj.startTime === null) {
                obj.workTime = "00:00";
              } else {
                const startHr = Number(obj.startTime.toString().slice(16, 18));
                const startMin = Number(obj.startTime.toString().slice(19, 21));
                const endHr = Number(obj.endTime.toString().slice(16, 18));
                const endMin = Number(obj.endTime.toString().slice(19, 21));

                const _d = (endHr - startHr) * 60 + endMin - startMin;
                const dHr = Math.floor(_d / 60);
                const dMin = _d % 60;

                const dHR = dHr >= 10 ? `${dHr}` : dHr < 0 ? "00" : `0${dHr}`;
                const dMIN =
                  dMin >= 10 ? `${dMin}` : dMin < 0 ? "00" : `0${dMin}`;

                obj.workTime = `${dHR}:${dMIN}`;
              }
            }
          }
          return obj;
        }),
      };

    case END_TIME:
      return {
        ...state,
        isDataEdited: true,
        dataSource: state.dataSource.map((obj, idx, arr) => {
          if (idx === action.rowIndex) {
            obj.endTime = action.value;
            if (obj.startTime) {
              if (obj.endTime === null) {
                obj.workTime = "00:00";
              } else {
                const startHr = Number(obj.startTime.toString().slice(16, 18));
                const startMin = Number(obj.startTime.toString().slice(19, 21));
                const endHr = Number(obj.endTime.toString().slice(16, 18));
                const endMin = Number(obj.endTime.toString().slice(19, 21));

                const _d = (endHr - startHr) * 60 + endMin - startMin;
                const dHr = Math.floor(_d / 60);
                const dMin = _d % 60;

                const dHR = dHr >= 10 ? `${dHr}` : dHr < 0 ? "00" : `0${dHr}`;
                const dMIN =
                  dMin >= 10 ? `${dMin}` : dMin < 0 ? "00" : `0${dMin}`;

                obj.workTime = `${dHR}:${dMIN}`;
              }
            }
            if (
              state[action.rowIndex + 1] &&
              (arr[idx + 1].startTime === null ||
                arr[idx + 1].startTime < obj.endTime)
            ) {
              arr[idx + 1].startTime = obj.endTime;
            }
          }
          return obj;
        }),
      };

    case STATUS:
      return {
        ...state,
        isDataEdited: true,
        dataSource: state.dataSource.map((obj, idx) => {
          if (idx === action.rowIndex) {
            obj.status = action.value;
          }
          return obj;
        }),
      };

    case COMMENT:
      return {
        ...state,
        isDataEdited: true,
        dataSource: state.dataSource.map((obj, idx) => {
          if (idx === action.rowIndex) {
            obj.comment = action.value;
          }
          return obj;
        }),
      };

    case ADD_ROW:
      return {
        ...state,
        dataSource: [
          ...state.dataSource,
          {
            key: state.rowCount,
            selectedProjectId: null,
            selectedProjectName: null,
            selectedSubId: null,
            selectedSubName: null,
            startTime:
              state.dataSource.length > 0
                ? state.dataSource[state.dataSource.length - 1].endTime
                : null,
            endTime:
              state.dataSource.length > 0
                ? state.dataSource[state.dataSource.length - 1].endTime
                : null,
            workTime: "00:00",
            status: "0",
            comment: "-",
            option: [],
          },
        ],
        rowCount: state.rowCount + 1,
        isDataEdited: true,
      };

    case DELETE_ROW:
      return {
        ...state,
        dataSource: state.dataSource.filter((item) => item.key !== action.key),
        isDataEdited: true,
      };

    case CLEAR_LOGOUT:
      return {
        ...state,
        selectedDate: moment(),
        sameAsDate: null,
        projects: [],
        subs: [],
        dataSource: [],
        options: {},
        option: {},
      };

    default:
      return state;
  }
};
