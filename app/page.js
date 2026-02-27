"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Rubric definitions ───
const RUBRIC = {
  consistency: { label: "Consistency", description: "How uniform is the tone and voice across all content on the page?" },
  clarity: { label: "Clarity", description: "Is the messaging easy to understand? Does it avoid jargon without losing meaning?" },
  differentiation: { label: "Differentiation", description: "Does the voice stand apart from competitors? Would you recognize it without seeing the logo?" },
  audience_fit: { label: "Audience Fit", description: "Does the voice match what the target audience expects and responds to?" },
  emotional_resonance: { label: "Emotional Resonance", description: "Does the messaging create a feeling? Does it make you care?" }
};

const VOICE_SCORE_EXPLAINER = {
  title: "How the Voice Score works",
  description: "The Voice Score is a weighted composite of five brand voice dimensions, each scored 0\u2013100 against a defined rubric.",
  ranges: [
    { range: "90\u2013100", label: "Exceptional", description: "A distinctive, unmistakable brand voice that\u2019s consistent, clear, differentiated, audience-aligned, and emotionally resonant. Very rare." },
    { range: "75\u201389", label: "Strong", description: "A well-developed voice with clear personality. Minor inconsistencies or gaps in one or two dimensions. Most strong brands land here." },
    { range: "60\u201374", label: "Developing", description: "The foundation is there but the voice isn\u2019t fully formed. Some dimensions are strong, others need attention." },
    { range: "40\u201359", label: "Inconsistent", description: "Noticeable gaps across multiple dimensions. The brand voice shifts depending on the page or section." },
    { range: "Below 40", label: "Undefined", description: "No clear voice identity. Content reads as generic or templated with no distinct personality." }
  ],
  dimensions: [
    { name: "Consistency", weight: "How uniform the tone is across all content" },
    { name: "Clarity", weight: "How easily the messaging communicates value" },
    { name: "Differentiation", weight: "How distinct the voice is from competitors" },
    { name: "Audience Fit", weight: "How well the voice matches the target audience" },
    { name: "Emotional Resonance", weight: "How effectively the messaging creates feeling" }
  ]
};

// ─── Loading stages ───
const LOADING_STAGES = [
  { pct: 0, label: "Connecting to site..." },
  { pct: 15, label: "Reading page content..." },
  { pct: 35, label: "Analyzing brand messaging..." },
  { pct: 55, label: "Scoring voice dimensions..." },
  { pct: 75, label: "Finding comparable companies..." },
  { pct: 90, label: "Building your report..." },
  { pct: 100, label: "Finalizing..." }
];

// ─── Styles ───
const F = {
  heading: "var(--font-biryani), -apple-system, sans-serif",
  body: "var(--font-biryani), -apple-system, sans-serif",
};

// ─── Background ───
function BGGrid() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 0, overflow: "hidden",
      background: "#0a0a0c",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />
      <div style={{
        position: "absolute", top: "-20%", right: "-10%",
        width: "60%", height: "60%",
        background: "radial-gradient(ellipse, rgba(255,255,255,0.015) 0%, transparent 70%)",
        borderRadius: "50%",
      }} />
    </div>
  );
}

// ─── Loading bar ───
function LoadingBar() {
  const [stageIdx, setStageIdx] = useState(0);
  const [smoothPct, setSmoothPct] = useState(0);

  useEffect(() => {
    const timings = [800, 2500, 4000, 5000, 3000, 2000, 1500];
    let current = 0;
    let timeouts = [];
    let cumulative = 0;
    for (let i = 0; i < timings.length; i++) {
      cumulative += timings[i];
      timeouts.push(setTimeout(() => {
        current++;
        if (current < LOADING_STAGES.length) {
          setStageIdx(current);
          setSmoothPct(LOADING_STAGES[current].pct);
        }
      }, cumulative));
    }
    return () => timeouts.forEach(clearTimeout);
  }, []);

  const stage = LOADING_STAGES[stageIdx];

  return (
    <div style={{ padding: "64px 20px", maxWidth: 420, margin: "0 auto", animation: "fadeUp 0.5s ease-out" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: F.body, fontWeight: 500 }}>{stage.label}</span>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", fontFamily: F.body, fontVariantNumeric: "tabular-nums" }}>{Math.round(smoothPct)}%</span>
      </div>
      <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 2, background: "rgba(255,255,255,0.6)",
          width: `${smoothPct}%`, transition: "width 1.5s cubic-bezier(0.4, 0, 0.2, 1)"
        }} />
      </div>
    </div>
  );
}

