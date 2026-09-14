import React, { useState, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush
} from "recharts";

// ---------- Pre-aggregated Olist data (Jan 2017 - Aug 2018) ----------
const DATA = {
  kpis: { total_sales: 13539483.03, total_freight: 2244490.79, total_orders: 98353, total_customers: 95076, avg_order_value: 137.66, avg_review: 4.03, avg_delivery: 12.5 },
  monthly: [
    { month: "2017-01", sales: 120312.87, freight: 16875.62, orders: 789, avg_review: 4.06, avg_delivery: 12.6 },
    { month: "2017-02", sales: 247303.02, freight: 38977.6, orders: 1733, avg_review: 4.05, avg_delivery: 13.2 },
    { month: "2017-03", sales: 374344.3, freight: 57704.29, orders: 2641, avg_review: 4.06, avg_delivery: 13.0 },
    { month: "2017-04", sales: 359341.43, freight: 52495.01, orders: 2391, avg_review: 4.01, avg_delivery: 14.8 },
    { month: "2017-05", sales: 506071.14, freight: 80119.81, orders: 3660, avg_review: 4.14, avg_delivery: 11.5 },
    { month: "2017-06", sales: 433038.6, freight: 69924.44, orders: 3217, avg_review: 4.13, avg_delivery: 12.0 },
    { month: "2017-07", sales: 498031.48, freight: 86940.14, orders: 3969, avg_review: 4.14, avg_delivery: 11.4 },
    { month: "2017-08", sales: 573971.68, freight: 94232.92, orders: 4293, avg_review: 4.22, avg_delivery: 10.9 },
    { month: "2017-09", sales: 624401.69, freight: 95997.22, orders: 4243, avg_review: 4.14, avg_delivery: 11.9 },
    { month: "2017-10", sales: 664219.43, freight: 105092.94, orders: 4568, avg_review: 4.07, avg_delivery: 11.7 },
    { month: "2017-11", sales: 1010271.37, freight: 168872.4, orders: 7451, avg_review: 3.85, avg_delivery: 15.0 },
    { month: "2017-12", sales: 743914.17, freight: 119633.06, orders: 5624, avg_review: 3.96, avg_delivery: 15.2 },
    { month: "2018-01", sales: 950030.36, freight: 157271.53, orders: 7220, avg_review: 3.95, avg_delivery: 14.1 },
    { month: "2018-02", sales: 844178.71, freight: 142730.25, orders: 6694, avg_review: 3.74, avg_delivery: 16.9 },
    { month: "2018-03", sales: 983067.49, freight: 171913.38, orders: 7188, avg_review: 3.70, avg_delivery: 16.0 },
    { month: "2018-04", sales: 995369.75, freight: 163050.29, orders: 6934, avg_review: 4.08, avg_delivery: 11.3 },
    { month: "2018-05", sales: 996517.68, freight: 153264.14, orders: 6853, avg_review: 4.13, avg_delivery: 11.3 },
    { month: "2018-06", sales: 864904.31, freight: 157552.8, orders: 6160, avg_review: 4.19, avg_delivery: 9.1 },
    { month: "2018-07", sales: 895507.22, freight: 163220.81, orders: 6273, avg_review: 4.23, avg_delivery: 8.9 },
    { month: "2018-08", sales: 854686.33, freight: 148622.14, orders: 6452, avg_review: 4.22, avg_delivery: 7.7 },
  ],
  top_cat: [
    { category: "health_beauty", sales: 1253847.91, orders: 8791, avg_review: 4.15 },
    { category: "watches_gifts", sales: 1201645.44, orders: 5619, avg_review: 4.02 },
    { category: "bed_bath_table", sales: 1036509.69, orders: 9412, avg_review: 3.90 },
    { category: "sports_leisure", sales: 984715.33, orders: 7701, avg_review: 4.11 },
    { category: "computers_accessories", sales: 910555.0, orders: 6671, avg_review: 3.94 },
    { category: "furniture_decor", sales: 723881.71, orders: 6397, avg_review: 3.91 },
    { category: "cool_stuff", sales: 634179.85, orders: 3624, avg_review: 4.15 },
    { category: "housewares", sales: 630961.59, orders: 5875, avg_review: 4.06 },
  ],
  cat_monthly: {
    health_beauty: [12561.32, 22838.79, 25995.25, 22935.75, 46786.02, 32029.39, 34896.86, 49873.9, 51537.65, 41915.72, 79120.4, 61264.66, 72470.49, 86996.06, 89888.46, 91751.04, 96460.36, 107908.82, 105813.03, 120803.94],
    watches_gifts: [8086.52, 11756.21, 26770.38, 23487.78, 37973.9, 28948.63, 36804.56, 36419.2, 47135.6, 65959.53, 97724.57, 71727.62, 75621.24, 63462.18, 97861.08, 92658.57, 123872.66, 86885.56, 96212.59, 72277.06],
    bed_bath_table: [3960.16, 16282.73, 25773.02, 24347.69, 33346.45, 35114.81, 63888.75, 57137.23, 52473.2, 46198.0, 89412.54, 50505.85, 76377.79, 60690.88, 69256.39, 72357.25, 71702.77, 71565.48, 55082.82, 61035.88],
  },
  // x,y = position on a South-America-wide equirectangular projection (viewBox 0 0 300 431.2)
  state: [
    { state: "SP", sales: 5013711.61, orders: 39847, avg_review: 4.13, x: 207.6, y: 219.9 },
    { state: "RJ", sales: 1750125.04, orders: 12249, avg_review: 3.81, x: 245.9, y: 220.3 },
    { state: "MG", sales: 1534070.05, orders: 11134, avg_review: 4.09, x: 234.0, y: 196.9 },
    { state: "RS", sales: 720688.83, orders: 5220, avg_review: 4.06, x: 178.7, y: 268.9 },
    { state: "PR", sales: 661831.57, orders: 4818, avg_review: 4.11, x: 187.4, y: 239.0 },
    { state: "SC", sales: 502873.65, orders: 3496, avg_review: 4.01, x: 198.6, y: 251.5 },
    { state: "BA", sales: 496375.98, orders: 3251, avg_review: 3.82, x: 251.9, y: 159.9 },
    { state: "DF", sales: 295215.78, orders: 2053, avg_review: 4.02, x: 213.4, y: 180.0 },
    { state: "GO", sales: 284978.43, orders: 1931, avg_review: 3.99, x: 201.0, y: 180.2 },
    { state: "ES", sales: 265826.14, orders: 1951, avg_review: 3.98, x: 260.6, y: 201.1 },
    { state: "PE", sales: 254092.91, orders: 1593, avg_review: 3.93, x: 281.6, y: 136.3 },
    { state: "CE", sales: 221957.83, orders: 1296, avg_review: 3.81, x: 266.8, y: 115.6 },
    { state: "PA", sales: 175665.53, orders: 940, avg_review: 3.79, x: 186.2, y: 102.6 },
    { state: "MT", sales: 152285.11, orders: 870, avg_review: 3.97, x: 156.8, y: 160.5 },
    { state: "MA", sales: 116384.81, orders: 714, avg_review: 3.68, x: 229.6, y: 112.2 },
    { state: "MS", sales: 113841.89, orders: 687, avg_review: 4.04, x: 170.1, y: 211.0 },
    { state: "PB", sales: 112265.98, orders: 515, avg_review: 3.98, x: 282.6, y: 126.5 },
    { state: "PI", sales: 85606.87, orders: 480, avg_review: 3.89, x: 250.0, y: 134.4 },
    { state: "RN", sales: 80563.01, orders: 467, avg_review: 4.06, x: 281.6, y: 115.0 },
    { state: "AL", sales: 77378.77, orders: 397, avg_review: 3.74, x: 282.6, y: 141.0 },
    { state: "SE", sales: 57546.5, orders: 333, avg_review: 3.80, x: 278.8, y: 147.3 },
    { state: "TO", sales: 48931.66, orders: 272, avg_review: 4.12, x: 210.6, y: 144.9 },
    { state: "RO", sales: 44352.96, orders: 233, avg_review: 4.06, x: 119.9, y: 149.7 },
    { state: "AM", sales: 21440.34, orders: 142, avg_review: 4.08, x: 100.9, y: 102.6 },
    { state: "AC", sales: 15185.58, orders: 77, avg_review: 4.24, x: 69.9, y: 137.6 },
    { state: "AP", sales: 13274.3, orders: 67, avg_review: 4.22, x: 188.9, y: 72.4 },
    { state: "RR", sales: 7380.84, orders: 43, avg_review: 3.62, x: 129.2, y: 68.8 },
  ],
  payment: [
    { type: "credit_card", label: "Credit card", sales: 10556470.1, orders: 73523 },
    { type: "boleto", label: "Boleto", sales: 2383657.05, orders: 19556 },
    { type: "mixed", label: "Mixed", sales: 283753.65, orders: 2222 },
    { type: "debit_card", label: "Debit card", sales: 183420.96, orders: 1518 },
    { type: "voucher", label: "Voucher", sales: 132181.27, orders: 1534 },
  ],
};

