import React from "react";
import Home from "./pages/Home";
import MyState from "../context/table/MyState";
import DailyState from "../context/daily/DailyState";
import AuthState from "../context/auth/AuthState";
import LangState from "../context/lang/LangState";

const App = () => {
  return (
    <AuthState>
      <LangState>
        <MyState>
          <DailyState>
            <Home />
          </DailyState>
        </MyState>
      </LangState>
    </AuthState>
  );
};

export default App;
