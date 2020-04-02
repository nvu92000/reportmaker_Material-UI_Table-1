import React, { useReducer } from "react";
import LangContext from "./langContext";
import LangReducer from "./langReducer";
import langData from "./langData";
import { SET_LANG } from "../types";

const LangState = props => {
  const initialState = {
    lang: window.localStorage.getItem("appUILang") || window.navigator.language
  };

  const [state, dispatch] = useReducer(LangReducer, initialState);

  const switchLang = ln => {
    dispatch({ type: SET_LANG, payload: ln });
    window.localStorage.setItem("appUILang", ln);
  };

  return (
    <LangContext.Provider
      value={{
        lang: state.lang,
        switchLang,
        currentLangData: langData[state.lang]
      }}
    >
      {props.children}
    </LangContext.Provider>
  );
};

export default LangState;
