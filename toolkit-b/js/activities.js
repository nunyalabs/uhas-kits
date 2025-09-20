// Activities Module (reset)
// Clean implementation of Health Goals, Treatment Mapping, Trial Setup, Schedule, and Summary

let participantActivities = {
  healthGoals: [],
  treatmentPreferences: { selectedPreference: '', comparisonChoice: '', notes: '' },
  trialSetups: [],
};

function initializeActivities() {
  loadActivityData();
  renderHealthGoalsActivity();
  renderTreatmentMappingActivity();
  renderTrialSetupActivity();
  renderSummaryTable();
}

function loadActivityData() {
  try {
    const stored = localStorage.getItem('toolkitB_activities');
    if (stored) {
      const parsed = JSON.parse(stored);
      participantActivities = {
        ...participantActivities,
        ...parsed,
        treatmentPreferences: { ...participantActivities.treatmentPreferences, ...(parsed.treatmentPreferences || {}) },
      };
    }
  } catch (e) { console.error('Error loading activity data', e); }
}

function saveActivityData(silent = true) {
  try {
    localStorage.setItem('toolkitB_activities', JSON.stringify(participantActivities));
    if (!silent && window.toolkitB && window.toolkitB.showNotification) {
      window.toolkitB.showNotification('Activities saved', 'success');
    }
  } catch (e) { console.error('Error saving activity data', e); }
}

// ---------- Health Goals ----------
function renderHealthGoalsActivity(targetEl) {
  const container = targetEl || document.getElementById('healthGoals');
  if (!container) return '';

  if (!Array.isArray(participantActivities.healthGoals)) participantActivities.healthGoals = [];
  if (participantActivities.healthGoals.length === 0) {
    participantActivities.healthGoals.push({ id: generateId(), participantId: '', goals: '', importance: '', measurement: '' });
  }
  const entries = participantActivities.healthGoals;

  const markup = `
    <div class="activity-form">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h5 class="text-white mb-0"><i class="bi bi-heart text-danger"></i> Personal Health Goals</h5>
        <button class="btn btn-gradient btn-primary btn-sm" onclick="addHealthGoalEntry()"><i class="bi bi-plus"></i> Add Participant</button>
      </div>
      <div class="alert alert-info border-0 glass-card mb-4">
        <i class="bi bi-info-circle me-2"></i> Identify outcomes that matter most to participants beyond just lowering blood pressure.
      </div>
      <div id="healthGoalsContainer">${entries.map((e, i) => renderHealthGoalEntry(e, i)).join('')}</div>
      <div class="d-flex gap-2 mt-3">
        <button class="btn btn-gradient btn-success" onclick="saveHealthGoals()"><i class="bi bi-save"></i> Save Goals</button>
        <button class="btn btn-gradient btn-info" onclick="exportHealthGoals()"><i class="bi bi-download"></i> Export</button>
      </div>
    </div>`;

  container.innerHTML = markup;
  return markup;
}

function renderHealthGoalEntry(entry = {}, index) {
  const id = entry.id || generateId();
  const participantId = entry.participantId || '';
  const goals = entry.goals || '';
  const importance = entry.importance || '';
  const measurement = entry.measurement || '';

  return `
    <div class="participant-entry" data-index="${index}" data-id="${id}">
      <div class="row">
        <div class="col-12 col-md-3 mb-3">
          <label class="form-label">Participant (eligible patients only)</label>
          <select class="form-select" onchange="updateHealthGoal(${index}, 'participantId', this.value)">
            <option value="">Select participant</option>
            ${getParticipantOptions(participantId, 'patient', true)}
          </select>
        </div>
        <div class="col-12 col-md-3 mb-3">
          <label class="form-label">What do you want to improve or achieve? 🎯</label>
          <textarea class="form-control" rows="2" onchange="updateHealthGoal(${index}, 'goals', this.value)" placeholder="e.g., Sleep better, Reduce headaches">${goals}</textarea>
        </div>
        <div class="col-12 col-md-3 mb-3">
          <label class="form-label">Why is this important to you?</label>
          <textarea class="form-control" rows="2" onchange="updateHealthGoal(${index}, 'importance', this.value)" placeholder="e.g., So I feel rested for farming">${importance}</textarea>
        </div>
        <div class="col-12 col-md-3 mb-3">
          <label class="form-label">How will you know it's working? (Expected Outcome)</label>
          <textarea class="form-control" rows="2" onchange="updateHealthGoal(${index}, 'measurement', this.value)" placeholder="e.g., Fall asleep quickly, feel rested">${measurement}</textarea>
        </div>
      </div>
      <div class="text-end">
        <button class="btn btn-outline-danger btn-sm" onclick="removeHealthGoalEntry(${index})"><i class="bi bi-trash"></i> Remove</button>
      </div>
    </div>`;
}

