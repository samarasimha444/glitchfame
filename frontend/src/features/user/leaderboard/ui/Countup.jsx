import { useEffect, useState } from "react";

const Countup = ({ end, duration = 1000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16); // roughly 60fps
    let animationFrame;

    const step = () => {
      start += increment;
      if (start < end) {
        setCount(Math.floor(start));
        animationFrame = requestAnimationFrame(step);
      } else {
        setCount(end); // ensure exact end value
      }
    };

    animationFrame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count}</span>;
};

export default Countup;