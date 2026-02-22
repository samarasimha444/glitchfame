import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

const fetchSeasonById = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${import.meta.env.VITE_BASE_URL}/admin/seasons/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch season details");
  }

  return res.json();
};

export default function SeasonDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["season-details", id],
    queryFn: () => fetchSeasonById(id),
    enabled: !!id,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  if (isLoading) return <p>Loading season details...</p>;

  if (isError)
    return <p style={{ color: "red" }}>{error.message}</p>;

  if (!formData) return <p>Preparing data...</p>;

  const now = new Date();
  const nowInput = new Date().toISOString().slice(0, 16);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCancel = () => {
    setFormData(data);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const regStart = new Date(formData.registrationStartDate);
    const regEnd = new Date(formData.registrationEndDate);
    const voteStart = new Date(formData.votingStartDate);
    const voteEnd = new Date(formData.votingEndDate);

    // 🔴 Frontend validation
    if (regStart < now) {
      alert("Registration start cannot be in the past.");
      return;
    }

    if (regStart >= regEnd) {
      alert("Registration start must be before registration end.");
      return;
    }

    if (voteStart < regEnd) {
      alert("Voting cannot start before registration ends.");
      return;
    }

    if (voteStart >= voteEnd) {
      alert("Voting start must be before voting end.");
      return;
    }

    if (!formData.prizeMoney || formData.prizeMoney <= 0) {
      alert("Prize money must be greater than 0.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admin/seasons/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        const msg = await res.text();
        alert(msg || "Update failed.");
        return;
      }

      alert("Season updated successfully.");
      setIsEditing(false);
      refetch();

    } catch (err) {
      alert("Something went wrong.");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this season?"
    );

    if (!confirmDelete) return;

    setIsDeleting(true);

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admin/seasons/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const msg = await res.text();
        alert(msg || "Delete failed.");
        setIsDeleting(false);
        return;
      }

      alert("Season deleted successfully.");
      navigate("/admin-dashboard/seasons");

    } catch (err) {
      alert("Something went wrong.");
    }

    setIsDeleting(false);
  };

  const formatDate = (value) =>
    value ? new Date(value).toLocaleString() : "";

  const formatForInput = (value) =>
    value ? value.slice(0, 16) : "";

  return (
    <div>
      <button onClick={() => navigate(-1)}>Back</button>

      <h2>Season Details</h2>

      {/* Name */}
      <div style={{ marginBottom: "15px" }}>
        <strong>Name: </strong>
        {isEditing ? (
          <input
            value={formData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        ) : (
          formData.name
        )}
      </div>

      {/* Prize */}
      <div style={{ marginBottom: "15px" }}>
        <strong>Prize Money: </strong>
        {isEditing ? (
          <input
            type="number"
            value={formData.prizeMoney || ""}
            onChange={(e) =>
              handleChange("prizeMoney", e.target.value)
            }
          />
        ) : (
          formData.prizeMoney
        )}
      </div>

      {/* Registration Start */}
      <div style={{ marginBottom: "15px" }}>
        <strong>Registration Start: </strong>
        {isEditing ? (
          <input
            type="datetime-local"
            min={nowInput}
            value={formatForInput(formData.registrationStartDate)}
            onChange={(e) =>
              handleChange("registrationStartDate", e.target.value)
            }
          />
        ) : (
          formatDate(formData.registrationStartDate)
        )}
      </div>

      {/* Registration End */}
      <div style={{ marginBottom: "15px" }}>
        <strong>Registration End: </strong>
        {isEditing ? (
          <input
            type="datetime-local"
            value={formatForInput(formData.registrationEndDate)}
            onChange={(e) =>
              handleChange("registrationEndDate", e.target.value)
            }
          />
        ) : (
          formatDate(formData.registrationEndDate)
        )}
      </div>

      {/* Voting Start */}
      <div style={{ marginBottom: "15px" }}>
        <strong>Voting Start: </strong>
        {isEditing ? (
          <input
            type="datetime-local"
            value={formatForInput(formData.votingStartDate)}
            onChange={(e) =>
              handleChange("votingStartDate", e.target.value)
            }
          />
        ) : (
          formatDate(formData.votingStartDate)
        )}
      </div>

      {/* Voting End */}
      <div style={{ marginBottom: "15px" }}>
        <strong>Voting End: </strong>
        {isEditing ? (
          <input
            type="datetime-local"
            value={formatForInput(formData.votingEndDate)}
            onChange={(e) =>
              handleChange("votingEndDate", e.target.value)
            }
          />
        ) : (
          formatDate(formData.votingEndDate)
        )}
      </div>

      {/* Winner */}
      <div style={{ marginBottom: "15px" }}>
        <strong>Winner: </strong>
        {formData.winnerId ? formData.winnerId : "Not Available"}
      </div>

      {/* Buttons */}
      <div style={{ marginTop: "30px" }}>
        {!isEditing ? (
          <>
            <button onClick={() => setIsEditing(true)}>Edit</button>

            <button
              style={{ marginLeft: "10px" }}
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>

            <button style={{ marginLeft: "10px" }}>
              See Participants
            </button>
          </>
        ) : (
          <>
            <button onClick={handleSave}>Save</button>
            <button
              style={{ marginLeft: "10px" }}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}