// ===== PREMIUM TEMPLATE DATA =====
const premiumTemplates = {
    'ocean-blue': {
        name: 'Ocean Blue',
        gradient: 'ocean-gradient',
        startColor: '#1a2980',
        endColor: '#26d0ce'
    },
    'sunset-orange': {
        name: 'Sunset Orange',
        gradient: 'sunset-gradient',
        startColor: '#ff7e5f',
        endColor: '#feb47b'
    },
    'forest-green': {
        name: 'Forest Green',
        gradient: 'forest-gradient',
        startColor: '#11998e',
        endColor: '#38ef7d'
    },
    'royal-purple': {
        name: 'Royal-purple',
        gradient: 'royal-gradient',
        startColor: '#8a2387',
        endColor: '#f27121'
    },
    'steel-gray': {
        name: 'Steel Gray',
        gradient: 'steel-gradient',
        startColor: '#2c3e50',
        endColor: '#4ca1af'
    }
};

// ===== GLOBAL VARIABLES =====
let selectedTemplate = 'ocean-blue';
let currentZoom = 0.8;
let resumeScore = 85;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    initTemplateSelection();
    initZoomControls();
    initSkillsManagement();
    initExperienceManagement();
    initDownloadFunctionality();
    initInputListeners();
    updateCVPreview();
    updateCurrentTemplateName();
    updateZoom();
    
    setTimeout(() => {
        showNotification('Welcome to Gradient CV Builder! Start creating your professional resume.', 'info');
    }, 1000);
});

// ===== TEMPLATE SELECTION =====
function initTemplateSelection() {
    const templateCards = document.querySelectorAll('.template-card');
    templateCards.forEach(card => {
        card.addEventListener('click', function() {
            templateCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            selectedTemplate = this.getAttribute('data-template');
            updateCVPreview();
            updateCurrentTemplateName();
            showNotification(`${premiumTemplates[selectedTemplate].name} template selected`, 'success');
        });
    });
    document.querySelector('.template-card[data-template="ocean-blue"]').classList.add('selected');
}

function updateCurrentTemplateName() {
    document.getElementById('currentTemplateName').textContent = premiumTemplates[selectedTemplate].name;
}

// ===== ZOOM CONTROLS =====
function initZoomControls() {
    document.getElementById('zoomIn').addEventListener('click', zoomIn);
    document.getElementById('zoomOut').addEventListener('click', zoomOut);
    document.getElementById('zoomReset').addEventListener('click', zoomReset);
}

function zoomIn() {
    if (currentZoom < 1.2) {
        currentZoom += 0.1;
        updateZoom();
        showNotification(`Zoom: ${Math.round(currentZoom * 100)}%`, 'info');
    }
}

function zoomOut() {
    if (currentZoom > 0.5) {
        currentZoom -= 0.1;
        updateZoom();
        showNotification(`Zoom: ${Math.round(currentZoom * 100)}%`, 'info');
    }
}

function zoomReset() {
    currentZoom = 0.8;
    updateZoom();
    showNotification('Zoom reset to default', 'info');
}

function updateZoom() {
    const preview = document.getElementById('resumePreview');
    if (preview) {
        preview.style.transform = `scale(${currentZoom})`;
        preview.style.transformOrigin = 'top center';
    }
}

// ===== SKILLS MANAGEMENT =====
function initSkillsManagement() {
    const skillsInput = document.getElementById('skillsInput');
    skillsInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter' && this.value.trim()) {
            addSkillToDisplay(this.value.trim());
            this.value = '';
            updateCVPreview();
        }
    });
    
    document.querySelectorAll('.skill-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            this.remove();
            updateCVPreview();
            updateResumeScore(-2);
            showNotification('Skill removed', 'info');
        });
    });
}