const C = {
  bg: "#1B140F", panel: "#241A13", panelAlt: "#2C2019", border: "#3C2C1F",
  text: "#F3E8DA", textDim: "#C7AD93", textFaint: "#8C7461",
  accent: "#D98C4A", accentHi: "#F0A85E", accent2: "#A65D3A", gold: "#E0B463", clay: "#8A5A3F",
};

const CAT_LABELS = {
  health_beauty: "Health & Beauty", watches_gifts: "Watches & Gifts", bed_bath_table: "Bed, Bath & Table",
  sports_leisure: "Sports & Leisure", computers_accessories: "Computer Accessories", furniture_decor: "Furniture & Decor",
  cool_stuff: "Cool Stuff", housewares: "Housewares",
};

const PAY_COLORS = [C.accent, C.gold, C.clay, C.accent2, "#5B4636"];

// South America continent silhouette + Brazil border, on a shared equirectangular
// projection (viewBox 0 0 300 431.2), so state bubbles sit on a real map, not empty space.
const MAP_H = 431.2;
const CONTINENT_PATH = "M 29.4,27.5 L 28.1,40.6 L 28.1,56.9 L 20.0,73.7 L 6.9,95.0 L 5.6,112.5 L 18.8,131.9 L 30.6,156.2 L 42.5,177.5 L 73.1,193.7 L 72.5,228.7 L 70.0,252.5 L 65.0,287.5 L 55.0,312.5 L 56.2,340.6 L 50.0,362.5 L 43.8,387.5 L 56.2,406.2 L 84.4,425.0 L 83.8,395.6 L 93.8,362.5 L 118.8,337.5 L 152.5,318.7 L 161.2,297.5 L 178.8,293.1 L 200.0,266.8 L 209.4,253.7 L 209.4,240.6 L 223.1,231.2 L 242.5,224.3 L 260.6,205.6 L 268.8,183.1 L 271.9,161.9 L 294.4,131.2 L 292.5,113.7 L 251.2,99.4 L 234.4,90.6 L 200.0,68.7 L 189.7,53.1 L 175.6,45.0 L 156.2,43.7 L 150.0,38.7 L 137.5,28.7 L 111.2,15.0 L 73.7,8.1 L 62.5,3.7 L 48.7,11.2 L 38.8,21.2 Z";
const BRAZIL_PATH = "M 136.2,48.3 L 189.7,53.1 L 200.0,68.7 L 234.4,90.6 L 251.2,99.4 L 292.5,113.7 L 294.4,131.2 L 271.9,161.9 L 268.8,183.1 L 260.6,205.6 L 242.5,224.3 L 223.1,231.2 L 209.4,240.6 L 209.4,253.7 L 200.0,266.8 L 178.8,291.8 L 152.5,270.0 L 146.2,253.1 L 150.6,219.3 L 150.6,201.9 L 134.4,183.1 L 100.0,150.0 L 71.9,137.5 L 53.1,128.1 L 75.0,109.4 L 75.0,78.1 L 93.8,63.7 L 118.8,53.1 Z";

