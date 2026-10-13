/**
 * Carte quote form receiver (Google Apps Script, bound to a Google Sheet).
 * Each request becomes one row in the "Quotes" tab and one notification email.
 * Deploy: Extensions > Apps Script > Deploy > New deployment > Web app
 *         Execute as: Me, Who has access: Anyone. Paste the /exec URL into app.js (FORM_URL).
 */
const NOTIFY = 'sales@aiposlab.com';
const SHEET = 'Quotes';
const COLS = ['Received (PT)', 'Name', 'Restaurant', 'Phone', 'Email', 'Type', 'Tables', 'SMS consent', 'SMS consent text', 'Page', 'Browser'];

function doPost(e) {
  const p = (e && e.parameter) || {};
  const clip = (v, n) => String(v || '').trim().slice(0, n || 300);
  // Hidden field real visitors never fill in.
  if (clip(p.website)) return reply({ ok: true });
  if (!clip(p.Name) || !clip(p.Restaurant) || (!clip(p.Phone) && !clip(p.Email))) return reply({ ok: false, error: 'missing' });

  const consent = clip(p['SMS consent']) === 'Yes';
  const when = Utilities.formatDate(new Date(), 'America/Vancouver', 'yyyy-MM-dd HH:mm:ss');
  // Leading apostrophe keeps Sheets from running anything a visitor types as a formula.
  const safe = v => (/^[=+\-@]/.test(v) ? "'" + v : v);
  const row = [when, clip(p.Name), clip(p.Restaurant), clip(p.Phone, 40), clip(p.Email), clip(p.Type), clip(p.Tables),
    consent ? 'Yes' : 'No', consent ? clip(p['SMS consent text'], 600) : '', clip(p.Page), clip(p.Browser)].map(safe);

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(SHEET);
    if (!sh) { sh = ss.insertSheet(SHEET); sh.appendRow(COLS); sh.setFrozenRows(1); }
    sh.appendRow(row);
  } finally { lock.releaseLock(); }

  const lines = COLS.map((c, i) => c + ': ' + row[i]).join('\n');
  const mail = { to: NOTIFY, subject: 'Quote request: ' + clip(p.Restaurant, 80), body: lines + '\n\n' + SpreadsheetApp.getActiveSpreadsheet().getUrl() };
  if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clip(p.Email))) mail.replyTo = clip(p.Email);
  MailApp.sendEmail(mail);
  return reply({ ok: true });
}

function doGet() { return reply({ ok: true, service: 'carte-quote-form' }); }
function reply(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
