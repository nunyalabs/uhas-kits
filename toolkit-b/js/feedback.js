// App Interface Feedback System Module
// Collect and manage app interface feedback from workshop participants

let feedbackData = {
    usabilityTests: [],
    painPoints: [],
    workshopFeedback: []
};

let studyUFeatures = [
    { id: 'home_screen', name: 'Home screen', icon: 'house' },
    { id: 'symptom_logging', name: 'Symptom logging 📝', icon: 'journal-medical' },
    { id: 'bp_tracking', name: 'BP tracking input 📉', icon: 'activity' },
    { id: 'daily_reminders', name: 'Daily reminder/alerts ⏰', icon: 'alarm' },
    { id: 'treatment_timeline', name: 'Treatment timeline overview 📅', icon: 'calendar-event' },
    { id: 'progress_graphs', name: 'Progress graphs', icon: 'graph-up' },
    { id: 'settings', name: 'Settings & preferences', icon: 'gear' }
];

const painPointCategories = [
    { id: 'confusing', name: 'Confusing or difficult 🤔', color: '#ff9800' },
    { id: 'language', name: 'Language barriers 🗣️', color: '#f44336' },
    { id: 'technical', name: 'Technical issues 🔧', color: '#9c27b0' },
    { id: 'navigation', name: 'Navigation problems 🧭', color: '#2196f3' },
    { id: 'accessibility', name: 'Accessibility issues ♿', color: '#4caf50' }
];

function initializeFeedback() {
    loadFeedbackData();
    renderUsabilityTesting();
    renderPainPointsTracking();
    renderWorkshopFeedback();
}

function loadFeedbackData() {
    const stored = localStorage.getItem('toolkitB_feedback');
    if (stored) {
        try {
            feedbackData = { ...feedbackData, ...JSON.parse(stored) };
        } catch (error) {
            console.error('Error loading feedback data:', error);
        }
    }
}

function renderUsabilityTesting() {
    const container = document.getElementById('usabilityFeedback');
    if (!container) return;

    container.innerHTML = `
        <div class="row mb-4">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center mb-3">
                      <h5 class="text-white mb-0">
                          <i class="bi bi-phone text-primary"></i> App Feature Usability Testing
                      </h5>
                    <div class="d-flex gap-2">
                        <button class="btn btn-gradient btn-primary btn-sm" onclick="addUsabilityTest()">
                            <i class="bi bi-plus"></i> New Test Session
                        </button>
                        <button class="btn btn-outline-light btn-sm" onclick="promptAddFeature()">
                            <i class="bi bi-plus-square"></i> Add Screen/Feature
                        </button>
                    </div>
                </div>
                
                <div class="alert alert-info border-0 glass-card mb-4">
                    <i class="bi bi-info-circle me-2"></i>
                      <strong>Purpose:</strong> Evaluate participant comfort and usability of the app interface.
                    Use emoji stickers or visuals to mark screens participants liked/disliked.
                </div>
            </div>
        </div>

        <div id="usabilityTestContainer">
            ${feedbackData.usabilityTests.map((test, index) => renderUsabilityTest(test, index)).join('')}
        </div>

        <div class="d-flex gap-2 mt-3">
            <button class="btn btn-gradient btn-success" onclick="saveUsabilityTests()">
                <i class="bi bi-save"></i> Save Tests
            </button>
            <button class="btn btn-gradient btn-info" onclick="exportUsabilityReport()">
                <i class="bi bi-download"></i> Export Report
            </button>
        </div>
    `;

    if (feedbackData.usabilityTests.length === 0) {
        addUsabilityTest();
    }
}

