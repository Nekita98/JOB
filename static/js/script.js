const checkboxes = [
  document.getElementById('checkbox-auto'),
  document.getElementById('checkbox-special'),
  document.getElementById('checkbox-loaders')
];
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('click', function() {

        document.getElementById('insuranceCheckmark').style.display = 'none';
        document.getElementById('insuranceText').style.display = 'none';
        const loaderInsuranceText = document.getElementById('loaderInsuranceText');
        if (loaderInsuranceText) loaderInsuranceText.style.display = 'none';

        checkboxes.forEach(cb => cb.classList.remove('checked'));
        this.classList.add('checked');
        resetAllAddresses();
        document.querySelectorAll('.form-hint').forEach(hint => {
            hint.style.display = 'none';
        });
        document.getElementById('carType').style.border = '1px solid #ccc';
        document.querySelectorAll('input[type=text]').forEach(input => {
            input.style.borderColor = '#ccc';
        });
        const cargoInput = document.getElementById('cargoType');
        if (cargoInput) {
            cargoInput.value = '';
            const cargoHint = document.getElementById('cargoTypeHint');
            if (cargoHint) cargoHint.style.display = 'none';
        }
        const carTypeLabel = document.querySelector('.form-group label[for="carType"]');
        const carTypeHint = document.getElementById('carTypeHint');
        const kolyanContainer = document.getElementById('kolyan-container');
        if (kolyanContainer) {
            kolyanContainer.remove();
        }
        if (this.id === 'checkbox-loaders') {
            carTypeLabel.textContent = 'Грузчики и такелажные работы:';
            carTypeHint.textContent = 'Пожалуйста, выберите тип услуги';
            document.getElementById('minTimeCar').parentElement.parentElement.style.display = 'none';
        } else {
            carTypeLabel.textContent = 'Тип автомобиля:';
            carTypeHint.textContent = 'Пожалуйста, выберите тип автомобиля';
            document.getElementById('minTimeCar').parentElement.parentElement.style.display = 'block';
        }
        const isSpecialTech = this.id === 'checkbox-special';
        const isLoaders = this.id === 'checkbox-loaders';
        const calculatorSection = document.getElementById('calculator-section');
        const expeditingService = document.getElementById('expeditingService');
        if (isSpecialTech || isLoaders) {
            document.getElementById('loadingOptions').style.display = 'none';
            document.getElementById('unloadOptions').style.display = 'none';
            document.querySelectorAll('.load-method-label, .unload-method-label').forEach(el => {
                el.style.display = 'none';
            });
            calculatorSection.classList.add('methods-hidden');
            expeditingService.style.display = 'none';
        } else {
            document.getElementById('loadingOptions').style.display = 'flex';
            document.getElementById('unloadOptions').style.display = 'flex';
            document.querySelectorAll('.load-method-label, .unload-method-label').forEach(el => {
                el.style.display = 'block';
            });
            calculatorSection.classList.remove('methods-hidden');
            expeditingService.style.display = 'flex';
        }
        selectedCar = null;
        document.getElementById('carType').innerHTML = '<span style="color:#888;">Выбрать</span>';
        document.getElementById('carType').style.border = '1px solid #ccc';
        document.querySelectorAll('#loadingOptions input[type=radio], #unloadOptions input[type=radio]').forEach(r => {
            r.checked = false;
        });
        document.getElementById('expeditingCheckmark').style.display = 'none';
        document.getElementById('insuranceCheckmark').style.display = 'none';
        
        document.getElementById('costNoVAT').innerText = '0';
        document.getElementById('costWithVAT').innerText = '0';
        document.getElementById('minTimeCar').innerText = '0';

        // Полностью удаляем все дополнительные адреса
        const intermediateContainers = document.querySelectorAll('.intermediate-address-wrapper');
        intermediateContainers.forEach(container => {
            container.remove();
        });

        // Сбрасываем переменные для дополнительных адресов
        intermediatePoints.length = 0;
        nextIntermediateAddressId = 1;

    });
});

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('click', function() {
        document.querySelectorAll('#loadingOptions input[type=radio], #unloadOptions input[type=radio]').forEach(r => {
            r.checked = false;
            r.disabled = false; // Убедитесь, что кнопки разблокированы
        });
    });
});

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('click', function() {
        // Снимаем выделение с других чекбоксов
        checkboxes.forEach(cb => cb.classList.remove('checked'));
        this.classList.add('checked');
        
        // Сбрасываем адреса и расчеты
        resetAllAddresses();
        
        // Обновляем стоимость
        updateFinalCost();
        
        // Дополнительные настройки в зависимости от выбранного типа
        const isSpecialTech = this.id === 'checkbox-special';
        const isLoaders = this.id === 'checkbox-loaders';
        
        // Настройка интерфейса
        configureInterfaceForType(isSpecialTech, isLoaders);
    });
});

function configureInterfaceForType(isSpecialTech, isLoaders) {
    // Показываем/скрываем элементы в зависимости от типа
    document.getElementById('loadingOptions').style.display = isSpecialTech || isLoaders ? 'none' : 'flex';
    document.getElementById('unloadOptions').style.display = isSpecialTech || isLoaders ? 'none' : 'flex';

    // Добавляем отступ только для спецтехники и грузчиков
    const additionalServicesBlock = document.getElementById('additionalServices');
    if (isSpecialTech || isLoaders) {
        additionalServicesBlock.style.marginTop = '-20px'; // или любой другой нужный вам отступ
    } else {
        additionalServicesBlock.style.marginTop = ''; // сбрасываем для обычных авто
    }
    
    
    // Сбрасываем выбранный автомобиль
    selectedCar = null;
    document.getElementById('carType').innerHTML = '<span style="color:#888;">Выбрать</span>';
    
    // Обновляем стоимость
    updateFinalCost();
}

function resetAllAddresses() {
    // Очищаем массив точек
    mapPoints.length = 0;
    intermediatePoints.length = 0;
    
    // Очищаем поля ввода
    document.getElementById('loadingAddress').value = '';
    document.getElementById('unloadingAddress').value = '';

    // Сбрасываем страховку
    document.getElementById('insuranceCheckmark').style.display = 'none';
    document.getElementById('insuranceText').style.display = 'none';
    const loaderInsuranceText = document.getElementById('loaderInsuranceText');
    if (loaderInsuranceText) loaderInsuranceText.style.display = 'none';
    
    // Удаляем дополнительные адреса
    document.querySelectorAll('.intermediate-address-container').forEach(el => el.remove());

    // Сбрасываем страховку
    document.getElementById('insuranceCheckmark').style.display = 'none';
    document.getElementById('insuranceText').style.display = 'none';
    
    // Удаляем все дополнительные адреса из DOM
    const intermediateWrappers = document.querySelectorAll('.intermediate-address-wrapper');
    intermediateWrappers.forEach(wrapper => wrapper.remove());

    
    // Очищаем карту
    if (myMap) {
        myMap.geoObjects.removeAll();
    }
    
    // Сбрасываем расстояние
    totalDistanceKm = 0;
    distanceCost = 0;
    
    // Обновляем стоимость
    updateFinalCost();
}

window.addEventListener('load', () => {
    const autoCheckbox = document.getElementById('checkbox-auto');
    if (autoCheckbox) {
        autoCheckbox.classList.add('checked');
        document.getElementById('loadingOptions').style.display = 'flex';
        document.getElementById('unloadOptions').style.display = 'flex';
        document.querySelectorAll('.load-method-label, .unload-method-label').forEach(el => {
            el.style.display = 'block';
        });
        document.getElementById('calculator-section').classList.remove('methods-hidden');
        if (!document.getElementById('checkbox-loaders').classList.contains('checked')) {
            document.getElementById('minTimeCar').parentElement.parentElement.style.display = 'block';
        }
    }
    document.getElementById('leaveApplication').addEventListener('click', showApplicationForm);
    const leaveAppBtn = document.getElementById('leaveApplication');
    if (leaveAppBtn) {
        leaveAppBtn.addEventListener('click', showApplicationForm);
    } else {
        console.error('Кнопка "Оставить заявку" не найдена');
    }
});
document.getElementById('carType').style.border = '1px solid #ccc';
document.querySelectorAll('input[type=text]').forEach(input => {
    input.style.borderColor = '#ccc';
});

// Для основного адреса загрузки
const loadingAddressInput = document.querySelector('#loadingAddressesContainer input[type=text]');
if (loadingAddressInput) {
    loadingAddressInput.addEventListener('input', () => {
        const query = loadingAddressInput.value.trim();
        if (query.length < 3) {
            // Удаляем список подсказок, если он есть
            const suggestionsList = document.getElementById('loadingAddress-suggestions');
            if (suggestionsList) suggestionsList.remove();
            return;
        }
        
        fetch('/suggest_address', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({query: query})
        })
        .then(res => res.json())
        .then(data => {
            showSuggestions(data.suggestions, loadingAddressInput);
        });
    });
}

// Для адреса выгрузки
const unloadingAddressInput = document.getElementById('unloadingAddress');
if (unloadingAddressInput) {
    unloadingAddressInput.addEventListener('input', () => {
        const query = unloadingAddressInput.value.trim();
        if (query.length < 3) {
            // Удаляем список подсказок, если он есть
            const suggestionsList = document.getElementById('unloadingAddress-suggestions');
            if (suggestionsList) suggestionsList.remove();
            return;
        }
        
        fetch('/suggest_address', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({query: query})
        })
        .then(res => res.json())
        .then(data => {
            showSuggestions(data.suggestions, unloadingAddressInput, 'unloadingAddress');
        });
    });
}

