function showApplicationForm() {
    let valid = true;
    
    // Проверяем, выбран ли тип автомобиля/услуги
    const carDiv = document.getElementById('carType');
    const carInner = carDiv.innerHTML.trim();
    const isCarSelected = carInner && !carInner.includes('Выбрать');
    if (!isCarSelected) {
        document.getElementById('carTypeHint').style.display = 'block';
        document.getElementById('carType').style.borderColor = 'red';
        valid = false;

        // Анимация тряски
        carDiv.style.animation = 'shake 0.5s';
        setTimeout(() => carDiv.style.animation = '', 500);
    } else {
        document.getElementById('carTypeHint').style.display = 'none';
        document.getElementById('carType').style.borderColor = '#ccc';
    }

    // Проверка типа груза
    const cargoInput = document.getElementById('cargoType');
    const cargoValue = cargoInput ? cargoInput.value.trim() : '';

    if (!cargoInput || cargoValue === '') {
        let cargoHint = document.getElementById('cargoTypeHint');
        if (!cargoHint) {
            cargoHint = document.createElement('div');
            cargoHint.id = 'cargoTypeHint';
            cargoHint.className = 'form-hint';
            cargoHint.textContent = 'Пожалуйста, введите тип груза';
            cargoHint.style.color = 'red';
            cargoHint.style.marginTop = '5px';
            cargoInput.parentNode.appendChild(cargoHint);
        }
        cargoHint.style.display = 'block';
        cargoInput.style.borderColor = 'red';
        valid = false;

        cargoInput.style.animation = 'shake 0.5s';
        setTimeout(() => {
            cargoInput.style.animation = '';
        }, 500);
    } else {
        const cargoHint = document.getElementById('cargoTypeHint');
        if (cargoHint) cargoHint.style.display = 'none';
        cargoInput.style.borderColor = '#ccc';
    }
    
    // Проверяем адреса загрузки (основные)
    const loadingInputs = document.querySelectorAll('#loadingAddressesContainer input[type=text]');
    let loadingFilled = false;
    loadingInputs.forEach((input, index) => {
        if (input.value.trim() !== '') {
            loadingFilled = true;
        }
    });
    
    if (!loadingFilled) {
        document.getElementById('loadingAddressHint').style.display = 'block';
        loadingInputs[0].style.borderColor = 'red';
        valid = false;

        loadingInputs[0].style.animation = 'shake 0.5s';
        setTimeout(() => loadingInputs[0].style.animation = '', 500);
    } else {
        document.getElementById('loadingAddressHint').style.display = 'none';
        loadingInputs.forEach(inp => inp.style.borderColor = '#ccc');
    }
    
    // Проверяем адрес выгрузки
    const unloading = document.getElementById('unloadingAddress');
    if (unloading.value.trim() === '') {
        document.getElementById('unloadingAddressHint').style.display = 'block';
        unloading.style.borderColor = 'red';
        valid = false;

        unloading.style.animation = 'shake 0.5s';
        setTimeout(() => unloading.style.animation = '', 500);
    } else {
        document.getElementById('unloadingAddressHint').style.display = 'none';
        unloading.style.borderColor = '#ccc';
    }
    
    // Проверяем, выбрана ли спецтехника или грузчики
    const isSpecialTech = document.getElementById('checkbox-special')?.classList.contains('checked');
    const isLoaders = document.getElementById('checkbox-loaders')?.classList.contains('checked');
    const showLoadingMethods = !isSpecialTech && !isLoaders;
    
    // Проверяем дополнительные адреса (только заполненность, без проверки способа загрузки для спецтехники и грузчиков)
    const additionalAddresses = document.querySelectorAll('.intermediate-address-wrapper');
    additionalAddresses.forEach(wrapper => {
        const input = wrapper.querySelector('input[type=text]');
        
        // Проверка заполненности адреса
        if (input.value.trim() === '') {
            if (!wrapper.querySelector('.form-hint')) {
                const newHint = document.createElement('div');
                newHint.className = 'form-hint';
                newHint.style.color = 'red';
                newHint.style.marginTop = '5px';
                newHint.textContent = 'Пожалуйста, введите промежуточный адрес';
                wrapper.appendChild(newHint);
            } else {
                const hint = wrapper.querySelector('.form-hint');
                hint.style.display = 'block';
                hint.textContent = 'Пожалуйста, введите промежуточный адрес';
            }
            input.style.borderColor = 'red';
            valid = false;

            input.style.animation = 'shake 0.5s';
            setTimeout(() => input.style.animation = '', 500);
        } else {
            const hint = wrapper.querySelector('.form-hint');
            if (hint) hint.style.display = 'none';
            input.style.borderColor = '#ccc';
            
            // Проверка выбранного способа загрузки только для обычных авто
            if (showLoadingMethods) {
                const radioGroupName = `loadingMethod_${input.id}`;
                const selectedMethod = wrapper.querySelector(`input[name="${radioGroupName}"]:checked`);
                
                if (!selectedMethod) {
                    const methodHint = wrapper.querySelector('.form-hint') || document.createElement('div');
                    methodHint.className = 'form-hint';
                    methodHint.style.color = 'red';
                    methodHint.style.marginTop = '5px';
                    methodHint.textContent = 'Выберите способ загрузки для этого адреса';
                    if (!wrapper.contains(methodHint)) {
                        wrapper.appendChild(methodHint);
                    }
                    methodHint.style.display = 'block';
                    valid = false;

                    const optionsContainer = wrapper.querySelector('#loadingOptions_' + input.id);
                    if (optionsContainer) {
                        optionsContainer.style.border = '1px solid red';
                        optionsContainer.style.padding = '5px';
                        optionsContainer.style.borderRadius = '4px';
                        optionsContainer.style.animation = 'shake 0.5s';
                        setTimeout(() => optionsContainer.style.animation = '', 500);
                    }
                } else {
                    const methodHint = wrapper.querySelector('.form-hint');
                    if (methodHint) methodHint.style.display = 'none';
                    const optionsContainer = wrapper.querySelector('#loadingOptions_' + input.id);
                    if (optionsContainer) optionsContainer.style.border = 'none';
                }
            }
        }
    });
    
    // Проверяем, выбрана ли спецтехника или грузчики
    if (isSpecialTech || isLoaders) {
        document.getElementById('loadingMethodHint').style.display = 'none';
        document.getElementById('unloadMethodHint').style.display = 'none';
        document.querySelector('#loadingOptions').style.borderColor = 'transparent';
        document.querySelector('#unloadOptions').style.borderColor = 'transparent';
    } else {
        // Проверяем способы загрузки/выгрузки только для обычных авто
        const loadingOptions = document.querySelectorAll('#loadingOptions input[type=radio]');
        let loadingSelected = false;
        loadingOptions.forEach(r => {
            if (r.checked) loadingSelected = true;
        });
        if (!loadingSelected) {
            document.getElementById('loadingMethodHint').style.display = 'block';
            document.querySelector('#loadingOptions').style.borderColor = 'red';
            valid = false;

            document.querySelector('#loadingOptions').style.animation = 'shake 0.5s';
            setTimeout(() => document.querySelector('#loadingOptions').style.animation = '', 500);
        } else {
            document.getElementById('loadingMethodHint').style.display = 'none';
            document.querySelector('#loadingOptions').style.borderColor = 'transparent';
        }
        
        const unloadOptions = document.querySelectorAll('#unloadOptions input[type=radio]');
        let unloadSelected = false;
        unloadOptions.forEach(r => {
            if (r.checked) unloadSelected = true;
        });
        if (!unloadSelected) {
            document.getElementById('unloadMethodHint').style.display = 'block';
            document.querySelector('#unloadOptions').style.borderColor = 'red';
            valid = false;

            document.querySelector('#unloadOptions').style.animation = 'shake 0.5s';
            setTimeout(() => document.querySelector('#unloadOptions').style.animation = '', 500);
        } else {
            document.getElementById('unloadMethodHint').style.display = 'none';
            document.querySelector('#unloadOptions').style.borderColor = 'transparent';
        }
    }
    
    // Дополнительная проверка для грузчиков
    const kolyanContainer = document.getElementById('kolyan-container');
    if (kolyanContainer && isLoaders) {
        if (!document.getElementById('loadersCountHint')) {
            const loadersHint = document.createElement('div');
            loadersHint.id = 'loadersCountHint';
            loadersHint.className = 'form-hint';
            loadersHint.textContent = 'Пожалуйста, укажите количество грузчиков';
            loadersHint.style.display = 'none';
            loadersHint.style.color = 'red';
            loadersHint.style.marginTop = '5px';
            const firstBlock = document.querySelector('#kolyan-container > div:first-child');
            kolyanContainer.insertBefore(loadersHint, firstBlock);
        }
        
        
        const loadersCount = parseInt(document.querySelector('#kolyan-container span')?.innerText || 0);
        const timeSelected = document.querySelector('#kolyan-container .kolyan-checkbox div[style*="display: block"]');
        
        if (loadersCount <= 0) {
            document.getElementById('loadersCountHint').style.display = 'block';
            valid = false;
        } else {
            document.getElementById('loadersCountHint').style.display = 'none';
        }
        
        
        if (!valid) {
            kolyanContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    } else if (kolyanContainer) {
        const loadersHint = document.getElementById('loadersCountHint');
        if (loadersHint) loadersHint.style.display = 'none';
    }
    
    // Если все проверки пройдены, показываем модальное окно заявки
    if (valid) {
        // Собираем данные из формы
        const checkedCheckbox = document.querySelector('.checkbox.checked');
        
        // Собираем данные о дополнительных адресах
        const additionalAddressesData = [];
        document.querySelectorAll('.intermediate-address-wrapper').forEach(wrapper => {
            const id = wrapper.querySelector('input').id;
            const methodSelected = !!wrapper.querySelector(`input[name="loadingMethod_${id}"]:checked`);
            const hint = document.getElementById(`loadingMethodHint_${id}`);
            
            if (!methodSelected && hint) {
                hint.style.display = 'block';
                wrapper.querySelector('.loading-options').style.border = '1px solid red';
                allValid = false;
            }
        });

        applicationData = {
            transportType: checkedCheckbox ? checkedCheckbox.querySelector('.auto-text')?.textContent : 'Не указан',
            cargoType: document.getElementById('cargoType')?.value || '',
            loadingAddresses: Array.from(document.querySelectorAll('#loadingAddressesContainer input[type=text]')).map(i => i.value),
            additionalAddresses: additionalAddressesData,
            unloadingAddress: document.getElementById('unloadingAddress')?.value || '',
            loadingMethod: document.querySelector('#loadingOptions input[type=radio]:checked')?.value || (isSpecialTech || isLoaders) ? 'Не требуется' : 'Не указан',
            unloadingMethod: document.querySelector('#unloadOptions input[type=radio]:checked')?.value || (isSpecialTech || isLoaders) ? 'Не требуется' : 'Не указан',
            loadersCount: parseInt(document.getElementById('loadersCount')?.innerText) || 0,
            loadersTime: document.querySelector('#kolyan-container .kolyan-checkbox div[style*="display: block"]')?.parentElement?.dataset?.value || 0,
            expediting: document.getElementById('expeditingCheckmark')?.style.display === 'block',
            insurance: document.getElementById('insuranceCheckmark')?.style.display === 'block',
            totalNoVAT: parseInt(document.getElementById('costNoVAT')?.innerText) || 0,
            totalWithVAT: parseInt(document.getElementById('costWithVAT')?.innerText) || 0,
            minTime: parseInt(document.getElementById('minTimeCar')?.innerText) || 0,
            clientInfo: {
                name: '',
                phone: '',
                email: ''
            },
            dates: {
                deliveryDate: '',
                deliveryTime: ''
            }
        };
        
        showApplicationModal();
    } else {
        const firstError = document.querySelector('.form-hint[style*="display: block"], input[style*="border-color: red"], .intermediate-address-wrapper input[style*="border-color: red"]');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}