function renderUsabilityTest(test = {}, index) {
    const id = test.id || generateId();
    const participantGroup = test.participantGroup || '';
    const testDate = test.testDate || '';
    const facilitator = test.facilitator || '';

    return `
        <div class="feedback-item" data-index="${index}" data-id="${id}">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="text-white mb-0">Usability Test ${index + 1}</h6>
                <button class="btn btn-outline-danger btn-sm" onclick="removeUsabilityTest(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>

            <div class="row mb-3">
                <div class="col-12 col-md-4 mb-2">
                    <label class="form-label">Participant Group</label>
                    <select class="form-select" onchange="updateUsabilityTest(${index}, 'participantGroup', this.value)">
                        <option value="">Select group</option>
                        <option value="patient" ${participantGroup === 'patient' ? 'selected' : ''}>👨‍🌾 Patients</option>
                        <option value="clinician" ${participantGroup === 'clinician' ? 'selected' : ''}>🩺 Clinicians</option>
                        <option value="herbalist" ${participantGroup === 'herbalist' ? 'selected' : ''}>🌿 Herbalists</option>
                        <option value="caregiver" ${participantGroup === 'caregiver' ? 'selected' : ''}>👥 Caregivers</option>
                    </select>
                </div>
                <div class="col-12 col-md-4 mb-2">
                    <label class="form-label">Test Date</label>
                    <input type="date" class="form-control" 
                           value="${testDate}" 
                           onchange="updateUsabilityTest(${index}, 'testDate', this.value)">
                </div>
                <div class="col-12 col-md-4 mb-2">
                    <label class="form-label">Facilitator</label>
                    <input type="text" class="form-control" 
                           value="${facilitator}" 
                           onchange="updateUsabilityTest(${index}, 'facilitator', this.value)"
                           placeholder="Facilitator name">
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <h6 class="text-white mb-3">Feature Usability Ratings</h6>
                    <div class="table-responsive">
                        <table class="table table-sm" style="background: rgba(255,255,255,0.05);">
                            <thead>
                                <tr style="background: var(--primary-gradient); color: white;">
                                    <th>Screen/Feature</th>
                                    <th>Rating (1-5)</th>
                                    <th>Suggestions for Improvement</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${studyUFeatures.map(feature => {
                                    const featureData = test.features && test.features[feature.id] ? test.features[feature.id] : {};
                                    return `
                                        <tr>
                                            <td class="text-white">
                                                <i class="bi bi-${feature.icon} me-2"></i>
                                                ${feature.name}
                                            </td>
                                            
                                            <td>
                                                <div class="rating-scale">
                                                    ${[1, 2, 3, 4, 5].map(rating => `
                                                        <div class="rating-option ${featureData.rating === rating ? 'selected' : ''}" 
                                                             onclick="updateFeatureRating(${index}, '${feature.id}', 'rating', ${rating})">
                                                            ${rating}
                                                        </div>
                                                    `).join('')}
                                                </div>
                                            </td>
                                            <td>
                                                <input type="text" class="form-control form-control-sm" 
                                                       value="${featureData.suggestions || ''}"
                                                       onchange="updateFeatureRating(${index}, '${feature.id}', 'suggestions', this.value)"
                                                       placeholder="e.g., Add pictures or icons">
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="row mt-3">
                <div class="col-12">
                    <label class="form-label">Overall Notes & Observations</label>
                    <textarea class="form-control" rows="3" 
                              onchange="updateUsabilityTest(${index}, 'notes', this.value)"
                              placeholder="Record participant behavior, verbal feedback, and key insights...">${test.notes || ''}</textarea>
                </div>
            </div>
        </div>
    `;
}

function promptAddFeature() {
    const name = prompt('Enter new screen/feature name:');
    if (!name) return;
    const id = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    studyUFeatures.push({ id, name, icon: 'square' });
    // re-render usability testing view to include the new feature
    renderUsabilityTesting();
}

function renderPainPointsTracking() {
    const container = document.getElementById('painPoints');
    if (!container) return;

    container.innerHTML = `
        <div class="row mb-4">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="text-white mb-0">
                        <i class="bi bi-exclamation-triangle text-warning"></i> Pain Points & Improvement Ideas
                    </h5>
                    <button class="btn btn-gradient btn-primary btn-sm" onclick="addPainPoint()">
                        <i class="bi bi-plus"></i> Add Pain Point
                    </button>
                </div>
                
                <div class="alert alert-info border-0 glass-card mb-4">
                    <i class="bi bi-info-circle me-2"></i>
                    <strong>Purpose:</strong> Capture frustrations and suggestions for improving the app experience.
                    Allow participants to speak freely while facilitator notes their concerns.
                </div>
            </div>
        </div>

        <div class="row mb-4">
            <div class="col-12">
                <div class="glass-card p-3">
                    <div class="row">
                        <div class="col-12 col-md-6">
                            <h6 class="text-white mb-3">What was confusing or difficult? 🤔</h6>
                            <div id="difficultiesContainer">
                                ${renderPainPointsList('difficulties')}
                            </div>
                            <button class="btn btn-outline-warning btn-sm" onclick="addPainPointEntry('difficulties')">
                                <i class="bi bi-plus"></i> Add Issue
                            </button>
                        </div>
                        <div class="col-12 col-md-6">
                            <h6 class="text-white mb-3">What would make it easier? 💡</h6>
                            <div id="improvementsContainer">
                                ${renderPainPointsList('improvements')}
                            </div>
                            <button class="btn btn-outline-success btn-sm" onclick="addPainPointEntry('improvements')">
                                <i class="bi bi-plus"></i> Add Idea
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mb-4">
            <div class="col-12">
                <h6 class="text-white mb-3">Categorized Pain Points</h6>
                <div class="row">
                    ${painPointCategories.map(category => `
                        <div class="col-12 col-md-6 col-lg-4 mb-3">
                            <div class="glass-card p-3" style="border-left: 4px solid ${category.color};">
                                <h6 class="text-white mb-2">${category.name}</h6>
                                <div id="category_${category.id}">
                                    ${renderCategoryPainPoints(category.id)}
                                </div>
                                <button class="btn btn-outline-light btn-sm mt-2" 
                                        onclick="addCategorizedPainPoint('${category.id}')">
                                    <i class="bi bi-plus"></i> Add
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <div class="d-flex gap-2 mt-3">
            <button class="btn btn-gradient btn-success" onclick="savePainPoints()">
                <i class="bi bi-save"></i> Save Pain Points
            </button>
            <button class="btn btn-gradient btn-info" onclick="exportPainPointsReport()">
                <i class="bi bi-download"></i> Export Report
            </button>
        </div>
    `;
}

function renderPainPointsList(type) {
    const items = feedbackData.painPoints.filter(p => p.type === type) || [];
    return items.map((item, index) => `
        <div class="mb-2 p-2" style="background: rgba(255,255,255,0.05); border-radius: 8px;">
            <div class="d-flex justify-content-between align-items-start">
                <div class="flex-grow-1">
                    <textarea class="form-control form-control-sm" rows="2" 
                              onchange="updatePainPoint('${item.id}', 'description', this.value)"
                              placeholder="Describe the ${type === 'difficulties' ? 'problem' : 'solution'}...">${item.description || ''}</textarea>
                </div>
                <button class="btn btn-outline-danger btn-sm ms-2" onclick="removePainPoint('${item.id}')">
                    <i class="bi bi-x"></i>
                </button>
            </div>
            <small class="text-white-50">Source: ${item.source || 'Workshop participant'}</small>
        </div>
    `).join('') || '<p class="text-white-50 small">No items yet</p>';
}

function renderCategoryPainPoints(categoryId) {
    const items = feedbackData.painPoints.filter(p => p.category === categoryId) || [];
    return items.map(item => `
        <div class="mb-2 p-2" style="background: rgba(255,255,255,0.05); border-radius: 6px;">
            <div class="d-flex justify-content-between align-items-start">
                <textarea class="form-control form-control-sm" rows="2" 
                          onchange="updatePainPoint('${item.id}', 'description', this.value)"
                          placeholder="Describe the issue...">${item.description || ''}</textarea>
                <button class="btn btn-outline-danger btn-sm ms-1" onclick="removePainPoint('${item.id}')">
                    <i class="bi bi-x"></i>
                </button>
            </div>
        </div>
    `).join('') || '<p class="text-white-50 small">None reported</p>';
}

function renderWorkshopFeedback() {
    const container = document.getElementById('workshopFeedback');
    if (!container) return;

    container.innerHTML = `
        <div class="row mb-4">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="text-white mb-0">
                        <i class="bi bi-clipboard-heart text-success"></i> Participant Workshop Feedback Forms
                    </h5>
                    <button class="btn btn-gradient btn-primary btn-sm" onclick="addWorkshopFeedback()">
                        <i class="bi bi-plus"></i> New Feedback Form
                    </button>
                </div>
                
                <div class="alert alert-info border-0 glass-card mb-4">
                    <i class="bi bi-info-circle me-2"></i>
                    <strong>Purpose:</strong> Gather reflections after the co-design workshop on the trial concept and the app platform.
                </div>
            </div>
        </div>

        <div id="workshopFeedbackContainer">
            ${feedbackData.workshopFeedback.map((feedback, index) => renderWorkshopFeedbackForm(feedback, index)).join('')}
        </div>

        <div class="d-flex gap-2 mt-3">
            <button class="btn btn-gradient btn-success" onclick="saveWorkshopFeedback()">
                <i class="bi bi-save"></i> Save Feedback
            </button>
            <button class="btn btn-gradient btn-info" onclick="exportWorkshopFeedbackReport()">
                <i class="bi bi-download"></i> Export Report
            </button>
        </div>
    `;

    if (feedbackData.workshopFeedback.length === 0) {
        addWorkshopFeedback();
    }
}

function renderWorkshopFeedbackForm(feedback = {}, index) {
    const id = feedback.id || generateId();

    return `
        <div class="feedback-item" data-index="${index}" data-id="${id}">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="text-white mb-0">Feedback Form ${index + 1}</h6>
                <button class="btn btn-outline-danger btn-sm" onclick="removeWorkshopFeedback(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>

            <div class="row mb-3">
                <div class="col-12 col-md-4 mb-2">
                    <label class="form-label">Workshop Title</label>
                    <input type="text" class="form-control" 
                           value="${feedback.workshopTitle || ''}" 
                           onchange="updateWorkshopFeedback(${index}, 'workshopTitle', this.value)"
                           placeholder="Co-design Session">
                </div>
                <div class="col-12 col-md-4 mb-2">
                    <label class="form-label">Date</label>
                    <input type="date" class="form-control" 
                           value="${feedback.date || ''}" 
                           onchange="updateWorkshopFeedback(${index}, 'date', this.value)">
                </div>
                <div class="col-12 col-md-4 mb-2">
                    <label class="form-label">Participant Group</label>
                    <select class="form-select" onchange="updateWorkshopFeedback(${index}, 'participantGroup', this.value)">
                        <option value="">Select group</option>
                        <option value="patient" ${feedback.participantGroup === 'patient' ? 'selected' : ''}>Patient</option>
                        <option value="clinician" ${feedback.participantGroup === 'clinician' ? 'selected' : ''}>Clinician</option>
                        <option value="herbalist" ${feedback.participantGroup === 'herbalist' ? 'selected' : ''}>Herbalist</option>
                        <option value="other" ${feedback.participantGroup === 'other' ? 'selected' : ''}>Other</option>
                    </select>
                </div>
            </div>

            <!-- Section A: Understanding the Trial Concept -->
            <div class="mb-4">
                <h6 class="text-white mb-3">Section A: Understanding the Trial Concept</h6>
                <div class="row">
                    <div class="col-12 col-md-6 mb-3">
                        <label class="form-label">How well did you understand the idea of a personalised N-of-1 trial?</label>
                        <div class="d-flex flex-wrap gap-2">
                            ${['Very well', 'Somewhat', 'A little', 'Not at all'].map(option => `
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" 
                                           name="understanding_${id}" value="${option}"
                                           ${feedback.understanding === option ? 'checked' : ''}
                                           onchange="updateWorkshopFeedback(${index}, 'understanding', '${option}')">
                                    <label class="form-check-label text-white">${option}</label>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="col-12 col-md-6 mb-3">
                        <label class="form-label">What helped you understand it best?</label>
                        <div class="d-flex flex-wrap gap-2">
                            ${['The explanation', 'The activities', 'Examples/stories', 'Other'].map(option => `
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" 
                                           value="${option}"
                                           ${feedback.helpfulElements && feedback.helpfulElements.includes(option) ? 'checked' : ''}
                                           onchange="updateWorkshopFeedbackArray(${index}, 'helpfulElements', '${option}', this.checked)">
                                    <label class="form-check-label text-white">${option}</label>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section B: Platform -->
            <div class="mb-4">
                <h6 class="text-white mb-3">Section B: Perceived Usefulness of the App</h6>
                <div class="row">
                    <div class="col-12 col-md-6 mb-3">
                        <label class="form-label">Do you think the app would be helpful?</label>
                        <div class="d-flex flex-wrap gap-2">
                            ${['Very helpful', 'Somewhat', 'Not helpful', 'Not sure'].map(option => `
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" 
                                           name="helpfulness_${id}" value="${option}"
                                           ${feedback.helpfulness === option ? 'checked' : ''}
                                           onchange="updateWorkshopFeedback(${index}, 'helpfulness', '${option}')">
                                    <label class="form-check-label text-white">${option}</label>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="col-12 col-md-6 mb-3">
                        <label class="form-label">What feature did you like most?</label>
                        <input type="text" class="form-control" 
                               value="${feedback.likedFeature || ''}" 
                               onchange="updateWorkshopFeedback(${index}, 'likedFeature', this.value)"
                               placeholder="Describe the feature...">
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">What concerned or confused you about using the app?</label>
                    <textarea class="form-control" rows="2" 
                              onchange="updateWorkshopFeedback(${index}, 'concerns', this.value)"
                              placeholder="Describe any concerns...">${feedback.concerns || ''}</textarea>
                </div>
            </div>

            <!-- Section C: Digital Tracking Preferences -->
            <div class="mb-4">
                <h6 class="text-white mb-3">Section C: Preferences for Digital Tracking</h6>
                <div class="row">
                    <div class="col-12 col-md-6 mb-3">
                        <label class="form-label">Which information would you prefer to track?</label>
                        <div class="d-flex flex-wrap gap-2">
                            ${['Blood pressure readings', 'Side effects', 'Sleep/energy levels', 'Herbal use', 'Clinic medication', 'Other'].map(option => `
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" 
                                           value="${option}"
                                           ${feedback.trackingPreferences && feedback.trackingPreferences.includes(option) ? 'checked' : ''}
                                           onchange="updateWorkshopFeedbackArray(${index}, 'trackingPreferences', '${option}', this.checked)">
                                    <label class="form-check-label text-white">${option}</label>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="col-12 col-md-6 mb-3">
                        <label class="form-label">How often would you feel comfortable entering information?</label>
                        <div class="d-flex flex-wrap gap-2">
                            ${['Once a day', 'Twice a day', 'Every 2-3 days', 'Only during appointments'].map(option => `
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" 
                                           name="frequency_${id}" value="${option}"
                                           ${feedback.frequency === option ? 'checked' : ''}
                                           onchange="updateWorkshopFeedback(${index}, 'frequency', '${option}')">
                                    <label class="form-check-label text-white">${option}</label>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section D: Suggestions -->
            <div class="mb-3">
                <h6 class="text-white mb-3">Section D: Suggestions for Improvement</h6>
                <div class="row">
                    <div class="col-12 col-md-6 mb-3">
                        <label class="form-label">What would make the trial process or app more useful?</label>
                        <textarea class="form-control" rows="3" 
                                  onchange="updateWorkshopFeedback(${index}, 'improvements', this.value)"
                                  placeholder="Share your suggestions...">${feedback.improvements || ''}</textarea>
                    </div>
                    <div class="col-12 col-md-6 mb-3">
                        <label class="form-label">Any other feedback or questions?</label>
                        <textarea class="form-control" rows="3" 
                                  onchange="updateWorkshopFeedback(${index}, 'otherFeedback', this.value)"
                                  placeholder="Additional comments...">${feedback.otherFeedback || ''}</textarea>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Usability testing functions
function addUsabilityTest() {
    const newTest = {
        id: generateId(),
        participantGroup: '',
        testDate: '',
        facilitator: '',
        features: {},
        notes: ''
    };
    
    feedbackData.usabilityTests.push(newTest);
    renderUsabilityTesting();
}

function updateUsabilityTest(index, field, value) {
    if (feedbackData.usabilityTests[index]) {
        feedbackData.usabilityTests[index][field] = value;
        saveFeedbackData();
    }
}

function updateFeatureRating(testIndex, featureId, field, value) {
    if (feedbackData.usabilityTests[testIndex]) {
        if (!feedbackData.usabilityTests[testIndex].features) {
            feedbackData.usabilityTests[testIndex].features = {};
        }
        if (!feedbackData.usabilityTests[testIndex].features[featureId]) {
            feedbackData.usabilityTests[testIndex].features[featureId] = {};
        }
        
        feedbackData.usabilityTests[testIndex].features[featureId][field] = value;
        saveFeedbackData();
        
        // Update visual selection for ratings
        if (field === 'rating') {
            const testElement = document.querySelector(`[data-index="${testIndex}"]`);
            if (testElement) {
                const ratingElements = testElement.querySelectorAll(`[onclick*="'${featureId}'"][onclick*="'rating'"]`);
                ratingElements.forEach(el => el.classList.remove('selected'));
                const selectedElement = testElement.querySelector(`[onclick*="updateFeatureRating(${testIndex}, '${featureId}', 'rating', ${value})"]`);
                if (selectedElement) selectedElement.classList.add('selected');
            }
        }
    }
}

function removeUsabilityTest(index) {
    feedbackData.usabilityTests.splice(index, 1);
    renderUsabilityTesting();
    saveFeedbackData();
}

// Pain points functions
function addPainPointEntry(type) {
    const newPainPoint = {
        id: generateId(),
        type: type,
        description: '',
        source: 'Workshop participant',
        timestamp: new Date().toISOString()
    };
    
    feedbackData.painPoints.push(newPainPoint);
    renderPainPointsTracking();
}

function addCategorizedPainPoint(category) {
    const newPainPoint = {
        id: generateId(),
        category: category,
        description: '',
        source: 'Workshop participant',
        timestamp: new Date().toISOString()
    };
    
    feedbackData.painPoints.push(newPainPoint);
    renderPainPointsTracking();
}

function updatePainPoint(id, field, value) {
    const painPoint = feedbackData.painPoints.find(p => p.id === id);
    if (painPoint) {
        painPoint[field] = value;
        saveFeedbackData();
    }
}

function removePainPoint(id) {
    const index = feedbackData.painPoints.findIndex(p => p.id === id);
    if (index > -1) {
        feedbackData.painPoints.splice(index, 1);
        renderPainPointsTracking();
        saveFeedbackData();
    }
}

// Workshop feedback functions
function addWorkshopFeedback() {
    const newFeedback = {
        id: generateId(),
        workshopTitle: '',
        date: '',
        participantGroup: '',
        understanding: '',
        helpfulElements: [],
        helpfulness: '',
        likedFeature: '',
        concerns: '',
        trackingPreferences: [],
        frequency: '',
        improvements: '',
        otherFeedback: ''
    };
    
    feedbackData.workshopFeedback.push(newFeedback);
    renderWorkshopFeedback();
}

function updateWorkshopFeedback(index, field, value) {
    if (feedbackData.workshopFeedback[index]) {
        feedbackData.workshopFeedback[index][field] = value;
        saveFeedbackData();
    }
}

function updateWorkshopFeedbackArray(index, field, value, checked) {
    if (feedbackData.workshopFeedback[index]) {
        if (!feedbackData.workshopFeedback[index][field]) {
            feedbackData.workshopFeedback[index][field] = [];
        }
        
        const array = feedbackData.workshopFeedback[index][field];
        if (checked && !array.includes(value)) {
            array.push(value);
        } else if (!checked) {
            const idx = array.indexOf(value);
            if (idx > -1) array.splice(idx, 1);
        }
        
        saveFeedbackData();
    }
}

function removeWorkshopFeedback(index) {
    feedbackData.workshopFeedback.splice(index, 1);
    renderWorkshopFeedback();
    saveFeedbackData();
}

// Save and export functions
function saveFeedbackData() {
    try {
        localStorage.setItem('toolkitB_feedback', JSON.stringify(feedbackData));
    } catch (error) {
        console.error('Error saving feedback data:', error);
    }
}

function saveUsabilityTests() {
    saveFeedbackData();
    if (window.toolkitB) {
        window.toolkitB.showNotification('Usability tests saved successfully!', 'success');
        window.toolkitB.updateDashboard();
    }
}

function savePainPoints() {
    saveFeedbackData();
    if (window.toolkitB) {
        window.toolkitB.showNotification('Pain points saved successfully!', 'success');
    }
}

function saveWorkshopFeedback() {
    saveFeedbackData();
    if (window.toolkitB) {
        window.toolkitB.showNotification('Workshop feedback saved successfully!', 'success');
        window.toolkitB.updateDashboard();
    }
}

// Export functions
function exportUsabilityReport() {
    const reportHTML = generateUsabilityReport();
    downloadHTML(reportHTML, `usability_report_${formatDate(new Date())}.html`);
}

function exportPainPointsReport() {
    const reportHTML = generatePainPointsReport();
    downloadHTML(reportHTML, `pain_points_report_${formatDate(new Date())}.html`);
}

function exportWorkshopFeedbackReport() {
    const reportHTML = generateWorkshopFeedbackReport();
    downloadHTML(reportHTML, `workshop_feedback_report_${formatDate(new Date())}.html`);
}

// Report generation functions
function generateUsabilityReport() {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
        <title>Usability Testing Report - ${formatDate(new Date())}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 40px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #e94435; color: white; }
        .rating-1, .rating-2 { background-color: #ffebee; }
        .rating-3 { background-color: #fff3e0; }
        .rating-4, .rating-5 { background-color: #e8f5e8; }
    </style>
</head>
<body>
    <div class="header">
    <h1>Platform Usability Testing Report</h1>
        <p>Generated: ${formatDateTime(new Date())}</p>
    </div>
    
    ${feedbackData.usabilityTests.map((test, index) => `
        <h2>Test Session ${index + 1} - ${test.participantGroup || 'Unknown Group'}</h2>
        <p><strong>Date:</strong> ${test.testDate || 'Not specified'} | <strong>Facilitator:</strong> ${test.facilitator || 'Not specified'}</p>
        
        <table>
            <thead>
                <tr><th>Feature</th><th>Easy to Use</th><th>Rating</th><th>Suggestions</th></tr>
            </thead>
            <tbody>
                ${studyUFeatures.map(feature => {
                    const featureData = test.features && test.features[feature.id] ? test.features[feature.id] : {};
                    return `
                        <tr class="${featureData.rating ? `rating-${featureData.rating}` : ''}">
                            <td>${feature.name}</td>
                            <td>${featureData.easy === 'yes' ? '✅' : featureData.easy === 'no' ? '❌' : '-'}</td>
                            <td>${featureData.rating || '-'}/5</td>
                            <td>${featureData.suggestions || '-'}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
        
        <p><strong>Notes:</strong> ${test.notes || 'No additional notes'}</p>
        <hr>
    `).join('')}
</body>
</html>
    `;
}

function generatePainPointsReport() {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Pain Points & Ideas Report - ${formatDate(new Date())}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        h1 { color: #e94435; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #f5f5f5; }
        .category { font-weight: bold; margin-top: 20px; }
    </style>
    </head>
<body>
    <h1>Pain Points and Improvement Ideas</h1>
    <p>Generated: ${formatDateTime(new Date())}</p>
    
    <h2>What was confusing or difficult?</h2>
    <table>
        <thead><tr><th>Description</th><th>Source</th><th>Timestamp</th></tr></thead>
        <tbody>
            ${feedbackData.painPoints.filter(p=>p.type==='difficulties').map(p=>`
                <tr><td>${p.description||''}</td><td>${p.source||''}</td><td>${p.timestamp?formatDate(new Date(p.timestamp)):'-'}</td></tr>
            `).join('') || '<tr><td colspan="3">No entries</td></tr>'}
        </tbody>
    </table>

    <h2>What would make it easier?</h2>
    <table>
        <thead><tr><th>Suggestion</th><th>Source</th><th>Timestamp</th></tr></thead>
        <tbody>
            ${feedbackData.painPoints.filter(p=>p.type==='improvements').map(p=>`
                <tr><td>${p.description||''}</td><td>${p.source||''}</td><td>${p.timestamp?formatDate(new Date(p.timestamp)):'-'}</td></tr>
            `).join('') || '<tr><td colspan="3">No entries</td></tr>'}
        </tbody>
    </table>

    <h2>Categorized Pain Points</h2>
    ${painPointCategories.map(cat=>`
        <div class="category">${cat.name}</div>
        <table>
            <thead><tr><th>Description</th><th>Source</th></tr></thead>
            <tbody>
                ${feedbackData.painPoints.filter(p=>p.category===cat.id).map(p=>`<tr><td>${p.description||''}</td><td>${p.source||''}</td></tr>`).join('') || '<tr><td colspan="2">None reported</td></tr>'}
            </tbody>
        </table>
    `).join('')}
</body>
</html>
    `;
}

function generateWorkshopFeedbackReport() {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Workshop Feedback Report - ${formatDate(new Date())}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #f5f5f5; }
        h1 { color: #e94435; }
    </style>
    </head>
<body>
    <h1>Participant Workshop Feedback</h1>
    <p>Generated: ${formatDateTime(new Date())}</p>

    ${feedbackData.workshopFeedback.map((f,i)=>`
        <h2>Form ${i+1} - ${f.participantGroup||'Unknown group'}</h2>
        <table>
            <tbody>
                <tr><th>Workshop Title</th><td>${f.workshopTitle||'-'}</td></tr>
                <tr><th>Date</th><td>${f.date||'-'}</td></tr>
                <tr><th>Understanding</th><td>${f.understanding||'-'}</td></tr>
                <tr><th>Helpful Elements</th><td>${(f.helpfulElements||[]).join(', ')||'-'}</td></tr>
                <tr><th>App Helpfulness</th><td>${f.helpfulness||'-'}</td></tr>
                <tr><th>Liked Feature</th><td>${f.likedFeature||'-'}</td></tr>
                <tr><th>Concerns</th><td>${f.concerns||'-'}</td></tr>
                <tr><th>Tracking Preferences</th><td>${(f.trackingPreferences||[]).join(', ')||'-'}</td></tr>
                <tr><th>Entry Frequency</th><td>${f.frequency||'-'}</td></tr>
                <tr><th>Improvements</th><td>${f.improvements||'-'}</td></tr>
                <tr><th>Other Feedback</th><td>${f.otherFeedback||'-'}</td></tr>
            </tbody>
        </table>
        <hr>
    `).join('') || '<p>No feedback forms recorded.</p>'}
</body>
</html>
    `;
}

// Convenience wrapper used by UI button
function addPainPoint() {
    addPainPointEntry('difficulties');
}

// Utility functions
function generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9);
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function formatDateTime(date) {
    return new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

function downloadHTML(content, filename) {
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Make functions globally available
window.addUsabilityTest = addUsabilityTest;
window.updateUsabilityTest = updateUsabilityTest;
window.updateFeatureRating = updateFeatureRating;
window.removeUsabilityTest = removeUsabilityTest;
window.saveUsabilityTests = saveUsabilityTests;
window.exportUsabilityReport = exportUsabilityReport;
window.addPainPointEntry = addPainPointEntry;
window.addCategorizedPainPoint = addCategorizedPainPoint;
window.updatePainPoint = updatePainPoint;
window.removePainPoint = removePainPoint;
window.savePainPoints = savePainPoints;
window.exportPainPointsReport = exportPainPointsReport;
window.addWorkshopFeedback = addWorkshopFeedback;
window.updateWorkshopFeedback = updateWorkshopFeedback;
window.updateWorkshopFeedbackArray = updateWorkshopFeedbackArray;
window.removeWorkshopFeedback = removeWorkshopFeedback;
window.saveWorkshopFeedback = saveWorkshopFeedback;
window.exportWorkshopFeedbackReport = exportWorkshopFeedbackReport;