function showSuggestions(suggestions, inputElement, fieldId) {
    // Удаляем старый список подсказок, если он есть
    let listId = fieldId ? fieldId + '-suggestions' : 'loadingAddress-suggestions';
    let existingList = document.getElementById(listId);
    if (existingList) {
        existingList.remove();
    }
    
    if (!suggestions || suggestions.length === 0) return;
    
    // Создаем новый список
    let listEl = document.createElement('div');
    listEl.id = listId;
    listEl.className = 'suggestions-list';
    listEl.style.cssText = `
        position: absolute;
        background-color: #fff;
        z-index: 9999;
        width: ${inputElement.offsetWidth}px;
        max-height: 150px;
        overflow-y: auto;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        margin-top: 5px;
    `;
    
    // Определяем родительский контейнер
    const parentContainer = inputElement.classList.contains('intermediate-input') 
        ? inputElement.closest('.intermediate-address-container')
        : inputElement.parentNode;
    
    parentContainer.style.position = 'relative';
    parentContainer.appendChild(listEl);
    
    // Позиционирование для промежуточных адресов
    if (inputElement.classList.contains('intermediate-input')) {
        listEl.style.top = '100%';
        listEl.style.left = '0';
    }
    
    // Добавляем подсказки
    suggestions.forEach(s => {
        const item = document.createElement('div');
        item.dataset.fullAddress = s;
        item.innerText = s;
        item.className = 'suggestion-item';
        item.style.cssText = `
            padding: 8px;
            cursor: pointer;
            color: #000;
            transition: background-color 0.2s;
        `;
        
        item.addEventListener('mouseenter', () => {
            item.style.backgroundColor = '#f0f0f0';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.backgroundColor = 'transparent';
        });

        // Обработчик выбора для всех устройств
        const handleSelection = (e) => {
            e.preventDefault();
            e.stopPropagation(); // Важно: предотвращаем всплытие
            
            const fullAddress = item.dataset.fullAddress;
            inputElement.value = fullAddress;
            listEl.remove();
            
            // Для адреса выгрузки сразу обрабатываем адрес
            if (fieldId === 'unloadingAddress') {
                processAddress(fullAddress, 'unloading', true);
            } else {
                getCoordinates(fullAddress, (lat, lon) => {
                    addPointToMap(lat, lon, fieldId, fullAddress);
                });
            }
            
            // Удаляем обработчики после выбора
            item.removeEventListener('click', handleSelection);
            item.removeEventListener('touchend', handleSelection);
        };

        // Добавляем обработчики для всех устройств
        item.addEventListener('click', handleSelection);
        item.addEventListener('touchend', handleSelection);
        
        listEl.appendChild(item);
    });
    
    // Закрытие при клике вне списка
    const closeHandler = function(e) {
        if (!listEl.contains(e.target)) {
            listEl.remove();
            document.removeEventListener('click', closeHandler);
            document.removeEventListener('touchend', closeHandler);
        }
    };
    
    document.addEventListener('click', closeHandler);
    document.addEventListener('touchend', closeHandler);
}



let selectedCar = null;
let myMap = null;
let ymapsReady = false;
let placemark = null;
const mapPoints = [];
const intermediatePoints = [];
let unloadingAddressData = null; // объект {lat, lon, description}
const unloadingInput = document.getElementById('unloadingAddress');
if (unloadingInput) {
    unloadingInput.addEventListener('blur', () => {
        processAddress(unloadingInput.value, 'Выгрузка', true);
    });
}

let selectedLoadingPrice = 0;
let selectedUnloadingPrice = 0;
let additionalCostNoVAT = 0;
let additionalCostWithVAT = 0;


function openModal() {
    // Создаем оверлей модального окна
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease-out;
    `;

    // Создаем контейнер модального окна
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    modalContainer.style.cssText = `
        background: white;
        border-radius: 12px;
        width: 90%;
        max-width: 800px;
        max-height: 90vh;
        overflow: hidden;
        transform: translateY(20px);
        transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        box-shadow: 0 12px 28px rgba(0,0,0,0.3);
        position: relative;
    `;

    // Создаем красный крестик для закрытия
    const closeButton = document.createElement('button');
    closeButton.className = 'modal-close';
    closeButton.innerHTML = '&times;';
    closeButton.style.cssText = `
        position: absolute;
        top: 15px;
        right: 15px;
        background: none;
        border: none;
        color: #ffffffff;
        font-size: 28px;
        cursor: pointer;
        transition: all 0.2s;
        z-index: 1001;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
    `;

    // Эффекты при наведении
    closeButton.addEventListener('mouseenter', () => {
        closeButton.style.transform = 'scale(1.2)';
        closeButton.style.color = '#ffffffff';
        closeButton.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    });

    closeButton.addEventListener('mouseleave', () => {
        closeButton.style.transform = 'scale(1)';
        closeButton.style.color = '#ffffffff';
        closeButton.style.backgroundColor = 'transparent';
    });

    // Обработчик закрытия
    closeButton.onclick = () => closeTransportModal(modalOverlay);

    // Создаем заголовок модального окна
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    modalHeader.style.cssText = `
        padding: 20px;
        background: #0a1f44;
        color: white;
        position: relative;
        border-bottom: 2px solid #d4af37;
    `;

    const modalTitle = document.createElement('h2');
    modalTitle.style.cssText = `
        margin: 0;
        font-family: 'Lobster', cursive;
        font-size: 28px;
        text-align: center;
        text-shadow: 1px 1px 3px rgba(0,0,0,0.3);
    `;

    // Создаем контент модального окна
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.cssText = `
        padding: 20px;
        overflow-y: auto;
        max-height: calc(90vh - 100px);
    `;

    // Создаем сетку для отображения транспортных средств
    const vehicleGrid = document.createElement('div');
    vehicleGrid.className = 'vehicle-grid';
    vehicleGrid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
        padding: 10px;
    `;

    // Определяем, что показывать (грузчики, спецтехника или авто)
    const isSpecialTech = document.getElementById('checkbox-special').classList.contains('checked');
    const isLoaders = document.getElementById('checkbox-loaders').classList.contains('checked');
    const itemsToShow = isLoaders ? loaders_params : 
                       isSpecialTech ? special_tech_params : 
                       options_params;

    // Устанавливаем заголовок в зависимости от типа
    modalTitle.textContent = isLoaders ? 'Выбор услуги грузчиков' : 
                          isSpecialTech ? 'Выбор спецтехники' : 
                          'Выбор автомобиля';

    // Собираем структуру модального окна
    modalHeader.appendChild(modalTitle);
    modalContainer.appendChild(modalHeader);
    modalContainer.appendChild(modalContent);
    modalContent.appendChild(vehicleGrid);
    modalContainer.appendChild(closeButton); // Добавляем крестик
    modalOverlay.appendChild(modalContainer);
    document.body.appendChild(modalOverlay);

    // Анимация появления
    setTimeout(() => {
        modalOverlay.style.opacity = '1';
        modalContainer.style.transform = 'translateY(0)';
    }, 10);

    // Закрытие при клике вне модального окна
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeTransportModal(modalOverlay);
        }
    });

    // Адаптация крестика для мобильных устройств
    const checkMobile = () => {
        if (window.innerWidth <= 768) {
            closeButton.style.fontSize = '32px';
            closeButton.style.top = '10px';
            closeButton.style.right = '6px';
            closeButton.style.width = '45px';
            closeButton.style.height = '50px';
        } else {
            closeButton.style.fontSize = '28px';
            closeButton.style.width = '40px';
            closeButton.style.height = '40px';
        }
    };

    // Проверяем сразу и при изменении размера
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Обработчик клавиши Escape
    const handleEscapeKey = (e) => {
        if (e.key === 'Escape') {
            closeTransportModal(modalOverlay);
        }
    };
    document.addEventListener('keydown', handleEscapeKey);

    // Создаем карточки для каждого транспортного средства/услуги
    itemsToShow.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'vehicle-card';
        if (isSpecialTech) card.classList.add('special');
        if (isLoaders) card.classList.add('loaders');
        card.style.cssText = `
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            border: 2px solid transparent;
            cursor: pointer;
            opacity: 0;
            transform: translateY(10px);
            animation: cardEntrance 0.5s ease-out ${index * 0.1 + 0.2}s forwards;
        `;

        // Изображение транспортного средства
        const imageDiv = document.createElement('div');
        imageDiv.style.cssText = `
            width: 100%;
            height: 180px;
            overflow: hidden;
        `;

        const img = document.createElement('img');
        img.className = 'vehicle-image';
        img.src = item.image;
        img.alt = item.title || 'Транспортное средство';
        img.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-bottom: 1px solid #eee;
            transition: transform 0.5s ease;
        `;

        // Детали транспортного средства
        const details = document.createElement('div');
        details.className = 'vehicle-details';
        details.style.cssText = `
            padding: 15px;
        `;

        const title = document.createElement('div');
        title.className = 'vehicle-title';
        title.textContent = item.name || item.title || (isSpecialTech ? 'Спецтехника' : 'Автомобиль');
        title.style.cssText = `
            font-size: 18px;
            font-weight: bold;
            color: #0a1f44;
            margin-bottom: 10px;
            font-family: 'Lobster', cursive;
        `;

        // Параметры транспортного средства
        const params = document.createElement('div');
        params.className = 'vehicle-params';
        params.style.cssText = `
            font-size: 14px;
            color: #555;
            margin-bottom: 10px;
        `;

        // Заполняем параметры в зависимости от типа
        if (isLoaders) {
            const desc = document.createElement('div');
            desc.className = 'vehicle-param';
            desc.innerHTML = `<i class="fas fa-info-circle"></i> ${item.description}`;
            params.appendChild(desc);
            
            if (item.pricePerLoader) {
                const priceParam = document.createElement('div');
                priceParam.className = 'vehicle-param';
                priceParam.innerHTML = `<i class="fas fa-user"></i> ${item.pricePerLoader} руб/чел (без НДС)`;
                params.appendChild(priceParam);
            }
        } else if (isSpecialTech) {
            if (item.showDimensions) {
                const dimensions = document.createElement('div');
                dimensions.className = 'vehicle-param';
                dimensions.innerHTML = `<i class="fas fa-ruler-combined"></i> ${item.length} × ${item.width} × ${item.height}`;
                params.appendChild(dimensions);
            }
            if (item.boom_length) {
                const boom = document.createElement('div');
                boom.className = 'vehicle-param';
                boom.innerHTML = `<i class="fas fa-crane"></i> Стрела: ${item.boom_length} (до ${item.boom_tonnage})`;
                params.appendChild(boom);
            }
            if (item.tonnage) {
                const tonnage = document.createElement('div');
                tonnage.className = 'vehicle-param';
                tonnage.innerHTML = `<i class="fas fa-weight-hanging"></i> Грузоподъемность: ${item.tonnage}`;
                params.appendChild(tonnage);
            }
        } else {
            const dimensions = document.createElement('div');
            dimensions.className = 'vehicle-param';
            dimensions.innerHTML = `<i class="fas fa-ruler-combined"></i> ${item.length} × ${item.width} × ${item.height}`;
            params.appendChild(dimensions);
            
            const tonnage = document.createElement('div');
            tonnage.className = 'vehicle-param';
            tonnage.innerHTML = `<i class="fas fa-weight-hanging"></i> Грузоподъемность: ${item.tonnage}`;
            params.appendChild(tonnage);
            
            const palets = document.createElement('div');
            palets.className = 'vehicle-param';
            palets.innerHTML = `<i class="fas fa-pallet"></i> Паллеты: ${item.palets}`;
            params.appendChild(palets);
        }

        // Цена
        const price = document.createElement('div');
        price.className = 'vehicle-price';
        price.style.cssText = `
            font-size: 18px;
            font-weight: bold;
            color: #1a3e8c;
            margin-top: 10px;
            text-align: right;
        `;

        if (isLoaders && item.id === 202) {
            price.textContent = 'Цена по договоренности';
        } else {
            price.innerHTML = `${item.priceNoVAT} руб <span style="font-size:14px;color:#777;font-weight:normal;display:block;">без НДС</span>`;
        }

        // Собираем карточку
        imageDiv.appendChild(img);
        details.appendChild(title);
        details.appendChild(params);
        details.appendChild(price);
        card.appendChild(imageDiv);
        card.appendChild(details);
        vehicleGrid.appendChild(card);

        // Эффекты при наведении на карточку
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)';
            card.style.borderColor = '#d4af37';
            img.style.transform = 'scale(1.05)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
            card.style.borderColor = 'transparent';
            img.style.transform = 'scale(1)';
        });

        // Обработчик выбора транспортного средства
        card.addEventListener('click', function() {
            // Снимаем выделение с других карточек
            document.querySelectorAll('.vehicle-card').forEach(c => {
                c.classList.remove('selected');
                c.style.borderColor = 'transparent';
            });

            // Выделяем текущую карточку
            this.classList.add('selected');
            this.style.border = '2px solid #d4af37';
            this.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.3)';

            // Добавляем галочку выбора
            const checkmark = document.createElement('div');
            checkmark.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                width: 30px;
                height: 30px;
                background: #d4af37;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                font-weight: bold;
                z-index: 2;
            `;
            checkmark.innerHTML = '✓';
            this.appendChild(checkmark);

            // Плавная прокрутка к выбранной карточке
            setTimeout(() => {
                this.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);

            // Закрываем модальное окно после выбора
            setTimeout(() => {
                selectOption(item);
                closeTransportModal(modalOverlay);
            }, 300);
        });
    });

    // Добавляем стили для анимации появления карточек
    const style = document.createElement('style');
    style.textContent = `
        @keyframes cardEntrance {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    // Добавляем Font Awesome для иконок
    const faLink = document.createElement('link');
    faLink.rel = 'stylesheet';
    faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(faLink);
}


function closeTransportModal(modalOverlay) {
    if (!modalOverlay) return;
    
    const modalContainer = modalOverlay.querySelector('.modal-container');
    
    // Анимация закрытия
    modalOverlay.style.opacity = '0';
    modalContainer.style.transform = 'translateY(20px)';
    
    // Удаляем обработчик клавиши Escape
    document.removeEventListener('keydown', handleEscapeKey);
    
    // Удаляем модальное окно после анимации
    setTimeout(() => {
        if (modalOverlay && modalOverlay.parentNode) {
            modalOverlay.parentNode.removeChild(modalOverlay);
        }
    }, 300);
}

function handleEscapeKey(e) {
    const modalOverlay = document.querySelector('.modal-overlay');
    if (e.key === 'Escape' && modalOverlay) {
        closeTransportModal(modalOverlay);
    }
}

// Анимация появления карточек
const style = document.createElement('style');
style.textContent = `
    @keyframes cardEntrance {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);



