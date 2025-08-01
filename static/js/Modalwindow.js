// Обновленная функция showApplicationModal
// При загрузке страницы скроллим к началу
window.addEventListener('load', function() {
    window.scrollTo(0, 0);
});

function showApplicationModal() {
    // Объект для хранения данных заявки
    const applicationData = {};
    
    function updateConfirmationData() {
        // 1. Очистка предыдущих данных
        while (slide5.children.length > 1) {
            slide5.removeChild(slide5.lastChild);
        }

        const isLoaders = document.getElementById('checkbox-loaders').classList.contains('checked');
        const isAuto = document.getElementById('checkbox-auto').classList.contains('checked');
        const isSpecial = document.getElementById('checkbox-special').classList.contains('checked');

        // 1. Данные клиента (первый блок)
        const clientDataBlock = createDataBlock('Данные клиента', {
            'ФИО': applicationData.clientInfo?.name || 'Не указано',
            'Телефон': applicationData.clientInfo?.phone || 'Не указано',
            'Email': applicationData.clientInfo?.email || 'Не указано'
        });
        slide5.appendChild(clientDataBlock);

        // 2. Основные данные (второй блок)
        const orderData = {
            'Тип услуги': isLoaders ? 'Услуги грузчиков' : 
                        isAuto ? 'Автоперевозки' : 
                        isSpecial ? 'Спецтехника' : 'Не выбрано',
            'Тип груза': document.getElementById('cargoType')?.value || 'Не указано'
        };

        // На этот:
        if (isLoaders) {
            // Для грузчиков получаем значение из счетчика часов
            const hoursDisplay = document.querySelector('#kolyan-container .kolyan-row span'); // Более точный селектор
            if (hoursDisplay) {
                const hoursText = hoursDisplay.textContent;
                const hours = hoursText.replace(' ч', ''); // Удаляем " ч" из текста
                orderData['Время работы'] = `${hours || 4} ч.`;
            } else {
                orderData['Время работы'] = '4 ч.'; // Значение по умолчанию
            }
        } else {
            // Для остальных типов услуг показываем минимальное время
            orderData['Минимальное время работы'] = `   ${document.getElementById('minTimeCar')?.innerText || 0} ч.`;
        }

        // Блок характеристик техники
        if (selectedCar) {
            const vehicleDetails = [];
            
            if (selectedCar.name) {
                orderData['Транспорт'] = selectedCar.name;
            }

            if (isSpecial) {
                if (selectedCar.showDimensions && selectedCar.length && selectedCar.width && selectedCar.height) {
                    vehicleDetails.push(`Размеры: ${selectedCar.length} × ${selectedCar.width} × ${selectedCar.height}`);
                }
                if (selectedCar.tonnage) {
                    vehicleDetails.push(`Общая грузоподъемность: ${selectedCar.tonnage}`);
                }
                if (selectedCar.boom_length) {
                    vehicleDetails.push(`Длина стрелы: ${selectedCar.boom_length}`);
                }
                if (selectedCar.boom_tonnage) {
                    vehicleDetails.push(`Грузоподъемность стрелы: ${selectedCar.boom_tonnage}`);
                }
            } 
            else if (isAuto) {
                if (selectedCar.length && selectedCar.width && selectedCar.height) {
                    vehicleDetails.push(`Размеры: ${selectedCar.length} × ${selectedCar.width} × ${selectedCar.height}`);
                }
                if (selectedCar.tonnage) {
                    vehicleDetails.push(`Грузоподъемность: ${selectedCar.tonnage}`);
                }
                if (selectedCar.palets) {
                    vehicleDetails.push(`Евро паллет: ${selectedCar.palets}`);
                }
            }
            else if (isLoaders) {
                if (selectedCar.description) {
                    vehicleDetails.push(selectedCar.description);
                }
                if (selectedCar.pricePerLoader) {
                    vehicleDetails.push(`Цена за человека: ${selectedCar.pricePerLoader} руб (без НДС)`);
                }
            }

            if (vehicleDetails.length > 0) {
                const formattedCharacteristics = vehicleDetails.map(item => `  • ${item}`).join('\n');
                orderData['Характеристики'] = formattedCharacteristics;
            }
        }

        const orderDataBlock = createDataBlock('Основные данные', orderData);
        slide5.appendChild(orderDataBlock);

        // 3. Адреса и контакты (объединенный блок)
        const addressesData = {};
        
        // Основной адрес загрузки
        const loadingAddress = document.querySelector('#loadingAddressesContainer input[type=text]')?.value || 'Не указано';
        addressesData['Адрес загрузки'] = loadingAddress;
        
        // Способ загрузки (если не спецтехника и не грузчики)
        if (isAuto) {
            const loadingMethod = document.querySelector('#loadingOptions input[type=radio]:checked')?.value || 'Не указано';
            addressesData['Способ загрузки'] = loadingMethod;
        }
        
        // Контакт на загрузке (если есть)
        if (applicationData.loadingContacts?.[0]) {
            const contact = applicationData.loadingContacts[0];
            addressesData['Контакт на загрузке'] = `${contact.name || 'Не указано'}, ${contact.phone || 'Не указано'}`;
        }
        
        // Промежуточные адреса и контакты
        const intermediateInputs = document.querySelectorAll('.intermediate-address-container input[type=text]');
        intermediateInputs.forEach((input, index) => {
            if (input.value) {
                addressesData[`Промежуточный адрес ${index + 1}`] = input.value;
                
                // Способ загрузки для промежуточного адреса
                if (isAuto) {
                    const methodRadio = document.querySelector(`#loadingOptions_${input.id} input[type=radio]:checked`);
                    if (methodRadio) {
                        addressesData[`Способ заг/выг для адреса ${index + 1}`] = methodRadio.value;
                    }
                }
                
                // Контакт для промежуточного адреса (если есть)
                if (applicationData.loadingContacts?.[index + 1]) {
                    const contact = applicationData.loadingContacts[index + 1];
                    addressesData[`Контакт на адресе ${index + 1}`] = `${contact.name || 'Не указано'}, ${contact.phone || 'Не указано'}`;
                }
            }
        });
        
        // Адрес выгрузки
        const unloadingAddress = document.getElementById('unloadingAddress')?.value || 'Не указано';
        addressesData['Адрес выгрузки'] = unloadingAddress;
        
        // Способ выгрузки (если не спецтехника и не грузчики)
        if (isAuto) {
            const unloadingMethod = document.querySelector('#unloadOptions input[type=radio]:checked')?.value || 'Не указано';
            addressesData['Способ выгрузки'] = unloadingMethod;
        }
        
        // Контакты на выгрузке (если есть)
        if (applicationData.unloadingContacts?.length) {
            const contactsText = applicationData.unloadingContacts.map(contact => 
                `${contact.name || 'Не указано'}, ${contact.phone || 'Не указано'}`
            ).join('; ');
            addressesData['Контакты на выгрузке'] = contactsText;
        }
        
        // Создаем объединенный блок адресов и контактов
        if (Object.keys(addressesData).length > 0) {
            const addressesBlock = createDataBlock('Адреса и контакты', addressesData);
            slide5.appendChild(addressesBlock);
        }

        // 4. Дополнительные услуги
        const additionalServices = {};
        
        const loadersCounter = document.querySelector('.counter-btn + span');
        const loadersCount = loadersCounter ? parseInt(loadersCounter.textContent) || 0 : 0;
        if (loadersCount > 0) {
            additionalServices['Количество грузчиков'] = `${loadersCount} чел.`;
        }

        if (isAuto && document.getElementById('expeditingCheckmark')?.style.display === 'block') {
            additionalServices['Экспедирование'] = 'Да';
        }
        
        if (document.getElementById('insuranceCheckmark')?.style.display === 'block') {
            additionalServices['Страхование'] = 'Да';
        }

        if (Object.keys(additionalServices).length > 0) {
            const servicesBlock = createDataBlock('Дополнительные услуги', additionalServices);
            slide5.appendChild(servicesBlock);
        }

        // 5. Дата и время подачи
        const dateTimeBlock = createDataBlock('Дата и время подачи', {
            'Дата': applicationData.dates?.deliveryDate 
                ? new Date(applicationData.dates.deliveryDate + 'T00:00:00Z').toLocaleDateString('ru-RU', { timeZone: 'UTC' })
                : 'Не указано',
            'Время': applicationData.dates?.deliveryTime || 'Не указано'
        });
        slide5.appendChild(dateTimeBlock);

        // 6. Стоимость
        const priceNoVAT = document.getElementById('costNoVAT')?.textContent || '0';
        const priceWithVAT = document.getElementById('costWithVAT')?.textContent || '0';
        
        const priceBlock = createDataBlock('Стоимость', {
            'Тип цены': applicationData.priceType === 'noVAT' ? 'Без НДС' : 'С НДС',
            'Сумма': `${applicationData.priceType === 'noVAT' ? priceNoVAT : priceWithVAT} ₽`,
        });
        slide5.appendChild(priceBlock);

        // 7. Блок согласия на обработку персональных данных
        const consentContainer = document.createElement('div');
        consentContainer.style.cssText = `
            display: flex;
            align-items: center;
            margin-top: 20px;
            margin-bottom: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #e9ecef;
        `;
        
        const consentCheckbox = document.createElement('div');
        consentCheckbox.className = 'consent-checkbox';
        consentCheckbox.style.cssText = `
            width: 20px;
            height: 20px;
            border: 2px solid #1a237e;
            border-radius: 5px;
            margin-right: 12px;
            cursor: pointer;
            position: relative;
            transition: all 0.2s ease;
            flex-shrink: 0;
            background: white;
        `;

        const checkmark = document.createElement('div');
        checkmark.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            width: 16px;
            height: 16px;
            opacity: 0;
            transition: all 0.2s ease;
            background-color: #1a237e;
            mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E");
            mask-size: contain;
            mask-repeat: no-repeat;
            mask-position: center;
        `;

        consentCheckbox.appendChild(checkmark);
        
        const consentText = document.createElement('span');
        consentText.textContent = 'Согласие на обработку персональных данных';
        consentText.style.cssText = `
            font-size: 14px;
            color: #495057;
            cursor: pointer;
            line-height: 1.4;
        `;
        
        consentCheckbox.addEventListener('click', function() {
            const checkmark = this.querySelector('div');
            if (checkmark.style.opacity === '0' || checkmark.style.opacity === '') {
                checkmark.style.opacity = '1';
                checkmark.style.transform = 'translate(-50%, -50%) scale(1)';
            } else {
                checkmark.style.opacity = '0';
                checkmark.style.transform = 'translate(-50%, -50%) scale(0)';
            }
        });

        const checkboxStyle = document.createElement('style');
        checkboxStyle.textContent = `
            .consent-checkbox:hover {
                background-color: #f0f4ff;
            }
            .consent-checkbox:active {
                transform: scale(0.95);
            }
        `;
        document.head.appendChild(checkboxStyle);
        
        consentText.addEventListener('click', function() {
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            `;
            
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            });

            const modalContent = document.createElement('div');
            modalContent.style.cssText = `
                background: #fff;
                padding: 25px;
                border-radius: 12px;
                max-width: 90%;
                max-height: 80vh;
                overflow: auto;
                z-index: 10001;
                box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                width: 600px;
            `;
            modalContent.addEventListener('click', function(e) {
                e.stopPropagation();
            });

            const modalTitle = document.createElement('h3');
            modalTitle.textContent = 'Пользовательское соглашение';
            modalTitle.style.cssText = `
                margin-bottom: 20px;
                color: #212529;
                font-size: 22px;
                font-weight: 600;
                padding-bottom: 15px;
                border-bottom: 1px solid #e9ecef;
            `;

            const agreementText = document.createElement('div');
            agreementText.innerHTML = `
                <p>Пользовательское соглашение будет вставлено здесь...</p>
            `;
            agreementText.style.cssText = `
                line-height: 1.6;
                color: #495057;
                font-size: 14px;
            `;
            
            const closeButton = document.createElement('button');
            closeButton.textContent = 'Закрыть';
            closeButton.style.cssText = `
                margin-top: 20px;
                padding: 10px 20px;
                background: #1a237e;
                color: #fff;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s ease;
                display: block;
                margin-left: auto;
            `;
            
            closeButton.addEventListener('mouseenter', () => {
                closeButton.style.background = '#0d47a1';
            });
            
            closeButton.addEventListener('mouseleave', () => {
                closeButton.style.background = '#1a237e';
            });
            
            closeButton.addEventListener('click', function() {
                document.body.removeChild(modal);
            });
            
            modalContent.appendChild(modalTitle);
            modalContent.appendChild(agreementText);
            modalContent.appendChild(closeButton);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
        });
        
        consentContainer.appendChild(consentCheckbox);
        consentContainer.appendChild(consentText);
        slide5.appendChild(consentContainer);

        // Добавляем кнопки управления
        slide5.appendChild(actionButtons4);
        slide5.scrollTo(0, 0);
    }

    function validateName(name) {
        // Разрешаем буквы (русские и английские), пробелы, дефисы и апострофы
        return /^[a-zA-Zа-яА-ЯёЁ\s\-']+$/u.test(name);
    }

    // Функция для закрытия всех попапов
    function closeAllPickers() {
        calendar.style.display = 'none';
        timePicker.style.display = 'none';
    }

    // Создаем элементы
    const modal = document.createElement('div');
    const modalContent = document.createElement('div');

    // Стили для модального окна
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 1;
        transition: opacity 0.3s;
    `;
    
    // Стили для контента
    modalContent.style.cssText = `
        background: white;
        border-radius: 12px;
        width: 90%;
        max-width: 600px;
        padding: 0;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    `;

    // Собираем структуру
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Добавляем контейнер прогресса
    const progressContainer = document.createElement('div');
    progressContainer.style.cssText = `
        position: relative;
        height: 80px;
        background: #f8f9fa;
        border-bottom: 1px solid #e9ecef;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 30px;
    `;

    // Обертка для прогресс-бара и кнопки закрытия
    const progressWrapper = document.createElement('div');
    progressWrapper.style.cssText = `
        position: relative;
        width: 100%;
        max-width: 600px;
        display: flex;
        align-items: center;
    `;

    // Дорожка прогресса
    const progressTrack = document.createElement('div');
    progressTrack.style.cssText = `
        width: 100%;
        height: 6px;
        background: #e9ecef;
        border-radius: 3px;
        position: relative;
        flex-grow: 1;
    `;

    // Прогресс-бар (заполняемая линия)
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 0%; // Начинаем с 0%
        background: #1a237e;
        border-radius: 3px;
        transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    // Иконка грузовика (движущийся элемент)
    const truckIcon = document.createElement('div');
    truckIcon.style.cssText = `
        position: absolute;
        left: 0%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 24px;
        height: 24px;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 512' fill='%231a237e'%3E%3Cpath d='M624 352h-16V243.9c0-12.7-5.1-24.9-14.1-33.9L494 110.1c-9-9-21.2-14.1-33.9-14.1H416V48c0-26.5-21.5-48-48-48H112C85.5 0 64 21.5 64 48v48H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h272c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H40c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h208c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h208c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H64v128c0 53 43 96 96 96s96-43 96-96h128c0 53 43 96 96 96s96-43 96-96h48c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zM160 464c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm320 0c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm80-208H416V144h44.1l99.9 99.9V256z'/%3E%3C/svg%3E");
        background-size: contain;
        background-repeat: no-repeat;
        transition: left 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 2;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    `;

    // Точки прогресса (иконки грузовиков)
    const progressDots = document.createElement('div');
    progressDots.style.cssText = `
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        transform: translateY(-50%);
        display: flex;
        justify-content: space-between;
        pointer-events: none;
        width: 100%;
    `;

    // В коде функции showApplicationModal, где создается кнопка закрытия (closeBtn):

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        position: relative;
        margin-left: 20px;
        background: none;
        border: none;
        color: #6c757d;
        font-size: 28px;
        cursor: pointer;
        transition: all 0.2s ease;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        flex-shrink: 0;
        z-index: 100;
    `;

    // Стили для мобильных устройств
    const mobileCloseStyle = document.createElement('style');
    mobileCloseStyle.textContent = `
        @media (max-width: 768px) {
            .modal-close-btn {
                position: fixed;
                top: -3px !important;  /* Поднимаем выше */
                right: -20px !important; /* Сдвигаем вправо */
                margin: 0 !important;
                background: none !important;
                box-shadow: none !important;
                color: #ff0000ff !important; /* Делаем крестик темнее */
                font-size: 32px !important; /* Увеличиваем размер */
            }
            
            .modal-close-btn:hover {
                color: #0d47a1 !important;
                transform: scale(1.1) !important;
            }
        }
    `;
    document.head.appendChild(mobileCloseStyle);

    closeBtn.classList.add('modal-close-btn');


    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.transform = 'scale(1.2)';
        closeBtn.style.color = '#dc3545';
        closeBtn.style.background = 'rgba(220, 53, 69, 0.1)';
    });
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.transform = 'scale(1)';
        closeBtn.style.color = '#6c757d';
        closeBtn.style.background = 'none';
    });
    closeBtn.addEventListener('click', () => modal.remove());

    // Собираем прогресс-бар
    progressTrack.appendChild(progressBar);
    progressTrack.appendChild(truckIcon);
    progressTrack.appendChild(progressDots);
    progressWrapper.appendChild(progressTrack);
    progressWrapper.appendChild(closeBtn);
    progressContainer.appendChild(progressWrapper);
    modalContent.appendChild(progressContainer);

    // Создаем 5 точек (иконок грузовиков)
    const dotPositions = []; // Будем хранить позиции точек
    for (let i = 0; i < 5; i++) {
        const dot = document.createElement('div');
        dot.style.cssText = `
            width: 24px;
            height: 24px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 512' fill='%23e9ecef'%3E%3Cpath d='M624 352h-16V243.9c0-12.7-5.1-24.9-14.1-33.9L494 110.1c-9-9-21.2-14.1-33.9-14.1H416V48c0-26.5-21.5-48-48-48H112C85.5 0 64 21.5 64 48v48H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h272c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H40c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h208c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h208c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H64v128c0 53 43 96 96 96s96-43 96-96h128c0 53 43 96 96 96s96-43 96-96h48c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zM160 464c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm320 0c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm80-208H416V144h44.1l99.9 99.9V256z'/%3E%3C/svg%3E");
            background-size: contain;
            background-repeat: no-repeat;
            position: relative;
            z-index: 1;
            transition: all 0.3s ease;
        `;
        
        // Первая точка сразу активна
        if (i === 0) {
            dot.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 512' fill='%231a237e'%3E%3Cpath d='M624 352h-16V243.9c0-12.7-5.1-24.9-14.1-33.9L494 110.1c-9-9-21.2-14.1-33.9-14.1H416V48c0-26.5-21.5-48-48-48H112C85.5 0 64 21.5 64 48v48H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h272c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H40c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h208c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h208c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H64v128c0 53 43 96 96 96s96-43 96-96h128c0 53 43 96 96 96s96-43 96-96h48c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zM160 464c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm320 0c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm80-208H416V144h44.1l99.9 99.9V256z'/%3E%3C/svg%3E")`;

        }
        
        progressDots.appendChild(dot);
        dotPositions.push(i * 25); // 0%, 25%, 50%, 75%, 100%
    }


    // Функция обновления прогресса
    function updateProgress(currentSlide) {
        const percentages = [0, 25, 50, 75, 100]; // Позиции для 5 точек
        
        // Обновляем прогресс-бар
        progressBar.style.width = `${percentages[currentSlide - 1]}%`;
        
        // Плавно перемещаем иконку грузовика к текущей точке
        const truckIcon = progressTrack.querySelector('div:nth-child(2)');
        truckIcon.style.left = `${percentages[currentSlide - 1]}%`;
        
        // Обновляем иконки грузовиков (точки)
        const dots = progressDots.querySelectorAll('div');
        dots.forEach((dot, index) => {
            // Рассчитываем точное положение для грузовика, чтобы он совпадал с точкой
            const dotRect = dot.getBoundingClientRect();
            const trackRect = progressTrack.getBoundingClientRect();
            const dotPosition = ((dotRect.left + dotRect.width/2) - trackRect.left) / trackRect.width * 100;
            
            if (index < currentSlide) {
                // Пройденные точки - цветные грузовики
                dot.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 512' fill='%231a237e'%3E%3Cpath d='M624 352h-16V243.9c0-12.7-5.1-24.9-14.1-33.9L494 110.1c-9-9-21.2-14.1-33.9-14.1H416V48c0-26.5-21.5-48-48-48H112C85.5 0 64 21.5 64 48v48H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h272c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H40c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h208c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h208c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H64v128c0 53 43 96 96 96s96-43 96-96h128c0 53 43 96 96 96s96-43 96-96h48c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zM160 464c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm320 0c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm80-208H416V144h44.1l99.9 99.9V256z'/%3E%3C/svg%3E")`;
                
                // Если это текущая точка, центрируем грузовик точно над ней
                if (index === currentSlide - 1) {
                    truckIcon.style.left = `${dotPosition}%`;
                }
            } else {
                // Непройденные точки - серые грузовики
                dot.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 512' fill='%23e9ecef'%3E%3Cpath d='M624 352h-16V243.9c0-12.7-5.1-24.9-14.1-33.9L494 110.1c-9-9-21.2-14.1-33.9-14.1H416V48c0-26.5-21.5-48-48-48H112C85.5 0 64 21.5 64 48v48H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h272c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H40c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h208c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h208c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H64v128c0 53 43 96 96 96s96-43 96-96h128c0 53 43 96 96 96s96-43 96-96h48c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zM160 464c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm320 0c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm80-208H416V144h44.1l99.9 99.9V256z'/%3E%3C/svg%3E")`;
            }
        });
    }

    updateProgress(1);

    // Слайд 1 - Информация о клиенте
    const slide1 = document.createElement('div');
    slide1.style.cssText = `
        padding: 30px;
    `;

    const title = document.createElement('h2');
    title.textContent = 'Данные заказчика';
    title.style.cssText = `
        text-align: center;
        margin-bottom: 25px;
        color: #212529;
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        font-size: 22px;
    `;

    // Функция создания поля с подсказкой
    // Функция создания поля с подсказкой и иконкой
    function createFieldWithHint(labelText, inputType, placeholder, iconName, isRequired = true) {
        const container = document.createElement('div');
        container.style.cssText = `
            margin-bottom: 20px;
            position: relative;
        `;

        const label = document.createElement('label');
        label.textContent = labelText;
        label.style.cssText = `
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #495057;
            font-size: 14px;
        `;

        const inputWrapper = document.createElement('div');
        inputWrapper.style.cssText = `
            position: relative;
            display: flex;
            align-items: center;
        `;

        // Иконка
        const icon = document.createElement('div');
        icon.style.cssText = `
            position: absolute;
            left: 12px;
            width: 20px;
            height: 20px;
            z-index: 2;
            color: #6c757d;
            transition: all 0.3s ease;
        `;

        // SVG иконки
        const icons = {
            'user': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
            'phone': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
            'mail': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`
        };

        icon.innerHTML = icons[iconName] || '';
        
        const input = document.createElement('input');
        input.type = inputType;
        input.placeholder = placeholder;
        input.required = isRequired;
        input.style.cssText = `
            width: 100%;
            padding: 12px 15px 12px 40px;
            border: 1px solid #ced4da;
            border-radius: 6px;
            font-size: 15px;
            background: white;
            transition: all 0.3s ease;
            box-sizing: border-box;
        `;
        
        // Анимация при наведении
        input.addEventListener('mouseenter', () => {
            input.style.borderColor = '#1a237e';
            input.style.boxShadow = '0 0 0 3px rgba(26, 35, 126, 0.2)';
            icon.style.color = '#1a237e';
            icon.style.transform = 'scale(1.1)';
        });
        
        input.addEventListener('mouseleave', () => {
            input.style.borderColor = '#ced4da';
            input.style.boxShadow = 'none';
            icon.style.color = '#6c757d';
            icon.style.transform = 'scale(1)';
        });
        
        input.addEventListener('focus', () => {
            input.style.borderColor = '#1a237e';
            input.style.boxShadow = '0 0 0 3px rgba(26, 35, 126, 0.2)';
            icon.style.color = '#1a237e';
            icon.style.transform = 'scale(1.1)';
        });
        
        input.addEventListener('blur', () => {
            input.style.borderColor = '#ced4da';
            input.style.boxShadow = 'none';
            icon.style.color = '#6c757d';
            icon.style.transform = 'scale(1)';
        });

        const hint = document.createElement('div');
        hint.className = 'form-hint';
        hint.style.cssText = `
            color: #dc3545;
            font-size: 12px;
            margin-top: 6px;
            display: none;
        `;

        // Добавляем обработчик ввода для поля ФИО
        if (labelText.includes('ФИО')) {
            input.addEventListener('input', function(e) {
                this.value = this.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s\-']/gu, '');
            });
            hint.textContent = 'Пожалуйста, введите ваше ФИО (только буквы и допустимые символы)';
        } else if (labelText.includes('Телефон')) {
            hint.textContent = 'Пожалуйста, введите корректный номер телефона';
        } else if (labelText.includes('Email')) {
            hint.textContent = 'Пожалуйста, введите корректный email';
        }

        inputWrapper.appendChild(icon);
        inputWrapper.appendChild(input);
        container.appendChild(label);
        container.appendChild(inputWrapper);
        container.appendChild(hint);

        return { container, input, hint };
    }

    // Создаем поля с иконками
    const { container: nameContainer, input: nameInput, hint: nameHint } = 
        createFieldWithHint('ФИО*', 'text', 'Введите ваше полное имя', 'user', true);

    const { container: phoneContainer, input: phoneInput, hint: phoneHint } = 
        createFieldWithHint('Телефон*', 'tel', '+7 (___) ___-__-__', 'phone');

    const { container: emailContainer, input: emailInput, hint: emailHint } = 
        createFieldWithHint('Email*', 'email', 'Введите ваш email', 'mail');

    // Добавляем маску телефона (как в предыдущем коде)
    phoneInput.addEventListener('input', function(e) {
        const cursorPosition = this.selectionStart;
        const isDeleting = e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward';
        
        let value = this.value.replace(/\D/g, '');
        
        let formattedValue = '';
        if (value.length > 0) {
            if (value[0] !== '7' && value.length >= 1) {
                value = '7' + value.substring(1);
            }
            
            formattedValue = '+7 (';
            if (value.length > 1) {
                formattedValue += value.substring(1, 4);
            }
            if (value.length > 4) {
                formattedValue += ') ' + value.substring(4, 7);
            }
            if (value.length > 7) {
                formattedValue += '-' + value.substring(7, 9);
            }
            if (value.length > 9) {
                formattedValue += '-' + value.substring(9, 11);
            }
        }
        
        this.value = formattedValue;
        
        if (!isDeleting) {
            if (cursorPosition <= 4 || this.value.length <= 4) {
                this.setSelectionRange(4, 4);
            } else {
                let newCursorPosition = cursorPosition;
                if (cursorPosition === 8 && value.length > 4) newCursorPosition += 2;
                else if (cursorPosition === 13 && value.length > 7) newCursorPosition += 1;
                else if (cursorPosition === 16 && value.length > 9) newCursorPosition += 1;
                
                this.setSelectionRange(newCursorPosition, newCursorPosition);
            }
        }
    });

    phoneInput.addEventListener('focus', function() {
        if (!this.value || this.value === '+7 (') {
            this.value = '+7 (';
            this.setSelectionRange(4, 4);
        }
    });



    // Кнопка Продолжить
    const continueBtn1 = document.createElement('button');
    continueBtn1.textContent = 'Продолжить';
    continueBtn1.style.cssText = `
        width: 100%;
        padding: 14px;
        background: #1a237e;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        margin-top: 10px;
        transition: all 0.2s ease;
    `;
    continueBtn1.addEventListener('mouseenter', () => {
        continueBtn1.style.background = '#0d47a1';
        continueBtn1.style.transform = 'translateY(-2px)';
    });
    continueBtn1.addEventListener('mouseleave', () => {
        continueBtn1.style.background = '#1a237e';
        continueBtn1.style.transform = 'translateY(0)';
    });

    // Собираем первый слайд
    slide1.appendChild(title);
    slide1.appendChild(nameContainer);
    slide1.appendChild(phoneContainer);
    slide1.appendChild(emailContainer);
    slide1.appendChild(continueBtn1);

    // Слайд 2 - Дата и время
    // Слайд 2 - Дата и время
    const slide2 = document.createElement('div');
    slide2.style.cssText = `
        padding: 30px;
        display: none;
        position: relative;
    `;

    const dateTimeTitle = title.cloneNode(true);
    dateTimeTitle.textContent = 'Дата и время подачи';

    // Контейнер для полей даты и времени
    const dateTimeContainer = document.createElement('div');
    dateTimeContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin-bottom: 20px;
    `;

    // Поле Даты (обновленный стиль)
    const dateContainer = document.createElement('div');
    dateContainer.style.cssText = `
        position: relative;
        margin-bottom: 15px;
    `;

    const dateLabel = document.createElement('label');
    dateLabel.textContent = 'Дата подачи*';
    dateLabel.style.cssText = `
        display: block;
        margin-bottom: 6px;
        font-weight: 500;
        color: #495057;
        font-size: 14px;
    `;

    const datePickerContainer = document.createElement('div');
    datePickerContainer.style.position = 'relative';

    const dateDisplayInput = document.createElement('input');
    dateDisplayInput.type = 'text';
    dateDisplayInput.readOnly = true;
    dateDisplayInput.placeholder = 'Выберите дату';
    dateDisplayInput.style.cssText = `
        width: 100%;
        padding: 12px 15px 12px 40px;
        border: 1px solid #ced4da;
        border-radius: 6px;
        font-size: 15px;
        background: white;
        transition: all 0.3s ease;
        cursor: pointer;
        box-sizing: border-box;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%236c757d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: 12px center;
        background-size: 20px;
    `;

    // Анимация при наведении
    dateDisplayInput.addEventListener('mouseenter', () => {
        dateDisplayInput.style.borderColor = '#1a237e';
        dateDisplayInput.style.boxShadow = '0 0 0 3px rgba(26, 35, 126, 0.2)';
        dateDisplayInput.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%231a237e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E")`;
    });

    dateDisplayInput.addEventListener('mouseleave', () => {
        dateDisplayInput.style.borderColor = '#ced4da';
        dateDisplayInput.style.boxShadow = 'none';
        dateDisplayInput.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%236c757d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E")`;
    });

    dateDisplayInput.addEventListener('focus', () => {
        dateDisplayInput.style.borderColor = '#1a237e';
        dateDisplayInput.style.boxShadow = '0 0 0 3px rgba(26, 35, 126, 0.2)';
        dateDisplayInput.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%231a237e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E")`;
    });

    dateDisplayInput.addEventListener('blur', () => {
        dateDisplayInput.style.borderColor = '#ced4da';
        dateDisplayInput.style.boxShadow = 'none';
        dateDisplayInput.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%236c757d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E")`;
    });

    // Скрытое поле для хранения даты
    const dateInput = document.createElement('input');
    dateInput.type = 'hidden';
    dateInput.name = 'deliveryDate';

    // Обновленный календарь в темно-синих тонах
    const calendar = document.createElement('div');
    calendar.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 320px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        padding: 20px;
        z-index: 10001;
        display: none;
        font-family: 'Inter', sans-serif;
        border: 1px solid #e0e0e0;
    `;

    calendar.innerHTML = `
        <div class="calendar-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #f0f0f0;">
            <button class="prev-month" style="background: #f5f5f5; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; padding: 5px; transition: all 0.2s; display: flex; align-items: center; justify-content: center;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 6L9 12L15 18" stroke="#1a237e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <div class="month-year" style="font-weight: 600; color: #1a237e; font-size: 16px;"></div>
            <button class="next-month" style="background: #f5f5f5; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; padding: 5px; transition: all 0.2s; display: flex; align-items: center; justify-content: center;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 6L15 12L9 18" stroke="#1a237e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
        <div class="weekdays" style="display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; margin-bottom: 10px; font-size: 13px; color: #5c6bc0; font-weight: 500;">
            <div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div><div>Сб</div><div>Вс</div>
        </div>
        <div class="days" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px;"></div>
    `;

    const dateHint = document.createElement('div');
    dateHint.className = 'form-hint';
    dateHint.style.cssText = `
        color: #dc3545;
        font-size: 12px;
        margin-top: 6px;
        display: none;
    `;
    dateHint.textContent = 'Пожалуйста, укажите дату подачи';

    // Добавляем элементы в контейнер
    datePickerContainer.appendChild(dateDisplayInput);
    datePickerContainer.appendChild(dateInput);
    dateContainer.appendChild(dateLabel);
    dateContainer.appendChild(datePickerContainer);
    dateContainer.appendChild(dateHint);

    // Обновленная функция renderCalendar с новым стилем
    function renderCalendar(date = new Date()) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const monthYear = calendar.querySelector('.month-year');
        const daysContainer = calendar.querySelector('.days');
        const prevBtn = calendar.querySelector('.prev-month');
        const nextBtn = calendar.querySelector('.next-month');
        
        // Устанавливаем месяц и год
        const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        monthYear.textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        
        // Очищаем дни
        daysContainer.innerHTML = '';
        
        // Добавляем крестик для закрытия календаря
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
            position: absolute;
            top: -3px;
            right: 1px;
            background: none;
            border: none;
            font-size: 24px;
            color: #6c757d;
            cursor: pointer;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s ease;
            z-index: 2;
        `;
        
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.color = '#dc3545';
            closeBtn.style.transform = 'scale(1.2)';
        });
        
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.color = '#6c757d';
            closeBtn.style.transform = 'scale(1)';
        });
        
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            calendar.style.display = 'none';
        });
        
        calendar.querySelector('.calendar-header').appendChild(closeBtn);

        // Получаем первый день месяца и последний день месяца
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        // Получаем день недели первого дня месяца
        const firstDayIndex = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
        
        // Добавляем пустые ячейки для дней предыдущего месяца
        for (let i = 0; i < firstDayIndex; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.style.height = '32px';
            daysContainer.appendChild(emptyDay);
        }
        
        // Добавляем дни текущего месяца
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const day = document.createElement('button');
            day.textContent = i;
            day.style.cssText = `
                border: none;
                background: none;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 13px;
                transition: all 0.2s;
                margin: 0 auto;
                color: #212529;
                font-weight: 500;
            `;
            
            const currentDate = new Date(date.getFullYear(), date.getMonth(), i);
            
            // Проверяем, является ли день прошедшим
            if (currentDate < today) {
                day.style.color = '#b0bec5';
                day.style.cursor = 'not-allowed';
                day.disabled = true;
            } else {
                day.addEventListener('mouseenter', () => {
                    if (!day.classList.contains('selected')) {
                        day.style.background = '#e8eaf6';
                    }
                });
                day.addEventListener('mouseleave', () => {
                    if (!day.classList.contains('selected')) {
                        day.style.background = 'none';
                    }
                });
                
                day.addEventListener('click', () => {
                    // Удаляем выделение у всех дней
                    document.querySelectorAll('.days button').forEach(d => {
                        d.style.background = 'none';
                        d.style.color = '#212529';
                        d.classList.remove('selected');
                    });
                    
                    // Выделяем выбранный день
                    day.style.background = '#1a237e';
                    day.style.color = 'white';
                    day.classList.add('selected');
                    
                    // Устанавливаем дату в поле ввода
                    const selectedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), i));
                    const formattedDate = selectedDate.toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    }).replace(/\./g, '.');
                    
                    dateDisplayInput.value = formattedDate;
                    dateInput.value = selectedDate.toISOString().split('T')[0];
                    
                    // Скрываем календарь
                    calendar.style.display = 'none';
                    dateHint.style.display = 'none';
                });
            }
            
            // Проверяем, является ли день сегодняшним
            if (currentDate.toDateString() === today.toDateString()) {
                day.style.border = '1px solid #1a237e';
                day.style.color = '#1a237e';
                day.style.fontWeight = '600';
            }
            
            daysContainer.appendChild(day);
        }
        
        // Обработчики для кнопок переключения месяцев
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (prevMonth >= new Date(today.getFullYear(), today.getMonth(), 1)) {
                renderCalendar(prevMonth);
            }
        });
        
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
            const maxMonth = new Date(today.getFullYear(), today.getMonth() + 2, 1);
            
            if (nextMonth <= maxMonth) {
                renderCalendar(nextMonth);
            }
        });
        
        // Стили для кнопок переключения месяцев
        const styleButtons = (btn) => {
            btn.addEventListener('mouseenter', () => {
                btn.style.background = '#e8eaf6';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.background = '#f5f5f5';
            });
        };
        
        styleButtons(prevBtn);
        styleButtons(nextBtn);
        
        // Отключаем кнопки, если нужно
        const todayMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        if (date.getTime() <= todayMonth.getTime()) {
            prevBtn.disabled = true;
            prevBtn.querySelector('svg path').setAttribute('stroke', '#b0bec5');
            prevBtn.style.background = '#f5f5f5';
            prevBtn.style.cursor = 'not-allowed';
        } else {
            prevBtn.disabled = false;
            prevBtn.querySelector('svg path').setAttribute('stroke', '#1a237e');
            prevBtn.style.cursor = 'pointer';
        }
        
        const maxMonth = new Date(today.getFullYear(), today.getMonth() + 2, 1);
        if (date.getMonth() >= maxMonth.getMonth() && date.getFullYear() >= maxMonth.getFullYear()) {
            nextBtn.disabled = true;
            nextBtn.querySelector('svg path').setAttribute('stroke', '#b0bec5');
            nextBtn.style.background = '#f5f5f5';
            nextBtn.style.cursor = 'not-allowed';
        } else {
            nextBtn.disabled = false;
            nextBtn.querySelector('svg path').setAttribute('stroke', '#1a237e');
            nextBtn.style.cursor = 'pointer';
        }
    }

    // Обработчик для календаря
    dateDisplayInput.addEventListener('click', (e) => {
        e.stopPropagation();
        if (timePicker.style.display === 'block') {
            timePicker.style.display = 'none';
        }
        calendar.style.display = calendar.style.display === 'none' ? 'block' : 'none';
        
        if (calendar.style.display === 'block') {
            const today = new Date();
            renderCalendar(today);
        }
    });

    // Поле Времени (обновленный стиль)
    const timeContainer = document.createElement('div');
    timeContainer.style.cssText = `
        position: relative;
        margin-bottom: 15px;
    `;

    const timeLabel = document.createElement('label');
    timeLabel.textContent = 'Время подачи*';
    timeLabel.style.cssText = `
        display: block;
        margin-bottom: 6px;
        font-weight: 500;
        color: #495057;
        font-size: 14px;
    `;

    const timePickerContainer = document.createElement('div');
    timePickerContainer.style.position = 'relative';

    const timeDisplayInput = document.createElement('input');
    timeDisplayInput.type = 'text';
    timeDisplayInput.readOnly = true;
    timeDisplayInput.placeholder = 'Выберите время (06:00-18:00)';
    timeDisplayInput.style.cssText = `
        width: 100%;
        padding: 12px 15px 12px 40px;
        border: 1px solid #ced4da;
        border-radius: 6px;
        font-size: 15px;
        background: white;
        transition: all 0.3s ease;
        cursor: pointer;
        box-sizing: border-box;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%236c757d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpolyline points='12 6 12 12 16 14'%3E%3C/polyline%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: 12px center;
        background-size: 20px;
    `;

    // Анимация при наведении для времени
    timeDisplayInput.addEventListener('mouseenter', () => {
        timeDisplayInput.style.borderColor = '#1a237e';
        timeDisplayInput.style.boxShadow = '0 0 0 3px rgba(26, 35, 126, 0.2)';
        timeDisplayInput.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%231a237e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpolyline points='12 6 12 12 16 14'%3E%3C/polyline%3E%3C/svg%3E")`;
    });

    timeDisplayInput.addEventListener('mouseleave', () => {
        timeDisplayInput.style.borderColor = '#ced4da';
        timeDisplayInput.style.boxShadow = 'none';
        timeDisplayInput.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%236c757d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpolyline points='12 6 12 12 16 14'%3E%3C/polyline%3E%3C/svg%3E")`;
    });

    timeDisplayInput.addEventListener('focus', () => {
        timeDisplayInput.style.borderColor = '#1a237e';
        timeDisplayInput.style.boxShadow = '0 0 0 3px rgba(26, 35, 126, 0.2)';
        timeDisplayInput.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%231a237e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpolyline points='12 6 12 12 16 14'%3E%3C/polyline%3E%3C/svg%3E")`;
    });

    timeDisplayInput.addEventListener('blur', () => {
        timeDisplayInput.style.borderColor = '#ced4da';
        timeDisplayInput.style.boxShadow = 'none';
        timeDisplayInput.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%236c757d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpolyline points='12 6 12 12 16 14'%3E%3C/polyline%3E%3C/svg%3E")`;
    });

    // Скрытое поле для хранения времени в формате HH:MM
    const timeInput = document.createElement('input');
    timeInput.type = 'hidden';
    timeInput.name = 'deliveryTime';

    // Создаем попап для выбора времени (по центру модального окна)
    const timePicker = document.createElement('div');
    timePicker.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 260px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        padding: 20px;
        z-index: 10001;
        display: none;
        font-family: 'Inter', sans-serif;
    `;

    // Создаем селекторы для часов (6-18) и минут (00, 15, 30, 45)
    // Время подачи (измененный интервал - 30 минут)
    timePicker.innerHTML = `
        <button class="close-time-picker" style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 24px; color: #6c757d; cursor: pointer; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.2s ease;">&times;</button>
        <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 20px; align-items: center;">
            <select class="hours-select" style="padding: 10px 12px; border-radius: 6px; border: 1px solid #ced4da; font-size: 14px; width: 90px; cursor: pointer; appearance: none; background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%236c757d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>'); background-repeat: no-repeat; background-position: right 10px center; background-size: 12px;">
                ${Array.from({length: 13}, (_, i) => {
                    const hour = i + 6;
                    return `<option value="${hour < 10 ? '0' + hour : hour}">${hour < 10 ? '0' + hour : hour}</option>`;
                }).join('')}
            </select>
            <span style="font-size: 18px; color: #6c757d;">:</span>
            <select class="minutes-select" style="padding: 10px 12px; border-radius: 6px; border: 1px solid #ced4da; font-size: 14px; width: 90px; cursor: pointer; appearance: none; background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%236c757d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>'); background-repeat: no-repeat; background-position: right 10px center; background-size: 12px;">
                <option value="00">00</option>
                <option value="30">30</option>
            </select>
        </div>
        <button class="confirm-time" style="width: 100%; padding: 12px; background: #1a237e; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 15px; transition: all 0.2s ease;">
            Подтвердить
        </button>
    `;

    // Добавляем обработчик для крестика в timePicker
    timePicker.querySelector('.close-time-picker').addEventListener('click', (e) => {
        e.stopPropagation();
        timePicker.style.display = 'none';
    });

    // Добавляем стили для крестиков при наведении
    const closeButtonStyle = document.createElement('style');
    closeButtonStyle.textContent = `
        .close-time-picker:hover {
            color: #dc3545 !important;
            transform: scale(1.2) !important;
        }
    `;
    document.head.appendChild(closeButtonStyle);

    const timeHint = document.createElement('div');
    timeHint.className = 'form-hint';
    timeHint.style.cssText = `
        color: #dc3545;
        font-size: 12px;
        margin-top: 6px;
        display: none;
    `;
    timeHint.textContent = 'Пожалуйста, укажите время подачи';

    // Добавляем элементы в контейнер
    timePickerContainer.appendChild(timeDisplayInput);
    timePickerContainer.appendChild(timeInput);
    timeContainer.appendChild(timeLabel);
    timeContainer.appendChild(timePickerContainer);
    timeContainer.appendChild(timeHint);

    // Добавляем timePicker в модальное окно
    modal.appendChild(timePicker);

    // Функция для проверки доступности времени
    function checkTimeAvailability() {
        const selectedDate = dateInput.value ? new Date(dateInput.value) : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Проверяем, выбрана ли сегодняшняя дата
        const isTodaySelected = selectedDate && 
                            selectedDate.getDate() === today.getDate() && 
                            selectedDate.getMonth() === today.getMonth() && 
                            selectedDate.getFullYear() === today.getFullYear();
        
        if (isTodaySelected) {
            const now = new Date();
            const minTime = new Date(now.getTime() + 90 * 60 * 1000); // Текущее время + 1.5 часа
            const endOfWorkDay = new Date(now);
            endOfWorkDay.setHours(18, 0, 0, 0); // Конец рабочего дня 18:00
            
            // Если минимально возможное время подачи (текущее + 1.5ч) позже 18:00
            if (minTime > endOfWorkDay) {
                timeHint.textContent = 'Рабочий день закончен. Пожалуйста, выберите другую дату.';
                timeHint.style.display = 'block';
                timeDisplayInput.style.borderColor = '#dc3545';
                timeDisplayInput.value = '';
                timeInput.value = '';
                return false;
            }
        }
        
        timeHint.style.display = 'none';
        timeDisplayInput.style.borderColor = '#ced4da';
        return true;
    }

    // Модифицированный обработчик выбора даты
    dateDisplayInput.addEventListener('change', () => {
        if (dateInput.value) {
            // При изменении даты проверяем доступность времени
            checkTimeAvailability();
        }
    });

    // Модифицированный обработчик клика на поле времени
    timeDisplayInput.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Сначала проверяем, выбрана ли дата
        if (!dateInput.value) {
            timeHint.textContent = 'Сначала выберите дату подачи';
            timeHint.style.display = 'block';
            timeDisplayInput.style.borderColor = '#dc3545';
            timeHint.style.animation = 'shake 0.5s';
            setTimeout(() => timeHint.style.animation = '', 500);
            return;
        }
        
        // Проверяем доступность времени для выбранной даты
        if (!checkTimeAvailability()) {
            return;
        }
        
        // Если все проверки пройдены, показываем timePicker
        if (calendar.style.display === 'block') {
            calendar.style.display = 'none';
        }
        
        const selectedDate = new Date(dateInput.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const isTodaySelected = selectedDate.getDate() === today.getDate() && 
                            selectedDate.getMonth() === today.getMonth() && 
                            selectedDate.getFullYear() === today.getFullYear();
        
        if (isTodaySelected) {
            const now = new Date();
            const minTime = new Date(now.getTime() + 90 * 60 * 1000);
            timeDisplayInput.placeholder = `Выберите время не ранее ${minTime.getHours().toString().padStart(2, '0')}:${minTime.getMinutes().toString().padStart(2, '0')}`;
            updateTimePicker(minTime);
        } else {
            timeDisplayInput.placeholder = 'Выберите время (06:00-18:00)';
            updateTimePicker();
        }
        
        timePicker.style.display = 'block';
    });

    // Добавляем обработчик изменения даты, чтобы скрывать подсказку при выборе даты
    dateDisplayInput.addEventListener('change', () => {
        if (dateInput.value) {
            timeHint.style.display = 'none';
            timeDisplayInput.style.borderColor = '#ced4da';
        }
    });

    

    function updateTimePicker(minTime = null) {
        const hoursSelect = timePicker.querySelector('.hours-select');
        const minutesSelect = timePicker.querySelector('.minutes-select');
        
        // Сбрасываем все ограничения
        Array.from(hoursSelect.options).forEach(option => {
            option.disabled = false;
        });
        Array.from(minutesSelect.options).forEach(option => {
            option.disabled = false;
        });
        
        if (minTime) {
            const minHour = minTime.getHours();
            const minMinute = minTime.getMinutes();
            
            // Блокируем часы, которые меньше минимального часа
            Array.from(hoursSelect.options).forEach(option => {
                const hour = parseInt(option.value);
                
                // Если час меньше минимального - блокируем полностью
                if (hour < minHour) {
                    option.disabled = true;
                }
                // Если час равен минимальному, но минуты >= 30 - тоже блокируем
                else if (hour === minHour && minMinute >= 30) {
                    option.disabled = true;
                }
            });
            
            // Устанавливаем минимально допустимые значения
            let initialHour, initialMinute;
            
            if (minMinute >= 30) {
                // Если минимальное время, например, 10:45, то ближайшее доступное - 11:00
                initialHour = minHour + 1;
                initialMinute = '00';
            } else {
                // Если минимальное время, например, 10:20, то ближайшее доступное - 10:30
                initialHour = minHour;
                initialMinute = '30';
            }
            
            // Проверяем, чтобы не выйти за пределы рабочего времени (до 18:59)
            if (initialHour >= 18) {
                initialHour = 17;
                initialMinute = '30';
            }
            
            // Устанавливаем выбранные значения
            hoursSelect.value = initialHour.toString().padStart(2, '0');
            minutesSelect.value = initialMinute;
            
            // Блокируем минуты в текущем часе, если нужно
            if (hoursSelect.value === minHour.toString().padStart(2, '0')) {
                Array.from(minutesSelect.options).forEach(option => {
                    const minute = parseInt(option.value);
                    if (minute < minMinute) {
                        option.disabled = true;
                    }
                });
            }
        } else {
            // Для других дней устанавливаем начальное значение 06:00
            hoursSelect.value = '06';
            minutesSelect.value = '00';
        }
        
        // Обновляем обработчик изменения часов
        hoursSelect.onchange = function() {
            const selectedHour = parseInt(this.value);
            
            if (minTime && selectedHour === minTime.getHours()) {
                // Для текущего часа блокируем минуты, которые уже прошли
                Array.from(minutesSelect.options).forEach(option => {
                    const minute = parseInt(option.value);
                    option.disabled = (minute < minTime.getMinutes());
                });
            } else {
                // Для других часов разблокируем все минуты
                Array.from(minutesSelect.options).forEach(option => {
                    option.disabled = false;
                });
            }
        };
    }

    
    // В обработчике кнопки подтверждения времени в timePicker
    timePicker.querySelector('.confirm-time').addEventListener('click', () => {
        const hours = timePicker.querySelector('.hours-select').value;
        const minutes = timePicker.querySelector('.minutes-select').value;
        const selectedTime = `${hours}:${minutes}`;
        
        // Получаем выбранную дату (если есть)
        const selectedDate = dateInput.value ? new Date(dateInput.value) : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Проверяем, выбрана ли сегодняшняя дата
        const isTodaySelected = selectedDate && 
                            selectedDate.getDate() === today.getDate() && 
                            selectedDate.getMonth() === today.getMonth() && 
                            selectedDate.getFullYear() === today.getFullYear();
        
        if (isTodaySelected) {
            // Для сегодняшней даты применяем ограничения
            const now = new Date();
            const selectedTimeDate = new Date();
            selectedTimeDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            
            // Минимальное допустимое время - текущее время + 1 час 30 минут
            const minTime = new Date(now.getTime() + 90 * 60 * 1000);
            
            // Проверяем, что выбранное время не раньше минимального
            if (selectedTimeDate < minTime) {
                timeHint.textContent = `Минимальное время для заказа сегодня: ${minTime.getHours().toString().padStart(2, '0')}:${minTime.getMinutes().toString().padStart(2, '0')}`;
                timeHint.style.display = 'block';
                timeDisplayInput.style.borderColor = '#dc3545';
                return;
            }
            
            // Проверяем, что время не превышает 18:00
            if (parseInt(hours) >= 18) {
                timeHint.textContent = 'Рабочий день закончен. Пожалуйста, выберите другую дату.';
                timeHint.style.display = 'block';
                timeDisplayInput.style.borderColor = '#dc3545';
                return;
            }
        }
        
        // Для других дней просто проверяем, что время в рабочем диапазоне
        const hoursNum = parseInt(hours);
        if (hoursNum < 6 || hoursNum >= 18) {
            timeHint.textContent = 'Время подачи должно быть между 06:00 и 18:00';
            timeHint.style.display = 'block';
            timeDisplayInput.style.borderColor = '#dc3545';
            return;
        }
        
        // Если все проверки пройдены
        timeDisplayInput.value = selectedTime;
        timeInput.value = selectedTime;
        closeAllPickers();
        timeHint.style.display = 'none';
    });


    // Кнопки управления
    const actionButtons = document.createElement('div');
    actionButtons.style.cssText = `
        display: flex;
        gap: 15px;
        margin-top: 20px;
    `;

    const continueBtn2 = document.createElement('button');
    continueBtn2.textContent = 'Продолжить';
    continueBtn2.style.cssText = `
        flex: 1;
        padding: 14px;
        background: #1a237e;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
    `;
    continueBtn2.addEventListener('mouseenter', () => {
        continueBtn2.style.background = '#0d47a1';
        continueBtn2.style.transform = 'translateY(-2px)';
    });
    continueBtn2.addEventListener('mouseleave', () => {
        continueBtn2.style.background = '#1a237e';
        continueBtn2.style.transform = 'translateY(0)';
    });

    const backBtn1 = document.createElement('button');
    backBtn1.textContent = 'Назад';
    backBtn1.style.cssText = `
        flex: 1;
        padding: 14px;
        background: #f8f9fa;
        color: #495057;
        border: none;
        border-radius: 6px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
    `;
    backBtn1.addEventListener('mouseenter', () => {
        backBtn1.style.background = '#e9ecef';
        backBtn1.style.transform = 'translateY(-2px)';
    });
    backBtn1.addEventListener('mouseleave', () => {
        backBtn1.style.background = '#f8f9fa';
        backBtn1.style.transform = 'translateY(0)';
    });

    actionButtons.appendChild(backBtn1);
    actionButtons.appendChild(continueBtn2);

    // Собираем второй слайд
    slide2.appendChild(dateTimeTitle);
    slide2.appendChild(dateContainer);
    slide2.appendChild(timeContainer);
    slide2.appendChild(actionButtons);

    // Слайд 3 - Контактные лица (обновленный стиль)
    const slide3 = document.createElement('div');
    slide3.style.cssText = `
        padding: 30px;
        display: none;
        position: relative;
    `;

    const contactsTitle = title.cloneNode(true);
    contactsTitle.textContent = 'Контактные лица';

    // Обновленная функция создания блока контакта
    function createContactBlock(title, address, clientData) {
        const block = document.createElement('div');
        block.style.cssText = `
            margin-bottom: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 12px;
            padding: 20px;
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
        `;
        
        // Анимация при наведении на весь блок
        block.addEventListener('mouseenter', () => {
            block.style.transform = 'translateY(-3px)';
            block.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
            block.style.borderColor = '#1a237e';
        });
        
        block.addEventListener('mouseleave', () => {
            block.style.transform = 'translateY(0)';
            block.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
            block.style.borderColor = '#e0e0e0';
        });

        const blockTitle = document.createElement('h3');
        blockTitle.textContent = title;
        blockTitle.style.cssText = `
            margin: 0 0 15px 0;
            color: #1a237e;
            font-size: 18px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        
        // Иконка для заголовка блока
        const titleIcon = document.createElement('div');
        titleIcon.style.cssText = `
            width: 20px;
            height: 20px;
            color: #1a237e;
        `;
        titleIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
        `;
        blockTitle.prepend(titleIcon);

        const addressText = document.createElement('div');
        addressText.textContent = address;
        addressText.style.cssText = `
            margin-bottom: 20px;
            color: #5c6bc0;
            font-size: 15px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 6px;
        `;
        
        // Иконка адреса
        const addressIcon = document.createElement('div');
        addressIcon.style.cssText = `
            width: 16px;
            height: 16px;
            color: #5c6bc0;
        `;
        addressIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
            </svg>
        `;
        addressText.prepend(addressIcon);

        // Поле ФИО с иконкой
        const nameField = createContactInputField(
            'ФИО контактного лица', 
            'text', 
            'Введите ФИО', 
            clientData.name || '', 
            'user',
            'Пожалуйста, введите ФИО (только буквы и допустимые символы)'
        );

        // Поле телефона с иконкой
        const phoneField = createContactInputField(
            'Телефон', 
            'tel', 
            '+7 (___) ___-__-__', 
            clientData.phone || '', 
            'phone',
            'Пожалуйста, введите корректный номер телефона'
        );

        // Кнопка сброса
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Сбросить данные';
        resetBtn.style.cssText = `
            padding: 10px 15px;
            background: #f5f5f5;
            color: #1a237e;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 15px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-weight: 500;
        `;
        
        // Иконка для кнопки
        const resetIcon = document.createElement('div');
        resetIcon.style.cssText = `
            width: 16px;
            height: 16px;
        `;
        resetIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="1 4 1 10 7 10"></polyline>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
            </svg>
        `;
        resetBtn.prepend(resetIcon);
        
        // Анимация кнопки
        resetBtn.addEventListener('mouseenter', () => {
            resetBtn.style.background = '#e8eaf6';
            resetBtn.style.transform = 'translateY(-2px)';
            resetIcon.style.transform = 'rotate(-30deg)';
        });
        
        resetBtn.addEventListener('mouseleave', () => {
            resetBtn.style.background = '#f5f5f5';
            resetBtn.style.transform = 'translateY(0)';
            resetIcon.style.transform = 'rotate(0)';
        });
        
        // В функции createContactBlock измените обработчик кнопки сброса:

        resetBtn.addEventListener('click', () => {
            // Очищаем поля ввода
            nameField.input.value = '';
            phoneField.input.value = '';
            
            // Сбрасываем стили ошибок
            nameField.hint.style.display = 'none';
            phoneField.hint.style.display = 'none';
            nameField.input.style.borderColor = '#ced4da';
            phoneField.input.style.borderColor = '#ced4da';
            
            // Фокусируемся на поле ФИО для удобства ввода
            nameField.input.focus();
            
            // Анимация подтверждения сброса
            resetBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a237e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transition: all 0.3s ease;">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Поля очищены
            `;
            
            resetBtn.style.background = '#e8f5e9';
            resetBtn.style.color = '#1a237e';
            
            // Возвращаем исходное состояние через 2 секунды
            setTimeout(() => {
                resetBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="1 4 1 10 7 10"></polyline>
                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                    </svg>
                    Сбросить данные
                `;
                resetBtn.style.background = '#f5f5f5';
            }, 2000);
        });

        block.appendChild(blockTitle);
        block.appendChild(addressText);
        block.appendChild(nameField.container);
        block.appendChild(phoneField.container);
        block.appendChild(resetBtn);

        return { block, nameInput: nameField.input, phoneInput: phoneField.input, nameHint: nameField.hint, phoneHint: phoneField.hint };
    }

    // Функция создания поля ввода с иконкой для контактных данных
    function createContactInputField(labelText, inputType, placeholder, value, iconName, hintText) {
        const container = document.createElement('div');
        container.style.cssText = `
            margin-bottom: 15px;
            position: relative;
        `;

        const label = document.createElement('label');
        label.textContent = labelText;
        label.style.cssText = `
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #495057;
            font-size: 14px;
        `;

        const inputWrapper = document.createElement('div');
        inputWrapper.style.cssText = `
            position: relative;
            display: flex;
            align-items: center;
        `;

        // Иконка
        const icon = document.createElement('div');
        icon.style.cssText = `
            position: absolute;
            left: 12px;
            width: 20px;
            height: 20px;
            z-index: 2;
            color: #6c757d;
            transition: all 0.3s ease;
        `;

        // SVG иконки
        const icons = {
            'user': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
            'phone': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`
        };

        icon.innerHTML = icons[iconName] || '';
        
        const input = document.createElement('input');
        input.type = inputType;
        input.placeholder = placeholder;
        input.value = value;
        input.style.cssText = `
            width: 100%;
            padding: 12px 15px 12px 40px;
            border: 1px solid #ced4da;
            border-radius: 6px;
            font-size: 15px;
            background: white;
            transition: all 0.3s ease;
            box-sizing: border-box;
        `;
        
        // Анимация при наведении
        input.addEventListener('mouseenter', () => {
            input.style.borderColor = '#1a237e';
            input.style.boxShadow = '0 0 0 3px rgba(26, 35, 126, 0.1)';
            icon.style.color = '#1a237e';
            icon.style.transform = 'scale(1.1)';
        });
        
        input.addEventListener('mouseleave', () => {
            if (!input.matches(':focus')) {
                input.style.borderColor = '#ced4da';
                input.style.boxShadow = 'none';
                icon.style.color = '#6c757d';
                icon.style.transform = 'scale(1)';
            }
        });
        
        input.addEventListener('focus', () => {
            input.style.borderColor = '#1a237e';
            input.style.boxShadow = '0 0 0 3px rgba(26, 35, 126, 0.1)';
            icon.style.color = '#1a237e';
            icon.style.transform = 'scale(1.1)';
        });
        
        input.addEventListener('blur', () => {
            input.style.borderColor = '#ced4da';
            input.style.boxShadow = 'none';
            icon.style.color = '#6c757d';
            icon.style.transform = 'scale(1)';
        });

        // Валидация для поля ФИО
        if (labelText.includes('ФИО')) {
            input.addEventListener('input', function(e) {
                this.value = this.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s\-']/gu, '');
            });
        }
        
        // Маска для телефона
        if (inputType === 'tel') {
            input.addEventListener('input', function(e) {
                const cursorPosition = this.selectionStart;
                const isDeleting = e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward';
                
                let value = this.value.replace(/\D/g, '');
                
                let formattedValue = '';
                if (value.length > 0) {
                    if (value[0] !== '7' && value.length >= 1) {
                        value = '7' + value.substring(1);
                    }
                    
                    formattedValue = '+7 (';
                    if (value.length > 1) {
                        formattedValue += value.substring(1, 4);
                    }
                    if (value.length > 4) {
                        formattedValue += ') ' + value.substring(4, 7);
                    }
                    if (value.length > 7) {
                        formattedValue += '-' + value.substring(7, 9);
                    }
                    if (value.length > 9) {
                        formattedValue += '-' + value.substring(9, 11);
                    }
                }
                
                this.value = formattedValue;
                
                if (!isDeleting) {
                    if (cursorPosition <= 4 || this.value.length <= 4) {
                        this.setSelectionRange(4, 4);
                    } else {
                        let newCursorPosition = cursorPosition;
                        if (cursorPosition === 8 && value.length > 4) newCursorPosition += 2;
                        else if (cursorPosition === 13 && value.length > 7) newCursorPosition += 1;
                        else if (cursorPosition === 16 && value.length > 9) newCursorPosition += 1;
                        
                        this.setSelectionRange(newCursorPosition, newCursorPosition);
                    }
                }
            });

            input.addEventListener('focus', function() {
                if (!this.value || this.value === '+7 (') {
                    this.value = '+7 (';
                    this.setSelectionRange(4, 4);
                }
            });
        }

        const hint = document.createElement('div');
        hint.className = 'form-hint';
        hint.textContent = hintText;
        hint.style.cssText = `
            color: #dc3545;
            font-size: 12px;
            margin-top: 6px;
            display: none;
        `;

        inputWrapper.appendChild(icon);
        inputWrapper.appendChild(input);
        container.appendChild(label);
        container.appendChild(inputWrapper);
        container.appendChild(hint);

        return { container, input, hint };
    }

    // Создаем блоки контактных лиц
    const loadingContacts = [];
    const unloadingContacts = [];

    // Блок для загрузки
    const loadingAddress = document.querySelector('#loadingAddressesContainer input[type=text]').value;
    const loadingContact = createContactBlock('Контактное лицо на загрузке', loadingAddress, {
        name: nameInput.value,
        phone: phoneInput.value
    });
    loadingContacts.push(loadingContact);
    slide3.appendChild(loadingContact.block);

    // Блоки для промежуточных адресов
    const intermediateInputs = document.querySelectorAll('.intermediate-address-container input[type=text]');
    intermediateInputs.forEach((input, index) => {
        const contact = createContactBlock(`Контактное лицо (промежуточный адрес ${index + 1})`, input.value, {
            name: nameInput.value,
            phone: phoneInput.value
        });
        loadingContacts.push(contact);
        slide3.appendChild(contact.block);
    });

    // Блок для выгрузки
    const unloadingAddress = document.getElementById('unloadingAddress').value;
    const unloadingContact = createContactBlock('Контактное лицо на выгрузке', unloadingAddress, {
        name: nameInput.value,
        phone: phoneInput.value
    });
    unloadingContacts.push(unloadingContact);
    slide3.appendChild(unloadingContact.block);

    // Кнопки управления (остаются без изменений)
    const actionButtons2 = document.createElement('div');
    actionButtons2.style.cssText = `
        display: flex;
        gap: 15px;
        margin-top: 20px;
    `;

    const continueBtn3 = continueBtn2.cloneNode(true);
    continueBtn3.textContent = 'Продолжить';

    const backBtn2 = backBtn1.cloneNode(true);
    backBtn2.textContent = 'Назад';

    actionButtons2.appendChild(backBtn2);
    actionButtons2.appendChild(continueBtn3);
    slide3.appendChild(actionButtons2);

    // Слайд 4 - Выбор типа цены (обновленный стильный вариант)
    const slide4 = document.createElement('div');
    slide4.style.cssText = `
        padding: 30px;
        display: none;
        position: relative;
    `;

    const priceTitle = title.cloneNode(true);
    priceTitle.textContent = 'Выберите тип цены';

    const priceDescription = document.createElement('p');
    priceDescription.textContent = 'Пожалуйста, выберите тип цены, по которой вы хотите оформить заявку:';
    priceDescription.style.cssText = `
        color: #6c757d;
        margin-bottom: 25px;
        text-align: center;
        font-size: 15px;
    `;

    // Подсказка о выборе цены
    const priceHint = document.createElement('div');
    priceHint.className = 'form-hint';
    priceHint.style.cssText = `
        color: #dc3545;
        font-size: 14px;
        margin-top: -15px;
        margin-bottom: 20px;
        display: none;
        text-align: center;
        transition: all 0.3s ease;
    `;
    priceHint.textContent = 'Пожалуйста, выберите тип цены';

    // Контейнер для вариантов цены
    const priceOptions = document.createElement('div');
    priceOptions.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin-bottom: 25px;
    `;
    priceOptions.id = 'priceOptions';

    // Функция создания стильной карточки цены (без галочки)
    function createPriceCard(type, price, description) {
        const card = document.createElement('div');
        card.className = 'price-card';
        card.dataset.type = type;
        card.style.cssText = `
            position: relative;
            border-radius: 16px;
            padding: 25px;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
            background: white;
            border: 1px solid #e0e0e0;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        `;
        
        // Эффект при наведении
        card.addEventListener('mouseenter', () => {
            if (!card.classList.contains('selected')) {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = '0 10px 25px rgba(26, 35, 126, 0.15)';
                card.style.borderColor = '#1a237e';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('selected')) {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
                card.style.borderColor = '#e0e0e0';
            }
        });

        // Индикатор выбора (анимированная полоска)
        const selectionIndicator = document.createElement('div');
        selectionIndicator.className = 'selection-indicator';
        selectionIndicator.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, #1a237e, #0d47a1);
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        `;
        card.appendChild(selectionIndicator);

        // Контент карточки
        const cardContent = document.createElement('div');
        cardContent.style.cssText = `
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            gap: 12px;
        `;

        // Заголовок и цена в одной строке
        const headerRow = document.createElement('div');
        headerRow.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
        `;

        const titleElement = document.createElement('h3');
        titleElement.textContent = type === 'noVAT' ? 'Без НДС' : 'С НДС';
        titleElement.style.cssText = `
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: #212529;
            transition: color 0.3s ease;
        `;

        const priceElement = document.createElement('div');
        priceElement.textContent = `${price} ₽`;
        priceElement.style.cssText = `
            font-size: 22px;
            font-weight: 700;
            color: #1a237e;
            transition: color 0.3s ease;
        `;

        // Описание
        const descElement = document.createElement('p');
        descElement.textContent = description;
        descElement.style.cssText = `
            margin: 0;
            color: #6c757d;
            font-size: 14px;
            line-height: 1.5;
            transition: color 0.3s ease;
        `;

        // Собираем карточку (без галочки)
        headerRow.appendChild(titleElement);
        headerRow.appendChild(priceElement);
        cardContent.appendChild(headerRow);
        cardContent.appendChild(descElement);
        card.appendChild(cardContent);

        // Обработчик выбора
        card.addEventListener('click', function() {
            // Удаляем выделение у всех карточек
            document.querySelectorAll('.price-card').forEach(c => {
                c.classList.remove('selected');
                c.style.background = 'white';
                c.style.borderColor = '#e0e0e0';
                c.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
                c.querySelector('.selection-indicator').style.transform = 'scaleX(0)';
                c.querySelector('h3').style.color = '#212529';
                c.querySelector('p').style.color = '#6c757d';
            });

            // Применяем стили к выбранной карточке
            this.classList.add('selected');
            this.style.background = '#f8f9fa';
            this.style.borderColor = '#1a237e';
            this.style.boxShadow = '0 5px 15px rgba(26, 35, 126, 0.15)';
            this.querySelector('.selection-indicator').style.transform = 'scaleX(1)';
            this.querySelector('h3').style.color = '#1a237e';
            this.querySelector('p').style.color = '#495057';

            // Сохраняем выбор
            applicationData.priceType = type;

            // Скрываем подсказку о необходимости выбрать цену
            priceHint.style.display = 'none';
        });

        return card;
    }

    // Получаем цены из интерфейса
    const priceNoVAT = document.getElementById('costNoVAT')?.textContent || '0';
    const priceWithVAT = document.getElementById('costWithVAT')?.textContent || '0';

    // Создаем карточки цен
    const noVATCard = createPriceCard(
        'noVAT', 
        priceNoVAT, 
        'Идеально для ИП и компаний на УСН. Цена указана без учета НДС 20%.'
    );

    const withVATCard = createPriceCard(
        'withVAT', 
        priceWithVAT, 
        'Подходит для компаний на ОСНО. Включен НДС 20%.'
    );

    priceOptions.appendChild(noVATCard);
    priceOptions.appendChild(withVATCard);

    // Кнопки управления
    const actionButtons3 = document.createElement('div');
    actionButtons3.style.cssText = `
        display: flex;
        gap: 15px;
        margin-top: 30px;
    `;

    const continueBtn4 = document.createElement('button');
    continueBtn4.textContent = 'Продолжить';
    continueBtn4.style.cssText = `
        flex: 1;
        padding: 16px;
        background: linear-gradient(135deg, #1a237e, #0d47a1);
        color: white;
        border: none;
        border-radius: 10px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(26, 35, 126, 0.3);
        position: relative;
        overflow: hidden;
    `;

    // Эффект при наведении на кнопку
    continueBtn4.addEventListener('mouseenter', () => {
        continueBtn4.style.transform = 'translateY(-3px)';
        continueBtn4.style.boxShadow = '0 7px 20px rgba(26, 35, 126, 0.4)';
    });

    continueBtn4.addEventListener('mouseleave', () => {
        continueBtn4.style.transform = 'translateY(0)';
        continueBtn4.style.boxShadow = '0 4px 15px rgba(26, 35, 126, 0.3)';
    });

    const backBtn3 = document.createElement('button');
    backBtn3.textContent = 'Назад';
    backBtn3.style.cssText = `
        flex: 1;
        padding: 16px;
        background: white;
        color: #495057;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
    `;

    backBtn3.addEventListener('mouseenter', () => {
        backBtn3.style.background = '#f8f9fa';
        backBtn3.style.transform = 'translateY(-3px)';
        backBtn3.style.borderColor = '#1a237e';
    });

    backBtn3.addEventListener('mouseleave', () => {
        backBtn3.style.background = 'white';
        backBtn3.style.transform = 'translateY(0)';
        backBtn3.style.borderColor = '#e0e0e0';
    });

    actionButtons3.appendChild(backBtn3);
    actionButtons3.appendChild(continueBtn4);

    // Собираем четвертый слайд
    slide4.appendChild(priceTitle);
    slide4.appendChild(priceDescription);
    slide4.appendChild(priceHint);
    slide4.appendChild(priceOptions);
    slide4.appendChild(actionButtons3);

    // Слайд 5 - Подтверждение данных
    const slide5 = document.createElement('div');
    slide5.style.cssText = `
        padding: 30px;
        display: none;
        position: relative;
    `;

    const confirmTitle = title.cloneNode(true);
    confirmTitle.textContent = 'Подтверждение данных';

    // Обновленная функция createDataBlock для всех устройств
    function createDataBlock(title, data) {
        const block = document.createElement('div');
        block.style.cssText = `
            margin-bottom: 20px;
            border-radius: 12px;
            padding: 0;
            background: white;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            overflow: hidden;
            transition: all 0.3s ease;
            border: 1px solid rgba(74,107,223,0.1);
        `;
        
        // Заголовок блока с градиентом
        const blockTitle = document.createElement('div');
        blockTitle.textContent = title;
        blockTitle.style.cssText = `
            padding: 14px 20px;
            margin: 0;
            color: white;
            font-size: 16px;
            font-weight: 600;
            background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
            position: relative;
        `;
        
        // Декоративный элемент в заголовке
        const titleDecoration = document.createElement('div');
        titleDecoration.style.cssText = `
            position: absolute;
            top: 0;
            right: 0;
            width: 30px;
            height: 100%;
            background: rgba(255,255,255,0.15);
            clip-path: polygon(100% 0, 100% 100%, 0 100%);
        `;
        blockTitle.appendChild(titleDecoration);

        // Контейнер для данных
        const dataContainer = document.createElement('div');
        dataContainer.style.cssText = `
            padding: 18px 20px;
            display: flex;
            flex-direction: column;
            gap: 14px;
        `;

        Object.entries(data).forEach(([key, value]) => {
            const row = document.createElement('div');
            row.style.cssText = `
                display: flex;
                flex-direction: column;
                padding-bottom: 12px;
                border-bottom: 1px dashed #e9ecef;
                gap: 5px;
            `;
            
            const label = document.createElement('span');
            label.style.cssText = `
                font-weight: 500;
                color: #6c757d;
                font-size: 14px;
                margin-bottom: 3px;
            `;
            label.textContent = key;

            const val = document.createElement('div');
            val.style.cssText = `
                color: #212529;
                word-break: break-word;
                font-weight: 500;
                font-size: 14px;
                padding-left: 12px;
                border-left: 3px solid #1a237e;
                white-space: pre;
            `;

            // Особое форматирование для характеристик
            if (key === 'Характеристики') {
                val.style.whiteSpace = 'pre-line';
                val.style.lineHeight = '1.5';
                val.textContent = value;
            } else {
                val.textContent = value || '   Не указано';
            }

            row.appendChild(label);
            row.appendChild(val);
            dataContainer.appendChild(row);
        });

        block.appendChild(blockTitle);
        block.appendChild(dataContainer);
        return block;
    }

    // Блок данных клиента
    const clientDataBlock = createDataBlock('Данные заказчика', {
        'ФИО': applicationData.clientInfo?.name,
        'Телефон': applicationData.clientInfo?.phone,
        'Email': applicationData.clientInfo?.email
    });

    // Блок даты и времени
    const dateTimeBlock = createDataBlock('Дата и время подачи', {
        'Дата': applicationData.dates?.deliveryDate ? new Date(applicationData.dates.deliveryDate).toLocaleDateString('ru-RU') : '',
        'Время': applicationData.dates?.deliveryTime
    });

    // Обновленная функция для создания блоков контактов
    function createContactsBlock(title, contacts) {
        const block = document.createElement('div');
        block.style.cssText = `
            margin-bottom: 20px;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
            background: white;
        `;
        
        // Анимация при наведении
        block.addEventListener('mouseenter', () => {
            block.style.transform = 'translateY(-3px)';
            block.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
        });
        block.addEventListener('mouseleave', () => {
            block.style.transform = 'translateY(0)';
            block.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
        });

        // Заголовок блока
        const blockTitle = document.createElement('div');
        blockTitle.textContent = title;
        blockTitle.style.cssText = `
            padding: 14px 20px;
            margin: 0;
            color: white;
            font-size: 16px;
            font-weight: 600;
            background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
            position: relative;
        `;
        
        // Декоративный элемент
        const titleDecoration = document.createElement('div');
        titleDecoration.style.cssText = `
            position: absolute;
            top: 0;
            right: 0;
            width: 30px;
            height: 100%;
            background: rgba(255,255,255,0.15);
            clip-path: polygon(100% 0, 100% 100%, 0 100%);
        `;
        blockTitle.appendChild(titleDecoration);

        const contactsContainer = document.createElement('div');
        contactsContainer.style.cssText = `
            padding: 15px;
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
            background: white;
        `;

        contacts.forEach((contact, index) => {
            const contactBlock = document.createElement('div');
            contactBlock.style.cssText = `
                padding: 15px;
                background: #f8f9fa;
                border-radius: 8px;
                border-left: 3px solid #1a237e;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            `;
            
            // Эффект при наведении
            contactBlock.addEventListener('mouseenter', () => {
                contactBlock.style.background = '#f1f3ff';
                contactBlock.style.transform = 'translateX(3px)';
            });
            contactBlock.addEventListener('mouseleave', () => {
                contactBlock.style.background = '#f8f9fa';
                contactBlock.style.transform = 'translateX(0)';
            });

            // Декоративный номер контакта
            const contactNumber = document.createElement('div');
            contactNumber.textContent = index + 1;
            contactNumber.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                width: 22px;
                height: 22px;
                background: rgba(74,107,223,0.1);
                color: #1a237e;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
            `;

            const address = document.createElement('div');
            address.textContent = contact.address;
            address.style.cssText = `
                font-weight: 500;
                margin-bottom: 10px;
                color: #495057;
                font-size: 14px;
                padding-right: 20px;
            `;

            const name = document.createElement('div');
            name.style.cssText = 'margin-bottom: 6px; font-size: 13px;';
            name.innerHTML = `<span style="color:#6c757d;">ФИО:</span> <span style="color:#212529; font-weight:500;">${contact.name}</span>`;

            const phone = document.createElement('div');
            phone.innerHTML = `<span style="color:#6c757d;">Телефон:</span> <span style="color:#212529; font-weight:500;">${contact.phone}</span>`;
            phone.style.cssText = 'font-size: 13px;';

            contactBlock.appendChild(contactNumber);
            contactBlock.appendChild(address);
            contactBlock.appendChild(name);
            contactBlock.appendChild(phone);
            contactsContainer.appendChild(contactBlock);
        });

        block.appendChild(blockTitle);
        block.appendChild(contactsContainer);
        return block;
    }

    // Добавляем блоки в слайд 5
    slide5.appendChild(confirmTitle);
    slide5.appendChild(clientDataBlock);
    slide5.appendChild(dateTimeBlock);

    if (applicationData.loadingContacts?.length) {
        const loadingBlock = createContactsBlock('Контактные лица на загрузке', applicationData.loadingContacts);
        slide5.appendChild(loadingBlock);
    }

    if (applicationData.unloadingContacts?.length) {
        const unloadingBlock = createContactsBlock('Контактные лица на выгрузке', applicationData.unloadingContacts);
        slide5.appendChild(unloadingBlock);
    }

    // Блок выбранной цены
    const priceData = {
        'noVAT': document.getElementById('costNoVAT')?.textContent || '0',
        'withVAT': document.getElementById('costWithVAT')?.textContent || '0'
    };

    const priceBlock = createDataBlock('Выбранная цена', {
        'Тип цены': applicationData.priceType === 'noVAT' ? 'Цена без НДС' : 'Цена с НДС',
        'Сумма': `${applicationData.priceType === 'noVAT' ? priceData.noVAT : priceData.withVAT} ₽`
    });
    slide5.appendChild(priceBlock);

    // Кнопки управления
    const actionButtons4 = document.createElement('div');
    actionButtons4.style.cssText = `
        display: flex;
        gap: 15px;
        margin-top: 20px;
    `;

    const submitBtnFinal = document.createElement('button');
    submitBtnFinal.textContent = 'Отправить заявку';
    submitBtnFinal.style.cssText = `
        flex: 1;
        padding: 14px;
        background: #1a237e;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
    `;
    submitBtnFinal.addEventListener('mouseenter', () => {
        submitBtnFinal.style.background = '#0d47a1';
        submitBtnFinal.style.transform = 'translateY(-2px)';
    });
    submitBtnFinal.addEventListener('mouseleave', () => {
        submitBtnFinal.style.background = '#1a237e';
        submitBtnFinal.style.transform = 'translateY(0)';
    });

    const backBtn4 = document.createElement('button');
    backBtn4.textContent = 'Назад';
    backBtn4.style.cssText = `
        flex: 1;
        padding: 14px;
        background: #f8f9fa;
        color: #495057;
        border: none;
        border-radius: 6px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
    `;
    backBtn4.addEventListener('mouseenter', () => {
        backBtn4.style.background = '#e9ecef';
        backBtn4.style.transform = 'translateY(-2px)';
    });
    backBtn4.addEventListener('mouseleave', () => {
        backBtn4.style.background = '#f8f9fa';
        backBtn4.style.transform = 'translateY(0)';
    });

    actionButtons4.appendChild(backBtn4);
    actionButtons4.appendChild(submitBtnFinal);
    slide5.appendChild(actionButtons4);

    // Добавляем слайды в модальное окно
    modalContent.appendChild(slide1);
    modalContent.appendChild(slide2);
    modalContent.appendChild(slide3);
    modalContent.appendChild(slide4);
    modalContent.appendChild(slide5);

    // Добавляем календарь и timePicker в модальное окно
    modal.appendChild(calendar);
    modal.appendChild(timePicker);


    document.body.appendChild(modal);

    // Анимация появления
    setTimeout(() => {
        modal.style.opacity = '1';
        modalContent.style.transform = 'translateY(0)';
    }, 10);

    // Валидация
    function validatePhone(phone) {
        return /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(phone);
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return re.test(email);
    }

    // Модифицируем функцию валидации поля
    function validateField(input, hint, validator = null) {
        let isValid;
        if (validator) {
            isValid = validator(input.value);
        } else {
            isValid = input.value.trim();
        }
        
        if (!isValid) {
            hint.style.display = 'block';
            input.style.borderColor = '#dc3545';
            return false;
        } else {
            hint.style.display = 'none';
            input.style.borderColor = '#ced4da';
            return true;
        }
    }

    // Обработчики полей
    nameInput.addEventListener('blur', () => {
        validateField(nameInput, nameHint, validateName);
    });
    phoneInput.addEventListener('blur', () => validateField(phoneInput, phoneHint, validatePhone));
    emailInput.addEventListener('blur', () => validateField(emailInput, emailHint, validateEmail));

    // Проверка даты
    function validateDate() {
        if (!dateInput.value) {
            dateHint.style.display = 'block';
            dateDisplayInput.style.borderColor = '#dc3545';
            return false;
        } else {
            dateHint.style.display = 'none';
            dateDisplayInput.style.borderColor = '#ced4da';
            return true;
        }
    }

    function validateTime() {
        if (!timeInput.value) {
            timeHint.textContent = 'Пожалуйста, укажите время подачи';
            timeHint.style.display = 'block';
            timeDisplayInput.style.borderColor = '#dc3545';
            return false;
        }
        
        const [hours, minutes] = timeInput.value.split(':').map(Number);
        const selectedDate = dateInput.value ? new Date(dateInput.value) : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Проверяем, выбрана ли сегодняшняя дата
        const isTodaySelected = selectedDate && 
                            selectedDate.getDate() === today.getDate() && 
                            selectedDate.getMonth() === today.getMonth() && 
                            selectedDate.getFullYear() === today.getFullYear();
        
        if (isTodaySelected) {
            // Для сегодняшней даты проверяем минимальное время
            const now = new Date();
            const selectedTimeDate = new Date();
            selectedTimeDate.setHours(hours, minutes, 0, 0);
            
            const minTime = new Date(now.getTime() + 90 * 60 * 1000); // 90 минут в мс
            
            if (selectedTimeDate < minTime) {
                timeHint.textContent = `Минимальное время для заказа сегодня: ${minTime.getHours().toString().padStart(2, '0')}:${minTime.getMinutes().toString().padStart(2, '0')}`;
                timeHint.style.display = 'block';
                timeDisplayInput.style.borderColor = '#dc3545';
                return false;
            }
        }
        
        // Проверяем, что время в рабочем диапазоне для всех дней
        if (hours < 6 || hours > 18) {
            timeHint.textContent = 'Время подачи должно быть между 06:00 и 18:00';
            timeHint.style.display = 'block';
            timeDisplayInput.style.borderColor = '#dc3545';
            return false;
        }
        
        timeHint.style.display = 'none';
        timeDisplayInput.style.borderColor = '#ced4da';
        return true;
    }

    // Обработчик кнопки Продолжить (1) - переход к дате/времени
    continueBtn1.addEventListener('click', function() {
        const isNameValid = validateField(nameInput, nameHint);
        const isPhoneValid = validateField(phoneInput, phoneHint, validatePhone);
        const isEmailValid = validateField(emailInput, emailHint, validateEmail);

        if (isNameValid && isPhoneValid && isEmailValid) {
            // Сохраняем данные при первом переходе
            applicationData.clientInfo = {
                name: nameInput.value.trim(),
                phone: phoneInput.value.trim(),
                email: emailInput.value.trim()
            };
            
            // Обновляем прогресс и переходим к слайду 2
            updateProgress(2);
            slide1.style.display = 'none';
            slide2.style.display = 'block';
            modalContent.scrollTop = 0;
        } else {
            const firstError = modalContent.querySelector('.form-hint[style*="display: block"]');
            if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });

    // Обработчик кнопки Назад (1) - возврат к данным клиента
    backBtn1.addEventListener('click', function() {
        closeAllPickers();
        updateProgress(1);
        slide2.style.display = 'none';
        slide1.style.display = 'block';
        modalContent.scrollTop = 0;
    });

    // Обработчик кнопки Продолжить (2) - переход к контактам
    continueBtn2.addEventListener('click', function() {
        const isDateValid = validateDate();
        const isTimeValid = validateTime();

        if (isDateValid && isTimeValid) {
            applicationData.dates = {
                deliveryDate: dateInput.value,
                deliveryTime: timeInput.value
            };
            
            // Обновляем контактные данные из первого слайда
            loadingContacts.forEach(contact => {
                if (!contact.nameInput.value) {
                    contact.nameInput.value = applicationData.clientInfo.name;
                    contact.phoneInput.value = applicationData.clientInfo.phone;
                }
            });
            
            unloadingContacts.forEach(contact => {
                if (!contact.nameInput.value) {
                    contact.nameInput.value = applicationData.clientInfo.name;
                    contact.phoneInput.value = applicationData.clientInfo.phone;
                }
            });
            
            // Обновляем прогресс и переходим к слайду 3
            updateProgress(3);
            slide2.style.display = 'none';
            slide3.style.display = 'block';
            modalContent.scrollTop = 0;
        } else {
            const firstError = modalContent.querySelector('.form-hint[style*="display: block"]');
            if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });

    // Обработчик кнопки Назад (2) - возврат к дате/времени
    backBtn2.addEventListener('click', function() {
        updateProgress(2);
        slide3.style.display = 'none';
        slide2.style.display = 'block';
        modalContent.scrollTop = 0;
    });

    // Обработчик кнопки Продолжить (3) - переход к выбору цены
    continueBtn3.addEventListener('click', function() {
        // Проверяем, что все контактные данные заполнены
        let allContactsValid = true;
        
        loadingContacts.forEach(contact => {
            if (!contact.nameInput.value.trim()) {
                contact.nameHint.style.display = 'block';
                contact.nameInput.style.borderColor = '#dc3545';
                allContactsValid = false;
            } else {
                contact.nameHint.style.display = 'none';
                contact.nameInput.style.borderColor = '#ced4da';
            }
            
            if (!validatePhone(contact.phoneInput.value)) {
                contact.phoneHint.style.display = 'block';
                contact.phoneInput.style.borderColor = '#dc3545';
                allContactsValid = false;
            } else {
                contact.phoneHint.style.display = 'none';
                contact.phoneInput.style.borderColor = '#ced4da';
            }
        });
        
        unloadingContacts.forEach(contact => {
            if (!contact.nameInput.value.trim()) {
                contact.nameHint.style.display = 'block';
                contact.nameInput.style.borderColor = '#dc3545';
                allContactsValid = false;
            } else {
                contact.nameHint.style.display = 'none';
                contact.nameInput.style.borderColor = '#ced4da';
            }
            
            if (!validatePhone(contact.phoneInput.value)) {
                contact.phoneHint.style.display = 'block';
                contact.phoneInput.style.borderColor = '#dc3545';
                allContactsValid = false;
            } else {
                contact.phoneHint.style.display = 'none';
                contact.phoneInput.style.borderColor = '#ced4da';
            }
        });
        
        if (!allContactsValid) {
            const firstError = modalContent.querySelector('.form-hint[style*="display: block"]');
            if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        
        // Сохраняем контактные данные
        const loadingContactsData = loadingContacts.map(contact => ({
            address: contact.block.querySelector('div:nth-child(2)').textContent,
            name: contact.nameInput.value,
            phone: contact.phoneInput.value
        }));

        const unloadingContactsData = unloadingContacts.map(contact => ({
            address: contact.block.querySelector('div:nth-child(2)').textContent,
            name: contact.nameInput.value,
            phone: contact.phoneInput.value
        }));

        applicationData.loadingContacts = loadingContactsData;
        applicationData.unloadingContacts = unloadingContactsData;
        
        // Обновляем прогресс и переходим к слайду 4
        updateProgress(4);
        slide3.style.display = 'none';
        slide4.style.display = 'block';
        modalContent.scrollTop = 0;
    });

    // Обработчик кнопки Назад (3) - возврат к контактам
    backBtn3.addEventListener('click', function() {
        updateProgress(3);
        slide4.style.display = 'none';
        slide3.style.display = 'block';
        modalContent.scrollTop = 0;
    });

    // Обработчик кнопки Продолжить (4) - переход к подтверждению
    continueBtn4.addEventListener('click', function() {
        // Проверяем, что выбран тип цены
        if (!applicationData.priceType) {
            priceHint.style.display = 'block';
            priceHint.style.animation = 'shake 0.5s';
            setTimeout(() => {
                priceHint.style.animation = '';
            }, 500);
            priceHint.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        
        // Сохраняем все данные перед переходом
        applicationData.clientInfo = {
            name: nameInput.value.trim(),
            phone: phoneInput.value.trim(),
            email: emailInput.value.trim()
        };
        
        // Обновляем контактные данные
        applicationData.loadingContacts = loadingContacts.map(contact => ({
            address: contact.block.querySelector('div:nth-child(2)').textContent,
            name: contact.nameInput.value,
            phone: contact.phoneInput.value
        }));
        
        applicationData.unloadingContacts = unloadingContacts.map(contact => ({
            address: contact.block.querySelector('div:nth-child(2)').textContent,
            name: contact.nameInput.value,
            phone: contact.phoneInput.value
        }));
        
        // Обновляем прогресс и переходим к слайду 5
        updateProgress(5);
        slide4.style.display = 'none';
        slide5.style.display = 'block';
        
        // Обновляем блоки данных на 5-м слайде
        updateConfirmationData();
        modalContent.scrollTop = 0;
    });

    // Обработчик кнопки Назад (4) - возврат к выбору цены
    backBtn4.addEventListener('click', function() {
        updateProgress(4);
        slide5.style.display = 'none';
        slide4.style.display = 'block';
        modalContent.scrollTop = 0;
    });

    // Обработчик кнопки Отправить заявку (финальная)
    submitBtnFinal.addEventListener('click', function() {
        // Проверка согласия на обработку данных
        const consentCheckbox = slide5.querySelector('.consent-checkbox');
        const checkmark = consentCheckbox.querySelector('div');
        const isChecked = checkmark && checkmark.style.opacity === '1';
        
        if (!isChecked) {
            const consentContainer = consentCheckbox.parentElement;
            const existingError = consentContainer.querySelector('.consent-error');
            if (existingError) {
                consentContainer.removeChild(existingError);
            }
            
            const errorMessage = document.createElement('div');
            errorMessage.textContent = 'Необходимо согласие на обработку персональных данных';
            errorMessage.style.cssText = `
                color: #dc3545;
                margin-top: 10px;
                font-size: 14px;
            `;
            errorMessage.className = 'consent-error';
            consentContainer.appendChild(errorMessage);
            
            consentContainer.style.animation = 'shake 0.5s';
            setTimeout(() => {
                consentContainer.style.animation = '';
            }, 500);
            
            consentContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // Собираем все данные для отправки
        const fullApplicationData = {
            ...applicationData,
            transportType: document.querySelector('.checkbox.checked')?.textContent.trim(),
            cargoType: document.getElementById('cargoType')?.value,
            loadersCount: parseInt(document.getElementById('loadersCount')?.textContent) || 0,
            expediting: document.getElementById('expeditingCheckmark')?.style.display === 'block',
            insurance: document.getElementById('insuranceCheckmark')?.style.display === 'block',
            totalNoVAT: parseInt(document.getElementById('costNoVAT')?.textContent) || 0,
            totalWithVAT: parseInt(document.getElementById('costWithVAT')?.textContent) || 0,
            intermediateAddresses: Array.from(document.querySelectorAll('.intermediate-address-container input[type=text]')).map(input => ({
                address: input.value,
                loadingMethod: document.querySelector(`#loadingOptions_${input.id} input[type=radio]:checked`)?.value || 'Не указано'
            })),
            mainLoadingMethod: document.querySelector('#loadingOptions input[type=radio]:checked')?.value || 'Не указано',
            unloadingMethod: document.querySelector('#unloadOptions input[type=radio]:checked')?.value || 'Не указано',
            consentGiven: true
        };

        // Форматируем данные для письма
        const formattedData = formatEmailData(fullApplicationData);
        
        // Сразу закрываем модальное окно
        modal.style.opacity = '0';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
        
        // Показываем сообщение об успешной отправке
        const successModal = showSuccessMessage();
        
        // Отправляем письмо через EmailJS (в фоне)
        sendEmail(formattedData)
            .catch(error => {
                console.error('Ошибка отправки:', error);
                
                // Закрываем сообщение об успехе (если оно еще открыто)
                if (successModal && successModal.parentNode) {
                    successModal.parentNode.removeChild(successModal);
                }
                
                // Показываем сообщение об ошибке
                showErrorMessage();
            });
    });
    
    // Функция для форматирования данных в текст письма
    function formatEmailData(data) {
        // Определяем тип услуги
        const isLoaders = document.getElementById('checkbox-loaders').classList.contains('checked');
        const isAuto = document.getElementById('checkbox-auto').classList.contains('checked');
        const isSpecial = document.getElementById('checkbox-special').classList.contains('checked');
        
        let serviceType = 'Не определено';
        if (isLoaders) serviceType = 'Услуги грузчиков';
        if (isAuto) serviceType = 'Автоперевозки';
        if (isSpecial) serviceType = 'Спецтехника';

        let message = `
        Новая заявка на грузоперевозку
        ==============================

        Данные клиента:
        -------------
        ФИО: ${data.clientInfo.name}
        Телефон: ${data.clientInfo.phone}
        Email: ${data.clientInfo.email}

        Основные данные:
        ---------------
        Тип услуги: ${serviceType}
        Тип груза: ${document.getElementById('cargoType')?.value || 'Не указано'}`;

        // Время работы/подачи
        if (isLoaders) {
            const timeCheckbox = document.querySelector('#kolyan-container .kolyan-checkbox div[style*="display: block"]');
            if (timeCheckbox) {
                message += `\nВремя работы: ${timeCheckbox.parentElement.dataset.value || 4} ч.`;
            }
        } else {
            message += `\nМинимальное время: ${document.getElementById('minTimeCar')?.innerText || 0} ч.`;
        }

        // Характеристики транспорта (не показываем для грузчиков)
        if (selectedCar && !isLoaders) {
            message += `\n\nХарактеристики транспорта:
            ------------------------
            Транспорт: ${selectedCar.name || 'Не указано'}`;
                
            // Общие параметры
            if (selectedCar.length && selectedCar.width && selectedCar.height) {
                message += `\nГабариты: ${selectedCar.length} × ${selectedCar.width} × ${selectedCar.height}`;
            }
            if (selectedCar.tonnage) {
                message += `\nГрузоподъемность: ${selectedCar.tonnage}`;
            }

            // Параметры для спецтехники
            if (isSpecial) {
                if (selectedCar.boom_length) {
                    message += `\nДлина стрелы: ${selectedCar.boom_length}`;
                }
                if (selectedCar.boom_tonnage) {
                    message += `\nГрузоподъемность стрелы: ${selectedCar.boom_tonnage}`;
                }
            }
            
            // Параметры для авто
            if (isAuto && selectedCar.palets) {
                message += `\nВместимость (евро паллет): ${selectedCar.palets}`;
            }
        }

        // Проверяем, есть ли доп. услуги
        const loadersCounter = document.querySelector('.counter-btn + span');
        const loadersCount = loadersCounter ? parseInt(loadersCounter.textContent) || 0 : 0;
        const hasExpediting = document.getElementById('expeditingCheckmark')?.style.display === 'block';
        const hasInsurance = document.getElementById('insuranceCheckmark')?.style.display === 'block';

        // Дополнительные услуги (показываем только если есть хотя бы одна)
        if (loadersCount > 0 || hasExpediting || hasInsurance) {
            message += `\n\nДополнительные услуги:
            ----------------------`;
            
            if (loadersCount > 0) {
                message += `\nКоличество грузчиков: ${loadersCount} чел.`;
            }
            if (hasExpediting) {
                message += `\nЭкспедирование: Да`;
            }
            if (hasInsurance) {
                message += `\nСтрахование: Да`;
            }
        }

        // Дата и время
        message += `\n\nДата и время подачи:
            ------------------
            Дата: ${data.dates.deliveryDate ? new Date(data.dates.deliveryDate).toLocaleDateString('ru-RU') : 'Не указано'}
            Время: ${data.dates.deliveryTime || 'Не указано'}`;

        // Контактные лица и маршрут
        message += `\n\nКонтактные лица и маршрут:
            --------------------------`;
        
        // Основная загрузка
        if (data.loadingContacts?.length > 0) {
            const address = (data.loadingContacts[0].address || '').trim();
            message += `\n[Основная загрузка]\nАдрес: ${address}\nФИО: ${data.loadingContacts[0].name}\nТелефон: ${data.loadingContacts[0].phone}`;
            
            // Добавляем способ загрузки (только для авто)
            if (isAuto) {
                const loadingMethod = document.querySelector('#loadingOptions input[type=radio]:checked')?.value || 'Не указано';
                message += `\nСпособ загрузки: ${loadingMethod}`;
            }
        }
        
        // Промежуточные адреса
        if (data.intermediateAddresses?.length > 0) {
            data.intermediateAddresses.forEach((addressData, index) => {
                const address = (addressData.address || '').trim();
                message += `\n\n[Промежуточный адрес ${index + 1}]\nАдрес: ${address}`;
                
                // Добавляем способ загрузки/выгрузки для промежуточных адресов (только для авто)
                if (isAuto && addressData.loadingMethod) {
                    message += `\nСпособ заг/выг: ${addressData.loadingMethod}`;
                }
            });
        }
        
        // Выгрузка
        if (data.unloadingContacts?.length > 0) {
            data.unloadingContacts.forEach((contact, index) => {
                const address = (contact.address || '').trim();
                const prefix = data.unloadingContacts.length > 1 ? `[Выгрузка ${index + 1}]` : '[Выгрузка]';
                message += `\n\n${prefix}\nАдрес: ${address}\nФИО: ${contact.name}\nТелефон: ${contact.phone}`;
                
                // Добавляем способ выгрузки (только для авто)
                if (isAuto && data.unloadingMethod) {
                    message += `\nСпособ выгрузки: ${data.unloadingMethod}`;
                }
            });
        }

        // Стоимость
        const priceNoVAT = document.getElementById('costNoVAT')?.textContent || '0';
        const priceWithVAT = document.getElementById('costWithVAT')?.textContent || '0';
        
        message += `\n\nСтоимость:
        ---------
        Тип цены: ${data.priceType === 'noVAT' ? 'Без НДС' : 'С НДС'}
        Сумма: ${data.priceType === 'noVAT' ? priceNoVAT : priceWithVAT} ₽`;

        return message;
    }

    // Функция для отправки письма через EmailJS
    function sendEmail(message) {
        // Инициализация EmailJS (должна быть выполнена один раз при загрузке страницы)
        // Добавьте этот код в начало вашего скрипта:
        // emailjs.init("YOUR_USER_ID"); // Замените на ваш User ID из EmailJS
        
        return emailjs.send("service_01mhz7f", "template_ib05vz3", {
            to_name: "Ваше имя", // Замените на ваше имя
            from_name: applicationData.clientInfo.name,
            message: message,
            reply_to: applicationData.clientInfo.email
        });
    }

    // Функция показа сообщения об ошибке
    function showErrorMessage() {
        const errorModal = document.createElement('div');
        errorModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const errorContent = document.createElement('div');
        errorContent.style.cssText = `
            background: white;
            border-radius: 12px;
            width: 90%;
            max-width: 500px;
            padding: 30px;
            text-align: center;
            transform: scale(0.9);
            transition: all 0.3s ease;
        `;

        const errorIcon = document.createElement('div');
        errorIcon.innerHTML = `
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#dc3545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;

        const errorTitle = document.createElement('h3');
        errorTitle.textContent = 'Ошибка отправки';
        errorTitle.style.cssText = `
            margin: 20px 0 10px;
            color: #212529;
            font-size: 22px;
            font-weight: 600;
        `;

        const errorText = document.createElement('p');
        errorText.textContent = 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз или свяжитесь с нами по телефону.';
        errorText.style.cssText = `
            color: #6c757d;
            margin-bottom: 25px;
            line-height: 1.5;
        `;

        const retryBtn = document.createElement('button');
        retryBtn.textContent = 'Попробовать снова';
        retryBtn.style.cssText = `
            padding: 12px 24px;
            background: #1a237e;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-right: 10px;
        `;
        retryBtn.addEventListener('mouseenter', () => {
            retryBtn.style.background = '#0d47a1';
        });
        retryBtn.addEventListener('mouseleave', () => {
            retryBtn.style.background = '#1a237e';
        });
        retryBtn.addEventListener('click', () => {
            errorModal.remove();
            showApplicationModal(); // Показываем форму заново
        });

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Закрыть';
        cancelBtn.style.cssText = `
            padding: 12px 24px;
            background: #f8f9fa;
            color: #495057;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
        `;
        cancelBtn.addEventListener('mouseenter', () => {
            cancelBtn.style.background = '#e9ecef';
        });
        cancelBtn.addEventListener('mouseleave', () => {
            cancelBtn.style.background = '#f8f9fa';
        });
        cancelBtn.addEventListener('click', () => {
            errorModal.remove();
            window.location.reload();
        });

        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = 'display: flex; justify-content: center; margin-top: 20px;';
        buttonsContainer.appendChild(retryBtn);
        buttonsContainer.appendChild(cancelBtn);

        errorContent.appendChild(errorIcon);
        errorContent.appendChild(errorTitle);
        errorContent.appendChild(errorText);
        errorContent.appendChild(buttonsContainer);
        errorModal.appendChild(errorContent);
        document.body.appendChild(errorModal);

        setTimeout(() => {
            errorModal.style.opacity = '1';
            errorContent.style.transform = 'scale(1)';
        }, 0);
    }

    // Модифицированная функция показа сообщения об успехе (теперь возвращает элемент)
    function showSuccessMessage() {
        const successModal = document.createElement('div');
        successModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.2s ease;
        `;
        
        const successContent = document.createElement('div');
        successContent.style.cssText = `
            background: white;
            border-radius: 12px;
            width: 90%;
            max-width: 500px;
            padding: 30px;
            text-align: center;
            transform: scale(0.9);
            transition: transform 0.2s ease;
        `;

        const checkIcon = document.createElement('div');
        checkIcon.innerHTML = `
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 12.5L10.5 15L16 9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#28a745" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;

        const successTitle = document.createElement('h3');
        successTitle.textContent = 'Заявка отправлена!';
        successTitle.style.cssText = `
            margin: 20px 0 10px;
            color: #212529;
            font-size: 22px;
            font-weight: 600;
        `;

        const successText = document.createElement('p');
        successText.textContent = 'Мы свяжемся с вами в ближайшее время для подтверждения деталей.';
        successText.style.cssText = `
            color: #6c757d;
            margin-bottom: 25px;
            line-height: 1.5;
        `;

        const okBtn = document.createElement('button');
        okBtn.textContent = 'Хорошо';
        okBtn.style.cssText = `
            padding: 12px 24px;
            background: #1a237e;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
        `;
        okBtn.addEventListener('mouseenter', () => {
            okBtn.style.background = '#0d47a1';
            okBtn.style.transform = 'translateY(-2px)';
        });
        okBtn.addEventListener('mouseleave', () => {
            okBtn.style.background = '#1a237e';
            okBtn.style.transform = 'translateY(0)';
        });
        okBtn.addEventListener('click', () => {
            // 1. Скроллим к началу страницы
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // 2. Закрываем модальное окно
            successModal.remove();
            
            // 3. Обновляем страницу через небольшой таймаут, чтобы скролл успел сработать
            setTimeout(() => {
                window.location.reload();
            }, 500);
        });

        successContent.appendChild(checkIcon);
        successContent.appendChild(successTitle);
        successContent.appendChild(successText);
        successContent.appendChild(okBtn);
        successModal.appendChild(successContent);
        document.body.appendChild(successModal);

        setTimeout(() => {
            successModal.style.opacity = '1';
            successContent.style.transform = 'scale(1)';
        }, 0);
        
        return successModal;
    }

    // Добавляем стили для анимации подсказки
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
}

function closeApplicationModal(modal) {
    modal.style.opacity = '0';
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 300);
}


function sendApplicationToServer(data) {
    fetch('/submit_application', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}



