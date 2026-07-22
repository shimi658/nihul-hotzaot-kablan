
const STORAGE_KEY = "contractor-expense-app-v1";
const AUTH_KEY = "contractor-expense-auth-v1";
const BIOMETRIC_KEY = "contractor-expense-biometric-v1";
const DEFAULT_SHEETS_URL = "https://script.google.com/macros/s/AKfycbwefHGh1hPSDOXI28rwrt153v_wZMtN70Ztg_BbtxmpMOdxLJBcU6adNDW-WBSzMhQ0qw/exec";
const LEGACY_SHEETS_URLS = [
  "https://script.google.com/macros/s/AKfycbxnD1RcFoP0tiDTCodCqNV6mTbVHgP_VC0do_eP9GWaF4NmYTKNkcqCh8Ap8I6UTJ_ySA/exec",
  "https://script.google.com/macros/s/AKfycbzRgi2IDX8Eduk2DicGlABPFKkqDe9bBHF_iqT6mmVQ9RX83U2X9wBMiU626u9p-2KqxQ/exec",
  "https://script.google.com/macros/s/AKfycbxUGZKhx3kpUx_OvB32s647FfN7t9rGcruUeRUD_9osB6VlFMf2F8njIx-2zOsMClW8zA/exec",
  "https://script.google.com/macros/s/AKfycby5ziTrql5Fs0wpJocx_NzwmCGFt-4IWRyq5MOnU5oxKq_4Z7FogCKqmGTCN1gKELQ-EA/exec",
  "https://script.google.com/macros/s/AKfycbx5eHZkeeZVOtgkNXIs8EYGyJisdR4YhaeF_j8wN9BLerR6BKUFVIyCZJ16CJ20Z849AQ/exec",
  "https://script.google.com/macros/s/AKfycbyiTkuMTnrMpbbvmVCp5j-XTZpGneNfFInmDOdxki62Mqs9CFG-JgYUGD0Wma4yUuVc7g/exec",
  "https://script.google.com/macros/s/AKfycbxBP3UFPNU9dA3G2PgB1jQbc7UMiEPSSyMa4l1ovZtudmo2QWo-CLd2m_8Cv-xBxm9e/exec",
  "https://script.google.com/macros/s/AKfycbwPWZsJ9ARRhXKF2qZnDu0G0Q4PuHbvm9zV3OiJb3Gq-5o_ZOK4eReZaIEBV5MKgmdIpA/exec",
  "https://script.google.com/macros/s/AKfycbxrvN_i-UOAFBUJ2Kc6dB2WhyN77ZrH1qQZIuYHywWr4_fXUNXOvQcXu84ujmINxqEL3g/exec",
  "https://script.google.com/macros/s/AKfycbzCeWUiebmnNAKo1wW9Wnn1oALV2x2pf-SyyQTU5VrRN5cY_yWT2i1lJWkZC7ll0KftuA/exec",
  "https://script.google.com/macros/s/AKfycbxT7Wbdnkk7gQ6jQe2BL3jHeaZ2r-5USWLwkYbE8AdS8uBDgAHSjMk2ofPdsmSK8qnieg/exec",
  "https://script.google.com/macros/s/AKfycbz3d_sW_V-ijUCleBhaOTfrbYNoqCHDP1aZHUp5ITma3mGpVhQZpNLYiq4Ga-_YGCSFTA/exec",
  "https://script.google.com/macros/s/AKfycbxOoYqDBL1YNeXDThpZykw0TXIiKcNNV9FRnnXs6vwOZyTgg_se3-5K68yjE4HkHtO8-g/exec",
  "https://script.google.com/macros/s/AKfycbwF_IkpT6UR0QWGMG2qppNAlxajJJH5hHe_BuTWq5S8C1FBM60VHLEBd41AP1ZLv_hpaQ/exec",
  "https://script.google.com/macros/s/AKfycbyG-8EY9GCSkWqV-2QjFZusGsQB5IAeGhL-1dujopOfixm6jU9vMcvIYx8kJmPPKqK1QQ/exec",
  "https://script.google.com/macros/s/AKfycbz57ibhIJ0yIzI9UrkTwZN89Udnt7aWeHVlMNcm3i_b3PcteurO_NuK0URWPX7_fk4t/exec",
];

let state = normalizeState(loadState());
let auth = loadAuth();
let deferredInstallPrompt = null;
let pendingLoginEmail = "";
let editingExpenseId = null;
const INSTALL_DISMISSED_KEY = "contractor-expense-install-dismissed";
const IDLE_LOCK_MS = 5 * 60 * 1000;
let lastActivityAt = Date.now();
let inactivityTimer = null;
let lockedByInactivity = false;

const formatter = new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 });
const dateFormatter = new Intl.DateTimeFormat("he-IL", { day: "2-digit", month: "2-digit", year: "numeric" });

const els = {
  appShell: document.querySelector(".app-shell"),
  authView: document.querySelector("#authView"),
  loginForm: document.querySelector("#loginForm"),
  verifyForm: document.querySelector("#verifyForm"),
  loginEmail: document.querySelector("#loginEmail"),
  loginCode: document.querySelector("#loginCode"),
  authEmailLabel: document.querySelector("#authEmailLabel"),
  authLockMessage: document.querySelector("#authLockMessage"),
  authBackBtn: document.querySelector("#authBackBtn"),
  biometricLogin: document.querySelector("#biometricLogin"),
  biometricLoginBtn: document.querySelector("#biometricLoginBtn"),
  biometricSetupBtn: document.querySelector("#biometricSetupBtn"),
  biometricStatus: document.querySelector("#biometricStatus"),
  logoutBtn: document.querySelector("#logoutBtn"),
  settingsLogoutBtn: document.querySelector("#settingsLogoutBtn"),
  settingsAccountEmail: document.querySelector("#settingsAccountEmail"),
  settingsSecurityStatus: document.querySelector("#settingsSecurityStatus"),
  settingsLastLogin: document.querySelector("#settingsLastLogin"),
  settingsBiometricState: document.querySelector("#settingsBiometricState"),
  userEmailBadge: document.querySelector("#userEmailBadge"),
  menuExpenseCount: document.querySelector("#menuExpenseCount"),
  menuProjectCount: document.querySelector("#menuProjectCount"),
  greetingText: document.querySelector("#greetingText"),
  greetingSummary: document.querySelector("#greetingSummary"),
  menuBtn: document.querySelector("#menuBtn"),
  menuCloseBtn: document.querySelector("#menuCloseBtn"),
  menuBackdrop: document.querySelector("#menuBackdrop"),
  sideMenu: document.querySelector("#sideMenu"),
  menuLinks: document.querySelectorAll(".menu-link"),
  tabs: document.querySelectorAll(".tab"), views: document.querySelectorAll(".view"), currentDateLabel: document.querySelector("#currentDateLabel"),
  homeTodayTotal: document.querySelector("#homeTodayTotal"), homeTodayCount: document.querySelector("#homeTodayCount"), homeMonthTotal: document.querySelector("#homeMonthTotal"), homeActiveProjects: document.querySelector("#homeActiveProjects"), homeAverage: document.querySelector("#homeAverage"), homeTrend: document.querySelector("#homeTrend"), homeChart: document.querySelector("#homeChart"), homeChartEmpty: document.querySelector("#homeChartEmpty"), homeTopProject: document.querySelector("#homeTopProject"), homeTopCategory: document.querySelector("#homeTopCategory"), quickAddExpenseBtn: document.querySelector("#quickAddExpenseBtn"),
  agentText: document.querySelector("#agentText"), agentBtn: document.querySelector("#agentBtn"),
  expenseForm: document.querySelector("#expenseForm"), expenseProject: document.querySelector("#expenseProject"), expenseAmount: document.querySelector("#expenseAmount"), expenseItem: document.querySelector("#expenseItem"), expenseStore: document.querySelector("#expenseStore"), expenseCategory: document.querySelector("#expenseCategory"), expenseDate: document.querySelector("#expenseDate"), expenseReceipt: document.querySelector("#expenseReceipt"), receiptScanBtn: document.querySelector("#receiptScanBtn"), receiptScanStatus: document.querySelector("#receiptScanStatus"), expenseNote: document.querySelector("#expenseNote"), expenseSubmitBtn: document.querySelector("#expenseSubmitBtn"), cancelExpenseEditBtn: document.querySelector("#cancelExpenseEditBtn"), categorySuggestions: document.querySelector("#categorySuggestions"),
  todayTotal: document.querySelector("#todayTotal"), todayCount: document.querySelector("#todayCount"), todayList: document.querySelector("#todayList"), emailTodayBtn: document.querySelector("#emailTodayBtn"),
  projectForm: document.querySelector("#projectForm"), projectName: document.querySelector("#projectName"), projectList: document.querySelector("#projectList"),
  reportMonth: document.querySelector("#reportMonth"), reportSummary: document.querySelector("#reportSummary"), expenseSearch: document.querySelector("#expenseSearch"), searchProject: document.querySelector("#searchProject"), searchFrom: document.querySelector("#searchFrom"), searchTo: document.querySelector("#searchTo"), searchResults: document.querySelector("#searchResults"), searchResultCount: document.querySelector("#searchResultCount"), clearSearchBtn: document.querySelector("#clearSearchBtn"), exportMonthBtn: document.querySelector("#exportMonthBtn"), emailMonthBtn: document.querySelector("#emailMonthBtn"), exportYearBtn: document.querySelector("#exportYearBtn"), emailYearBtn: document.querySelector("#emailYearBtn"),
  settingsForm: document.querySelector("#settingsForm"), summaryEmail: document.querySelector("#summaryEmail"), sheetsUrl: document.querySelector("#sheetsUrl"), exportAccountDataBtn: document.querySelector("#exportAccountDataBtn"), deleteAccountBtn: document.querySelector("#deleteAccountBtn"), revokeOtherSessionsBtn: document.querySelector("#revokeOtherSessionsBtn"), installBtn: document.querySelector("#installBtn"), refreshBtn: document.querySelector("#refreshBtn"),
  installPrompt: document.querySelector("#installPrompt"), confirmInstallBtn: document.querySelector("#confirmInstallBtn"), dismissInstallBtn: document.querySelector("#dismissInstallBtn"), installPromptText: document.querySelector("#installPromptText"),
};