let selectedHours = 4; // По умолчанию 4 часа


function selectOption(item) {
    selectedCar = item;
    const isSpecialTech = document.getElementById('checkbox-special').classList.contains('checked');
    const isLoaders = document.getElementById('checkbox-loaders').classList.contains('checked');

    // Скрываем все подсказки при выборе опции
    document.querySelectorAll('.form-hint').forEach(hint => {
        hint.style.display = 'none';
    });
    
    // Получаем элементы для изменения текста
    const carTypeLabel = document.querySelector('.form-group label[for="carType"]');
    const carTypeHint = document.getElementById('carTypeHint');
    
    let paramsHtml = '';
    if (isLoaders) {
        // Для грузчиков меняем текст
        carTypeLabel.textContent = 'Грузчики и такелажные работы:';
        carTypeHint.textContent = 'Пожалуйста, выберите тип услуги';
        
        // Для такелажных работ (id 202) показываем "Цена по договоренности"
        if (item.id === 202) {
            document.getElementById('costNoVAT').innerText = 'Цена по договоренности';
            document.getElementById('costWithVAT').innerText = 'Цена по договоренности';
            // Добавляем класс для скрытия "руб"
            document.getElementById('costNoVAT').classList.add('contract-price');
            document.getElementById('costWithVAT').classList.add('contract-price');
        } else {
            // Для обычных грузчиков (id 201) показываем базовую цену
            document.getElementById('costNoVAT').innerText = item.priceNoVAT || '0';
            document.getElementById('costWithVAT').innerText = item.priceWithVAT || '0';
            // Удаляем класс, если он был
            document.getElementById('costNoVAT').classList.remove('contract-price');
            document.getElementById('costWithVAT').classList.remove('contract-price');
        }

        // Параметры для грузчиков
        paramsHtml = `
            <div style="color:#000; font-family:'Montserrat', sans-serif; font-size:16px;">
                <div><b>${item.title}</b></div>
                <div>${item.description}</div>
                <div><b>${item.id === 202 ? 'Цена:' : 'Цена за человека:'}</b> 
                    ${item.id === 202 ? 'по договоренности' : `${item.priceNoVAT} руб (без НДС)`}
                </div>
            </div>
        `;
        
        // Скрываем ненужные блоки для грузчиков
        document.getElementById('loadingOptions').style.display = 'none';
        document.getElementById('unloadOptions').style.display = 'none';
        document.querySelectorAll('.load-method-label, .unload-method-label').forEach(el => {
            el.style.display = 'none';
        });
        document.getElementById('expeditingService').style.display = 'none';
        document.getElementById('minTimeCar').parentElement.parentElement.style.display = 'none';
        
        // Удаляем старый блок "Брат колян", если он есть
        const oldKolyanContainer = document.getElementById('kolyan-container');
        if (oldKolyanContainer) {
            oldKolyanContainer.remove();
        }
        
        // Создаем блок "Брат колян" только для ID 201 (грузчики)
        if (item.id === 201) {
            const kolyanContainer = document.createElement('div');
            kolyanContainer.id = 'kolyan-container';
            kolyanContainer.style.cssText = `
                margin-top: 15px;
                margin-bottom: 10px;
            `;

            // Переменные для хранения состояния
            let loadersCount = 0;
            let hoursCount = 4; // Начинаем с 4 часов
            const costPerLoaderNoVAT = 4000;
            const costPerLoaderWithVAT = 4800;
            const costPerHourNoVAT = 1000;
            const costPerHourWithVAT = 1200;
            
            // Функция обновления стоимости
            const updateCost = () => {
                // Базовая стоимость за грузчиков
                let baseCostNoVAT = loadersCount * costPerLoaderNoVAT;
                let baseCostWithVAT = loadersCount * costPerLoaderWithVAT;
                
                // Добавляем стоимость за дополнительные часы (каждый час после 4-х)
                if (hoursCount > 4) {
                    const additionalHours = hoursCount - 4;
                    baseCostNoVAT += additionalHours * costPerHourNoVAT;
                    baseCostWithVAT += additionalHours * costPerHourWithVAT;
                }
                
                document.getElementById('costNoVAT').innerText = baseCostNoVAT;
                document.getElementById('costWithVAT').innerText = baseCostWithVAT;
                // Удаляем класс договорной цены, так как это конкретная сумма
                document.getElementById('costNoVAT').classList.remove('contract-price');
                document.getElementById('costWithVAT').classList.remove('contract-price');
            };

            // Первая строка - количество грузчиков
            const brotherRow = document.createElement('div');
            brotherRow.style.cssText = `
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 8px;
            `;

            const brotherText = document.createElement('div');
            brotherText.textContent = 'Количество: ';
            brotherText.style.cssText = `
                font-size: 18px;
                color: #000;
                font-weight: bold;
            `;

            // Счетчик
            const counterBlock = document.createElement('div');
            counterBlock.style.cssText = `
                display: flex;
                align-items: center;
                gap: 5px;
            `;

            // Кнопки +/-
            const minusBtn = document.createElement('button');
            minusBtn.type = 'button';
            minusBtn.className = 'counter-btn';
            minusBtn.textContent = '-';
            minusBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (loadersCount > 0) {
                    loadersCount--;
                    countDisplay.textContent = loadersCount;
                    updateCost();
                    // Скрываем подсказку при изменении количества
                    document.getElementById('loadersCountHint').style.display = 'none';
                }
            });

            const plusBtn = document.createElement('button');
            plusBtn.type = 'button';
            plusBtn.className = 'counter-btn';
            plusBtn.textContent = '+';
            plusBtn.addEventListener('click', (e) => {
                e.preventDefault();
                loadersCount++;
                countDisplay.textContent = loadersCount;
                updateCost();
                // Скрываем подсказку при изменении количества
                document.getElementById('loadersCountHint').style.display = 'none';
            });

            // Эффекты при наведении
            minusBtn.addEventListener('mouseenter', () => {
                minusBtn.style.background = '#000080';
                minusBtn.style.color = 'white';
                minusBtn.style.transform = 'scale(1.1)';
                minusBtn.style.boxShadow = '0 3px 8px rgba(0, 0, 0, 0.2)';
            });

            minusBtn.addEventListener('mouseleave', () => {
                minusBtn.style.background = 'rgba(255, 255, 255, 0.8)';
                minusBtn.style.color = '#000080';
                minusBtn.style.transform = 'scale(1)';
                minusBtn.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
            });

            plusBtn.addEventListener('mouseenter', () => {
                plusBtn.style.background = '#000080';
                plusBtn.style.color = 'white';
                plusBtn.style.transform = 'scale(1.1)';
                plusBtn.style.boxShadow = '0 3px 8px rgba(0, 0, 0, 0.2)';
            });

            plusBtn.addEventListener('mouseleave', () => {
                plusBtn.style.background = 'rgba(255, 255, 255, 0.8)';
                plusBtn.style.color = '#000080';
                plusBtn.style.transform = 'scale(1)';
                plusBtn.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
            });

            const countDisplay = document.createElement('span');
            countDisplay.textContent = loadersCount;
            countDisplay.style.cssText = `
                min-width: 20px;
                text-align: center;
                font-weight: bold;
                color: #000;
            `;

            // Обработчик изменения значения (если используется input)
            countDisplay.addEventListener('input', () => {
                document.getElementById('loadersCountHint').style.display = 'none';
            });

            // Собираем счетчик
            counterBlock.appendChild(minusBtn);
            counterBlock.appendChild(countDisplay);
            counterBlock.appendChild(plusBtn);

            // Собираем первую строку
            brotherRow.appendChild(brotherText);
            brotherRow.appendChild(counterBlock);

            // Подсказка для количества грузчиков
            const loadersHint = document.createElement('div');
            loadersHint.id = 'loadersCountHint';
            loadersHint.className = 'form-hint';
            loadersHint.textContent = 'Пожалуйста, укажите количество грузчиков';
            loadersHint.style.display = 'none';
            loadersHint.style.color = 'red';
            loadersHint.style.marginTop = '5px';
            loadersHint.style.marginBottom = '10px';

            // В функции selectOption при создании блока "Брат колян" добавьте класс:
            const kolyanRow = document.createElement('div');
            kolyanRow.className = 'kolyan-row'; // Добавляем класс
            kolyanRow.style.cssText = `
                display: flex;
                align-items: center;
                gap: 10px;
                margin-top: 10px;
            `;

            const kolyanText = document.createElement('div');
            kolyanText.textContent = 'Время работы: ';
            kolyanText.style.cssText = `
                font-size: 18px;
                color: #000;
                font-weight: bold;
            `;

            // Счетчик часов
            const hoursCounter = document.createElement('div');
            hoursCounter.style.cssText = `
                display: flex;
                align-items: center;
                gap: 5px;
            `;

            // Кнопка минус для часов
            const hoursMinusBtn = document.createElement('button');
            hoursMinusBtn.type = 'button';
            hoursMinusBtn.className = 'counter-btn';
            hoursMinusBtn.textContent = '-';
            hoursMinusBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (hoursCount > 4) { // Минимум 4 часа
                    hoursCount--;
                    hoursDisplay.textContent = hoursCount + ' ч';
                    updateCost();
                }
            });

            // Кнопка плюс для часов
            const hoursPlusBtn = document.createElement('button');
            hoursPlusBtn.type = 'button';
            hoursPlusBtn.className = 'counter-btn';
            hoursPlusBtn.textContent = '+';
            hoursPlusBtn.addEventListener('click', (e) => {
                e.preventDefault();
                hoursCount++;
                hoursDisplay.textContent = hoursCount + ' ч';
                updateCost();
            });

            // Отображение количества часов
            const hoursDisplay = document.createElement('span');
            hoursDisplay.textContent = hoursCount + ' ч';
            hoursDisplay.style.cssText = `
                min-width: 30px;
                text-align: center;
                font-weight: bold;
                color: #000;
            `;

            // Собираем счетчик часов
            hoursCounter.appendChild(hoursMinusBtn);
            hoursCounter.appendChild(hoursDisplay);
            hoursCounter.appendChild(hoursPlusBtn);

            // Информация о стоимости дополнительных часов
            const hoursInfo = document.createElement('div');
            hoursInfo.style.cssText = `
                font-size: 14px;
                color: #555;
                margin-top: 5px;
                font-style: italic;
            `;

            // Собираем вторую строку
            kolyanRow.appendChild(kolyanText);
            kolyanRow.appendChild(hoursCounter);

            // Собираем основной контейнер
            kolyanContainer.appendChild(brotherRow);
            kolyanContainer.appendChild(loadersHint);
            kolyanContainer.appendChild(kolyanRow);
            kolyanContainer.appendChild(hoursInfo);

            // Вставляем после поля выгрузки
            const unloadingContainer = document.querySelector('.form-group:has(#unloadingAddress)');
            unloadingContainer.appendChild(kolyanContainer);

            // Устанавливаем начальную стоимость (0 при loadersCount = 0)
            updateCost();
        }
    } else if (isSpecialTech) {
        // Для спецтехники возвращаем стандартный текст
        carTypeLabel.textContent = 'Тип автомобиля:';
        carTypeHint.textContent = 'Пожалуйста, выберите тип автомобиля';
        
        // Параметры для спецтехники
        paramsHtml = `
            <div style="color:#000; font-family:'Montserrat', sans-serif; font-size:16px;">
                ${item.showDimensions ? `
                    <div><b>Длина:</b> ${item.length}</div>
                    <div><b>Ширина:</b> ${item.width}</div>
                    <div><b>Высота:</b> ${item.height}</div>
                ` : ''}
                ${item.boom_length ? `<div><b>Длина стрелы:</b> ${item.boom_length}</div>` : ''}
                ${item.boom_tonnage ? `<div><b>Тоннаж стрелы:</b> ${item.boom_tonnage}</div>` : ''}
                ${item.tonnage ? `<div><b>Общий тоннаж:</b> ${item.tonnage}</div>` : ''}
            </div>
        `;
        document.getElementById('minTimeCar').parentElement.parentElement.style.display = 'block';
        document.getElementById('costNoVAT').innerText = item.priceNoVAT || '0';
        document.getElementById('costWithVAT').innerText = item.priceWithVAT || '0';
        // Удаляем класс договорной цены, если был
        document.getElementById('costNoVAT').classList.remove('contract-price');
        document.getElementById('costWithVAT').classList.remove('contract-price');
    } else {
        // Для обычных авто стандартный текст
        carTypeLabel.textContent = 'Тип автомобиля:';
        carTypeHint.textContent = 'Пожалуйста, выберите тип автомобиля';
        
        // Параметры для обычных авто
        paramsHtml = `
            <div style="color:#000; font-family:'Montserrat', sans-serif; font-size:16px;">
                <div><b>Длина:</b> ${item.length}</div>
                <div><b>Ширина:</b> ${item.width}</div>
                <div><b>Высота:</b> ${item.height}</div>
                <div><b>Тоннаж:</b> ${item.tonnage}</div>
                <div><b>Евро паллет:</b> ${item.palets}</div>
            </div>
        `;
        document.getElementById('minTimeCar').parentElement.parentElement.style.display = 'block';
        document.getElementById('costNoVAT').innerText = item.priceNoVAT || '0';
        document.getElementById('costWithVAT').innerText = item.priceWithVAT || '0';
        // Удаляем класс договорной цены, если был
        document.getElementById('costNoVAT').classList.remove('contract-price');
        document.getElementById('costWithVAT').classList.remove('contract-price');
    }
    
    document.getElementById('carType').innerHTML = `
        <article class="car-card" tabindex="0">
            <figure class="car-card__image">
                <img src="${item.image}" 
                    alt="Выбранный автомобиль" 
                    loading="lazy"
                    width="120"
                    height="80">
            </figure>
            <div class="car-card__content">
                ${paramsHtml}
            </div>
        </article>
    `;
    
    document.getElementById('carType').style.border = '1px solid #ccc';
    carTypeHint.style.display = 'none';
    document.getElementById('minTimeCar').innerText = item.minTime || '0';
    
    // Включаем/выключаем радио-кнопки в зависимости от типа техники
    const radiosEnabled = !isSpecialTech && !isLoaders;
    document.querySelectorAll('#loadingOptions input[type=radio], #unloadOptions input[type=radio]').forEach(r => {
        r.disabled = !radiosEnabled;
        r.checked = false;
    });
    
    // Скрываем подсказки для спецтехники и грузчиков
    if (isSpecialTech || isLoaders) {
        document.getElementById('loadingMethodHint').style.display = 'none';
        document.getElementById('unloadMethodHint').style.display = 'none';
    }
    
    // Обновляем почасовые ставки
    updateFinalCost();
}

