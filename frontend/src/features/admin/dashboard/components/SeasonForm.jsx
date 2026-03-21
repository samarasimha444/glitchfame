import { useState, useCallback } from "react";
import { useCreateSeason, useUploadImage } from "../hooks";
import toast from "react-hot-toast";
import { buildSeasonPayload, getSeasonFolder } from "../../../../lib/helper";
import { seasonInitialState, seasonfields } from "../../../../constants/admin";

const SeasonForm = () => {
  const { mutateAsync: createSeason, isPending } = useCreateSeason();
  const { mutateAsync: uploadImage, isPending: uploading } = useUploadImage();

  const [form, setForm] = useState(seasonInitialState);
  const [file, setFile] = useState(null);

  const inputClass =
    "w-full bg-[#111317] text-sm text-white px-3 py-2 rounded-lg border border-white/10 focus:ring-2 focus:ring-blue-600 outline-none transition";

  const handleChange = useCallback((e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }, []);

  const handleFileChange = useCallback((e) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    console.log("SUBMIT CLICKED"); // 👈 DEBUG

    if (isPending || uploading) return;

    if (!form.name.trim()) return toast.error("Enter season name");
    if (!file) return toast.error("Select image");

    try {
      const folder = getSeasonFolder(form.name);

      console.log("Uploading image...");
      const imageUrl = await uploadImage({ file, folder });

      console.log("Image URL:", imageUrl);

      console.log("Creating season...");
      await createSeason(buildSeasonPayload(form, imageUrl));

      toast.success("Season created successfully!");

      setForm(seasonInitialState);
      setFile(null);
    } catch (err) {
      console.error("ERROR 👉", err);
      toast.error(err?.message || "Something went wrong");
    }
  }, [form, file, isPending, uploading, uploadImage, createSeason]);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#171A1F] border border-white/5 rounded-xl p-6 w-full max-w-2xl mx-auto"
    >
      <h2 className="text-base font-semibold text-white mb-6">
        Season Configuration
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {seasonfields.map((f) => (
          <div key={f.name} className={f.full ? "col-span-2" : ""}>
            <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-2">
              {f.label}
            </label>

            {f.type === "textarea" ? (
              <textarea
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                className={`${inputClass} resize-none`}
              />
            ) : (
              <input
                type={f.type}
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                className={inputClass}
              />
            )}
          </div>
        ))}

        <div className="col-span-2">
          <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-2">
            Banner Image
          </label>

          <input
            type="file"
            onChange={handleFileChange}
            className={inputClass}
          />

          {uploading && (
            <p className="text-sm text-white mt-2">Uploading...</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6 border-t border-white/5 pt-6">
        <button
          type="button"
          onClick={() => {
            setForm(seasonInitialState);
            setFile(null);
          }}
          className="px-4 py-2 text-sm rounded-lg bg-[#2C2C2E] text-white/70 hover:bg-[#3A3A3C] transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isPending || uploading}
          className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-medium disabled:opacity-50"
        >
          {(isPending || uploading) ? "Saving..." : "Save Season"}
        </button>
      </div>
    </form>
  );
};

export default SeasonForm;