function addSkillToDisplay(skill) {
    const existingSkills = Array.from(document.querySelectorAll('.skill-tag')).map(tag => tag.textContent);
    if (existingSkills.includes(skill)) {
        showNotification('Skill already added', 'warning');
        return;
    }
    
    let color = 'blue';
    const skillLower = skill.toLowerCase();
    if (skillLower.includes('leadership') || skillLower.includes('management') || skillLower.includes('communication') || skillLower.includes('team')) {
        color = 'orange';
    } else if (skillLower.includes('git') || skillLower.includes('docker') || skillLower.includes('aws') || skillLower.includes('azure') || skillLower.includes('jenkins')) {
        color = 'teal';
    } else if (skillLower.includes('creative') || skillLower.includes('design') || skillLower.includes('writing') || skillLower.includes('presentation')) {
        color = 'purple';
    }
    
    const skillElement = document.createElement('span');
    skillElement.className = `skill-tag ${color}`;
    skillElement.textContent = skill;
    skillElement.addEventListener('click', function() {
        this.remove();
        updateCVPreview();
        updateResumeScore(-2);
        showNotification('Skill removed', 'info');
    });
    
    document.getElementById('skillsContainer').appendChild(skillElement);
    updateResumeScore(2);
    showNotification(`Added skill: ${skill}`, 'success');
}

// ===== WORK EXPERIENCE MANAGEMENT =====
function initExperienceManagement() {
    document.getElementById('addExperience').addEventListener('click', addExperienceItem);
    document.querySelectorAll('.remove-experience').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.experience-item').remove();
            updateCVPreview();
            updateResumeScore(-5);
            showNotification('Experience position removed', 'info');
        });
    });
}

function addExperienceItem() {
    const experienceContainer = document.getElementById('experienceContainer');
    const experienceItem = document.createElement('div');
    experienceItem.className = 'experience-item';
    experienceItem.innerHTML = `
        <div class="experience-grid">
            <div class="form-group">
                <label>Job Title *</label>
                <input type="text" class="experience-job-title" placeholder="Job Title" value="">
            </div>
            <div class="form-group">
                <label>Company *</label>
                <input type="text" class="experience-company" placeholder="Company Name" value="">
            </div>
            <div class="form-group">
                <label>Start Date *</label>
                <input type="text" class="experience-start" placeholder="Month Year" value="">
            </div>
            <div class="form-group">
                <label>End Date</label>
                <input type="text" class="experience-end" placeholder="Present or Month Year" value="">
            </div>
        </div>
        <div class="form-group">
            <label>Location</label>
            <input type="text" class="experience-location" placeholder="City, State" value="">
        </div>
        <div class="form-group">
            <label>Responsibilities & Achievements *</label>
            <textarea class="experience-description" rows="3" placeholder="• Describe your responsibilities
• Highlight key achievements
• Use action verbs and quantify results"></textarea>
        </div>
        <div class="experience-actions">
            <button class="remove-experience">
                <i class="fas fa-trash"></i> Remove
            </button>
        </div>
    `;
    
    experienceContainer.appendChild(experienceItem);
    const removeBtn = experienceItem.querySelector('.remove-experience');
    removeBtn.addEventListener('click', function() {
        experienceItem.remove();
        updateCVPreview();
        updateResumeScore(-5);
        showNotification('Experience position removed', 'info');
    });
    
    experienceItem.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', updateCVPreview);
    });
    
    updateResumeScore(5);
    showNotification('New experience position added', 'success');
}

// ===== CV PREVIEW UPDATES =====
function updateCVPreview() {
    document.getElementById('previewName').textContent = document.getElementById('fullName').value || 'Johnathan Smith';
    document.getElementById('previewTitle').textContent = document.getElementById('jobTitle').value || 'Senior Software Developer';
    document.getElementById('previewEmail').textContent = document.getElementById('email').value || 'john.smith@example.com';
    document.getElementById('previewPhone').textContent = document.getElementById('phone').value || '+1 (123) 456-7890';
    document.getElementById('previewLocation').textContent = document.getElementById('location').value || 'San Francisco, CA';
    document.getElementById('previewLinkedin').textContent = document.getElementById('linkedin').value || 'linkedin.com/in/johnathansmith';
    document.getElementById('previewSummary').textContent = document.getElementById('summary').value || 'Results-driven Senior Software Developer with 5+ years of experience...';
    
    updateExperiencePreview();
    updateSkillsPreview();
    updateCVHeaderGradient();
    updateProgress();
}

