import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function AdminCodes({ user, goBack }) {
  const [codes, setCodes] = useState([]);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();
      if (error) return alert("Error checking admin: " + error.message);
      setIsAdmin(data.role === "admin");
    };
    checkAdmin();
    fetchCodes();
  }, [user]);

  const fetchCodes = async () => {
    const { data, error } = await supabase
      .from("codes")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setCodes(data);
  };

  const handleAddCode = async (e) => {
    e.preventDefault();
    if (!phone.trim() || !code.trim()) return alert("Enter both phone and code!");
    setLoading(true);
    try {
      const { error } = await supabase
        .from("codes")
        .insert([{ phone_number: phone, code }]);
      if (error) throw error;
      setPhone("");
      setCode("");
      fetchCodes();
      alert("✅ Code added successfully!");
    } catch (err) {
      alert("❌ Error adding code: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p className="text-center mt-10">Please log in to access admin page.</p>;
  if (!isAdmin) return <p className="text-center mt-10">❌ Access Denied. Only admin can access this page.</p>;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin: Manage UCAT Codes</h2>
        <form onSubmit={handleAddCode} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            type="text"
            placeholder="Enter code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 py-2 rounded-lg font-semibold"
          >
            {loading ? "Adding..." : "Add Code"}
          </button>
        </form>

        <h3 className="mt-6 mb-2 text-lg font-semibold">Existing Codes</h3>
        <ul className="list-disc list-inside">
          {codes.map((c) => (
            <li key={c.id}>
              📱 {c.phone_number} - 🔑 {c.code}
            </li>
          ))}
        </ul>

        <button
          onClick={goBack}
          className="mt-6 w-full bg-gray-600 hover:bg-gray-700 py-2 rounded-lg font-semibold"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
