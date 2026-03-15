import { useState } from "react";

export default function ParticipationForm() {

const [imageUrl, setImageUrl] = useState("");
const [uploading, setUploading] = useState(false);
const [loading, setLoading] = useState(false);

const [form, setForm] = useState({
seasonId: "",
name: "",
dateOfBirth: "",
location: "",
description: ""
});

const handleChange = (e) => {
setForm({
...form,
[e.target.name]: e.target.value
});
};

const uploadImage = async (file) => {


if (!file) return;

if (!form.seasonId.trim()) {
  alert("Enter seasonId first");
  return;
}

setUploading(true);

const data = new FormData();
data.append("file", file);
data.append("upload_preset", "season_upload");

// store inside season folder using seasonId
const folderPath = `seasons/${form.seasonId}/contestants`;
data.append("folder", folderPath);

try {

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dxt9cvxmg/image/upload",
    {
      method: "POST",
      body: data
    }
  );

  const result = await res.json();

  if (!result.secure_url) {
    throw new Error("Upload failed");
  }

  setImageUrl(result.secure_url);

} catch (err) {
  console.error(err);
  alert("Image upload failed");
}

setUploading(false);


};

const submitParticipation = async () => {


if (!imageUrl) {
  alert("Upload photo first");
  return;
}

setLoading(true);

const payload = {
  seasonId: form.seasonId,
  name: form.name,
  dateOfBirth: form.dateOfBirth,
  location: form.location,
  description: form.description,
  photoUrl: imageUrl
};

try {

  const res = await fetch("http://localhost:3000/participations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify(payload)
  });

  const text = await res.text();

  if (!res.ok) {
    alert(text);
    setLoading(false);
    return;
  }

  alert(text);

  setForm({
    seasonId: "",
    name: "",
    dateOfBirth: "",
    location: "",
    description: ""
  });

  setImageUrl("");

} catch (err) {
  console.error(err);
  alert("Server error");
}

setLoading(false);


};

return (
<div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "Arial" }}>


  <h2>Participation Form</h2>

  <input
    name="seasonId"
    placeholder="Season ID"
    value={form.seasonId}
    onChange={handleChange}
  />

  <br /><br />

  <input
    name="name"
    placeholder="Full Name"
    value={form.name}
    onChange={handleChange}
  />

  <br /><br />

  <input
    type="date"
    name="dateOfBirth"
    value={form.dateOfBirth}
    onChange={handleChange}
  />

  <br /><br />

  <input
    name="location"
    placeholder="Location"
    value={form.location}
    onChange={handleChange}
  />

  <br /><br />

  <textarea
    name="description"
    placeholder="Description"
    value={form.description}
    onChange={handleChange}
  />

  <br /><br />

  <input
    type="file"
    onChange={(e) => uploadImage(e.target.files[0])}
  />

  {uploading && <p>Uploading image...</p>}

  {imageUrl && (
    <div style={{ marginTop: 20 }}>
      <img src={imageUrl} width="200" alt="preview" />
    </div>
  )}

  <br /><br />

  <button onClick={submitParticipation} disabled={loading || uploading}>
    {loading ? "Submitting..." : "Submit Participation"}
  </button>

</div>


);
}
