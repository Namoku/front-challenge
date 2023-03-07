import React, { useState, useEffect, useRef } from "react";
import Component from "./Component";

const App = () => {
  const [moveableComponents, setMoveableComponents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [data, setData] = useState([]);
  const countClick = useRef(0);

  useEffect(() => {
    const url = "https://jsonplaceholder.typicode.com/photos";
    fetch(url)
      .then((response) => response.json())
      .then((dataJson) => setData(dataJson));
  }, []);

  const addMoveable = () => {
    const SIZES = ["contain", "cover", "auto"];
    const image = {
      url: data[countClick.current].url,
      size: SIZES[Math.floor(Math.random() * SIZES.length)],
    };
    // Create a new moveable component and add it to the array
    setMoveableComponents([
      ...moveableComponents,
      {
        id: data[countClick.current].id,
        top: 0,
        left: 0,
        width: 100,
        height: 100,
        image,
        updateEnd: true,
      },
    ]);
    countClick.current = countClick.current + 1;
  };

  const removeMoveable = () => {
    const newElements = moveableComponents.filter(
      (component) => component.id !== selected
    );
    setMoveableComponents(newElements);
    setSelected(null);
  };

  const updateMoveable = (id, newComponent, updateEnd = false) => {
    const updatedMoveables = moveableComponents.map((moveable, i) => {
      if (moveable.id === id) {
        return { id, ...newComponent, updateEnd };
      }
      return moveable;
    });
    setMoveableComponents(updatedMoveables);
  };

  const handleResizeStart = (index, e) => {
    console.log("e", e.direction);
    // Check if the resize is coming from the left handle
    const [handlePosX, handlePosY] = e.direction;
    // 0 => center
    // -1 => top or left
    // 1 => bottom or right

    // -1, -1
    // -1, 0
    // -1, 1
    if (handlePosX === -1) {
      console.log("width", moveableComponents, e);
      // Save the initial left and width values of the moveable component
      const initialLeft = e.left;
      const initialWidth = e.width;

      // Set up the onResize event handler to update the left value based on the change in width
    }
  };

  return (
    <main style={{ height: "100vh", width: "100vw" }}>
      <button onClick={addMoveable}>Add Moveable1</button>
      <button onClick={removeMoveable} disabled={!selected}>
        Delete Moveable {selected}
      </button>
      <div
        id="parent"
        style={{
          position: "relative",
          background: "black",
          height: "80vh",
          width: "80vw",
        }}
      >
        {moveableComponents.map((item, index) => (
          <Component
            {...item}
            key={index}
            updateMoveable={updateMoveable}
            handleResizeStart={handleResizeStart}
            setSelected={setSelected}
            isSelected={selected === item.id}
          />
        ))}
      </div>
    </main>
  );
};

export default App;
