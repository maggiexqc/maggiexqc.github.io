document.querySelectorAll('.app-card img').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent the link from firing immediately

        // Add 'enlarge' class to scale up the image
        this.classList.add('enlarge');

        // Wait for animation to complete before redirecting
        setTimeout(() => {
            window.location.href = this.parentElement.href;  // Redirect to the link in the parent <a> tag
        }, 100); // Match this timeout with the length of your CSS animation
    });
});