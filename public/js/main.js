// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading state to buttons
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        const submitBtn = this.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading"></span> Loading...';
        }
    });
});

// Auto-hide alerts after 5 seconds
document. querySelectorAll('.alert').forEach(alert => {
    setTimeout(() => {
        alert.style.transition = 'opacity 0.5s ease';
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 500);
    }, 5000);
});

// Add fade-in animation to cards
const observerOptions = {
    threshold:  0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry. isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(20px)';
            entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target. style.transform = 'translateY(0)';
            }, 100);
            
            observer.unobserve(entry. target);
        }
    });
}, observerOptions);

document.querySelectorAll('.donor-card, .stat-card').forEach(card => {
    observer.observe(card);
});

// Print functionality for detail page
if (document.querySelector('. detail-container')) {
    const printBtn = document.createElement('button');
    printBtn.className = 'btn btn-secondary';
    printBtn.innerHTML = '<i class="fas fa-print"></i> Print Details';
    printBtn.onclick = () => window.print();
    
    const detailHeader = document.querySelector('.detail-header');
    if (detailHeader) {
        detailHeader. appendChild(printBtn);
    }
}

console.log('���� Blood Donor Management System - UI Loaded Successfully');