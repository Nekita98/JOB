// Массив вариантов грузов
const cargoSuggestions = [
  "Автошины",
  "Арматура",
  "Балки надрессорные",
  "Безалкогольные напитки",
  "Боковая рама",
  "Бумага",
  "Бытовая техника",
  "Бытовая химия",
  "Вагонка",
  "Газосиликатные блоки",
  "Гипс",
  "Гофрокартон",
  "Грибы",
  "Двери",
  "ДВП",
  "Домашний переезд",
  "Доски",
  "Древесина",
  "Древесный уголь",
  "Другой",
  "ДСП",
  "Ж/д запчасти (прочие)",
  "ЖБИ",
  "Зерно и семена (в упаковке)",
  "Игрушки",
  "Изделия из кожи",
  "Изделия из металла",
  "Изделия из резины",
  "Инструмент",
  "Кабель",
  "Канц. товары",
  "Кирпич",
  "Ковры",
  "Колесная пара",
  "Компьютеры",
  "Кондитерские изделия",
  "Консервы",
  "Кормовые/пищевые добавки",
  "Крупа",
  "ЛДСП",
  "Макулатура",
  "Мебель",
  "Медикаменты",
  "Мел",
  "Металл",
  "Металлолом",
  "Металлопрокат",
  "Минвата",
  "Молоко сухое",
  "Мука",
  "Мясо",
  "Оборудование и запчасти",
  "Оборудование медицинское",
  "Обувь",
  "Овощи",
  "Огнеупорная продукция",
  "Одежда",
  "Парфюмерия и косметика",
  "Пенопласт",
  "Песок",
  "Пиломатериалы",
  "Пластик",
  "Поглощающий аппарат",
  "Поддоны",
  "Профлист",
  "Рыба (неживая)",
  "Сантехника",
  "Сахар",
  "Сборный груз",
  "Соки",
  "Соль",
  "СОНК (КП)",
  "Стекло и фарфор",
  "Стеклотара (бутылки и др.)",
  "Стройматериалы",
  "Сэндвич-панели",
  "Табачные изделия",
  "Тара и упаковка",
  "Текстиль",
  "ТНП",
  "Торф",
  "Транспортные средства",
  "Трубы",
  "Удобрения",
  "Утеплитель",
  "Фанера",
  "Ферросплавы",
  "Фрукты",
  "Хим. продукты неопасные",
  "Хозтовары",
  "Холодильное оборудование",
  "Цемент",
  "Чипсы",
  "Шпалы",
  "Щебень",
  "Электроника",
  "Ягоды"
];


// Основной обработчик для поля "Введите тип груза"
const cargoInput = document.getElementById('cargoType');

if (cargoInput) {
  cargoInput.addEventListener('focus', () => {
    // Проверка, выбран ли тип машины
    const carInner = document.getElementById('carType').innerHTML.trim();
    const isCarSelected = carInner && !carInner.includes('Выбрать');
    if (!isCarSelected) {
      // Не разрешаем ввод
      cargoInput.blur();

      // Показываем подсказку или выделяем рамку
      document.getElementById('carType').style.border = '2px solid red';
      document.getElementById('carTypeHint').style.display = 'block';
    }
  });

  // В вашем коде есть обработка input для подсказок — она остается, только при фокусе проверяем
  cargoInput.addEventListener('input', () => {
    const query = cargoInput.value.trim().toLowerCase();

    // Удаляем старые подсказки
    let existingList = document.getElementById('cargo-suggestions');
    if (existingList) existingList.remove();

    // Минимальная длина
    if (query.length < 1) return;

    // Если не выбран тип машины — не показываем подсказки
    const carInner = document.getElementById('carType').innerHTML.trim();
    const isCarSelected = carInner && !carInner.includes('Выбрать');
    if (!isCarSelected) return;

    // Остальной код поиска и отображения подсказок
    const matches = cargoSuggestions.filter(s => s.toLowerCase().includes(query));

    if (matches.length === 0) return;

    // Обеспечиваем позиционирование
    const parent = cargoInput.parentNode;
    const parentStyle = window.getComputedStyle(parent);
    if (parentStyle.position === 'static') parent.style.position = 'relative';

    const list = document.createElement('div');
    list.id = 'cargo-suggestions';
    list.className = 'suggestions-list';

    // Стиль
    list.style.position = 'absolute';
    list.style.top = '100%';
    list.style.left = '0';
    list.style.width = cargoInput.offsetWidth + 'px';
    list.style.backgroundColor = '#fff';
    list.style.border = '1px solid #ccc';
    list.style.borderRadius = '4px';
    list.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    list.style.zIndex = '9999';

    matches.forEach(s => {
      const item = document.createElement('div');
      item.innerText = s;
      item.className = 'suggestion-item';
      item.style.padding = '8px';
      item.style.cursor = 'pointer';
      item.style.whiteSpace = 'nowrap';

      item.onclick = () => {
        cargoInput.value = s;
        list.remove();
      };
      list.appendChild(item);
    });

    parent.appendChild(list);

    document.addEventListener('click', function closeSuggestions(e) {
      if (!list.contains(e.target) && e.target !== cargoInput) {
        list.remove();
        document.removeEventListener('click', closeSuggestions);
      }
    });
  });
}


// Обработчик для поля ввода типа груза
if (cargoInput) {
    cargoInput.addEventListener('focus', function() {
        const carInner = document.getElementById('carType').innerHTML.trim();
        const isCarSelected = carInner && !carInner.includes('Выбрать');
        
        if (!isCarSelected) {
            // Подсвечиваем поле выбора машины
            const carTypeDiv = document.getElementById('carType');
            carTypeDiv.style.border = '2px solid red';
            document.getElementById('carTypeHint').style.display = 'block';
            
            // Анимация тряски для поля выбора машины
            carTypeDiv.style.animation = 'shake 0.5s';
            
            // Анимация тряски для блока ввода типа груза
            const cargoContainer = this.closest('.cargo-input-group');
            cargoContainer.style.animation = 'shake 0.5s';
            
            // Сбрасываем фокус и анимацию через 0.5 секунды
            setTimeout(() => {
                this.blur();
                carTypeDiv.style.animation = '';
                cargoContainer.style.animation = '';
            }, 500);
            
            // Прокручиваем к полю выбора машины
            carTypeDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}