// Добавление дополнительных адресов
let nextIntermediateAddressId = 1;

// Добавляем обработчики для анимации при вводе текста
document.querySelectorAll('.address-input').forEach(input => {
    let typingTimer;
    
    input.addEventListener('focus', function() {
        this.classList.add('typing');
    });
    
    input.addEventListener('blur', function() {
        this.classList.remove('typing');
    });
    
    input.addEventListener('input', function() {
        // Добавляем/удаляем класс typing при активном вводе
        this.classList.add('typing');
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
            this.classList.remove('typing');
        }, 1000);
    });
});


function addAdditionalAddress() {
    // Проверка типа автомобиля
    const carTypeDiv = document.getElementById('carType');
    const carInner = carTypeDiv.innerHTML.trim();
    const isCarSelected = carInner && !carInner.includes('Выбрать');
    
    if (!isCarSelected) {
        carTypeDiv.style.border = '2px solid red';
        document.getElementById('carTypeHint').style.display = 'block';
        carTypeDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        carTypeDiv.style.animation = 'shake 0.5s';
        setTimeout(() => {
            carTypeDiv.style.animation = '';
        }, 500);
        return;
    }

    // Проверяем, выбрана ли спецтехника или грузчики
    const isSpecialTech = document.getElementById('checkbox-special').classList.contains('checked');
    const isLoaders = document.getElementById('checkbox-loaders').classList.contains('checked');
    const showLoadingMethods = !isSpecialTech && !isLoaders;

    const container = document.getElementById('loadingAddressesContainer');
    
    // Создаем основной контейнер
    const addressWrapper = document.createElement('div');
    addressWrapper.className = 'intermediate-address-wrapper';
    addressWrapper.dataset.type = 'intermediate';
    if (isSpecialTech || isLoaders) {
        addressWrapper.style.marginTop = '-10px'; // Меньший отступ для спецтехники/грузчиков
    } else {
        addressWrapper.style.marginTop = '15px'; // Стандартный отступ
    }
    const existingAddresses = document.querySelectorAll('.intermediate-address-wrapper');
    if (existingAddresses.length > 0) {
        addressWrapper.style.marginTop = '10px';  // Добавляем отступ только если уже есть другие адреса
    }
    addressWrapper.style.padding = '0';
    addressWrapper.style.backgroundColor = 'transparent';
    addressWrapper.style.border = 'none';

    // Контейнер для адреса
    const addressItem = document.createElement('div');
    addressItem.className = 'intermediate-address-container';
    addressItem.style.display = 'flex';
    addressItem.style.alignItems = 'center';
    addressItem.style.gap = '10px';

    // Номер адреса
    const addressNumber = document.createElement('span');
    addressNumber.className = 'address-number';
    addressNumber.style.minWidth = '20px';
    addressNumber.style.fontWeight = 'bold';
    addressNumber.style.color = '#0a1f44';

    // Поле ввода адреса
    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'intermediate-input-wrapper';
    inputWrapper.style.flex = '1';
    inputWrapper.style.position = 'relative';

    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.className = 'intermediate-input';
    newInput.placeholder = 'Введите промежуточный адрес';
    newInput.style.width = '100%';
    newInput.style.padding = '12px 40px 12px 15px';
    newInput.style.borderRadius = '6px';
    newInput.style.border = '1px solid #ccc';
    newInput.style.transition = 'all 0.3s';
    
    const currentId = 'intermediateAddress' + nextIntermediateAddressId++;
    newInput.id = currentId;

    const icon = document.createElement('i');
    icon.className = 'fas fa-map-pin intermediate-input-icon';
    icon.style.position = 'absolute';
    icon.style.right = '15px';
    icon.style.top = '50%';
    icon.style.transform = 'translateY(-50%)';
    icon.style.color = '#0a1f44';
    icon.style.transition = 'all 0.3s';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'remove-address-btn';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.title = 'Удалить этот адрес';
    closeBtn.style.marginLeft = '5px';
    closeBtn.style.flexShrink = '0';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.color = '#dc3545';

    // Обработчики событий для поля ввода
    newInput.addEventListener('focus', function() {
        this.classList.add('typing');
        icon.style.color = '#d4af37';
        this.style.borderColor = '#0a1f44';
    });

    // Создаем подсказку для адреса, но не показываем ее сразу
    const addressHint = document.createElement('div');
    addressHint.className = 'form-hint';
    addressHint.style.color = 'red';
    addressHint.style.marginTop = '5px';
    addressHint.style.marginLeft = '38px';
    addressHint.textContent = 'Пожалуйста, введите промежуточный адрес';
    addressHint.style.display = 'none'; // Скрываем по умолчанию

    // Изменяем обработчик blur - убираем проверку на пустое поле
    newInput.addEventListener('blur', function() {
        this.classList.remove('typing');
        icon.style.color = '#0a1f44';
        this.style.borderColor = '#ccc';
        
        // Только обрабатываем адрес, если он введен, но не показываем подсказку
        if (this.value.trim() !== '') {
            processAddress(this.value.trim(), currentId);
        }
    });

    newInput.addEventListener('input', function() {
        this.classList.add('typing');
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
            this.classList.remove('typing');
        }, 1000);

        // Скрываем подсказку при вводе
        const hint = this.closest('.intermediate-address-wrapper').querySelector('.form-hint');
        if (hint && hint.textContent.includes('Пожалуйста, введите промежуточный адрес')) {
            hint.style.display = 'none';
            this.style.borderColor = '#ccc';
        }

        const query = this.value.trim();
        if (query.length > 3) {
            fetch('/suggest_address', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({query: query})
            })
            .then(res => res.json())
            .then(data => {
                showSuggestions(data.suggestions, newInput, currentId);
            });
        }
    });

    let typingTimer;

    closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        addressWrapper.style.transform = 'translateX(20px)';
        addressWrapper.style.opacity = '0';
        
        setTimeout(() => {
            container.removeChild(addressWrapper);
            removePointByDescription(currentId);
            updateAddressNumbers();
            calculateDistanceAndUpdateCost();
        }, 300);
    });

    // Собираем адресную строку
    inputWrapper.appendChild(newInput);
    inputWrapper.appendChild(icon);
    addressItem.appendChild(addressNumber);
    addressItem.appendChild(inputWrapper);
    addressItem.appendChild(closeBtn);
    addressWrapper.appendChild(addressItem);
    addressWrapper.appendChild(addressHint); // Перемещаем подсказку под поле ввода

    // Добавляем блок с выбором способа загрузки (если не спецтехника и не грузчики)
    if (showLoadingMethods) {
        const loadingMethodContainer = document.createElement('div');
        loadingMethodContainer.style.marginTop = '10px';
        loadingMethodContainer.style.width = 'calc(100% - 30px)';
        loadingMethodContainer.style.marginLeft = '30px';
        loadingMethodContainer.style.boxSizing = 'border-box';
        loadingMethodContainer.style.display = 'flex';
        loadingMethodContainer.style.alignItems = 'center';
        loadingMethodContainer.style.flexWrap = 'wrap';
        loadingMethodContainer.style.padding = '10px';

        const methodLabel = document.createElement('label');
        methodLabel.className = 'load-method-label';
        methodLabel.style.marginRight = '15px';
        methodLabel.style.fontFamily = 'Montserrat, Times New Roman, serif';
        methodLabel.style.fontSize = '16px';
        methodLabel.style.whiteSpace = 'nowrap';
        methodLabel.textContent = 'Способ заг/выг:';

        const optionsContainer = document.createElement('div');
        optionsContainer.id = `loadingOptions_${currentId}`;
        optionsContainer.style.display = 'flex';
        optionsContainer.style.gap = '15px';
        optionsContainer.style.alignItems = 'center';
        optionsContainer.style.flexWrap = 'wrap';

        const methods = ['Задняя', 'Боковая', 'Верхняя'];
        methods.forEach(method => {
            const label = document.createElement('label');
            label.className = 'loading-option-label';
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            label.style.cursor = 'pointer';
            label.style.fontFamily = '"Montserrat", "Times New Roman", serif';
            label.style.fontSize = '16px';
            label.style.position = 'relative';
            label.style.whiteSpace = 'nowrap';

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = `loadingMethod_${currentId}`;
            radio.value = method;
            radio.style.display = 'none';
            
            radio.onchange = function() { 
                selectLoadingOption(method, currentId); // Передаем ID адреса
                // Скрываем подсказку при выборе способа
                const hint = this.closest('.intermediate-address-wrapper').querySelector('.form-hint');
                if (hint && hint.textContent.includes('Выберите способ загрузки')) {
                    hint.style.display = 'none';
                }
                
                // Удаляем красные бортики у контейнера с опциями
                const optionsContainer = this.closest('.intermediate-address-wrapper')
                                        .querySelector('#loadingOptions_' + currentId);
                if (optionsContainer) {
                    optionsContainer.style.border = 'none';
                    optionsContainer.style.padding = '0';
                    optionsContainer.style.borderRadius = '0';
                }
            };
            
            const customRadio = document.createElement('span');
            customRadio.className = 'custom-radio';
            customRadio.style.width = '20px';
            customRadio.style.height = '20px';
            customRadio.style.border = '2px solid #0a1f44';
            customRadio.style.borderRadius = '4px';
            customRadio.style.marginRight = '10px';
            customRadio.style.display = 'flex';
            customRadio.style.alignItems = 'center';
            customRadio.style.justifyContent = 'center';
            customRadio.style.position = 'relative';
            customRadio.style.transition = 'all 0.2s ease';
            
            const checkmark = document.createElement('span');
            checkmark.className = 'checkmark';
            checkmark.style.display = 'none';
            checkmark.style.color = '#d4af37';
            checkmark.style.fontSize = '14px';
            checkmark.style.fontWeight = 'bold';
            checkmark.textContent = '✓';
            
            customRadio.appendChild(checkmark);
            
            label.addEventListener('mouseenter', function() {
                customRadio.style.transform = 'scale(1.1)';
                customRadio.style.boxShadow = '0 0 5px rgba(0,0,0,0.2)';
            });
            
            label.addEventListener('mouseleave', function() {
                if (!radio.checked) {
                    customRadio.style.transform = '';
                    customRadio.style.boxShadow = '';
                }
            });
            
            label.appendChild(radio);
            label.appendChild(customRadio);
            label.appendChild(document.createTextNode(method));
            
            radio.addEventListener('change', function() {
                document.querySelectorAll(`#loadingOptions_${currentId} .custom-radio .checkmark`).forEach(el => {
                    el.style.display = 'none';
                });
                
                document.querySelectorAll(`#loadingOptions_${currentId} .custom-radio`).forEach(el => {
                    el.style.transform = '';
                    el.style.boxShadow = '';
                });
                
                if (this.checked) {
                    this.nextElementSibling.querySelector('.checkmark').style.display = 'block';
                    this.nextElementSibling.style.transform = 'scale(1.1)';
                    this.nextElementSibling.style.boxShadow = '0 0 5px rgba(0,0,0,0.2)';
                }
            });
            
            optionsContainer.appendChild(label);
        });

        const hint = document.createElement('div');
        hint.id = `loadingMethodHint_${currentId}`;
        hint.className = 'form-hint';
        hint.style.marginLeft = '15px';
        hint.style.color = '#dc3545';
        hint.style.whiteSpace = 'nowrap';
        hint.textContent = 'Вы не выбрали способ загрузки';
        hint.style.display = 'none'; // Скрываем по умолчанию

        loadingMethodContainer.appendChild(methodLabel);
        loadingMethodContainer.appendChild(optionsContainer);
        loadingMethodContainer.appendChild(hint);

        addressWrapper.appendChild(loadingMethodContainer);
    }

    // Вставляем перед кнопкой "Добавить адрес"
    const addButton = container.querySelector('.add-address-btn');
    container.insertBefore(addressWrapper, addButton);

    updateAddressNumbers();
    
    setTimeout(() => {
        newInput.focus();
    }, 10);
}








