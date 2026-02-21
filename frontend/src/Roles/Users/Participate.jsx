import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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
  const [loading, setLoading] = useState(false);

  // 🔐 Token + Role Validation
  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (decoded.role === "ADMIN") {
        navigate("/admin-dashboard");
        return;
      }

      if (decoded.role !== "USER") {
        navigate("/login");
      }

    } catch {
      localStorage.removeItem("token");
      navigate("/login");
    }

  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ✅ Frontend Validation
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
      return "Photo URL must be a valid URL";
    }

    if (!formData.description.trim()) {
      return "Description is required";
    }

    if (formData.description.trim().length < 10) {
      return "Description must be at least 10 characters";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const token = localStorage.getItem("token");

    const payload = {
      seasonId: Number(seasonId),
      age: Number(formData.age),
      mobileNumber: formData.mobileNumber.trim(),
      location: formData.location.trim(),
      photoUrl: formData.photoUrl.trim(),
      description: formData.description.trim()
    };

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/participations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      if (response.status === 201) {
        alert("Participation submitted successfully");
        navigate("/dashboard");
      } else {
        const message = await response.text();
        setError(message);
      }

    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto" }}>
      <h2>Participate in Season {seasonId}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>

        <input
          type="number"
          name="age"
          placeholder="Enter your age"
          value={formData.age}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="text"
          name="mobileNumber"
          placeholder="Enter mobile number"
          value={formData.mobileNumber}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="text"
          name="location"
          placeholder="Enter your location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="text"
          name="photoUrl"
          placeholder="Paste image URL"
          value={formData.photoUrl}
          onChange={handleChange}
          required
        />

        <br /><br />

        <textarea
          name="description"
          placeholder="Describe yourself"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Participation"}
        </button>

      </form>
    </div>
  );
};

export default Participate;