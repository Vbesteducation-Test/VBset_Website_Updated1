/* And here's the complete result2.js file */
// Global variables
let currentImageIndex = 0;
let imageList = [];
let likedImages = {};

// Initialize page on load
window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    
    // Populate summary
    document.getElementById('exam-summary').textContent = params.get('exam');
    document.getElementById('class-summary').textContent = params.get('class');
    document.getElementById('subject-summary').textContent = params.get('subject');
    document.getElementById('chapter-summary').textContent = params.get('chapter');
    document.getElementById('topic-summary').textContent = params.get('topic');
    
    // Load images based on selected topic
    loadImages(params.get('topic'));
};

function loadImages(topic) {
    // Simulate loading images for the topic
    imageList = [
        `assets/images/${topic.toLowerCase()}-1.jpg`,
        `assets/images/${topic.toLowerCase()}-2.jpg`,
        `assets/images/${topic.toLowerCase()}-3.jpg`
    ];

    if (imageList.length > 0) {
        currentImageIndex = 0;
        updateImage();
        document.getElementById("image-slider-container").style.display = "block";
        document.getElementById("image-actions-container").style.display = "block";
    } else {
        alert("No images available for this topic.");
        document.getElementById("image-slider-container").style.display = "none";
        document.getElementById("image-actions-container").style.display = "none";
    }
}

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