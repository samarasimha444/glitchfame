import React, { useState } from "react";
const SeasonForm = () => {
const [form, setForm] = useState({
    name: "",
    prizeMoney: "",
    registrationStartDate: "",
    registrationEndDate: "",
    votingStartDate: "",
    votingEndDate: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const now = new Date().toISOString().slice(0, 16);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const {
      registrationStartDate,
      registrationEndDate,
      votingStartDate,
      votingEndDate
    } = form;

    if (!form.name.trim()) {
      return "Season name is required.";
    }

    if (registrationStartDate >= registrationEndDate) {
      return "Registration start must be before registration end.";
    }

    if (registrationEndDate > votingStartDate) {
      return "Registration must end before voting starts.";
    }

    if (votingStartDate >= votingEndDate) {
      return "Voting start must be before voting end.";
    }

    if (votingEndDate < now) {
      return "Voting end date cannot be in the past.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      alert(validationError);
      return;
    }

    const payload = {
      ...form,
      prizeMoney: parseFloat(form.prizeMoney)
    };
     const token = localStorage.getItem("token"); 

    try {
      setLoading(true);

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/seasons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        alert(errorMessage);
        setLoading(false);
        return;
      }

      alert("Season created successfully!");

      // Reset form after success
      setForm({
        name: "",
        prizeMoney: "",
        registrationStartDate: "",
        registrationEndDate: "",
        votingStartDate: "",
        votingEndDate: ""
      });

    } catch (err) {
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto" }}>
      <h2>Create Season</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Season Name"
          required
          value={form.name}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="number"
          name="prizeMoney"
          placeholder="Prize Money"
          required
          min="0"
          step="0.01"
          value={form.prizeMoney}
          onChange={handleChange}
        />

        <br /><br />

        <label>Registration Start</label><br />
        <input
          type="datetime-local"
          name="registrationStartDate"
          required
          min={now}
          value={form.registrationStartDate}
          onChange={handleChange}
        />

        <br /><br />

        <label>Registration End</label><br />
        <input
          type="datetime-local"
          name="registrationEndDate"
          required
          value={form.registrationEndDate}
          onChange={handleChange}
        />

        <br /><br />

        <label>Voting Start</label><br />
        <input
          type="datetime-local"
          name="votingStartDate"
          required
          value={form.votingStartDate}
          onChange={handleChange}
        />

        <br /><br />

        <label>Voting End</label><br />
        <input
          type="datetime-local"
          name="votingEndDate"
          required
          min={now}
          value={form.votingEndDate}
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Season"}
        </button>

      </form>
    </div>
  );
};

export default SeasonForm;