// Функция для обновления нумерации адресов
function updateAddressNumbers() {
    const addressContainers = document.querySelectorAll('.intermediate-address-container');
    addressContainers.forEach((container, index) => {
        const numberSpan = container.querySelector('.address-number');
        if (numberSpan) {
            numberSpan.textContent = (index + 1) + '.';
        }
    });
}





function removePointByDescription(description) {
    const index = mapPoints.findIndex(p => p.description === description);
    if (index !== -1) {
        mapPoints.splice(index, 1);
        updateMapPoints();
        calculateDistanceAndUpdateCost();
    }
    // Обновляем нумерацию после удаления
    updateAddressNumbers();
}



function selectLoadingOption(method, addressId = null) {
    // Если это дополнительный адрес
    if (addressId) {
        const radioBtn = document.querySelector(`#loadingOptions_${addressId} input[value="${method}"]`);
        if (!checkCarSelectedBeforeAction(radioBtn.parentElement)) {
            radioBtn.checked = false;
            return;
        }
        
        // Находим соответствующий дополнительный адрес
        const addressWrapper = document.getElementById(addressId).closest('.intermediate-address-wrapper');
        if (addressWrapper) {
            // Сохраняем выбранный метод в dataset
            addressWrapper.dataset.loadingMethod = method;
            
            // Обновляем визуальное отображение выбора
            document.querySelectorAll(`#loadingOptions_${addressId} .custom-radio .checkmark`).forEach(el => {
                el.style.display = 'none';
            });
            
            document.querySelectorAll(`#loadingOptions_${addressId} .custom-radio`).forEach(el => {
                el.style.transform = '';
                el.style.boxShadow = '';
            });
            
            if (radioBtn.checked) {
                radioBtn.nextElementSibling.querySelector('.checkmark').style.display = 'block';
                radioBtn.nextElementSibling.style.transform = 'scale(1.1)';
                radioBtn.nextElementSibling.style.boxShadow = '0 0 5px rgba(0,0,0,0.2)';
            }
            
            // Скрываем подсказку
            const hint = addressWrapper.querySelector(`#loadingMethodHint_${addressId}`);
            if (hint) hint.style.display = 'none';
        }
    } 
    // Если это основной адрес загрузки
    else {
        const radioBtn = document.querySelector(`#loadingOptions input[value="${method}"]`);
        if (!checkCarSelectedBeforeAction(radioBtn.parentElement)) {
            radioBtn.checked = false;
            return;
        }
        
        if (selectedCar && selectedCar.loadingPrices) {
            selectedLoadingPrice = selectedCar.loadingPrices[method] || 0;
        } else {
            selectedLoadingPrice = 0;
        }
        document.getElementById('loadingMethodHint').style.display = 'none';
    }
    
    updateFinalCost();
}

