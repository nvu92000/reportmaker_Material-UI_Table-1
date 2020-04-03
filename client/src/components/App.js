import React from "react";
import Home from "./pages/Home";
import MyState from "../context/table/MyState";
import DailyState from "../context/daily/DailyState";
import AuthState from "../context/auth/AuthState";
import LangState from "../context/lang/LangState";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

const App = () => {
  return (
    <AuthState>
      <LangState>
        <MyState>
          <DailyState>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <Home />
            </MuiPickersUtilsProvider>
          </DailyState>
        </MyState>
      </LangState>
    </AuthState>
  );
};

export default App;