function fmtMoney(n, compact = true) {
  if (compact) {
    if (Math.abs(n) >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
    if (Math.abs(n) >= 1e3) return "$" + (n / 1e3).toFixed(1) + "K";
    return "$" + n.toFixed(0);
  }
  return "$" + n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}
function fmtNum(n) { return n.toLocaleString(); }
function monthLabel(m) {
  const [y, mo] = m.split("-");
  const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return names[parseInt(mo, 10) - 1] + " " + y.slice(2);
}

function Card({ children, style }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10, ...style }}>
      {children}
    </div>
  );
}

function TooltipBox({ children }) {
  return (
    <div style={{ background: "#150F0B", border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 10px", color: C.text, fontSize: 11, boxShadow: "0 8px 24px rgba(0,0,0,0.45)" }}>
      {children}
    </div>
  );
}

function LineTooltip({ active, payload, label, metricLabel, metricFmt }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <TooltipBox>
      <div style={{ color: C.textDim, marginBottom: 2 }}>{monthLabel(label)}</div>
      <div style={{ color: C.accentHi, fontWeight: 600 }}>{metricLabel}: {metricFmt(payload[0].value)}</div>
    </TooltipBox>
  );
}

function BarTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0].payload;
  return (
    <TooltipBox>
      <div style={{ color: C.textDim, marginBottom: 2 }}>{monthLabel(label)}</div>
      <div>Orders: <span style={{ color: C.accentHi, fontWeight: 600 }}>{fmtNum(p.orders)}</span></div>
      <div>Avg delivery: <span style={{ color: C.gold, fontWeight: 600 }}>{p.avg_delivery}d</span></div>
    </TooltipBox>
  );
}

