let lastScrollTop = 0;
let reachedBottom = false;

window.addEventListener('scroll', function() {
    let currentScroll = window.scrollY;
    let maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    // Check if the user has reached the bottom of the page
    if (currentScroll >= maxScroll) {
        reachedBottom = true; // Set the flag once the bottom is reached
    }

    // If the user has already reached the bottom and scrolls down further
    if (reachedBottom && currentScroll > lastScrollTop) {
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 200);
    }

    lastScrollTop = currentScroll;
}, { passive: true });