function addHealthGoalEntry() {
  participantActivities.healthGoals.push({ id: generateId(), participantId: '', goals: '', importance: '', measurement: '' });
  renderHealthGoalsActivity();
}

function updateHealthGoal(index, field, value) {
  if (participantActivities.healthGoals[index]) {
    participantActivities.healthGoals[index][field] = value;
    saveActivityData();
  }
}

function removeHealthGoalEntry(index) {
  participantActivities.healthGoals.splice(index, 1);
  renderHealthGoalsActivity();
  renderSummaryTable();
}

function saveHealthGoals() { saveActivityData(false); }

function exportHealthGoals() {
  const data = { healthGoals: participantActivities.healthGoals, exportDate: new Date().toISOString() };
  downloadJSON(data, 'health_goals_' + formatDate(new Date()) + '.json');
}

// ---------- Treatment Mapping ----------
function renderTreatmentMappingActivity(targetEl) {
  const container = targetEl || document.getElementById('treatmentMapping');
  if (!container) return '';

  const tp = participantActivities.treatmentPreferences || {};
  const mapping = tp.comparisonChoice || '';
  const prefRadios = ['conventional','herbal','combination'].map(val => `
    <div class="form-check">
      <input class="form-check-input" type="radio" name="treatPref" id="pref_${val}" value="${val}" ${tp.selectedPreference===val?'checked':''} onchange="updateTreatmentPreference('selectedPreference', this.value)">
      <label class="form-check-label text-white" for="pref_${val}"> ${val==='conventional'?'Intervention A (Conventional)':val==='herbal'?'Intervention B (Herbal)':'Intervention C (Combination)'} </label>
    </div>`).join('');
  const cmpOptions = [
    {id:'conv_vs_none',label:'Conventional vs Nothing (A: Conventional, B: None)'},
    {id:'conv_vs_herb',label:'Conventional vs Herbal (A: Conventional, B: Herbal)'},
    {id:'herb_vs_none',label:'Herbal vs Nothing (A: Herbal, B: None)'}
  ].map(opt => `
    <div class="form-check">
      <input class="form-check-input" type="radio" name="compChoice" id="cmp_${opt.id}" value="${opt.id}" ${mapping===opt.id?'checked':''} onchange="updateTreatmentPreference('comparisonChoice', this.value)">
      <label class="form-check-label text-white" for="cmp_${opt.id}">${opt.label}</label>
    </div>`).join('');

  const markup = `
    <div class="activity-form">
      <h5 class="text-white mb-4"><i class="bi bi-diagram-3 text-success"></i> Treatment Preference Mapping</h5>
      <div class="alert alert-info border-0 glass-card mb-4"><i class="bi bi-info-circle me-2"></i> Explore preferences and choose comparison for the N-of-1 trial.</div>
      <div class="row mb-3">
        <div class="col-12 col-md-6">
          <div class="glass-card p-3">
            <h6 class="text-white mb-2">Final Treatment Preference</h6>
            <div class="d-grid gap-2">${prefRadios}</div>
            <hr class="text-white-50"/>
            <h6 class="text-white mb-2">Comparison for N-of-1</h6>
            <div class="d-grid gap-2">${cmpOptions}</div>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="glass-card p-3">
            <h6 class="text-white mb-2">Participant Notes</h6>
            <textarea class="form-control" rows="6" placeholder="Record participant discussions and insights..." onchange="updateTreatmentPreference('notes', this.value)">${tp.notes||''}</textarea>
          </div>
        </div>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-gradient btn-success" onclick="saveTreatmentMapping()"><i class="bi bi-save"></i> Save Preferences</button>
        <button class="btn btn-gradient btn-info" onclick="exportTreatmentMapping()"><i class="bi bi-download"></i> Export</button>
      </div>
    </div>`;

  container.innerHTML = markup;
  return markup;
}

function updateTreatmentPreference(field, value) {
  participantActivities.treatmentPreferences[field] = value;
  saveActivityData();
}

function saveTreatmentMapping() { saveActivityData(false); }

function exportTreatmentMapping() {
  const data = { treatmentPreferences: participantActivities.treatmentPreferences, exportDate: new Date().toISOString() };
  downloadJSON(data, 'treatment_preferences_' + formatDate(new Date()) + '.json');
}

