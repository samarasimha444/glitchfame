import { useState } from "react";

export default function CreateSeason() {

  const [form, setForm] = useState({
    name: "",
    prizeMoney: "",
    registrationStartDate: "",
    registrationEndDate: "",
    votingStartDate: "",
    votingEndDate: ""
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("prizeMoney", form.prizeMoney);
    formData.append("registrationStartDate", form.registrationStartDate);
    formData.append("registrationEndDate", form.registrationEndDate);
    formData.append("votingStartDate", form.votingStartDate);
    formData.append("votingEndDate", form.votingEndDate);
    formData.append("image", image);

    try {
      const res = await fetch("http://localhost:3000/admin/seasons/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.text();
      console.log(data);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      <input
        type="text"
        name="name"
        placeholder="Season Name"
        value={form.name}
        onChange={handleChange}
      />

      <input
        type="number"
        name="prizeMoney"
        placeholder="Prize Money"
        value={form.prizeMoney}
        onChange={handleChange}
      />

      <input
        type="datetime-local"
        name="registrationStartDate"
        value={form.registrationStartDate}
        onChange={handleChange}
      />

      <input
        type="datetime-local"
        name="registrationEndDate"
        value={form.registrationEndDate}
        onChange={handleChange}
      />

      <input
        type="datetime-local"
        name="votingStartDate"
        value={form.votingStartDate}
        onChange={handleChange}
      />

      <input
        type="datetime-local"
        name="votingEndDate"
        value={form.votingEndDate}
        onChange={handleChange}
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />

      <button type="submit">
        Create Season
      </button>

    </form>
  );
}