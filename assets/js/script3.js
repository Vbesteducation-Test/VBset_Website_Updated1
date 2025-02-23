// Sample data structure for dropdowns
const classData = ['10', '11', '12'];
const subjectData = {
    '10': ['Mathematics', 'Physics', 'Chemistry'],
    '11': ['Mathematics', 'Physics', 'Chemistry'],
    '12': ['Mathematics', 'Physics', 'Chemistry']
};
const chapterData = {
    'Mathematics': ['Algebra', 'Geometry', 'Calculus'],
    'Physics': ['Mechanics', 'Optics', 'Electricity'],
    'Chemistry': ['Organic', 'Inorganic', 'Physical']
};
const topicData = {
    'Algebra': ['Linear Equations', 'Quadratic Equations', 'Polynomials'],
    'Geometry': ['Triangles', 'Circles', 'Polygons'],
    'Calculus': ['Limits', 'Derivatives', 'Integration'],
    'Mechanics': ['Motion', 'Force', 'Energy'],
    'Optics': ['Reflection', 'Refraction', 'Lenses'],
    'Electricity': ['Current', 'Voltage', 'Resistance'],
    'Organic': ['Alkanes', 'Alkenes', 'Alcohols'],
    'Inorganic': ['Periodic Table', 'Metals', 'Non-metals'],
    'Physical': ['States of Matter', 'Solutions', 'Thermodynamics']
};

// Initialize the page
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    document.getElementById('exam-name').textContent = urlParams.get('exam') || 'No exam selected';
    
    // Populate class dropdown
    const classSelect = document.getElementById('class');
    classData.forEach(className => {
        const option = document.createElement('option');
        option.value = className;
        option.textContent = className;
        classSelect.appendChild(option);
    });

    // Set up event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Class change event
    document.getElementById('class').addEventListener('change', function(e) {
        const selectedClass = e.target.value;
        const subjectSelect = document.getElementById('subject');
        
        if (selectedClass) {
            populateDropdown(subjectSelect, subjectData[selectedClass]);
            subjectSelect.disabled = false;
        } else {
            resetFollowingDropdowns('class');
        }
    });

    // Subject change event
    document.getElementById('subject').addEventListener('change', function(e) {
        const selectedSubject = e.target.value;
        const chapterSelect = document.getElementById('chapter');
        
        if (selectedSubject) {
            populateDropdown(chapterSelect, chapterData[selectedSubject]);
            chapterSelect.disabled = false;
        } else {
            resetFollowingDropdowns('subject');
        }
    });

    // Chapter change event
    document.getElementById('chapter').addEventListener('change', function(e) {
        const selectedChapter = e.target.value;
        const topicSelect = document.getElementById('topic');
        
        if (selectedChapter) {
            populateDropdown(topicSelect, topicData[selectedChapter]);
            topicSelect.disabled = false;
        } else {
            resetFollowingDropdowns('chapter');
        }
    });
}

function populateDropdown(select, data) {
    select.innerHTML = '<option value="">Select ' + select.id.charAt(0).toUpperCase() + select.id.slice(1) + '</option>';
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        select.appendChild(option);
    });
}

function resetFollowingDropdowns(startFrom) {
    const dropdowns = ['class', 'subject', 'chapter', 'topic'];
    let shouldReset = false;
    
    dropdowns.forEach(id => {
        if (shouldReset || id === startFrom) {
            const dropdown = document.getElementById(id);
            if (id !== startFrom) {
                dropdown.innerHTML = '<option value="">Select ' + id.charAt(0).toUpperCase() + id.slice(1) + '</option>';
                dropdown.disabled = true;
            }
            shouldReset = true;
        }
    });
}

function displaySummary() {
    const selectedClass = document.getElementById('class').value;
    const selectedSubject = document.getElementById('subject').value;
    const selectedChapter = document.getElementById('chapter').value;
    const selectedTopic = document.getElementById('topic').value;
    const examName = document.getElementById('exam-name').textContent;

    if (!selectedClass || !selectedSubject || !selectedChapter || !selectedTopic) {
        alert('Please select all options before proceeding');
        return;
    }

    const params = new URLSearchParams({
        exam: examName,
        class: selectedClass,
        subject: selectedSubject,
        chapter: selectedChapter,
        topic: selectedTopic
    });

    window.location.href = `result2.html?${params.toString()}`;
}

function clearSelection() {
    const dropdowns = ['class', 'subject', 'chapter', 'topic'];
    dropdowns.forEach(id => {
        const dropdown = document.getElementById(id);
        dropdown.selectedIndex = 0;
        if (id !== 'class') {
            dropdown.disabled = true;
        }
    });
}