function updateExperiencePreview() {
    const experienceItems = document.querySelectorAll('.experience-item');
    const previewExperience = document.getElementById('previewExperience');
    if (!previewExperience) return;
    
    previewExperience.innerHTML = '';
    experienceItems.forEach(item => {
        const jobTitle = item.querySelector('.experience-job-title').value || 'Job Title';
        const company = item.querySelector('.experience-company').value || 'Company';
        const startDate = item.querySelector('.experience-start').value || 'Start Date';
        const endDate = item.querySelector('.experience-end').value || 'Present';
        const location = item.querySelector('.experience-location').value || '';
        const description = item.querySelector('.experience-description').value || '';
        
        const experienceElement = document.createElement('div');
        experienceElement.className = 'experience-item-cv';
        experienceElement.innerHTML = `
            <div class="experience-header">
                <h4 class="experience-title">${escapeHtml(jobTitle)}</h4>
                <span class="experience-date">${escapeHtml(startDate)} - ${escapeHtml(endDate)}</span>
            </div>
            <div class="experience-subheader">
                <span class="experience-company">${escapeHtml(company)}</span>
                ${location ? `<span class="experience-location">${escapeHtml(location)}</span>` : ''}
            </div>
            <ul class="experience-description-cv">
                ${description.split('\n').filter(line => line.trim()).map(line => 
                    `<li>${escapeHtml(line.replace('•', '').trim())}</li>`
                ).join('')}
            </ul>
        `;
        previewExperience.appendChild(experienceElement);
    });
}

function updateSkillsPreview() {
    const skillTags = document.querySelectorAll('.skill-tag');
    const previewSkills = document.getElementById('previewSkills');
    if (!previewSkills) return;
    
    previewSkills.innerHTML = '';
    skillTags.forEach(tag => {
        const skillElement = document.createElement('span');
        skillElement.className = `skill-cv ${Array.from(tag.classList).find(cls => cls !== 'skill-tag') || 'blue'}`;
        skillElement.textContent = tag.textContent;
        previewSkills.appendChild(skillElement);
    });
}

function updateCVHeaderGradient() {
    const cvHeader = document.querySelector('.cv-header');
    if (cvHeader) {
        cvHeader.classList.remove('ocean-gradient', 'sunset-gradient', 'forest-gradient', 'royal-gradient', 'steel-gradient');
        cvHeader.classList.add(premiumTemplates[selectedTemplate].gradient);
    }
}

// ===== RESUME SCORE & PROGRESS =====
function updateResumeScore(points = 0) {
    resumeScore = Math.min(Math.max(resumeScore + points, 0), 100);
    document.getElementById('resumeScore').textContent = `${resumeScore}%`;
    document.getElementById('progressFill').style.width = `${resumeScore}%`;
}

function updateProgress() {
    let completion = 0;
    const personalFields = ['fullName', 'jobTitle', 'email', 'phone'];
    const personalFilled = personalFields.filter(id => document.getElementById(id).value.trim()).length;
    completion += (personalFilled / personalFields.length) * 40;
    
    const summaryText = document.getElementById('summary').value.trim();
    if (summaryText.length > 100) completion += 30;
    else if (summaryText.length > 50) completion += (summaryText.length / 100) * 30;
    
    const experienceItems = document.querySelectorAll('.experience-item');
    if (experienceItems.length > 0) {
        let experiencePoints = 0;
        experienceItems.forEach(item => {
            const jobTitle = item.querySelector('.experience-job-title').value.trim();
            const company = item.querySelector('.experience-company').value.trim();
            const description = item.querySelector('.experience-description').value.trim();
            if (jobTitle && company) experiencePoints += 5;
            if (description.length > 20) experiencePoints += 5;
        });
        completion += Math.min(experiencePoints, 20);
    }
    
    const skills = document.querySelectorAll('.skill-tag').length;
    if (skills >= 5) completion += 10;
    else if (skills > 0) completion += (skills / 5) * 10;
    
    resumeScore = Math.round(completion);
    document.getElementById('resumeScore').textContent = `${resumeScore}%`;
    document.getElementById('progressFill').style.width = `${resumeScore}%`;
}

