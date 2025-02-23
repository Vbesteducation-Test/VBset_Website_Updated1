function getQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        exam: urlParams.get('grade')
    };
}

window.onload = function() {
    const queryParams = getQueryParams(); 
    console.log("Query Parameters:", queryParams);
    const examNameElement = document.getElementById('class');
    examNameElement.textContent = queryParams.exam || 'No class selected';

    // Add event listener for subject change
    document.getElementById('subject').addEventListener('change', function(e) {
        const exerciseLabel = document.getElementById('exercise-label');
        const exerciseSelect = document.getElementById('exercise');
        
        if (this.value === 'mathematics') {
            exerciseLabel.style.display = 'block';
            exerciseSelect.style.display = 'block';
        } else {
            exerciseLabel.style.display = 'none';
            exerciseSelect.style.display = 'none';
            exerciseSelect.value = ''; // Reset exercise selection
        }
    });
};

// Rest of your JavaScript functions remain the same

function displaySummary() {
    // Get selected values
    const selectedClass = document.getElementById("class").textContent;
    const selectedSyllabus = document.getElementById("syllabus").value;
    const selectedSubject = document.getElementById("subject").value;
    const selectedChapter = document.getElementById("chapter").value;
    const selectedExercise = document.getElementById("exercise").value;

    // Check if required fields are selected
    if (!selectedClass || !selectedSyllabus || !selectedSubject || !selectedChapter) {
        alert("Please select all required fields before submitting.");
        return;
    }

    // Check if exercise is required (for Mathematics)
    if (selectedSubject === 'mathematics' && !selectedExercise) {
        alert("Please select an exercise for Mathematics.");
        return;
    }

    // Update summary section
    document.getElementById("class-summary").textContent = selectedClass;
    document.getElementById("syllabus-summary").textContent = selectedSyllabus;
    document.getElementById("subject-summary").textContent = selectedSubject;
    document.getElementById("chapter-summary").textContent = selectedChapter;
    document.getElementById("topic-summary").textContent = 
        selectedSubject === 'mathematics' ? selectedExercise : 'N/A';

    // Show the summary container
    document.getElementById("summary-container").style.display = "block";

    // Load images based on the selected topic
    loadImages(selectedSubject === 'mathematics' ? selectedExercise : selectedChapter);
}

function clearSelection() {
    // Reset all select elements
    document.getElementById("syllabus").value = "";
    document.getElementById("subject").value = "";
    document.getElementById("chapter").value = "";
    document.getElementById("exercise").value = "";

    // Hide exercise select if visible
    document.getElementById("exercise-label").style.display = "none";
    document.getElementById("exercise").style.display = "none";

    // Hide containers
    document.getElementById("summary-container").style.display = "none";
    document.getElementById("image-slider-container").style.display = "none";
    document.getElementById("image-actions-container").style.display = "none";

    // Reset like count and button
    document.getElementById("like-count").textContent = "0 Likes";
    const likeBtn = document.getElementById("like-btn");
    likeBtn.innerHTML = `<i class="far fa-heart"></i> Like`;
    likeBtn.classList.remove("liked");

    // Clear the image
    document.getElementById("slider-image").src = "";
}
function loadImages(topic) {
    // Define mock image paths for testing
    // In a real application, these would come from your server/database
    const mockImages = {
        mathematics: [
            'assets/images/math/exercise1-1.jpg',
            'assets/images/math/exercise1-2.jpg',
            'assets/images/math/exercise1-3.jpg'
        ],
        physics: [
            'assets/images/physics/chapter1-1.jpg',
            'assets/images/physics/chapter1-2.jpg',
            'assets/images/physics/chapter1-3.jpg'
        ],
        chemistry: [
            'assets/images/chemistry/chapter1-1.jpg',
            'assets/images/chemistry/chapter1-2.jpg',
            'assets/images/chemistry/chapter1-3.jpg'
        ],
        // Add more subjects or exercises as needed
    };

    // Get the selected subject
    const selectedSubject = document.getElementById("subject").value;
    
    // Reset current image list
    imageList = [];
    
    // Set images based on subject
    if (selectedSubject === 'mathematics') {
        // For mathematics, use exercise-specific images
        const selectedExercise = document.getElementById("exercise").value;
        imageList = [
            `assets/images/math/${selectedExercise}-1.jpg`,
            `assets/images/math/${selectedExercise}-2.jpg`,
            `assets/images/math/${selectedExercise}-3.jpg`
        ];
    } else {
        // For other subjects, use chapter-specific images
        const selectedChapter = document.getElementById("chapter").value;
        imageList = [
            `assets/images/${selectedSubject}/${selectedChapter}-1.jpg`,
            `assets/images/${selectedSubject}/${selectedChapter}-2.jpg`,
            `assets/images/${selectedSubject}/${selectedChapter}-3.jpg`
        ];
    }

    // For testing purposes, if no images are found, use placeholder images
    if (imageList.length === 0) {
        imageList = [
            '/api/placeholder/800/600',
            '/api/placeholder/800/600',
            '/api/placeholder/800/600'
        ];
    }

    if (imageList.length > 0) {
        currentImageIndex = 0;
        updateImage();
        document.getElementById("image-slider-container").style.display = "block";
        document.getElementById("image-actions-container").style.display = "block";
    } else {
        console.error("No images found for the selected options");
        document.getElementById("image-slider-container").style.display = "none";
        document.getElementById("image-actions-container").style.display = "none";
    }
}

