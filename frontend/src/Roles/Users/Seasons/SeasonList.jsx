import { useEffect, useRef, useState } from "react";
import { fetchSeasons } from "./Seasons.js";
import SeasonCard from "./SeasonCard";

export default function Seasons() {
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSeasons = async () => {
      try {
        const data = await fetchSeasons();
        setSeasons(data);
      } catch (error) {
        console.error("Failed to fetch seasons", error);
      } finally {
        setLoading(false);
      }
    };

    loadSeasons();
  }, []);

  if (loading) {
    return (
      <div style={{ color: "white", padding: "20px" }}>
        Loading seasons...
      </div>
    );
  }

  const now = new Date();

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

  const live = seasons.filter((s) => {
    const start = parseDate(s.registrationStartDate);
    const end = parseDate(s.votingEndDate);
    return start && end && start <= now && end > now;
  });

  const upcoming = seasons.filter((s) => {
    const start = parseDate(s.registrationStartDate);
    return start && start > now;
  });

  const past = seasons.filter((s) => {
    const end = parseDate(s.votingEndDate);
    return end && end <= now;
  });

  return (
    <div style={{ padding: "20px", background: "#111" }}>
      {live.length > 0 && (
        <CarouselSection title="🔥 Live Seasons" data={live} />
      )}
      {upcoming.length > 0 && (
        <CarouselSection title="⏳ Upcoming Seasons" data={upcoming} />
      )}
      {past.length > 0 && (
        <CarouselSection title="🏁 Past Seasons" data={past} />
      )}
    </div>
  );
}

/* --------------------------
   Carousel Section
--------------------------- */
function CarouselSection({ title, data }) {
  const scrollRef = useRef();

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 300;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div style={{ marginBottom: "50px", position: "relative" }}>
      <h2 style={{ color: "white", marginBottom: "15px" }}>{title}</h2>

      <button onClick={() => scroll("left")} style={arrowStyle("left")}>
        ‹
      </button>

      <button onClick={() => scroll("right")} style={arrowStyle("right")}>
        ›
      </button>

      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: "16px",
          overflowX: "hidden",
        }}
      >
        {data.map((season) => (
          <SeasonCard key={season.id} season={season} />
        ))}
      </div>
    </div>
  );
}

function arrowStyle(position) {
  return {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    [position]: "0px",
    zIndex: 2,
    background: "rgba(0,0,0,0.7)",
    color: "white",
    border: "none",
    width: "40px",
    height: "60px",
    cursor: "pointer",
    fontSize: "24px",
    borderRadius: "5px",
  };
}