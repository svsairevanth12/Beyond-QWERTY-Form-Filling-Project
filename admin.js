let formFields = [];

document.addEventListener('DOMContentLoaded', function() {
    showFormList(); // Show forms by default
    setupEventListeners();
});

function setupEventListeners() {
    // Add form creation handler
    document.getElementById('formCreateForm').addEventListener('submit', handleFormSubmit);
    
    // Add navigation handlers
    document.querySelectorAll('.admin-btn').forEach(btn => {
        btn.addEventListener('click', handleNavigation);
    });
}

function handleNavigation(e) {
    const sections = ['formBuilder', 'formList', 'responsesView'];
    sections.forEach(section => {
        document.getElementById(section).style.display = 'none';
    });
    
    const targetSection = e.target.getAttribute('data-target');
    const section = document.getElementById(targetSection);
    if (section) {
        section.style.display = 'block';
        if (targetSection === 'formList') {
            displayFormList();
        }
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    if (formFields.length === 0) {
        showError('Please add at least one field');
        return;
    }
    
    const formName = document.getElementById('formName').value.trim();
    if (!formName) {
        showError('Please enter a form name');
        return;
    }
    
    saveForm(formName);
}

function saveForm(formName) {
    try {
        const formTemplate = {
            id: 'form_' + Date.now(),
            name: formName,
            fields: formFields,
            createdAt: new Date().toISOString()
        };
        
        let forms = JSON.parse(localStorage.getItem('formTemplates') || '[]');
        forms.push(formTemplate);
        localStorage.setItem('formTemplates', JSON.stringify(forms));
        
        showSuccess('Form created successfully!');
        resetFormBuilder();
        showFormList();
    } catch (error) {
        console.error('Error saving form:', error);
        showError('Error creating form');
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.querySelector('.container').insertBefore(errorDiv, document.querySelector('.admin-controls'));
    setTimeout(() => errorDiv.remove(), 3000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.querySelector('.container').insertBefore(successDiv, document.querySelector('.admin-controls'));
    setTimeout(() => successDiv.remove(), 3000);
}

function showFormBuilder() {
    document.getElementById('formBuilder').style.display = 'block';
    document.getElementById('formList').style.display = 'none';
    document.getElementById('responsesView').style.display = 'none';
}

function showResponses() {
    document.getElementById('formBuilder').style.display = 'none';
    document.getElementById('formList').style.display = 'none';
    document.getElementById('responsesView').style.display = 'block';
    
    // Get and display all responses
    const responses = JSON.parse(localStorage.getItem('formData') || '[]');
    displayResponses(responses);
}

function addField() {
    const fieldName = document.getElementById('fieldName').value;
    const fieldType = document.getElementById('fieldType').value;
    const isRequired = document.getElementById('isRequired').checked;
    
    if (fieldName) {
        formFields.push({ 
            name: fieldName, 
            type: fieldType,
            required: isRequired,
            id: 'field_' + Date.now()
        });
        updateFieldsList();
        document.getElementById('fieldName').value = '';
    }
}

function updateFieldsList() {
    const fieldsList = document.getElementById('fieldsList');
    fieldsList.innerHTML = formFields.map((field, index) => `
        <div class="field-item">
            <div>
                ${field.name} (${field.type}) ${field.required ? '* Required' : ''}
            </div>
            <button onclick="removeField(${index})" class="secondary-btn">Remove</button>
        </div>
    `).join('');
}

function removeField(index) {
    formFields.splice(index, 1);
    updateFieldsList();
}

function showFormList() {
    document.getElementById('formBuilder').style.display = 'none';
    document.getElementById('formList').style.display = 'block';
    document.getElementById('responsesView').style.display = 'none';
    displayFormList();
}

function displayFormList() {
    const formList = document.getElementById('formList');
    formList.style.display = 'block';
    const forms = JSON.parse(localStorage.getItem('formTemplates') || '[]');
    
    if (forms.length === 0) {
        formList.innerHTML = '<div class="empty-state">No forms created yet. Click "Create New Form" to get started.</div>';
        return;
    }
    
    formList.innerHTML = `
        <h2>Created Forms</h2>
        <div class="forms-container">
            ${forms.map(form => `
                <div class="form-card">
                    <h3>${form.name}</h3>
                    <p>Created: ${new Date(form.createdAt).toLocaleDateString()}</p>
                    <p>Fields: ${form.fields.length}</p>
                    <div class="form-actions">
                        <button onclick="viewFormResponses('${form.id}')" class="secondary-btn">View Responses</button>
                        <button onclick="editForm('${form.id}')" class="edit-btn">Edit</button>
                        <button onclick="deleteForm('${form.id}')" class="danger-btn">Delete</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function deleteForm(formId) {
    if (confirm('Are you sure you want to delete this form?')) {
        let forms = JSON.parse(localStorage.getItem('formTemplates') || '[]');
        forms = forms.filter(form => form.id !== formId);
        localStorage.setItem('formTemplates', JSON.stringify(forms));
        displayFormList();
    }
}

function viewFormResponses(formId) {
    // Switch to responses view
    document.getElementById('formBuilder').style.display = 'none';
    document.getElementById('formList').style.display = 'none';
    document.getElementById('responsesView').style.display = 'block';

    const responses = JSON.parse(localStorage.getItem('formData') || '[]');
    const formResponses = responses.filter(response => response.formId === formId);
    displayResponses(formResponses);
}

function displayResponses(responses) {
    const responsesList = document.getElementById('responsesList');
    
    if (responses.length === 0) {
        responsesList.innerHTML = '<div class="empty-state">No responses available</div>';
        return;
    }

    const forms = JSON.parse(localStorage.getItem('formTemplates') || '[]');
    
    responsesList.innerHTML = responses.map(response => {
        const form = forms.find(f => f.id === response.formId);
        const formName = form ? form.name : 'Unknown Form';
        
        return `
            <div class="response-card">
                <h3>${formName}</h3>
                <p><strong>Submitted:</strong> ${new Date(response.timestamp).toLocaleString()}</p>
                ${Object.entries(response.data).map(([key, value]) => `
                    <p><strong>${key}:</strong> ${value}</p>
                `).join('')}
            </div>
        `;
    }).join('');
}

function loadResponses() {
    const responsesList = document.getElementById('responsesList');
    const responses = JSON.parse(localStorage.getItem('formData') || '[]');
    
    if (responses.length === 0) {
        responsesList.innerHTML = '<p>No responses yet</p>';
        return;
    }
    
    responsesList.innerHTML = responses.map(response => `
        <div class="response-card">
            <p><strong>Name:</strong> ${response.name}</p>
            <p><strong>Age:</strong> ${response.age}</p>
            <p><strong>Description:</strong> ${response.description}</p>
            <p><strong>Submitted:</strong> ${new Date(response.timestamp).toLocaleString()}</p>
        </div>
    `).join('');
}