// ─── Voice Score Modal ───
function VoiceScoreModal({ score, onClose }) {
  const getRange = (s) => {
    if (s >= 90) return VOICE_SCORE_EXPLAINER.ranges[0];
    if (s >= 75) return VOICE_SCORE_EXPLAINER.ranges[1];
    if (s >= 60) return VOICE_SCORE_EXPLAINER.ranges[2];
    if (s >= 40) return VOICE_SCORE_EXPLAINER.ranges[3];
    return VOICE_SCORE_EXPLAINER.ranges[4];
  };
  const currentRange = getRange(score);

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.7)",
      backdropFilter: "blur(8px)", display: "flex", alignItems: "center",
      justifyContent: "center", padding: 24, animation: "fadeUp 0.3s ease-out"
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#141418", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16, padding: 36, maxWidth: 520, width: "100%", maxHeight: "80vh", overflowY: "auto"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "white", margin: "0 0 4px", fontFamily: F.heading }}>{VOICE_SCORE_EXPLAINER.title}</h3>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0, fontFamily: F.body }}>{VOICE_SCORE_EXPLAINER.description}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 18, padding: "0 0 0 16px" }}>✕</button>
        </div>
        <div style={{
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 10, padding: "16px 20px", marginBottom: 28
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: "white", fontFamily: F.heading, fontVariantNumeric: "tabular-nums" }}>{score}</span>
            <span style={{ padding: "3px 10px", borderRadius: 12, background: "rgba(255,255,255,0.08)", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)", fontFamily: F.body }}>{currentRange.label}</span>
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0, fontFamily: F.body, lineHeight: 1.6 }}>{currentRange.description}</p>
        </div>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 14, fontFamily: F.body, fontWeight: 600 }}>Score Ranges</div>
          {VOICE_SCORE_EXPLAINER.ranges.map((r) => {
            const active = r.label === currentRange.label;
            return (
              <div key={r.range} style={{ display: "flex", gap: 14, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", opacity: active ? 1 : 0.5 }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", minWidth: 56, fontFamily: F.body, fontVariantNumeric: "tabular-nums" }}>{r.range}</span>
                <span style={{ fontSize: 12, color: active ? "white" : "rgba(255,255,255,0.5)", fontFamily: F.body, fontWeight: active ? 600 : 400, minWidth: 90 }}>{r.label}</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: F.body, lineHeight: 1.5 }}>{r.description}</span>
              </div>
            );
          })}
        </div>
        <div>
          <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 14, fontFamily: F.body, fontWeight: 600 }}>Dimensions Measured</div>
          {VOICE_SCORE_EXPLAINER.dimensions.map((d) => (
            <div key={d.name} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontFamily: F.body, fontWeight: 500 }}>{d.name}</span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: F.body }}>{d.weight}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Score bar ───
function ScoreBar({ dimension, score, reasoning, delay = 0 }) {
  const [width, setWidth] = useState(0);
  const [tip, setTip] = useState(false);
  const info = RUBRIC[dimension] || { label: dimension, description: "" };
  useEffect(() => { const t = setTimeout(() => setWidth(score), 300 + delay); return () => clearTimeout(t); }, [score, delay]);

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontFamily: F.body, fontWeight: 500 }}>{info.label}</span>
          <span onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)} style={{
            fontSize: 11, color: "rgba(255,255,255,0.25)", cursor: "help", width: 16, height: 16, borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.15)", display: "inline-flex", alignItems: "center", justifyContent: "center", position: "relative", fontFamily: F.body
          }}>
            ?
            {tip && <div style={{
              position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
              width: 260, padding: "10px 14px", background: "#1a1a22", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, fontSize: 12, lineHeight: 1.5, color: "rgba(255,255,255,0.6)", fontFamily: F.body,
              zIndex: 10, pointerEvents: "none", boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
            }}>{info.description}</div>}
          </span>
        </div>
        <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", fontFamily: F.body, fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{score}</span>
      </div>
      <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.06)", marginBottom: 6 }}>
        <div style={{ height: "100%", borderRadius: 2, background: "rgba(255,255,255,0.7)", width: `${width}%`, transition: "width 1.4s cubic-bezier(0.4, 0, 0.2, 1)" }} />
      </div>
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: 0, fontFamily: F.body, lineHeight: 1.5, fontStyle: "italic" }}>{reasoning}</p>
    </div>
  );
}