function selectUnloadOption(method, addressId = null) {
    // Если это дополнительный адрес (если у вас есть выгрузка для доп. адресов)
    if (addressId) {
        // Аналогично selectLoadingOption, если нужно
    } 
    // Основной адрес выгрузки
    else {
        const radioBtn = document.querySelector(`#unloadOptions input[value="${method}"]`);
        if (!checkCarSelectedBeforeAction(radioBtn.parentElement)) {
            radioBtn.checked = false;
            return;
        }
        
        if (selectedCar && selectedCar.unloadingPrices) {
            selectedUnloadingPrice = selectedCar.unloadingPrices[method] || 0;
        } else {
            selectedUnloadingPrice = 0;
        }
        document.getElementById('unloadMethodHint').style.display = 'none';
    }
    
    updateFinalCost();
}


// Общая функция для проверки выбора машины и анимации
function checkCarSelectedBeforeAction(element) {
    const carInner = document.getElementById('carType').innerHTML.trim();
    const isCarSelected = carInner && !carInner.includes('Выбрать');
    
    if (!isCarSelected) {
        // Подсвечиваем поле выбора машины
        const carTypeDiv = document.getElementById('carType');
        carTypeDiv.style.border = '2px solid red';
        document.getElementById('carTypeHint').style.display = 'block';
        
        // Анимация тряски для поля выбора машины
        carTypeDiv.style.animation = 'shake 0.5s';
        
        // Анимация тряски для целевого элемента
        if (element) {
            element.style.animation = 'shake 0.5s';
            
            // Сбрасываем анимацию через 0.5 секунды
            setTimeout(() => {
                element.style.animation = '';
                carTypeDiv.style.animation = '';
            }, 500);
        }
        
        // Прокручиваем к полю выбора машины
        carTypeDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
    }
    return true;
}





// Обработчики галочек и кнопок

function toggleExpeditingCheckbox() {
    // Проверяем, не выбрана ли спецтехника
    const isSpecialTech = document.getElementById('checkbox-special').classList.contains('checked');
    if (isSpecialTech) return; // Не даем выбрать для спецтехники
    
    if (!selectedCar) {
        const carTypeDiv = document.getElementById('carType');
        carTypeDiv.style.border = '2px solid red';
        document.getElementById('carTypeHint').style.display = 'block';
        
        // Тряска прямоугольника
        carTypeDiv.style.animation = 'shake 0.5s';
        
        // Тряска чекбокса
        const expeditingCheckbox = document.getElementById('expeditingCheckbox');
        expeditingCheckbox.style.animation = 'shake 0.5s';
        
        setTimeout(() => {
            carTypeDiv.style.animation = '';
            expeditingCheckbox.style.animation = '';
        }, 500);
        
        carTypeDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    
    const checkmark = document.getElementById('expeditingCheckmark');
    checkmark.style.display = (checkmark.style.display === 'none' || checkmark.style.display === '') ? 'block' : 'none';
    
    
    // Обновляем стоимость
    updateFinalCost();
}


function toggleInsuranceCheckbox() {
    if (!selectedCar) {
        const carTypeDiv = document.getElementById('carType');
        carTypeDiv.style.border = '2px solid red';
        document.getElementById('carTypeHint').style.display = 'block';
        
        carTypeDiv.style.animation = 'shake 0.5s';
        const insuranceCheckbox = document.getElementById('insuranceCheckbox');
        insuranceCheckbox.style.animation = 'shake 0.5s';
        
        setTimeout(() => {
            carTypeDiv.style.animation = '';
            insuranceCheckbox.style.animation = '';
        }, 500);
        
        carTypeDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    
    const checkmark = document.getElementById('insuranceCheckmark');
    const insuranceText = document.getElementById('insuranceText');
    const isLoaders = document.getElementById('checkbox-loaders').classList.contains('checked');
    const isLoaderCar = isLoaders && (selectedCar.id === 201 || selectedCar.id === 202);
    
    if (checkmark.style.display === 'none' || checkmark.style.display === '') {
        checkmark.style.display = 'block';
        
        if (isLoaderCar) {
            // Для грузчиков - находим контейнер с ценами
            const pricesContainer = document.querySelector('div[style*="display: flex; justify-content: flex-start; gap: 10px; margin-left: 80px; margin-top: -21.5px; align-items: center;"]');
            
            if (pricesContainer) {
                // Создаем контейнер для текста страховки
                let loaderInsuranceContainer = document.getElementById('loaderInsuranceContainer');
                if (!loaderInsuranceContainer) {
                    loaderInsuranceContainer = document.createElement('div');
                    loaderInsuranceContainer.id = 'loaderInsuranceContainer';
                    loaderInsuranceContainer.style.cssText = `
                        margin-left: 0px;
                        margin-top: 5px;
                    `;
                    
                    // Вставляем после контейнера с ценами
                    pricesContainer.parentNode.insertBefore(loaderInsuranceContainer, pricesContainer.nextSibling);
                }
                
                // Создаем/обновляем текст
                let loaderInsuranceText = document.getElementById('loaderInsuranceText');
                if (!loaderInsuranceText) {
                    loaderInsuranceText = document.createElement('div');
                    loaderInsuranceText.id = 'loaderInsuranceText';
                    loaderInsuranceText.style.cssText = `
                        font-size: 14px;
                        color: red;
                    `;
                    loaderInsuranceContainer.appendChild(loaderInsuranceText);
                }
                
                loaderInsuranceText.textContent = 'Страхование груза по согласованию с менеджером';
                loaderInsuranceText.style.display = 'block';
            }
            // Скрываем стандартный текст о страховке
            if (insuranceText) insuranceText.style.display = 'none';
        } else {
            // Для не-грузчиков показываем стандартный текст
            if (insuranceText) insuranceText.style.display = 'block';
        }
    } else {
        checkmark.style.display = 'none';
        // Скрываем оба варианта текста о страховке
        if (insuranceText) insuranceText.style.display = 'none';
        const loaderInsuranceText = document.getElementById('loaderInsuranceText');
        if (loaderInsuranceText) loaderInsuranceText.style.display = 'none';
    }
    
    // Обновляем итоговую стоимость
    updateFinalCost();
}



// Глобальная переменная для хранения расстояния
let totalDistanceKm = 0;
let distanceCost = 0;

function calculateDistanceAndUpdateCost() {
    const isLoaders = document.getElementById('checkbox-loaders').classList.contains('checked');
    
    // Если выбраны грузчики, не пересчитываем стоимость
    if (isLoaders) {
        return;
    }
    
    if (mapPoints.length < 2) {
        totalDistanceKm = 0;
        distanceCost = 0;
        updateFinalCost();
        return;
    }
    
    // Рассчитываем расстояние
    totalDistanceKm = calculateTotalDistance(mapPoints);
    
    // Применяем коэффициенты
    if (mapPoints.length === 2) {
        totalDistanceKm *= coefficient_for_two_points;
    } else if (mapPoints.length > 2) {
        totalDistanceKm *= coefficient_for_multiple_points;
    }
    
    // Рассчитываем стоимость на основе расстояния
    if (selectedCar) {
        distanceCost = totalDistanceKm * selectedCar.pricePerKm;
    } else {
        distanceCost = 0;
    }
    
    // Обновляем итоговую стоимость
    updateFinalCost();
}



function updateFinalCost() {
    // Проверяем, выбраны ли грузчики
    const isLoaders = document.getElementById('checkbox-loaders').classList.contains('checked');
    const isSpecialTech = document.getElementById('checkbox-special').classList.contains('checked');
    
    // Проверяем, является ли цена договорной (для такелажных работ)
    const isContractPrice = document.getElementById('costNoVAT').classList.contains('contract-price');
    
    // Если выбраны грузчики, используем их расчет стоимости
    if (isLoaders) {
        // Для грузчиков стоимость уже рассчитывается в других функциях
        return;
    }
    
    // Если не выбран автомобиль, устанавливаем нули
    if (!selectedCar) {
        document.getElementById('costNoVAT').innerText = '0';
        document.getElementById('costWithVAT').innerText = '0';
        return;
    }
    
    // Рассчитываем дополнительные часы:
    let additionalHours;
    if (selectedCar.id <= 4) {
        // Для первых 4 автомобилей (id 1-4) минимальное время 4 часа
        additionalHours = Math.max(0, (selectedCar.minTime || 4) - 4);
    } else if (selectedCar.id <= 12 || (selectedCar.id >= 101 && selectedCar.id <= 106)) {
        // Для остальных автомобилей (id 5-12) и спецтехники (id 101-106) минимальное время 6 часов
        additionalHours = Math.max(0, (selectedCar.minTime || 6) - 6);
    } else {
        // Для грузчиков (id 201-202) минимальное время 1 час
        additionalHours = (selectedCar.minTime || 1) - 1;
    }
    
    // Базовые стоимости
    const baseNoVAT = selectedCar.priceNoVAT || 0;
    const baseWithVAT = selectedCar.priceWithVAT || 0;
    
    // Почасовые ставки
    const hourlyNoVAT = selectedCar.hourlyRateNoVAT || 0;
    const hourlyWithVAT = selectedCar.hourlyRateWithVAT || 0;
    
    // Получаем выбранные способы загрузки/выгрузки для основного адреса
    const loadingMethod = document.querySelector('#loadingOptions input[type=radio]:checked')?.value;
    const unloadingMethod = document.querySelector('#unloadOptions input[type=radio]:checked')?.value;
    
    // Стоимость погрузки/разгрузки для основного адреса
    const loadingCostNoVAT = loadingMethod && selectedCar.loadingPrices?.noVAT?.[loadingMethod] || 0;
    const loadingCostWithVAT = loadingMethod && selectedCar.loadingPrices?.withVAT?.[loadingMethod] || 0;
    const unloadingCostNoVAT = unloadingMethod && selectedCar.unloadingPrices?.noVAT?.[unloadingMethod] || 0;
    const unloadingCostWithVAT = unloadingMethod && selectedCar.unloadingPrices?.withVAT?.[unloadingMethod] || 0;
    
    // Стоимость погрузки для дополнительных адресов
    let additionalLoadingCostNoVAT = 0;
    let additionalLoadingCostWithVAT = 0;
    
    document.querySelectorAll('.intermediate-address-wrapper').forEach(wrapper => {
        const method = wrapper.dataset.loadingMethod;
        if (method && selectedCar.loadingPrices) {
            additionalLoadingCostNoVAT += selectedCar.loadingPrices.noVAT?.[method] || 0;
            additionalLoadingCostWithVAT += selectedCar.loadingPrices.withVAT?.[method] || 0;
        }
    });

    // Стоимость экспедирования (если выбрано)
    const expeditingChecked = document.getElementById('expeditingCheckmark').style.display === 'block';
    const expeditingCostNoVAT = expeditingChecked ? hourlyNoVAT : 0;
    const expeditingCostWithVAT = expeditingChecked ? hourlyWithVAT : 0;
    
    // Рассчитываем итоговую стоимость
    const totalNoVAT = Math.ceil(
        baseNoVAT + 
        (additionalHours * hourlyNoVAT) + 
        loadingCostNoVAT + 
        unloadingCostNoVAT +
        additionalLoadingCostNoVAT + // Добавляем стоимость загрузки для доп. адресов
        distanceCost +
        expeditingCostNoVAT
    );
    
    const totalWithVAT = Math.ceil(
        baseWithVAT + 
        (additionalHours * hourlyWithVAT) + 
        loadingCostWithVAT + 
        unloadingCostWithVAT +
        additionalLoadingCostWithVAT + // Добавляем стоимость загрузки для доп. адресов
        (distanceCost * 1.2) +
        expeditingCostWithVAT
    );
    
    // Обновляем отображение стоимости
    document.getElementById('costNoVAT').innerText = isContractPrice ? 'Цена по договоренности' : totalNoVAT;
    document.getElementById('costWithVAT').innerText = isContractPrice ? 'Цена по договоренности' : totalWithVAT;
    
    // Обновляем минимальное время
    document.getElementById('minTimeCar').innerText = selectedCar.minTime || (isSpecialTech ? 6 : 4);
}












// Добавляем обработчики событий для автоматического скрытия подсказок
document.addEventListener('DOMContentLoaded', function() {
    // Обработчик для выбора типа машины
    const carTypeElement = document.getElementById('carType');
    if (carTypeElement) {
        carTypeElement.addEventListener('click', function() {
            // Скрываем подсказку при клике на выбор машины
            document.getElementById('carTypeHint').style.display = 'none';
            this.style.borderColor = '#ccc';
        });
    }
    
    // Обработчики для чекбоксов услуг
    const specialCheckbox = document.getElementById('checkbox-special');
    const loadersCheckbox = document.getElementById('checkbox-loaders');
    
    if (specialCheckbox) {
        specialCheckbox.addEventListener('click', function() {
            // При выборе/отмене спецтехники скрываем подсказки способов загрузки
            document.getElementById('loadingMethodHint').style.display = 'none';
            document.getElementById('unloadMethodHint').style.display = 'none';
            document.querySelector('#loadingOptions').style.borderColor = 'transparent';
            document.querySelector('#unloadOptions').style.borderColor = 'transparent';
        });
    }
    
    if (loadersCheckbox) {
        loadersCheckbox.addEventListener('click', function() {
            // При выборе/отмене грузчиков скрываем подсказки способов загрузки
            document.getElementById('loadingMethodHint').style.display = 'none';
            document.getElementById('unloadMethodHint').style.display = 'none';
            document.querySelector('#loadingOptions').style.borderColor = 'transparent';
            document.querySelector('#unloadOptions').style.borderColor = 'transparent';
        });
    }
    
    // Обработчик для ввода типа груза
    const cargoInput = document.getElementById('cargoType');
    if (cargoInput) {
        cargoInput.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                const hint = document.getElementById('cargoTypeHint');
                if (hint) hint.style.display = 'none';
                this.style.borderColor = '#ccc';
            }
        });
    }
    
    // Обработчики для адресов загрузки
    const loadingInputs = document.querySelectorAll('#loadingAddressesContainer input[type=text]');
    loadingInputs.forEach(input => {
        input.addEventListener('input', function() {
            const anyFilled = Array.from(loadingInputs).some(inp => inp.value.trim() !== '');
            if (anyFilled) {
                document.getElementById('loadingAddressHint').style.display = 'none';
                loadingInputs.forEach(inp => inp.style.borderColor = '#ccc');
            }
        });
    });
    
    // Обработчик для адреса выгрузки
    const unloadingInput = document.getElementById('unloadingAddress');
    if (unloadingInput) {
        unloadingInput.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                document.getElementById('unloadingAddressHint').style.display = 'none';
                this.style.borderColor = '#ccc';
            }
        });
    }
    
    // Обработчики для способов загрузки/выгрузки
    const loadingRadios = document.querySelectorAll('#loadingOptions input[type=radio]');
    loadingRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('loadingMethodHint').style.display = 'none';
            document.querySelector('#loadingOptions').style.borderColor = 'transparent';
        });
    });
    
    const unloadingRadios = document.querySelectorAll('#unloadOptions input[type=radio]');
    unloadingRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('unloadMethodHint').style.display = 'none';
            document.querySelector('#unloadOptions').style.borderColor = 'transparent';
        });
    });
});





