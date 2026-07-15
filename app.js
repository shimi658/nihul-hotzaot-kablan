Exit code: 0
Wall time: 0.6 seconds
Output:
const STORAGE_KEY = "contractor-expense-app-v1";
const AUTH_KEY = "contractor-expense-auth-v1";
const DEFAULT_SHEETS_URL = "https://script.google.com/macros/s/AKfycbxnD1RcFoP0tiDTCodCqNV6mTbVHgP_VC0do_eP9GWaF4NmYTKNkcqCh8Ap8I6UTJ_ySA/exec";
const LEGACY_SHEETS_URLS = [
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
const INSTALL_DISMISSED_KEY = "contractor-expense-install-dismissed";

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
  authBackBtn: document.querySelector("#authBackBtn"),
  logoutBtn: document.querySelector("#logoutBtn"),
  userEmailBadge: document.querySelector("#userEmailBadge"),
  tabs: document.querySelectorAll(".tab"), views: document.querySelectorAll(".view"), currentDateLabel: document.querySelector("#currentDateLabel"),
  homeTodayTotal: document.querySelector("#homeTodayTotal"), homeTodayCount: document.querySelector("#homeTodayCount"), homeMonthTotal: document.querySelector("#homeMonthTotal"), homeActiveProjects: document.querySelector("#homeActiveProjects"),
  agentText: document.querySelector("#agentText"), agentBtn: document.querySelector("#agentBtn"),
  expenseForm: document.querySelector("#expenseForm"), expenseProject: document.querySelector("#expenseProject"), expenseAmount: document.querySelector("#expenseAmount"), expenseItem: document.querySelector("#expenseItem"), expenseStore: document.querySelector("#expenseStore"), expenseCategory: document.querySelector("#expenseCategory"), expenseDate: document.querySelector("#expenseDate"), expenseReceipt: document.querySelector("#expenseReceipt"), expenseNote: document.querySelector("#expenseNote"), categorySuggestions: document.querySelector("#categorySuggestions"),
  todayTotal: document.querySelector("#todayTotal"), todayCount: document.querySelector("#todayCount"), todayList: document.querySelector("#todayList"), emailTodayBtn: document.querySelector("#emailTodayBtn"),
  projectForm: document.querySelector("#projectForm"), projectName: document.querySelector("#projectName"), projectList: document.querySelector("#projectList"),
  reportMonth: document.querySelector("#reportMonth"), reportSummary: document.querySelector("#reportSummary"), exportMonthBtn: document.querySelector("#exportMonthBtn"), emailMonthBtn: document.querySelector("#emailMonthBtn"), exportYearBtn: document.querySelector("#exportYearBtn"), emailYearBtn: document.querySelector("#emailYearBtn"),
  settingsForm: document.querySelector("#settingsForm"), summaryEmail: document.querySelector("#summaryEmail"), sheetsUrl: document.querySelector("#sheetsUrl"), installBtn: document.querySelector("#installBtn"),
  installPrompt: document.querySelector("#installPrompt"), confirmInstallBtn: document.querySelector("#confirmInstallBtn"), dismissInstallBtn: document.querySelector("#dismissInstallBtn"), installPromptText: document.querySelector("#installPromptText"),
};

initialize();

