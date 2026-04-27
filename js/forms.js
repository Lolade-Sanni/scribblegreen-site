/* ============================================================
   SCRIBBLE GREEN — FORMS.JS
   Google Sheets integration via Apps Script + form validation
   ============================================================

   ── HOW TO CONNECT TO GOOGLE SHEETS ──────────────────────────
   1. Create a new Google Sheet. Add a sheet tab and name it
      (e.g. "Workshop_Registrations", "Newsletter", "Applications").
      Add column headers matching the form field names.

   2. In the Sheet, click Extensions → Apps Script.
      Paste the following Apps Script code:

   ───────────────────────────────────────────────────────────
   function doPost(e) {
     const SHEET_ID = 'YOUR_SPREADSHEET_ID'; // from the URL
     const ss   = SpreadsheetApp.openById(SHEET_ID);
     const data = JSON.parse(e.postData.contents);
     const sheet = ss.getSheetByName(data.sheetName) || ss.getSheets()[0];
     const row   = [new Date()];
     const headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
     headers.forEach((h,i) => { if(i>0) row.push(data[h] || ''); });
     sheet.appendRow(row);
     return ContentService
       .createTextOutput(JSON.stringify({status:'ok'}))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ───────────────────────────────────────────────────────────

   3. Click Deploy → New Deployment.
      - Type: Web app
      - Execute as: Me
      - Who has access: Anyone
      Click Deploy, copy the Web App URL.

   4. Replace GOOGLE_SCRIPT_URL below with your URL.

   5. In your Sheet, ensure Row 1 has headers:
      Timestamp | name | email | phone | occupation | expectations
      (Column names must match the 'name' attributes on your form fields.)

   6. For the newsletter sheet, Row 1 headers: Timestamp | email

   CORS NOTE: Google Apps Script blocks direct fetch from browsers
   unless you wrap with no-cors or use a proxy. Recommended approach:
   use a simple form-submission service like Formsubmit.co as fallback,
   OR test by deploying and using the URL with ?embedded=true.
   A working no-cors approach is shown in submitToSheet() below.
   ============================================================ */

const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

/**
 * Submits form data to a Google Sheet via Apps Script web app.
 * @param {Object} data  - Key/value pairs matching sheet column headers
 * @param {string} sheetName - Sheet tab name
 * @returns {Promise<boolean>} success
 */
async function submitToSheet(data, sheetName) {
    if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        console.warn('Google Script URL not set. Add your URL to js/forms.js → GOOGLE_SCRIPT_URL');
        return true; // Return true in dev/demo mode so UI can show success
    }
    try {
        const payload = { ...data, sheetName, timestamp: new Date().toISOString() };
        await fetch(GOOGLE_SCRIPT_URL, {
            method : 'POST',
            mode   : 'no-cors',        // Required for Apps Script cross-origin
            headers: { 'Content-Type': 'application/json' },
            body   : JSON.stringify(payload)
        });
        return true;
    } catch (err) {
        console.error('Sheet submission error:', err);
        return false;
    }
}

/**
 * Validates an email address format.
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

/**
 * Validates a field group element.
 * Marks the group as 'has-error' if invalid.
 * @param {HTMLElement} group - .field-group element
 * @returns {boolean}
 */
function validateField(group) {
    const input = group.querySelector('input, select, textarea');
    if (!input) return true;
    group.classList.remove('has-error');
    const val = input.value.trim();
    if (input.hasAttribute('required') && !val) {
        group.classList.add('has-error');
        return false;
    }
    if (input.type === 'email' && val && !isValidEmail(val)) {
        group.classList.add('has-error');
        return false;
    }
    return true;
}

/**
 * Validates all field-groups in a form.
 * @param {HTMLFormElement} form
 * @returns {boolean}
 */
function validateForm(form) {
    let valid = true;
    form.querySelectorAll('.field-group').forEach(group => {
        if (!validateField(group)) valid = false;
    });
    return valid;
}

/**
 * Gathers all named fields from a form into a plain object.
 * @param {HTMLFormElement} form
 */
function serializeForm(form) {
    const data = {};
    new FormData(form).forEach((val, key) => { data[key] = val; });
    return data;
}

/**
 * Handles a workshop / event registration form.
 * Looks for:  data-form="registration" data-sheet="SheetTabName"
 */
function initRegistrationForms() {
    document.querySelectorAll('[data-form="registration"]').forEach(form => {
        form.addEventListener('submit', async e => {
            e.preventDefault();
            if (!validateForm(form)) return;

            const btn     = form.querySelector('[type="submit"]');
            const msgEl   = form.querySelector('.form-submit-msg');
            const origTxt = btn ? btn.textContent : '';
            const sheet   = form.dataset.sheet || 'Registrations';

            if (btn) { btn.textContent = 'Submitting…'; btn.disabled = true; }

            const ok = await submitToSheet(serializeForm(form), sheet);

            if (ok) {
                form.reset();
                if (msgEl) msgEl.classList.add('show');
                if (btn)  { btn.textContent = '✓ Submitted'; }
            } else {
                if (btn) { btn.textContent = origTxt; btn.disabled = false; }
                alert('Submission failed. Please try again or email us directly.');
            }
        });
    });
}

/**
 * Handles newsletter sign-up forms.
 * Looks for: data-form="newsletter"
 * Validates email before submission.
 */
