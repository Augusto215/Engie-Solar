// Script para validação de formulários

document.addEventListener('DOMContentLoaded', function() {
    // Selecionar todos os formulários
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Selecionar campos do formulário
        const inputs = form.querySelectorAll('input, textarea, select');
        
        // Adicionar validação em tempo real
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                validateField(this);
            });
            
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
        
        // Validar formulário no envio
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            
            // Validar todos os campos
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                // Animação de envio
                const submitButton = form.querySelector('button[type="submit"]');
                submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
                submitButton.disabled = true;
                
                // Simulação de envio (substituir por AJAX real)
                setTimeout(() => {
                    // Feedback de sucesso
                    const feedbackDiv = form.querySelector('.form-feedback') || document.createElement('div');
                    feedbackDiv.className = 'form-feedback mt-3';
                    feedbackDiv.innerHTML = '<div class="alert alert-success">Mensagem enviada com sucesso! Entraremos em contato em breve.</div>';
                    
                    if (!form.querySelector('.form-feedback')) {
                        form.appendChild(feedbackDiv);
                    }
                    
                    // Resetar formulário
                    submitButton.innerHTML = 'Enviado!';
                    form.reset();
                    
                    inputs.forEach(input => {
                        input.classList.remove('is-valid');
                    });
                    
                    // Restaurar botão após 5 segundos
                    setTimeout(() => {
                        submitButton.innerHTML = form.classList.contains('footer-newsletter') ? 'Inscrever' : 'Enviar mensagem';
                        submitButton.disabled = false;
                        feedbackDiv.innerHTML = '';
                    }, 5000);
                }, 2000);
            }
        });
    });
    
    // Função para validar campo
    function validateField(field) {
        // Validação para checkbox
        if (field.type === 'checkbox') {
            if (!field.checked && field.required) {
                field.classList.add('is-invalid');
                return false;
            } else {
                field.classList.remove('is-invalid');
                return true;
            }
        }
        
        // Validação para campos vazios
        if (field.value.trim() === '' && field.required) {
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');
            return false;
        }
        
        // Validação para email
        if (field.type === 'email' && field.value.trim() !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value.trim())) {
                field.classList.add('is-invalid');
                field.classList.remove('is-valid');
                return false;
            }
        }
        
        // Validação para telefone
        if (field.name === 'phone' && field.value.trim() !== '') {
            const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
            if (!phoneRegex.test(field.value.trim())) {
                field.classList.add('is-invalid');
                field.classList.remove('is-valid');
                return false;
            }
        }
        
        // Campo válido
        field.classList.remove('is-invalid');
        if (field.value.trim() !== '') {
            field.classList.add('is-valid');
        }
        return true;
    }
    
    // Máscara para telefone
    const phoneInputs = document.querySelectorAll('input[name="phone"]');
    if (phoneInputs.length > 0 && typeof $.fn.mask === 'function') {
        phoneInputs.forEach(input => {
            $(input).mask('(00) 00000-0000');
        });
    }
});
