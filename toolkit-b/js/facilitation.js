// Workshop Facilitation Guide Module
// Interactive guide for conducting co-design sessions

const sessionFlowData = {
    objectives: [
        "Build participant understanding of personalised N-of-1 Trials",
    "Introduce the platform and its use in managing hypertension",
        "Facilitate collaborative design of culturally relevant treatment sequences",
        "Gather participant feedback on digital and trial components"
    ],
    sessions: [
        {
            id: "welcome",
            title: "Welcome & Introduction",
            duration: 20,
            lead: "Workshop Facilitator",
            activities: [
                "Welcome everyone warmly",
                "Share purpose of the co-design session and its role in the broader study",
                "Explain that all voices are valued, and participation is voluntary",
                "Briefly review the agenda and group norms",
                "Complete consent and introductions"
            ],
            keyPoints: "This is a space for sharing your real experiences and ideas to help create personalised care that respects your way of managing health.",
            materials: ["Consent forms", "Name tags", "Agenda handouts", "Attendance register"],
            completed: false
        },
        {
            id: "nof1_intro",
            title: "Introducing the N-of-1 Trial",
            duration: 20,
            lead: "Research Lead with Supervisor",
            activities: [
                "Use visual aids (poster or slide) to explain what a personalised trial is",
                "Show how treatments are compared over time in one person",
                "Explain what data (like BP or symptoms) is recorded"
            ],
            keyPoints: "It's like testing different shoes on the same person to find the best fit. But here, we're testing treatments to see what works best for you.",
            materials: ["Visual aids", "Posters", "Slides", "BP monitors for demonstration"],
            completed: false
        },
        {
            id: "studyu_demo",
            title: "Demonstrating the App Platform",
            duration: 15,
            lead: "Tech Facilitator from HPI",
            activities: [
            "Show sample screens from the app",
                "Explain how data is entered and how clinicians monitor",
                "Show how it could adapt over time based on responses or Clinicians input",
                "Invite participants to ask questions or share their first impressions"
            ],
            keyPoints: "The app is designed to be simple and help you track what works best for your health.",
            materials: ["Tablets/phones with app demo", "Projector", "Demo accounts"],
            completed: false
        },
        {
            id: "codesign",
            title: "Co-Design Activities",
            duration: 85,
            lead: "Group Facilitators",
            activities: [
                "Activity 1 – Goal Setting: What are your main goals for managing blood pressure?",
                "Activity 2 – Treatment Comparison Design: How can we test herbal and hospital medicines safely?", 
                "Activity 3 – Feedback on Digital Interface: Is this app easy to use? What could we improve?"
            ],
            keyPoints: "All ideas are valuable. We want to understand what matters most to you.",
            materials: ["Sticky notes", "Treatment preference sheets", "Trial sequence cards", "Markers", "Flipcharts"],
            completed: false
        },
        {
            id: "feedback_close",
            title: "Feedback & Close",
            duration: 30,
            lead: "Lead Facilitator",
            activities: [
                "Each group shares 2–3 ideas or preferences they agreed on",
                "Invite individual reflections (e.g., 'One thing you liked or would improve')",
                "Thank participants, feedback forms or tokens of appreciation",
                "Explain what happens next"
            ],
            keyPoints: "Your input will directly shape how we design the final system for Ghana.",
            materials: ["Feedback forms", "Tokens of appreciation", "Contact information sheets"],
            completed: false
        }
    ]
};