function initNewsletterForms() {
    document.querySelectorAll('[data-form="newsletter"]').forEach(form => {
        const input   = form.querySelector('input[type="email"]');
        const btn     = form.querySelector('[type="submit"]');
        const errEl   = form.querySelector('.nl-error');
        const successEl = form.querySelector('.nl-success');

        form.addEventListener('submit', async e => {
            e.preventDefault();
            if (!input) return;

            // Clear state
            input.classList.remove('input-error');
            if (errEl)     errEl.style.display = 'none';
            if (successEl) successEl.style.display = 'none';

            const email = input.value.trim();

            // Validate: not empty
            if (!email) {
                input.classList.add('input-error');
                if (errEl) { errEl.textContent = 'Please enter your email address.'; errEl.style.display = 'block'; }
                return;
            }
            // Validate: format
            if (!isValidEmail(email)) {
                input.classList.add('input-error');
                if (errEl) { errEl.textContent = 'Please enter a valid email address.'; errEl.style.display = 'block'; }
                return;
            }

            const origTxt = btn ? btn.textContent : '';
            if (btn) { btn.textContent = 'Subscribing…'; btn.disabled = true; }

            const ok = await submitToSheet({ email }, 'Newsletter');

            if (ok) {
                input.value = '';
                if (successEl) successEl.style.display = 'block';
                if (btn)       btn.style.display = 'none';
            } else {
                if (btn) { btn.textContent = origTxt; btn.disabled = false; }
            }
        });
    });
}

/**
 * Handles the ambassador sign-up form.
 */
function initAmbassadorForm() {
    const form = document.getElementById('ambassadorSignupForm');
    if (!form) return;
    form.addEventListener('submit', async e => {
        e.preventDefault();
        if (!validateForm(form)) return;
        const btn   = form.querySelector('[type="submit"]');
        const msgEl = form.querySelector('.form-submit-msg');
        if (btn) { btn.textContent = 'Submitting…'; btn.disabled = true; }
        const ok = await submitToSheet(serializeForm(form), 'Ambassador_Signups');
        if (ok) {
            form.reset();
            if (msgEl) msgEl.classList.add('show');
            if (btn)   btn.textContent = '✓ Submitted';
        } else {
            if (btn) { btn.textContent = 'Submit Application'; btn.disabled = false; }
        }
    });
}

/**
 * Handles the job application form.
 * Note: File uploads cannot be sent via Apps Script JSON.
 * CV file is handled client-side (name displayed) and ideally
 * emailed separately, or use a service like Formsubmit.co
 * with enctype="multipart/form-data" for file uploads.
 */
function initJobApplicationForm() {
    const form = document.getElementById('jobApplicationForm');
    if (!form) return;

    // File upload UI
    const fileInput = form.querySelector('input[type="file"]');
    const fileLabel = form.querySelector('.file-selected');
    if (fileInput && fileLabel) {
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length) {
                fileLabel.textContent = '✓ ' + fileInput.files[0].name;
                fileLabel.classList.add('show');
            }
        });
    }

    form.addEventListener('submit', async e => {
        e.preventDefault();
        if (!validateForm(form)) return;
        const btn   = form.querySelector('[type="submit"]');
        const msgEl = form.querySelector('.form-submit-msg');
        if (btn) { btn.textContent = 'Submitting…'; btn.disabled = true; }
        const data = serializeForm(form);
        if (fileInput && fileInput.files.length) data.cv_filename = fileInput.files[0].name;
        const ok = await submitToSheet(data, 'Job_Applications');
        if (ok) {
            form.reset();
            if (fileLabel) { fileLabel.textContent = ''; fileLabel.classList.remove('show'); }
            if (msgEl) msgEl.classList.add('show');
            if (btn)   btn.textContent = '✓ Application Sent';
        } else {
            if (btn) { btn.textContent = 'Submit Application'; btn.disabled = false; }
        }
    });
}

// Notify-me form (course unavailable page)
function initNotifyForm() {
    document.querySelectorAll('[data-form="notify"]').forEach(form => {
        const input   = form.querySelector('input[type="email"]');
        const btn     = form.querySelector('[type="submit"]');
        const errEl   = form.querySelector('.form-msg--error');
        const successEl = form.querySelector('.form-msg--success');

        form.addEventListener('submit', async e => {
            e.preventDefault();
            if (errEl)     errEl.style.display = 'none';
            if (successEl) successEl.style.display = 'none';
            input?.classList.remove('error');

            const email = input?.value.trim() || '';
            if (!email) {
                if (errEl) { errEl.textContent = 'Please enter your email.'; errEl.style.display = 'block'; }
                input?.classList.add('error');
                return;
            }
            if (!isValidEmail(email)) {
                if (errEl) { errEl.textContent = 'Please enter a valid email address.'; errEl.style.display = 'block'; }
                input?.classList.add('error');
                return;
            }
            const origTxt = btn ? btn.textContent : '';
            if (btn) { btn.textContent = '…'; btn.disabled = true; }
            const ok = await submitToSheet({ email, course: document.title }, 'Course_Notify');
            if (ok) {
                if (input) input.value = '';
                if (successEl) { successEl.textContent = "You're on the list! We'll notify you when this launches."; successEl.style.display = 'block'; }
                if (btn) btn.style.display = 'none';
            } else {
                if (btn) { btn.textContent = origTxt; btn.disabled = false; }
            }
        });
    });
}

// Initialise all form handlers on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initRegistrationForms();
    initNewsletterForms();
    initAmbassadorForm();
    initJobApplicationForm();
    initNotifyForm();
});