import { useRef } from "react";
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

  let parent = document.getElementById("parent");
  let parentBounds = parent?.getBoundingClientRect();

  const onResize = async (e) => {
    const beforeTranslate = e.drag.beforeTranslate;
    const targetRect = e.target.getBoundingClientRect();
    const newTranslateX = beforeTranslate[0];
    const newTranslateY = beforeTranslate[1];
    const translateX = Math.max(0, newTranslateX);
    const translateY = Math.max(0, newTranslateY);
    const validateX = translateX + e.width < parentBounds.width;
    const validateY = translateY + e.height < parentBounds.height;
    const previousWidth = validateX ? e.width : parentBounds.width - translateX;
    const previousHeight = validateY
      ? e.height
      : parentBounds.height - translateY;

    const newWidth =
      newTranslateX < 0 && validateX ? targetRect.width : previousWidth;
    const newHeight =
      newTranslateY < 0 && validateY ? targetRect.height : previousHeight;

    console.log({
      validateX,
      validateY,
      aaa: targetRect,
    });
    ref.current.style.transform = `translate(${translateX}px, ${translateY}px)`;

    ref.current.style.width = `${newWidth}px`;
    ref.current.style.height = `${newHeight}px`;
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
