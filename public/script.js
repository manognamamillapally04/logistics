document.addEventListener('DOMContentLoaded', () => {
    
    // === MOBILE MENU TOGGLE ===
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    mobileBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // === SCROLL TO CONTACT FROM HERO ===
    const quoteBtn = document.getElementById('quote-btn');
    if(quoteBtn) {
        quoteBtn.addEventListener('click', () => {
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // === STICKY NAVBAR SHADOW ===
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
        } else {
            navbar.style.boxShadow = "var(--shadow-sm)";
        }
    });

    // === DUMMY TRACKING LOGIC ===
    const trackBtn = document.getElementById('track-btn');
    const trackInput = document.getElementById('tracking-input');
    const trackResult = document.getElementById('tracking-result');

    if(trackBtn) {
        trackBtn.addEventListener('click', () => {
            const val = trackInput.value.trim();
            if (val.length < 5) {
                alert('Please enter a valid tracking ID (e.g. BACS123456)');
                return;
            }
            
            // Show dummy result
            // Normally you would make an API call to your backend
            trackResult.classList.remove('hidden');
            
            // Randomize status for fun
            const locations = ['Port of Felixstowe, UK', 'London Gateway', 'In Transit via M1', 'Customs Clearance, Dover'];
            const randomLoc = locations[Math.floor(Math.random() * locations.length)];
            
            document.getElementById('track-location').innerText = randomLoc;
            
            let tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            document.getElementById('track-date').innerText = tomorrow.toLocaleDateString('en-GB') + ' - Estimated';
        });
    }

    // === FORM SUBMISSION ===
    const contactForm = document.getElementById('contact-form');
    const formMsg = document.getElementById('form-msg');
    const submitBtn = document.getElementById('submit-btn');

    if(contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Disable button, show loading text
            submitBtn.disabled = true;
            submitBtn.innerText = "Sending...";
            formMsg.className = "form-msg"; // reset classes
            formMsg.innerText = "";
            
            // Gather form data
            const formData = new FormData(contactForm);
            
            // Handle checkboxes for 'requirement'
            const reqs = [];
            document.querySelectorAll('input[name="requirement"]:checked').forEach((checkbox) => {
                reqs.push(checkbox.value);
            });

            // Handle radio button for 'communicationPref'
            const commPref = document.querySelector('input[name="communicationPref"]:checked')?.value;
            
            const payload = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                company: formData.get('company'),
                postcode: formData.get('postcode'),
                requirement: reqs,
                communicationPref: commPref,
                message: formData.get('message')
            };

            try {
                // Determine if we are running the node server on port 3000 locally
                // Use a relative path, which assumes we are serving via express static
                const res = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await res.json();

                if(!res.ok) {
                    throw new Error(data.message || 'Network response was not ok');
                }
                
                if (data.success) {
                    formMsg.classList.add('success');
                    formMsg.innerText = "Your request has been sent successfully!";
                    contactForm.reset();
                } else {
                    throw new Error(data.message || 'Error from server');
                }
            } catch (err) {
                console.error("Fetch error:", err);
                formMsg.classList.add('error'); 
                formMsg.innerText = err.message || "Failed to send email. Please check configuration.";
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = "Send Message";
            }
        });
    }

    // === SCROLL REVEAL ANIMATION (OPTIONAL ENHANCEMENT) ===
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll('.service-card, .feature-item');
    cards.forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });

});
