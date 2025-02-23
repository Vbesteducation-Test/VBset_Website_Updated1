function loadLanguageContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const language = urlParams.get('language');
    
    if (language) {
        document.getElementById('language-heading').textContent = `Selected Programming Language: ${language}`;
        populateTopicsDropdown(language);
    } else {
        alert("No language selected");
    }
}

// Populate topics based on the selected language
function populateTopicsDropdown(language) {
    const topicSelector = document.getElementById('topic-selector');
    let topics = [];

    switch (language) {
        case 'Python':
            topics = ['Data Types', 'Functions', 'OOP', 'Libraries'];
            break;
        case 'Java':
            topics = ['Variables', 'Control Flow', 'OOP', 'Java Collections'];
            break;
        case 'C++':
            topics = ['Data Structures', 'Pointers', 'OOP', 'STL'];
            break;
        case 'JavaScript':
            topics = ['DOM Manipulation', 'Promises', 'ES6 Features', 'Async/Await'];
            break;
        default:
            topics = ['No topics available'];
    }

    topicSelector.innerHTML = '<option value="">-- Select Topic --</option>';
    topics.forEach(topic => {
        const option = document.createElement('option');
        option.value = topic;
        option.textContent = topic;
        topicSelector.appendChild(option);
    });
}

function submitSelection() {
    const topicSelector = document.getElementById('topic-selector');
    const selectedTopic = topicSelector.value;

    if (!selectedTopic) {
        alert("Please select a topic.");
        return;
    }

    const language = document.getElementById('language-heading').textContent.split(":")[1].trim();

    // Display the summary
    document.getElementById("language-summary").textContent = language;
    document.getElementById("topic-summary").textContent = selectedTopic;
    document.getElementById("summary-container").style.display = "block";

    // Load images based on the selected topic
    loadImages(selectedTopic);
}

function loadImages(topic) {
    const imageList = [
        `images/${topic}-1.jpg`,
        `images/${topic}-2.jpg`,
        `images/${topic}-3.jpg`
    ];

    if (imageList.length > 0) {
        currentImageIndex = 0;
        updateImage();
        document.getElementById("image-slider-container").style.display = "block";
        document.getElementById("image-actions-container").style.display = "block";
    } else {
        alert("No images found for this topic.");
        document.getElementById("image-slider-container").style.display = "none";
        document.getElementById("image-actions-container").style.display = "none";
    }
}

let currentImageIndex = 0;
function updateImage() {
    const sliderImage = document.getElementById("slider-image");
    sliderImage.style.opacity = 0;
    setTimeout(() => {
        sliderImage.src = `images/${document.getElementById("topic-selector").value}-${currentImageIndex + 1}.jpg`;
        sliderImage.style.opacity = 1;
    }, 300);
}

function prevImage() {
    currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : 2;
    updateImage();
}

function nextImage() {
    currentImageIndex = currentImageIndex < 2 ? currentImageIndex + 1 : 0;
    updateImage();
}

function likeImage() {
    alert("You liked this image!");
}

function shareImage() {
    alert("You shared this image!");
}

function clearSelection() {
    document.getElementById("topic-selector").selectedIndex = 0;
    document.getElementById("summary-container").style.display = "none";
    document.getElementById("image-slider-container").style.display = "none";
    document.getElementById("image-actions-container").style.display = "none";
}

window.onload = loadLanguageContent;