initialize();

function initialize() {
  updateGreeting();
  els.currentDateLabel.textContent = dateFormatter.format(new Date());
  els.expenseDate.value = toDateInputValue(new Date());
  els.reportMonth.value = toMonthInputValue(new Date());
  if (!state.settings.sheetsUrl) { state.settings.sheetsUrl = DEFAULT_SHEETS_URL; saveState(); }
  els.summaryEmail.value = state.settings.summaryEmail;
  els.sheetsUrl.value = state.settings.sheetsUrl;

  els.tabs.forEach((tab) => tab.addEventListener("click", () => activateView(tab.dataset.view)));
  els.menuLinks.forEach((link) => link.addEventListener("click", () => activateView(link.dataset.view)));
  els.menuBtn.addEventListener("click", openMenu);
  els.menuCloseBtn.addEventListener("click", closeMenu);
  els.menuBackdrop.addEventListener("click", closeMenu);
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
  els.agentBtn.addEventListener("click", handleAgentAssist);
  els.receiptScanBtn.addEventListener("click", handleReceiptScan);
  els.expenseForm.addEventListener("submit", handleExpenseSubmit);
  els.cancelExpenseEditBtn.addEventListener("click", resetExpenseForm);
  els.projectForm.addEventListener("submit", handleProjectSubmit);
  els.settingsForm.addEventListener("submit", handleSettingsSubmit);
  els.reportMonth.addEventListener("change", renderReports);
  [els.expenseSearch, els.searchProject, els.searchFrom, els.searchTo].forEach((control) => control.addEventListener(control.tagName === "INPUT" && control.type === "search" ? "input" : "change", renderExpenseSearch));
  els.clearSearchBtn.addEventListener("click", clearExpenseSearch);
  els.exportMonthBtn.addEventListener("click", () => exportCsv(getMonthExpenses(), "doch-hodshi.csv"));
  els.exportYearBtn.addEventListener("click", () => exportCsv(getYearExpenses(), "doch-shnati.csv"));
  els.emailTodayBtn?.addEventListener("click", () => sendSummaryEmail("today"));
  els.emailMonthBtn.addEventListener("click", () => sendSummaryEmail("month"));
  els.emailYearBtn.addEventListener("click", () => sendSummaryEmail("year"));
  els.installBtn.addEventListener("click", installPwa);
  els.refreshBtn.addEventListener("click", refreshApplication);
  els.quickAddExpenseBtn.addEventListener("click", () => activateView("expenseView"));
  els.confirmInstallBtn.addEventListener("click", installPwa);
  els.dismissInstallBtn.addEventListener("click", dismissInstallPrompt);
  els.loginForm.addEventListener("submit", handleLoginRequest);
  els.verifyForm.addEventListener("submit", handleLoginVerify);
  els.authBackBtn.addEventListener("click", resetAuthForms);
  els.biometricLoginBtn.addEventListener("click", loginWithBiometrics);
  els.biometricSetupBtn.addEventListener("click", toggleBiometricLogin);
  els.logoutBtn.addEventListener("click", logout);
  els.settingsLogoutBtn.addEventListener("click", logout);
  els.exportAccountDataBtn.addEventListener("click", exportAccountData);
  els.deleteAccountBtn.addEventListener("click", deleteAccount);
  els.revokeOtherSessionsBtn.addEventListener("click", revokeOtherSessions);

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    els.installBtn.hidden = false;
    if (!localStorage.getItem(INSTALL_DISMISSED_KEY)) window.setTimeout(showInstallPrompt, 900);
  });
  window.addEventListener("appinstalled", () => { deferredInstallPrompt = null; els.installBtn.hidden = true; els.installPrompt.hidden = true; });

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
  }

  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  if (isIos && !isStandalone && !localStorage.getItem(INSTALL_DISMISSED_KEY)) {
    els.installPromptText.textContent = "באייפון: לחץ על כפתור השיתוף ואז על ‘הוסף למסך הבית’.";
    els.confirmInstallBtn.hidden = true;
    window.setTimeout(showInstallPrompt, 900);
  }

  setupInactivityLock();
  renderAuthState(); renderAll(); syncDashboardBodyMode();
  if (auth?.email && auth?.token) syncFromServer();
  else if (loadBiometric() && isBiometricSupported()) window.setTimeout(() => loginWithBiometrics(true), 450);
}

function loadState() { try { const saved = localStorage.getItem(STORAGE_KEY); return saved ? JSON.parse(saved) : createDefaultState(); } catch { return createDefaultState(); } }
function loadAuth() { try { const saved = localStorage.getItem(AUTH_KEY); return saved ? JSON.parse(saved) : null; } catch { return null; } }
function saveAuth() { if (auth) { const biometric = loadBiometric(); const stored = biometric?.email === auth.email ? { email: auth.email, biometricLocked: true, loginAt: auth.loginAt || new Date().toISOString() } : auth; localStorage.setItem(AUTH_KEY, JSON.stringify(stored)); } else localStorage.removeItem(AUTH_KEY); }
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

function normalizeState(value) {
  const next = value && typeof value === "object" ? value : createDefaultState();
  if (!Array.isArray(next.projects)) next.projects = createDefaultState().projects;
  if (!Array.isArray(next.expenses)) next.expenses = [];
  if (!next.settings || typeof next.settings !== "object") next.settings = {};
  if (typeof next.settings.summaryEmail !== "string" || !next.settings.summaryEmail) next.settings.summaryEmail = "5484916@gmail.com";
  if (!next.settings.sheetsUrl || LEGACY_SHEETS_URLS.includes(next.settings.sheetsUrl)) next.settings.sheetsUrl = DEFAULT_SHEETS_URL;
  next.projects.forEach((project, index) => { if (!project.id) project.id = createId(); if (!project.name || project.name.includes("׳")) project.name = "פרויקט " + (index + 1); if (typeof project.active !== "boolean") project.active = true; });
  next.expenses.forEach((expense) => { if (!expense.category || expense.category.includes("׳")) expense.category = "כללי"; });
  return next;
}
function createDefaultState() { return { projects: [], expenses: [], settings: { summaryEmail: "5484916@gmail.com", sheetsUrl: DEFAULT_SHEETS_URL } }; }

