import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function TestingParticipation(){

    const { seasonId } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        description: "",
        dateOfBirth: "",
        location: ""
    });

    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true);

        try {

            const token = localStorage.getItem("token");

            const formData = new FormData();

            formData.append("seasonId", seasonId);
            formData.append("name", form.name);
            formData.append("description", form.description);
            formData.append("dateOfBirth", form.dateOfBirth);
            formData.append("location", form.location);
            formData.append("image", image);

            const res = await fetch(
                `${import.meta.env.VITE_BASE_URL}/contestants/apply`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                }
            );

            if (!res.ok) throw new Error("Participation failed");

            alert("Participation submitted!");

            navigate(`/testing-season/${seasonId}`);

        } catch (err) {

            alert(err.message);

        } finally {

            setLoading(false);

        }

    };

    return (
        <div>

            <h2>Apply for Season</h2>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <br/>

                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                />

                <br/>

                <input
                    type="date"
                    name="dateOfBirth"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                    required
                />

                <br/>

                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={form.location}
                    onChange={handleChange}
                    required
                />

                <br/>

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    required
                />

                <br/><br/>

                <button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Participation"}
                </button>

            </form>

        </div>
    );
}