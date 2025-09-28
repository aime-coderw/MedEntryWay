import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Check({ goBack, goToLink }) {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestCode = () => {
    const message = `In order to get code to access link, pay UCAT preparatory fees.
Amount: 3000 RWF
Phone number: +250782042896
Names: Hazakorimana Blaise

After sending this message on WhatsApp, we will send the code to your WhatsApp number instantly.`;
    const whatsappUrl = `https://wa.me/250782042896?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCheckCode = async () => {
    if (!phone || !code) {
      alert("Please enter both phone number and code!");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
  .from("codes")
  .select("*")
  .eq("phone_number", phone)
  .eq("code", code)
  .maybeSingle();

      if (error) throw error;

      if (data) {
        // ✅ Correct code, navigate to Link page
        goToLink();
      } else {
        alert("❌ Incorrect code. If you forgot your code, contact us.");
      }
    } catch (err) {
      console.error(err);
      alert("Error checking code: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">UCAT Access</h2>

        <input
          type="tel"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none"
        />

        <input
          type="text"
          placeholder="Enter access code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none"
        />

        <button
          onClick={handleCheckCode}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 py-3 mb-4 rounded-lg font-semibold"
        >
          {loading ? "Checking..." : "Submit Code"}
        </button>

        <button
          onClick={handleRequestCode}
          className="w-full bg-green-500 hover:bg-green-600 py-3 rounded-lg font-semibold mb-4"
        >
          Request Code
        </button>

        <button
          onClick={goBack}
          className="w-full bg-gray-600 hover:bg-gray-700 py-2 rounded-lg font-semibold"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