function setupInactivityLock() {
  const registerActivity = () => { if (auth?.token && !document.hidden) lastActivityAt = Date.now(); };
  ["pointerdown", "keydown", "touchstart", "input"].forEach((eventName) => document.addEventListener(eventName, registerActivity, { passive: true }));
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      if (auth?.token && Date.now() - lastActivityAt >= IDLE_LOCK_MS) lockForInactivity();
      else registerActivity();
    }
  });
  inactivityTimer = window.setInterval(() => {
    if (auth?.token && Date.now() - lastActivityAt >= IDLE_LOCK_MS) lockForInactivity();
  }, 15000);
}
function lockForInactivity() {
  if (!auth?.token) return;
  const lockedEmail = auth.email;
  lockedByInactivity = true;
  auth = null;
  saveAuth();
  closeMenu();
  els.loginEmail.value = lockedEmail || "";
  resetAuthForms();
  els.authLockMessage.hidden = false;
  renderAuthState();
  notify("האפליקציה ננעלה אחרי 5 דקות ללא שימוש", "success", 7000);
}
function renderAuthState() {
  const loggedIn = Boolean(auth?.email && auth?.token);
  const biometric = loadBiometric();
  const biometricSupported = isBiometricSupported();
  els.authView.hidden = loggedIn; els.appShell.hidden = !loggedIn; els.logoutBtn.hidden = !loggedIn; els.userEmailBadge.hidden = !loggedIn;
  els.biometricLogin.hidden = loggedIn || !biometricSupported || !biometric;
  els.biometricSetupBtn.hidden = !biometricSupported;
  if (loggedIn) {
    lockedByInactivity = false;
    els.authLockMessage.hidden = true;
    els.userEmailBadge.textContent = auth.email;
    els.settingsAccountEmail.textContent = auth.email;
    els.settingsSecurityStatus.textContent = "מחובר ומסונכרן באופן מאובטח";
    if (els.settingsLastLogin) els.settingsLastLogin.textContent = formatSecurityLoginTime(auth.loginAt);
    if (els.settingsBiometricState) els.settingsBiometricState.textContent = biometric?.email === auth.email ? "פעילה במכשיר הזה" : "כבויה";
    els.summaryEmail.value = state.settings.summaryEmail || "5484916@gmail.com";
    const enabledHere = biometric?.email === auth.email;
    els.biometricSetupBtn.textContent = enabledHere ? "בטל כניסה ביומטרית" : "הפעל כניסה ביומטרית";
    els.biometricSetupBtn.classList.toggle("secondary", enabledHere);
    els.biometricSetupBtn.classList.toggle("primary", !enabledHere);
    els.biometricStatus.textContent = enabledHere
      ? "הכניסה הביומטרית פעילה במכשיר הזה."
      : "אפשר להפעיל כניסה מהירה ומאובטחת במכשיר הזה.";
  }
  if (!biometricSupported) els.biometricStatus.textContent = "המכשיר או הדפדפן הזה אינם תומכים בזיהוי ביומטרי.";
}
function formatSecurityLoginTime(value) {
  if (!value) return "החיבור הנוכחי";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "החיבור הנוכחי";
  return new Intl.DateTimeFormat("he-IL", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
}

async function handleLoginRequest(event) {
  event.preventDefault();
  const email = els.loginEmail.value.trim().toLowerCase();
  if (!email) return;
  pendingLoginEmail = email;
  els.authEmailLabel.textContent = email;
  els.loginForm.hidden = true;
  els.verifyForm.hidden = false;
  setAuthBusy(true);
  try {
    await fetch(state.settings.sheetsUrl || DEFAULT_SHEETS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "requestLoginCode", email }),
    });
    notify("קוד הכניסה נשלח. בדוק גם בדואר זבל.", "success");
    els.loginCode.focus();
  } catch {
    notify("מסך הקוד נפתח. אם הקוד לא הגיע, חזור ונסה שוב.", "error");
  } finally {
    setAuthBusy(false);
  }
}
async function handleLoginVerify(event) {
  event.preventDefault(); const code = els.loginCode.value.trim(); if (!pendingLoginEmail || !code) return; setAuthBusy(true);
  try { const result = await apiPost({ action: "verifyLoginCode", email: pendingLoginEmail, code }); auth = { email: result.email, token: result.token, loginAt: new Date().toISOString() }; lastActivityAt = Date.now(); saveAuth(); resetAuthForms(); renderAuthState(); await syncFromServer(); notify("נכנסת בהצלחה", "success"); }
  catch { notify("הקוד לא תקין או שפג תוקף. נסה שוב.", "error"); }
  finally { setAuthBusy(false); }
}
function resetAuthForms() { pendingLoginEmail = ""; els.loginCode.value = ""; els.verifyForm.hidden = true; els.loginForm.hidden = false; }
function setAuthBusy(isBusy) { els.loginForm.querySelectorAll("button,input").forEach((el) => el.disabled = isBusy); els.verifyForm.querySelectorAll("button,input").forEach((el) => el.disabled = isBusy); }
async function logout() {
  closeMenu();
  const tokenToRevoke = auth?.token || "";
  if (tokenToRevoke) {
    try { await apiPost({ action: "logout", token: tokenToRevoke }); } catch {}
  }
  auth = null;
  saveAuth();
  localStorage.removeItem(BIOMETRIC_KEY);
  state = normalizeState(createDefaultState());
  saveState();
  resetAuthForms();
  renderAuthState();
  renderAll();
  notify("התנתקת מהחשבון בצורה מאובטחת", "success");
}

async function revokeOtherSessions() {
  if (!auth?.token) { notify("צריך להתחבר מחדש", "error"); return; }
  const approved = window.confirm("לנתק את כל הטלפונים והמחשבים האחרים מהחשבון? המכשיר הזה יישאר מחובר.");
  if (!approved) return;
  els.revokeOtherSessionsBtn.disabled = true;
  try {
    const result = await apiPost({ action: "revokeOtherSessions", token: auth.token });
    const count = Number(result.revoked || 0);
    notify(count ? "נותקו " + count + " מכשירים אחרים מהחשבון" : "אין מכשירים אחרים שמחוברים לחשבון", "success");
  } catch (error) {
    handleSessionError(error, "לא הצלחנו לנתק את המכשירים האחרים");
  } finally {
    els.revokeOtherSessionsBtn.disabled = false;
  }
}