const scriptOutlines = {
    welcome: {
        opening: "Good morning/afternoon everyone! Welcome to our co-design workshop. I'm [Name] and I'll be facilitating our session today.",
        purpose: "We're here to work together to design a digital health system that respects and includes traditional healing alongside modern medicine.",
        participation: "Every voice in this room matters. Whether you're a patient, clinician, herbalist, or caregiver, your experience and ideas are essential.",
        consent: "Before we begin, let's make sure everyone is comfortable participating and has signed the consent form.",
        closing: "Let's start by having everyone introduce themselves - just your name and one hope you have for managing hypertension in Ghana."
    },
    nof1_intro: {
        concept: "A personalised trial, or N-of-1 trial, is like a personal experiment to find what treatment works best for YOU specifically.",
        analogy: "Think of it like trying different farming methods on the same plot of land to see which gives the best harvest.",
        data: "We would track things that matter to you - your blood pressure, how you feel, any side effects, and your daily activities.",
        timeline: "This happens over several weeks, alternating between different treatments so we can compare them fairly.",
        questions: "What questions do you have about this approach? What concerns you?"
    },
    studyu_demo: {
         introduction: "Now let me show you the app that would help track your personal trial.",
        navigation: "Here's the home screen where you can see your progress and enter daily information.",
        data_entry: "Each day, you would record your blood pressure reading and answer simple questions about how you feel.",
        tracking: "The app creates graphs to show patterns and helps you and your healthcare provider see what's working.",
        feedback_request: "Try clicking around. What do you think? What would make this easier for you to use?"
    },
    activities: {
        goal_setting: "Let's start by thinking about what you really want to achieve. Beyond lowering blood pressure, what would make the biggest difference in your life?",
        treatment_design: "Now, let's design how to fairly compare different treatments. How can we make sure both herbal and hospital medicines get a fair test?",
        interface_feedback: "Finally, let's improve this app together. What would make it work better for people in your community?"
    },
    closing: {
        summary: "Thank you for sharing your insights today. You've given us valuable guidance on designing a system that truly works for Ghanaian communities.",
         next_steps: "We'll use everything you've shared to improve the platform and develop trial protocols that respect both traditional and modern healing.",
        contact: "If you have more ideas after today or questions about the study, please contact us using the information on this sheet.",
        appreciation: "Please accept this small token of our appreciation for your time and wisdom today."
    }
};

const facilitatorReminders = [
    {
        type: "tip",
        title: "Inclusive Participation",
        content: "Actively encourage quieter voices to speak. Use phrases like 'What do others think?' or 'Has anyone had a different experience?'"
    },
    {
        type: "reminder",
        title: "Cultural Sensitivity",
        content: "Be respectful when discussing traditional healing. Avoid terms that suggest modern medicine is 'better' - use 'different approaches' instead."
    },
    {
        type: "tip",
        title: "Language Support",
        content: "If participants seem confused, ask if they'd prefer to discuss in Twi, Ewe, or their local language. Have translators ready."
    },
    {
        type: "reminder",
        title: "Stay Neutral",
        content: "Don't advocate for any particular treatment. Your role is to facilitate discussion, not guide toward specific conclusions."
    },
    {
        type: "warning",
        title: "Time Management",
        content: "Keep sessions moving but don't rush important discussions. If running over, ask the group which activities are most important."
    },
    {
        type: "tip",
        title: "Documentation",
        content: "Take detailed notes on what works and what confuses participants. These insights are crucial for platform development."
    },
    {
        type: "reminder",
        title: "Technology Comfort",
        content: "Some participants may never have used a smartphone app. Be patient and provide hands-on assistance without taking over."
    },
    {
        type: "warning",
        title: "Safety Protocols",
        content: "If anyone feels unwell or uncomfortable, prioritize their wellbeing over workshop activities. Have emergency contacts ready."
    }
];

let currentSession = null;
let sessionTimer = null;

function initializeFacilitation() {
    renderSessionFlow();
    renderScriptOutlines();
    renderFacilitatorReminders();
    renderLiveSession();
}

function renderSessionFlow() {
    const container = document.getElementById('sessionFlow');
    if (!container) return;

    const completedSessions = sessionFlowData.sessions.filter(s => s.completed).length;
    const totalDuration = sessionFlowData.sessions.reduce((total, session) => total + session.duration, 0);

    container.innerHTML = `
        <div class="row mb-4">
            <div class="col-12">
                <div class="glass-card p-4">
                    <h5 class="text-white mb-3">
                        <i class="bi bi-bullseye text-primary"></i> Workshop Objectives
                    </h5>
                    <ul class="text-white-50">
                        ${sessionFlowData.objectives.map(obj => `<li>${obj}</li>`).join('')}
                    </ul>
                    <div class="mt-3">
                        <span class="badge bg-info">Total Duration: ${totalDuration} minutes</span>
                        <span class="badge bg-success ms-2">Completed: ${completedSessions}/${sessionFlowData.sessions.length}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <h5 class="text-white mb-3">Session Flow</h5>
                ${sessionFlowData.sessions.map((session, index) => renderSessionCard(session, index)).join('')}
            </div>
        </div>
    `;
}

