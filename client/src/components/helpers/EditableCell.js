import React from "react";
import "antd/dist/antd.css";
import { Form } from "antd";
import { useDrag, useDrop } from "react-dnd";

const type = "DraggableBodyRow";

const EditableContext = React.createContext();

const EditableRow = ({ index, moveRow, className, style, ...restProps }) => {
  const [form] = Form.useForm();
  const ref = React.useRef();
  const [{ isOver }, drop] = useDrop({
    accept: type,
    collect: monitor => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver()
      };
    },
    drop: item => {
      moveRow(item.index, index);
    }
  });
  const [{ isDragging }, drag] = useDrag({
    item: { type, index },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });
  drop(drag(ref));

  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr
          ref={ref}
          style={{
            cursor: "grab",
            opacity: isDragging ? "0" : isOver ? "0.5" : "1",
            ...style
          }}
          {...restProps}
        />
      </EditableContext.Provider>
    </Form>
  );
};

export { EditableRow };
