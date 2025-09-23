const dlg = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');
const phone = document.getElementById('phone');
let lastActive = null;

// Форматирование телефона
phone?.addEventListener('input', () => {
    const digits = phone.value.replace(/\D/g,'').slice(0,11); // до 11 цифр
    const d = digits.replace(/^8/, '7'); // нормализуем 8 → 7
    const parts = [];
    
    if (d.length > 0) parts.push('+7');
    if (d.length > 1) parts.push(' (' + d.slice(1,4));
    if (d.length >= 4) parts[parts.length - 1] += ')';
    if (d.length >= 5) parts.push(' ' + d.slice(4,7));
    if (d.length >= 8) parts.push('-' + d.slice(7,9));
    if (d.length >= 10) parts.push('-' + d.slice(9,11));
    
    phone.value = parts.join('');
});

// Устанавливаем pattern для валидации
phone?.setAttribute('pattern', '^\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}$');

// Открытие диалога
openBtn.addEventListener('click', () => {
    lastActive = document.activeElement;
    dlg.showModal();
    dlg.querySelector('input, select, textarea, button')?.focus();
});

// Закрытие диалога
closeBtn.addEventListener('click', () => dlg.close('cancel'));

// Обработка отправки формы
form?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // 1) Сброс кастомных сообщений
    [...form.elements].forEach(el => el.setCustomValidity?.(''));
    
    // 2) Проверка встроенных ограничений
    if (!form.checkValidity()) {
        // Кастомные сообщения для разных типов ошибок
        const email = form.elements.email;
        if (email?.validity.typeMismatch) {
            email.setCustomValidity('Введите корректный e-mail, например name@example.com');
        }
        
        // Сообщение для телефона
        if (phone?.validity.patternMismatch) {
            phone.setCustomValidity('Введите телефон в формате: +7 (999) 123-45-67');
        }
        
        // Обязательные поля
        [...form.elements].forEach(el => {
            if (el.validity.valueMissing) {
                el.setCustomValidity('Это поле обязательно для заполнения');
            }
        });
        
        form.reportValidity(); // показать браузерные подсказки
        
        // A11y: подсветка проблемных полей
        [...form.elements].forEach(el => {
            if (el.willValidate) {
                el.toggleAttribute('aria-invalid', !el.checkValidity());
            }
        });
        return;
    }
    
    // 3) Успешная отправка - закрываем диалог
    dlg.close('success');
    form.reset();
    
    // Дополнительно: можно показать сообщение об успехе
    console.log('Форма успешно отправлена!');
});

// Возврат фокуса после закрытия диалога
dlg.addEventListener('close', () => {
    lastActive?.focus();
    
    // Дополнительно: сброс валидации при закрытии
    if (dlg.returnValue === 'cancel') {
        [...form.elements].forEach(el => {
            el.setCustomValidity?.('');
            el.removeAttribute('aria-invalid');
        });
    }
});

// Дополнительно: улучшенная валидация при вводе
form?.addEventListener('input', (e) => {
    if (e.target.willValidate) {
        e.target.setCustomValidity('');
        e.target.toggleAttribute('aria-invalid', !e.target.checkValidity());
    }
});

// Дополнительно: валидация при потере фокуса
form?.addEventListener('blur', (e) => {
    if (e.target.willValidate && !e.target.checkValidity()) {
        e.target.setAttribute('aria-invalid', 'true');
    }
}, true);