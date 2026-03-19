import { useState } from "react";

export default function AdminSeasonForm() {

  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    prize: "",
    registrationStartDate: "",
    registrationEndDate: "",
    votingStartDate: "",
    votingEndDate: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // clean season name → folder safe
  const getSeasonFolder = () => {
    return form.name.trim().replace(/\s+/g, "-").toLowerCase();
  };

  // upload banner to cloudinary
  const uploadImage = async (file) => {

    if (!file) return;

    if (!form.name) {
      alert("Enter season name first");
      return;
    }

    setUploading(true);

    const seasonFolder = getSeasonFolder();

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "season_upload");

    // IMPORTANT: this creates the folder structure
    data.append("folder", `seasons/${seasonFolder}/banner`);

    try {

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dxt9cvxmg/image/upload",
        {
          method: "POST",
          body: data
        }
      );

      const result = await res.json();

      setImageUrl(result.secure_url);

    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    }

    setUploading(false);
  };

  // convert datetime-local → ISO
  const toISO = (value) => {
    if (!value) return null;
    return new Date(value).toISOString();
  };

  const createSeason = async () => {

    if (!imageUrl) {
      alert("Upload image first");
      return;
    }

    setLoading(true);

    const payload = {
      name: form.name,
      description: form.description,
      prize: form.prize,
      photoUrl: imageUrl,
      registrationStartDate: toISO(form.registrationStartDate),
      registrationEndDate: toISO(form.registrationEndDate),
      votingStartDate: toISO(form.votingStartDate),
      votingEndDate: toISO(form.votingEndDate)
    };

    try {

      const res = await fetch("http://localhost:3000/seasons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload)
      });

      const text = await res.text();

      if (!res.ok) {
        alert("Error: " + text);
        setLoading(false);
        return;
      }

      alert(text);

      // reset form
      setForm({
        name: "",
        description: "",
        prize: "",
        registrationStartDate: "",
        registrationEndDate: "",
        votingStartDate: "",
        votingEndDate: ""
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

      <h2>Create Season</h2>

      <input
        name="name"
        placeholder="Season name"
        value={form.name}
        onChange={handleChange}
      />

      <br /><br />

      <input
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />

      <br /><br />

      <input
        name="prize"
        placeholder="Prize"
        value={form.prize}
        onChange={handleChange}
      />

      <br /><br />

      <label>Registration Start</label><br />
      <input
        type="datetime-local"
        name="registrationStartDate"
        value={form.registrationStartDate}
        onChange={handleChange}
      />

      <br /><br />

      <label>Registration End</label><br />
      <input
        type="datetime-local"
        name="registrationEndDate"
        value={form.registrationEndDate}
        onChange={handleChange}
      />

      <br /><br />

      <label>Voting Start</label><br />
      <input
        type="datetime-local"
        name="votingStartDate"
        value={form.votingStartDate}
        onChange={handleChange}
      />

      <br /><br />

      <label>Voting End</label><br />
      <input
        type="datetime-local"
        name="votingEndDate"
        value={form.votingEndDate}
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
          <img src={imageUrl} width="250" alt="preview" />
        </div>
      )}

      <br /><br />

      <button onClick={createSeason} disabled={loading || uploading}>
        {loading ? "Creating..." : "Create Season"}
      </button>

    </div>
  );
}