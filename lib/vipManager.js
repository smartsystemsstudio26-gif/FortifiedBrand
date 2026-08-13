import { db } from "./firebase";
import { doc, setDoc, onSnapshot, collection } from "firebase/firestore";

export const DEFAULT_VIP_CLIENTS = [
  { id: "vip_1", name: "Alexander Wright", email: "a.wright@atelier.com", tier: "Tier-1 Buyer", spent: 48500, orders: 12, phone: "+27 82 555 0192", createdAt: "2026-01-15T08:00:00Z" },
  { id: "vip_2", name: "Elena Rostova", email: "elena@rostovagallery.co.za", tier: "Bespoke Collector", spent: 62000, orders: 15, phone: "+27 71 888 2341", createdAt: "2026-02-10T10:30:00Z" },
  { id: "vip_3", name: "Marcus Vance", email: "marcus@vancestudio.com", tier: "Tier-2 Buyer", spent: 39200, orders: 9, phone: "+27 83 444 9102", createdAt: "2026-03-01T12:15:00Z" },
  { id: "vip_4", name: "Sipho Dlamini", email: "sipho@dlamini-arch.co.za", tier: "Bespoke Collector", spent: 54100, orders: 14, phone: "+27 60 777 4432", createdAt: "2026-03-22T14:45:00Z" },
  { id: "vip_5", name: "Amara Okafor", email: "amara@okafor-design.com", tier: "Atelier VIP", spent: 78900, orders: 18, phone: "+27 72 333 1190", createdAt: "2026-04-05T09:10:00Z" },
  { id: "vip_6", name: "David Miller", email: "d.miller@capeart.co.za", tier: "Tier-1 Buyer", spent: 42100, orders: 10, phone: "+27 84 999 5521", createdAt: "2026-05-18T16:20:00Z" }
];

export function getStoredVipClients() {
  try {
    const raw = localStorage.getItem("fortified_vip_clients");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to read fortified_vip_clients from localStorage:", err);
  }
  // Initialize with default
  localStorage.setItem("fortified_vip_clients", JSON.stringify(DEFAULT_VIP_CLIENTS));
  return DEFAULT_VIP_CLIENTS;
}

export async function addVipClient({ email, name = "", tier = "VIP Early Release", phone = "+27 82 000 0000" }) {
  if (!email || typeof email !== "string") return null;
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) return null;

  const currentList = getStoredVipClients();
  const existingIndex = currentList.findIndex((v) => (v.email || "").toLowerCase() === cleanEmail);

  const cleanName = name || cleanEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const safeTier = tier || "VIP Early Release";
  const docId = `vip_${cleanEmail.replace(/[^a-zA-Z0-9]/g, "_")}`;

  const newEntry = {
    id: docId,
    name: cleanName,
    email: cleanEmail,
    tier: safeTier,
    spent: existingIndex >= 0 ? currentList[existingIndex].spent || 0 : 0,
    orders: existingIndex >= 0 ? currentList[existingIndex].orders || 0 : 0,
    phone: phone || "+27 82 000 0000",
    createdAt: new Date().toISOString(),
    emailSentFrom: "fortifiedbrand31@gmail.com",
    emailStatus: "Authorized & Welcome Sent"
  };

  let updatedList;
  if (existingIndex >= 0) {
    updatedList = [...currentList];
    updatedList[existingIndex] = { ...updatedList[existingIndex], ...newEntry };
  } else {
    updatedList = [newEntry, ...currentList];
  }

  // 1. Save to LocalStorage
  try {
    localStorage.setItem("fortified_vip_clients", JSON.stringify(updatedList));
    window.dispatchEvent(new Event("fortified_vip_updated"));
    window.dispatchEvent(new Event("storage"));
  } catch (err) {
    console.warn("LocalStorage save error:", err);
  }

  // 2. Sync to Firestore collection
  try {
    const docRef = doc(db, "vip_signups", docId);
    await setDoc(docRef, newEntry, { merge: true });
    console.log("VIP Client synced to Firestore:", docId);
  } catch (err) {
    console.warn("Firestore VIP sync error:", err);
  }

  // 3. Trigger Email Send from fortifiedbrand31@gmail.com
  try {
    const res = await fetch("/api/send-vip-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: cleanEmail,
        name: cleanName,
        tier: safeTier,
        phone: phone
      }),
    });
    const emailResult = await res.json();
    console.log("VIP Confirmation Email Server Result:", emailResult);
  } catch (err) {
    console.warn("Failed to trigger VIP email server API:", err);
  }

  return newEntry;
}

export function subscribeVipClientsFromFirestore(callback) {
  try {
    const colRef = collection(db, "vip_signups");
    return onSnapshot(colRef, (snapshot) => {
      const firestoreVips = [];
      snapshot.forEach((docSnap) => {
        firestoreVips.push({ id: docSnap.id, ...docSnap.data() });
      });

      if (firestoreVips.length > 0) {
        const local = getStoredVipClients();
        const merged = [...firestoreVips];
        // add any local ones not in firestore
        local.forEach((loc) => {
          if (!merged.some((m) => (m.email || "").toLowerCase() === (loc.email || "").toLowerCase())) {
            merged.push(loc);
          }
        });
        localStorage.setItem("fortified_vip_clients", JSON.stringify(merged));
        callback(merged);
      }
    }, (err) => {
      console.warn("Firestore VIP subscription notice:", err);
    });
  } catch (err) {
    console.warn("Firestore VIP subscription error:", err);
    return () => {};
  }
}
