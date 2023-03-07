import React, { useState, useEffect, useRef } from "react";
import Component from "./Component";
import "./styles.css";

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

  return (
    <main style={{ height: "100vh", width: "100vw" }}>
      <section>
        <button onClick={addMoveable} disabled={!data.length}>
          Add Moveable1
        </button>
        <button onClick={removeMoveable} disabled={!selected}>
          Delete Moveable {selected}
        </button>
      </section>
      <div
        id="parent"
        style={{
          position: "relative",
          background: "black",
          height: "80vh",
          width: "80vw",
        }}
      >
        {moveableComponents.map((item) => (
          <Component
            {...item}
            key={item.id}
            updateMoveable={updateMoveable}
            setSelected={setSelected}
            isSelected={selected === item.id}
          />
        ))}
      </div>
    </main>
  );
};

export default App;