// Кнопки
const phoneInput = document.getElementById('phone');
if (phoneInput) {
  phoneInput.addEventListener('input', () => {
    let value = phoneInput.value;
    if (!value.startsWith('+')) {
      value = '+' + value.replace(/\D/g, '');
    } else {
      value = '+' + value.slice(1).replace(/\D/g, '');
    }
    if (value.length > 12) {
      value = value.slice(0, 12);
    }
    phoneInput.value = value;
  });
}



// Инициализация карты
// Объявляем функцию для инициализации карты
function initMap() {
  ymaps.ready(function() {
    myMap = new ymaps.Map("map", {
      center: [55.7558, 37.6173],
      zoom: 10
    }, {
      suppressMapOpenBlock: true,
      yandexMapDisablePoiInteractivity: true
    });
    
    // Принудительное обновление размеров
    setTimeout(() => {
      myMap.container.fitToViewport();
    }, 100);
  });
}

window.addEventListener('resize', () => {
  if (myMap) {
    myMap.container.fitToViewport();
  }
});






function addPointToMapMultiple(lat, lon, description) {
    // Добавляем в массив
    mapPoints.push({lat, lon, description});

    // Удаляем все текущие метки
    myMap.geoObjects.removeAll();

    // Перебираем все точки и добавляем их заново с нумерацией
    mapPoints.forEach((point, index) => {
        const pointNumber = index + 1; // нумерация с 1
        const placemark = new ymaps.Placemark([point.lat, point.lon], {
            balloonContent: `${pointNumber}. ${point.description}`,
            iconContent: pointNumber // отображение номера внутри иконки
        }, {
            // Можно настроить стиль метки
            preset: 'twirl#blueStretchyIcon',
            iconContent: pointNumber
        });
        myMap.geoObjects.add(placemark);
    });

    // Центрируем карту на последней добавленной точке
    if (lat && lon) {
        myMap.setCenter([lat, lon], 12);
    }
}

// Функция для добавления точки на карту
function addPointToMap(lat, lon, description) {
    // Добавляем новую точку
    const pointId = 'intermediate_' + description; // или уникальный id
    // Можно хранить описание и координаты
    intermediatePoints.push({lat, lon, description});

    // Перерисовываем все точки
    updateMapPoints();
}

// AJAX-запрос к DaData
function getCoordinates(address, callback, inputElementId) {
    fetch('/geocode', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({address: address})
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.latitude && data.longitude) {
            callback(data.latitude, data.longitude);
            
            // Скрываем подсказку об ошибке, если она была показана
            const hint = document.getElementById(`${inputElementId}-error`);
            if (hint) {
                hint.style.display = 'none';
            }
        } else {
            // Показываем подсказку под соответствующим полем ввода
            showAddressError(inputElementId, 'Координаты не найдены для этого адреса');
        }
    })
    .catch(error => {
        console.error('Ошибка при запросе геоданных:', error);
        showAddressError(inputElementId, 'Ошибка при получении координат для этого адреса');
    });
}

function showAddressError(inputElementId, message) {
    // Находим поле ввода по ID
    const inputElement = document.getElementById(inputElementId);
    if (!inputElement) return;
    
    // Проверяем, есть ли уже подсказка об ошибке
    let errorHint = document.getElementById(`${inputElementId}-error`);
    
    if (!errorHint) {
        // Создаем элемент для подсказки об ошибке
        errorHint = document.createElement('div');
        errorHint.id = `${inputElementId}-error`;
        errorHint.className = 'form-hint';
        errorHint.style.color = 'red';
        errorHint.style.marginTop = '5px';
        
        // Вставляем подсказку после поля ввода
        inputElement.parentNode.insertBefore(errorHint, inputElement.nextSibling);
    }
    
    // Устанавливаем текст и показываем подсказку
    errorHint.textContent = message;
    errorHint.style.display = 'block';
    
    // Подсвечиваем поле ввода красным
    inputElement.style.borderColor = 'red';
    
    // Прокручиваем к полю с ошибкой
    inputElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
}




