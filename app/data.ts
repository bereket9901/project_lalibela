export const STATUSES = [
  "New",
  "Assigned",
  "Under Inspection",
  "Inspection Submitted",
  "Closed",
] as const;
export type Status = (typeof STATUSES)[number];
export type Role =
  | "Administrator"
  | "Dashboard Viewer"
  | "System Operator"
  | "Field Inspector";
export const ROLES: Role[] = [
  "Administrator",
  "Dashboard Viewer",
  "System Operator",
  "Field Inspector",
];
export const MODELS = ["gemini-3.6-flash", "llama3.2-vision"];
export type Models = {
  id: string;
  name: string;
  provider: "gemini" | "ollama";
  type: "cloud" | "local";
}[];

export const MODELS_DETAIL = [
  {
    id: "gemini-3.6-flash",
    name: "Open Router",
    provider: "gemini" as const,
    type: "cloud" as const,
  },
  {
    id: "llama3.2-vision",
    name: "Llama 3.2 Vision",
    provider: "ollama" as const,
    type: "local" as const,
  },
];
export const OUTCOMES = [
  "Confirmed violation",
  "No violation found",
  "Inconclusive — follow-up required",
];
export const AREAS = [
  { name: "Shakiso · Survey A", region: "Oromia", lat: 5.772, lng: 38.938 },
  { name: "Adola · Survey B", region: "Oromia", lat: 5.89, lng: 38.975 },
  { name: "Dima · Survey C", region: "Gambela", lat: 6.62, lng: 35.45 },
  {
    name: "Asosa · Survey D",
    region: "Benishangul-Gumuze",
    lat: 10.06,
    lng: 34.53,
  },
  { name: "Adi Dairo · Survey E", region: "Tigray", lat: 14.04, lng: 38.18 },
  { name: "Kenticha · Survey F", region: "Oromia", lat: 5.45, lng: 38.79 },
];
export const REGIONS = [...new Set(AREAS.map((a) => a.region))];
export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
};
export const USERS: User[] = [
  {
    id: "u1",
    name: "Meron Abebe",
    email: "admin@lalibela.demo",
    role: "Administrator",
    active: true,
  },
  {
    id: "u2",
    name: "Yonas Mekonnen",
    email: "operator@lalibela.demo",
    role: "System Operator",
    active: true,
  },
  {
    id: "u3",
    name: "Sara Getachew",
    email: "viewer@lalibela.demo",
    role: "Dashboard Viewer",
    active: true,
  },
  {
    id: "u4",
    name: "Hana Bekele",
    email: "hana@lalibela.demo",
    role: "Field Inspector",
    active: true,
  },
  {
    id: "u5",
    name: "Dawit Tesfaye",
    email: "dawit@lalibela.demo",
    role: "Field Inspector",
    active: true,
  },
  {
    id: "u6",
    name: "Selam Alemu",
    email: "selam@lalibela.demo",
    role: "Field Inspector",
    active: true,
  },
];
export type History = { event: string; at: string; by: string };
export type Inspection = {
  outcome: string;
  observations: string;
  photos: string[];
  lat: number;
  lng: number;
  accuracy: number;
  distance: number;
  threshold: number;
  at: string;
  source: "Device GPS" | "Simulated GPS";
};
export type MiningCase = {
  id: string;
  area: string;
  region: string;
  lat: number;
  lng: number;
  created: string;
  capture: string;
  status: Status;
  inspector: string;
  models: string[];
  title: string;
  observations: string;
  priority: "High" | "Medium" | "Low";
  detections: number;
  history: History[];
  inspection?: Inspection;
  image?: string;
  imageName?: string;
};
const seeds: [number, Status, string, string, "High" | "Medium" | "Low"][] = [
  [0, "Assigned", "u4", "Surface disturbance beyond survey boundary", "High"],
  [2, "Under Inspection", "u5", "New excavation and access track", "High"],
  [3, "New", "", "Unusual riverbank sediment disturbance", "Medium"],
  [
    1,
    "Inspection Submitted",
    "u4",
    "Expansion of a suspected extraction area",
    "High",
  ],
  [4, "Assigned", "u6", "Vegetation clearance near monitored site", "Medium"],
  [5, "Closed", "u5", "Exposed soil and equipment-like patterns", "Low"],
  [
    0,
    "Under Inspection",
    "u4",
    "New pits visible in comparison imagery",
    "High",
  ],
  [2, "Assigned", "u5", "Suspected alluvial extraction footprint", "Medium"],
  [
    3,
    "Inspection Submitted",
    "u6",
    "Changes along a seasonal stream",
    "Medium",
  ],
  [1, "New", "", "Possible unregistered access track", "Low"],
  [4, "New", "", "Expansion of bare ground", "Medium"],
  [5, "Assigned", "u4", "Possible tailings-like deposit", "Medium"],
];
export const INITIAL_CASES: MiningCase[] = seeds.map((s, i) => {
  const a = AREAS[s[0]];
  const created = `2026-09-${String(17 - Math.floor(i / 2)).padStart(2, "0")}`;
  const base = {
    ...a,
    area: a.name,
    id: `LAL-2026-${String(142 - i).padStart(4, "0")}`,
    created,
    capture: "2026-09-12",
    status: s[1],
    inspector: s[2],
    models:
      i % 3 === 0
        ? MODELS
        : i % 3 === 1
          ? ["Qwen", "Gemini"]
          : ["Qwen", "Claude"],
    title: s[3],
    observations:
      "AI identified a change in surface patterns. Verify the activity, permit boundary and site conditions during inspection. This finding is not proof of illegal activity.",
    priority: s[4],
    detections: i < 4 ? 3 : 2,
    history: [
      {
        event: "Case created from reviewed AI findings",
        at: created + "T08:15:00+03:00",
        by: "Yonas Mekonnen",
      },
    ],
  };
  const c: MiningCase = base;
  if (STATUSES.indexOf(c.status) > 0)
    c.history.push({
      event: "Assigned to field inspector",
      at: created + "T09:00:00+03:00",
      by: "Yonas Mekonnen",
    });
  if (STATUSES.indexOf(c.status) > 1)
    c.history.push({
      event: "On-site inspection started",
      at: "2026-09-17T09:15:00+03:00",
      by: USERS.find((u) => u.id === c.inspector)?.name || "",
    });
  if (STATUSES.indexOf(c.status) > 2) {
    c.inspection = {
      outcome: i === 3 ? OUTCOMES[0] : i === 5 ? OUTCOMES[1] : OUTCOMES[2],
      observations:
        i === 3
          ? "Sample inspection: excavation activity documented outside the supplied survey boundary. Permit comparison and supervisor review completed."
          : i === 5
            ? "Sample inspection: permitted maintenance activity; no violation found."
            : "Sample inspection: site conditions documented, but current permit information could not be verified. Further review required.",
      photos: [],
      lat: c.lat,
      lng: c.lng,
      accuracy: 9,
      distance: 22,
      threshold: 100,
      at: "2026-09-17T11:45:00+03:00",
      source: "Simulated GPS",
    };
    c.history.push({
      event: "Inspection submitted",
      at: c.inspection.at,
      by: USERS.find((u) => u.id === c.inspector)?.name || "",
    });
  }
  if (c.status === "Closed")
    c.history.push({
      event: "Case closed after review",
      at: "2026-09-17T12:10:00+03:00",
      by: "Yonas Mekonnen",
    });
  return c;
});
export function initials(n: string) {
  return n
    .split(" ")
    .map((v) => v[0])
    .slice(0, 2)
    .join("");
}
export function distanceMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const r = Math.PI / 180,
    dlat = (b.lat - a.lat) * r,
    dlng = (b.lng - a.lng) * r;
  const h =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dlng / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}
export function displayTime(s: string) {
  return (
    new Date(s).toLocaleString("en-GB", {
      timeZone: "Africa/Addis_Ababa",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }) + " EAT"
  );
}
export function isLocationVerified(
  gps: { lat: number; lng: number; accuracy: number; at: number } | null,
  point: { lat: number; lng: number } | undefined,
  threshold: number,
  now = Date.now(),
) {
  if (!gps || !point || !Number.isFinite(threshold) || threshold <= 0)
    return false;
  if (
    ![gps.lat, gps.lng, gps.accuracy, gps.at, point.lat, point.lng].every(
      Number.isFinite,
    )
  )
    return false;
  if (
    Math.abs(gps.lat) > 90 ||
    Math.abs(gps.lng) > 180 ||
    gps.accuracy < 0 ||
    now - gps.at < 0 ||
    now - gps.at >= 120000
  )
    return false;
  return distanceMeters(gps, point) + gps.accuracy <= threshold;
}
