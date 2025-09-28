import { useState, useEffect } from "react";
import "./App.css";
import logo from "./assets/med-logo.png";
import { supabase } from "./supabaseClient";
import Upload from "./upload";
import Auth from "./Auth";
import Check from "./check.jsx";
import LinkPage from "./Link.jsx"; // renamed to LinkPage to avoid confusion
import AdminCodes from "./AdminCodes";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

// Navbar
function Navbar({ setActiveTab }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (tab) => {
    setActiveTab(tab);
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <img src={logo} alt="MedEntryWay Logo" className="logo-img" />
      <ul className={`navbar-links ${isOpen ? "open" : ""}`}>
        <li onClick={() => handleClick("home")}>Home</li>
        <li onClick={() => handleClick("resources")}>Resources</li>
        <li onClick={() => handleClick("tips")}>Study Tips</li>
        <li onClick={() => handleClick("about")}>About</li>
        <li onClick={() => handleClick("contact")}>Contact</li>
        <li onClick={() => handleClick("admin")}>Account</li>
      </ul>
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>☰</button>
    </nav>
  );
}

// Resources
function Resources({ resources }) {
  return (
    <section className="resources-section">
      <h3>📚 Resources</h3>
      <div className="grid">
        {resources.map((res) => (
          <div key={res.id} className="card resource-card">
            <h4>{res.title}</h4>
            <p>{res.description.length > 120 ? res.description.substring(0, 120) + "..." : res.description}</p>
            {res.file_url && (
              <a href={res.file_url} target="_blank" rel="noopener noreferrer">Download Resource</a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// Study Tips
function StudyTips({ tips, selectedTip, setSelectedTip }) {
  if (selectedTip) {
    return (
      <section className="section">
        <div className="blog-detail-card">
          <button onClick={() => setSelectedTip(null)} className="back-btn">← Back to Tips</button>
          <h2 className="blog-detail-title">{selectedTip.title}</h2>
          {selectedTip.image_url && <img src={selectedTip.image_url} alt={selectedTip.title} className="blog-detail-img" />}
          <p className="blog-detail-content">{selectedTip.content}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <h3>📖 Study Tips</h3>
      <div className="grid">
        {tips.map((tip) => (
          <div key={tip.id} className="card blog-card" onClick={() => setSelectedTip(tip)}>
            {tip.image_url && <img src={tip.image_url} alt={tip.title} className="blog-img" />}
            <div className="blog-content">
              <h4>{tip.title}</h4>
              <p>{tip.content.length > 100 ? tip.content.substring(0, 100) + "..." : tip.content}</p>
              <span className="read-more">Read More →</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Main App
export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [user, setUser] = useState(null);
  const [resources, setResources] = useState([]);
  const [tips, setTips] = useState([]);
  const [selectedTip, setSelectedTip] = useState(null);
  const [page, setPage] = useState("app"); // 'app' | 'check' | 'link'
  const [showAdmin, setShowAdmin] = useState(false);

  // Fetch data & auth
  useEffect(() => {
    const fetchResources = async () => {
      const { data, error } = await supabase.from("resources").select("*").order("created_at", { ascending: false });
      if (!error) setResources(data);
    };
    const fetchTips = async () => {
      const { data, error } = await supabase.from("tips").select("*").order("created_at", { ascending: false });
      if (!error) setTips(data);
    };
    fetchResources();
    fetchTips();

    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user || null));

    const { subscription } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user || null));
    return () => subscription?.unsubscribe?.();
  }, []);

  // SPA Pages
  if (page === "check") {
    return <Check goBack={() => setPage("app")} goToLink={() => setPage("link")} />;
  }

  if (page === "link") {
    return <LinkPage goBack={() => setPage("app")} />;
  }

  return (
    <div className="app">
      <Navbar setActiveTab={setActiveTab} />
      <div className="content">
        {/* Home */}
        {activeTab === "home" && (
          <>
            <section className="about-section">
              <h4>📚 UCAT Review Links with Answers</h4>
              <div className="about-card">
                <p><strong>Are You UCAT-Ready? Test Yourself Now!</strong></p>
                <p>
                  Preparing for UCAT can be overwhelming, but you don’t have to do it alone. Take our interactive quizzes designed specifically for UCAT students and evaluate your strengths and weaknesses instantly. Each quiz comes with full explanations and answers, so you’ll learn while you test yourself.
                </p>
                <p>
                  <button onClick={() => setPage("check")} className="text-blue-500 hover:underline font-semibold">
                    👉 Go to UCAT Quiz
                  </button>
                </p>
              </div>
            </section>

            <Resources resources={resources.slice(0, 3)} />
            <StudyTips tips={tips.slice(0, 4)} selectedTip={selectedTip} setSelectedTip={setSelectedTip} />
          </>
        )}

        {/* Other tabs */}
        {activeTab === "resources" && <Resources resources={resources} />}
        {activeTab === "tips" && <StudyTips tips={tips} selectedTip={selectedTip} setSelectedTip={setSelectedTip} />}
        {activeTab === "about" && (
          <section className="about-section">
            <h1>📚 About MedEntryWay</h1>
            <div className="about-card">
              <p><strong>MedEntryWay</strong> provides structured UCAT resources, tips, and expert guidance to help medical students succeed.</p>
            </div>
          </section>
        )}
        {activeTab === "contact" && <section className="contact-section"><div className="contact-card">
      <h1>📬 Contact Us</h1>
      <p>Email: <a href="mailto:blaisehazakorimana@gmail.com">blaisehazakorimana@gmail.com</a></p>
      <p>Phone: <a href="tel:+250782042896">+250 782 042 896</a></p> </div>
      </section>}

        {/* Admin */}
        {activeTab === "admin" && user && !showAdmin && <Upload user={user} goToAdmin={() => setShowAdmin(true)} />}
        {showAdmin && user && <AdminCodes user={user} goBack={() => setShowAdmin(false)} />}
        {activeTab === "admin" && !user && <Auth setActiveTab={setActiveTab} />}
      </div>
    </div>
  );
}
