import { useEffect, useState } from "react";

function App() {
  const [journal, setJournal] = useState("Loading...");
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    // Simulate loading with a slight delay for smooth transition
    fetch("/daily-journal.md")
      .then(res => {
        if (!res.ok) throw new Error("File not found");
        return res.text();
      })
      .then(txt => {
        setTimeout(() => {
          setJournal(txt);
          setIsLoading(false);
        }, 500);
      })
      .catch((err) => {
        setJournal("Error: " + err.message);
        setIsLoading(false);
      });
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const adjustFontSize = (delta) => {
    setFontSize(prev => Math.min(Math.max(prev + delta, 12), 24));
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: theme === "light" 
        ? "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" 
        : "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      color: theme === "light" ? "#2d3748" : "#e2e8f0",
      transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      position: "relative",
      overflow: "hidden"
    },
    wrapper: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "40px 20px",
      position: "relative",
      zIndex: 10
    },
    header: {
      textAlign: "center",
      marginBottom: "40px",
      animation: "fadeInDown 0.8s ease-out"
    },
    title: {
      fontSize: "3rem",
      fontWeight: "300",
      letterSpacing: "-0.02em",
      marginBottom: "10px",
      // We'll apply the gradient to the main text only; emoji gets a solid color
      display: "inline-flex",
      alignItems: "baseline",
      gap: "10px"
    },
    titleEmoji: {
      // Make emoji align with the text baseline and match line-height
      fontSize: "2.6rem",
      verticalAlign: "baseline",
      lineHeight: 1,
      // Solid color that contrasts in both themes
      color: theme === "light" ? "#3b82f6" : "#7dd3fc"
    },
    titleText: {
      fontSize: "3rem",
      fontWeight: "300",
      letterSpacing: "-0.02em",
      marginBottom: "10px",
      background: theme === "light"
        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        : "linear-gradient(135deg, #00d2ff 0%, #3a47d5 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: theme === "light" ? "transparent" : "#e2e8f0",
      backgroundClip: "text",
      color: theme === "light" ? "transparent" : "#e2e8f0",
      textShadow: theme === "light" ? "none" : "0 1px 0 rgba(0,0,0,0.35)",
      display: "inline-block",
      lineHeight: 1
    },
    subtitle: {
      fontSize: "1.1rem",
      opacity: 0.7,
      fontStyle: "italic"
    },
    controls: {
      display: "flex",
      justifyContent: "center",
      gap: "15px",
      marginBottom: "30px",
      flexWrap: "wrap"
    },
    button: {
      padding: "10px 20px",
      border: "none",
      borderRadius: "25px",
      background: theme === "light"
        ? "rgba(255, 255, 255, 0.9)"
        : "rgba(255, 255, 255, 0.1)",
      color: theme === "light" ? "#4a5568" : "#e2e8f0",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontSize: "14px",
      fontWeight: "500",
      backdropFilter: "blur(10px)",
      boxShadow: theme === "light"
        ? "0 4px 15px rgba(0, 0, 0, 0.1)"
        : "0 4px 15px rgba(255, 255, 255, 0.1)",
      display: "flex",
      alignItems: "center",
      gap: "5px"
    },
    journalContainer: {
      background: theme === "light"
        ? "rgba(255, 255, 255, 0.95)"
        : "rgba(255, 255, 255, 0.05)",
      borderRadius: "20px",
      padding: "30px",
      boxShadow: theme === "light"
        ? "0 15px 35px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07)"
        : "0 15px 35px rgba(0, 0, 0, 0.3), 0 5px 15px rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(10px)",
      border: theme === "light"
        ? "1px solid rgba(255, 255, 255, 0.8)"
        : "1px solid rgba(255, 255, 255, 0.1)",
      animation: "fadeInUp 0.8s ease-out 0.2s both",
      position: "relative",
      overflow: "hidden"
    },
    journalContent: {
      whiteSpace: "pre-wrap",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      fontSize: `${fontSize}px`,
      lineHeight: "1.8",
      color: theme === "light" ? "#2d3748" : "#cbd5e0",
      transition: "font-size 0.3s ease"
    },
    loader: {
      textAlign: "center",
      fontSize: "1.2rem",
      opacity: 0.6,
      animation: "pulse 1.5s ease-in-out infinite"
    },
    footer: {
      textAlign: "center",
      marginTop: "40px",
      fontSize: "0.9rem",
      opacity: 0.7,
      animation: "fadeIn 1s ease-out 0.5s both"
    },
    decorativeCircle: {
      position: "absolute",
      borderRadius: "50%",
      background: theme === "light"
        ? "radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)"
        : "radial-gradient(circle, rgba(0, 210, 255, 0.1) 0%, transparent 70%)",
      animation: "float 20s ease-in-out infinite",
      pointerEvents: "none"
    }
  };

  // Helper to render journal text with date highlights
  function renderJournal(text, themeMode) {
    const lines = text.split(/\r?\n/).filter(Boolean);
    return lines.map((line, idx) => {
      // Match ISO-like date at start (e.g., 2025-10-10) or with spaces
      const match = line.match(/^(\s*)(\d{4}-\d{2}-\d{2})(\s*-?\s*)(.*)$/);
      if (match) {
        const [, leading, date, sep, rest] = match;
        const dateColor = themeMode === 'light' ? '#2b6cb0' : '#90cdf4';
        return (
          <div key={idx} style={{ marginBottom: '8px' }}>
            <span style={{ color: dateColor, fontWeight: 600 }}>{leading}{date}</span>
            <span style={{ color: themeMode === 'light' ? '#4a5568' : '#cbd5e0' }}>{sep}{rest}</span>
          </div>
        );
      }
      return (
        <div key={idx} style={{ marginBottom: '8px', color: themeMode === 'light' ? '#4a5568' : '#cbd5e0' }}>{line}</div>
      );
    });
  }

  const keyframes = `
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
    
    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      25% { transform: translate(100px, -100px) scale(1.1); }
      50% { transform: translate(-100px, -200px) scale(0.9); }
      75% { transform: translate(-50px, -50px) scale(1.05); }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.container}>
        {/* Decorative background elements */}
        <div style={{...styles.decorativeCircle, width: "500px", height: "500px", top: "-250px", right: "-250px"}} />
        <div style={{...styles.decorativeCircle, width: "300px", height: "300px", bottom: "-150px", left: "-150px", animationDelay: "10s"}} />
        
        <div style={styles.wrapper}>
          <header style={styles.header}>
          {/* force remount when theme changes so gradient/text-fill re-applies */}
          <h1 key={theme} style={styles.title}>
            <span style={styles.titleEmoji}>📓</span>
            <span style={styles.titleText}>Daily Journal</span>
          </h1>
            <p style={styles.subtitle}>Your thoughts, beautifully preserved</p>
          </header>

          <div style={styles.controls}>
            <button 
              style={styles.button}
              onClick={toggleTheme}
              onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
            >
              {theme === "light" ? "🌙" : "☀️"} {theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>
            <button 
              style={styles.button}
              onClick={() => adjustFontSize(-2)}
              onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
            >
              A- Smaller
            </button>
            <button 
              style={styles.button}
              onClick={() => adjustFontSize(2)}
              onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
            >
              A+ Larger
            </button>
          </div>

          <div style={styles.journalContainer}>
            {isLoading ? (
              <div style={styles.loader}>✨ Loading your journal...</div>
            ) : (
              <div style={styles.journalContent}>
                {renderJournal(journal, theme)}
              </div>
            )}
          </div>

          <footer style={styles.footer}>
            <p>✏️ Edit <code style={{
              padding: "2px 6px",
              background: theme === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.1)",
              borderRadius: "3px"
            }}>public/daily-journal.md</code> and commit daily ✅</p>
            <p style={{ marginTop: "10px", fontSize: "0.8rem" }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;