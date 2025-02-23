// Global variables
let currentImageIndex = 0;
let imageList = [];
let likedImages = {};

// Initialize page on load
window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    const source = params.get('source'); // Add a source parameter to identify which page redirected
    
    // Show/hide fields based on source
    if (source === 'redirect2') {
        showRedirect2Fields();
    } else if (source === 'redirect3') {
        showRedirect3Fields();
    }
    
    // Populate all possible fields
    const fields = [
        'exam', 'class', 'subject', 'chapter', 'topic', 
        'exercise', 'syllabus'
    ];
    
    fields.forEach(field => {
        const value = params.get(field);
        const element = document.getElementById(`${field}-summary`);
        if (element && value) {
            element.textContent = value;
        }
    });
    
    // Load images based on topic or exercise
    const contentIdentifier = params.get('topic') || params.get('exercise');
    loadImages(contentIdentifier);
};

function showRedirect2Fields() {
    document.getElementById('exam-row').style.display = 'block';
    document.getElementById('topic-row').style.display = 'block';
    document.getElementById('exercise-row').style.display = 'none';
    document.getElementById('syllabus-row').style.display = 'none';
}

function showRedirect3Fields() {
    document.getElementById('exam-row').style.display = 'none';
    document.getElementById('topic-row').style.display = 'none';
    document.getElementById('exercise-row').style.display = 'block';
    document.getElementById('syllabus-row').style.display = 'block';
}

function loadImages(identifier) {
    // Simulate loading images for the topic or exercise
    imageList = [
        `assets/images/${identifier.toLowerCase()}-1.jpg`,
        `assets/images/${identifier.toLowerCase()}-2.jpg`,
        `assets/images/${identifier.toLowerCase()}-3.jpg`
    ];

    if (imageList.length > 0) {
        currentImageIndex = 0;
        updateImage();
        document.getElementById("image-slider-container").style.display = "block";
        document.getElementById("image-actions-container").style.display = "block";
    } else {
        alert("No images available for this content.");
        document.getElementById("image-slider-container").style.display = "none";
        document.getElementById("image-actions-container").style.display = "none";
    }
}

// Rest of your existing JavaScript functions remain the same
// (prevImage, nextImage, updateImage, likeImage, updateLikeCount, 
// updateLikeStatus, shareImage)
    

function prevImage() {
    currentImageIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : imageList.length - 1;
    updateImage();
}

function nextImage() {
    currentImageIndex = (currentImageIndex < imageList.length - 1) ? currentImageIndex + 1 : 0;
    updateImage();
}

function updateImage() {
    const sliderImage = document.getElementById("slider-image");
    sliderImage.style.opacity = 0;
    
    setTimeout(() => {
        sliderImage.src = imageList[currentImageIndex];
        sliderImage.style.opacity = 1;
        updateLikeStatus();
    }, 300);
}

function likeImage() {
    const currentImage = imageList[currentImageIndex];
    const likeBtn = document.getElementById("like-btn");
    
    likedImages[currentImage] = !likedImages[currentImage];
    
    if (likedImages[currentImage]) {
        likeBtn.innerHTML = '<i class="fas fa-heart"></i> Liked';
        likeBtn.classList.add("liked");
    } else {
        likeBtn.innerHTML = '<i class="far fa-heart"></i> Like';
        likeBtn.classList.remove("liked");
    }
    
    updateLikeCount();
}

function updateLikeCount() {
    const likedCount = Object.values(likedImages).filter(Boolean).length;
    document.getElementById("like-count").textContent = `${likedCount} Likes`;
}

function updateLikeStatus() {
    const currentImage = imageList[currentImageIndex];
    const likeBtn = document.getElementById("like-btn");
    
    if (likedImages[currentImage]) {
        likeBtn.innerHTML = '<i class="fas fa-heart"></i> Liked';
        likeBtn.classList.add("liked");
    } else {
        likeBtn.innerHTML = '<i class="far fa-heart"></i> Like';
        likeBtn.classList.remove("liked");
    }
}

function shareImage() {
    const currentImage = imageList[currentImageIndex];
    const shareUrl = window.location.origin + '/' + currentImage;
    
    if (navigator.share) {
        navigator.share({
            title: "Check out this VBest Education resource!",
            text: "I found this helpful educational resource on VBest Education",
            url: shareUrl
        })
        .then(() => console.log("Successfully shared"))
        .catch((error) => console.log("Error sharing:", error));
    } else {
        // Fallback for browsers that don't support native sharing
        alert("Copy this link to share: " + shareUrl);
    }
}