// Обработка ввода адреса
function processAddress(address, description, isUnloading = false) {
    // Проверяем, что адрес не пустой
    if (!address || address.trim() === '') return;

    // Определяем ID поля ввода
    let inputId;
    if (isUnloading) {
        inputId = 'unloadingAddress';
    } else if (description.includes('intermediate')) {
        inputId = description; // для промежуточных адресов description уже содержит ID
    } else {
        inputId = 'loadingAddress';
    }

    // Получаем координаты адреса, передавая ID поля ввода
    getCoordinates(address, (lat, lon) => {
        if (isUnloading) {
            // Обработка адреса выгрузки
            unloadingAddressData = { lat, lon, description: 'unloading', address };
            document.getElementById('unloadingAddress').value = address;

            // Удаляем старую точку выгрузки, если она есть
            const existingIndex = mapPoints.findIndex(p => p.description === 'unloading');
            if (existingIndex !== -1) {
                mapPoints.splice(existingIndex, 1);
            }

            // Всегда добавляем точку выгрузки в конец массива
            mapPoints.push(unloadingAddressData);
        } else {
            // Обработка адресов загрузки и промежуточных адресов
            const existingIndex = mapPoints.findIndex(p => p.description === description);
            
            if (existingIndex !== -1) {
                // Обновляем существующую точку
                mapPoints[existingIndex] = { lat, lon, description, address };
            } else {
                // Для промежуточных адресов сохраняем их порядок
                if (description.includes('intermediate')) {
                    const id = parseInt(description.replace('intermediate', ''));
                    let insertIndex = mapPoints.findIndex(p => 
                        p.description.includes('intermediate') && 
                        parseInt(p.description.replace('intermediate', '')) > id
                    );
                    
                    // Если не нашли место для вставки, добавляем перед точкой выгрузки
                    // или в конец, если точки выгрузки нет
                    if (insertIndex === -1) {
                        const unloadingIndex = mapPoints.findIndex(p => p.description === 'unloading');
                        insertIndex = unloadingIndex !== -1 ? unloadingIndex : mapPoints.length;
                    }
                    
                    mapPoints.splice(insertIndex, 0, { lat, lon, description, address });
                } else {
                    // Адрес загрузки добавляем в начало
                    mapPoints.unshift({ lat, lon, description, address });
                }
            }
        }

        // Обновляем карту и пересчитываем стоимость
        updateMapPoints();
        calculateDistanceAndUpdateCost();
    }, inputId); // Передаем ID поля ввода
}


function updateMapPoints() {
    if (!myMap) return;
    
    // Удаляем все текущие метки с карты
    myMap.geoObjects.removeAll();
    
    // Фильтруем точки, чтобы отделить выгрузку от остальных
    const regularPoints = mapPoints.filter(p => p.description !== 'unloading');
    const unloadingPoint = mapPoints.find(p => p.description === 'unloading');
    
    // Добавляем обычные точки с последовательной нумерацией
    regularPoints.forEach((point, index) => {
        const placemark = new ymaps.Placemark([point.lat, point.lon], {
            balloonContent: `${index + 1}. ${point.description || point.address}`,
            iconContent: index + 1  // Нумерация с 1
        }, {
            preset: 'twirl#blueStretchyIcon',
            iconColor: '#1a3e8c'
        });
        myMap.geoObjects.add(placemark);
    });
    
    // Добавляем точку выгрузки последней с максимальным номером
    if (unloadingPoint) {
        const unloadingNumber = regularPoints.length + 1;  // Следующий номер после последней обычной точки
        const placemark = new ymaps.Placemark([unloadingPoint.lat, unloadingPoint.lon], {
            balloonContent: `${unloadingNumber}. ${unloadingPoint.address}`,
            iconContent: unloadingNumber  // Последний номер
        }, {
            preset: 'twirl#redStretchyIcon',
            iconColor: '#ff0000'
        });
        myMap.geoObjects.add(placemark);
    }
    
    // Автоматически масштабируем карту чтобы были видны все точки
    if (mapPoints.length > 0) {
        myMap.setBounds(myMap.geoObjects.getBounds(), {
            checkZoomRange: true,
            zoomMargin: 50
        });
    }
}

function setupAddressFields() {
    // Удаляем старые обработчики (если они есть)
    const oldAddBtn = document.querySelector('.add-address-btn');
    if (oldAddBtn) {
        const newAddBtn = oldAddBtn.cloneNode(true); // Клонируем кнопку без обработчиков
        oldAddBtn.parentNode.replaceChild(newAddBtn, oldAddBtn);
    }

    // Обработчик для основного адреса загрузки
    const loadingInput = document.querySelector('#loadingAddressesContainer input[type=text]');
    if (loadingInput) {
        loadingInput.addEventListener('focus', function() {
            if (!checkCarSelectedBeforeAction(this)) {
                this.blur();
            }
        });
        
        loadingInput.addEventListener('blur', function() {
            if (selectedCar && this.value.trim() !== '') {
                processAddress(this.value, 'Загрузка');
            }
        });
    }

    // Обработчик для адреса выгрузки
    const unloadingInput = document.getElementById('unloadingAddress');
    if (unloadingInput) {
        unloadingInput.addEventListener('focus', function() {
            if (!checkCarSelectedBeforeAction(this)) {
                this.blur();
            }
        });
        
        unloadingInput.addEventListener('blur', function() {
            if (selectedCar && this.value.trim() !== '') {
                processAddress(this.value, 'Выгрузка', true);
            }
        });
    }

    // Обработчик для кнопки добавления адреса (только один раз!)
    const addAddressBtn = document.querySelector('.add-address-btn');
    if (addAddressBtn && !addAddressBtn.dataset.listenerAdded) {
        addAddressBtn.addEventListener('click', function(e) {
            const container = document.getElementById('loadingAddressesContainer');
            if (!checkCarSelectedBeforeAction(container)) {
                e.preventDefault();
                return false;
            }
            addAdditionalAddress();
        });

        // Помечаем, что обработчик уже добавлен
        addAddressBtn.dataset.listenerAdded = 'true';
    }
}


function increaseMinTime() {
    if (selectedCar) {
        selectedCar.minTime = (selectedCar.minTime || 0) + 1;
        document.getElementById('minTimeCar').innerText = selectedCar.minTime;
        updateFinalCost(); // Используем общую функцию пересчёта
    }
}

function decreaseMinTime() {
    if (selectedCar) {
        // Определяем минимально допустимое время:
        // - 4 часа для первых 4 автомобилей (id 1-4)
        // - 6 часов для остальных автомобилей (id 5-12) и спецтехники (id 101-106)
        // - 1 час для грузчиков (id 201-202)
        let minAllowedTime;
        if (selectedCar.id <= 4) {
            minAllowedTime = 4;
        } else if (selectedCar.id <= 12 || (selectedCar.id >= 101 && selectedCar.id <= 106)) {
            minAllowedTime = 6;
        } else {
            minAllowedTime = 1; // Для грузчиков
        }
        
        if (selectedCar.minTime > minAllowedTime) {
            selectedCar.minTime -= 1;
            document.getElementById('minTimeCar').innerText = selectedCar.minTime;
            updateFinalCost();
        }
    }
}



// Функция для вычисления общего расстояния между точками
// Ваша функция:
function calculateTotalDistance(points) {
    function haversine(lat1, lon1, lat2, lon2) {
        const R = 6371; // радиус Земли в км
        const toRad = (value) => (value * Math.PI) / 180;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) ** 2 +
                  Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                  Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    let total = 0;
    for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        total += haversine(p1.lat, p1.lon, p2.lat, p2.lon);
    }
    return total;
}

// Обработчик кнопки
const coefficient_for_two_points = 1.15; // коэффициент для 2 точек
const coefficient_for_multiple_points = 1.20; // коэффициент для >2 точек



// Вызовем после инициализации
window.addEventListener('load', () => {
    setupAddressFields();
});


// Обработчик загрузки
window.addEventListener('load', () => {
    // Устанавливаем нули при загрузке
    document.getElementById('costNoVAT').innerText = '0';
    document.getElementById('costWithVAT').innerText = '0';
    
    // Остальная инициализация...
    setupAddressFields();
    initMap();
    
    // Обработчики для галереи "Нам доверяют"
    document.querySelectorAll('#trust-gallery img').forEach(img => {
        img.addEventListener('click', () => showTrustImageInModal(img.src));
    });
    
    document.getElementById('carType').addEventListener('click', openModal);
    
    document.querySelectorAll('#loadingOptions input[type=radio]').forEach(r => {
        r.addEventListener('change', () => selectLoadingOption(r.value));
    });
    
    document.querySelectorAll('#unloadOptions input[type=radio]').forEach(r => {
        r.addEventListener('change', () => selectUnloadOption(r.value));
    });
});


// Функция для показа изображений из раздела "Нам доверяют"
function showTrustImageInModal(src) {
  const modal = document.getElementById('modal');
  const container = document.getElementById('cardsContainer');
  
  container.innerHTML = `
    <div class="trust-modal-content" style="text-align: center; position: relative;">
      <img src="${src}" style="max-width: 100%; max-height: 70vh; border-radius: 8px; display: block; margin: 0 auto;">
      <div style="margin-top: 15px;">
        <button onclick="closeModal()" style="padding: 10px 25px; background: #1a3e8c; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">Закрыть</button>
      </div>
    </div>
  `;
  
  modal.style.display = 'flex';
  
  // Добавляем обработчик клика по модальному окну
  modal.addEventListener('click', handleTrustModalClick);
  // Добавляем обработчик клавиши Escape
  document.addEventListener('keydown', handleTrustModalKeyDown);
}


// Обработчик клика по модальному окну
function handleTrustModalClick(event) {
  const modalContent = document.querySelector('.trust-modal-content');
  
  // Если клик был вне содержимого модального окна (по затемненной области)
  if (!modalContent.contains(event.target)) {
    closeModal();
  }
}

// Обработчик нажатия клавиш для модального окна "Нам доверяют"
function handleTrustModalKeyDown(event) {
  if (event.key === "Escape" || event.key === "Esc") {
    closeModal();
  }
}

// Обновленная функция закрытия модального окна
function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
  document.getElementById('cardsContainer').innerHTML = '';
  
  // Удаляем обработчики
  modal.removeEventListener('click', handleTrustModalClick);
  document.removeEventListener('keydown', handleTrustModalKeyDown);
}

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    window.scrollTo(0, 0);
  }, 0);
});
