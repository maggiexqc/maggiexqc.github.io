lastScrollTop = 0;
window.addEventListener('scroll', function() {
    let currentScroll = window.scrollY;
    // Check if user scrolled down
    if (currentScroll > lastScrollTop) {
        setTimeout(() => {
            window.location.href = 'home.html'; 
        }, 200); 
    }
    lastScrollTop = currentScroll;
});