// ===== FIXED PDF DOWNLOAD FUNCTIONALITY =====
function initDownloadFunctionality() {
    document.getElementById('downloadCurrentTemplate').addEventListener('click', async function(e) {
        e.preventDefault();
        await downloadCurrentTemplate();
    });
    
    document.getElementById('downloadAllTemplates').addEventListener('click', async function(e) {
        e.preventDefault();
        await downloadAllTemplates();
    });
    
    document.getElementById('printResume').addEventListener('click', function(e) {
        e.preventDefault();
        printResume();
    });
    
    document.getElementById('cancelResume').addEventListener('click', function(e) {
        e.preventDefault();
        cancelResume();
    });
    
    document.getElementById('floatingDownloadBtn').addEventListener('click', async function(e) {
        e.preventDefault();
        await downloadCurrentTemplate();
    });
}

async function downloadCurrentTemplate() {
    showNotification(`Generating PDF with ${premiumTemplates[selectedTemplate].name} design...`, 'info');
    const loadingOverlay = document.getElementById('pdfLoading');
    if (loadingOverlay) loadingOverlay.classList.add('active');
    
    try {
        // Method 1: Use print dialog (most reliable)
        await generatePDFWithPrint();
    } catch (error) {
        console.error('PDF generation error:', error);
        showNotification('Failed to generate PDF. Please try the Print option.', 'error');
    } finally {
        if (loadingOverlay) loadingOverlay.classList.remove('active');
    }
}

