import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Upload({ user, goToAdmin }) {
  const [type, setType] = useState("resource");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userResponse = await supabase.auth.getUser();
      const userData = userResponse.data.user;

      if (!userData) {
        alert("❌ You must be logged in to upload.");
        setLoading(false);
        return;
      }

      const { data: roleData, error: roleError } = await supabase
        .from("users")
        .select("role")
        .eq("id", userData.id)
        .maybeSingle();

      if (roleError) throw roleError;
      if (!roleData || roleData.role !== "admin") {
        alert("❌ Only admins can upload.");
        setLoading(false);
        return;
      }

      // Upload files
      let fileUrl = "";
      if (file) {
        const { data, error } = await supabase.storage
          .from("project-assets")
          .upload(`${type}s/${Date.now()}-${file.name}`, file);
        if (error) throw error;
        fileUrl = supabase.storage.from("project-assets").getPublicUrl(data.path).data.publicUrl;
      }

      let imageUrl = "";
      if (imageFile) {
        const { data, error } = await supabase.storage
          .from("project-assets")
          .upload(`images/${Date.now()}-${imageFile.name}`, imageFile);
        if (error) throw error;
        imageUrl = supabase.storage.from("project-assets").getPublicUrl(data.path).data.publicUrl;
      }

      // Insert into tables
      if (type === "resource") {
        const { error: insertError } = await supabase.from("resources").insert([{ title, description, file_url: fileUrl }]);
        if (insertError) throw insertError;
      } else {
        const { error: insertError } = await supabase.from("tips").insert([{ title, content, image_url: imageUrl }]);
        if (insertError) throw insertError;
      }

      alert("✅ Uploaded successfully!");
      setTitle("");
      setDescription("");
      setContent("");
      setFile(null);
      setImageFile(null);
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert("❌ Logout failed: " + error.message);
    else window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center px-4">
      <form
        onSubmit={handleUpload}
        className="bg-gray-900 border border-gray-700 p-8 rounded-2xl shadow-xl w-full max-w-lg transition-transform transform hover:scale-[1.01]"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Upload {type === "resource" ? "Resource" : "Tip"}
        </h2>

        {/* Type selection */}
        <label className="block mb-6">
          <span className="block text-sm text-gray-300 mb-2">Type</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="resource">Resource</option>
            <option value="tip">Tip</option>
          </select>
        </label>

        {/* Title input */}
        <input
          type="text"
          placeholder="Enter title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-gray-800 border border-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />

        {/* Conditional inputs for resource or tip */}
        {type === "resource" && (
          <>
            <textarea
              placeholder="Enter description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 mb-4 rounded-lg bg-gray-800 border border-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <label className="block mb-2 text-sm text-gray-300">Upload File (PDF/ZIP)</label>
            <input type="file" accept=".pdf,.zip" onChange={(e) => setFile(e.target.files[0])} className="mb-6 text-gray-300" />
          </>
        )}

        {type === "tip" && (
          <>
            <textarea
              placeholder="Enter tip content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 mb-4 rounded-lg bg-gray-800 border border-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />
            <label className="block mb-2 text-sm text-gray-300">Upload Image (Optional)</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="mb-6 text-gray-300" />
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-3 px-6 rounded-lg font-semibold shadow-md transition-all duration-200 disabled:opacity-50"
        >
          {loading ? "Uploading..." : `Upload ${type === "resource" ? "Resource" : "Tip"}`}
        </button>
      </form>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-6 w-full max-w-lg bg-red-500 hover:bg-red-600 py-3 px-6 rounded-lg font-semibold shadow-md transition-all duration-200 text-white"
      >
        Log Out
      </button>

      {/* Go to Admin Panel Button */}
      {goToAdmin && (
        <button
          onClick={goToAdmin}
          className="mt-4 w-full max-w-lg bg-green-500 hover:bg-green-600 py-3 px-6 rounded-lg font-semibold shadow-md transition-all duration-200 text-white"
        >
          Go to Admin Panel
        </button>
      )}
    </div>
  );
}
