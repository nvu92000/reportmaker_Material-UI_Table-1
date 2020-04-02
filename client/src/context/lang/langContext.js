import { createContext } from "react";

const langContext = createContext({
  lang: "",
  currentLangData: {},
  switchLang: () => {}
});

export default langContext;