async function generatePDFWithPrint() {
    // Get current template
    const template = premiumTemplates[selectedTemplate];
    
    // Get all form data
    const name = document.getElementById('fullName').value || 'Johnathan Smith';
    const title = document.getElementById('jobTitle').value || 'Senior Software Developer';
    const email = document.getElementById('email').value || 'john.smith@example.com';
    const phone = document.getElementById('phone').value || '+1 (123) 456-7890';
    const location = document.getElementById('location').value || 'San Francisco, CA';
    const linkedin = document.getElementById('linkedin').value || 'linkedin.com/in/johnathansmith';
    const summary = document.getElementById('summary').value || 'Results-driven Senior Software Developer with 5+ years of experience...';
    
    // Get skills
    const skillTags = Array.from(document.querySelectorAll('.skill-tag')).map(tag => ({
        text: tag.textContent,
        color: Array.from(tag.classList).find(cls => cls !== 'skill-tag') || 'blue'
    }));
    
    // Get experience items
    const experienceItems = Array.from(document.querySelectorAll('.experience-item')).map(item => ({
        jobTitle: item.querySelector('.experience-job-title').value || 'Job Title',
        company: item.querySelector('.experience-company').value || 'Company',
        startDate: item.querySelector('.experience-start').value || 'Start Date',
        endDate: item.querySelector('.experience-end').value || 'Present',
        location: item.querySelector('.experience-location').value || '',
        description: item.querySelector('.experience-description').value || ''
    }));
    
    // Create HTML content with INLINE STYLES
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${name} - CV</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700;800&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <style>
                @page {
                    size: A4;
                    margin: 0;
                }
                
                body {
                    font-family: 'Inter', sans-serif;
                    margin: 0;
                    padding: 0;
                    background: white;
                    color: #333;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    width: 210mm;
                    min-height: 297mm;
                }
                
                .cv-template {
                    width: 210mm;
                    min-height: 297mm;
                    background: white;
                    margin: 0;
                    padding: 0;
                    box-shadow: none;
                }
                
                .cv-header {
                    background: linear-gradient(135deg, ${template.startColor} 0%, ${template.endColor} 100%);
                    color: white;
                    padding: 48px;
                    margin: 0;
                }
                
                .header-content {
                    max-width: 800px;
                    margin: 0 auto;
                }
                
                .cv-name {
                    font-size: 42px;
                    font-weight: 800;
                    margin-bottom: 8px;
                    font-family: 'Montserrat', sans-serif;
                    letter-spacing: -0.5px;
                }
                
                .cv-title {
                    font-size: 24px;
                    font-weight: 300;
                    margin-bottom: 32px;
                    opacity: 0.9;
                }
                
                .contact-info {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 16px;
                }
                
                .contact-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 15px;
                }
                
                .contact-item i {
                    font-size: 18px;
                    opacity: 0.9;
                }
                
                .cv-body {
                    padding: 48px;
                }
                
                .cv-section {
                    margin-bottom: 40px;
                }
                
                .section-header-cv {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 20px;
                }
                
                .section-icon-cv {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .section-icon-cv i {
                    color: white;
                    font-size: 16px;
                }
                
                .section-title-cv {
                    font-size: 22px;
                    font-weight: 700;
                    color: #2d3748;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                
                .cv-text {
                    color: #4a5568;
                    line-height: 1.6;
                    font-size: 16px;
                }
                
                .experience-list {
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }
                
                .experience-item-cv {
                    background: #f8fafc;
                    padding: 24px;
                    border-radius: 12px;
                    border-left: 4px solid #4facfe;
                }
                
                .experience-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                }
                
                .experience-title {
                    font-size: 20px;
                    font-weight: 700;
                    color: #2d3748;
                }
                
                .experience-date {
                    color: #4facfe;
                    font-weight: 600;
                    font-size: 14px;
                }
                
                .experience-subheader {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                }
                
                .experience-company {
                    color: #718096;
                    font-weight: 600;
                    font-size: 16px;
                }
                
                .experience-location {
                    color: #a0aec0;
                    font-size: 14px;
                }
                
                .experience-description-cv {
                    list-style: none;
                    padding: 0;
                }
                
                .experience-description-cv li {
                    color: #4a5568;
                    margin-bottom: 8px;
                    padding-left: 20px;
                    position: relative;
                    line-height: 1.5;
                }
                
                .experience-description-cv li:before {
                    content: "•";
                    color: #4facfe;
                    font-size: 20px;
                    position: absolute;
                    left: 0;
                    top: -2px;
                }
                
                .skills-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                }
                
                .skill-cv {
                    padding: 10px 24px;
                    border-radius: 25px;
                    font-size: 14px;
                    font-weight: 600;
                    color: white;
                }
                
                .skill-cv.blue {
                    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                }
                
                .skill-cv.green {
                    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
                }
                
                .skill-cv.purple {
                    background: linear-gradient(135deg, #8a2387 0%, #f27121 100%);
                }
                
                .skill-cv.orange {
                    background: linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%);
                }
                
                .skill-cv.teal {
                    background: linear-gradient(135deg, #2c3e50 0%, #bdc3c7 100%);
                }
                
                @media print {
                    body {
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                        min-height: 100vh !important;
                    }
                    .cv-template {
                        width: 100% !important;
                        min-height: 100vh !important;
                        box-shadow: none !important;
                    }
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
            </style>
        </head>
        <body>
            <div class="cv-template">
                <div class="cv-header">
                    <div class="header-content">
                        <h1 class="cv-name">${escapeHtml(name)}</h1>
                        <h2 class="cv-title">${escapeHtml(title)}</h2>
                        <div class="contact-info">
                            <div class="contact-item">
                                <i class="fas fa-envelope"></i>
                                <span>${escapeHtml(email)}</span>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-phone"></i>
                                <span>${escapeHtml(phone)}</span>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${escapeHtml(location)}</span>
                            </div>
                            <div class="contact-item">
                                <i class="fab fa-linkedin"></i>
                                <span>${escapeHtml(linkedin)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="cv-body">
                    <!-- Professional Summary -->
                    <div class="cv-section">
                        <div class="section-header-cv">
                            <div class="section-icon-cv">
                                <i class="fas fa-user"></i>
                            </div>
                            <h3 class="section-title-cv">PROFESSIONAL SUMMARY</h3>
                        </div>
                        <p class="cv-text">${escapeHtml(summary)}</p>
                    </div>
                    
                    <!-- Work Experience -->
                    <div class="cv-section">
                        <div class="section-header-cv">
                            <div class="section-icon-cv">
                                <i class="fas fa-briefcase"></i>
                            </div>
                            <h3 class="section-title-cv">WORK EXPERIENCE</h3>
                        </div>
                        <div class="experience-list">
                            ${experienceItems.map(item => `
                                <div class="experience-item-cv">
                                    <div class="experience-header">
                                        <h4 class="experience-title">${escapeHtml(item.jobTitle)}</h4>
                                        <span class="experience-date">${escapeHtml(item.startDate)} - ${escapeHtml(item.endDate)}</span>
                                    </div>
                                    <div class="experience-subheader">
                                        <span class="experience-company">${escapeHtml(item.company)}</span>
                                        ${item.location ? `<span class="experience-location">${escapeHtml(item.location)}</span>` : ''}
                                    </div>
                                    <ul class="experience-description-cv">
                                        ${item.description.split('\n').filter(line => line.trim()).map(line => 
                                            `<li>${escapeHtml(line.replace('•', '').trim())}</li>`
                                        ).join('')}
                                    </ul>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Skills -->
                    <div class="cv-section">
                        <div class="section-header-cv">
                            <div class="section-icon-cv">
                                <i class="fas fa-tools"></i>
                            </div>
                            <h3 class="section-title-cv">SKILLS & TECHNOLOGIES</h3>
                        </div>
                        <div class="skills-list">
                            ${skillTags.map(skill => 
                                `<span class="skill-cv ${skill.color}">${escapeHtml(skill.text)}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            </div>
            <script>
                window.onload = function() {
                    window.print();
                    setTimeout(() => {
                        window.close();
                    }, 100);
                }
            </script>
        </body>
        </html>
    `;
    
    // Open print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 500));
    
    showNotification('PDF ready! Choose "Save as PDF" in print dialog.', 'success');
}

async function downloadAllTemplates() {
    if (!confirm('This will generate PDF files for all 5 templates. Continue?')) {
        return;
    }
    
    showNotification('Generating all 5 template variations...', 'info');
    const loadingOverlay = document.getElementById('pdfLoading');
    if (loadingOverlay) loadingOverlay.classList.add('active');
    
    try {
        const originalTemplate = selectedTemplate;
        const templates = Object.keys(premiumTemplates);
        
        for (let i = 0; i < templates.length; i++) {
            // Switch template for PDF generation
            selectedTemplate = templates[i];
            
            // Wait a moment
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Generate PDF for this template
            await generatePDFWithPrint();
            
            showNotification(`Downloaded: ${premiumTemplates[selectedTemplate].name}`, 'success');
            
            // Wait before next download
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Restore original template
        selectedTemplate = originalTemplate;
        updateCVHeaderGradient();
        updateCurrentTemplateName();
        
        showNotification('All 5 templates downloaded successfully!', 'success');
        
    } catch (error) {
        console.error('Error downloading all templates:', error);
        showNotification('Failed to download all templates', 'error');
    } finally {
        if (loadingOverlay) loadingOverlay.classList.remove('active');
    }
}

function printResume() {
    showNotification('Opening print dialog...', 'info');
    const originalZoom = currentZoom;
    currentZoom = 1;
    updateZoom();
    
    setTimeout(() => {
        window.print();
        currentZoom = originalZoom;
        updateZoom();
    }, 500);
}

function cancelResume() {
    if (confirm('Are you sure you want to reset the resume? This will clear all your current work.')) {
        ['fullName', 'jobTitle', 'email', 'phone', 'location', 'linkedin', 'portfolio', 'summary'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.value = '';
        });
        
        const skillsContainer = document.getElementById('skillsContainer');
        if (skillsContainer) skillsContainer.innerHTML = '';
        
        const experienceContainer = document.getElementById('experienceContainer');
        if (experienceContainer) {
            experienceContainer.innerHTML = '';
            addExperienceItem();
        }
        
        selectedTemplate = 'ocean-blue';
        document.querySelectorAll('.template-card').forEach(card => card.classList.remove('selected'));
        document.querySelector('.template-card[data-template="ocean-blue"]').classList.add('selected');
        
        currentZoom = 0.8;
        resumeScore = 0;
        updateCVPreview();
        updateZoom();
        updateCVHeaderGradient();
        
        showNotification('Resume has been reset. Start fresh!', 'success');
    }
}

// ===== INPUT LISTENERS =====
function initInputListeners() {
    ['fullName', 'jobTitle', 'email', 'phone', 'location', 'linkedin', 'portfolio', 'summary'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                updateCVPreview();
                updateProgress();
            });
        }
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    let icon = 'ℹ️';
    switch(type) {
        case 'success': icon = '✅'; break;
        case 'warning': icon = '⚠️'; break;
        case 'error': icon = '❌'; break;
        default: icon = 'ℹ️'; break;
    }
    
    notification.innerHTML = `
        <span class="notification-icon">${icon}</span>
        <span class="notification-message">${escapeHtml(message)}</span>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.remove();
    });
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 4000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}