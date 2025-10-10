import { useEffect, useState } from "react";

function App() {
  const [journal, setJournal] = useState("Loading...");

  useEffect(() => {
    fetch("/daily-journal.md")
      .then(res => {
        if (!res.ok) throw new Error("File not found");
        return res.text();
      })
      .then(txt => setJournal(txt))
      .catch((err) => setJournal("Error: " + err.message));
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>📓 Daily Journal</h1>
      <pre style={{ whiteSpace: "pre-wrap", background: "#f7f7f7", padding: 12 }}>
        {journal}
      </pre>
      <p>Edit <code>public/daily-journal.md</code> and commit daily ✅</p>
    </div>
  );
}

export default App;
