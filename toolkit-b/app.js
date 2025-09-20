// Toolkit B - Main Application JavaScript
// Co-Design and Platform Adaptation Toolkit

// Application state
let appState = {
    workshops: [],
    checklist: {},
    activities: [],
    feedback: [],
    customizations: [],
    participants: [],
    currentSession: null
};

// Initialize application
document.addEventListener('DOMContentLoaded', function () {
    initializeNavigation();
    loadStoredData();
    updateDashboard();
    setupThemeHandlers();
    initializeChecklist();
    registerServiceWorker();
    setupInstallPrompt();
    adjustForMobile();
});

// Navigation handler
function initializeNavigation() {
    const navLinks = document.querySelectorAll('#mainNav .nav-link');
    const sections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetSection = this.dataset.section;

            // Update nav active state
            navLinks.forEach(nl => nl.classList.remove('active'));
            this.classList.add('active');

            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });

            // Initialize section-specific content
            switch (targetSection) {
                case 'planning':
                    initializeChecklist();
                    break;
                case 'facilitation':
                    initializeFacilitation();
                    break;
                case 'activities':
                    initializeActivities();
                    break;
                case 'feedback':
                    initializeFeedback();
                    break;
                case 'customization':
                    initializeCustomization();
                    break;
            }
        });
    });
}

// Theme handling (inherited from toolkit-a)
function setupThemeHandlers() {
    // Theme switching
    const themeItems = document.querySelectorAll('[data-theme]');
    const modeItems = document.querySelectorAll('[data-mode]');

    themeItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const theme = this.dataset.theme;
            applyTheme(theme);
            localStorage.setItem('selectedTheme', theme);
        });
    });

    modeItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const mode = this.dataset.mode;
            applyMode(mode);
            localStorage.setItem('selectedMode', mode);
        });
    });

    // Load saved theme/mode
    const savedTheme = localStorage.getItem('selectedTheme') || 'warm';
    const savedMode = localStorage.getItem('selectedMode') || 'dark';
    applyTheme(savedTheme);
    applyMode(savedMode);
}

function applyTheme(theme) {
    const themes = {
        'warm': { start: '#f89b1b', end: '#d72c18' },
        'medium-sky': { start: '#87ceeb', end: '#4682b4' },
        'deep-blue': { start: '#1e3c72', end: '#2a5298' },
        'cyan': { start: '#00bcd4', end: '#0097a7' },
        'leaf-green': { start: '#8bc34a', end: '#4caf50' }
    };

    const selectedTheme = themes[theme];
    if (selectedTheme) {
        document.documentElement.style.setProperty('--bg-start', selectedTheme.start);
        document.documentElement.style.setProperty('--bg-end', selectedTheme.end);
        document.documentElement.style.setProperty('--accent-color', selectedTheme.start);
    }
}

function applyMode(mode) {
    document.body.setAttribute('data-mode', mode);
}

// Load stored data from localStorage
function loadStoredData() {
    const storedData = localStorage.getItem('toolkitB_data');
    if (storedData) {
        try {
            appState = { ...appState, ...JSON.parse(storedData) };
        } catch (error) {
            console.error('Error loading stored data:', error);
        }
    }

    // Load participants from toolkit-a if available
    const toolkitAData = localStorage.getItem('hypertensionResearchData');
    if (toolkitAData) {
        try {
            const participantData = JSON.parse(toolkitAData);
            if (participantData.participants) {
                // Import only eligible participants
                appState.participants = participantData.participants.filter(p => p.isEligible);
            }
        } catch (error) {
            console.error('Error loading toolkit-a participants:', error);
        }
    }
}

// Save data to localStorage
function saveData() {
    try {
        localStorage.setItem('toolkitB_data', JSON.stringify(appState));
        showNotification('Data saved successfully', 'success');
    } catch (error) {
        console.error('Error saving data:', error);
        showNotification('Error saving data', 'error');
    }
}