// ─── Score ring ───
function ScoreRing({ score, size = 130 }) {
  const r = (size - 14) / 2;
  const c = 2 * Math.PI * r;
  const [offset, setOffset] = useState(c);
  useEffect(() => { const t = setTimeout(() => setOffset(c - (score / 100) * c), 400); return () => clearTimeout(t); }, [score, c]);

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={5} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth={5}
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.8s cubic-bezier(0.4, 0, 0.2, 1)" }} />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        fill="white" fontSize={size * 0.3} fontWeight="700"
        style={{ transform: "rotate(90deg)", transformOrigin: "center", fontFamily: F.heading }}>
        {score}
      </text>
    </svg>
  );
}

// ─── Small components ───
function Label({ children }) {
  return <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 16, fontFamily: F.body, fontWeight: 600 }}>{children}</div>;
}

function Card({ children, style }) {
  return <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 28, ...style }}>{children}</div>;
}

function ArrowLink({ children, onClick }) {
  const [h, setH] = useState(false);
  return (
    <span onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      color: h ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
      cursor: "pointer", fontSize: 14, fontFamily: F.body, transition: "color 0.2s", fontWeight: 500
    }}>
      {children}
      <span style={{ transition: "transform 0.2s", transform: h ? "translateX(3px)" : "translateX(0)" }}>\u2192</span>
    </span>
  );
}

function TextLink({ children, onClick }) {
  const [h, setH] = useState(false);
  return (
    <span onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      color: h ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)",
      cursor: "pointer", fontSize: 12, fontFamily: F.body, transition: "color 0.2s",
      textDecoration: "underline", textDecorationColor: h ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)", textUnderlineOffset: 3
    }}>{children}</span>
  );
}

// ─── Results view ───
function ResultsView({ data, url, onReset, onAnalyze }) {
  const dims = ["consistency", "clarity", "differentiation", "audience_fit", "emotional_resonance"];
  const [showExplainer, setShowExplainer] = useState(false);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px", animation: "fadeUp 0.6s ease-out" }}>
      {showExplainer && <VoiceScoreModal score={data.voice_score} onClose={() => setShowExplainer(false)} />}

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 48, fontSize: 13, fontFamily: F.body }}>
        <ArrowLink onClick={onReset}>\u2190 new analysis</ArrowLink>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
        <span style={{ color: "rgba(255,255,255,0.35)" }}>{url}</span>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h1 style={{ fontSize: 42, fontWeight: 700, color: "white", margin: "0 0 8px", fontFamily: F.heading, lineHeight: 1.1 }}>{data.brand_name}</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
          <span style={{ padding: "5px 14px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.12)", fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: F.body, letterSpacing: "0.03em" }}>{data.personality}</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 32, marginBottom: 48, alignItems: "start" }}>
        <div style={{ textAlign: "center" }}>
          <Label>Voice Score</Label>
          <ScoreRing score={data.voice_score} />
          <div style={{ marginTop: 12 }}><TextLink onClick={() => setShowExplainer(true)}>What does this mean?</TextLink></div>
        </div>
        <div>
          <Label>Voice Summary</Label>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.7)", margin: "0 0 12px", fontFamily: F.body }}>{data.voice_summary}</p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0, fontFamily: F.body, lineHeight: 1.5, fontStyle: "italic" }}>{data.voice_score_reasoning}</p>
        </div>
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 48 }} />

      <div style={{ marginBottom: 48 }}>
        <Label>Scoring Rubric</Label>
        {dims.map((dim, i) => <ScoreBar key={dim} dimension={dim} score={data.scores[dim]?.score || 0} reasoning={data.scores[dim]?.reasoning || ""} delay={i * 120} />)}
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 48 }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 48 }}>
        <div>
          <Label>Strengths</Label>
          {data.strengths.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, lineHeight: "22px", fontFamily: F.body }}>+</span>
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: "22px", fontFamily: F.body }}>{s}</span>
            </div>
          ))}
        </div>
        <div>
          <Label>Gaps</Label>
          {data.gaps.map((g, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, lineHeight: "22px", fontFamily: F.body }}>\u2013</span>
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: "22px", fontFamily: F.body }}>{g}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 48 }}>
        <Label>Recommendations</Label>
        {data.recommendations.map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 0", borderBottom: i < data.recommendations.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontWeight: 600, fontFamily: F.body, minWidth: 20, fontVariantNumeric: "tabular-nums" }}>{String(i + 1).padStart(2, "0")}</span>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, fontFamily: F.body }}>{r}</span>
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 48 }} />

      {data.comparable_company && (
        <Card style={{ marginBottom: 48 }}>
          <Label>Comparable Company</Label>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ fontSize: 18, color: "white", margin: "0 0 6px", fontFamily: F.heading, fontWeight: 700 }}>{data.comparable_company.name}</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0, fontFamily: F.body, lineHeight: 1.5 }}>{data.comparable_company.comparison_note}</p>
            </div>
            <ArrowLink onClick={() => onAnalyze(data.comparable_company.url)}>Analyze {data.comparable_company.name}</ArrowLink>
          </div>
        </Card>
      )}

      <div style={{ textAlign: "center", padding: "24px 0", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontFamily: F.body, letterSpacing: "0.04em" }}>
          Built by Tyler Scholl  /  Vibe coded with Claude  /  beyondthecreative.xyz
        </span>
      </div>
    </div>
  );
}

