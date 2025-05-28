document.addEventListener('DOMContentLoaded', () => {
  const newsletterForm = document.getElementById('newsletter-form');
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const submitButton = newsletterForm.querySelector('button[type="submit"]');
      const statusMessage = document.createElement('p');
      statusMessage.className = 'newsletter-status';
      
      // Simple validation
      if (!emailInput.value || !emailInput.validity.valid) {
        statusMessage.textContent = 'Please enter a valid email address.';
        statusMessage.style.color = '#ff3860';
        
        // Add status message if not already present
        if (!newsletterForm.querySelector('.newsletter-status')) {
          newsletterForm.appendChild(statusMessage);
        } else {
          newsletterForm.querySelector('.newsletter-status').replaceWith(statusMessage);
        }
        return;
      }
      
      // Disable button and show loading state
      submitButton.disabled = true;
      submitButton.textContent = 'Subscribing...';
      
      try {
        // Here you would normally make an API call to your newsletter service
        // For demonstration, we're using a timeout to simulate an API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Success
        statusMessage.textContent = 'Thank you for subscribing!';
        statusMessage.style.color = '#48c774';
        emailInput.value = '';
        
        // Add status message if not already present
        if (!newsletterForm.querySelector('.newsletter-status')) {
          newsletterForm.appendChild(statusMessage);
        } else {
          newsletterForm.querySelector('.newsletter-status').replaceWith(statusMessage);
        }
      } catch (error) {
        // Error
        statusMessage.textContent = 'Subscription failed. Please try again later.';
        statusMessage.style.color = '#ff3860';
        
        // Add status message if not already present
        if (!newsletterForm.querySelector('.newsletter-status')) {
          newsletterForm.appendChild(statusMessage);
        } else {
          newsletterForm.querySelector('.newsletter-status').replaceWith(statusMessage);
        }
        
        console.error('Newsletter subscription error:', error);
      } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.textContent = 'Subscribe';
      }
    });
  }
});
