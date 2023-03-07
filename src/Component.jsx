import { useRef, useState } from "react";
import Moveable from "react-moveable";

const Component = ({
  updateMoveable,
  top,
  left,
  width,
  height,
  index,
  image,
  id,
  setSelected,
  isSelected = false,
  updateEnd,
}) => {
  const ref = useRef();

  const [nodoReferencia, setNodoReferencia] = useState({
    top,
    left,
    width,
    height,
    index,
    image,
    id,
  });

  let parent = document.getElementById("parent");
  let parentBounds = parent?.getBoundingClientRect();

  const onResize = async (e) => {
    // ACTUALIZAR ALTO Y ANCHO
    let newWidth = e.width;
    let newHeight = e.height;

    updateMoveable(id, {
      top,
      left,
      width: newWidth,
      height: newHeight,
      image,
    });

    // ACTUALIZAR NODO REFERENCIA
    const beforeTranslate = e.drag.beforeTranslate;

    ref.current.style.width = `${e.width}px`;
    ref.current.style.height = `${e.height}px`;

    let translateX = beforeTranslate[0];
    let translateY = beforeTranslate[1];

    ref.current.style.transform = `translate(${translateX}px, ${translateY}px)`;

    setNodoReferencia({
      ...nodoReferencia,
      translateX,
      translateY,
      top: top + translateY < 0 ? 0 : top + translateY,
      left: left + translateX < 0 ? 0 : left + translateX,
    });
  };

  const onDrag = async (e) => {
    const { target, beforeTranslate } = e;
    // get the dimensions of the target element
    const targetRect = target.getBoundingClientRect();

    // get the max width where can be translated and put it as x position
    const maxX = parentBounds.width - targetRect.width;
    // get the max height where can be translated and put it as y position
    const maxY = parentBounds.height - targetRect.height;
    const minX = 0;
    const minY = 0;

    // apply the boundaries to the translation, meaning we have the minimun value between the max size we made before
    // and the new position it will have, with this we are always making to have them in the boundaries of the parent
    // even if they change any time
    const x = Math.max(minX, Math.min(beforeTranslate[0], maxX));
    const y = Math.max(minY, Math.min(beforeTranslate[1], maxY));

    // apply the translated position to the target element
    target.style.transform = `translate(${x}px, ${y}px)`;
  };

  return (
    <>
      <div
        ref={ref}
        className="draggable"
        id={"component-" + id}
        style={{
          position: "absolute",
          top: top,
          left: left,
          width: width,
          height: height,
          backgroundImage: `url(${image.url})`,
          backgroundSize: image.size,
        }}
        onClick={() => setSelected(id)}
      />

      <Moveable
        target={isSelected && ref.current}
        resizable
        draggable
        onDrag={onDrag}
        onResize={onResize}
        keepRatio={false}
        throttleResize={1}
        renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
        edge={false}
        zoom={1}
        origin={false}
        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
      />
    </>
  );
};

export default Component;
