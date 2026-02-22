import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const fetchSeasons = async (page) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${import.meta.env.VITE_BASE_URL}/admin/seasons?page=${page}&size=10`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch seasons");
  }

  return res.json();
};

export default function Seasons() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["seasons", page],
    queryFn: () => fetchSeasons(page),
    keepPreviousData: true,
  });

  if (isLoading) return <p>Loading seasons...</p>;

  if (isError)
    return <p style={{ color: "red" }}>Error: {error.message}</p>;

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h2>Seasons</h2>

        <button onClick={() => navigate("create")}>
          Add Season
        </button>
      </div>

      {/* Table */}
      {!data?.content || data.content.length === 0 ? (
        <p>No seasons found.</p>
      ) : (
        <table border="1" cellPadding="10" width="100%">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Prize</th>
              <th>Registration Start</th>
              <th>Registration End</th>
              <th>Voting Start</th>
              <th>Voting End</th>
            </tr>
          </thead>
          <tbody>
            {data.content.map((season) => (
              <tr
                key={season.id}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`${season.id}`)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f5f5f5")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "white")
                }
              >
                <td>{season.id}</td>
                <td>{season.name}</td>
                <td>{season.prizeMoney}</td>
                <td>
                  {new Date(season.registrationStartDate).toLocaleString()}
                </td>
                <td>
                  {new Date(season.registrationEndDate).toLocaleString()}
                </td>
                <td>
                  {new Date(season.votingStartDate).toLocaleString()}
                </td>
                <td>
                  {new Date(season.votingEndDate).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div style={{ marginTop: "20px" }}>
        <button
          disabled={page === 0}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {data.number + 1} of {data.totalPages}
        </span>

        <button
          disabled={page + 1 >= data.totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}