export default function OlistDashboard() {
  const [metric, setMetric] = useState("sales");
  const [selectedCats, setSelectedCats] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [hoverPay, setHoverPay] = useState(null);
  const [hoverState, setHoverState] = useState(null);

  const toggleCat = (cat) => setSelectedCats((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);

  const catFiltered = useMemo(() => selectedCats.length === 0 ? DATA.top_cat : DATA.top_cat.filter((c) => selectedCats.includes(c.category)), [selectedCats]);
  const catSalesTotal = useMemo(() => catFiltered.reduce((s, c) => s + c.sales, 0), [catFiltered]);
  const catOrdersTotal = useMemo(() => catFiltered.reduce((s, c) => s + c.orders, 0), [catFiltered]);

  const maxCatSales = Math.max(...DATA.top_cat.map((c) => c.sales));
  const maxStateSales = Math.max(...DATA.state.map((s) => s.sales));
  const payTotal = DATA.payment.reduce((s, p) => s + p.sales, 0);
  const activeState = selectedState ? DATA.state.find((s) => s.state === selectedState) : null;
  const shownState = hoverState || activeState;

  const metricLabel = metric === "sales" ? "Sales" : "Freight";
  const metricFmt = (v) => fmtMoney(v, true);

  const radiusFor = (s) => 3 + Math.sqrt(s.sales / maxStateSales) * 13;
  const colorFor = (s) => {
    const t = Math.sqrt(s.sales / maxStateSales);
    // interpolate clay -> accentHi
    const c1 = [138, 90, 63], c2 = [240, 168, 94];
    const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
    const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
    const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif", height: "100vh", width: "100%", padding: 12, boxSizing: "border-box", overflow: "hidden" }}>
      <div style={{ display: "flex", gap: 12, maxWidth: 1500, margin: "0 auto", height: "100%" }}>
        {/* SIDEBAR */}
        <div style={{ width: 200, flexShrink: 0, display: "flex", flexDirection: "column", gap: 10, height: "100%" }}>
          <Card style={{ padding: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, color: "#1B140F" }}>O</div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Olist Insights</div>
            </div>
            <div style={{ fontSize: 10, color: C.textFaint }}>Brazil e-commerce · Jan17–Aug18</div>
          </Card>

          <Card style={{ padding: 10 }}>
            <div style={{ fontSize: 10, letterSpacing: 0.4, color: C.textFaint, marginBottom: 6 }}>VIEW</div>
            {["Overview", "Categories", "Regions"].map((label, i) => (
              <div key={label} style={{ padding: "6px 8px", borderRadius: 6, marginBottom: 3, fontSize: 12, fontWeight: i === 0 ? 600 : 400, background: i === 0 ? C.accent2 : "transparent", color: i === 0 ? "#FBEFE2" : C.textDim, cursor: "pointer" }}>
                {label}
              </div>
            ))}
          </Card>

          <Card style={{ padding: 10 }}>
            <div style={{ fontSize: 10, letterSpacing: 0.4, color: C.textFaint, marginBottom: 6 }}>METRIC</div>
            <div style={{ display: "flex", gap: 5 }}>
              {["sales", "freight"].map((m) => (
                <button key={m} onClick={() => setMetric(m)} style={{ flex: 1, padding: "5px 0", borderRadius: 5, fontSize: 11, fontWeight: 600, border: `1px solid ${metric === m ? C.accent : C.border}`, background: metric === m ? C.accent : "transparent", color: metric === m ? "#241A13" : C.textDim, cursor: "pointer" }}>
                  {m === "sales" ? "Sales" : "Freight"}
                </button>
              ))}
            </div>
          </Card>

          <Card style={{ padding: 10, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ fontSize: 10, letterSpacing: 0.4, color: C.textFaint }}>CATEGORY FILTER</div>
              {selectedCats.length > 0 && (
                <button onClick={() => setSelectedCats([])} style={{ fontSize: 9, color: C.accentHi, background: "none", border: "none", cursor: "pointer" }}>clear</button>
              )}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, overflowY: "auto" }}>
              {DATA.top_cat.map((c) => {
                const active = selectedCats.includes(c.category);
                return (
                  <button key={c.category} onClick={() => toggleCat(c.category)} style={{ fontSize: 10, padding: "4px 7px", borderRadius: 5, border: `1px solid ${active ? C.accent : C.border}`, background: active ? "rgba(217,140,74,0.18)" : "transparent", color: active ? C.accentHi : C.textDim, cursor: "pointer" }}>
                    {CAT_LABELS[c.category] || c.category}
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: "auto", paddingTop: 10 }}>
              <div style={{ fontSize: 10, letterSpacing: 0.4, color: C.textFaint, marginBottom: 6 }}>SNAPSHOT</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 10 }}>
                <div><div style={{ color: C.textFaint }}>Orders</div><div style={{ fontWeight: 700, fontSize: 13 }}>{fmtNum(DATA.kpis.total_orders)}</div></div>
                <div><div style={{ color: C.textFaint }}>Customers</div><div style={{ fontWeight: 700, fontSize: 13 }}>{fmtNum(DATA.kpis.total_customers)}</div></div>
                <div><div style={{ color: C.textFaint }}>Avg order</div><div style={{ fontWeight: 700, fontSize: 13 }}>${DATA.kpis.avg_order_value}</div></div>
                <div><div style={{ color: C.textFaint }}>Avg review</div><div style={{ fontWeight: 700, fontSize: 13 }}>★ {DATA.kpis.avg_review}</div></div>
              </div>
            </div>
          </Card>
        </div>

        {/* MAIN */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, height: "100%", minWidth: 0 }}>
          {/* Row 1 */}
          <div style={{ display: "grid", gridTemplateColumns: "0.95fr 1.15fr 1fr", gap: 10, flex: "1.55", minHeight: 0 }}>
            {/* Donut card */}
            <Card style={{ padding: 14, background: `linear-gradient(160deg, ${C.accent2} 0%, #5B3A28 55%, ${C.panel} 100%)`, display: "flex", flexDirection: "column", minHeight: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "Georgia, serif" }}>Sales & Payments</div>
              <div style={{ fontSize: 10, color: "rgba(243,232,218,0.75)", marginBottom: 4 }}>By payment method</div>
              <div style={{ position: "relative", width: "100%", flex: 1, minHeight: 0 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={DATA.payment} dataKey="sales" nameKey="label" innerRadius="52%" outerRadius="78%" paddingAngle={2} stroke="none"
                      onMouseEnter={(_, i) => setHoverPay(i)} onMouseLeave={() => setHoverPay(null)}>
                      {DATA.payment.map((entry, i) => (
                        <Cell key={entry.type} fill={PAY_COLORS[i % PAY_COLORS.length]} opacity={hoverPay === null || hoverPay === i ? 1 : 0.35} />
                      ))}
                    </Pie>
                    <Tooltip content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const p = payload[0].payload;
                      return (<TooltipBox><div style={{ color: C.accentHi, fontWeight: 600 }}>{p.label}</div><div>{fmtMoney(p.sales, false)} · {fmtNum(p.orders)} orders</div></TooltipBox>);
                    }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                  <div style={{ fontSize: 10, color: "rgba(243,232,218,0.7)" }}>Total sales</div>
                  <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "Georgia, serif" }}>{fmtMoney(DATA.kpis.total_sales)}</div>
                  <div style={{ fontSize: 10, color: "rgba(243,232,218,0.7)", marginTop: 4 }}>Total freight</div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{fmtMoney(DATA.kpis.total_freight)}</div>
                </div>
              </div>
              <div>
                {DATA.payment.map((p, i) => (
                  <div key={p.type} onMouseEnter={() => setHoverPay(i)} onMouseLeave={() => setHoverPay(null)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2px 0", fontSize: 11 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 7, height: 7, borderRadius: 2, background: PAY_COLORS[i % PAY_COLORS.length] }} />
                      <span style={{ color: "rgba(243,232,218,0.85)" }}>{p.label}</span>
                    </div>
                    <span style={{ color: "rgba(243,232,218,0.6)" }}>{((p.sales / payTotal) * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* History + orders stacked */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
              <Card style={{ padding: "10px 14px 2px", flex: 1.15, minHeight: 0, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{metricLabel} history</div>
                  <div style={{ fontSize: 10, color: C.textFaint }}>drag to zoom</div>
                </div>
                <div style={{ flex: 1, minHeight: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={DATA.monthly} margin={{ top: 6, right: 8, left: -14, bottom: 0 }}>
                      <CartesianGrid stroke={C.border} vertical={false} />
                      <XAxis dataKey="month" tickFormatter={monthLabel} tick={{ fill: C.textFaint, fontSize: 9 }} axisLine={{ stroke: C.border }} tickLine={false} interval={2} />
                      <YAxis tickFormatter={(v) => fmtMoney(v)} tick={{ fill: C.textFaint, fontSize: 9 }} axisLine={false} tickLine={false} width={48} />
                      <Tooltip content={<LineTooltip metricLabel={metricLabel} metricFmt={metricFmt} />} />
                      <Line type="monotone" dataKey={metric} stroke={C.accentHi} strokeWidth={2.2} dot={{ r: 2, fill: C.accentHi }} activeDot={{ r: 4 }} />
                      <Brush dataKey="month" height={14} stroke={C.accent2} fill={C.panelAlt} tickFormatter={monthLabel} travellerWidth={7} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card style={{ padding: "10px 14px 2px", flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Orders & delivery time</div>
                <div style={{ fontSize: 10, color: C.textFaint }}>Darker bars = slower months</div>
                <div style={{ flex: 1, minHeight: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={DATA.monthly} margin={{ top: 4, right: 8, left: -14, bottom: 0 }}>
                      <CartesianGrid stroke={C.border} vertical={false} />
                      <XAxis dataKey="month" tickFormatter={monthLabel} tick={{ fill: C.textFaint, fontSize: 9 }} axisLine={{ stroke: C.border }} tickLine={false} interval={2} />
                      <YAxis tick={{ fill: C.textFaint, fontSize: 9 }} axisLine={false} tickLine={false} width={36} />
                      <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(217,140,74,0.08)" }} />
                      <Bar dataKey="orders" radius={[3, 3, 0, 0]}>
                        {DATA.monthly.map((m, i) => (<Cell key={i} fill={m.avg_delivery > 14 ? "#B5654A" : C.accent} />))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Brazil bubble map */}
            <Card style={{ padding: 14, display: "flex", flexDirection: "column", minHeight: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Sales by state</div>
                {activeState && (
                  <button onClick={() => setSelectedState(null)} style={{ fontSize: 9, color: C.accentHi, background: "none", border: "none", cursor: "pointer" }}>clear</button>
                )}
              </div>
              <div style={{ fontSize: 10, color: C.textFaint, marginBottom: 2 }}>Bubble size = sales · click a state</div>
              <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
                <svg viewBox={`0 0 300 ${MAP_H}`} style={{ width: "100%", height: "100%" }}>
                  <path d={CONTINENT_PATH} fill={C.panelAlt} stroke={C.border} strokeWidth={1} />
                  <path d={BRAZIL_PATH} fill="rgba(217,140,74,0.14)" stroke={C.accent2} strokeWidth={1.3} />
                  {DATA.state.map((s) => {
                    const active = selectedState === s.state;
                    const dim = shownState && !active && shownState.state !== s.state;
                    return (
                      <g key={s.state}
                        onClick={() => setSelectedState(active ? null : s.state)}
                        onMouseEnter={() => setHoverState(s)}
                        onMouseLeave={() => setHoverState(null)}
                        style={{ cursor: "pointer" }}>
                        <circle cx={s.x} cy={s.y} r={radiusFor(s)} fill={colorFor(s)}
                          opacity={dim ? 0.3 : 0.88}
                          stroke={active ? "#FBEFE2" : "rgba(0,0,0,0.25)"}
                          strokeWidth={active ? 1.6 : 0.6} />
                        {s.sales > 250000 && (
                          <text x={s.x} y={s.y + 3} textAnchor="middle" fontSize="7.5" fill="#241A13" fontWeight="700" pointerEvents="none">{s.state}</text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
              <div style={{ minHeight: 46, marginTop: 4, padding: "6px 8px", borderRadius: 8, background: C.panelAlt, border: `1px solid ${C.border}` }}>
                {shownState ? (
                  <>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.accentHi }}>{shownState.state}</div>
                    <div style={{ fontSize: 10, color: C.textDim, display: "flex", justifyContent: "space-between" }}>
                      <span>{fmtMoney(shownState.sales, false)}</span>
                      <span>{fmtNum(shownState.orders)} orders</span>
                      <span>★ {shownState.avg_review}</span>
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: 10, color: C.textFaint }}>Hover or click a bubble for detail</div>
                )}
              </div>
            </Card>
          </div>

          {/* Row 2: categories */}
          <div style={{ display: "flex", gap: 10, flex: 1, minHeight: 0 }}>
            <Card style={{ padding: "12px 16px", flex: 1.3, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Sales & reviews by category</div>
                <div style={{ fontSize: 10, color: C.textFaint }}>
                  {selectedCats.length > 0 ? `${fmtMoney(catSalesTotal, false)} · ${fmtNum(catOrdersTotal)} orders` : "Click a bar to filter"}
                </div>
              </div>
              <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                {DATA.top_cat.map((c) => {
                  const pct = (c.sales / maxCatSales) * 100;
                  const active = selectedCats.includes(c.category);
                  const dimmed = selectedCats.length > 0 && !active;
                  return (
                    <div key={c.category} onClick={() => toggleCat(c.category)} style={{ cursor: "pointer", opacity: dimmed ? 0.35 : 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                        <span style={{ color: active ? C.accentHi : C.textDim, fontWeight: active ? 700 : 400 }}>{CAT_LABELS[c.category]}</span>
                        <span style={{ color: C.textFaint, display: "flex", gap: 8 }}>
                          <span>★ {c.avg_review}</span>
                          <span style={{ color: active ? C.accentHi : C.textDim }}>{fmtMoney(c.sales)}</span>
                        </span>
                      </div>
                      <div style={{ height: 6, borderRadius: 3, background: C.panelAlt, overflow: "hidden", marginTop: 2 }}>
                        <div style={{ width: pct + "%", height: "100%", borderRadius: 3, background: active ? `linear-gradient(90deg, ${C.accent}, ${C.gold})` : `linear-gradient(90deg, ${C.accent2}, #6E4530)` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {Object.keys(DATA.cat_monthly).map((catKey) => {
              const cat = DATA.top_cat.find((c) => c.category === catKey);
              const series = DATA.cat_monthly[catKey].map((v, i) => ({ i, v }));
              return (
                <Card key={catKey} style={{ padding: "10px 14px", flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: 11, color: C.textFaint }}>{CAT_LABELS[catKey]}</div>
                  <div style={{ fontSize: 17, fontWeight: 700, fontFamily: "Georgia, serif" }}>{fmtMoney(cat.sales)}</div>
                  <div style={{ fontSize: 10, color: C.textFaint, marginBottom: 2 }}>{fmtNum(cat.orders)} orders · ★ {cat.avg_review}</div>
                  <div style={{ flex: 1, minHeight: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={series} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id={`grad-${catKey}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={C.accent} stopOpacity={0.6} />
                            <stop offset="100%" stopColor={C.accent} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke={C.accentHi} strokeWidth={2} fill={`url(#grad-${catKey})`} />
                        <Tooltip content={({ active, payload }) => { if (!active || !payload || !payload.length) return null; return <TooltipBox>{fmtMoney(payload[0].value, false)}</TooltipBox>; }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
