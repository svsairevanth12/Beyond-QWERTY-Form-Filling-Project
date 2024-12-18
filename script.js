let recognition = null;
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
}

function startSpeechRecognition(targetId) {
    if (!recognition) {
        alert('Speech recognition is not supported in your browser');
        return;
    }

    recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        document.getElementById(targetId).value = text;
    };

    recognition.start();
}

// Add click handlers for voice buttons
document.querySelectorAll('.voice-btn').forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-target');
        startSpeechRecognition(targetId);
    });
});

// Handle form submission
document.getElementById('sampleForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        description: document.getElementById('description').value,
        timestamp: new Date().toISOString()
    };

    try {
        // Get existing data from localStorage
        let existingData = JSON.parse(localStorage.getItem('formData') || '[]');
        
        // Add new data
        existingData.push(formData);
        
        // Save back to localStorage
        localStorage.setItem('formData', JSON.stringify(existingData));
        
        alert('Data saved successfully!');
        e.target.reset();
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error saving data');
    }
});

// Add function to view stored data
function viewStoredData() {
    const data = JSON.parse(localStorage.getItem('formData') || '[]');
    console.log('Stored Data:', data);
    return data;
}

document.getElementById('clickMe').addEventListener('click', function() {
    alert('Button clicked!');
});