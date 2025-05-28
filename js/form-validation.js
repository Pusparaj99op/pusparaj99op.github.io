document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    const inputs = form.querySelectorAll('input:not([type="submit"]), textarea, select');
    
    inputs.forEach(input => {
      // Create validation message element
      const validationMessage = document.createElement('div');
      validationMessage.className = 'validation-message';
      input.parentNode.insertBefore(validationMessage, input.nextSibling);
      
      // Real-time validation
      input.addEventListener('input', () => {
        validateInput(input, validationMessage);
      });
      
      input.addEventListener('blur', () => {
        validateInput(input, validationMessage);
      });
    });
    
    form.addEventListener('submit', event => {
      let isValid = true;
      
      inputs.forEach(input => {
        const validationMessage = input.nextElementSibling;
        if (!validateInput(input, validationMessage)) {
          isValid = false;
        }
      });
      
      if (!isValid) {
        event.preventDefault();
      }
    });
  });
  
  function validateInput(input, validationMessage) {
    let isValid = true;
    validationMessage.textContent = '';
    
    if (input.required && !input.value.trim()) {
      validationMessage.textContent = 'This field is required';
      isValid = false;
    } else if (input.type === 'email' && input.value.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(input.value)) {
        validationMessage.textContent = 'Please enter a valid email address';
        isValid = false;
      }
    } else if (input.pattern && input.value.trim()) {
      const regex = new RegExp(input.pattern);
      if (!regex.test(input.value)) {
        validationMessage.textContent = input.title || 'Please match the requested format';
        isValid = false;
      }
    }
    
    input.setAttribute('aria-invalid', !isValid);
    return isValid;
  }
});
