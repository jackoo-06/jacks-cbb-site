import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// ============================================================
// DATA LOADING — Fetches from JSON files, falls back to sample data
// ============================================================

// Base URL for data files. Update this to your GitHub raw URL or hosting path.
// Examples:
//   Local dev:  "/data"
//   GitHub raw:  "https://raw.githubusercontent.com/yourname/yourrepo/main/data"
//   Vercel:     "/data"
const DATA_URL = "/data";

async function fetchJSON(filename) {
  try {
    const res = await fetch(`${DATA_URL}/${filename}`);
    if (!res.ok) throw new Error(`${res.status}`);
    return await res.json();
  } catch (e) {
    console.log(`Using sample data (${filename} not found)`);
    return null;
  }
}

function useData(filename, fallback) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchJSON(filename).then(d => {
      setData(d || fallback);
      setLoading(false);
    });
  }, []);
  return [data || fallback, loading];
}

// ============================================================
// SAMPLE / FALLBACK DATA (used when JSON files aren't available)
// ============================================================

const SAMPLE_PROJECTIONS = {
  date: "Sample Data",
  updated: "—",
  games: [
    { id: 1, team1: "Team A", team2: "Team B", spread: -5.2, kelly: 3.1, ev: 6.4, blowout: 22, units: 1.0 },
    { id: 2, team1: "Team C", team2: "Team D", spread: -12.8, kelly: 5.6, ev: 11.2, blowout: 55, units: 1.5 },
    { id: 3, team1: "Team E", team2: "Team F", spread: -1.3, kelly: 0, ev: -2.1, blowout: 6, units: 0 },
  ],
};

const SAMPLE_RANKINGS = {
  week: "Sample Data",
  updated: "—",
  teams: [
    { rank: 1, team: "Sample Team 1", rating: 25.0 },
    { rank: 2, team: "Sample Team 2", rating: 24.5 },
    { rank: 3, team: "Sample Team 3", rating: 24.0 },
  ],
};

const SAMPLE_BRACKET = {
  updated: "—",
  regions: {
    "Sample Region": [
      { seed: 1, team: "Team A", rating: 25.0, r32: 95.0, r16: 80.0, e8: 60.0, f4: 40.0, cg: 25.0, champ: 15.0 },
      { seed: 16, team: "Team P", rating: 5.0, r32: 5.0, r16: 1.0, e8: 0.2, f4: 0, cg: 0, champ: 0 },
    ],
  },
  champOdds: [
    { seed: 1, team: "Team A", region: "Sample Region", champ: 15.0 },
  ],
};

const ARTICLES = [
id: 1,
title: "Cinderella Bracket Busters",
excerpt: "Everyone wants to cheer for a Cinderella. But how do we make the most educated guess on which double-digit seeds profile as upset candidates? It's an imperfect science, but a fun one.",
body: "Everyone wants to cheer for one, a Cinderella. Everyone wants to be the guy that picks the 12th seed team that makes a run to the Elite 8. It's great for the sport and it's just great basketball. However, how do we make the most educated "guess" with respect to these teams that profile as underdogs. It's an imperfect science, but a fun one at that. For this study, I will only be looking at double-digit seeds.\n\nI've taken all of the March Madness Tournaments since 2000 and parsed through the data to help determine if there are any interesting or statistically significant trends for double-digit seed upsets in the first round. I'll lead off with this: double-digit seeds have an upset mean of 6.44, with a standard deviation of 2.06 since the year 2000. This isn't anecdotal or narrative, this is just the raw numbers surrounding double-digit upsets in the first round.\n\nThe note I want to make about these numbers is that they help paint the picture for a lognormal distribution, not a normal distribution. The distribution is right skewed with a very long tail, meaning lots of upsets are rare but possible. Due to the fact that this is a lognormal distribution, you have to take the log of the mean (6.44) and the standard deviation (2.06). You get 1.81 and 0.31 for the mean and standard deviation, respectively. Now, we can properly generate probabilities. By taking the lognormal distribution, we arrive at the following:\n\nDOUBLE-DIGIT SEED PROBABILITIES\n[img:/images/overall-upset-count.png|Overall upset count distribution]\n\nSEED SPECIFIC PROBABILITY MATRIX\n[img:/images/seed-matrix.png|Seed-specific upset probability matrix]\n\nBefore getting to the conclusions we can make from the data, just some quick annotation. P(x=) means the probability that x (a variable, in this case the number of upsets for a particular seed or the total number of double-digit upsets). P(x>) just means greater than the x variable.\n\nIt's clear when looking at the data that there are some intriguing takeaways:\n\n1) The 11 seed-line provides the greatest opportunity for multiple upsets in a random year.\n\n2) It's a good idea to pick at least one 10 seed upset, however more than 1 starts to give you diminishing returns.\n\n3) The aforementioned can be used for the 12 seed-line.\n\n4) If you are looking for goalposts for upsets in general, picking more than 4 but less than 7 is optimal.\n\n5) 6 upsets are the sweet-spot; 21.00% probability.\n\nThese aren't blanket certainties, these are probabilities. Any year anything can happen, but probabilities are there to help. Rooting yourself in math gives yourself the process needed to make the best decisions possible. Whilst arbitrarily picking double-digits seems silly, there is a science to this process, and this data suggests it wise we do pick upsets between 4-6, with the upsets clustering from 10-12.\n\nNow that we have the data, I think it's worthwhile to mention what to look for when looking at double-digit seeds: turnover rate and free-throw rate. It's not mind-blowingly shocking data, but I think narrowing on these two categories helps focus the thinking. Anything to help level the playing field in the shot volume game and not giving the opposition free points is a massive bonus.\n\nExperienced guards come into this as they're steady with the ball and can help minimize fouling. Slower tempo means that each possession is worth more, therefore bringing in more variance. Three-point variance is also one of the biggest unknowns game-to-game. Taking a lot or limiting shots brings or reduces variance, and with three-point variance typically being a massive swing factor game-to-game, looking for teams that have this added swing factor is a bonus.\n\nHowever, turnover rate and free-throw rate are the two key categories I would look for at the bare minimum; they will influence the winning percentage a lot.\n\nNow that we have some extremely iron-clad numbers with respect to upset probabilities and some more anecdotal narratives to help frame our Cinderellas — let's put it to work.",
date: "Mar 8, 2026",
tag: "ANALYSIS",
readTime: "7 min read",
img: null
// Add your articles here. Example:
  // {
  //   id: 1,
  //   title: "Your Title Here",
  //   excerpt: "Short summary shown on the article list...",
  //   body: "First paragraph of the article.\n[img:/images/my-chart.png|Caption text here]\nNext paragraph continues after the image.",
  //   date: "Mar 17, 2026",
  //   tag: "ANALYSIS",
  //   readTime: "6 min read",
  //   img: "/images/cover-photo.png"
  // },
  //
  // INLINE IMAGES in body:
  //   [img:/images/filename.png]              image with no caption
  //   [img:/images/filename.png|My caption]   image with caption below
  //
  // Put image files in: ~/jacks-cbb-site/public/images/
];

const SAMPLE_RECORD = {
  summary: { w: 0, l: 0, roi: 0, clv: 0, last10w: 0, last10l: 0 },
  history: [],
};

