import { useEffect, useState, useRef } from "react";

const DEMO = `2025-01-05 - Started the new year with a long walk by the beach. The air was crisp and everything felt possible.
2025-01-12 - Read two chapters of a novel I had been putting off for months. It was worth every page.
2025-01-20 - Cooked a big pot of soup and shared it with the neighbors. Simple days are the best days.
2025-02-03 - February fog rolled in early. Made tea and watched the city disappear into white.
2025-02-14 - Surprised myself by enjoying a quiet Valentine's evening alone with a good film.
2025-02-22 - Long phone call with an old friend. We laughed until it hurt.
2025-03-08 - Spring is hinting. The trees have that electric green on their tips.
2025-03-17 - Rearranged my whole desk setup. Feels like a new brain.
2025-03-29 - Planted basil and mint on the windowsill. Hopeful little things.
2025-04-04 - April rain. Stayed in and wrote letters I'll never send.
2025-04-19 - Went to a small art exhibition. One painting stopped me cold for ten minutes.
2025-04-28 - Made pancakes for dinner. No occasion needed.
2025-05-02 - First iced coffee of the season. A ritual.`;

const MONTH_COLORS = [
  { bg: "#FFF5F5", accent: "#FF6B6B", light: "#FFE0E0", text: "#C0392B", dot: "#FF6B6B" },
  { bg: "#FFF9F0", accent: "#FF9F43", light: "#FFE8CC", text: "#D35400", dot: "#FF9F43" },
  { bg: "#FFFEF0", accent: "#F9CA24", light: "#FFF8CC", text: "#B7950B", dot: "#F9CA24" },
  { bg: "#F0FFF4", accent: "#2ECC71", light: "#CCFFE0", text: "#1E8449", dot: "#2ECC71" },
  { bg: "#F0FBFF", accent: "#17A2D0", light: "#CCF0FF", text: "#117A8B", dot: "#17A2D0" },
  { bg: "#F5F0FF", accent: "#9B59B6", light: "#E8D5FF", text: "#7D3C98", dot: "#9B59B6" },
  { bg: "#FFF0FB", accent: "#E91E8C", light: "#FFD6F0", text: "#9C1165", dot: "#E91E8C" },
  { bg: "#FFF7F0", accent: "#E67E22", light: "#FFE4CC", text: "#BA6A1A", dot: "#E67E22" },
  { bg: "#F0FFF8", accent: "#1ABC9C", light: "#CCFFF0", text: "#148F77", dot: "#1ABC9C" },
  { bg: "#FFF0F0", accent: "#E74C3C", light: "#FFCCCC", text: "#A93226", dot: "#E74C3C" },
  { bg: "#F0F4FF", accent: "#3498DB", light: "#CCE0FF", text: "#2471A3", dot: "#3498DB" },
  { bg: "#F5FFF0", accent: "#27AE60", light: "#D5FFCC", text: "#1D8348", dot: "#27AE60" },
];

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTH_EMOJIS = ["❄️","💝","🌸","🌿","☀️","🌊","🌻","🍂","🍁","🎃","🍂","⛄"];

function parseAndGroup(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const byMonth = {};
  lines.forEach((line) => {
    const m = line.match(/^(\d{4})-(\d{2})-(\d{2})\s*[-–]?\s*(.*)$/);
    if (m) {
      const [, year, month, day, content] = m;
      const key = `${year}-${month}`;
      if (!byMonth[key]) byMonth[key] = { year, month: parseInt(month), entries: [] };
      byMonth[key].entries.push({ day: parseInt(day), text: content, full: `${year}-${month}-${day}` });
    }
  });
  return Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, val]) => ({ ...val, key }));
}

function DayOfWeek({ dateStr }) {
  const d = new Date(dateStr + "T00:00:00");
  return <span>{d.toLocaleDateString("en-US", { weekday: "short" })}</span>;
}

