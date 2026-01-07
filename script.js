// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

// Mobile Navigation Toggle
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');

if (burger && nav) {
    burger.addEventListener('click', () => {
        nav.classList.toggle('active');
        
        // Burger Animation
        burger.classList.toggle('toggle');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (nav) nav.classList.remove('active');
        if (burger) burger.classList.remove('toggle');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Only prevent default for internal links (not tel: links)
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Set minimum date for booking (today)
const dateInput = document.getElementById('date');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

// Booking Form Submission
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    // Set minimum date to today
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
    
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate phone number
        const phoneInput = document.getElementById('phone');
        const phoneValue = phoneInput.value.replace(/\D/g, '');
        
        if (phoneValue.length !== 10) {
            alert('⚠️ Please enter a valid 10-digit phone number');
            phoneInput.focus();
            return;
        }
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            phone: phoneValue,
            email: document.getElementById('email').value.trim(),
            service: document.getElementById('service').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            message: document.getElementById('message') ? document.getElementById('message').value.trim() : ''
        };
        
        // Validate date is not in the past
        const selectedDate = new Date(formData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            alert('⚠️ Please select a future date for your appointment');
            dateInput.focus();
            return;
        }
        
        // Format date nicely
        const dateObj = new Date(formData.date);
        const formattedDate = dateObj.toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Create professional WhatsApp message
        const whatsappMessage = `
*✨ NEW APPOINTMENT REQUEST ✨*
*Glitz & Glam Beauty Parlour*
━━━━━━━━━━━━━━━━━━━━

👤 *Customer Details:*
Name: ${formData.name}
Phone: +91 ${formData.phone}
Email: ${formData.email || 'Not provided'}

💅 *Service Requested:*
${formData.service}

📅 *Appointment Schedule:*
Date: ${formattedDate}
Time: ${formData.time}

${formData.message ? `💬 *Special Requests:*\n${formData.message}\n` : ''}
━━━━━━━━━━━━━━━━━━━━

_Please confirm this appointment at your earliest convenience._
        `.trim();
        
        // WhatsApp number
        const whatsappNumber = '918088490262';
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        // Show professional confirmation with details
        const confirmMessage = `
📋 BOOKING SUMMARY
━━━━━━━━━━━━━━━━

Service: ${formData.service}
Date: ${formattedDate}
Time: ${formData.time}

✅ Click OK to send your booking request via WhatsApp.

We'll confirm your appointment shortly!
        `.trim();
        
        if (confirm(confirmMessage)) {
            // Open WhatsApp
            window.open(whatsappURL, '_blank');
            
            // Show success message
            setTimeout(() => {
                alert('🎉 Thank you for choosing Glitz & Glam!\n\nYour booking request has been sent via WhatsApp.\n\nWe will confirm your appointment within 15 minutes.\n\nFor urgent bookings, please call: 8088490262');
            }, 500);
            
            // Reset form
            bookingForm.reset();
        }
    });
}

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards and gallery items
document.querySelectorAll('.service-card, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

}

}); // End of DOMContentLoaded

// Immediate FAQ setup - run as soon as script loads (script is at bottom of HTML)
(function() {
    console.log('FAQ script starting...');
    
    // Wait a tiny bit for rendering
    setTimeout(function() {
        var questions = document.querySelectorAll('.faq-question');
        console.log('Found FAQ questions:', questions.length);
        
        if (questions.length === 0) {
            console.error('ERROR: No FAQ questions found!');
            return;
        }
        
        for (var i = 0; i < questions.length; i++) {
            (function(index) {
                var question = questions[index];
                console.log('Setting up FAQ', index);
                
                question.onclick = function(e) {
                    console.log('FAQ clicked:', index);
                    
                    var item = this.parentElement;
                    var answer = item.querySelector('.faq-answer');
                    
                    if (!answer) {
                        console.error('No answer found for FAQ', index);
                        return;
                    }
                    
                    // Close all others
                    var allItems = document.querySelectorAll('.faq-item');
                    for (var j = 0; j < allItems.length; j++) {
                        if (allItems[j] !== item) {
                            allItems[j].classList.remove('active');
                            var otherAnswer = allItems[j].querySelector('.faq-answer');
                            if (otherAnswer) {
                                otherAnswer.style.display = 'none';
                            }
                        }
                    }
                    
                    // Toggle this one
                    if (item.classList.contains('active')) {
                        item.classList.remove('active');
                        answer.style.display = 'none';
                        console.log('Closed FAQ', index);
                    } else {
                        item.classList.add('active');
                        answer.style.display = 'block';
                        answer.style.padding = '1.5rem';
                        answer.style.background = '#fafafa';
                        console.log('Opened FAQ', index);
                    }
                };
            })(i);
        }
        
        console.log('FAQ setup complete!');
    }, 50);
})();

// Global functions for inline onclick handlers
// Show specific service category
function showCategory(categoryId) {
    const categoryElement = document.getElementById(categoryId);
    if (categoryElement) {
        categoryElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add to cart function (sends to WhatsApp)
function addToCart(serviceName, price) {
    const whatsappMessage = `
*Service Booking Request*

🌟 Service: ${serviceName}
💰 Price: ₹${price}

I would like to book this service. Please confirm availability.
    `.trim();
    
    const whatsappNumber = '918088490262';
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
}

// Toggle FAQ (keeping for backward compatibility)
function toggleFAQ(element) {
    console.log('FAQ clicked', element);
    const faqItem = element.parentElement;
    console.log('FAQ item:', faqItem);
    const wasActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!wasActive) {
        faqItem.classList.add('active');
        console.log('FAQ opened');
    } else {
        console.log('FAQ closed');
    }
}
