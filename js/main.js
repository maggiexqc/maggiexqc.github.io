// Change page into home.html if user scrolls up or clicks on the page
document.addEventListener('DOMContentLoaded', function() {
    let lastScrollTop = 0;
    let content = document.querySelector('.content');

    window.addEventListener('scroll', function() {
        let currentScroll = window.scrollY;
        // Check if user scrolled up
        if (currentScroll > lastScrollTop) {
            content.classList.add('slide-up');
            setTimeout(() => {
                window.location.href = 'home.html'; 
            }, 200); 
        }
        lastScrollTop = currentScroll;
    });

    window.addEventListener('click', function() {
        content.classList.add('slide-up');
        setTimeout(() => {
            window.location.href = 'home.html'; 
        }, 500); 
    });
});