export default function App() {
  const [rawText, setRawText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dark, setDark] = useState(false);
  const [fontSize, setFontSize] = useState(15);
  const [expandedMonths, setExpandedMonths] = useState({});
  const [activeMonth, setActiveMonth] = useState(null);
  const monthRefs = useRef({});

  useEffect(() => {
    fetch("/daily-journal.md")
      .then((r) => { if (!r.ok) throw new Error(); return r.text(); })
      .then((t) => { setRawText(t); setIsLoading(false); })
      .catch(() => { setRawText(DEMO); setIsLoading(false); });
  }, []);

  const groups = parseAndGroup(rawText);

  useEffect(() => {
    if (groups.length > 0) {
      const all = {};
      groups.forEach((g) => { all[g.key] = true; });
      setExpandedMonths(all);
      setActiveMonth(groups[groups.length - 1]?.key);
    }
  }, [rawText]);

  const toggleMonth = (key) => {
    setExpandedMonths((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const scrollToMonth = (key) => {
    setActiveMonth(key);
    if (!expandedMonths[key]) setExpandedMonths((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      monthRefs.current[key]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const bg = dark ? "#0D0F14" : "#F7F5F2";
  const cardBg = dark ? "#161820" : "#FFFFFF";
  const border = dark ? "#252730" : "#EDEBE6";
  const textPrimary = dark ? "#E8E6E0" : "#1A1816";
  const textSecondary = dark ? "#6B6E7A" : "#8A8580";
  const navBg = dark ? "#111318" : "#FAFAF8";
  const totalEntries = groups.reduce((s, g) => s + g.entries.length, 0);
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${bg}; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${border}; border-radius: 2px; }
        .month-card { transition: box-shadow 0.2s; }
        .month-card:hover { box-shadow: 0 6px 28px rgba(0,0,0,0.09) !important; }
        .entry-row { transition: background 0.15s; border-radius: 10px; }
        .entry-row:hover { background: ${dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.025)"} !important; }
        .nav-item { transition: all 0.15s; cursor: pointer; border-radius: 8px; }
        .nav-item:hover { opacity: 1 !important; background: ${dark ? "#1E2028" : "#F0EEE8"} !important; }
        .ctrl-btn { transition: opacity 0.15s; cursor: pointer; }
        .ctrl-btn:hover { opacity: 0.7; }
        .month-header { cursor: pointer; transition: opacity 0.15s; }
        .month-header:hover { opacity: 0.92; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease both; }
        @keyframes slideDown { from { opacity:0; max-height:0; } to { opacity:1; max-height:9999px; } }
        .slide-down { animation: slideDown 0.3s ease both; }
      `}</style>

      <div style={{ minHeight: "100vh", background: bg, fontFamily: "'DM Sans', sans-serif", transition: "background 0.3s" }}>

        {/* ── STICKY HEADER ── */}
        <div style={{
          position: "sticky", top: 0, zIndex: 100,
          background: navBg + "F0",
          borderBottom: `1px solid ${border}`,
          backdropFilter: "blur(16px)",
        }}>
          <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 1.5rem", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 24 }}>📓</span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: textPrimary, fontFamily: "'Lora', serif", letterSpacing: "-0.02em" }}>My Journal</div>
                <div style={{ fontSize: 11, color: textSecondary }}>{today}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ padding: "4px 12px", borderRadius: 99, background: dark ? "#1E2028" : "#EEF0E8", fontSize: 12, color: textSecondary }}>
                {totalEntries} entries · {groups.length} months
              </div>
              <div style={{ width: 1, height: 20, background: border }} />
              <button className="ctrl-btn" onClick={() => setFontSize(f => Math.max(f-1,12))} style={{ background: "none", border: "none", fontSize: 13, color: textSecondary, padding: "4px 8px", borderRadius: 6 }}>A−</button>
              <button className="ctrl-btn" onClick={() => setFontSize(f => Math.min(f+1,20))} style={{ background: "none", border: "none", fontSize: 14, fontWeight: 500, color: textSecondary, padding: "4px 8px", borderRadius: 6 }}>A+</button>
              <div style={{ width: 1, height: 20, background: border }} />
              <button className="ctrl-btn" onClick={() => setDark(!dark)} style={{
                background: dark ? "#252730" : "#EEF0E8",
                border: "none", borderRadius: 99,
                padding: "6px 14px", fontSize: 12,
                color: textSecondary, display: "flex", alignItems: "center", gap: 6,
              }}>
                <span style={{ fontSize: 14 }}>{dark ? "☀️" : "🌙"}</span>
                {dark ? "Light" : "Dark"}
              </button>
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div style={{ maxWidth: 920, margin: "0 auto", padding: "2rem 1.5rem", display: "flex", gap: "1.75rem", alignItems: "flex-start" }}>

          {/* ── SIDEBAR ── */}
          <div style={{ width: 172, flexShrink: 0 }}>
            <div style={{ position: "sticky", top: 80 }}>
              <div style={{ fontSize: 10, fontWeight: 500, color: textSecondary, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem", paddingLeft: 4 }}>
                Jump to
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {groups.map((g) => {
                  const color = MONTH_COLORS[(g.month - 1) % 12];
                  const isActive = activeMonth === g.key;
                  return (
                    <div key={g.key} className="nav-item"
                      onClick={() => scrollToMonth(g.key)}
                      style={{
                        display: "flex", alignItems: "center", gap: 9,
                        padding: "7px 10px",
                        background: isActive ? (dark ? "#1E2028" : color.light) : "transparent",
                        opacity: isActive ? 1 : 0.6,
                        border: `1px solid ${isActive ? (dark ? color.dot + "40" : color.light) : "transparent"}`,
                      }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color.dot, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: isActive ? 500 : 400, color: isActive ? (dark ? color.dot : color.text) : textPrimary, lineHeight: 1.2 }}>
                          {MONTH_NAMES[g.month - 1]}
                        </div>
                        <div style={{ fontSize: 11, color: textSecondary }}>{g.year} · {g.entries.length}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── ENTRIES FEED ── */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {isLoading ? (
              <div style={{ textAlign: "center", padding: "5rem 0", color: textSecondary, fontSize: 14 }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>✨</div>
                Loading your journal…
              </div>
            ) : groups.length === 0 ? (
              <div style={{ textAlign: "center", padding: "5rem 0" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <div style={{ fontSize: 15, color: textSecondary }}>No entries yet. Start writing!</div>
              </div>
            ) : (
              groups.map((g, gi) => {
                const color = MONTH_COLORS[(g.month - 1) % 12];
                const isOpen = expandedMonths[g.key];
                return (
                  <div
                    key={g.key}
                    ref={(el) => (monthRefs.current[g.key] = el)}
                    className="month-card fade-up"
                    style={{
                      animationDelay: `${gi * 0.06}s`,
                      background: cardBg,
                      border: `1.5px solid ${dark ? color.dot + "30" : color.light}`,
                      borderRadius: 16,
                      overflow: "hidden",
                      boxShadow: dark ? `0 2px 16px rgba(0,0,0,0.35), 0 0 0 1px ${color.dot}18` : `0 2px 12px rgba(0,0,0,0.04)`,
                    }}>

                    {/* Month Header */}
                    <div
                      className="month-header"
                      onClick={() => toggleMonth(g.key)}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "1rem 1.25rem",
                        background: dark ? `${color.dot}15` : color.bg,
                        borderBottom: isOpen ? `1px solid ${dark ? color.dot + "25" : color.light}` : "none",
                      }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 12,
                          background: dark ? color.dot + "28" : color.light,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 20, flexShrink: 0,
                        }}>
                          {MONTH_EMOJIS[g.month - 1]}
                        </div>
                        <div>
                          <div style={{ fontSize: 19, fontWeight: 600, color: dark ? color.dot : color.text, fontFamily: "'Lora', serif", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                            {MONTH_NAMES[g.month - 1]} <span style={{ fontWeight: 400, opacity: 0.7, fontSize: 15 }}>{g.year}</span>
                          </div>
                          <div style={{ fontSize: 12, color: textSecondary, marginTop: 2 }}>
                            {g.entries.length} {g.entries.length === 1 ? "entry" : "entries"}
                          </div>
                        </div>
                      </div>
                      {/* Entry previews + chevron */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {!isOpen && (
                          <div style={{ display: "flex", gap: 4 }}>
                            {g.entries.slice(0, 4).map((_, i) => (
                              <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: color.dot, opacity: 0.5 + i * 0.1 }} />
                            ))}
                            {g.entries.length > 4 && <span style={{ fontSize: 10, color: textSecondary }}>+{g.entries.length - 4}</span>}
                          </div>
                        )}
                        <div style={{
                          width: 28, height: 28, borderRadius: "50%",
                          background: dark ? color.dot + "22" : color.light,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 13, color: dark ? color.dot : color.text,
                          transition: "transform 0.25s",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          flexShrink: 0,
                        }}>▾</div>
                      </div>
                    </div>

                    {/* Entries */}
                    {isOpen && (
                      <div className="slide-down" style={{ padding: "0.4rem 0.5rem" }}>
                        {g.entries.map((entry, ei) => (
                          <div key={ei} className="entry-row"
                            style={{ display: "flex", gap: "1rem", padding: "0.9rem 0.85rem", alignItems: "flex-start" }}>

                            {/* Day badge */}
                            <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, minWidth: 40 }}>
                              <div style={{
                                width: 38, height: 38, borderRadius: 10,
                                background: dark ? color.dot + "22" : color.light,
                                border: `1px solid ${dark ? color.dot + "30" : color.bg}`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                              }}>
                                <span style={{ fontSize: 15, fontWeight: 600, color: dark ? color.dot : color.text, lineHeight: 1 }}>{entry.day}</span>
                              </div>
                              <span style={{ fontSize: 10, color: textSecondary, textAlign: "center" }}>
                                <DayOfWeek dateStr={entry.full} />
                              </span>
                            </div>

                            {/* Entry text */}
                            <div style={{ flex: 1, paddingTop: 7 }}>
                              <p style={{ fontSize, lineHeight: 1.8, color: textPrimary, fontFamily: "'Lora', serif", fontStyle: "normal" }}>
                                {entry.text}
                              </p>
                            </div>

                            {/* Colored accent */}
                            <div style={{ width: 3, height: 38, borderRadius: 2, background: color.dot, opacity: 0.35, marginTop: 7, flexShrink: 0 }} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Footer */}
            {!isLoading && groups.length > 0 && (
              <div style={{ textAlign: "center", padding: "1.5rem 0 0.5rem", borderTop: `1px solid ${border}`, marginTop: "0.5rem" }}>
                <p style={{ fontSize: 12, color: textSecondary }}>
                  ✏️ Edit{" "}
                  <code style={{ fontFamily: "monospace", fontSize: 11, padding: "2px 7px", background: dark ? "#1E2028" : "#F0EEE8", borderRadius: 4, color: textSecondary }}>
                    public/daily-journal.md
                  </code>{" "}
                  and commit daily ✅
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}