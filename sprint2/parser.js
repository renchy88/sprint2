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
                        if (field.placeholder) {
                            inputElement.placeholder = field.placeholder;
                        }
                        if (field.required) {
                            inputElement.required = true;
                        }
                        break;

                    case 'file':
                        inputElement = document.createElement('input');
                        inputElement.type = 'file';
                        if (field.multiple) {
                            inputElement.multiple = true;
                        }
                        if (field.filetype) {
                            inputElement.accept = field.filetype.map(type => `.${type}`).join(', ');
                        }
                        break;

                    case 'checkbox':
                        inputElement = document.createElement('input');
                        inputElement.type = 'checkbox';
                        if (field.checked === 'true') {
                            inputElement.checked = true;
                        }
                        const checkboxLabel = document.createElement('label');
                        checkboxLabel.innerText = fieldObj.label || '';
                        checkboxLabel.prepend(inputElement);
                        formGroup.appendChild(checkboxLabel); 
                        formContainer.appendChild(formGroup);
                        return;

                    case 'color':
                        inputElement = document.createElement('input');
                        inputElement.type = 'color';
                        break;

                    case 'technology':
                        inputElement = document.createElement('select');
                        inputElement.classList.add('form-control');
                        if (field.multiple) {
                            field.technologies.forEach(tech => {
                                const option = document.createElement('option');
                                option.value = tech;
                                option.textContent = tech;
                                inputElement.appendChild(option);
                            });
                        } else {
                            field.technologies.forEach(tech => {
                                const option = document.createElement('option');
                                option.value = tech;
                                option.textContent = tech;
                                inputElement.appendChild(option);
                            });
                        }
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

                if (refObj.text) {
                    const refLink = document.createElement('a');
                    refLink.href = `#${refObj.ref || ''}`;
                    refLink.innerText = refObj.text;
                    refLink.classList.add('text-primary');
                    refContainer.appendChild(refLink);
                }

                if (refObj["text without ref"]) {
                    const refText = document.createElement('span');
                    refText.innerText = refObj["text without ref"];
                    refContainer.appendChild(refText);
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

function donwLoad(input) {
    let file = input.files[0];
    let reader = new FileReader();
    reader.readAsText(file);

    reader.onload = function() {
        createForm(JSON.parse(reader.result))
    }
}