async function exportAccountData() {
  if (!auth?.token) { notify("צריך להתחבר מחדש", "error"); return; }
  els.exportAccountDataBtn.disabled = true;
  try {
    const data = await apiPost({ action: "exportUserData", token: auth.token });
    const exportFile = {
      account: data.email,
      exportedAt: data.exportedAt,
      projects: data.projects || [],
      expenses: data.expenses || [],
    };
    const blob = new Blob([JSON.stringify(exportFile, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "nihul-hotzaot-gibui-" + toDateInputValue(new Date()) + ".json";
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    notify("הגיבוי האישי הורד למכשיר", "success");
  } catch (error) {
    handleSessionError(error, "לא הצלחנו לייצא את המידע");
  } finally {
    els.exportAccountDataBtn.disabled = false;
  }
}

async function deleteAccount() {
  if (!auth?.token) { notify("צריך להתחבר מחדש", "error"); return; }
  const firstApproval = window.confirm("מחיקת החשבון תמחק לצמיתות את כל הפרויקטים וההוצאות שלך. להמשיך?");
  if (!firstApproval) return;
  const finalApproval = window.confirm("אישור אחרון: אי אפשר לבטל את המחיקה. למחוק את החשבון והמידע?");
  if (!finalApproval) return;
  els.deleteAccountBtn.disabled = true;
  try {
    await apiPost({ action: "deleteAccount", token: auth.token });
    auth = null;
    saveAuth();
    localStorage.removeItem(BIOMETRIC_KEY);
    state = normalizeState(createDefaultState());
    saveState();
    resetAuthForms();
    renderAuthState();
    renderAll();
    notify("החשבון וכל המידע שלך נמחקו", "success");
  } catch (error) {
    handleSessionError(error, "לא הצלחנו למחוק את החשבון");
    els.deleteAccountBtn.disabled = false;
  }
}

function handleSessionError(error, fallbackMessage) {
  const message = String(error?.message || "");
  if (/session|token/i.test(message)) {
    auth = null;
    localStorage.removeItem(BIOMETRIC_KEY);
    saveAuth();
    state = normalizeState(createDefaultState());
    saveState();
    resetAuthForms();
    renderAuthState();
    renderAll();
    notify("מטעמי אבטחה צריך להתחבר מחדש", "error");
    return;
  }
  notify(fallbackMessage, "error");
}

function isBiometricSupported() {
  return Boolean(window.PublicKeyCredential && navigator.credentials && window.isSecureContext && window.crypto?.subtle);
}
function loadBiometric() {
  try {
    const saved = JSON.parse(localStorage.getItem(BIOMETRIC_KEY) || "null");
    return saved?.version === 2 && saved.credentialId && saved.encryptedToken && saved.iv && saved.salt ? saved : null;
  } catch { return null; }
}
function bytesToBase64Url(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function base64UrlToBytes(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - value.length % 4) % 4);
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
}
function randomChallenge() {
  return crypto.getRandomValues(new Uint8Array(32));
}
async function importBiometricKey(prfOutput, usages) {
  return crypto.subtle.importKey("raw", prfOutput, { name: "AES-GCM" }, false, usages);
}
function readPrfResult(credential) {
  return credential?.getClientExtensionResults?.()?.prf?.results?.first || null;
}
async function requestBiometricPrf(credentialId, salt) {
  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge: randomChallenge(),
      allowCredentials: [{ type: "public-key", id: base64UrlToBytes(credentialId), transports: ["internal"] }],
      userVerification: "required",
      timeout: 60000,
      extensions: { prf: { eval: { first: salt } } },
    },
  });
  const prfOutput = readPrfResult(assertion);
  if (!prfOutput) throw new Error("PRF_NOT_SUPPORTED");
  return prfOutput;
}
async function toggleBiometricLogin() {
  if (!auth?.email || !auth?.token) return;
  const saved = loadBiometric();
  if (saved?.email === auth.email) {
    localStorage.removeItem(BIOMETRIC_KEY);
    saveAuth();
    renderAuthState();
    notify("הכניסה הביומטרית בוטלה במכשיר הזה", "success");
    return;
  }
  if (!isBiometricSupported()) {
    notify("המכשיר הזה אינו תומך ב-Passkey מאובטח", "error", 7000);
    return;
  }
  els.biometricSetupBtn.disabled = true;
  try {
    const email = auth.email;
    const token = auth.token;
    const userId = new TextEncoder().encode(email).slice(0, 64);
    const salt = randomChallenge();
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge: randomChallenge(),
        rp: { name: "ניהול הוצאות קבלן" },
        user: { id: userId, name: email, displayName: email },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
        authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required", residentKey: "preferred" },
        timeout: 60000,
        attestation: "none",
        extensions: { prf: { eval: { first: salt } } },
      },
    });
    if (!credential) throw new Error("NO_CREDENTIAL");
    const credentialId = bytesToBase64Url(credential.rawId);
    let prfOutput = readPrfResult(credential);
    if (!prfOutput) prfOutput = await requestBiometricPrf(credentialId, salt);
    const key = await importBiometricKey(prfOutput, ["encrypt"]);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const plaintext = new TextEncoder().encode(JSON.stringify({ email, token }));
    const encryptedToken = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext);
    localStorage.setItem(BIOMETRIC_KEY, JSON.stringify({
      version: 2,
      credentialId,
      email,
      salt: bytesToBase64Url(salt),
      iv: bytesToBase64Url(iv),
      encryptedToken: bytesToBase64Url(encryptedToken),
    }));
    saveAuth();
    renderAuthState();
    notify("כניסה עם טביעת אצבע / Face ID הופעלה בצורה מאובטחת", "success", 7000);
  } catch (error) {
    if (error?.name !== "NotAllowedError") {
      const unsupported = String(error?.message || "") === "PRF_NOT_SUPPORTED";
      notify(unsupported ? "המכשיר תומך בטביעת אצבע, אך לא בהצפנת Passkey הנדרשת." : "לא הצלחתי להפעיל זיהוי ביומטרי במכשיר הזה", "error", 9000);
    }
  } finally {
    els.biometricSetupBtn.disabled = false;
  }
}
async function loginWithBiometrics(automatic = false) {
  const saved = loadBiometric();
  if (!saved || !isBiometricSupported()) return renderAuthState();
  els.biometricLoginBtn.disabled = true;
  try {
    const salt = base64UrlToBytes(saved.salt);
    const prfOutput = await requestBiometricPrf(saved.credentialId, salt);
    const key = await importBiometricKey(prfOutput, ["decrypt"]);
    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: base64UrlToBytes(saved.iv) },
      key,
      base64UrlToBytes(saved.encryptedToken)
    );
    const unlocked = JSON.parse(new TextDecoder().decode(plaintext));
    if (unlocked.email !== saved.email || !unlocked.token) throw new Error("INVALID_VAULT");
    auth = { email: unlocked.email, token: unlocked.token, loginAt: new Date().toISOString() }; lastActivityAt = Date.now();
    saveAuth();
    renderAuthState();
    await syncFromServer();
    if (auth?.token) notify("הזיהוי הביומטרי הצליח", "success");
  } catch (error) {
    if (error?.name !== "NotAllowedError" && !automatic) notify("הזיהוי לא הצליח. אפשר להיכנס עם קוד למייל.", "error", 7000);
  } finally {
    els.biometricLoginBtn.disabled = false;
  }
}
async function syncFromServer() { if (!auth?.token) return; try { const result = await apiPost({ action: "listUserData", token: auth.token }); state.projects = normalizeProjects(result.projects || []); state.expenses = normalizeExpenses(result.expenses || []); state.settings.summaryEmail = state.settings.summaryEmail || "5484916@gmail.com"; saveState(); renderAll(); } catch (error) { handleSessionError(error, "לא הצלחתי לסנכרן נתונים מהמייל"); } }
function normalizeProjects(projects) { const legacyDefaults = new Set(["פרויקט 1", "פרויקט 2", "פרויקט 3"]); return projects.filter((project) => !legacyDefaults.has(String(project.name || "").trim())).map((project, index) => ({ id: project.id || createId(), name: project.name || "פרויקט " + (index + 1), active: project.active !== false })); }
function normalizeExpenses(expenses) { return expenses.map((expense) => ({ id: expense.id || createId(), projectId: expense.projectId || findProjectIdByName(expense.projectName), amount: Number(expense.amount || 0), item: expense.item || "", store: expense.store || "", category: expense.category || "כללי", date: expense.date || toDateInputValue(new Date()), note: expense.note || "", receipt: null, createdAt: expense.createdAt || new Date().toISOString() })); }
function findProjectIdByName(name) { const project = state.projects.find((item) => item.name === name); return project?.id || state.projects[0]?.id || ""; }
function updateGreeting() {
  const israelHourText = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    hour12: false,
    timeZone: "Asia/Jerusalem",
  }).format(new Date());
  const hour = Number(israelHourText) % 24;
  const greeting = hour < 5 ? "לילה טוב" : hour < 12 ? "בוקר טוב" : hour < 18 ? "צהריים טובים" : hour < 22 ? "ערב טוב" : "לילה טוב";
  els.greetingText.textContent = greeting;
}
function openMenu() {
  els.sideMenu.classList.add("open");
  els.sideMenu.setAttribute("aria-hidden", "false");
  els.menuBackdrop.hidden = false;
  requestAnimationFrame(() => els.menuBackdrop.classList.add("visible"));
  els.menuBtn.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-open");
}
function closeMenu() {
  els.sideMenu.classList.remove("open");
  els.sideMenu.setAttribute("aria-hidden", "true");
  els.menuBackdrop.classList.remove("visible");
  els.menuBtn.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
  window.setTimeout(() => { if (!els.sideMenu.classList.contains("open")) els.menuBackdrop.hidden = true; }, 220);
}
function syncDashboardBodyMode() {
  const dashboardIsActive = Boolean(auth?.email && auth?.token && document.querySelector("#todayView")?.classList.contains("active"));
  document.body.classList.toggle("dashboard-active", dashboardIsActive);
}

function activateView(viewId) {
  els.tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.view === viewId));
  els.menuLinks.forEach((link) => link.classList.toggle("active", link.dataset.view === viewId));
  els.views.forEach((view) => view.classList.toggle("active", view.id === viewId));
  syncDashboardBodyMode();
  closeMenu();
  window.scrollTo({ top: 0, behavior: "smooth" });
  renderAll();
}

