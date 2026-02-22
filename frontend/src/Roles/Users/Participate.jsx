import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

const Participate = () => {
  const { seasonId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: "",
    mobileNumber: "",
    location: "",
    photoUrl: "",
    description: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    if (!formData.age || isNaN(formData.age)) {
      return "Age must be a valid number";
    }

    const age = Number(formData.age);
    if (age < 13 || age > 100) {
      return "Age must be between 13 and 100";
    }

    const mobileRegex = /^[0-9]{10,15}$/;
    if (!mobileRegex.test(formData.mobileNumber)) {
      return "Mobile number must contain 10 to 15 digits";
    }

    if (!formData.location.trim()) {
      return "Location is required";
    }

    try {
      new URL(formData.photoUrl);
    } catch {
      return "Photo URL must be valid";
    }

    if (!formData.description.trim() || formData.description.trim().length < 10) {
      return "Description must be at least 10 characters";
    }

    return null;
  };

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}user/participations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to submit participation");
      }

      return response.status === 204 ? null : response.json();
    },
    onSuccess: () => {
      alert("Participation submitted successfully");
      navigate("/dashboard");
    },
    onError: (err) => {
      setError(err.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      seasonId: Number(seasonId),
      age: Number(formData.age),
      mobileNumber: formData.mobileNumber.trim(),
      location: formData.location.trim(),
      photoUrl: formData.photoUrl.trim(),
      description: formData.description.trim()
    };

    mutation.mutate(payload);
  };

  return (
    <div style={styles.container}>
      <h2>Participate in Season {seasonId}</h2>

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>

        <div style={styles.field}>
          <label>Age</label>
          <input
            type="number"
            name="age"
            placeholder="Enter your age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.field}>
          <label>Mobile Number</label>
          <input
            type="text"
            name="mobileNumber"
            placeholder="Enter mobile number"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.field}>
          <label>Location</label>
          <input
            type="text"
            name="location"
            placeholder="Enter your location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.field}>
          <label>Photo URL</label>
          <input
            type="text"
            name="photoUrl"
            placeholder="Paste image URL"
            value={formData.photoUrl}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.field}>
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Describe yourself"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Submitting..." : "Submit Participation"}
        </button>

      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "5px"
  },
  error: {
    color: "red",
    fontWeight: "bold"
  }
};

export default Participate;