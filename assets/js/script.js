function redirectToSelection(grade) {
    const targetPage = `redirectedPage2.html?grade=${grade}`;
    window.location.href = targetPage;
}

function selectExam(exam) {
    const targetPage = `redirectedPage3.html?exam=${encodeURIComponent(exam)}`;
    window.location.href = targetPage;
}

function selectLanguage(language) {
    // Redirect to redirectedPage4 and pass the selected language as a query parameter
    const targetPage = `redirectedPage4.html?language=${encodeURIComponent(language)}`;
    window.location.href = targetPage;
}
function redirectToLogin() {
    // Add your login page URL here
    window.location.href = '/login';
}

// Function to toggle between logged-in and not-logged-in states
function toggleLoginState(isLoggedIn) {
    const loggedInSection = document.querySelector('.user-logged-in');
    const notLoggedInSection = document.querySelector('.user-not-logged-in');
    
    if (isLoggedIn) {
        loggedInSection.style.display = 'flex';
        notLoggedInSection.style.display = 'none';
    } else {
        loggedInSection.style.display = 'none';
        notLoggedInSection.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Set active state based on current page
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        if(link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Add hover intent for dropdowns
    const dropdowns = document.querySelectorAll('.dropdown');
    let timeout;

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', () => {
            clearTimeout(timeout);
            const content = dropdown.querySelector('.dropdown-content');
            content.style.visibility = 'visible';
            content.style.opacity = '1';
        });

        dropdown.addEventListener('mouseleave', () => {
            timeout = setTimeout(() => {
                const content = dropdown.querySelector('.dropdown-content');
                content.style.visibility = 'hidden';
                content.style.opacity = '0';
            }, 300); // 300ms delay before hiding
        });
    });
});