async function handleExpenseSubmit(event) {
  event.preventDefault(); if (!auth?.token) return renderAuthState();
  const existing = editingExpenseId ? state.expenses.find((item) => item.id === editingExpenseId) : null;
  const uploadedReceipt = els.expenseReceipt.files[0] ? await fileToDataUrl(els.expenseReceipt.files[0]) : null;
  const expense = { id: existing?.id || createId(), projectId: els.expenseProject.value, amount: Number(els.expenseAmount.value), item: els.expenseItem.value.trim(), store: els.expenseStore.value.trim(), category: els.expenseCategory.value.trim() || "כללי", date: els.expenseDate.value, note: els.expenseNote.value.trim(), receipt: uploadedReceipt || existing?.receipt || null, createdAt: existing?.createdAt || new Date().toISOString() };
  const duplicate = findPossibleDuplicate(expense, existing?.id);
  if (duplicate && !window.confirm("נמצאה הוצאה דומה שכבר נשמרה:\n" + projectName(duplicate.projectId) + " · " + formatter.format(duplicate.amount) + " · " + duplicate.date + "\n\nלשמור בכל זאת?")) return;
  if (existing) state.expenses = state.expenses.map((item) => item.id === expense.id ? expense : item);
  else state.expenses.unshift(expense);
  saveState(); resetExpenseForm(); renderAll(); activateView("todayView"); notify(existing ? "ההוצאה עודכנה" : "ההוצאה נשמרה", "success");
  try { if (existing) await apiPost({ action: "updateExpense", token: auth.token, expense: { ...expense, projectName: projectName(expense.projectId) } }); else await sendToSheets(expense); }
  catch { notify("השינוי נשמר במכשיר, אבל הסנכרון לענן לא הצליח כרגע.", "error"); }
}

function normalizeDuplicateText(value) { return String(value || "").trim().toLowerCase().replace(/\s+/g, " "); }
function findPossibleDuplicate(expense, ignoredId) {
  const item = normalizeDuplicateText(expense.item);
  const store = normalizeDuplicateText(expense.store);
  return state.expenses.find((saved) => saved.id !== ignoredId && saved.projectId === expense.projectId && Number(saved.amount) === Number(expense.amount) && saved.date === expense.date && (normalizeDuplicateText(saved.item) === item || normalizeDuplicateText(saved.store) === store));
}

function editExpense(expenseId) {
  const expense = state.expenses.find((item) => item.id === expenseId);
  if (!expense) return;
  editingExpenseId = expense.id;
  renderProjectOptions();
  els.expenseProject.value = expense.projectId;
  els.expenseAmount.value = expense.amount;
  els.expenseItem.value = expense.item;
  els.expenseStore.value = expense.store;
  els.expenseCategory.value = expense.category;
  els.expenseDate.value = expense.date;
  els.expenseNote.value = expense.note || "";
  els.expenseSubmitBtn.textContent = "שמור שינויים";
  els.cancelExpenseEditBtn.hidden = false;
  activateView("expenseView");
  document.querySelector(".entry-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  els.expenseAmount.focus();
}

async function deleteExpense(expenseId) {
  const expense = state.expenses.find((item) => item.id === expenseId);
  if (!expense || !window.confirm("למחוק את ההוצאה הזאת?")) return;
  state.expenses = state.expenses.filter((item) => item.id !== expenseId);
  saveState(); renderAll(); notify("ההוצאה נמחקה", "success");
  try { await apiPost({ action: "deleteExpense", token: auth.token, expenseId }); }
  catch { notify("ההוצאה נמחקה מהמכשיר, אבל הסנכרון לענן לא הצליח כרגע.", "error"); }
}

function resetExpenseForm() {
  editingExpenseId = null;
  els.expenseForm.reset();
  els.expenseDate.value = toDateInputValue(new Date());
  els.expenseSubmitBtn.textContent = "שמור הוצאה";
  els.cancelExpenseEditBtn.hidden = true;
}
async function handleProjectSubmit(event) { event.preventDefault(); if (!auth?.token) return renderAuthState(); const name = els.projectName.value.trim(); if (!name) return; const project = { id: createId(), name, active: true }; state.projects.push(project); saveState(); els.projectForm.reset(); renderAll(); notify("הפרויקט נוסף", "success"); try { await apiPost({ action: "saveProject", token: auth.token, project }); } catch {} }
async function deleteProject(projectId) {
  if (!auth?.token) return renderAuthState();
  const project = state.projects.find((item) => item.id === projectId);
  if (!project) return;
  const approved = window.confirm("למחוק את הפרויקט לגמרי מהרשימה? הוצאות ישנות לא יימחקו.");
  if (!approved) return;
  state.projects = state.projects.filter((item) => item.id !== projectId);
  saveState();
  renderAll();
  notify("הפרויקט נמחק", "success");
  try { await apiPost({ action: "deleteProject", token: auth.token, projectId }); }
  catch { notify("נמחק מהמכשיר. לא הצלחתי למחוק מהגוגל שיטס כרגע.", "error"); }
}
function handleSettingsSubmit(event) { event.preventDefault(); state.settings.summaryEmail = els.summaryEmail.value.trim() || "5484916@gmail.com"; state.settings.sheetsUrl = els.sheetsUrl.value.trim() || DEFAULT_SHEETS_URL; saveState(); notify("ההגדרות נשמרו", "success"); }
function renderAll() { renderDashboard(); renderProjects(); renderProjectOptions(); renderSearchProjectOptions(); renderCategorySuggestions(); renderToday(); renderReports(); renderExpenseSearch(); }
function renderDashboard() {
  const todayExpenses = getTodayExpenses();
  const monthExpenses = getMonthExpenses();
  const activeProjects = state.projects.filter((project) => project.active);
  const todaySum = sumExpenses(todayExpenses);
  els.homeTodayTotal.textContent = formatter.format(todaySum);
  els.homeTodayCount.textContent = todayExpenses.length + " הוצאות";
  els.greetingSummary.textContent = todayExpenses.length
    ? "היום: " + formatter.format(todaySum) + " · " + todayExpenses.length + (todayExpenses.length === 1 ? " הוצאה" : " הוצאות")
    : "היום עדיין לא נרשמו הוצאות";
  els.homeMonthTotal.textContent = formatter.format(sumExpenses(monthExpenses));
  els.homeActiveProjects.textContent = String(activeProjects.length);
  els.menuExpenseCount.textContent = String(monthExpenses.length);
  els.menuProjectCount.textContent = String(activeProjects.length);
  renderPremiumHome(monthExpenses);
}
function renderPremiumHome(monthExpenses) {
  const monthTotal = sumExpenses(monthExpenses);
  els.homeAverage.textContent = formatter.format(monthExpenses.length ? monthTotal / monthExpenses.length : 0);
  const today = new Date();
  const days = [];
  for (let offset = 6; offset >= 0; offset--) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset);
    const key = toDateInputValue(date);
    days.push({ date, total: sumExpenses(state.expenses.filter((expense) => expense.date === key)) });
  }
  const currentWeek = days.reduce((sum, day) => sum + day.total, 0);
  let previousWeek = 0;
  for (let offset = 13; offset >= 7; offset--) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset);
    const key = toDateInputValue(date);
    previousWeek += sumExpenses(state.expenses.filter((expense) => expense.date === key));
  }
  const change = previousWeek ? Math.round(((currentWeek - previousWeek) / previousWeek) * 100) : 0;
  els.homeTrend.textContent = previousWeek ? (change > 0 ? "↑ " : change < 0 ? "↓ " : "") + Math.abs(change) + "% מול שבוע קודם" : "7 הימים האחרונים";
  els.homeTrend.classList.toggle("trend-up", change > 0);
  els.homeTrend.classList.toggle("trend-down", change < 0);
  const max = Math.max(1, ...days.map((day) => day.total));
  const weekday = new Intl.DateTimeFormat("he-IL", { weekday: "short" });
  els.homeChart.innerHTML = days.map((day, index) => {
    const height = Math.max(day.total ? 12 : 4, Math.round((day.total / max) * 112));
    const x = 24 + index * 86;
    const y = 132 - height;
    const active = index === 6 ? " active" : "";
    return "<g class=\"chart-column" + active + "\"><rect x=\"" + x + "\" y=\"" + y + "\" width=\"54\" height=\"" + height + "\" rx=\"14\"></rect><text x=\"" + (x + 27) + "\" y=\"158\" text-anchor=\"middle\">" + weekday.format(day.date) + "</text><title>" + formatter.format(day.total) + "</title></g>";
  }).join("");
  els.homeChartEmpty.hidden = days.some((day) => day.total > 0);
  const topBy = (keyFn) => {
    const totals = {};
    monthExpenses.forEach((expense) => { const key = keyFn(expense) || "ללא"; totals[key] = (totals[key] || 0) + Number(expense.amount || 0); });
    return Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0] || "אין עדיין נתונים";
  };
  els.homeTopProject.textContent = topBy((expense) => projectName(expense.projectId));
  els.homeTopCategory.textContent = topBy((expense) => expense.category);
}