// ---------- Trial Setup ----------
function renderTrialSetupActivity(targetEl) {
  const container = targetEl || document.getElementById('trialSetup');
  if (!container) return '';

  if (!Array.isArray(participantActivities.trialSetups)) participantActivities.trialSetups = [];
  if (participantActivities.trialSetups.length === 0) addTrialSetup();

  const setups = participantActivities.trialSetups;
  const markup = `
    <div class="activity-form">
      <h5 class="text-white mb-4"><i class="bi bi-clipboard-data text-info"></i> N-of-1 Trial Setup</h5>
      <div class="alert alert-info border-0 glass-card mb-4"><i class="bi bi-info-circle me-2"></i> Create a personalized trial plan.</div>
      <div id="trialSetupContainer">${setups.map((s, i) => renderTrialSetupEntry(s, i)).join('')}</div>
      <div class="d-flex gap-2 mt-3">
        <button class="btn btn-gradient btn-primary" onclick="addTrialSetup()"><i class="bi bi-plus"></i> Add Participant Trial</button>
        <button class="btn btn-gradient btn-success" onclick="saveTrialSetups()"><i class="bi bi-save"></i> Save Setups</button>
        <button class="btn btn-gradient btn-info" onclick="exportTrialSetups()"><i class="bi bi-download"></i> Export</button>
      </div>
    </div>`;

  container.innerHTML = markup;
  return markup;
}