function renderSessionCard(session, index) {
    const isCompleted = session.completed;
    const statusClass = isCompleted ? 'status-completed' : 'status-planned';
    const statusText = isCompleted ? 'Completed' : 'Planned';

    return `
        <div class="activity-form">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="text-white mb-0">
                    <i class="bi bi-${index + 1}-circle text-primary"></i>
                    ${session.title}
                </h6>
                <div class="d-flex gap-2 align-items-center">
                    <span class="badge ${statusClass}">${statusText}</span>
                    <span class="badge bg-info">${session.duration} min</span>
                    <button class="btn btn-sm btn-gradient btn-primary" onclick="toggleSessionDetails('${session.id}')">
                        <i class="bi bi-eye"></i>
                    </button>
                </div>
            </div>
            
            <div class="mb-2">
                <strong class="text-white">Lead:</strong>
                <span class="text-white-50">${session.lead}</span>
            </div>

            <div id="details-${session.id}" style="display: none;">
                <div class="mb-3">
                    <strong class="text-white">Activities:</strong>
                    <ul class="text-white-50 mt-2">
                        ${session.activities.map(activity => `<li>${activity}</li>`).join('')}
                    </ul>
                </div>

                <div class="mb-3">
                    <strong class="text-white">Key Talking Points:</strong>
                    <div class="tip-card mt-2">
                        <i class="bi bi-lightbulb text-warning"></i>
                        "${session.keyPoints}"
                    </div>
                </div>

                <div class="mb-3">
                    <strong class="text-white">Required Materials:</strong>
                    <div class="d-flex flex-wrap gap-2 mt-2">
                        ${session.materials.map(material => 
                            `<span class="badge bg-secondary">${material}</span>`
                        ).join('')}
                    </div>
                </div>

                <div class="d-flex gap-2">
                    <button class="btn btn-gradient btn-success btn-sm" onclick="markSessionComplete('${session.id}')">
                        <i class="bi bi-check2"></i> Mark Complete
                    </button>
                    <button class="btn btn-gradient btn-info btn-sm" onclick="startSessionTimer('${session.id}', ${session.duration})">
                        <i class="bi bi-stopwatch"></i> Start Timer
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderScriptOutlines() {
    const container = document.getElementById('scriptOutlines');
    if (!container) return;

    container.innerHTML = `
        <div class="alert alert-info border-0 glass-card mb-4">
            <i class="bi bi-info-circle me-2"></i>
            Use these script outlines as guides for key talking points during each session. Adapt language to match your audience and context.
        </div>

        ${Object.keys(scriptOutlines).map(sessionKey => {
            const script = scriptOutlines[sessionKey];
            return `
                <div class="activity-form">
                    <h6 class="text-white mb-3">
                        <i class="bi bi-chat-text text-primary"></i>
                        ${sessionKey.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Script
                    </h6>
                    ${Object.keys(script).map(pointKey => `
                        <div class="mb-3">
                            <strong class="text-white">${pointKey.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong>
                            <div class="text-white-50 mt-1">"${script[pointKey]}"</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }).join('')}
    `;
}

function renderFacilitatorReminders() {
    const container = document.getElementById('facilitatorReminders');
    if (!container) return;

    container.innerHTML = `
        <div class="row">
            <div class="col-12">
                <h5 class="text-white mb-3">
                    <i class="bi bi-exclamation-triangle text-warning"></i> Key Reminders
                </h5>
                ${facilitatorReminders.map(reminder => {
                    const cardClass = reminder.type === 'tip' ? 'tip-card' : 
                                     reminder.type === 'warning' ? 'warning-card' : 'reminder-card';
                    const icon = reminder.type === 'tip' ? 'lightbulb' : 
                                reminder.type === 'warning' ? 'exclamation-triangle' : 'info-circle';
                    
                    return `
                        <div class="${cardClass}">
                            <h6 class="text-white mb-2">
                                <i class="bi bi-${icon} me-2"></i>
                                ${reminder.title}
                            </h6>
                            <p class="text-white-50 mb-0">${reminder.content}</p>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function renderLiveSession() {
    const container = document.getElementById('liveSession');
    if (!container) return;

    container.innerHTML = `
        <div class="row">
            <div class="col-12 col-md-6">
                <div class="glass-card p-4">
                    <h6 class="text-white mb-3">
                        <i class="bi bi-play-circle text-success"></i> Session Control
                    </h6>
                    
                    <div class="mb-3">
                        <label class="form-label">Current Session</label>
                        <select class="form-select" id="currentSessionSelect">
                            <option value="">Select session...</option>
                            ${sessionFlowData.sessions.map(session => 
                                `<option value="${session.id}">${session.title} (${session.duration} min)</option>`
                            ).join('')}
                        </select>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Workshop Date & Time</label>
                        <input type="datetime-local" class="form-control" id="workshopDateTime">
                    </div>

                    <div class="d-grid gap-2">
                        <button class="btn btn-gradient btn-success" id="startSessionBtn" onclick="startCurrentSession()">
                            <i class="bi bi-play"></i> Start Session
                        </button>
                        <button class="btn btn-gradient btn-warning" id="pauseSessionBtn" onclick="pauseCurrentSession()" disabled>
                            <i class="bi bi-pause"></i> Pause Session
                        </button>
                        <button class="btn btn-gradient btn-danger" id="endSessionBtn" onclick="endCurrentSession()" disabled>
                            <i class="bi bi-stop"></i> End Session
                        </button>
                    </div>
                </div>
            </div>

            <div class="col-12 col-md-6">
                <div class="glass-card p-4">
                    <h6 class="text-white mb-3">
                        <i class="bi bi-stopwatch text-primary"></i> Session Timer
                    </h6>
                    
                    <div class="text-center mb-4">
                        <div class="metric-number" id="sessionTimer">00:00</div>
                        <div class="metric-label" id="sessionStatus">Ready</div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Session Notes</label>
                        <textarea class="form-control" id="sessionNotes" rows="6" 
                                  placeholder="Record key insights, challenges, and observations..."></textarea>
                    </div>

                    <button class="btn btn-gradient btn-info w-100" onclick="saveSessionNotes()">
                        <i class="bi bi-save"></i> Save Notes
                    </button>
                </div>
            </div>
        </div>
    `;
}

function toggleSessionDetails(sessionId) {
    const details = document.getElementById(`details-${sessionId}`);
    if (details.style.display === 'none') {
        details.style.display = 'block';
    } else {
        details.style.display = 'none';
    }
}

function markSessionComplete(sessionId) {
    const session = sessionFlowData.sessions.find(s => s.id === sessionId);
    if (session) {
        session.completed = true;
        renderSessionFlow();
        saveFacilitationData();
        
        if (window.toolkitB) {
            window.toolkitB.showNotification(`${session.title} marked as complete!`, 'success');
            window.toolkitB.updateDashboard();
        }
    }
}

function startSessionTimer(sessionId, duration) {
    const session = sessionFlowData.sessions.find(s => s.id === sessionId);
    if (!session) return;

    // Set the current session
    document.getElementById('currentSessionSelect').value = sessionId;
    
    // Start timer
    startCurrentSession();
    
    if (window.toolkitB) {
        window.toolkitB.showNotification(`Timer started for ${session.title}`, 'info');
    }
}

function startCurrentSession() {
    const sessionSelect = document.getElementById('currentSessionSelect');
    const sessionId = sessionSelect.value;
    
    if (!sessionId) {
        if (window.toolkitB) {
            window.toolkitB.showNotification('Please select a session first', 'warning');
        }
        return;
    }

    const session = sessionFlowData.sessions.find(s => s.id === sessionId);
    if (!session) return;

    currentSession = {
        id: sessionId,
        title: session.title,
        duration: session.duration,
        startTime: new Date(),
        elapsed: 0
    };

    // Update UI
    document.getElementById('startSessionBtn').disabled = true;
    document.getElementById('pauseSessionBtn').disabled = false;
    document.getElementById('endSessionBtn').disabled = false;
    document.getElementById('sessionStatus').textContent = `Running: ${session.title}`;

    // Start timer
    sessionTimer = setInterval(updateSessionTimer, 1000);

    if (window.toolkitB) {
        window.toolkitB.showNotification(`Started: ${session.title}`, 'success');
    }
}

function pauseCurrentSession() {
    if (sessionTimer) {
        clearInterval(sessionTimer);
        sessionTimer = null;
        
        document.getElementById('startSessionBtn').disabled = false;
        document.getElementById('pauseSessionBtn').disabled = true;
        document.getElementById('sessionStatus').textContent = 'Paused';

        if (window.toolkitB && currentSession) {
            window.toolkitB.showNotification(`Paused: ${currentSession.title}`, 'info');
        }
    }
}

function endCurrentSession() {
    if (sessionTimer) {
        clearInterval(sessionTimer);
        sessionTimer = null;
    }

    // Reset UI
    document.getElementById('startSessionBtn').disabled = false;
    document.getElementById('pauseSessionBtn').disabled = true;
    document.getElementById('endSessionBtn').disabled = true;
    document.getElementById('sessionStatus').textContent = 'Ready';
    document.getElementById('sessionTimer').textContent = '00:00';

    if (window.toolkitB && currentSession) {
        window.toolkitB.showNotification(`Ended: ${currentSession.title}`, 'info');
    }

    currentSession = null;
}

function updateSessionTimer() {
    if (!currentSession) return;

    currentSession.elapsed = Math.floor((new Date() - currentSession.startTime) / 1000);
    const minutes = Math.floor(currentSession.elapsed / 60);
    const seconds = currentSession.elapsed % 60;
    
    document.getElementById('sessionTimer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Check if session duration exceeded
    const totalSeconds = currentSession.duration * 60;
    if (currentSession.elapsed >= totalSeconds) {
        document.getElementById('sessionStatus').textContent = 'Time Up!';
        document.getElementById('sessionTimer').style.color = '#f44336';
        
        // Optional: Auto-pause or alert
        if (currentSession.elapsed === totalSeconds) {
            if (window.toolkitB) {
                window.toolkitB.showNotification(`Time up for ${currentSession.title}!`, 'warning');
            }
        }
    } else {
        document.getElementById('sessionTimer').style.color = 'var(--text-color)';
    }
}

function saveSessionNotes() {
    const notes = document.getElementById('sessionNotes').value;
    if (!notes.trim()) return;

    const sessionData = {
        id: generateId(),
        sessionId: document.getElementById('currentSessionSelect').value,
        notes: notes,
        timestamp: new Date().toISOString(),
        facilitator: 'Current User' // Could be made dynamic
    };

    // Save to app state
    if (window.toolkitB && window.toolkitB.appState) {
        if (!window.toolkitB.appState.sessionNotes) {
            window.toolkitB.appState.sessionNotes = [];
        }
        window.toolkitB.appState.sessionNotes.push(sessionData);
        window.toolkitB.saveData();
    }

    // Clear notes
    document.getElementById('sessionNotes').value = '';

    if (window.toolkitB) {
        window.toolkitB.showNotification('Session notes saved successfully!', 'success');
    }
}

function saveFacilitationData() {
    const facilitationData = {
        sessions: sessionFlowData.sessions,
        lastUpdated: new Date().toISOString()
    };

    try {
        localStorage.setItem('toolkitB_facilitation', JSON.stringify(facilitationData));
    } catch (error) {
        console.error('Error saving facilitation data:', error);
    }
}

function generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9);
}

// Make functions globally available
window.toggleSessionDetails = toggleSessionDetails;
window.markSessionComplete = markSessionComplete;
window.startSessionTimer = startSessionTimer;
window.startCurrentSession = startCurrentSession;
window.pauseCurrentSession = pauseCurrentSession;
window.endCurrentSession = endCurrentSession;
window.saveSessionNotes = saveSessionNotes;