// ─── Main page ───
export default function Home() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState("idle");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [analyzedUrl, setAnalyzedUrl] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (state === "idle" && inputRef.current) inputRef.current.focus();
  }, [state]);

  const analyze = useCallback(async (targetUrl) => {
    const raw = targetUrl || url;
    if (!raw.trim()) return;

    let cleanUrl = raw.trim().replace(/\/+$/, "").replace(/^https?:\/\//, "").replace(/^www\./, "");
    const displayUrl = cleanUrl;

    setState("loading");
    setError("");
    setAnalyzedUrl(displayUrl);
    setUrl(displayUrl);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: "https://" + cleanUrl })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setResults(data);
      setState("results");
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
      setState("error");
    }
  }, [url]);

  const reset = () => { setState("idle"); setUrl(""); setResults(null); setError(""); setAnalyzedUrl(""); };

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        input::placeholder { color: rgba(255,255,255,0.2); }
        input:focus { outline: none; border-color: rgba(255,255,255,0.25) !important; }
        * { box-sizing: border-box; }
      `}</style>

      <BGGrid />

      <div style={{ position: "relative", zIndex: 1 }}>
        {state === "results" && results ? (
          <ResultsView data={results} url={analyzedUrl} onReset={reset} onAnalyze={analyze} />
        ) : (
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <div style={{ animation: "fadeUp 0.7s ease-out", textAlign: "center", maxWidth: 540 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 32, fontFamily: F.body, fontWeight: 600 }}>
                AI-Powered Brand Analysis
              </div>

              <h1 style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.1, margin: "0 0 20px", fontFamily: F.heading, color: "white" }}>
                Brand Voice<br />Analyzer
              </h1>

              <p style={{ fontSize: 15, lineHeight: 1.65, color: "rgba(255,255,255,0.4)", margin: "0 auto 44px", maxWidth: 400, fontFamily: F.body }}>
                Paste any URL. Get an instant AI audit of tone, voice attributes, strengths, and actionable recommendations &mdash; scored against a defined rubric.
              </p>

              {state !== "loading" && (
                <div style={{ display: "flex", gap: 10, maxWidth: 480, margin: "0 auto" }}>
                  <input ref={inputRef} type="text" value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && analyze()}
                    placeholder="(website here)"
                    style={{
                      flex: 1, padding: "13px 16px", background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
                      color: "white", fontSize: 15, fontFamily: F.body, transition: "border-color 0.2s"
                    }}
                  />
                  <button onClick={() => analyze()} style={{
                    padding: "13px 24px", background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8,
                    color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer",
                    fontFamily: F.body, transition: "all 0.2s", letterSpacing: "0.03em"
                  }}>
                    Analyze →
                  </button>
                </div>
              )}

              {error && (
                <div style={{ marginTop: 20 }}>
                  <p style={{ fontSize: 13, color: "rgba(255,120,120,0.8)", fontFamily: F.body, marginBottom: 12 }}>{error}</p>
                  <button onClick={() => { setError(""); setState("idle"); }} style={{
                    background: "none", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8,
                    padding: "8px 16px", color: "rgba(255,255,255,0.5)", fontSize: 13, fontFamily: F.body, cursor: "pointer"
                  }}>Try again</button>
                </div>
              )}

              {state === "loading" && <LoadingBar />}

              {state === "idle" && (
                <p style={{ marginTop: 56, fontSize: 11, color: "rgba(255,255,255,0.15)", fontFamily: F.body, letterSpacing: "0.04em" }}>
                  Built by Tyler Scholl  /  Vibe coded with Claude
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
