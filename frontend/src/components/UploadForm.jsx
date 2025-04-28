import { useState } from "react";
import axios from "axios";

function UploadForm() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const token = localStorage.getItem("token");

      await axios.post("http://localhost:8000/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Uppladdning lyckades!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Fel vid uppladdning!");
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full border p-2 rounded"
        accept=".txt,.pdf"
      />
      <button
        type="submit"
        disabled={!file || uploading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        {uploading ? "Laddar upp..." : "Ladda upp"}
      </button>
    </form>
  );
}

export default UploadForm;