function updateImage() {
    const sliderImage = document.getElementById("slider-image");
    const currentImage = imageList[currentImageIndex];
    
    // Add error handling for image loading
    sliderImage.onerror = function() {
        console.error("Error loading image:", currentImage);
        this.src = '/api/placeholder/800/600'; // Use placeholder if image fails to load
    };

    sliderImage.style.opacity = 0; // Fade out effect
    
    setTimeout(() => {
        sliderImage.src = currentImage;
        sliderImage.style.opacity = 1; // Fade in effect
        updateLikeStatus();
    }, 300);
}

// Update the displaySummary function to properly trigger image loading
function displaySummary() {
    // Get selected values
    const selectedClass = document.getElementById("class").textContent;
    const selectedSyllabus = document.getElementById("syllabus").value;
    const selectedSubject = document.getElementById("subject").value;
    const selectedChapter = document.getElementById("chapter").value;
    const selectedExercise = document.getElementById("exercise").value;

    // Validation
    if (!selectedClass || !selectedSyllabus || !selectedSubject || !selectedChapter) {
        alert("Please select all required fields before submitting.");
        return;
    }

    if (selectedSubject === 'mathematics' && !selectedExercise) {
        alert("Please select an exercise for Mathematics.");
        return;
    }

    // Create URL parameters
    const params = new URLSearchParams({
        class: selectedClass,
        syllabus: selectedSyllabus,
        subject: selectedSubject,
        chapter: selectedChapter,
        exercise: selectedSubject === 'mathematics' ? selectedExercise : ''
    });

    // Redirect to results page with parameters
    window.location.href = `results.html?${params.toString()}`;
}



let currentImageIndex = 0;
let imageList = [];
let likedImages = {};

function loadImages(topic) {
    // Get selected values
    const selectedSubject = document.getElementById("subject").value;
    const selectedChapter = document.getElementById("chapter").value;
    const selectedExercise = document.getElementById("exercise").value;

    // Determine which type of content to load (exercise or chapter)
    const contentType = selectedSubject === 'mathematics' ? selectedExercise : selectedChapter;
    const subjectFolder = selectedSubject.toLowerCase();
    
    // Create array of image paths (assuming 5 images per chapter/exercise)
    imageList = [];
    for (let i = 1; i <= 5; i++) {
        if (selectedSubject === 'mathematics') {
            imageList.push(`assets/images/math/${contentType}-${i}.jpg`);
        } else {
            imageList.push(`assets/images/${subjectFolder}/${contentType}-${i}.jpg`);
        }
    }

    // Reset current image index
    currentImageIndex = 0;

    // Show containers
    const sliderContainer = document.getElementById("image-slider-container");
    const actionsContainer = document.getElementById("image-actions-container");
    
    if (imageList.length > 0) {
        sliderContainer.style.display = "block";
        actionsContainer.style.display = "block";
        updateImage();
        updateNavigationButtons();
    } else {
        sliderContainer.style.display = "none";
        actionsContainer.style.display = "none";
    }
}

function updateImage() {
    const sliderImage = document.getElementById("slider-image");
    const currentImage = imageList[currentImageIndex];
    
    // Add loading state
    sliderImage.style.opacity = 0;
    
    // Handle image loading errors
    sliderImage.onerror = function() {
        this.src = '/api/placeholder/800/600';
        console.error("Failed to load image:", currentImage);
    };

    // Load new image
    setTimeout(() => {
        sliderImage.src = currentImage;
        sliderImage.style.opacity = 1;
        updateLikeStatus();
        updateNavigationButtons();
    }, 300);
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    
    // Update previous button
    prevBtn.style.display = currentImageIndex > 0 ? "block" : "none";
    
    // Update next button
    nextBtn.style.display = currentImageIndex < imageList.length - 1 ? "block" : "none";
}

function prevImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        updateImage();
    }
}

function nextImage() {
    if (currentImageIndex < imageList.length - 1) {
        currentImageIndex++;
        updateImage();
    }
}

function likeImage() {
    const currentImage = imageList[currentImageIndex];
    const likeBtn = document.getElementById("like-btn");
    
    if (!likedImages[currentImage]) {
        likedImages[currentImage] = true;
        likeBtn.innerHTML = '<i class="fas fa-heart"></i> Liked';
        likeBtn.classList.add("liked");
    } else {
        likedImages[currentImage] = false;
        likeBtn.innerHTML = '<i class="far fa-heart"></i> Like';
        likeBtn.classList.remove("liked");
    }
    
    updateLikeCount();
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

function updateLikeCount() {
    const likeCount = Object.values(likedImages).filter(Boolean).length;
    document.getElementById("like-count").textContent = `${likeCount} ${likeCount === 1 ? 'Like' : 'Likes'}`;
}

function shareImage() {
    const currentImage = imageList[currentImageIndex];
    const shareUrl = window.location.origin + '/' + currentImage;
    
    if (navigator.share) {
        navigator.share({
            title: 'Check out this educational content!',
            text: 'I found this interesting content on VBest Education',
            url: shareUrl
        })
        .then(() => console.log('Successfully shared'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
        // Fallback for browsers that don't support Web Share API
        const tempInput = document.createElement('input');
        tempInput.value = shareUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        alert('Link copied to clipboard: ' + shareUrl);
    }
}