function initialize() {
  const accountActions = document.querySelector("#accountActions");
  if (accountActions) accountActions.append(els.userEmailBadge, els.logoutBtn, els.installBtn);
  els.currentDateLabel.textContent = dateFormatter.format(new Date());
  els.expenseDate.value = toDateInputValue(new Date());
  els.reportMonth.value = toMonthInputValue(new Date());
  if (!state.settings.sheetsUrl) { state.settings.sheetsUrl = DEFAULT_SHEETS_URL; saveState(); }
  els.summaryEmail.value = state.settings.summaryEmail;
  els.sheetsUrl.value = state.settings.sheetsUrl;

  els.tabs.forEach((tab) => tab.addEventListener("click", () => activateView(tab.dataset.view)));
  els.agentBtn.addEventListener("click", handleAgentAssist);
  els.expenseForm.addEventListener("submit", handleExpenseSubmit);
  els.projectForm.addEventListener("submit", handleProjectSubmit);
  els.settingsForm.addEventListener("submit", handleSettingsSubmit);
  els.reportMonth.addEventListener("change", renderReports);
  els.exportMonthBtn.addEventListener("click", () => exportCsv(getMonthExpenses(), "doch-hodshi.csv"));
  els.exportYearBtn.addEventListener("click", () => exportCsv(getYearExpenses(), "doch-shnati.csv"));
  els.emailTodayBtn.addEventListener("click", () => sendSummaryEmail("today"));
  els.emailMonthBtn.addEventListener("click", () => sendSummaryEmail("month"));
  els.emailYearBtn.addEventListener("click", () => sendSummaryEmail("year"));
  els.installBtn.addEventListener("click", installPwa);
  els.confirmInstallBtn.addEventListener("click", installPwa);
  els.dismissInstallBtn.addEventListener("click", dismissInstallPrompt);
  els.loginForm.addEventListener("submit", handleLoginRequest);
  els.verifyForm.addEventListener("submit", handleLoginVerify);
  els.authBackBtn.addEventListener("click", resetAuthForms);
  els.logoutBtn.addEventListener("click", logout);

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

  renderAuthState(); renderAll();
  if (auth?.email && auth?.token) syncFromServer();
}

function loadState() { try { const saved = localStorage.getItem(STORAGE_KEY); return saved ? JSON.parse(saved) : createDefaultState(); } catch { return createDefaultState(); } }
function loadAuth() { try { const saved = localStorage.getItem(AUTH_KEY); return saved ? JSON.parse(saved) : null; } catch { return null; } }
function saveAuth() { if (auth) localStorage.setItem(AUTH_KEY, JSON.stringify(auth)); else localStorage.removeItem(AUTH_KEY); }
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
function createDefaultState() { return { projects: [{ id: createId(), name: "פרויקט 1", active: true }, { id: createId(), name: "פרויקט 2", active: true }, { id: createId(), name: "פרויקט 3", active: true }], expenses: [], settings: { summaryEmail: "5484916@gmail.com", sheetsUrl: DEFAULT_SHEETS_URL } }; }

function renderAuthState() {
  const loggedIn = Boolean(auth?.email && auth?.token);
  els.authView.hidden = loggedIn; els.appShell.hidden = !loggedIn; els.logoutBtn.hidden = !loggedIn; els.userEmailBadge.hidden = !loggedIn;
  if (loggedIn) { els.userEmailBadge.textContent = auth.email; els.summaryEmail.value = state.settings.summaryEmail || "5484916@gmail.com"; }
}
async function handleLoginRequest(event) {
  event.preventDefault(); const email = els.loginEmail.value.trim().toLowerCase(); if (!email) return; setAuthBusy(true);
  try { await apiPost({ action: "requestLoginCode", email }); pendingLoginEmail = email; els.authEmailLabel.textContent = email; els.loginForm.hidden = true; els.verifyForm.hidden = false; notify("שלחנו קוד כניסה למייל", "success"); }
  catch { notify("לא הצלחתי לשלוח קוד. בדוק את המייל והחיבור.", "error"); }
  finally { setAuthBusy(false); }
}
async function handleLoginVerify(event) {
  event.preventDefault(); const code = els.loginCode.value.trim(); if (!pendingLoginEmail || !code) return; setAuthBusy(true);
  try { const result = await apiPost({ action: "verifyLoginCode", email: pendingLoginEmail, code }); auth = { email: result.email, token: result.token }; saveAuth(); resetAuthForms(); renderAuthState(); await syncFromServer(); notify("נכנסת בהצלחה", "success"); }
  catch { notify("הקוד לא תקין או שפג תוקף. נסה שוב.", "error"); }
  finally { setAuthBusy(false); }
}
function resetAuthForms() { pendingLoginEmail = ""; els.loginCode.value = ""; els.verifyForm.hidden = true; els.loginForm.hidden = false; }
function setAuthBusy(isBusy) { els.loginForm.querySelectorAll("button,input").forEach((el) => el.disabled = isBusy); els.verifyForm.querySelectorAll("button,input").forEach((el) => el.disabled = isBusy); }
function logout() { auth = null; saveAuth(); state = normalizeState(createDefaultState()); saveState(); renderAuthState(); renderAll(); }
async function syncFromServer() { if (!auth?.token) return; try { const result = await apiPost({ action: "listUserData", token: auth.token }); state.projects = normalizeProjects(result.projects || []); state.expenses = normalizeExpenses(result.expenses || []); state.settings.summaryEmail = state.settings.summaryEmail || "5484916@gmail.com"; saveState(); renderAll(); } catch { notify("לא הצלחתי לסנכרן נתונים מהמייל", "error"); } }
function normalizeProjects(projects) { if (!projects.length) return createDefaultState().projects; return projects.map((project, index) => ({ id: project.id || createId(), name: project.name || "פרויקט " + (index + 1), active: project.active !== false })); }
function normalizeExpenses(expenses) { return expenses.map((expense) => ({ id: expense.id || createId(), projectId: expense.projectId || findProjectIdByName(expense.projectName), amount: Number(expense.amount || 0), item: expense.item || "", store: expense.store || "", category: expense.category || "כללי", date: expense.date || toDateInputValue(new Date()), note: expense.note || "", receipt: null, createdAt: expense.createdAt || new Date().toISOString() })); }
function findProjectIdByName(name) { const project = state.projects.find((item) => item.name === name); return project?.id || state.projects[0]?.id || ""; }
function activateView(viewId) { els.tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.view === viewId)); els.views.forEach((view) => view.classList.toggle("active", view.id === viewId)); renderAll(); }

