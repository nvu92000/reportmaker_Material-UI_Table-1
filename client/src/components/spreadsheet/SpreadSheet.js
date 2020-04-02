import React, { Component } from "react";
import { Spreadsheet as SpreadsheetBase } from "dhx-spreadsheet";
import PropTypes from "prop-types";
import "dhx-spreadsheet/codebase/spreadsheet.min.css";

class SpreadSheet extends Component {
  componentDidMount = () => {
    this.spreadsheet = new SpreadsheetBase(this.el, {
      menu: this.props.menu,
      editLine: this.props.editLine,
      toolbar: this.props.toolbar,
      rowsCount: this.props.rowsCount,
      colsCount: this.props.colsCount,
      readonly: this.props.readonly
    });
  };

  componentWillUnmount() {
    this.spreadsheet.destructor();
  }
  render() {
    return (
      <div
        ref={el => (this.el = el)}
        className="widget-box"
        style={{ width: 1000, height: 600 }}
      ></div>
    );
  }
}

SpreadSheet.propTypes = {
  menu: PropTypes.bool,
  editLine: PropTypes.bool,
  toolbar: PropTypes.array,
  rowsCount: PropTypes.number,
  colsCount: PropTypes.number,
  readonly: PropTypes.bool
};

export default SpreadSheet;
