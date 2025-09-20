// Planning & Preparation Checklist Module
// Interactive checklist for workshop preparation

const checklistData = {
    participants: {
        title: "Participants",
        icon: "people",
        tasks: [
            {
                id: "identify_participants",
                task: "Identify and confirm participants from each group (patients, clinicians, herbalists)",
                details: "Contact recruited participants from toolkit-a, ensure representation from all stakeholder groups",
                responsible: "",
                deadline: "",
                completed: false
            },
            {
                id: "prepare_invitations",
                task: "Prepare tailored invitations with basic study info",
                    details: "Create invitations explaining co-design workshop purpose and platform introduction",
                responsible: "",
                deadline: "",
                completed: false
            },
            {
                id: "verify_transport",
                task: "Verify transport or support needs (esp. patients or elders)",
                details: "Confirm transportation arrangements and accessibility requirements for all participants",
                responsible: "",
                deadline: "",
                completed: false
            }
        ]
    },
    venue: {
        title: "Venue & Setup",
        icon: "building",
        tasks: [
            {
                id: "secure_venue",
                task: "Secure accessible venue with seating for group work and plenary sessions",
                details: "Book venue with adequate space for 15-20 participants, accessible for elderly/disabled",
                responsible: "",
                deadline: "",
                completed: false
            },
            {
                id: "ensure_utilities",
                task: "Ensure power, internet, fans/ventilation available",
                details: "Verify electrical outlets, stable internet connection, and climate control",
                responsible: "",
                deadline: "",
                completed: false
            },
            {
                id: "reserve_devices",
                task: "Reserve digital devices (e.g., tablets, laptops) if demo of platform is planned",
                    details: "Arrange 5-10 tablets/smartphones for app platform demonstration",
                responsible: "",
                deadline: "",
                completed: false
            }
        ]
    },
    materials: {
        title: "Materials",
        icon: "clipboard-data",
        tasks: [
            {
                id: "print_materials",
                task: "Print participant info sheets, consent forms, agendas",
                details: "Prepare 25 copies of each document in English and local language if needed",
                responsible: "",
                deadline: "",
                completed: false
            },
            {
                id: "prepare_templates",
                task: "Prepare codesign templates (e.g., treatment flowcards, rating sheets)",
                details: "Print activity templates, preference mapping sheets, and trial design templates",
                responsible: "",
                deadline: "",
                completed: false
            },
            {
                id: "gather_supplies",
                task: "Gather materials: markers, sticky notes, flipcharts, name tags, pens",
                details: "Assemble workshop supplies for hands-on activities and group work",
                responsible: "",
                deadline: "",
                completed: false
            },
            {
                id: "translate_materials",
                task: "Translate materials into Twi/Ewe (or other local languages) if needed",
                details: "Ensure key documents are available in participants' preferred languages",
                responsible: "",
                deadline: "",
                completed: false
            }
        ]
    },
    facilitation: {
        title: "Facilitation",
        icon: "person-workspace",
        tasks: [
            {
                id: "assign_roles",
                task: "Assign facilitators, notetakers, and tech support roles",
                details: "Designate lead facilitator, group facilitators, notetakers, and tech support staff",
                responsible: "",
                deadline: "",
                completed: false
            },
            {
                id: "brief_team",
                task: "Brief all team members on session flow and safety protocols",
                details: "Conduct team briefing on objectives, procedures, and emergency protocols",
                responsible: "",
                deadline: "",
                completed: false
            }
        ]
    },
    ethics: {
        title: "Ethics & Documentation",
        icon: "shield-check",
        tasks: [
            {
                id: "verify_consent",
                task: "Verify all participants will sign consent before starting",
                details: "Ensure informed consent process is clear and all forms are ready",
                responsible: "",
                deadline: "",
                completed: false
            },
            {
                id: "prepare_register",
                task: "Prepare printed attendance register",
                details: "Create attendance sheets with participant details and signature spaces",
                responsible: "",
                deadline: "",
                completed: false
            },
            {
                id: "test_recording",
                task: "Ensure devices for notetaking/audio (if approved) are functional",
                details: "Test recording equipment, backup devices, and data storage solutions",
                responsible: "",
                deadline: "",
                completed: false
            }
        ]
    }
};

