import React from "react";
import TableCell from "@material-ui/core/TableCell";

class DraggableCell extends React.Component {
  constructor() {
    super();

    this.setRef = this.setRef.bind(this);
  }

  getSnapshotBeforeUpdate(prevProps) {
    if (!this.ref) {
      return null;
    }

    const isDragStarting =
      this.props.isDragOccurring && !prevProps.isDragOccurring;

    if (!isDragStarting) {
      return null;
    }

    const { width, height } = this.ref.getBoundingClientRect();

    const snapshot = {
      width,
      height,
    };

    return snapshot;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const ref = this.ref;

    if (!ref) {
      return;
    }

    if (snapshot) {
      if (ref.style.width === snapshot.width) {
        return;
      }
      ref.style.width = `${snapshot.width}px`;
      ref.style.maxWidth = `${snapshot.width}px`;
      ref.style.height = `${snapshot.height}px`;
      return;
    }

    if (this.props.isDragOccurring) {
      return;
    }

    // inline styles not applied
    if (ref.style.width == null) {
      return;
    }

    // no snapshot and drag is finished - clear the inline styles
    ref.style.removeProperty("height");
    ref.style.removeProperty("width");
    ref.style.removeProperty("maxWidth");
  }

  setRef(ref) {
    this.ref = ref;
  }

  render() {
    return (
      <TableCell
        ref={this.setRef}
        align="center"
        className={this.props.isDark ? "cellstyle" : "none"}
      >
        {this.props.children}
      </TableCell>
    );
  }
}

export { DraggableCell };
