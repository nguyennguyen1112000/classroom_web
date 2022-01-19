import axios from "axios";
import React, { useState, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useDispatch } from "react-redux";
import { userLogout } from "../../actions/auth";
import { authHeader, logOut } from "../../helper/utils";
export const ItemTypes = {
  CARD: "card",
};
function PointStructureItem({
  id,
  title,
  point,
  index,
  order,
  moveCard,
  isEdit,
  isNew,
  classroomId,
  updateCards,
  removeCard,
}) {
  const API_URL = process.env.REACT_APP_API_URL;
  const ref = useRef(null);
  const [editMode, setEditMode] = useState(isEdit | false);
  const [input, setInput] = useState({ title, point });
  const dispatch = useDispatch();
  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveCard(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  const renderCard = () => {
    if (!editMode)
      return (
        <div className="section-item-title">
          <i className="fas fa-stream mr-2" />
          <span className="section-item-title-text"> {title}</span>
          <br />
          <i className="uil uil-book-open"></i>
          <span className="section-item-title-text"> {point}</span>
        </div>
      );
    return (
      <div className="section-item-title">
        <i className="fas fa-stream mr-2" />

        <input
          className="prompt srch_explore"
          type="text"
          name="title"
          defaultValue={input.title}
          id="id[title]"
          placeholder="Tên thành phần điểm"
          onChange={handleChange}
        />
        <br />
        <i className="uil uil-book-open"></i>
        <input
          className="prompt srch_explore"
          type="number"
          name="point"
          defaultValue={input.point}
          id="id[point]"
          placeholder="Điểm"
          onChange={handleChange}
        />
      </div>
    );
  };
  const renderButtons = () => {
    if (!editMode)
      return (
        <>
          <button
            type="button"
            className="section-item-tools"
            onClick={handleClick}
          >
            <i className="fas fa-edit" />
          </button>
          <button
            type="button"
            className="section-item-tools"
            onClick={handleDelete}
          >
            <i className="fas fa-trash-alt" />
          </button>
        </>
      );
    return (
      <>
        <button
          type="button"
          className="section-item-tools"
          onClick={handleSave}
        >
          <i className="uil uil-check"></i>
        </button>
        {isNew && (
          <button
            type="button"
            className="section-item-tools"
            onClick={handleDelete}
          >
            <i className="fas fa-trash-alt" />
          </button>
        )}
      </>
    );
  };
  const handleChange = (event) => {
    if (event.target.name === "title") {
      setInput({
        ...input,
        title: event.target.value,
      });
    } else {
      setInput({
        ...input,
        point: event.target.value,
      });
    }
  };
  function handleClick() {
    setEditMode(!editMode);
  }
  function handleSave() {
    if (!input.title) {
      alert("Tên cột điểm không được để trống");
      return;
    }

    if (!input.point) {
      alert("Điểm không được để trống");
      return;
    }
    setEditMode(false);
    if (isNew) {
      axios
        .post(
          `${API_URL}/point-structure`,
          { ...input, classroomId: classroomId, order },
          authHeader()
        )
        .then((res) => {
          const newCard = { title: res.data.title, point: res.data.point };
          setInput(newCard);
          updateCards(id, res.data);
        })
        .catch((err) => {
          if (err.response.status === 401) {
            const logoutAction = userLogout();
            logOut();
            dispatch(logoutAction);
          }
          console.log("Error", err);
        });
      return;
    }
    axios
      .patch(`${API_URL}/point-structure/${id}`, input, authHeader())
      .then((res) => {
        const newCard = { title: res.data.title, point: res.data.point };
        setInput(newCard);
        updateCards(id, res.data);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          const logoutAction = userLogout();
          logOut();
          dispatch(logoutAction);
        }
        console.log("Error", err);
      });
  }
  function handleDelete() {
    if (isNew) {
      removeCard(id);
      return;
    }
    axios
      .delete(`${API_URL}/point-structure/${id}`, authHeader())
      .then((res) => {
        removeCard(id);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          const logoutAction = userLogout();
          logOut();
          dispatch(logoutAction);
        }
        console.log("Error", err);
      });
  }
  return (
    <div
      className="section-list-item"
      ref={ref}
      style={{ opacity }}
      data-handler-id={handlerId}
    >
      {renderCard()}

      {renderButtons()}
      <button type="button" className="section-item-tools ml-auto">
        <i className="fas fa-bars" />
      </button>
    </div>
  );
}

export default PointStructureItem;
