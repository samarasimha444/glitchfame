import { useEffect, useState } from "react";

export default function CountdownTimer({ endDate }) {
  const calculateTimeLeft = () => {
    const difference = new Date(endDate) - new Date();

    if (difference <= 0) {
      return { hours: "00", minutes: "00", seconds: "00" };
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return {
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <>
      {timeLeft.hours} : {timeLeft.minutes} : {timeLeft.seconds}
    </>
  );
}