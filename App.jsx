import { useState } from "react";

const TONES = [
  { id: "witty", label: "😏 Witty", desc: "Clever & playful" },
  { id: "sweet", label: "🥰 Sweet", desc: "Warm & genuine" },
  { id: "bold", label: "🔥 Bold", desc: "Confident & direct" },
];

const LANGUAGES = [
  { code: "auto", label: "🌐 Auto-detect" },
  { code: "en", label: "🇺🇸 English" },
  { code: "he", label: "🇮🇱 Hebrew" },
  { code: "ar", label: "🇸🇦 Arabic" },
  { code: "es", label: "🇪🇸 Spanish" },
  { code: "ru", label: "🇷🇺 Russian" },
  { code: "fr", label: "🇫🇷 French" },
  { code: "de", label: "🇩🇪 German" },
  { code: "it", label: "🇮🇹 Italian" },
  { code: "pt", label: "🇧🇷 Portuguese" },
  { code: "zh", label: "🇨🇳 Chinese" },
  { code: "ja", label: "🇯🇵 Japanese" },
];

function isRTL(text) {
  return /[\u0590-\u05FF\u0600-\u06FF]/.test(text);
}

export default function App() {
  const [bio, setBio] = useState("");
  const [tone, setTone] = useState("witty");
  const [outputLang, setOutputLang] = useState("auto");
  const [openers, setOpeners] = useState([]);
  const [detectedLang, setDetectedLang] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(null);

  const bioIsRTL = isRTL(bio);
  const openersAreRTL = openers.length > 0 && isRTL(openers[0]);

  const generate = async () => {
    if (!bio.trim()) return;
    setLoading(true);
    setOpeners([]);
    setError("");
    setDetectedLang("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio, tone, outputLang }),
      });

      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      setOpeners(data.openers || []);
      setDetectedLang(data.detectedLanguage || "");
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a0533 0%, #2d0a4e 50%, #1a0533 100%)",
      fontFamily: "'Inter', -apple-system, sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{ width: "100%", maxWidth: 560 }}>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>💘</div>
          <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.5px" }}>
            First Line Generator
          </h1>
          <p style={{ color: "#c084fc", fontSize: 15, margin: 0 }}>
            Paste their bio in any language. Get a perfect opener.
          </p>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
          borderRadius: 20,
          border: "1px solid rgba(192,132,252,0.2)",
          padding: "28px 28px 24px",
        }}>
          <label style={{ color: "#e9d5ff", fontSize: 13, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
            Their Profile Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Paste their bio here — any language works!"
            rows={5}
            dir={bioIsRTL ? "rtl" : "ltr"}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(192,132,252,0.3)",
              borderRadius: 12,
              padding: "14px 16px",
              color: "#fff",
              fontSize: 15,
              lineHeight: 1.6,
              resize: "vertical",
              outline: "none",
              boxSizing: "border-box",
              fontFamily: "inherit",
              textAlign: bioIsRTL ? "right" : "left",
            }}
          />

          <div style={{ marginTop: 20 }}>
            <label style={{ color: "#e9d5ff", fontSize: 13, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
              Opener Language
            </label>
            <select
              value={outputLang}
              onChange={(e) => setOutputLang(e.target.value)}
              style={{
                width: "100%",
                background: "#2d0a4e",
                border: "1px solid rgba(192,132,252,0.3)",
                borderRadius: 12,
                padding: "12px 16px",
                color: "#fff",
                fontSize: 15,
                outline: "none",
                cursor: "pointer",
              }}
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: 20, marginBottom: 24 }}>
            <label style={{ color: "#e9d5ff", fontSize: 13, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: 12 }}>
              Vibe
            </label>
            <div style={{ display: "flex", gap: 10 }}>
              {TONES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  style={{
                    flex: 1,
                    padding: "10px 8px",
                    borderRadius: 12,
                    border: tone === t.id ? "2px solid #c084fc" : "2px solid rgba(255,255,255,0.1)",
                    background: tone === t.id ? "rgba(192,132,252,0.2)" : "rgba(255,255,255,0.04)",
                    color: tone === t.id ? "#e9d5ff" : "#9ca3af",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 18 }}>{t.label.split(" ")[0]}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, marginTop: 2 }}>{t.label.split(" ")[1]}</div>
                  <div style={{ fontSize: 11, opacity: 0.7, marginTop: 1 }}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generate}
            disabled={!bio.trim() || loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 12,
              border: "none",
              background: bio.trim() && !loading ? "linear-gradient(135deg, #9333ea, #ec4899)" : "rgba(255,255,255,0.1)",
              color: bio.trim() && !loading ? "#fff" : "#6b7280",
              fontSize: 16,
              fontWeight: 700,
              cursor: bio.trim() && !loading ? "pointer" : "not-allowed",
            }}
          >
            {loading ? "✨ Crafting your openers…" : "✨ Generate Openers"}
          </button>

          {error && <p style={{ color: "#f87171", fontSize: 14, textAlign: "center", marginTop: 12 }}>{error}</p>}
        </div>

        {openers.length > 0 && (
          <div style={{ marginTop: 24 }}>
            {detectedLang && (
              <p style={{ color: "#a78bfa", fontSize: 13, textAlign: "center", marginBottom: 10 }}>
                🌐 Detected: <strong>{detectedLang}</strong>
              </p>
            )}
            <p style={{ color: "#c084fc", fontSize: 13, fontWeight: 600, textAlign: "center", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Tap to copy
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {openers.map((opener, i) => (
                <button
                  key={i}
                  onClick={() => copyToClipboard(opener, i)}
                  dir={openersAreRTL ? "rtl" : "ltr"}
                  style={{
                    background: copied === i ? "rgba(192,132,252,0.25)" : "rgba(255,255,255,0.06)",
                    border: copied === i ? "1px solid #c084fc" : "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 14,
                    padding: "16px 18px",
                    color: "#fff",
                    fontSize: 15,
                    lineHeight: 1.6,
                    textAlign: openersAreRTL ? "right" : "left",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "flex-start",
                    flexDirection: openersAreRTL ? "row-reverse" : "row",
                    gap: 12,
                  }}
                >
                  <span style={{ fontSize: 12, color: "#c084fc", fontWeight: 700, marginTop: 2, minWidth: 20 }}>
                    {copied === i ? "✓" : `0${i + 1}`}
                  </span>
                  <span>{opener}</span>
                </button>
              ))}
            </div>
            <p style={{ color: "#6b7280", fontSize: 12, textAlign: "center", marginTop: 16 }}>
              Not feeling these? Hit generate again for fresh ones.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
