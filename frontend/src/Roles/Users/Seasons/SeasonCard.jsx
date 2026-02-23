import { useEffect, useState } from "react";

/* --------------------------
   Countdown Hook
--------------------------- */
function useCountdown(targetDate) {
  const parseDate = (value) => {
    if (!value) return null;
    if (Array.isArray(value)) {
      return new Date(
        value[0],
        value[1] - 1,
        value[2],
        value[3] || 0,
        value[4] || 0,
        value[5] || 0
      );
    }
    return new Date(value);
  };

  const calculate = () => {
    const parsedDate = parseDate(targetDate);
    if (!parsedDate || isNaN(parsedDate.getTime())) return null;

    const diff = parsedDate - new Date();
    if (diff <= 0) return null;

    return {
      d: Math.floor(diff / (1000 * 60 * 60 * 24)),
      h: Math.floor((diff / (1000 * 60 * 60)) % 24),
      m: Math.floor((diff / (1000 * 60)) % 60),
      s: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculate());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculate());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

/* --------------------------
   Season Card
--------------------------- */
export default function SeasonCard({ season }) {
  const startCountdown = useCountdown(season.registrationStartDate);
  const endCountdown = useCountdown(season.votingEndDate);

  const registrationStarted = !startCountdown;
  const votingEnded = !endCountdown;

  return (
    <div
      style={{
        minWidth: "240px",
        background: "#1c1c1c",
        color: "white",
        padding: "16px",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <h3>{season.name}</h3>
        <p>₹ {season.prizeMoney}</p>

        {!registrationStarted && startCountdown && (
          <p>
            Starts in {startCountdown.d}d {startCountdown.h}h{" "}
            {startCountdown.m}m {startCountdown.s}s
          </p>
        )}

        {registrationStarted && !votingEnded && endCountdown && (
          <p>
            Ends in {endCountdown.d}d {endCountdown.h}h{" "}
            {endCountdown.m}m {endCountdown.s}s
          </p>
        )}

        {votingEnded && <p>Season Completed</p>}
      </div>

      {registrationStarted && !votingEnded && (
        <button
          style={{
            marginTop: "12px",
            padding: "8px",
            background: "#ff9800",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Participate
        </button>
      )}
    </div>
  );
}