function initializeChecklist() {
    loadChecklistFromStorage();
    renderChecklist();
}

function loadChecklistFromStorage() {
    const stored = localStorage.getItem('toolkitB_checklist');
    if (stored) {
        try {
            const storedData = JSON.parse(stored);
            // Merge with default data, preserving any new items
            Object.keys(checklistData).forEach(section => {
                if (storedData[section]) {
                    checklistData[section].tasks.forEach((task, index) => {
                        if (storedData[section].tasks[index]) {
                            Object.assign(task, storedData[section].tasks[index]);
                        }
                    });
                }
            });
        } catch (error) {
            console.error('Error loading checklist:', error);
        }
    }
}

function renderChecklist() {
    const container = document.getElementById('checklistContainer');
    if (!container) return;

    container.innerHTML = '';

    Object.keys(checklistData).forEach(sectionKey => {
        const section = checklistData[sectionKey];
        const completedTasks = section.tasks.filter(task => task.completed).length;
        const totalTasks = section.tasks.length;
        const progress = Math.round((completedTasks / totalTasks) * 100);

        const sectionElement = document.createElement('div');
        sectionElement.className = 'checklist-section';
        sectionElement.innerHTML = `
            <div class="checklist-header" onclick="toggleSection('${sectionKey}')">
                <i class="bi bi-${section.icon} text-primary me-2"></i>
                <h5>${section.title}</h5>
                <span class="checklist-progress">${completedTasks}/${totalTasks} (${progress}%)</span>
                <i class="bi bi-chevron-down ms-2 toggle-icon" id="toggle-${sectionKey}"></i>
            </div>
            <div class="checklist-items" id="items-${sectionKey}" style="display: block;">
                ${section.tasks.map((task, index) => renderChecklistItem(sectionKey, task, index)).join('')}
            </div>
        `;

        container.appendChild(sectionElement);
    });

    updateChecklistProgress();
}

function renderChecklistItem(sectionKey, task, index) {
    return `
        <div class="checklist-item ${task.completed ? 'completed' : ''}">
            <div class="checklist-checkbox">
                <input type="checkbox" class="form-check-input" 
                       ${task.completed ? 'checked' : ''} 
                       onchange="toggleTask('${sectionKey}', ${index})">
            </div>
            <div class="checklist-content">
                <div class="checklist-task">${task.task}</div>
                <div class="checklist-details">${task.details}</div>
                <div class="checklist-meta">
                    <div class="flex-grow-1">
                        <label class="form-label small mb-1">Responsible Person:</label>
                        <input type="text" class="form-control form-control-sm" 
                               value="${task.responsible}" 
                               onchange="updateTaskField('${sectionKey}', ${index}, 'responsible', this.value)"
                               placeholder="Assign to...">
                    </div>
                    <div class="flex-grow-1">
                        <label class="form-label small mb-1">Deadline:</label>
                        <input type="date" class="form-control form-control-sm" 
                               value="${task.deadline}" 
                               onchange="updateTaskField('${sectionKey}', ${index}, 'deadline', this.value)">
                    </div>
                </div>
            </div>
        </div>
    `;
}

function toggleSection(sectionKey) {
    const itemsContainer = document.getElementById(`items-${sectionKey}`);
    const toggleIcon = document.getElementById(`toggle-${sectionKey}`);
    
    if (itemsContainer.style.display === 'none') {
        itemsContainer.style.display = 'block';
        toggleIcon.className = 'bi bi-chevron-down ms-2 toggle-icon';
    } else {
        itemsContainer.style.display = 'none';
        toggleIcon.className = 'bi bi-chevron-right ms-2 toggle-icon';
    }
}

function toggleTask(sectionKey, taskIndex) {
    checklistData[sectionKey].tasks[taskIndex].completed = 
        !checklistData[sectionKey].tasks[taskIndex].completed;
    
    saveChecklistData();
    renderChecklist();
    
    if (window.toolkitB) {
        window.toolkitB.updateDashboard();
    }
}