// Update dashboard metrics
function updateDashboard() {
    // Workshops count (from appState)
    document.getElementById('totalWorkshops').textContent = appState.workshops.length;

    // Activities counts from activities storage
    let activitiesCompleted = 0;
    try {
        const act = JSON.parse(localStorage.getItem('toolkitB_activities') || '{}');
        if (act && Array.isArray(act.trialSetups)) {
            // consider a trial setup with required fields as completed
            activitiesCompleted = act.trialSetups.filter(t => t.participantId && t.treatmentA && t.treatmentB).length;
        }
    } catch {}
    document.getElementById('completedActivities').textContent = activitiesCompleted;

    // Feedback count from feedback storage
    let feedbackCount = 0;
    try {
        const fb = JSON.parse(localStorage.getItem('toolkitB_feedback') || '{}');
        feedbackCount = (fb.workshopFeedback?.length || 0) + (fb.usabilityTests?.length || 0);
    } catch {}
    document.getElementById('feedbackCollected').textContent = feedbackCount;

    // Customizations count
    let customCount = 0;
    try {
        const cz = JSON.parse(localStorage.getItem('toolkitB_customization') || '{}');
        customCount = (cz.features?.length || 0) + (cz.designDecisions?.length || 0);
    } catch {}
    document.getElementById('customizations').textContent = customCount;

    // Calculate planning progress
    // Planning progress from checklist module
    let progress = 0;
    try {
        const storedChecklist = JSON.parse(localStorage.getItem('toolkitB_checklist') || '{}');
        let total = 0; let done = 0;
        Object.keys(storedChecklist).forEach(section => {
            const tasks = storedChecklist[section]?.tasks || [];
            total += tasks.length;
            done += tasks.filter(t => t.completed).length;
        });
        progress = total > 0 ? Math.round((done / total) * 100) : 0;
    } catch {}
    document.getElementById('planningProgress').textContent = `${progress}%`;

    // Sessions count
    document.getElementById('sessionsCount').textContent = 
        appState.workshops.filter(w => w.status === 'completed').length;
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed`;
    notification.style.cssText = `
        top: 20px; right: 20px; z-index: 9999; 
        min-width: 300px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        border-radius: 15px; border: none;
    `;
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Export functions
function exportWorkshopData() {
    const data = {
        workshops: appState.workshops,
        activities: appState.activities,
        participants: appState.participants,
        timestamp: new Date().toISOString()
    };
    
    downloadJSON(data, `workshop_data_${formatDate(new Date())}.json`);
}

function generateReport() {
    // Generate comprehensive HTML report
    const reportContent = generateReportHTML();
    downloadHTML(reportContent, `workshop_report_${formatDate(new Date())}.html`);
}

function exportCustomizations() {
    const data = {
        customizations: appState.customizations,
        feedback: appState.feedback,
        timestamp: new Date().toISOString()
    };
    
    downloadJSON(data, `platform_customizations_${formatDate(new Date())}.json`);
}

function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

// Utility functions
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9);
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

// Mobile responsive adjustments
function adjustForMobile() {
    // Add mobile-specific event handlers
    if (window.innerWidth <= 768) {
        // Adjust for mobile navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.style.fontSize = '0.8rem';
            link.style.padding = '8px 12px';
        });
    }
}

// PWA functionality
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        // Unregister legacy per-toolkit SWs then register root SW
        navigator.serviceWorker.getRegistrations?.().then(regs => {
            regs.forEach(reg => {
                const url = reg.active?.scriptURL || reg.installing?.scriptURL || reg.waiting?.scriptURL || '';
                if (url.endsWith('/toolkit-b/sw.js') || url.endsWith('/toolkit-a/sw.js')) {
                    reg.unregister().catch(() => {});
                }
            });
        }).catch(() => {});

        navigator.serviceWorker.register('../sw.js')
            .then(registration => console.log('Root SW registered:', registration.scope))
            .catch(error => console.log('Root SW registration failed:', error));
    }
}

function setupInstallPrompt() {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show install button
        const installBtn = document.createElement('button');
        installBtn.className = 'btn btn-gradient btn-success position-fixed';
        installBtn.style.cssText = 'bottom: 20px; right: 20px; z-index: 1000;';
        installBtn.innerHTML = '<i class="bi bi-download"></i> Install App';
        installBtn.onclick = () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    deferredPrompt = null;
                    installBtn.remove();
                });
            }
        };
        
        document.body.appendChild(installBtn);
    });
}

// Generate comprehensive report HTML
function generateReportHTML() {
    const date = new Date();
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Workshop Report - ${formatDate(date)}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 40px; }
        .section { margin-bottom: 30px; }
        .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
        .metric-box { border: 1px solid #ddd; padding: 20px; text-align: center; border-radius: 8px; }
        .metric-number { font-size: 2em; font-weight: bold; color: #e94435; }
        .metric-label { color: #666; font-size: 0.9em; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f5f5f5; font-weight: bold; }
        .status-completed { color: #4caf50; font-weight: bold; }
        .status-in-progress { color: #ff9800; font-weight: bold; }
        .status-planned { color: #2196f3; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Co-Design Workshop Report</h1>
        <p>Digital N-of-1 Trial Platform Adaptation for Ghana</p>
        <p>Generated: ${formatDateTime(date)}</p>
    </div>
    
    <div class="section">
        <h2>Summary Metrics</h2>
        <div class="metrics">
            <div class="metric-box">
                <div class="metric-number">${appState.workshops.length}</div>
                <div class="metric-label">Workshops Planned</div>
            </div>
            <div class="metric-box">
                <div class="metric-number">${appState.activities.filter(a => a.status === 'completed').length}</div>
                <div class="metric-label">Activities Completed</div>
            </div>
            <div class="metric-box">
                <div class="metric-number">${appState.feedback.length}</div>
                <div class="metric-label">Feedback Forms</div>
            </div>
            <div class="metric-box">
                <div class="metric-number">${appState.customizations.length}</div>
                <div class="metric-label">Platform Changes</div>
            </div>
        </div>
    </div>
    
    <div class="section">
        <h2>Workshop Activities</h2>
        <table>
            <thead>
                <tr><th>Activity</th><th>Type</th><th>Status</th><th>Participants</th><th>Date</th></tr>
            </thead>
            <tbody>
                ${appState.activities.map(activity => `
                    <tr>
                        <td>${activity.title || 'N/A'}</td>
                        <td>${activity.type || 'N/A'}</td>
                        <td class="status-${activity.status}">${activity.status || 'planned'}</td>
                        <td>${activity.participantCount || 0}</td>
                        <td>${activity.date ? formatDate(new Date(activity.date)) : 'Not scheduled'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    
    <div class="section">
        <h2>Platform Customizations</h2>
        <table>
            <thead>
                <tr><th>Feature</th><th>Change Requested</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
                ${appState.customizations.map(custom => `
                    <tr>
                        <td>${custom.feature || 'N/A'}</td>
                        <td>${custom.change || 'N/A'}</td>
                        <td class="status-${custom.status}">${custom.status || 'pending'}</td>
                        <td>${custom.date ? formatDate(new Date(custom.date)) : 'N/A'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
</body>
</html>
    `;
}

// Export main functions for use in other modules
window.toolkitB = {
    appState,
    saveData,
    showNotification,
    updateDashboard,
    generateId,
    formatDate,
    formatDateTime
};