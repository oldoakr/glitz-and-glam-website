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

// Booking Form Submission with Real-Time Slot Checking
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    // Set minimum date to today
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
        
        // Check availability when date changes
        dateInput.addEventListener('change', async function() {
            const selectedDate = this.value;
            if (selectedDate) {
                await updateTimeSlotAvailability(selectedDate);
            }
        });
    }
    
    bookingForm.addEventListener('submit', async function(e) {
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
        
        // Extract price from service
        const serviceText = document.getElementById('service').selectedOptions[0].text;
        const priceMatch = serviceText.match(/₹(\d+)/);
        const price = priceMatch ? priceMatch[1] : 'Contact';
        
        // Check if slot is available via Google Sheets
        const bookedSlots = await checkSlotAvailability(formData.date);
        const timeValue = document.getElementById('time').selectedOptions[0].text;
        
        if (bookedSlots.includes(timeValue)) {
            alert('⚠️ Sorry! This time slot is already booked.\n\nPlease select another time slot.');
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
Time: ${timeValue}

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
Time: ${timeValue}

✅ This slot is AVAILABLE!

Click OK to confirm your booking via WhatsApp.
        `.trim();
        
        if (confirm(confirmMessage)) {
            // Save booking to Google Sheets
            await bookAppointment({
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                service: formData.service,
                price: price,
                date: formData.date,
                time: timeValue
            });
            
            // Open WhatsApp
            window.open(whatsappURL, '_blank');
            
            // Show success message
            setTimeout(() => {
                alert('🎉 BOOKING CONFIRMED!\n\nYour slot has been secured in our system.\n\nWe will confirm via WhatsApp within 15 minutes.\n\nFor urgent bookings, please call: 8088490262');
            }, 500);
            
            // Reset form
            bookingForm.reset();
        }
    });
}

// Update time slot availability based on bookings
async function updateTimeSlotAvailability(date) {
    const timeSelect = document.getElementById('time');
    if (!timeSelect) return;
    
    // Get booked slots for this date
    const bookedSlots = await checkSlotAvailability(date);
    
    // Update time options to show availability
    const options = timeSelect.options;
    for (let i = 1; i < options.length; i++) {
        const timeText = options[i].text;
        if (bookedSlots.includes(timeText)) {
            options[i].text = timeText + ' ❌ Booked';
            options[i].disabled = true;
            options[i].style.color = '#999';
        } else {
            // Remove any existing status and add available marker
            const cleanTime = timeText.replace(' ❌ Booked', '').replace(' ✅ Available', '');
            options[i].text = cleanTime + ' ✅ Available';
            options[i].disabled = false;
            options[i].style.color = '#2e7d32';
        }
    }
    
    // Show notification
    if (bookedSlots.length > 0) {
        const notification = document.createElement('div');
        notification.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #ff9800; color: white; padding: 15px 20px; border-radius: 8px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.3);';
        notification.innerHTML = `⚠️ ${bookedSlots.length} slot(s) already booked for this date`;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}

// Google Sheets API Functions
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyyvXYznLIM6Mm54woC3P-zKdTCidluTROcBAflUQOIjQtVq1VRNchRaAQLFhJVNVA/exec';

async function checkSlotAvailability(date) {
    try {
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?date=${date}`);
        const data = await response.json();
        return data.success ? data.bookedSlots : [];
    } catch (error) {
        console.error('Error checking availability:', error);
        return [];
    }
}

async function bookAppointment(bookingData) {
    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData)
        });
        return { success: true };
    } catch (error) {
        console.error('Error booking:', error);
        return { success: false };
    }
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