function renderTrialSetupEntry(setup = {}, index) {
  const id = setup.id || generateId();
  const participantId = setup.participantId || '';
  const chosenA = setup.treatmentA || '';
  const chosenB = setup.treatmentB || '';
  const human = { conventional: 'Conventional', herbal: 'Herbal', none: 'Nothing' };
  const aOptions = ['conventional','herbal'];
  const bAllowed = chosenA === 'conventional' ? ['herbal','none'] : chosenA === 'herbal' ? ['conventional','none'] : ['conventional','herbal','none'];
  const goal = getOrCreateHealthGoalFor(participantId);
  const rationaleA = setup.rationaleA || { access:'', cost:'', sideEffects:'', belief:'', preferred:'' };
  const rationaleB = setup.rationaleB || { access:'', cost:'', sideEffects:'', belief:'', preferred:'' };
  const derivedPref = (function(){
    if (chosenA === 'conventional' && chosenB === 'herbal') return 'Mixed';
    if (chosenA === 'conventional' && chosenB === 'none') return 'Conventional';
    if (chosenA === 'herbal' && chosenB === 'conventional') return 'Mixed';
    if (chosenA === 'herbal' && chosenB === 'none') return 'Herbal';
    return '';
  })();

  return `
    <div class="participant-entry" data-index="${index}" data-id="${id}">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="text-white mb-0">Trial Setup ${index + 1}</h6>
        <button class="btn btn-outline-danger btn-sm" onclick="removeTrialSetup(${index})"><i class="bi bi-trash"></i></button>
      </div>
      <div class="row mb-3">
        <div class="col-12 col-md-4 mb-3">
          <label class="form-label">Participant (eligible patients only)</label>
          <select class="form-select" onchange="updateTrialSetup(${index}, 'participantId', this.value)">
            <option value="">Select participant</option>
            ${getParticipantOptions(participantId, 'patient', true)}
          </select>
        </div>
        <div class="col-12 col-md-4 mb-3">
          <label class="form-label">Intervention A</label>
          <select class="form-select" onchange="updateTrialSetup(${index}, 'treatmentA', this.value); onABUpdated(${index})">
            ${aOptions.map(o => `<option value="${o}" ${chosenA===o?'selected':''}>${human[o]}</option>`).join('')}
          </select>
        </div>
        <div class="col-12 col-md-4 mb-3">
          <label class="form-label">Intervention B</label>
          <select class="form-select" onchange="updateTrialSetup(${index}, 'treatmentB', this.value); onABUpdated(${index})">
            ${bAllowed.map(o => `<option value="${o}" ${chosenB===o?'selected':''}>${human[o]}</option>`).join('')}
          </select>
          <small class="text-white-50">If A is Conventional, B can be Herbal or Nothing; if A is Herbal, B can be Conventional or Nothing.</small>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-12 col-md-4">
          <label class="form-label">Preferred Start Date</label>
          <input type="date" class="form-control" value="${setup.preferredStartDate || ''}" onchange="updateTrialSetup(${index}, 'preferredStartDate', this.value)"/>
        </div>
        <div class="col-12 col-md-3">
          <label class="form-label">Number of Cycles</label>
          <select class="form-select" onchange="updateTrialSetup(${index}, 'cycles', this.value)">
            ${['2','3','4'].map(v => `<option value="${v}" ${String(setup.cycles||'2')===v?'selected':''}>${v} cycles</option>`).join('')}
          </select>
        </div>
        <div class="col-12 col-md-3">
          <label class="form-label">Days per Block</label>
          <select class="form-select" onchange="updateTrialSetup(${index}, 'daysPerBlock', this.value)">
            ${['3','5','7','14'].map(v => `<option value="${v}" ${String(setup.daysPerBlock||'7')===v?'selected':''}>${v} days</option>`).join('')}
          </select>
        </div>
        <div class="col-12 col-md-2">
          <label class="form-label">Trial Design</label>
          <select class="form-select" onchange="updateTrialSetup(${index}, 'design', this.value)">
            ${['alternating','randomized','counterbalanced'].map(v => `<option value="${v}" ${String(setup.design||'alternating')===v?'selected':''}>${v.charAt(0).toUpperCase()+v.slice(1)}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-12 col-md-6 mb-3">
          <label class="form-label">What do you want to improve or achieve?</label>
          <textarea class="form-control" rows="2" placeholder="e.g., Sleep better 😴, Reduce headaches 🤕" onchange="updateGoalForParticipant('${participantId||''}', 'goals', this.value)">${goal.goals || ''}</textarea>
        </div>
        <div class="col-12 col-md-6 mb-3">
          <label class="form-label">Why is this important to you?</label>
          <textarea class="form-control" rows="2" placeholder="e.g., So I feel rested for farming 🌾" onchange="updateGoalForParticipant('${participantId||''}', 'importance', this.value)">${goal.importance || ''}</textarea>
        </div>
      </div>
      <div class="glass-card p-3 mb-3">
        <h6 class="text-white mb-2">Final Preference Rationale</h6>
        <div class="row g-3">
          <div class="col-12 col-md-6">
            <div class="p-2 border rounded-3 border-light-subtle">
              <div class="text-white-50 small mb-2">Intervention A: ${chosenA ? human[chosenA] : '—'}</div>
              <label class="form-label small">Access</label>
              <input class="form-control form-control-sm mb-2" placeholder="e.g., Must go to hospital/clinic" value="${rationaleA.access}" onchange="updateRationale(${index}, 'A', 'access', this.value)">
              <label class="form-label small">Cost</label>
              <input class="form-control form-control-sm mb-2" placeholder="e.g., Covered by NHIS 💳" value="${rationaleA.cost}" onchange="updateRationale(${index}, 'A', 'cost', this.value)">
              <label class="form-label small">Side Effects</label>
              <input class="form-control form-control-sm mb-2" placeholder="e.g., Dizziness 😵" value="${rationaleA.sideEffects}" onchange="updateRationale(${index}, 'A', 'sideEffects', this.value)">
              <label class="form-label small">Belief in Effectiveness</label>
              <input class="form-control form-control-sm mb-2" placeholder="e.g., Brings BP down fast ⚡" value="${rationaleA.belief}" onchange="updateRationale(${index}, 'A', 'belief', this.value)">
              <label class="form-label small">Preferred Situations</label>
              <input class="form-control form-control-sm" placeholder="e.g., For emergencies 🚨" value="${rationaleA.preferred}" onchange="updateRationale(${index}, 'A', 'preferred', this.value)">
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="p-2 border rounded-3 border-light-subtle">
              <div class="text-white-50 small mb-2">Intervention B: ${chosenB ? human[chosenB] : '—'}</div>
              <label class="form-label small">Access</label>
              <input class="form-control form-control-sm mb-2" placeholder="e.g., Available at home or local shop" value="${rationaleB.access}" onchange="updateRationale(${index}, 'B', 'access', this.value)">
              <label class="form-label small">Cost</label>
              <input class="form-control form-control-sm mb-2" placeholder="e.g., Low or out-of-pocket" value="${rationaleB.cost}" onchange="updateRationale(${index}, 'B', 'cost', this.value)">
              <label class="form-label small">Side Effects</label>
              <input class="form-control form-control-sm mb-2" placeholder="e.g., None noticed" value="${rationaleB.sideEffects}" onchange="updateRationale(${index}, 'B', 'sideEffects', this.value)">
              <label class="form-label small">Belief in Effectiveness</label>
              <input class="form-control form-control-sm mb-2" placeholder="e.g., Works gradually" value="${rationaleB.belief}" onchange="updateRationale(${index}, 'B', 'belief', this.value)">
              <label class="form-label small">Preferred Situations</label>
              <input class="form-control form-control-sm" placeholder="e.g., For maintenance" value="${rationaleB.preferred}" onchange="updateRationale(${index}, 'B', 'preferred', this.value)">
            </div>
          </div>
        </div>
        <div class="mt-2"><small class="text-white">Final Treatment Preference: <strong>${derivedPref || '—'}</strong></small></div>
      </div>
      <div class="row mb-2">
        <div class="col-12 col-md-4">
          <label class="form-label">Primary Outcome</label>
          <input type="text" class="form-control" value="BP" readonly>
        </div>
        <div class="col-12 col-md-8">
          <label class="form-label">Mediator Measures (type to specify)</label>
          <input type="text" class="form-control" placeholder="e.g., Headaches, Sleep" value="${(setup.mediators || []).join(', ')}" onchange="updateMediatorFree(${index}, this.value)">
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="d-flex align-items-center gap-2">
            <button class="btn btn-sm btn-outline-info" onclick="downloadScheduleFor(${index})"><i class="bi bi-download"></i> Download Schedule</button>
            <small class="text-white-50">Schedule is auto-generated for download. A concise trial summary is shown below.</small>
          </div>
          <div class="glass-card p-3 mt-2">
            <div class="row">
              <div class="col-12 col-md-4"><small class="text-white">Intervention A</small><div class="text-white">${chosenA || '—'}</div></div>
              <div class="col-12 col-md-4"><small class="text-white">Intervention B</small><div class="text-white">${chosenB || '—'}</div></div>
              <div class="col-12 col-md-4"><small class="text-white">Estimated Duration</small><div class="text-white">${calcWeeks(setup) || '—'} weeks</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

function addTrialSetup() {
  participantActivities.trialSetups.push({ id: generateId(), participantId: '', treatmentA: 'conventional', treatmentB: 'herbal', preferredStartDate: '', cycles: '2', daysPerBlock: '7', design: 'alternating', mediators: [] });
  renderTrialSetupActivity();
  renderSummaryTable();
}

function updateTrialSetup(index, field, value) {
  const setup = participantActivities.trialSetups[index];
  if (!setup) return;
  setup[field] = value;
  saveActivityData();
  renderTrialSetupActivity();
  renderSummaryTable();
}
function updateRationale(index, which, field, value) {
  const setup = participantActivities.trialSetups[index];
  if (!setup) return;
  const key = which === 'A' ? 'rationaleA' : 'rationaleB';
  setup[key] = setup[key] || { access:'', cost:'', sideEffects:'', belief:'', preferred:'' };
  setup[key][field] = value;
  saveActivityData();
}

function updateMediatorFree(index, value) {
  const list = value.split(',').map(s => s.trim()).filter(Boolean);
  if (participantActivities.trialSetups[index]) {
    participantActivities.trialSetups[index].mediators = list;
    saveActivityData();
  }
}

// Ensure a health goal entry exists for a participant and return it
function getOrCreateHealthGoalFor(participantId) {
  if (!participantId) return { goals: '', importance: '', measurement: '' };
  if (!Array.isArray(participantActivities.healthGoals)) participantActivities.healthGoals = [];
  let entry = participantActivities.healthGoals.find(g => g.participantId === participantId);
  if (!entry) {
    entry = { id: generateId(), participantId, goals: '', importance: '', measurement: '' };
    participantActivities.healthGoals.push(entry);
    saveActivityData();
  }
  return entry;
}

function updateGoalForParticipant(participantId, field, value) {
  if (!participantId) return;
  const entry = getOrCreateHealthGoalFor(participantId);
  entry[field] = value;
  saveActivityData();
  renderSummaryTable();
}

// When A/B changes, auto-set final preference and comparison mapping
function onABUpdated(index) {
  const setup = participantActivities.trialSetups[index];
  if (!setup) return;
  const A = setup.treatmentA;
  const B = setup.treatmentB;
  if (A === 'conventional') {
    participantActivities.treatmentPreferences.selectedPreference = (B === 'herbal') ? 'combination' : 'conventional';
    participantActivities.treatmentPreferences.comparisonChoice = (B === 'herbal') ? 'conv_vs_herb' : 'conv_vs_none';
  } else if (A === 'herbal') {
    participantActivities.treatmentPreferences.selectedPreference = (B === 'conventional') ? 'combination' : 'herbal';
    participantActivities.treatmentPreferences.comparisonChoice = (B === 'conventional') ? 'conv_vs_herb' : 'herb_vs_none';
  }
  saveActivityData();
  renderTreatmentMappingActivity();
  renderSummaryTable();
}

function removeTrialSetup(index) {
  participantActivities.trialSetups.splice(index, 1);
  renderTrialSetupActivity();
  renderSummaryTable();
}

function saveTrialSetups() {
  // Persist current setups
  saveActivityData(false);
  // Optional: show a quick notification if available
  if (window.toolkitB && window.toolkitB.showNotification) {
    window.toolkitB.showNotification('Trial setups saved', 'success');
  }
  // UX: present a fresh blank entry so the form appears cleared for the next participant
  participantActivities.trialSetups = participantActivities.trialSetups || [];
  const fresh = { id: generateId(), participantId: '', treatmentA: 'conventional', treatmentB: 'herbal', preferredStartDate: '', cycles: '2', daysPerBlock: '7', design: 'alternating', mediators: [] };
  participantActivities.trialSetups.push(fresh);
  renderTrialSetupActivity();
  renderSummaryTable();
}

function exportTrialSetups() {
  const data = {
    trialSetups: participantActivities.trialSetups.map(s => ({
      ...s,
      estimatedWeeks: calcWeeks(s),
      comparisonChoice: (participantActivities.treatmentPreferences && participantActivities.treatmentPreferences.comparisonChoice) || '',
      schedulePreview: renderScheduleRows(s).slice(0, 2000)
    })),
    exportDate: new Date().toISOString()
  };
  downloadJSON(data, 'trial_setups_' + formatDate(new Date()) + '.json');
}

// ---------- Summary ----------
function renderSummaryTable() {
  const container = document.getElementById('summaryTable');
  if (!container) return '';

  const rows = generateSummaryData().map(p => `
    <tr>
      <td>${p.id || 'N/A'}</td>
      <td>${p.treatments || 'Not set'}</td>
      <td>${p.goals || 'Not specified'}</td>
      <td>${p.design || 'Not selected'}</td>
      <td>${p.outcomes || 'None selected'}</td>
      <td>${p.duration || 'Not set'}</td>
      <td>
        <button class="btn btn-sm btn-outline-info" onclick="downloadScheduleByParticipantId('${(p.id || '').replace(/'/g, "&apos;")}')"><i class="bi bi-download"></i> Schedule</button>
      </td>
    </tr>`).join('');

  const table = `
    <div class="activity-form">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h5 class="text-white mb-0"><i class="bi bi-table text-warning"></i> Final Summary Table</h5>
        <button class="btn btn-gradient btn-info" onclick="refreshSummary()"><i class="bi bi-arrow-clockwise"></i> Refresh</button>
      </div>
      <div class="alert alert-info border-0 glass-card mb-4"><i class="bi bi-info-circle me-2"></i> Summarize core components of each participant's personalized trial plan.</div>
      <div class="customization-table"><div class="table-responsive"><table class="table table-hover">
        <thead><tr><th>Participant ID</th><th>Chosen Treatment Arms</th><th>Goal Outcome</th><th>Trial Design</th><th>Tracking Metrics</th><th>Willing Duration</th><th>Actions</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="7" class="text-center text-white-50">No participant data available. Complete activities in other tabs first.</td></tr>'}</tbody>
      </table></div></div>
      <div class="d-flex gap-2 mt-3"><button class="btn btn-gradient btn-success" onclick="exportSummaryReport()"><i class="bi bi-file-earmark-excel"></i> Export Summary Report</button></div>
    </div>`;

  container.innerHTML = table;
}

function refreshSummary() { renderSummaryTable(); }

function generateSummaryData() {
  function armName(code) {
    if (code === 'conventional') return 'Conventional';
    if (code === 'herbal') return 'Herbal';
    if (code === 'none') return 'Nothing';
    return '';
  }
  return (participantActivities.trialSetups || []).map(function(setup) {
    const goals = ((participantActivities.healthGoals || []).find(function(g){ return g.participantId === setup.participantId; }) || {});
    const tA = armName(setup.treatmentA);
    const tB = armName(setup.treatmentB);
    return {
      id: setup.participantId || 'N/A',
      treatments: (tA && tB) ? (tA + ' vs ' + tB) : '',
      goals: goals.measurement || goals.goals || '',
      design: setup.design || '',
      outcomes: ['BP'].concat(setup.mediators || []).join(', '),
      duration: (calcWeeks(setup) ? (calcWeeks(setup) + ' weeks') : '')
    };
  });
}

// ---------- Schedule Helpers ----------
function calcWeeks(setup) {
  const cycles = parseInt(setup.cycles || '0', 10);
  const dpb = parseInt(setup.daysPerBlock || '0', 10);
  if (!cycles || !dpb) return '';
  const totalDays = cycles * dpb * 2;
  return Math.ceil(totalDays / 7);
}

function renderScheduleRows(setup) {
  const effA = setup.treatmentA || '';
  const effB = setup.treatmentB || '';

  const rows = [];
  const startStr = setup.preferredStartDate;
  const totalWeeks = calcWeeks(setup) || 1;
  const totalDays = totalWeeks * 7;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  if (!startStr) {
    for (let i = 0; i < Math.min(totalDays, 7); i++) {
      rows.push(`<tr><td class="text-white-50">—</td><td class="text-white">${days[i % 7]}</td><td class="text-white-50">${assignAB(setup, i, effA, effB)}</td><td class="text-white-50">BP${(setup.mediators && setup.mediators.length ? '; ' + setup.mediators.join(', ') : '')}</td></tr>`);
    }
    return rows.join('');
  }

  const start = new Date(startStr + 'T00:00:00');
  for (let d = 0; d < totalDays; d++) {
    const date = new Date(start);
    date.setDate(start.getDate() + d);
    const dayName = date.toLocaleDateString(undefined, { weekday: 'short' });
    rows.push(`<tr><td class="text-white">${date.toLocaleDateString()}</td><td class="text-white">${dayName}</td><td class="text-white-50">${assignAB(setup, d, effA, effB)}</td><td class="text-white-50">BP${(setup.mediators && setup.mediators.length ? '; ' + setup.mediators.join(', ') : '')}</td></tr>`);
  }
  return rows.join('');
}

function assignAB(setup, dayIndex, effA, effB) {
  const dpb = parseInt(setup.daysPerBlock || '7', 10);
  const design = setup.design || 'alternating';
  if (design === 'alternating') {
    const blockIndex = Math.floor(dayIndex / dpb);
    const isABlock = blockIndex % 2 === 0;
    return (isABlock ? 'A' : 'B') + ' (' + ((isABlock ? effA : effB) || '—') + ')';
  }
  if (design === 'counterbalanced') {
    const blockIndex = Math.floor(dayIndex / dpb);
    const cycleIndex = Math.floor(blockIndex / 2);
    const within = blockIndex % 2;
    const isABlock = cycleIndex % 2 === 0 ? (within === 0) : (within === 1);
    return (isABlock ? 'A' : 'B') + ' (' + ((isABlock ? effA : effB) || '—') + ')';
  }
  if (design === 'randomized') {
    const rng = seededRng(setup.id || 'seed');
    const isA = rng(dayIndex) < 0.5;
    return (isA ? 'A' : 'B') + ' (' + ((isA ? effA : effB) || '—') + ')';
  }
  return 'A (' + (effA || '—') + ')';
}

function seededRng(seedStr) {
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
  return function(n) {
    let x = (seed ^ (n + 1)) >>> 0;
    x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
    return (x >>> 0) / 0xffffffff;
  };
}

function downloadScheduleFor(index) {
  const setup = participantActivities.trialSetups[index];
  if (!setup) return;
  const mapping = (participantActivities.treatmentPreferences && participantActivities.treatmentPreferences.comparisonChoice) || '';
  if (!mapping) {
    const msg = 'Please complete Treatment Preference Mapping first.';
    if (window.toolkitB && window.toolkitB.showNotification) window.toolkitB.showNotification(msg, 'warning');
    else alert(msg);
    return;
  }
  const table = `<table><thead><tr><th>Date</th><th>Day</th><th>Assigned</th><th>Track</th></tr></thead><tbody>${renderScheduleRows(setup)}</tbody></table>`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Trial Schedule - ${setup.participantId || ''}</title><style>body{font-family:Arial,sans-serif;margin:40px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px}th{background:#222;color:#fff}</style></head><body><h2>Trial Schedule - ${setup.participantId || ''}</h2>${table}</body></html>`;
  downloadHTML(html, 'trial_schedule_' + (setup.participantId || 'participant') + '_' + formatDate(new Date()) + '.html');
}

function downloadScheduleByParticipantId(participantId) {
  const idx = (participantActivities.trialSetups || []).findIndex(function(s){ return s.participantId === participantId; });
  if (idx === -1) {
    const msg = 'No trial setup found for participant ' + (participantId || '');
    if (window.toolkitB && window.toolkitB.showNotification) window.toolkitB.showNotification(msg, 'warning');
    else alert(msg);
    return;
  }
  downloadScheduleFor(idx);
}

// ---------- Utilities ----------
function generateId() { return 'id_' + Math.random().toString(36).substr(2, 9); }
function formatDate(date) { return date.toISOString().split('T')[0]; }
function formatDateTime(date) { return new Intl.DateTimeFormat('en-GB', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' }).format(date); }

function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}

function downloadHTML(content, filename) {
  const blob = new Blob([content], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}

function getParticipantOptions(selectedId, typeFilter, eligibleOnly) {
  const participants = (window.toolkitB && window.toolkitB.appState && window.toolkitB.appState.participants) || [];
  const filtered = participants.filter(function(p){
    const typeOk = !typeFilter || p.type === typeFilter;
    const eligibleOk = !eligibleOnly || !!p.isEligible;
    return typeOk && eligibleOk;
  });
  return filtered.map(function(p){
    const value = p.id || '';
    const label = (p.id || '') + ' — ' + (p.fullName || '');
    const sel = selectedId === value ? 'selected' : '';
    return '<option value="' + value + '" ' + sel + '>' + label + '</option>';
  }).join('');
}

// ---------- Global bindings ----------
window.initializeActivities = initializeActivities;
window.addHealthGoalEntry = addHealthGoalEntry;
window.updateHealthGoal = updateHealthGoal;
window.removeHealthGoalEntry = removeHealthGoalEntry;
window.saveHealthGoals = function(){ saveActivityData(false); };
window.exportHealthGoals = exportHealthGoals;
window.updateTreatmentPreference = updateTreatmentPreference;
window.saveTreatmentMapping = saveTreatmentMapping;
window.exportTreatmentMapping = exportTreatmentMapping;
window.addTrialSetup = addTrialSetup;
window.updateTrialSetup = updateTrialSetup;
window.updateMediatorFree = updateMediatorFree;
window.removeTrialSetup = removeTrialSetup;
window.saveTrialSetups = saveTrialSetups;
window.exportTrialSetups = exportTrialSetups;
window.refreshSummary = refreshSummary;
window.updateGoalForParticipant = updateGoalForParticipant;
window.onABUpdated = onABUpdated;
window.downloadScheduleByParticipantId = downloadScheduleByParticipantId;
window.exportSummaryReport = function() {
  const summaryData = generateSummaryData();
  const reportHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Co-Design Activities Summary - ${formatDate(new Date())}</title><style>body{font-family:Arial,sans-serif;margin:40px;line-height:1.6}.header{text-align:center;margin-bottom:40px}table{width:100%;border-collapse:collapse;margin-bottom:30px}th,td{border:1px solid #ddd;padding:12px;text-align:left}th{background:#e94435;color:#fff}.section{margin-bottom:30px}.participant-card{border:1px solid #ddd;border-radius:8px;padding:20px;margin-bottom:20px}.participant-id{font-size:1.2em;font-weight:bold;color:#e94435;margin-bottom:10px}</style></head><body><div class="header"><h1>Co-Design Workshop Activities Summary</h1><p>Personalized N-of-1 Trial Protocols</p><p>Generated: ${formatDateTime(new Date())}</p></div><div class="section"><h2>Participant Summary</h2><table><thead><tr><th>Participant ID</th><th>Treatment Arms</th><th>Primary Goals</th><th>Trial Design</th><th>Outcome Tracking</th><th>Duration</th></tr></thead><tbody>${summaryData.map(function(p){return '<tr><td>'+p.id+'</td><td>'+p.treatments+'</td><td>'+p.goals+'</td><td>'+p.design+'</td><td>'+p.outcomes+'</td><td>'+p.duration+'</td></tr>';}).join('')}</tbody></table></div><div class="section"><h2>Individual Participant Cards</h2>${summaryData.map(function(p){return '<div class="participant-card"><div class="participant-id">Participant '+p.id+'</div><p><strong>Health Goals:</strong> '+p.goals+'</p><p><strong>Treatment Comparison:</strong> '+p.treatments+'</p><p><strong>Trial Design:</strong> '+p.design+'</p><p><strong>Outcome Tracking:</strong> '+p.outcomes+'</p><p><strong>Willing Duration:</strong> '+p.duration+'</p></div>';}).join('')}</div><div class="section"><h2>Treatment Preference Analysis</h2><p><strong>Selected Overall Preference:</strong> ${(participantActivities.treatmentPreferences && participantActivities.treatmentPreferences.selectedPreference) || 'Not specified'}</p><p><strong>Comparison Choice (A vs B):</strong> ${(participantActivities.treatmentPreferences && participantActivities.treatmentPreferences.comparisonChoice) || 'Not selected'}</p><p><strong>Facilitator Notes:</strong> ${(participantActivities.treatmentPreferences && participantActivities.treatmentPreferences.notes) || 'None recorded'}</p></div></body></html>`;
  downloadHTML(reportHTML, 'activity_summary_' + formatDate(new Date()) + '.html');
};
