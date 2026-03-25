// ═══════════════════════════════════════════════════════════════
//  NovaTech BD — Firebase Configuration
//  Project: novatech-bd-10421
//  Version: 1.0.0
// ═══════════════════════════════════════════════════════════════

export const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyAHdK7zelJcBFc8fOFSgH8G_6jEjZdNoSI",
  authDomain:        "novatech-bd-10421.firebaseapp.com",
  databaseURL:       "https://novatech-bd-10421-default-rtdb.firebaseio.com",
  projectId:         "novatech-bd-10421",
  storageBucket:     "novatech-bd-10421.firebasestorage.app",
  messagingSenderId: "1098950143887",
  appId:             "1:1098950143887:web:bb7014007540c878b165fa"
};

// ── Cloudinary ────────────────────────────────────────────────
export const CLOUDINARY = {
  cloud:   "dp4toadml",
  preset:  "novatech_upload",
  baseUrl: "https://api.cloudinary.com/v1_1/dp4toadml",
  folders: {
    products:  "novatech/products",
    profiles:  "novatech/profiles",
    workers:   "novatech/workers",
    customers: "novatech/customers",
    banners:   "novatech/banners",
    reviews:   "novatech/reviews",
    sales:     "novatech/sale-photos",
  }
};

// ── Google Drive (Apps Script) ────────────────────────────────
export const DRIVE = {
  scriptUrl: "https://script.google.com/macros/s/AKfycbxWsrApHOr-OkTV-i6VrVfDYQz-KM-yZWA45DDt3pTLvDPs_UpoYyYhF5fWLP0UqopJ/exec"
};

// ── FCM Push Notifications ─────────────────────────────────────
export const FCM = {
  vapidKey: "BJZOWoD-PFRtGEPsh42RtzH3IjO8n3fPRTiHt0othEkV77DJiGoXY4QMzw0Gu3GchoVUDRNe8If_ckE8Nd1e2Ss"
};

// ── User Roles ─────────────────────────────────────────────────
export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN:       "admin",
  MANAGER:     "manager",
  WORKER:      "worker",
  DELIVERY:    "delivery",
  CUSTOMER:    "customer"
};

// ── Order Status Flow ──────────────────────────────────────────
export const ORDER_STATUS = {
  PENDING:    "pending",
  CONFIRMED:  "confirmed",
  PROCESSING: "processing",
  SHIPPED:    "shipped",
  OUT_FOR_DELIVERY: "out_for_delivery",
  DELIVERED:  "delivered",
  CANCELLED:  "cancelled",
  RETURNED:   "returned",
  REFUNDED:   "refunded"
};

// ── Payment Methods ────────────────────────────────────────────
export const PAYMENT_METHODS = {
  BKASH:     "bkash",
  NAGAD:     "nagad",
  ROCKET:    "rocket",
  SSL:       "ssl_commerz",
  CARD:      "card",
  COD:       "cash_on_delivery"
};

// ── App Constants ──────────────────────────────────────────────
export const APP = {
  name:     "NovaTech BD",
  version:  "1.0.0",
  currency: "BDT",
  locale:   "en-BD",
  timezone: "Asia/Dhaka",
  workDaysPerMonth: 26,
  defaultShift: { start: "10:00", end: "17:50" },
  lateThresholdMinutes: 15
};