const C = {
  bg: "#f8f7f4",
  surface: "#ffffff",
  border: "#d8d6d0",
  borderLight: "#e8e6e2",
  text: "#3a3a38",
  textDim: "#7a7a76",
  textMuted: "#a8a8a2",
  white: "#1a1a18",
  accent: "#b8860b",
  accentDim: "rgba(184,134,11,0.1)",
  green: "#2d7a4f",
  red: "#c04040",
};

const font = {
  sans: "'Söhne', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  mono: "'SF Mono', 'Consolas', 'Liberation Mono', Menlo, monospace",
  serif: "'Courier Prime', 'Courier New', Courier, monospace",
};

function Nav({ active, setActive }) {
  const links = [
    { key: "projections", label: "Projections" },
    { key: "rankings", label: "Rankings" },
    { key: "bracket", label: "Bracket" },
    { key: "portfolio", label: "Portfolio" },
    { key: "writing", label: "Writing" },
    { key: "about", label: "About" },
  ];
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 100,
      background: C.bg, borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{
        maxWidth: 1080, margin: "0 auto", padding: "0 20px",
        display: "flex", alignItems: "center", height: 56,
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0, cursor: "pointer" }} onClick={() => setActive("projections")}>
          <svg width="260" height="38" viewBox="0 0 260 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* JACK'S — bold typewriter wordmark */}
            <text x="0" y="20" style={{ fontFamily: "'Courier Prime', 'Courier New', Courier, monospace", fontSize: "22px", fontWeight: 700, fill: C.white, letterSpacing: "0.04em" }}>
              JACK'S
            </text>
            {/* Divider dot */}
            <circle cx="88" cy="16" r="2" fill={C.accent} />
            {/* COLLEGE BASKETBALL — smaller, letterspaced */}
            <text x="96" y="19" style={{ fontFamily: "'Courier Prime', 'Courier New', Courier, monospace", fontSize: "10px", fontWeight: 700, fill: C.text, letterSpacing: "0.18em" }}>
              COLLEGE BASKETBALL
            </text>
            {/* Subtitle line */}
            <text x="0" y="34" style={{ fontFamily: "'SF Mono', 'Consolas', monospace", fontSize: "8.5px", fontWeight: 400, fill: C.textMuted, letterSpacing: "0.12em" }}>
              DATA-ANALYSIS
            </text>
            {/* Accent underline */}
            <rect x="0" y="36" width="38" height="1.5" rx="0.5" fill={C.accent} />
          </svg>
        </div>
        <nav style={{ display: "flex", gap: 0 }}>
          {links.map(l => (
            <button key={l.key} onClick={() => setActive(l.key)} style={{
              padding: "14px 16px", border: "none", cursor: "pointer",
              fontFamily: font.sans, fontSize: 13, fontWeight: 400,
              color: active === l.key ? C.white : C.textDim,
              background: "transparent",
              borderBottom: active === l.key ? `2px solid ${C.accent}` : "2px solid transparent",
              marginBottom: -1, transition: "color 0.15s",
            }}>{l.label}</button>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Projections({ goToArticle }) {
  const [sort, setSort] = useState("ev");
  const [projData, loading] = useData("projections.json", SAMPLE_PROJECTIONS);
  const [recordData] = useData("record.json", SAMPLE_RECORD);

  const games = projData.games || [];
  const bestBets = games.filter(g => g.bet).sort((a, b) => b.ev - a.ev);

  const sorted = [...games].sort((a, b) => {
    if (sort === "ev") return b.ev - a.ev;
    if (sort === "units") return b.units - a.units;
    if (sort === "spread") return Math.abs(b.spread) - Math.abs(a.spread);
    return a.id - b.id;
  });

  const record = recordData.summary || {};
  const history = (recordData.history || []).filter(h => h.date);
  const totalUnits = history.length > 0 ? history[history.length - 1].runningProfit : 0;

  return (
    <div>
      <div style={{
        display: "flex", gap: 24, padding: "12px 0", borderBottom: `1px solid ${C.borderLight}`,
        marginBottom: 24, fontFamily: font.mono, fontSize: 11, color: C.textDim,
        flexWrap: "wrap",
      }}>
        <span>RECORD <span style={{ color: C.white, fontWeight: 500 }}>{record.w || 0}-{record.l || 0}</span></span>
        <span>UNITS <span style={{ color: totalUnits >= 0 ? C.green : C.red, fontWeight: 500 }}>{totalUnits >= 0 ? "+" : ""}{totalUnits.toFixed(1)}</span></span>
        <span>ROI <span style={{ color: (record.roi || 0) >= 0 ? C.green : C.red, fontWeight: 500 }}>{((record.roi || 0) * 100).toFixed(1)}%</span></span>
        <span>CLV <span style={{ color: (record.clv || 0) >= 0 ? C.green : C.red, fontWeight: 500 }}>{(record.clv || 0) >= 0 ? "+" : ""}{((record.clv || 0) * 100).toFixed(1)}%</span></span>
        <span>LAST 10 <span style={{ color: C.white, fontWeight: 500 }}>{record.last10w || 0}-{record.last10l || 0}</span></span>
        <span style={{ marginLeft: "auto", color: C.textMuted }}>Updated {projData.updated}</span>
      </div>

      {/* Performance Chart */}
      {history.length > 1 && (
        <div style={{ marginBottom: 28, padding: "16px 0" }}>
          <div style={{ fontFamily: font.mono, fontSize: 10, color: C.textMuted, letterSpacing: "0.06em", marginBottom: 12 }}>PERFORMANCE</div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 5, right: 50, left: 0, bottom: 5 }}>
                <CartesianGrid stroke={C.borderLight} strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fontFamily: font.mono, fill: C.textMuted }}
                  axisLine={{ stroke: C.border }}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  yAxisId="units"
                  orientation="left"
                  tick={{ fontSize: 10, fontFamily: font.mono, fill: C.accent }}
                  axisLine={false}
                  tickLine={false}
                  width={45}
                  tickFormatter={v => `${v >= 0 ? "+" : ""}${v.toFixed(1)}u`}
                />
                <YAxis
                  yAxisId="clv"
                  orientation="right"
                  tick={{ fontSize: 10, fontFamily: font.mono, fill: C.green }}
                  axisLine={false}
                  tickLine={false}
                  width={45}
                  tickFormatter={v => `${v >= 0 ? "+" : ""}${(v * 100).toFixed(1)}%`}
                />
                <Tooltip
                  contentStyle={{
                    background: C.surface, border: `1px solid ${C.border}`,
                    borderRadius: 4, fontFamily: font.mono, fontSize: 11,
                  }}
                  labelStyle={{ color: C.white, fontWeight: 500 }}
                  formatter={(value, name) => {
                    if (name === "runningProfit") return [`${value >= 0 ? "+" : ""}${value.toFixed(2)}u`, "Units P&L"];
                    return [`${value >= 0 ? "+" : ""}${(value * 100).toFixed(2)}%`, "CLV"];
                  }}
                />
                <Line
                  yAxisId="units"
                  type="monotone" dataKey="runningProfit" stroke={C.accent}
                  strokeWidth={2} dot={false} name="runningProfit"
                />
                <Line
                  yAxisId="clv"
                  type="monotone" dataKey="runningCLV" stroke={C.green}
                  strokeWidth={1.5} dot={false} name="runningCLV"
                  strokeDasharray="4 4"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 8, fontFamily: font.mono, fontSize: 10, color: C.textMuted }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 16, height: 2, background: C.accent }} />
              Units P&L (left axis)
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 16, height: 2, background: C.green, borderTop: "1px dashed" }} />
              CLV (right axis)
            </div>
          </div>
        </div>
      )}

      {/* Date + sort */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
        <h2 style={{ fontFamily: font.serif, fontSize: 22, fontWeight: 400, color: C.white, margin: 0 }}>
          {projData.date}
          {loading && <span style={{ fontFamily: font.mono, fontSize: 10, color: C.textMuted, marginLeft: 12 }}>Loading...</span>}
        </h2>
        <div style={{ display: "flex", gap: 2, fontFamily: font.mono, fontSize: 10 }}>
          {[["ev", "EV%"], ["units", "UNITS"], ["spread", "SPREAD"]].map(([k, label]) => (
            <button key={k} onClick={() => setSort(k)} style={{
              padding: "4px 10px", border: `1px solid ${sort === k ? C.accent : C.border}`,
              borderRadius: 3, cursor: "pointer",
              background: sort === k ? C.accentDim : "transparent",
              color: sort === k ? C.accent : C.textDim,
              fontFamily: font.mono, fontSize: 10,
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Best Bets callout */}
      {bestBets.length > 0 && (
        <div style={{
          border: `1px solid ${C.accent}`, borderRadius: 4, padding: "14px 16px",
          marginBottom: 20, background: C.accentDim,
        }}>
          <div style={{ fontFamily: font.mono, fontSize: 10, color: C.accent, letterSpacing: "0.08em", marginBottom: 10 }}>
            TODAY'S PLAYS
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {bestBets.map(g => {
              const pickTeam = g.position || g.team1;
              const oppTeam = pickTeam === g.team1 ? g.team2 : g.team1;
              return (
                <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontFamily: font.mono, fontSize: 12 }}>
                    <span style={{ color: C.white, fontWeight: 500 }}>{pickTeam}</span>
                    <span style={{ color: C.textDim }}> vs {oppTeam}</span>
                    <span style={{ color: C.textDim }}> ({Math.abs(g.spread).toFixed(1)})</span>
                  </div>
                  <span style={{ fontFamily: font.mono, fontSize: 11, color: C.green, fontWeight: 500 }}>{g.units.toFixed(3)}u</span>
                  {g.result && (
                    <span style={{
                      fontFamily: font.mono, fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 2,
                      background: g.result === "W" ? "rgba(45,122,79,0.15)" : "rgba(192,64,64,0.15)",
                      color: g.result === "W" ? C.green : C.red,
                    }}>{g.result}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: font.mono, fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["MATCHUP", "SPREAD", "MARKET", "KELLY %", "EV%", "BLOWOUT", "UNIT STAKE"].map((h, i) => (
                <th key={i} style={{
                  padding: "8px 8px", textAlign: i >= 1 ? "right" : "left",
                  fontWeight: 400, fontSize: 10, color: C.textMuted, letterSpacing: "0.05em",
                  whiteSpace: "nowrap",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((g) => (
              <tr key={g.id} style={{ borderBottom: `1px solid ${C.borderLight}`, transition: "background 0.1s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.03)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "10px 8px", verticalAlign: "top" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    {(() => {
                      const t1Highlight = g.bet
                        ? g.position === g.team1
                        : g.spread >= 0;
                      const t2Highlight = g.bet
                        ? g.position === g.team2
                        : g.spread < 0;
                      return (
                        <>
                          <span style={{ color: t1Highlight ? C.white : C.textDim, fontWeight: t1Highlight ? 500 : 400 }}>{g.team1}</span>
                          <span style={{ color: C.textMuted, fontSize: 11, margin: "0 2px" }}>vs</span>
                          <span style={{ color: t2Highlight ? C.white : C.textDim, fontWeight: t2Highlight ? 500 : 400 }}>{g.team2}</span>
                          {g.bet && <span style={{ fontFamily: font.mono, fontSize: 9, color: C.accent, marginLeft: 4 }}>★</span>}
                        </>
                      );
                    })()}
                    {g.articleId && (
                      <span onClick={(e) => { e.stopPropagation(); goToArticle(g.articleId); }} style={{
                        fontFamily: font.mono, fontSize: 9, color: C.accent, cursor: "pointer",
                        marginLeft: 4, textDecoration: "underline", textUnderlineOffset: 2,
                      }}>read</span>
                    )}
                  </div>
                </td>
                <td style={{ padding: "10px 8px", textAlign: "right", color: C.accent, fontWeight: 500, verticalAlign: "top" }}>{g.spread.toFixed(1)}</td>
		<td style={{ padding: "10px 8px", textAlign: "right", color: C.textDim, verticalAlign: "top" }}>{g.market ? g.market.toFixed(1) : "—"}</td>
                <td style={{ padding: "10px 8px", textAlign: "right", verticalAlign: "top", fontWeight: 500, color: g.kelly > 0 ? C.text : C.textMuted }}>
                  {g.kelly > 0 ? g.kelly.toFixed(1) + "%" : "—"}
                </td>
                <td style={{ padding: "10px 8px", textAlign: "right", verticalAlign: "top", fontWeight: 500, color: g.ev > 0 ? C.green : g.ev < 0 ? C.red : C.textDim }}>
                  {g.ev > 0 ? "+" : ""}{g.ev.toFixed(1)}%
                </td>
                <td style={{ padding: "10px 8px", textAlign: "right", verticalAlign: "top", fontWeight: 500, color: g.blowout >= 50 ? C.accent : g.blowout >= 25 ? C.text : C.textDim }}>
                  {g.blowout}%
                </td>
                <td style={{ padding: "10px 8px", textAlign: "right", verticalAlign: "top", fontWeight: 500 }}>
                  {g.units > 0
                    ? <span style={{ color: C.white }}>{g.units.toFixed(3)}u</span>
                    : <span style={{ color: C.textMuted }}>—</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 16, fontFamily: font.mono, fontSize: 10, color: C.textMuted, lineHeight: 1.8 }}>
        SPREAD = model projected spread · MARKET = market line · KELLY % = Kelly criterion stake size · EV% = expected value vs. market · BLOWOUT = probability of 15+ pt win · UNIT STAKE = recommended wager (— = no play)
      </div>
    </div>
  );
}

function Rankings() {
  const [search, setSearch] = useState("");
  const [confFilter, setConfFilter] = useState("ALL");
  const [rankData, loading] = useData("rankings.json", SAMPLE_RANKINGS);

  const allTeams = rankData.teams || [];

  // No conference in JSON data, so filter by search only
  const filtered = allTeams.filter(r => {
    const matchSearch = search === "" || r.team.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const risers = allTeams
    .filter(r => r.lastRank && r.lastRank > r.rank)
    .map(r => ({ name: r.team, rank: r.rank, diff: r.lastRank - r.rank }))
    .sort((a, b) => b.diff - a.diff)
    .slice(0, 5);

  const fallers = allTeams
    .filter(r => r.lastRank && r.lastRank < r.rank)
    .map(r => ({ name: r.team, rank: r.rank, diff: r.lastRank - r.rank }))
    .sort((a, b) => a.diff - b.diff)
    .slice(0, 5);

  const MoverList = ({ title, movers, type }) => (
    <div>
      <div style={{ fontFamily: font.mono, fontSize: 10, color: C.textMuted, letterSpacing: "0.06em", marginBottom: 10 }}>{title}</div>
      {movers.map((m, i) => (
        <div key={i} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "7px 0", borderBottom: `1px solid ${C.borderLight}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: font.mono, fontSize: 11, color: C.textMuted, width: 22, textAlign: "right" }}>#{m.rank}</span>
            <span style={{ fontFamily: font.mono, fontSize: 12, color: C.white, fontWeight: 500 }}>{m.name}</span>
          </div>
          <span style={{
            fontFamily: font.mono, fontSize: 11, fontWeight: 600,
            color: type === "rise" ? C.green : C.red,
          }}>
            {type === "rise" ? "\u25B2" : "\u25BC"} {Math.abs(m.diff)}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <h2 style={{ fontFamily: font.serif, fontSize: 22, fontWeight: 400, color: C.white, margin: "0 0 4px 0" }}>
        Power Rankings
      </h2>
      <p style={{ fontFamily: font.mono, fontSize: 11, color: C.textMuted, margin: "0 0 20px 0" }}>
        {rankData.week} · {allTeams.length} teams
        {loading && " · Loading..."}
      </p>

      {/* Search filter */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: "0 1 240px" }}>
          <input
            type="text"
            placeholder="Search team..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "7px 10px 7px 28px", border: `1px solid ${C.border}`,
              borderRadius: 3, background: C.surface, color: C.white,
              fontFamily: font.mono, fontSize: 12, outline: "none",
              boxSizing: "border-box",
            }}
            onFocus={e => e.target.style.borderColor = C.accent}
            onBlur={e => e.target.style.borderColor = C.border}
          />
          <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: C.textMuted }}>&#8981;</span>
        </div>
        {search && (
          <span style={{ fontFamily: font.mono, fontSize: 10, color: C.textDim }}>
            {filtered.length} team{filtered.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
        {/* Main table */}
        <div style={{ flex: 1, minWidth: 0, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: font.mono, fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["RK", "LW", "", "TEAM", "RATING"].map((h, i) => (
                  <th key={i} style={{
                    padding: "8px 8px", textAlign: i >= 4 ? "right" : "left",
                    fontWeight: 400, fontSize: 10, color: C.textMuted, letterSpacing: "0.05em", whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const rank = r.rank;
                const showBreak25 = rank === 26 && !search;
                const showBreak68 = rank === 69 && !search;
                return (
                  <React.Fragment key={i}>
                    {showBreak25 && (
                      <tr><td colSpan={5} style={{
                        padding: "6px 8px", fontFamily: font.mono, fontSize: 9,
                        color: C.accent, letterSpacing: "0.1em", background: C.accentDim,
                        borderTop: `1px solid ${C.accent}`, borderBottom: `1px solid ${C.accent}`,
                      }}>BELOW TOP 25</td></tr>
                    )}
                    {showBreak68 && (
                      <tr><td colSpan={5} style={{
                        padding: "6px 8px", fontFamily: font.mono, fontSize: 9,
                        color: C.textMuted, letterSpacing: "0.1em",
                        borderTop: `2px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
                        background: "rgba(0,0,0,0.02)",
                      }}>OUTSIDE TOURNAMENT FIELD</td></tr>
                    )}
                    <tr style={{ borderBottom: `1px solid ${C.borderLight}` }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.03)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "8px 8px", fontWeight: 500, color: rank <= 25 ? C.white : rank <= 68 ? C.text : C.textDim }}>{rank}</td>
                      <td style={{ padding: "8px 8px", color: C.textMuted }}>{r.lastRank || "—"}</td>
                      <td style={{ padding: "8px 4px", width: 32 }}>
                        {r.lastRank && r.lastRank > rank && <span style={{ color: C.green, fontSize: 10, fontWeight: 600 }}>{"\u25B2"}{r.lastRank - rank}</span>}
                        {r.lastRank && r.lastRank < rank && <span style={{ color: C.red, fontSize: 10, fontWeight: 600 }}>{"\u25BC"}{rank - r.lastRank}</span>}
                        {(!r.lastRank || r.lastRank === rank) && <span style={{ color: C.textMuted, fontSize: 10 }}>—</span>}
                      </td>
                      <td style={{ padding: "8px 8px", color: rank <= 25 ? C.white : rank <= 68 ? C.text : C.textDim, fontWeight: rank <= 25 ? 500 : 400 }}>{r.team}</td>
                      <td style={{ padding: "8px 8px", textAlign: "right", color: C.text }}>{r.rating.toFixed(3)}</td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Sidebar: risers & fallers — sticky */}
        <div style={{ flex: "0 0 200px", display: "flex", flexDirection: "column", gap: 28, position: "sticky", top: 64 }}>
          <MoverList title="TOP RISERS" movers={risers} type="rise" />
          <MoverList title="TOP FALLERS" movers={fallers} type="fall" />
        </div>
      </div>
    </div>
  );
}

function Bracket() {
  const [bracketData, loading] = useData("bracket.json", SAMPLE_BRACKET);
  const regionKeys = Object.keys(bracketData.regions || {});
  const [region, setRegion] = useState(regionKeys[0] || "");

  // Update region if data loads and current region doesn't exist
  const currentRegion = bracketData.regions?.[region] ? region : regionKeys[0] || "";
  const teams = bracketData.regions?.[currentRegion] || [];
  const champOdds = (bracketData.champOdds || []).filter(t => t.champ >= 1.0);
  const maxChamp = champOdds[0]?.champ || 1;

  const rounds = ["R32", "R16", "E8", "F4", "CG", "CHAMP"];
  const roundKeys = ["r32", "r16", "e8", "f4", "cg", "champ"];

  // Build matchups in NCAA bracket order: 1v16, 8v9, 5v12, 4v13, 6v11, 3v14, 7v10, 2v15
  const bracketSeeds = [[1,16],[8,9],[5,12],[4,13],[6,11],[3,14],[7,10],[2,15]];
  const teamBySeed = {};
  teams.forEach(t => { teamBySeed[t.seed] = t; });
  const matchups = bracketSeeds
    .map(([s1, s2]) => [teamBySeed[s1], teamBySeed[s2]])
    .filter(([a, b]) => a && b);

  const teamSlot = (team, roundKey, isFav) => {
    const pct = team[roundKey] || 0;
    const isEliminated = team.r32 === 0 && team.r16 === 0 && team.e8 === 0 && team.f4 === 0 && team.champ === 0;
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "6px 10px", gap: 8,
        background: isEliminated ? "transparent" : isFav ? "rgba(184,134,11,0.06)" : "transparent",
        borderLeft: isEliminated ? `2px solid transparent` : isFav ? `2px solid ${C.accent}` : `2px solid transparent`,
        opacity: isEliminated ? 0.35 : 1,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
          <span style={{ fontFamily: font.mono, fontSize: 10, color: C.textMuted, width: 18, textAlign: "right", flexShrink: 0 }}>{team.seed}</span>
          <span style={{
            fontFamily: font.mono, fontSize: 12, fontWeight: isEliminated ? 400 : isFav ? 500 : 400,
            color: isEliminated ? C.textMuted : isFav ? C.white : C.textDim,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            textDecoration: isEliminated ? "line-through" : "none",
          }}>{team.team}</span>
        </div>
        <span style={{
          fontFamily: font.mono, fontSize: 11, fontWeight: 500, flexShrink: 0,
          color: isEliminated ? C.textMuted : pct > 70 ? C.green : pct > 40 ? C.text : C.textDim,
        }}>{isEliminated ? "OUT" : pct.toFixed(1) + "%"}</span>
      </div>
    );
  };

  const matchupBox = (t1, t2, roundKey) => {
    const fav = (t1[roundKey] || 0) >= (t2[roundKey] || 0) ? 0 : 1;
    return (
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 3, overflow: "hidden", background: C.bg }}>
        {teamSlot(t1, roundKey, fav === 0)}
        <div style={{ height: 1, background: C.borderLight }} />
        {teamSlot(t2, roundKey, fav === 1)}
      </div>
    );
  };

  const colW = 180;
  const gap = 12;
  const rowGap = 12;

  // Build projected bracket rounds
  const r32Winners = matchups.map(([a, b]) => (a.r32 > b.r32 ? a : b));
  const s16Matchups = [];
  for (let i = 0; i < r32Winners.length; i += 2) {
    if (r32Winners[i + 1]) s16Matchups.push([r32Winners[i], r32Winners[i + 1]]);
  }
  const s16Winners = s16Matchups.map(([a, b]) => (a.r16 > b.r16 ? a : b));
  const e8Matchups = [];
  for (let i = 0; i < s16Winners.length; i += 2) {
    if (s16Winners[i + 1]) e8Matchups.push([s16Winners[i], s16Winners[i + 1]]);
  }
  const regionWinner = teams.reduce((best, t) => ((t.f4 || 0) > (best.f4 || 0) ? t : best), teams[0] || {});

  return (
    <div>
      <h2 style={{ fontFamily: font.serif, fontSize: 22, fontWeight: 400, color: C.white, margin: "0 0 4px 0" }}>
        Bracket Projections
      </h2>
      <p style={{ fontFamily: font.mono, fontSize: 11, color: C.textMuted, margin: "0 0 24px 0" }}>
        Model win probability at each round
        {loading && " · Loading..."}
      </p>

      {/* Championship Odds */}
      {champOdds.length > 0 && (
        <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: font.mono, fontSize: 10, color: C.textMuted, letterSpacing: "0.06em", marginBottom: 14 }}>CHAMPIONSHIP ODDS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {champOdds.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontFamily: font.mono, fontSize: 11, color: C.textMuted, width: 18, textAlign: "right", flexShrink: 0 }}>{t.seed}</div>
                <div style={{ fontFamily: font.mono, fontSize: 12, color: C.white, fontWeight: 500, width: 140, flexShrink: 0 }}>{t.team}</div>
                <div style={{ flex: 1, height: 16, background: C.borderLight, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 2,
                    width: `${(t.champ / maxChamp) * 100}%`,
                    background: i === 0 ? C.accent : C.textDim,
                    opacity: i === 0 ? 1 : 0.5,
                  }} />
                </div>
                <span style={{
                  fontFamily: font.mono, fontSize: 11, fontWeight: 500, width: 44, textAlign: "right", flexShrink: 0,
                  color: i === 0 ? C.accent : C.text,
                }}>{t.champ.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Region tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 24, borderBottom: `1px solid ${C.border}` }}>
        {regionKeys.map(k => (
          <button key={k} onClick={() => setRegion(k)} style={{
            padding: "10px 20px", border: "none", cursor: "pointer",
            fontFamily: font.sans, fontSize: 13, fontWeight: 400,
            color: currentRegion === k ? C.white : C.textDim,
            background: "transparent",
            borderBottom: currentRegion === k ? `2px solid ${C.accent}` : "2px solid transparent",
            marginBottom: -1,
          }}>{k}</button>
        ))}
      </div>

      {/* Bracket visual */}
      {matchups.length > 0 && (
        <div style={{ overflowX: "auto", paddingBottom: 16 }}>
          <div style={{ display: "flex", gap, minWidth: colW * 4 + gap * 3, alignItems: "stretch" }}>
            <div style={{ width: colW, flexShrink: 0 }}>
              <div style={{ fontFamily: font.mono, fontSize: 10, color: C.textMuted, letterSpacing: "0.06em", marginBottom: 10, textAlign: "center" }}>ROUND OF 32</div>
              <div style={{ display: "flex", flexDirection: "column", gap: rowGap }}>
                {matchups.map(([t1, t2], i) => <div key={i}>{matchupBox(t1, t2, "r32")}</div>)}
              </div>
            </div>
            <div style={{ width: colW, flexShrink: 0, display: "flex", flexDirection: "column" }}>
              <div style={{ fontFamily: font.mono, fontSize: 10, color: C.textMuted, letterSpacing: "0.06em", marginBottom: 10, textAlign: "center" }}>SWEET 16</div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", flex: 1, gap: rowGap }}>
                {s16Matchups.map(([t1, t2], i) => <div key={i}>{matchupBox(t1, t2, "r16")}</div>)}
              </div>
            </div>
            <div style={{ width: colW, flexShrink: 0, display: "flex", flexDirection: "column" }}>
              <div style={{ fontFamily: font.mono, fontSize: 10, color: C.textMuted, letterSpacing: "0.06em", marginBottom: 10, textAlign: "center" }}>ELITE 8</div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", flex: 1 }}>
                {e8Matchups.map(([t1, t2], i) => <div key={i}>{matchupBox(t1, t2, "e8")}</div>)}
              </div>
            </div>
            <div style={{ width: colW, flexShrink: 0, display: "flex", flexDirection: "column" }}>
              <div style={{ fontFamily: font.mono, fontSize: 10, color: C.textMuted, letterSpacing: "0.06em", marginBottom: 10, textAlign: "center" }}>FINAL FOUR</div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
                <div style={{ border: `1px solid ${C.accent}`, borderRadius: 3, overflow: "hidden", background: C.bg }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderLeft: `2px solid ${C.accent}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontFamily: font.mono, fontSize: 10, color: C.textMuted, width: 18, textAlign: "right" }}>{regionWinner.seed}</span>
                      <span style={{ fontFamily: font.mono, fontSize: 13, fontWeight: 500, color: C.white }}>{regionWinner.team}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: font.mono, fontSize: 12, fontWeight: 500, color: C.accent }}>{(regionWinner.f4 || 0).toFixed(1)}%</div>
                      <div style={{ fontFamily: font.mono, fontSize: 9, color: C.textMuted }}>F4</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deep run table */}
      <div style={{ marginTop: 24, borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
        <div style={{ fontFamily: font.mono, fontSize: 10, color: C.textMuted, letterSpacing: "0.06em", marginBottom: 12 }}>DEEP RUN PROBABILITIES</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: font.mono, fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["SEED", "TEAM", ...rounds].map((h, i) => (
                  <th key={i} style={{
                    padding: "6px 8px", textAlign: i >= 2 ? "right" : "left",
                    fontWeight: 400, fontSize: 10, color: C.textMuted, letterSpacing: "0.05em", whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
             {teams
                .slice()
                .sort((a, b) => (b.champ || 0) - (a.champ || 0))
                .map((t, i) => {
                const isElim = t.r32 === 0 && t.r16 === 0 && t.e8 === 0 && t.f4 === 0 && t.champ === 0;
                return (
                <tr key={i} style={{ borderBottom: `1px solid ${C.borderLight}`, opacity: isElim ? 0.35 : 1 }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.03)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "7px 8px", color: C.textMuted }}>{t.seed}</td>
                  <td style={{ padding: "7px 8px", color: C.white, fontWeight: 500 }}>{t.team}</td>
                  {roundKeys.map(rk => {
                    const val = t[rk] || 0;
                    return (
                      <td key={rk} style={{
                        padding: "7px 8px", textAlign: "right", fontWeight: val > 50 ? 500 : 400,
                        color: val > 50 ? C.green : val > 10 ? C.text : val > 0 ? C.textDim : C.textMuted,
                      }}>{val > 0 ? val.toFixed(1) + "%" : "—"}</td>
                    );
                  })}
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Writing({ initialArticle }) {
  const [activeArticle, setActiveArticle] = useState(initialArticle || null);
  const [images, setImages] = useState({});
  const fileInputRefs = {};

  const handleImageUpload = (articleId, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImages(prev => ({ ...prev, [articleId]: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const ImageSlot = ({ articleId, size = "thumb" }) => {
    const isThumb = size === "thumb";
    const w = isThumb ? 140 : "100%";
    const h = isThumb ? 94 : 280;
    const src = images[articleId];

    if (src) {
      return (
        <div style={{ position: "relative", width: w, height: h, flexShrink: 0, borderRadius: 4, overflow: "hidden" }}>
          <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <button
            onClick={(e) => { e.stopPropagation(); setImages(prev => { const n = { ...prev }; delete n[articleId]; return n; }); }}
            style={{
              position: "absolute", top: 4, right: 4, width: 20, height: 20, borderRadius: 3,
              background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", fontSize: 12,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              lineHeight: 1,
            }}
          >&times;</button>
        </div>
      );
    }

    return (
      <label style={{
        width: w, height: h, flexShrink: 0, borderRadius: 4,
        border: `1px dashed ${C.border}`, cursor: "pointer",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 4, transition: "border-color 0.15s",
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = C.accent}
      onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
      >
        <input type="file" accept="image/*" style={{ display: "none" }}
          onChange={(e) => handleImageUpload(articleId, e)} />
        <span style={{ fontFamily: font.mono, fontSize: 16, color: C.textMuted, lineHeight: 1 }}>+</span>
        <span style={{ fontFamily: font.mono, fontSize: 9, color: C.textMuted }}>{isThumb ? "ADD IMG" : "UPLOAD COVER IMAGE"}</span>
      </label>
    );
  };

  if (activeArticle) {
    const a = ARTICLES.find(x => x.id === activeArticle);
    return (
      <div>
        <button onClick={() => setActiveArticle(null)} style={{
          background: "none", border: "none", color: C.textDim, cursor: "pointer",
          fontFamily: font.sans, fontSize: 13, padding: "0 0 20px 0",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ fontSize: 16 }}>&larr;</span> Back
        </button>
        <div style={{ maxWidth: 640 }}>
          <div style={{ fontFamily: font.mono, fontSize: 10, color: C.textMuted, letterSpacing: "0.06em", marginBottom: 12 }}>
            {a.tag} &middot; {a.date} &middot; {a.readTime}
          </div>
          <h1 style={{ fontFamily: font.serif, fontSize: 32, fontWeight: 400, color: C.white, margin: "0 0 24px 0", lineHeight: 1.25 }}>
            {a.title}
          </h1>
          <div style={{ marginBottom: 28 }}>
            {a.img
              ? <img src={a.img} alt="" style={{ width: "100%", height: 280, objectFit: "cover", borderRadius: 4, display: "block" }} />
              : <ImageSlot articleId={a.id} size="cover" />
            }
          </div>
          <div style={{ fontFamily: font.sans, fontSize: 15, color: C.text, lineHeight: 1.75 }}>
            <p style={{ margin: "0 0 20px 0" }}>{a.excerpt}</p>
            {a.body && a.body.split("\n").filter(p => p.trim()).map((block, i) => {
              const imgMatch = block.match(/^\[img:(.+?)(?:\|(.+?))?\]$/);
              if (imgMatch) {
                return (
                  <div key={i} style={{ margin: "24px 0" }}>
                    <img src={imgMatch[1]} alt={imgMatch[2] || ""} style={{
                      width: "100%", borderRadius: 4, display: "block",
                    }} />
                    {imgMatch[2] && (
                      <div style={{ fontFamily: font.mono, fontSize: 11, color: C.textMuted, marginTop: 6 }}>
                        {imgMatch[2]}
                      </div>
                    )}
                  </div>
                );
              }
              return <p key={i} style={{ margin: "0 0 20px 0" }}>{block}</p>;
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontFamily: font.serif, fontSize: 22, fontWeight: 400, color: C.white, margin: "0 0 20px 0" }}>
        Writing
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {ARTICLES.length === 0 && (
          <div style={{ fontFamily: font.mono, fontSize: 12, color: C.textMuted, padding: "40px 0", textAlign: "center" }}>
            No articles yet. Add entries to the ARTICLES array in the code.
          </div>
        )}
        {ARTICLES.map((a) => (
          <article key={a.id} onClick={() => setActiveArticle(a.id)} style={{
            padding: "20px 0", borderBottom: `1px solid ${C.borderLight}`, cursor: "pointer",
            display: "flex", gap: 20, alignItems: "flex-start", transition: "padding-left 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.paddingLeft = "8px"}
          onMouseLeave={e => e.currentTarget.style.paddingLeft = "0px"}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
                <span style={{ fontFamily: font.mono, fontSize: 10, color: C.accent, letterSpacing: "0.06em", fontWeight: 500 }}>{a.tag}</span>
                <span style={{ fontFamily: font.mono, fontSize: 11, color: C.textMuted }}>{a.date}</span>
                <span style={{ fontFamily: font.mono, fontSize: 11, color: C.textMuted }}>{a.readTime}</span>
              </div>
              <h3 style={{ fontFamily: font.serif, fontSize: 19, fontWeight: 400, color: C.white, margin: "0 0 6px 0", lineHeight: 1.3 }}>{a.title}</h3>
              <p style={{ fontFamily: font.sans, fontSize: 13, color: C.textDim, margin: 0, lineHeight: 1.6 }}>{a.excerpt}</p>
            </div>
            <div onClick={e => e.stopPropagation()}>
              <ImageSlot articleId={a.id} size="thumb" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

const SAMPLE_PORTFOLIO = {
  positions: [],
};

function Portfolio({ goToArticle }) {
  const [filter, setFilter] = useState("ALL");
  const [showClosed, setShowClosed] = useState(true);
  const [seasonFilter, setSeasonFilter] = useState("ALL");
  const [portData] = useData("portfolio.json", SAMPLE_PORTFOLIO);

  const allPositions = portData.positions || [];
  const seasons = ["ALL", ...Array.from(new Set(allPositions.map(p => p.season).filter(Boolean)))];
  const categories = ["ALL", "TITLE", "CONF", "PLAYER"];
  const positions = allPositions.filter(p => {
    const matchSeason = seasonFilter === "ALL" || p.season === seasonFilter;
    const matchCat = filter === "ALL" || p.category === filter;
    const matchStatus = showClosed || p.status === "open";
    return matchSeason && matchCat && matchStatus;
  });

  const openPositions = allPositions.filter(p => p.status === "open");
  const closedPositions = allPositions.filter(p => p.status === "closed");
  const closedPnl = closedPositions.reduce((sum, p) => sum + (p.pnl || 0), 0);
  const totalStaked = allPositions.reduce((sum, p) => sum + (p.staked || 0), 0);
  const openStaked = openPositions.reduce((sum, p) => sum + p.staked, 0);

  const catLabels = { TITLE: "National Champion", CONF: "Conference Winner", PLAYER: "Player Award" };
  const catColors = { TITLE: C.accent, CONF: "#5b8fb9", PLAYER: "#8b7ec8" };

  return (
    <div>
      <h2 style={{ fontFamily: font.serif, fontSize: 22, fontWeight: 400, color: C.white, margin: "0 0 4px 0" }}>
        Portfolio
      </h2>
      <p style={{ fontFamily: font.mono, fontSize: 11, color: C.textMuted, margin: "0 0 24px 0" }}>
        Long-term positions · Futures & season-long bets
      </p>

      {/* Summary ticker */}
      <div style={{
        display: "flex", gap: 24, padding: "12px 0", borderBottom: `1px solid ${C.borderLight}`,
        marginBottom: 24, fontFamily: font.mono, fontSize: 11, color: C.textDim,
        flexWrap: "wrap",
      }}>
        <span>OPEN <span style={{ color: C.white, fontWeight: 500 }}>{openPositions.length}</span></span>
        <span>STAKED <span style={{ color: C.white, fontWeight: 500 }}>{openStaked.toFixed(1)}u</span></span>
        <span>CLOSED P&L <span style={{ color: closedPnl >= 0 ? C.green : C.red, fontWeight: 500 }}>{closedPnl >= 0 ? "+" : ""}{closedPnl.toFixed(1)}u</span></span>
        <span>TOTAL RISKED <span style={{ color: C.white, fontWeight: 500 }}>{totalStaked.toFixed(1)}u</span></span>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 2 }}>
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{
              padding: "5px 12px", border: `1px solid ${filter === c ? C.accent : C.border}`,
              borderRadius: 3, cursor: "pointer",
              background: filter === c ? C.accentDim : "transparent",
              color: filter === c ? C.accent : C.textDim,
              fontFamily: font.mono, fontSize: 10,
            }}>{c === "ALL" ? "ALL" : c}</button>
          ))}
        </div>
	<select
          value={seasonFilter}
          onChange={e => setSeasonFilter(e.target.value)}
          style={{
            padding: "5px 10px", border: `1px solid ${C.border}`, borderRadius: 3,
            background: C.surface, color: C.white, fontFamily: font.mono, fontSize: 10,
            outline: "none", cursor: "pointer",
          }}
        >
          {seasons.map(s => (
            <option key={s} value={s}>{s === "ALL" ? "All Seasons" : s}</option>
          ))}
        </select>
        <button onClick={() => setShowClosed(!showClosed)} style={{
          padding: "5px 12px", border: `1px solid ${C.border}`, borderRadius: 3, cursor: "pointer",
          background: showClosed ? "transparent" : "rgba(0,0,0,0.04)",
          color: C.textDim, fontFamily: font.mono, fontSize: 10, marginLeft: 8,
        }}>{showClosed ? "HIDE CLOSED" : "SHOW CLOSED"}</button>
      </div>

      {/* Positions table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: font.mono, fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["TYPE", "POSITION", "DATE", "ODDS", "CURRENT", "STAKE", "STATUS", ""].map((h, i) => (
                <th key={i} style={{
                  padding: "8px 8px", textAlign: i >= 3 ? "right" : "left",
                  fontWeight: 400, fontSize: 10, color: C.textMuted, letterSpacing: "0.05em", whiteSpace: "nowrap",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {positions.map((p) => {
              const isClosed = p.status === "closed";
              const oddsImproved = !isClosed && p.currentOdds && parseInt(p.currentOdds) < parseInt(p.odds);
              return (
                <tr key={p.id} style={{
                  borderBottom: `1px solid ${C.borderLight}`,
                  opacity: isClosed ? 0.5 : 1,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,0,0,0.03)"; e.currentTarget.style.opacity = 1; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.opacity = isClosed ? 0.5 : 1; }}>
                  <td style={{ padding: "10px 8px", verticalAlign: "top" }}>
                    <span style={{
                      fontFamily: font.mono, fontSize: 9, fontWeight: 600, letterSpacing: "0.06em",
                      padding: "2px 6px", borderRadius: 2,
                      color: catColors[p.category] || C.textDim,
                      background: `${catColors[p.category] || C.textDim}15`,
                    }}>{p.category}</span>
                  </td>
                  <td style={{ padding: "10px 8px", verticalAlign: "top" }}>
                    <div style={{ color: C.white, fontWeight: 500 }}>{p.team}</div>
                    <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>
                      {p.notes}
                      {p.articleId && (
                        <span onClick={(e) => { e.stopPropagation(); goToArticle(p.articleId); }} style={{
                          color: C.accent, cursor: "pointer", marginLeft: 6,
                          textDecoration: "underline", textUnderlineOffset: 2,
                        }}>read more →</span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "10px 8px", color: C.textMuted, verticalAlign: "top", whiteSpace: "nowrap" }}>{p.date}</td>
                  <td style={{ padding: "10px 8px", textAlign: "right", color: C.textDim, verticalAlign: "top" }}>{p.odds}</td>
                  <td style={{ padding: "10px 8px", textAlign: "right", verticalAlign: "top", fontWeight: 500, color: oddsImproved ? C.green : isClosed ? C.textMuted : C.text }}>
                    {isClosed ? "—" : p.currentOdds}
                  </td>
                  <td style={{ padding: "10px 8px", textAlign: "right", color: C.white, fontWeight: 500, verticalAlign: "top" }}>{p.staked.toFixed(1)}u</td>
                  <td style={{ padding: "10px 8px", textAlign: "right", verticalAlign: "top" }}>
                    {isClosed ? (
                      <span style={{
                        fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 2,
                        background: p.result === "W" ? "rgba(45,122,79,0.15)" : "rgba(192,64,64,0.15)",
                        color: p.result === "W" ? C.green : C.red,
                      }}>{p.result} {p.pnl >= 0 ? "+" : ""}{p.pnl.toFixed(1)}u</span>
                    ) : (
                      <span style={{ fontSize: 10, color: C.green }}>OPEN</span>
                    )}
                  </td>
                  <td style={{ padding: "10px 8px", verticalAlign: "top" }}></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {positions.length === 0 && (
        <div style={{ fontFamily: font.mono, fontSize: 12, color: C.textMuted, padding: "40px 0", textAlign: "center" }}>
          No positions match the current filter.
        </div>
      )}
    </div>
  );
}

function About() {
  return (
    <div style={{ maxWidth: 640 }}>
      <h2 style={{ fontFamily: font.serif, fontSize: 28, fontWeight: 700, color: C.white, margin: "0 0 8px 0" }}>
        About the Model
      </h2>
      <p style={{ fontFamily: font.mono, fontSize: 11, color: C.textMuted, margin: "0 0 32px 0" }}>
        How this works and why it exists
      </p>

      <div style={{ fontFamily: font.sans, fontSize: 15, color: C.text, lineHeight: 1.8 }}>
        <p style={{ margin: "0 0 20px 0" }}>
          My name is Jack. I built this model because I wanted a systematic, data-driven approach to college basketball
          betting — one that removes emotion and impulsive decisions and relies on repeatable inputs. The model runs daily during the
          season and generates projections for every D1 game.
        </p>

        <h3 style={{ fontFamily: font.serif, fontSize: 18, fontWeight: 700, color: C.white, margin: "32px 0 12px 0" }}>
          Methodology
        </h3>
        <p style={{ margin: "0 0 20px 0" }}>
          The core engine is a Python-based rating system built on adjusted efficiency margins. Each team is
          rated on offensive and defensive efficiency, adjusted for opponent strength and tempo. The model
          ingests game-level data, recalculates ratings daily, and projects point spreads and totals for
          upcoming matchups. I have a tweak to traditional rating systems where I value the 2pt shot more than the 3pt shot; valuing rebounds and paint dominance is important in my view.
        </p>
        <p style={{ margin: "0 0 20px 0" }}>
          Projections are compared against market lines to identify expected value. When the model sees
          sufficient edge, it generates a unit stake recommendation using a modified Kelly criterion that
          accounts for model uncertainty.
        </p>

        <h3 style={{ fontFamily: font.serif, fontSize: 18, fontWeight: 700, color: C.white, margin: "32px 0 12px 0" }}>
          What This Is Not
        </h3>
        <p style={{ margin: "0 0 20px 0" }}>
          This is not financial advice. It's a personal project — a way to combine my interest in basketball
          analytics with quantitative modelling. Past performance doesn't guarantee future results. The model
          has blind spots and always will. I write about those honestly in the blog.
        </p>

        <h3 style={{ fontFamily: font.serif, fontSize: 18, fontWeight: 700, color: C.white, margin: "32px 0 12px 0" }}>
          Key Inputs
        </h3>
        <div style={{ fontFamily: font.mono, fontSize: 12, color: C.text, lineHeight: 2.2 }}>
          <div><span style={{ color: C.textMuted, display: "inline-block", width: 24 }}>→</span> Adjusted offensive efficiency (points per 100 possessions)</div>
          <div><span style={{ color: C.textMuted, display: "inline-block", width: 24 }}>→</span> Adjusted defensive efficiency</div>
          <div><span style={{ color: C.textMuted, display: "inline-block", width: 24 }}>→</span> Tempo / pace of play</div>
          <div><span style={{ color: C.textMuted, display: "inline-block", width: 24 }}>→</span> Strength of schedule</div>
          <div><span style={{ color: C.textMuted, display: "inline-block", width: 24 }}>→</span> Recency weighting (recent games weighted more)</div>
          <div><span style={{ color: C.textMuted, display: "inline-block", width: 24 }}>→</span> Home court advantage adjustment</div>
        </div>

        <h3 style={{ fontFamily: font.serif, fontSize: 18, fontWeight: 700, color: C.white, margin: "32px 0 12px 0" }}>
          Contact
        </h3>
        <p style={{ margin: "0 0 20px 0", color: C.textDim }}>
          Questions, feedback, or just want to talk hoops? Find me on Twitter <span style={{ color: C.accent }}>@jackcbb1</span>
        </p>
      </div>
    </div>
  );
}

// Pixelated basketball watermark
function PixelBall() {
  // 16x16 pixel art basketball — 1 = ball, 2 = seam line, 0 = empty
  const grid = [
    [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,2,1,1,2,1,1,1,1,0,0],
    [0,1,1,1,1,2,1,1,1,1,2,1,1,1,1,0],
    [0,1,1,1,2,1,1,1,1,1,1,2,1,1,1,0],
    [1,1,1,2,1,1,1,1,1,1,1,1,2,1,1,1],
    [1,1,2,2,2,2,2,2,2,2,2,2,2,2,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,2,2,2,2,2,2,2,2,2,2,2,2,1,1],
    [1,1,1,2,1,1,1,1,1,1,1,1,2,1,1,1],
    [0,1,1,1,2,1,1,1,1,1,1,2,1,1,1,0],
    [0,1,1,1,1,2,1,1,1,1,2,1,1,1,1,0],
    [0,0,1,1,1,1,2,1,1,2,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
  ];
  const px = 5;
  const size = 16 * px;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg" style={{
      position: "fixed", top: 12, left: 20, opacity: 0.12, pointerEvents: "none", zIndex: 0,
    }}>
      {grid.flatMap((row, y) =>
        row.map((cell, x) => {
          if (cell === 0) return null;
          const fill = cell === 2 ? "#000000" : C.accent;
          return <rect key={`${x}-${y}`} x={x * px} y={y * px} width={px} height={px} fill={fill} />;
        })
      )}
    </svg>
  );
}

export default function MadnessModel() {
  const [active, setActive] = useState("projections");
  const [linkedArticle, setLinkedArticle] = useState(null);

  const goToArticle = (articleId) => {
    setLinkedArticle(articleId);
    setActive("writing");
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, position: "relative" }}>
      <PixelBall />
      <Nav active={active} setActive={(key) => { setActive(key); setLinkedArticle(null); }} />
      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "24px 20px 80px 20px" }}>
        {active === "projections" && <Projections goToArticle={goToArticle} />}
        {active === "rankings" && <Rankings />}
        {active === "bracket" && <Bracket />}
        {active === "portfolio" && <Portfolio goToArticle={goToArticle} />}
        {active === "writing" && <Writing initialArticle={linkedArticle} />}
        {active === "about" && <About />}
      </main>
      <footer style={{
        maxWidth: 1080, margin: "0 auto", padding: "20px 20px 40px",
        borderTop: `1px solid ${C.borderLight}`,
        fontFamily: font.mono, fontSize: 10, color: C.textMuted,
        display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
      }}>
        <span>For entertainment purposes only. Not financial advice.</span>
        <span>Methodology &middot; About &middot; Twitter @jackcbb1</span>
      </footer>
    </div>
  );
}