function renderProjectOptions() { els.expenseProject.innerHTML = ""; state.projects.filter((project) => project.active).forEach((project) => { const option = document.createElement("option"); option.value = project.id; option.textContent = project.name; els.expenseProject.append(option); }); }
function renderSearchProjectOptions() { const selected = els.searchProject.value; els.searchProject.innerHTML = "<option value=\"\">כל הפרויקטים</option>"; state.projects.forEach((project) => { const option = document.createElement("option"); option.value = project.id; option.textContent = project.name; els.searchProject.append(option); }); if ([...els.searchProject.options].some((option) => option.value === selected)) els.searchProject.value = selected; }
function renderProjects() {
  els.projectList.innerHTML = "";
  if (!state.projects.length) { els.projectList.append(emptyState()); return; }
  state.projects.forEach((project) => {
    const card = document.createElement("article");
    card.className = "project-card folder-card";
    const buttonText = project.active ? "סגור" : "החזר";
    const statusText = project.active ? "פעיל בהוצאות" : "סגור ולא מופיע בטופס";
    const projectMonthExpenses = getMonthExpenses().filter((expense) => expense.projectId === project.id);
    const monthTotal = formatter.format(sumExpenses(projectMonthExpenses));
    card.innerHTML = "<div class=\"folder-info\"><strong>" + escapeHtml(project.name) + "</strong><p class=\"project-meta\">" + statusText + "</p><span>" + monthTotal + " החודש</span></div><div class=\"project-actions\"><button class=\"secondary\" type=\"button\">" + buttonText + "</button><button class=\"danger\" type=\"button\">מחק</button></div>";
    const [toggleBtn, deleteBtn] = card.querySelectorAll("button");
    toggleBtn.addEventListener("click", async () => { project.active = !project.active; saveState(); renderAll(); try { await apiPost({ action: "saveProject", token: auth.token, project }); } catch {} });
    deleteBtn.addEventListener("click", () => deleteProject(project.id));
    els.projectList.append(card);
  });
}
async function handleAgentAssist() {
  const text = els.agentText.value.trim();
  if (!text) { notify("כתוב לסוכן מה נקנה, בכמה ומאיפה", "error"); return; }
  const button = els.agentBtn;
  const originalLabel = button.textContent;
  button.disabled = true;
  button.textContent = "ה-AI מנתח את ההוצאה...";
  let parsed;
  try {
    const activeProjects = state.projects.filter((project) => project.active).map((project) => ({ id: project.id, name: project.name }));
    const result = await apiPost({ action: "parseExpenseWithAI", token: auth?.token, text, projects: activeProjects });
    parsed = result.expense;
  } catch {
    parsed = parseAgentText(text);
    notify("ה-AI לא היה זמין, מילאתי לפי זיהוי בסיסי", "error");
  } finally {
    button.disabled = false;
    button.textContent = originalLabel;
  }
  if (!parsed) { notify("לא הצלחתי להבין את ההוצאה", "error"); return; }
  parsed = refineParsedExpense(text, parsed);
  if (!parsed.projectId && parsed.projectName) {
    const project = { id: createId(), name: parsed.projectName, active: true };
    state.projects.push(project);
    parsed.projectId = project.id;
    saveState();
    renderAll();
    try { await apiPost({ action: "saveProject", token: auth.token, project }); } catch {}
  }
  if (parsed.projectId) els.expenseProject.value = parsed.projectId;
  if (parsed.amount) els.expenseAmount.value = parsed.amount;
  if (parsed.item) els.expenseItem.value = parsed.item;
  if (parsed.store) els.expenseStore.value = parsed.store;
  if (parsed.category) els.expenseCategory.value = parsed.category;
  els.expenseNote.value = parsed.note;
  notify("ה-AI סידר את הטופס. תבדוק ואז שמור.", "success");
}
function refineParsedExpense(text, parsed) {
  const cleanText = String(text || "").replace(/\s+/g, " ").trim();
  const result = { ...(parsed || {}) };
  const purchasePattern = /(?:קניתי|רכשתי|הזמנתי)\s+(.+?)\s+ב([א-תA-Za-z0-9״׳' &.-]+?)\s+ב?\s*[-־]?\s*(\d+(?:[.,]\d+)?)\s*(?:₪|שח|ש"ח|שקל|שקלים)(?=\s|$)/i;
  const purchaseMatch = cleanText.match(purchasePattern);
  if (purchaseMatch) {
    result.item = purchaseMatch[1].trim();
    result.store = purchaseMatch[2].trim();
    result.amount = purchaseMatch[3].replace(",", ".");
  } else {
    const amountMatch = cleanText.match(/(?:ב\s*[-־]?\s*)?(\d+(?:[.,]\d+)?)\s*(?:₪|שח|ש"ח|שקל|שקלים)(?=\s|$)/i);
    if (amountMatch) result.amount = amountMatch[1].replace(",", ".");
    result.item = cleanAiField(result.item, result.amount);
    result.store = cleanAiField(result.store, result.amount);
  }
  const activeProjects = state.projects.filter((project) => project.active);
  const mentionedProject = activeProjects.find((project) => normalizeText(cleanText).includes(normalizeText(project.name)));
  if (mentionedProject) {
    result.projectId = mentionedProject.id;
    result.projectName = mentionedProject.name;
  }
  const inferredCategory = inferCategory(cleanText);
  if (inferredCategory && (!result.category || result.category === "כללי" || inferredCategory !== "כללי")) result.category = inferredCategory;
  result.item = cleanAiField(result.item, result.amount) || "הוצאה כללית";
  result.store = cleanAiField(result.store, result.amount);
  result.note = result.note || "נרשם במילוי החכם: " + cleanText;
  return result;
}
function cleanAiField(value, amount) {
  let field = String(value || "").replace(/\s+/g, " ").trim();
  if (amount) field = field.replace(new RegExp("\\s+ב?\\s*[-־]?\\s*" + escapeRegex(String(amount).replace(".", "[.,]")) + "\\s*(?:₪|שח|ש\\\"ח|שקל|שקלים)?\\s*$", "i"), "");
  field = field.replace(/\s+(?:₪|שח|ש"ח|שקל|שקלים)\s*$/i, "").replace(/\s+ב\s*$/i, "").trim();
  return field;
}

function parseAgentText(text) {
  const cleanText = text.replace(/\s+/g, " ").trim();
  const activeProjects = state.projects.filter((project) => project.active);
  const explicitProject = readLabeledValue(cleanText, ["פרויקט", "עבודה"]);
  const project = activeProjects.find((entry) => normalizeText(cleanText).includes(normalizeText(entry.name)) || (explicitProject && normalizeText(entry.name) === normalizeText(explicitProject)));
  const projectName = project ? project.name : (explicitProject || inferProjectName(cleanText));
  const explicitAmount = readLabeledValue(cleanText, ["סכום", "מחיר", "עלות"]);
  const amountMatch = (explicitAmount || cleanText).match(/(\d{1,3}(?:[,\s]\d{3})*(?:[.]\d+)?|\d+(?:[.,]\d+)?)\s*(?:₪|שח|ש"ח|שקל|שקלים)?/);
  const amount = amountMatch ? amountMatch[1].replace(/\s/g, "").replace(/,(?=\d{3}(?:\D|$))/g, "").replace(",", ".") : "";
  const category = readLabeledValue(cleanText, ["קטגוריה", "סוג"]) || inferCategory(cleanText);
  const store = readLabeledValue(cleanText, ["ספק", "חנות", "בית עסק"]) || inferStore(cleanText);
  const item = readLabeledValue(cleanText, ["פריט", "מוצר", "מה נקנה", "קנייה"]) || inferItem(cleanText, amount, store, projectName, category);
  return { projectId: project?.id || "", projectName, amount, item, store, category, note: "נרשם במילוי החכם: " + cleanText };
}
function normalizeText(value) { return String(value || "").toLowerCase().replace(/[״"'׳.,:;()\-_]/g, " ").replace(/\s+/g, " ").trim(); }
function escapeRegex(value) { return String(value).replace(/[.*+?^$()|[\]\\{}]/g, "\\$&"); }
function readLabeledValue(text, labels) {
  for (const label of labels) {
    const match = text.match(new RegExp("(?:^|[,;|])\\s*" + escapeRegex(label) + "\\s*[:=-]\\s*([^,;|]+)", "i"));
    if (match) return match[1].trim();
  }
  return "";
}
function inferProjectName(text) {
  const match = text.match(/(?:לפרויקט|בפרויקט|פרויקט)\s+([א-תA-Za-z0-9״׳' -]{2,45}?)(?=\s+(?:קניתי|רכשתי|שילמתי|הזמנתי|במחיר|בסכום|בסך|ב-|אצל|מחנות|מספק|₪|שח|ש"ח|שקל|שקלים)|[,;]|$)/);
  return match ? match[1].replace(/[.,;:]+$/g, "").trim() : "";
}
function inferCategory(text) {
  const normalized = normalizeText(text);
  const groups = [
    ["אינסטלציה", ["אינסטלציה", "צינור", "צנרת", "ברז", "ניאגרה", "אסלה", "כיור", "ביוב", "ניקוז"]],
    ["חשמל", ["חשמל", "כבל", "חוט", "שקע", "מפסק", "לוח חשמל", "תאורה", "מנורה", "לד"]],
    ["ריצוף וקרמיקה", ["ריצוף", "רצפה", "קרמיקה", "גרניט פורצלן", "אריח", "פנלים", "רובה"]],
    ["צבע", ["צבע", "שפכטל", "פריימר", "רולר", "מברשת צבע", "סיד"]],
    ["גבס ובידוד", ["גבס", "ניצב", "מסלול", "בידוד", "צמר סלעים", "אקוסטי"]],
    ["חומרי בניין", ["מלט", "בטון", "ברזל", "בלוק", "בלוקים", "חול", "חצץ", "טיט", "דבק", "עץ", "בורג", "ברגים", "מסמר"]],
    ["כלי עבודה וציוד", ["כלי עבודה", "מקדחה", "מברגה", "דיסק", "פטיש", "סולם", "מסור", "מכונה", "ציוד"]],
    ["הובלה ומנוף", ["הובלה", "משלוח", "מנוף", "משאית", "פריקה", "פינוי", "מכולה"]],
    ["עבודה ושכר", ["פועל", "פועלים", "שכר", "יום עבודה", "עובד", "צוות"]],
    ["קבלני משנה", ["קבלן משנה", "חשמלאי", "אינסטלטור", "רצף", "צבעי", "נגר", "מסגר"]],
    ["השכרת ציוד", ["השכרה", "שכירות ציוד", "בובקט", "מחפרון", "פיגום", "מערבל"]],
    ["דלק ונסיעות", ["דלק", "סולר", "בנזין", "חניה", "כביש", "נסיעה", "מונית"]],
    ["בטיחות", ["קסדה", "אפוד", "כפפות", "נעלי עבודה", "בטיחות", "רתמה", "משקפי מגן"]],
    ["משרד ואגרות", ["אגרה", "היתר", "רישיון", "הדפסה", "משרד", "תוכנית", "ביטוח"]],
    ["אוכל וכיבוד", ["אוכל", "שתייה", "כיבוד", "ארוחה", "קפה"]]
  ];
  const searchable = " " + normalized + " ";
  const match = groups.find(([, words]) => words.some((word) => searchable.includes(" " + normalizeText(word) + " ")));
  return match ? match[0] : "כללי";
}
function inferStore(text) {
  const patterns = [
    /(?:אצל|מחנות|בחנות|מספק|מהספק)\s+([א-תA-Za-z0-9״׳' &-]{2,35}?)(?=\s+(?:לפרויקט|בפרויקט|בסכום|בסך|במחיר|ב-|₪|שח|ש"ח|שקל|שקלים)|[,;]|$)/,
    /(?:ב)([א-תA-Za-z][א-תA-Za-z0-9״׳' &-]{1,30}?)(?=\s+(?:לפרויקט|בפרויקט|בסכום|בסך|₪|שח|ש"ח|שקל|שקלים)|[,;]|$)/
  ];
  for (const pattern of patterns) { const match = text.match(pattern); if (match) return match[1].trim(); }
  return "";
}
function inferItem(text, amount, store, projectNameValue, category) {
  let cleaned = text.replace(/(?:קניתי|רכשתי|הזמנתי|שילמתי עבור|שילמתי על|הוצאה עבור|הוצאה של)/g, " ").replace(/(?:לפרויקט|בפרויקט|פרויקט)/g, " ");
  [amount, store, projectNameValue, category].filter(Boolean).forEach((value) => { cleaned = cleaned.replace(new RegExp(escapeRegex(value), "gi"), " "); });
  cleaned = cleaned.replace(/\d[\d,\s.]*(?:₪|שח|ש"ח|שקל|שקלים)?/g, " ").replace(/(?:₪|שח|ש"ח|שקל|שקלים|בסכום|בסך|במחיר|אצל|מחנות|בחנות|מספק|מהספק)/g, " ").replace(/\s+/g, " ").replace(/^[,;:\- ]+|[,;:\- ]+$/g, "").trim();
  return cleaned || "הוצאה כללית";
}

function renderCategorySuggestions() { const categories = [...new Set(state.expenses.map((expense) => expense.category).filter(Boolean))]; els.categorySuggestions.innerHTML = ""; categories.forEach((category) => { const option = document.createElement("option"); option.value = category; els.categorySuggestions.append(option); }); }
function renderToday() { const todayExpenses = getTodayExpenses(); els.todayTotal.textContent = formatter.format(sumExpenses(todayExpenses)); els.todayCount.textContent = String(todayExpenses.length); renderExpenseList(els.todayList, todayExpenses); }
function renderReports() { const monthExpenses = getMonthExpenses(); const byProject = groupTotals(monthExpenses, (expense) => projectName(expense.projectId)); const byCategory = groupTotals(monthExpenses, (expense) => expense.category); els.reportSummary.innerHTML = ""; els.reportSummary.append(summaryRow("סה״כ בחודש", formatter.format(sumExpenses(monthExpenses)))); els.reportSummary.append(summaryRow("מספר הוצאות", String(monthExpenses.length))); Object.entries(byProject).forEach(([name, total]) => els.reportSummary.append(summaryRow("פרויקט: " + name, formatter.format(total)))); Object.entries(byCategory).forEach(([name, total]) => els.reportSummary.append(summaryRow("קטגוריה: " + name, formatter.format(total)))); }
function clearExpenseSearch() { els.expenseSearch.value = ""; els.searchProject.value = ""; els.searchFrom.value = ""; els.searchTo.value = ""; renderExpenseSearch(); }
function renderExpenseSearch() {
  const query = String(els.expenseSearch.value || "").trim().toLowerCase();
  const projectId = els.searchProject.value;
  const from = els.searchFrom.value;
  const to = els.searchTo.value;
  const results = state.expenses.filter((expense) => {
    const haystack = [expense.item, expense.store, expense.category, expense.note, projectName(expense.projectId), String(expense.amount)].join(" ").toLowerCase();
    return (!query || haystack.includes(query)) && (!projectId || expense.projectId === projectId) && (!from || expense.date >= from) && (!to || expense.date <= to);
  }).sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")) || String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  els.searchResultCount.textContent = results.length + (results.length === 1 ? " הוצאה נמצאה" : " הוצאות נמצאו");
  renderExpenseList(els.searchResults, results.slice(0, 100));
}

function renderExpenseList(container, expenses) {
  container.innerHTML = "";
  if (!expenses.length) { container.append(emptyState()); return; }
  expenses.forEach((expense) => {
    const card = document.createElement("article");
    card.className = "expense-card";
    const note = expense.note ? "<p class=\"hint\">" + escapeHtml(expense.note) + "</p>" : "";
    card.innerHTML = "<header><strong>" + escapeHtml(expense.item) + "</strong><strong>" + formatter.format(expense.amount) + "</strong></header><div class=\"expense-meta\"><span>" + escapeHtml(projectName(expense.projectId)) + "</span><span>" + escapeHtml(expense.store) + "</span><span>" + escapeHtml(expense.category) + "</span><span>" + dateFormatter.format(parseLocalDate(expense.date)) + "</span></div>" + note;
    if (expense.receipt) { const link = document.createElement("a"); link.className = "receipt-link"; link.href = expense.receipt.dataUrl; link.target = "_blank"; link.rel = "noreferrer"; link.textContent = "פתח קבלה"; card.append(link); }
    const actions = document.createElement("div"); actions.className = "expense-actions";
    const editBtn = document.createElement("button"); editBtn.className = "secondary"; editBtn.type = "button"; editBtn.textContent = "עריכה"; editBtn.addEventListener("click", () => editExpense(expense.id));
    const deleteBtn = document.createElement("button"); deleteBtn.className = "danger"; deleteBtn.type = "button"; deleteBtn.textContent = "מחיקה"; deleteBtn.addEventListener("click", () => deleteExpense(expense.id));
    actions.append(editBtn, deleteBtn); card.append(actions); container.append(card);
  });
}
function summaryRow(label, value) { const row = document.createElement("div"); row.className = "summary-row"; row.innerHTML = "<span>" + escapeHtml(label) + "</span><strong>" + escapeHtml(value) + "</strong>"; return row; }
function emptyState() { return document.querySelector("#emptyStateTemplate").content.cloneNode(true); }
function getTodayExpenses() { const today = toDateInputValue(new Date()); return state.expenses.filter((expense) => expense.date === today); }
function getMonthExpenses() { const month = els.reportMonth.value || toMonthInputValue(new Date()); return state.expenses.filter((expense) => expense.date.startsWith(month)); }
function getYearExpenses() { const year = (els.reportMonth.value || toMonthInputValue(new Date())).slice(0, 4); return state.expenses.filter((expense) => expense.date.startsWith(year)); }
function sumExpenses(expenses) { return expenses.reduce((total, expense) => total + Number(expense.amount || 0), 0); }
function groupTotals(expenses, getKey) { return expenses.reduce((groups, expense) => { const key = getKey(expense) || "כללי"; groups[key] = (groups[key] || 0) + Number(expense.amount || 0); return groups; }, {}); }
function projectName(projectId) { return state.projects.find((project) => project.id === projectId)?.name || "ללא פרויקט"; }
async function sendSummaryEmail(period) { if (!auth?.token) return renderAuthState(); try { await apiPost({ action: "sendSummary", token: auth.token, period }); notify("דוח ה־PDF נשלח למייל", "success", 7000); } catch (error) { const reason = String(error?.message || "שגיאה לא ידועה"); notify("שליחת הדוח נכשלה: " + reason, "error", 15000); } }
function exportCsv(expenses, filename) { const headers = ["תאריך", "פרויקט", "סכום", "מה נקנה", "חנות", "קטגוריה", "הערה"]; const rows = expenses.map((expense) => [expense.date, projectName(expense.projectId), expense.amount, expense.item, expense.store, expense.category, expense.note]); const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n"); const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }); const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = filename; link.click(); URL.revokeObjectURL(link.href); }
function csvCell(value) { return "\"" + String(value ?? "").replaceAll("\"", "\"\"") + "\""; }
async function sendToSheets(expense) { if (!auth?.token) return; await apiPost({ action: "appendExpense", token: auth.token, expense: { ...expense, projectName: projectName(expense.projectId) } }); }
async function apiPost(payload) {
  if (window.google?.script?.run) {
    return new Promise((resolve, reject) => {
      window.google.script.run
        .withSuccessHandler((data) => {
          if (!data || data.ok === false) reject(new Error(data?.error || "request failed"));
          else resolve(data);
        })
        .withFailureHandler((error) => reject(error))
        .apiPost(payload);
    });
  }

  const response = await fetch(state.settings.sheetsUrl || DEFAULT_SHEETS_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
    redirect: "follow",
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok || data.ok === false) throw new Error(data.error || "request failed");
  return data;
}
async function handleReceiptScan() {
  const file = els.expenseReceipt.files[0];
  if (!file) { notify("צלם או בחר קבלה לפני הסריקה", "error"); return; }
  if (!file.type.startsWith("image/")) { notify("כרגע ניתן לסרוק תמונות קבלה בלבד", "error"); return; }
  const button = els.receiptScanBtn;
  button.disabled = true;
  button.textContent = "ה-AI קורא את הקבלה...";
  els.receiptScanStatus.textContent = "מזהה סכום, ספק, תאריך ופריטים";
  try {
    const image = await compressReceiptImage(file);
    const result = await apiPost({ action: "parseReceiptWithAI", token: auth?.token, receipt: image });
    const expense = result.expense || {};
    if (expense.amount) els.expenseAmount.value = expense.amount;
    if (expense.item) els.expenseItem.value = expense.item;
    if (expense.store) els.expenseStore.value = expense.store;
    if (expense.category) els.expenseCategory.value = expense.category;
    if (expense.date) els.expenseDate.value = expense.date;
    if (expense.note) els.expenseNote.value = expense.note;
    els.receiptScanStatus.textContent = "הקבלה נקראה בהצלחה — כדאי לבדוק לפני שמירה";
    notify("ה-AI מילא את פרטי הקבלה", "success");
  } catch {
    els.receiptScanStatus.textContent = "לא הצלחנו לקרוא את הקבלה. נסה צילום ברור יותר";
    notify("סריקת הקבלה נכשלה. נסה שוב בתאורה טובה", "error");
  } finally {
    button.disabled = false;
    button.textContent = "✨ סרוק קבלה עם AI";
  }
}
function compressReceiptImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const image = new Image();
      image.onerror = reject;
      image.onload = () => {
        const maxSide = 1600;
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
        resolve({ mimeType: "image/jpeg", data: dataUrl.split(",")[1] });
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
function fileToDataUrl(file) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve({ name: file.name, type: file.type, dataUrl: reader.result }); reader.onerror = reject; reader.readAsDataURL(file); }); }
function toDateInputValue(date) { return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate()); }
function toMonthInputValue(date) { return date.getFullYear() + "-" + pad(date.getMonth() + 1); }
function parseLocalDate(value) { const [year, month, day] = value.split("-").map(Number); return new Date(year, month - 1, day); }
function pad(value) { return String(value).padStart(2, "0"); }
function escapeHtml(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
function notify(message, type = "success", duration = 2600) { const existing = document.querySelector(".toast"); if (existing) existing.remove(); const toast = document.createElement("div"); toast.className = "toast " + type; toast.textContent = message; document.body.append(toast); requestAnimationFrame(() => toast.classList.add("show")); window.setTimeout(() => { toast.classList.remove("show"); window.setTimeout(() => toast.remove(), 220); }, duration); }
function createId() { if (window.crypto?.randomUUID) return window.crypto.randomUUID(); return Date.now() + "-" + Math.random().toString(16).slice(2); }
function showInstallPrompt() { els.installPrompt.hidden = false; }
function dismissInstallPrompt() { els.installPrompt.hidden = true; localStorage.setItem(INSTALL_DISMISSED_KEY, String(Date.now())); }
async function refreshApplication() {
  els.refreshBtn.disabled = true;
  els.refreshBtn.classList.add("refreshing");
  notify("בודק אם קיימים עדכונים...", "success");
  try {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) await registration.update();
    }
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key.startsWith("contractor-expenses-")).map((key) => caches.delete(key)));
    }
  } catch {}
  window.setTimeout(() => {
    const freshUrl = location.pathname + "?v=" + Date.now();
    location.replace(freshUrl);
  }, 450);
}

async function installPwa() {
  if (!deferredInstallPrompt) return;
  els.installPrompt.hidden = true;
  deferredInstallPrompt.prompt();
  const choice = await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  els.installBtn.hidden = choice.outcome === "accepted";
}