function updateTaskField(sectionKey, taskIndex, field, value) {
    checklistData[sectionKey].tasks[taskIndex][field] = value;
    saveChecklistData();
}

function updateChecklistProgress() {
    let totalTasks = 0;
    let completedTasks = 0;

    Object.keys(checklistData).forEach(section => {
        totalTasks += checklistData[section].tasks.length;
        completedTasks += checklistData[section].tasks.filter(task => task.completed).length;
    });

    // Update app state
    if (window.toolkitB && window.toolkitB.appState) {
        window.toolkitB.appState.checklist = {
            total: totalTasks,
            completed: completedTasks,
            percentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
        };
    }
}

function saveChecklistData() {
    try {
        localStorage.setItem('toolkitB_checklist', JSON.stringify(checklistData));
        updateChecklistProgress();
    } catch (error) {
        console.error('Error saving checklist:', error);
    }
}

function saveChecklist() {
    saveChecklistData();
    if (window.toolkitB) {
        window.toolkitB.showNotification('Checklist saved successfully!', 'success');
    }
}

function exportChecklist() {
    const checklistReport = generateChecklistReport();
    const blob = new Blob([checklistReport], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workshop_checklist_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    if (window.toolkitB) {
        window.toolkitB.showNotification('Checklist exported successfully!', 'success');
    }
}

function generateChecklistReport() {
    let totalTasks = 0;
    let completedTasks = 0;
    
    Object.keys(checklistData).forEach(section => {
        totalTasks += checklistData[section].tasks.length;
        completedTasks += checklistData[section].tasks.filter(task => task.completed).length;
    });

    const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Workshop Planning Checklist - ${new Date().toLocaleDateString()}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 40px; }
        .progress-summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .section { margin-bottom: 30px; border: 1px solid #ddd; border-radius: 8px; }
        .section-header { background: #e94435; color: white; padding: 15px; border-radius: 8px 8px 0 0; }
        .task { padding: 15px; border-bottom: 1px solid #eee; }
        .task:last-child { border-bottom: none; }
        .task.completed { background: #f1f8e9; }
        .task-title { font-weight: bold; margin-bottom: 5px; }
        .task-details { color: #666; font-size: 0.9em; margin-bottom: 10px; }
        .task-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 0.85em; }
        .completed-badge { background: #4caf50; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.8em; }
        .pending-badge { background: #ff9800; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.8em; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Co-Design Workshop Planning Checklist</h1>
        <p>Digital N-of-1 Trial Platform Adaptation</p>
        <p>Generated: ${new Date().toLocaleString()}</p>
    </div>
    
    <div class="progress-summary">
        <h2>Overall Progress: ${overallProgress}%</h2>
        <p><strong>${completedTasks}</strong> of <strong>${totalTasks}</strong> tasks completed</p>
    </div>
    
    ${Object.keys(checklistData).map(sectionKey => {
        const section = checklistData[sectionKey];
        const sectionCompleted = section.tasks.filter(task => task.completed).length;
        const sectionTotal = section.tasks.length;
        const sectionProgress = Math.round((sectionCompleted / sectionTotal) * 100);
        
        return `
        <div class="section">
            <div class="section-header">
                <h3>${section.title} (${sectionCompleted}/${sectionTotal} - ${sectionProgress}%)</h3>
            </div>
            ${section.tasks.map(task => `
                <div class="task ${task.completed ? 'completed' : ''}">
                    <div class="task-title">
                        ${task.task}
                        ${task.completed ? '<span class="completed-badge">✓ Completed</span>' : '<span class="pending-badge">⏳ Pending</span>'}
                    </div>
                    <div class="task-details">${task.details}</div>
                    <div class="task-meta">
                        <div><strong>Responsible:</strong> ${task.responsible || 'Not assigned'}</div>
                        <div><strong>Deadline:</strong> ${task.deadline || 'Not set'}</div>
                    </div>
                </div>
            `).join('')}
        </div>
        `;
    }).join('')}
</body>
</html>
    `;
}

// Make functions available globally
window.toggleSection = toggleSection;
window.toggleTask = toggleTask;
window.updateTaskField = updateTaskField;
window.saveChecklist = saveChecklist;
window.exportChecklist = exportChecklist;