async function handleExpenseSubmit(event) {
  event.preventDefault(); if (!auth?.token) return renderAuthState();
  const receipt = els.expenseReceipt.files[0] ? await fileToDataUrl(els.expenseReceipt.files[0]) : null;
  const expense = { id: createId(), projectId: els.expenseProject.value, amount: Number(els.expenseAmount.value), item: els.expenseItem.value.trim(), store: els.expenseStore.value.trim(), category: els.expenseCategory.value.trim() || "כללי", date: els.expenseDate.value, note: els.expenseNote.value.trim(), receipt, createdAt: new Date().toISOString() };
  state.expenses.unshift(expense); saveState(); els.expenseForm.reset(); els.expenseDate.value = toDateInputValue(new Date()); renderAll(); activateView("todayView"); notify("ההוצאה נשמרה", "success");
  try { await sendToSheets(expense); } catch {}
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
function renderAll() { renderDashboard(); renderProjects(); renderProjectOptions(); renderCategorySuggestions(); renderToday(); renderReports(); }
function renderDashboard() {
  const todayExpenses = getTodayExpenses();
  const monthExpenses = getMonthExpenses();
  const activeProjects = state.projects.filter((project) => project.active);
  els.homeTodayTotal.textContent = formatter.format(sumExpenses(todayExpenses));
  els.homeTodayCount.textContent = todayExpenses.length + " הוצאות";
  els.homeMonthTotal.textContent = formatter.format(sumExpenses(monthExpenses));
  els.homeActiveProjects.textContent = String(activeProjects.length);
}
function renderProjectOptions() { els.expenseProject.innerHTML = ""; state.projects.filter((project) => project.active).forEach((project) => { const option = document.createElement("option"); option.value = project.id; option.textContent = project.name; els.expenseProject.append(option); }); }
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
  const parsed = parseAgentText(text);
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
  notify("סידרתי את הטופס. תבדוק ואז שמור.", "success");
}
function parseAgentText(text) {
  const activeProjects = state.projects.filter((project) => project.active);
  const project = activeProjects.find((item) => text.includes(item.name));
  const projectName = project ? project.name : inferProjectName(text);
  const amountMatch = text.match(/(\d+(?:[.,]\d+)?)\s*(?:₪|שח|ש"ח|שקל|שקלים)/) || text.match(/(?:ב-|ב\s|על סך|סך)\s*(\d+(?:[.,]\d+)?)/);
  const amount = amountMatch ? amountMatch[1].replace(",", ".") : "";
  const category = inferCategory(text);
  const store = inferStore(text);
  const item = inferItem(text, amount, store, projectName);
  return {
    projectId: project?.id || (projectName ? "" : activeProjects[0]?.id || ""),
    projectName,
    amount,
    item,
    store,
    category,
    note: "נרשם דרך הסוכן החכם: " + text,
  };
}
function inferProjectName(text) {
  const match = text.match(/(?:לפרויקט|פרויקט)\s+([א-תA-Za-z0-9״׳' -]{2,40})(?=\s+(?:ב|ב-|קניתי|קנה|קנייה|רכשתי|שילמתי|הוצאה|₪|שח|ש"ח|שקל|שקלים|אצל|בחנות|מ)|$)/);
  if (!match) return "";
  return match[1].replace(/[.,;:]+$/g, "").trim();
}
function inferCategory(text) {
  const groups = [
    ["חומרים", ["מלט", "בטון", "ברזל", "עץ", "צבע", "גבס", "צינור", "חשמל", "קרמיקה", "ברגים", "דבק", "חול", "בלוקים"]],
    ["הובלה", ["הובלה", "משלוח", "מנוף", "משאית", "פריקה"]],
    ["כלים", ["כלי", "כלים", "מקדחה", "דיסק", "פטיש", "מברגה", "סולם"]],
    ["עבודה", ["עבודה", "פועל", "פועלים", "קבלן משנה", "שכר"]],
  ];
  const match = groups.find(([, words]) => words.some((word) => text.includes(word)));
  return match ? match[0] : "כללי";
}
function inferStore(text) {
  const match = text.match(/(?:בחנות\s+|אצל\s+|מ)([א-תA-Za-z0-9״׳' -]{2,28})(?=\s+(?:לפרויקט|פרויקט|₪|שח|ש"ח|שקל|שקלים)|$)/)
    || text.match(/ב(?!-|\s*\d)([א-תA-Za-z0-9״׳' -]{2,28})(?=\s+(?:לפרויקט|פרויקט|₪|שח|ש"ח|שקל|שקלים)|$)/);
  return match ? match[1].trim() : "";
}
function inferItem(text, amount, store, projectNameValue) {
  let cleaned = text
    .replace(/(?:קניתי|קנה|קנייה|רכשתי|שילמתי|הוצאה|על)/g, " ")
    .replace(/(?:לפרויקט|פרויקט)/g, " ");
  [amount, store, projectNameValue].filter(Boolean).forEach((value) => { cleaned = cleaned.replaceAll(value, " "); });
  cleaned = cleaned
    .replace(/(?:₪|שח|ש"ח|שקל|שקלים|ב-|מ-|אצל|חנות)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned || text.slice(0, 60);
}
function renderCategorySuggestions() { const categories = [...new Set(state.expenses.map((expense) => expense.category).filter(Boolean))]; els.categorySuggestions.innerHTML = ""; categories.forEach((category) => { const option = document.createElement("option"); option.value = category; els.categorySuggestions.append(option); }); }
function renderToday() { const todayExpenses = getTodayExpenses(); els.todayTotal.textContent = formatter.format(sumExpenses(todayExpenses)); els.todayCount.textContent = String(todayExpenses.length); renderExpenseList(els.todayList, todayExpenses); }
function renderReports() { const monthExpenses = getMonthExpenses(); const byProject = groupTotals(monthExpenses, (expense) => projectName(expense.projectId)); const byCategory = groupTotals(monthExpenses, (expense) => expense.category); els.reportSummary.innerHTML = ""; els.reportSummary.append(summaryRow("סה״כ בחודש", formatter.format(sumExpenses(monthExpenses)))); els.reportSummary.append(summaryRow("מספר הוצאות", String(monthExpenses.length))); Object.entries(byProject).forEach(([name, total]) => els.reportSummary.append(summaryRow("פרויקט: " + name, formatter.format(total)))); Object.entries(byCategory).forEach(([name, total]) => els.reportSummary.append(summaryRow("קטגוריה: " + name, formatter.format(total)))); }
function renderExpenseList(container, expenses) { container.innerHTML = ""; if (!expenses.length) { container.append(emptyState()); return; } expenses.forEach((expense) => { const card = document.createElement("article"); card.className = "expense-card"; const note = expense.note ? "<p class=\"hint\">" + escapeHtml(expense.note) + "</p>" : ""; card.innerHTML = "<header><strong>" + escapeHtml(expense.item) + "</strong><strong>" + formatter.format(expense.amount) + "</strong></header><div class=\"expense-meta\"><span>" + escapeHtml(projectName(expense.projectId)) + "</span><span>" + escapeHtml(expense.store) + "</span><span>" + escapeHtml(expense.category) + "</span><span>" + dateFormatter.format(parseLocalDate(expense.date)) + "</span></div>" + note; if (expense.receipt) { const link = document.createElement("a"); link.className = "receipt-link"; link.href = expense.receipt.dataUrl; link.target = "_blank"; link.rel = "noreferrer"; link.textContent = "פתח קבלה"; card.append(link); } container.append(card); }); }
function summaryRow(label, value) { const row = document.createElement("div"); row.className = "summary-row"; row.innerHTML = "<span>" + escapeHtml(label) + "</span><strong>" + escapeHtml(value) + "</strong>"; return row; }
function emptyState() { return document.querySelector("#emptyStateTemplate").content.cloneNode(true); }
function getTodayExpenses() { const today = toDateInputValue(new Date()); return state.expenses.filter((expense) => expense.date === today); }
function getMonthExpenses() { const month = els.reportMonth.value || toMonthInputValue(new Date()); return state.expenses.filter((expense) => expense.date.startsWith(month)); }
function getYearExpenses() { const year = (els.reportMonth.value || toMonthInputValue(new Date())).slice(0, 4); return state.expenses.filter((expense) => expense.date.startsWith(year)); }
function sumExpenses(expenses) { return expenses.reduce((total, expense) => total + Number(expense.amount || 0), 0); }
function groupTotals(expenses, getKey) { return expenses.reduce((groups, expense) => { const key = getKey(expense) || "כללי"; groups[key] = (groups[key] || 0) + Number(expense.amount || 0); return groups; }, {}); }
function projectName(projectId) { return state.projects.find((project) => project.id === projectId)?.name || "ללא פרויקט"; }
async function sendSummaryEmail(period) { if (!auth?.token) return renderAuthState(); try { await apiPost({ action: "sendSummary", token: auth.token, period }); notify("דוח ה־PDF נשלח למייל", "success"); } catch { notify("לא הצלחתי לשלוח. בדוק אינטרנט והרשאות גוגל.", "error"); } }
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
function fileToDataUrl(file) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve({ name: file.name, type: file.type, dataUrl: reader.result }); reader.onerror = reject; reader.readAsDataURL(file); }); }
function toDateInputValue(date) { return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate()); }
function toMonthInputValue(date) { return date.getFullYear() + "-" + pad(date.getMonth() + 1); }
function parseLocalDate(value) { const [year, month, day] = value.split("-").map(Number); return new Date(year, month - 1, day); }
function pad(value) { return String(value).padStart(2, "0"); }
function escapeHtml(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
function notify(message, type = "success") { const existing = document.querySelector(".toast"); if (existing) existing.remove(); const toast = document.createElement("div"); toast.className = "toast " + type; toast.textContent = message; document.body.append(toast); requestAnimationFrame(() => toast.classList.add("show")); window.setTimeout(() => { toast.classList.remove("show"); window.setTimeout(() => toast.remove(), 220); }, 2600); }
function createId() { if (window.crypto?.randomUUID) return window.crypto.randomUUID(); return Date.now() + "-" + Math.random().toString(16).slice(2); }
function showInstallPrompt() { els.installPrompt.hidden = false; }
function dismissInstallPrompt() { els.installPrompt.hidden = true; localStorage.setItem(INSTALL_DISMISSED_KEY, String(Date.now())); }
async function installPwa() {
  if (!deferredInstallPrompt) return;
  els.installPrompt.hidden = true;
  deferredInstallPrompt.prompt();
  const choice = await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  els.installBtn.hidden = choice.outcome === "accepted";
}

