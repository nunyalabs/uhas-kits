// Platform Customization Tools Module
// Implements: Feature Adaptation Tracker, UI Feedback Summary, Design Decision Log, Usability Testing Guide, App Feedback Recording

let customizationState = {
    features: [],
    uiFeedback: [],
    designDecisions: [],
    usabilitySessions: [],
    appFeedback: [],
    screenRecordings: [],
    screenshots: []
};

function initializeCustomization() {
    loadCustomizationData();
    renderFeatureTracker();
    renderUiFeedbackSummary();
    renderDesignLog();
    renderUsabilityTestingGuide();
}

function loadCustomizationData() {
    const stored = localStorage.getItem('toolkitB_customization');
    if (stored) {
        try {
            customizationState = { ...customizationState, ...JSON.parse(stored) };
        } catch (e) { console.error('Customization load failed', e); }
    }
}

function saveCustomizationData() {
    try {
        localStorage.setItem('toolkitB_customization', JSON.stringify(customizationState));
        if (window.toolkitB) window.toolkitB.updateDashboard();
    } catch (e) { console.error('Customization save failed', e); }
}

// 1) Feature Adaptation Tracker
function renderFeatureTracker() {
    const container = document.getElementById('featureTracker');
    if (!container) return;

    container.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="text-white mb-0"><i class="bi bi-kanban text-warning"></i> Feature Adaptation Tracker</h5>
            <button class="btn btn-gradient btn-primary btn-sm" onclick="addFeatureRow()">
                <i class="bi bi-plus"></i> Add Feature
            </button>
        </div>
        <div class="table-responsive customization-table">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Feature Name</th>
                        <th>Requested Change</th>
                        <th>Justification</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody id="featureRows">
                    ${customizationState.features.map((f, i) => renderFeatureRow(f, i)).join('')}
                </tbody>
            </table>
        </div>
        <div class="d-flex gap-2">
            <button class="btn btn-gradient btn-success" onclick="saveCustomizationData(); window.toolkitB?.showNotification('Features saved', 'success')"><i class="bi bi-save"></i> Save</button>
            <button class="btn btn-gradient btn-info" onclick="exportCustomizationSummary()"><i class="bi bi-download"></i> Export</button>
            <button class="btn btn-gradient btn-warning" onclick="exportStakeholderSummary()"><i class="bi bi-people"></i> Stakeholder Summary</button>
        </div>
    `;

    if (customizationState.features.length === 0) {
        // Seed with examples from brief
        customizationState.features = [
            { id: genId(), feature: 'Symptom Entry Page', change: 'Add local language labels', justification: 'Participants struggled with medical terms', status: 'todo' },
            { id: genId(), feature: 'Reminder Notifications', change: 'Enable sound & vibration option', justification: 'Some users do not notice silent alerts', status: 'in-progress' },
            { id: genId(), feature: 'Home Screen Dashboard', change: 'Add colorcoded BP zones', justification: 'Improves quick understanding for low-literacy users', status: 'completed' }
        ];
        saveCustomizationData();
        renderFeatureTracker();
    }
}

function renderFeatureRow(f, i) {
    return `
        <tr>
            <td><input class="form-control form-control-sm" value="${f.feature || ''}" onchange="updateFeature(${i}, 'feature', this.value)"></td>
            <td><input class="form-control form-control-sm" value="${f.change || ''}" onchange="updateFeature(${i}, 'change', this.value)"></td>
            <td><input class="form-control form-control-sm" value="${f.justification || ''}" onchange="updateFeature(${i}, 'justification', this.value)"></td>
            <td>
                <select class="form-select form-select-sm" onchange="updateFeature(${i}, 'status', this.value)">
                    <option value="todo" ${f.status==='todo'?'selected':''}>To Do</option>
                    <option value="in-progress" ${f.status==='in-progress'?'selected':''}>In Progress</option>
                    <option value="completed" ${f.status==='completed'?'selected':''}>Completed</option>
                </select>
            </td>
            <td class="text-end"><button class="btn btn-outline-danger btn-sm" onclick="removeFeature(${i})"><i class="bi bi-trash"></i></button></td>
        </tr>
    `;
}

function addFeatureRow() {
    customizationState.features.push({ id: genId(), feature: '', change: '', justification: '', status: 'todo' });
    renderFeatureTracker();
}
function updateFeature(i, field, val) { customizationState.features[i][field] = val; saveCustomizationData(); }
function removeFeature(i) { customizationState.features.splice(i,1); saveCustomizationData(); renderFeatureTracker(); }

// 2) UI Feedback Summary
function renderUiFeedbackSummary() {
    const container = document.getElementById('uiFeedbackSummary');
    if (!container) return;

    container.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="text-white mb-0"><i class="bi bi-ui-checks-grid text-info"></i> User Interface Feedback Summary</h5>
            <button class="btn btn-gradient btn-primary btn-sm" onclick="addUiFeedback()"><i class="bi bi-plus"></i> Add Row</button>
        </div>
        <div class="table-responsive customization-table">
            <table class="table table-hover">
                <thead>
                    <tr><th>Issue Type</th><th>Details / Quotes</th><th>Action Taken / Planned</th><th></th></tr>
                </thead>
                <tbody id="uiFeedbackRows">
                    ${customizationState.uiFeedback.map((r, i) => `
                        <tr>
                            <td><input class='form-control form-control-sm' value='${r.type||''}' onchange="updateUiFeedback(${i}, 'type', this.value)"></td>
                            <td><input class='form-control form-control-sm' value='${r.details||''}' onchange="updateUiFeedback(${i}, 'details', this.value)"></td>
                            <td><input class='form-control form-control-sm' value='${r.action||''}' onchange="updateUiFeedback(${i}, 'action', this.value)"></td>
                            <td class='text-end'><button class='btn btn-outline-danger btn-sm' onclick='removeUiFeedback(${i})'><i class="bi bi-trash"></i></button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        <div class="d-flex gap-2 mb-3"><button class="btn btn-gradient btn-success" onclick="saveCustomizationData(); window.toolkitB?.showNotification('UI feedback saved','success')"><i class="bi bi-save"></i> Save</button></div>

        <div class="glass-card p-3">
            <h6 class="text-white mb-2">Annotated Screenshots</h6>
            <div id="screenshotRows">${renderScreenshotRows()}</div>
            <button class="btn btn-outline-light btn-sm mt-2" onclick="addScreenshotRow()"><i class="bi bi-plus"></i> Add Screenshot Annotation</button>
        </div>
    `;

    if (customizationState.uiFeedback.length === 0) {
        customizationState.uiFeedback = [
            { id: genId(), type: 'Navigation', details: '“I wasn’t sure which button to press after entering BP.”', action: 'Added Next arrow and clearer labels' },
            { id: genId(), type: 'Language', details: '“What does adherence mean? Use simpler words.”', action: 'Revised terms to local synonyms' },
            { id: genId(), type: 'Visual Layout', details: '“Too much text on the screen.”', action: 'Added spacing and icons for key fields' }
        ];
        saveCustomizationData();
        renderUiFeedbackSummary();
    }
}

function addUiFeedback() { customizationState.uiFeedback.push({ id: genId(), type:'', details:'', action:'' }); renderUiFeedbackSummary(); }
function updateUiFeedback(i, field, val) { customizationState.uiFeedback[i][field] = val; saveCustomizationData(); }
function removeUiFeedback(i) { customizationState.uiFeedback.splice(i,1); saveCustomizationData(); renderUiFeedbackSummary(); }

// 3) Design Decision Log
function renderDesignLog() {
    const container = document.getElementById('designLog');
    if (!container) return;

    container.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="text-white mb-0"><i class="bi bi-journal-check text-success"></i> Design Decision Log</h5>
            <button class="btn btn-gradient btn-primary btn-sm" onclick="addDesignDecision()"><i class="bi bi-plus"></i> Add Entry</button>
        </div>
        <div class="table-responsive customization-table">
            <table class="table table-hover">
                <thead>
                    <tr><th>What Was Changed</th><th>Rationale</th><th>Date of Change</th><th>Responsible Person</th><th></th></tr>
                </thead>
                <tbody>
                    ${customizationState.designDecisions.map((d,i)=>`
                        <tr>
                            <td><input class='form-control form-control-sm' value='${d.change||''}' onchange="updateDecision(${i}, 'change', this.value)"></td>
                            <td><input class='form-control form-control-sm' value='${d.rationale||''}' onchange="updateDecision(${i}, 'rationale', this.value)"></td>
                            <td><input type='date' class='form-control form-control-sm' value='${d.date||''}' onchange="updateDecision(${i}, 'date', this.value)"></td>
                            <td><input class='form-control form-control-sm' value='${d.responsible||''}' onchange="updateDecision(${i}, 'responsible', this.value)"></td>
                            <td class='text-end'><button class='btn btn-outline-danger btn-sm' onclick='removeDecision(${i})'><i class="bi bi-trash"></i></button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        <div class="d-flex gap-2"><button class="btn btn-gradient btn-success" onclick="saveCustomizationData(); window.toolkitB?.showNotification('Design log saved','success')"><i class="bi bi-save"></i> Save</button></div>
    `;

    if (customizationState.designDecisions.length === 0) {
        customizationState.designDecisions = [
            { id: genId(), change: 'Replaced medical jargon with icons', rationale: 'Improve accessibility for low-literacy users', date: '2024-11-01', responsible: 'UI/UX Lead (Adwoa K.)' },
            { id: genId(), change: 'Enabled offline saving', rationale: 'Internet is unreliable in some areas', date: '2024-11-03', responsible: 'Backend Dev (Kwame A.)' }
        ];
        saveCustomizationData();
        renderDesignLog();
    }
}

function addDesignDecision() { customizationState.designDecisions.push({ id: genId(), change:'', rationale:'', date:'', responsible:'' }); renderDesignLog(); }
function updateDecision(i, field, val) { customizationState.designDecisions[i][field] = val; saveCustomizationData(); }
function removeDecision(i) { customizationState.designDecisions.splice(i,1); saveCustomizationData(); renderDesignLog(); }

// 4) Usability Testing Guide + Post-Task Ratings
function renderUsabilityTestingGuide() {
    const container = document.getElementById('usabilityTesting');
    if (!container) return;

    container.innerHTML = `
        <div class="row g-3">
            <div class="col-12 col-xl-7">
                <div class="glass-card p-3 mb-3">
                    <h6 class="text-white mb-2">Task Scenarios (for observation)</h6>
                    <ul class="text-white-50 small mb-3">
                        <li>Log your blood pressure reading</li>
                        <li>Set a reminder to take your treatment</li>
                        <li>Check your progress for the past 3 days</li>
                        <li>Switch between two treatment phases</li>
                    </ul>
                    <div class="table-responsive">
                        <table class="table table-sm" style="background: rgba(255,255,255,0.05);">
                            <thead>
                                <tr style="background: var(--primary-gradient); color: white;">
                                    <th>Observed Task</th><th>Delays</th><th>Confusion</th><th>Errors</th><th>Notes</th>
                                </tr>
                            </thead>
                            <tbody id="observationRows">
                                ${renderObservationRows()}
                            </tbody>
                        </table>
                    </div>
                    <button class="btn btn-outline-light btn-sm" onclick="addObservationRow()"><i class="bi bi-plus"></i> Add Row</button>
                </div>

                <div class="glass-card p-3">
                    <h6 class="text-white mb-2">Post-Task Ratings</h6>
                    <div class="table-responsive">
                        <table class="table table-sm" style="background: rgba(255,255,255,0.05);">
                            <thead>
                                <tr style="background: var(--primary-gradient); color: white;">
                                    <th>Metric</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${['Ease of use','Satisfaction','Confidence in success'].map(metric => renderLikertRow(metric)).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="col-12 col-xl-5">
                <div class="glass-card p-3 mb-3">
                    <h6 class="text-white mb-2">App Feedback Recording Form</h6>
                    <div id="appFeedbackContainer">${renderAppFeedbackCards()}</div>
                    <div class="d-flex gap-2 mt-2">
                        <button class="btn btn-outline-light btn-sm" onclick="addAppFeedback()"><i class="bi bi-plus"></i> Add Feedback</button>
                        <button class="btn btn-gradient btn-success btn-sm" onclick="saveCustomizationData(); window.toolkitB?.showNotification('Feedback saved','success')"><i class="bi bi-save"></i> Save</button>
                        <button class="btn btn-gradient btn-info btn-sm" onclick="exportCustomizationSummary()"><i class="bi bi-download"></i> Export</button>
                    </div>
                </div>

                <div class="glass-card p-3 mb-3">
                    <h6 class="text-white mb-2">Version Control Sheet</h6>
                    <div class="table-responsive">
                        <table class="table table-sm" style="background: rgba(255,255,255,0.05);">
                            <thead>
                                <tr style="background: var(--primary-gradient); color: white;"><th>Version</th><th>Date Released</th><th>Major Changes</th><th>Approved By</th></tr>
                            </thead>
                            <tbody id="versionRows">${renderVersionRows()}</tbody>
                        </table>
                    </div>
                    <button class="btn btn-outline-light btn-sm" onclick="addVersionRow()"><i class="bi bi-plus"></i> Add Version</button>
                </div>

                <div class="glass-card p-3">
                    <h6 class="text-white mb-2">Screen Recording Log</h6>
                    <div class="table-responsive">
                        <table class="table table-sm" style="background: rgba(255,255,255,0.05);">
                            <thead>
                                <tr style="background: var(--primary-gradient); color: white;">
                                    <th>Test ID</th><th>Date</th><th>Device</th><th>Test Scenario</th><th>Stored As</th><th>Notes</th><th></th>
                                </tr>
                            </thead>
                            <tbody id="screenRows">${renderScreenRows()}</tbody>
                        </table>
                    </div>
                    <button class="btn btn-outline-light btn-sm" onclick="addScreenRow()"><i class="bi bi-plus"></i> Add Recording</button>
                </div>
            </div>
        </div>
    `;

    if (customizationState.usabilitySessions.length === 0) {
        customizationState.usabilitySessions.push(defaultUsabilitySession());
        saveCustomizationData();
        renderUsabilityTestingGuide();
    }
}

function defaultUsabilitySession() {
    return {
        id: genId(),
        observations: [
            { id: genId(), task: 'Logging BP', delays: false, confusion: false, errors: false, notes: '' },
            { id: genId(), task: 'Setting a reminder', delays: false, confusion: false, errors: false, notes: '' }
        ],
        ratings: { 'Ease of use': 0, 'Satisfaction': 0, 'Confidence in success': 0 },
            versions: [ { id: genId(), version: 'v1.2.1', date: '2024-11-04', changes: 'New symptom icons, offline support added', approvedBy: 'Core Team' } ]
    };
}

function renderObservationRows() {
    const s = customizationState.usabilitySessions[0] || defaultUsabilitySession();
    return s.observations.map((o, idx)=>`
        <tr>
            <td><input class='form-control form-control-sm' value='${o.task}' onchange="updateObservation(${idx}, 'task', this.value)"></td>
            <td class='text-center'><input type='checkbox' ${o.delays?'checked':''} onchange="updateObservation(${idx}, 'delays', this.checked)"></td>
            <td class='text-center'><input type='checkbox' ${o.confusion?'checked':''} onchange="updateObservation(${idx}, 'confusion', this.checked)"></td>
            <td class='text-center'><input type='checkbox' ${o.errors?'checked':''} onchange="updateObservation(${idx}, 'errors', this.checked)"></td>
            <td><input class='form-control form-control-sm' value='${o.notes||''}' onchange="updateObservation(${idx}, 'notes', this.value)"></td>
        </tr>
    `).join('');
}
function addObservationRow() { const s = customizationState.usabilitySessions[0]; s.observations.push({ id: genId(), task:'', delays:false, confusion:false, errors:false, notes:'' }); saveCustomizationData(); renderUsabilityTestingGuide(); }
function updateObservation(i, field, val) { customizationState.usabilitySessions[0].observations[i][field] = val; saveCustomizationData(); }

function renderLikertRow(metric) {
    const rating = customizationState.usabilitySessions[0]?.ratings?.[metric] || 0;
    return `
        <tr>
            <td class="text-white">${metric}</td>
            ${[1,2,3,4,5].map(n=>`<td class='text-center'><input type='radio' name='${metric}' ${rating===n?'checked':''} onchange="setRating('${metric}', ${n})"></td>`).join('')}
        </tr>
    `;
}
function setRating(metric, val) { customizationState.usabilitySessions[0].ratings[metric] = val; saveCustomizationData(); }

// App Feedback Recording Form
function renderAppFeedbackCards() {
    return customizationState.appFeedback.map((f, i)=>`
        <div class='glass-card p-2 mb-2'>
            <div class='row g-2'>
                <div class='col-12 col-sm-3'><input class='form-control form-control-sm' placeholder='Participant ID' value='${f.participantId||''}' onchange="updateAppFeedback(${i}, 'participantId', this.value)"></div>
                <div class='col-6 col-sm-3'><input type='date' class='form-control form-control-sm' value='${f.date||''}' onchange="updateAppFeedback(${i}, 'date', this.value)"></div>
                <div class='col-6 col-sm-3'><input class='form-control form-control-sm' placeholder='Likes' value='${f.likes||''}' onchange="updateAppFeedback(${i}, 'likes', this.value)"></div>
                <div class='col-12 col-sm-3'><input class='form-control form-control-sm' placeholder='Dislikes' value='${f.dislikes||''}' onchange="updateAppFeedback(${i}, 'dislikes', this.value)"></div>
                <div class='col-12'><input class='form-control form-control-sm' placeholder='Suggestions / Feature Requests' value='${f.suggestions||''}' onchange="updateAppFeedback(${i}, 'suggestions', this.value)"></div>
            </div>
            <div class='text-end mt-2'><button class='btn btn-outline-danger btn-sm' onclick='removeAppFeedback(${i})'><i class="bi bi-trash"></i></button></div>
        </div>
    `).join('') || '<p class="text-white-50 small">No feedback yet</p>';
}
function addAppFeedback() { customizationState.appFeedback.push({ id: genId(), participantId:'', date:'', likes:'', dislikes:'', suggestions:'' }); saveCustomizationData(); renderUsabilityTestingGuide(); }
function updateAppFeedback(i, field, val) { customizationState.appFeedback[i][field] = val; saveCustomizationData(); }
function removeAppFeedback(i) { customizationState.appFeedback.splice(i,1); saveCustomizationData(); renderUsabilityTestingGuide(); }

// Version Control Sheet
function renderVersionRows() {
    const versions = customizationState.usabilitySessions[0]?.versions || [];
    return versions.map((v,i)=>`
        <tr>
            <td><input class='form-control form-control-sm' value='${v.version||''}' onchange="updateVersion(${i}, 'version', this.value)"></td>
            <td><input type='date' class='form-control form-control-sm' value='${v.date||''}' onchange="updateVersion(${i}, 'date', this.value)"></td>
            <td><input class='form-control form-control-sm' value='${v.changes||''}' onchange="updateVersion(${i}, 'changes', this.value)"></td>
            <td><input class='form-control form-control-sm' value='${v.approvedBy||''}' onchange="updateVersion(${i}, 'approvedBy', this.value)"></td>
        </tr>
    `).join('');
}
function addVersionRow() { customizationState.usabilitySessions[0].versions.push({ id: genId(), version:'', date:'', changes:'', approvedBy:'' }); saveCustomizationData(); renderUsabilityTestingGuide(); }
function updateVersion(i, field, val) { customizationState.usabilitySessions[0].versions[i][field] = val; saveCustomizationData(); }

// Export combined customization summary
function exportCustomizationSummary() {
    const html = generateCustomizationSummaryHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `customization_summary_${formatDate(new Date())}.html`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}

function generateCustomizationSummaryHTML() {
    const s = customizationState;
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"><title>Customization Summary - ${formatDate(new Date())}</title>
<style>body{font-family:Arial, sans-serif;margin:40px;line-height:1.6}h2{color:#e94435}table{width:100%;border-collapse:collapse;margin-bottom:20px}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f5f5f5}</style>
</head>
<body>
<h1>Platform Customization Summary</h1>
<p>Generated: ${formatDateTime(new Date())}</p>
<h2>Feature Adaptation Tracker</h2>
<table><thead><tr><th>Feature</th><th>Change</th><th>Justification</th><th>Status</th></tr></thead><tbody>
${s.features.map(f=>`<tr><td>${f.feature}</td><td>${f.change}</td><td>${f.justification}</td><td>${f.status}</td></tr>`).join('')}
</tbody></table>
<h2>User Interface Feedback</h2>
<table><thead><tr><th>Issue Type</th><th>Details / Quotes</th><th>Action Taken / Planned</th></tr></thead><tbody>
${s.uiFeedback.map(r=>`<tr><td>${r.type}</td><td>${r.details}</td><td>${r.action}</td></tr>`).join('')}
</tbody></table>
<h2>Design Decision Log</h2>
<table><thead><tr><th>Change</th><th>Rationale</th><th>Date</th><th>Responsible</th></tr></thead><tbody>
${s.designDecisions.map(d=>`<tr><td>${d.change}</td><td>${d.rationale}</td><td>${d.date}</td><td>${d.responsible}</td></tr>`).join('')}
</tbody></table>
<h2>Usability Testing Ratings</h2>
<table><thead><tr><th>Ease of use</th><th>Satisfaction</th><th>Confidence</th></tr></thead><tbody>
${(()=>{const r=s.usabilitySessions[0]?.ratings||{};return `<tr><td>${r['Ease of use']||0}</td><td>${r['Satisfaction']||0}</td><td>${r['Confidence in success']||0}</td></tr>`})()}
</tbody></table>
<h2>App Feedback Records</h2>
<table><thead><tr><th>Participant ID</th><th>Date</th><th>Likes</th><th>Dislikes</th><th>Suggestions</th></tr></thead><tbody>
${s.appFeedback.map(a=>`<tr><td>${a.participantId}</td><td>${a.date}</td><td>${a.likes}</td><td>${a.dislikes}</td><td>${a.suggestions}</td></tr>`).join('')}
</tbody></table>
</body></nhtml>`;
}

// Helpers
function genId(){ return 'c_'+Math.random().toString(36).slice(2,9); }
function formatDate(d){ return new Date(d).toISOString().split('T')[0]; }
function formatDateTime(date) { return new Intl.DateTimeFormat('en-GB',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(date); }

// Expose globals
window.initializeCustomization = initializeCustomization;
window.exportCustomizationSummary = exportCustomizationSummary;
window.addFeatureRow = addFeatureRow;
window.updateFeature = updateFeature;
window.removeFeature = removeFeature;
window.addUiFeedback = addUiFeedback;
window.updateUiFeedback = updateUiFeedback;
window.removeUiFeedback = removeUiFeedback;
window.addDesignDecision = addDesignDecision;
window.updateDecision = updateDecision;
window.removeDecision = removeDecision;
window.addObservationRow = addObservationRow;
window.setRating = setRating;
window.addAppFeedback = addAppFeedback;
window.updateAppFeedback = updateAppFeedback;
window.removeAppFeedback = removeAppFeedback;
window.addVersionRow = addVersionRow;
window.exportCustomizationSummary = exportCustomizationSummary;
window.exportStakeholderSummary = exportStakeholderSummary;

// New render/update helpers for screenshots and screen recordings
function renderScreenshotRows() {
    return customizationState.screenshots.map((s,i)=>`
        <div class='row g-2 align-items-center mb-2'>
            <div class='col-12 col-md-3'><input class='form-control form-control-sm' placeholder='Before (image URL)' value='${s.before||''}' onchange="updateScreenshot(${i}, 'before', this.value)"></div>
            <div class='col-12 col-md-3'><input class='form-control form-control-sm' placeholder='After (image URL)' value='${s.after||''}' onchange="updateScreenshot(${i}, 'after', this.value)"></div>
            <div class='col-12 col-md-5'><input class='form-control form-control-sm' placeholder='Notes / Callouts' value='${s.notes||''}' onchange="updateScreenshot(${i}, 'notes', this.value)"></div>
            <div class='col-12 col-md-1 text-end'><button class='btn btn-outline-danger btn-sm' onclick='removeScreenshot(${i})'><i class="bi bi-trash"></i></button></div>
        </div>
    `).join('') || '<p class="text-white-50 small">No annotated screenshots yet</p>';
}
function addScreenshotRow(){ customizationState.screenshots.push({ id: genId(), before:'', after:'', notes:'' }); saveCustomizationData(); renderUiFeedbackSummary(); }
function updateScreenshot(i, field, v){ customizationState.screenshots[i][field]=v; saveCustomizationData(); }
function removeScreenshot(i){ customizationState.screenshots.splice(i,1); saveCustomizationData(); renderUiFeedbackSummary(); }

function renderScreenRows(){
    return customizationState.screenRecordings.map((r,i)=>`
        <tr>
            <td><input class='form-control form-control-sm' value='${r.testId||''}' onchange="updateScreen(${i}, 'testId', this.value)"></td>
            <td><input type='date' class='form-control form-control-sm' value='${r.date||''}' onchange="updateScreen(${i}, 'date', this.value)"></td>
            <td><input class='form-control form-control-sm' value='${r.device||''}' onchange="updateScreen(${i}, 'device', this.value)"></td>
            <td><input class='form-control form-control-sm' value='${r.scenario||''}' onchange="updateScreen(${i}, 'scenario', this.value)"></td>
            <td><input class='form-control form-control-sm' value='${r.storedAs||''}' onchange="updateScreen(${i}, 'storedAs', this.value)"></td>
            <td><input class='form-control form-control-sm' value='${r.notes||''}' onchange="updateScreen(${i}, 'notes', this.value)"></td>
            <td class='text-end'><button class='btn btn-outline-danger btn-sm' onclick='removeScreen(${i})'><i class="bi bi-trash"></i></button></td>
        </tr>
    `).join('') || '<tr><td colspan="7" class="text-center text-white-50">No recordings</td></tr>';
}
function addScreenRow(){ customizationState.screenRecordings.push({ id: genId(), testId:'', date:'', device:'', scenario:'', storedAs:'', notes:'' }); saveCustomizationData(); renderUsabilityTestingGuide(); }
function updateScreen(i, field, v){ customizationState.screenRecordings[i][field] = v; saveCustomizationData(); }
function removeScreen(i){ customizationState.screenRecordings.splice(i,1); saveCustomizationData(); renderUsabilityTestingGuide(); }

// Stakeholder summary
function exportStakeholderSummary(){
    const html = generateStakeholderSummary();
    const blob = new Blob([html], { type:'text/html' });
    const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`stakeholder_summary_${formatDate(new Date())}.html`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}
function generateStakeholderSummary(){
    // pull workshop feedback from storage
    let fb = { workshopFeedback: [] };
    try { fb = JSON.parse(localStorage.getItem('toolkitB_feedback') || '{}') || fb; } catch{}
    const groups = ['patient','clinician','herbalist','other'];
    const byGroup = Object.fromEntries(groups.map(g=>[g, (fb.workshopFeedback||[]).filter(f=>f.participantGroup===g)]));
    return `
<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Stakeholder Summary</title>
<style>body{font-family:Arial,sans-serif;margin:40px}h1{color:#e94435}h2{margin-top:24px}table{width:100%;border-collapse:collapse;margin-top:10px}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f5f5f5}</style>
</head><body>
<h1>Summary Report for Stakeholders</h1>
<p>Key usability changes made, major feedback themes, and planned actions per group.</p>
${groups.map(g=>{
    const arr = byGroup[g];
    if(!arr || arr.length===0) return `<h2>${g.charAt(0).toUpperCase()+g.slice(1)}</h2><p>No feedback captured yet.</p>`;
    const topSuggestion = (arr.map(f=>f.improvements).filter(Boolean)[0])||'-';
    const liked = (arr.map(f=>f.likedFeature).filter(Boolean)[0])||'-';
    return `<h2>${g.charAt(0).toUpperCase()+g.slice(1)}</h2>
        <table><tbody>
            <tr><th>Most Liked Feature</th><td>${liked}</td></tr>
            <tr><th>Common Concerns</th><td>${arr.map(f=>f.concerns).filter(Boolean).slice(0,3).join('; ')||'-'}</td></tr>
            <tr><th>Top Suggestion</th><td>${topSuggestion}</td></tr>
        </tbody></table>`;
}).join('')}
</body></nhtml>`;
}
