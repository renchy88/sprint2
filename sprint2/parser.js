document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    const formContainer = document.getElementById('form-container');
    const resetBtn = document.getElementById('reset-btn');

    function generateForm(data) {
        formContainer.innerHTML = '';

        if (data.name) {
            const title = document.createElement('h2');
            title.innerText = data.name;
            title.classList.add('form-title');
            formContainer.appendChild(title);
        }

        if (data.fields) {
            data.fields.forEach(fieldObj => {
                const field = fieldObj.input;
                const formGroup = document.createElement('div');
                formGroup.classList.add('form-group', 'border', 'p-2', 'mb-2');

                if (fieldObj.label) {
                    const label = document.createElement('label');
                    label.innerText = fieldObj.label;
                    formGroup.appendChild(label);
                }

                let inputElement;

                switch (field.type) {
                    case 'text':
                    case 'email':
                    case 'password':
                    case 'number':
                    case 'date':
                    case 'textarea':
                        inputElement = document.createElement(field.type === 'textarea' ? 'textarea' : 'input');
                        inputElement.type = field.type === 'textarea' ? null : field.type;
                        inputElement.classList.add('form-control');
                        if (field.placeholder) inputElement.placeholder = field.placeholder;
                        if (field.required) inputElement.required = true;
                        break;

                    case 'file':
                        inputElement = document.createElement('input');
                        inputElement.type = 'file';
                        if (field.multiple) inputElement.multiple = true;
                        if (field.filetype) inputElement.accept = field.filetype.map(type => `.${type}`).join(', ');
                        break;

                    case 'checkbox':
                        inputElement = document.createElement('input');
                        inputElement.type = 'checkbox';
                        inputElement.checked = field.checked === 'true';
                        const checkboxLabel = document.createElement('label');
                        checkboxLabel.prepend(inputElement);
                        formGroup.appendChild(checkboxLabel);
                        formContainer.appendChild(formGroup);
                        return;

                    case 'color':
                        inputElement = document.createElement('select');
                        inputElement.classList.add('form-control');
                        if (field.colors) {
                            field.colors.forEach(color => {
                                const option = document.createElement('option');
                                option.value = color;
                                option.style.backgroundColor = color;
                                option.textContent = color;
                                inputElement.appendChild(option);
                            });
                        }
                        break;

                    case 'technology':
                        inputElement = document.createElement('select');
                        inputElement.classList.add('form-control');
                        if (field.multiple) inputElement.multiple = true;
                        field.technologies.forEach(tech => {
                            const option = document.createElement('option');
                            option.value = tech;
                            option.textContent = tech;
                            inputElement.appendChild(option);
                        });
                        break;

                    default:
                        console.warn(`Unsupported field type: ${field.type}`);
                }

                if (inputElement) {
                    inputElement.name = fieldObj.label;
                    formGroup.appendChild(inputElement);
                }
                formContainer.appendChild(formGroup);
            });
        }

        if (data.references) {
            data.references.forEach(refObj => {
                const refContainer = document.createElement('div');
                refContainer.classList.add('reference', 'd-flex', 'justify-content-between', 'mt-2');

                if (refObj.input) {
                    const refCheckbox = document.createElement('input');
                    refCheckbox.type = 'checkbox';
                    refCheckbox.required = refObj.input.required === true;
                    refContainer.appendChild(refCheckbox);
                }

                if (refObj["text without ref"] || refObj.text) {
                    const refSpan = document.createElement('span');
                    refSpan.innerText = `${refObj["text without ref"] || ''} ${refObj.text || ''}`;
                    refContainer.appendChild(refSpan);
                }

                formContainer.appendChild(refContainer);
            });
        }

        if (data.buttons) {
            data.buttons.forEach(buttonObj => {
                const button = document.createElement('button');
                button.classList.add('btn', 'btn-primary', 'mt-3', 'w-100');
                button.type = 'button';
                button.innerText = buttonObj.text || "Button";
                formContainer.appendChild(button);
            });
        }
    }

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const jsonData = JSON.parse(e.target.result);
                    generateForm(jsonData);
                } catch (error) {
                    alert("Неверный формат файла. Пожалуйста, загрузите правильный файл.");
                }
            };
            reader.readAsText(file);
        }
    });

    resetBtn.addEventListener('click', () => {
        formContainer.innerHTML = '';
        fileInput.value = '';
    });
});
