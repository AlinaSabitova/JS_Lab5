// Слова для отгадывания по категориям
const words = {
  food: ['масло', 'торт', 'виноград', 'суп', 'сыр', 'мандарины', 'блины'],
  animals: ['лиса', 'медведь', 'кролик', 'зебра', 'жираф', 'пингвин', 'дельфин', 'белка'],
  flora: ['подсолнух', 'кипарис', 'фикус', 'дуб', 'клен', 'папоротник', 'пион', 'береза'],
  clothes: ['пиджак', 'юбка', 'платье', 'брюки', 'рубашка', 'галстук', 'джинсы'],
  sport: ['футбол', 'хоккей', 'волейбол', 'гимнастика', 'биатлон', 'плавание'],
  city: ['владивосток', 'новосибирск', 'волгоград', 'краснодар', 'тольятти', 'екатеринбург', 'хабаровск'],
  countries: ['италия', 'германия', 'канада', 'франция', 'япония', 'алжир', 'мексика', 'бразилия']
};

// Перевод тем на русский язык
const themeTranslations = {
  food: 'Еда',
  animals: 'Животные',
  flora: 'Растения',
  clothes: 'Одежда',
  sport: 'Спорт',
  city: 'Города',
  countries: 'Страны',
};

let selectedWord = ''; // Переменная для хранения отгадываемого слова
let attempts = 6;
let guessedLetters = []; // Массив для хранения угаданных букв
let selectedTheme = ''; // Переменная для хранения выбранной темы

function startGame(theme) {
  selectedTheme = theme; // Сохраняем выбранную тему
  selectedWord = words[theme][Math.floor(Math.random() * words[theme].length)]; // Случайным образом выбираем слово из выбранной категории
  guessedLetters = Array(selectedWord.length).fill('_');  // Создаем массив с количеством символов в слове, заполненный символами '_'
  
  document.getElementById('wordDisplay').innerText = guessedLetters.join(' '); // Обновляем вид строки с отгадываем словом при введении правильной буквы
  document.getElementById('remainingAttempts').innerText = attempts;  // Обновляем количество оставшихся попыток

  createLetterButtons();
  updateHangmanImage();
  
  // Отображаем выбранную тему
  document.getElementById('selectedTheme').innerText = 'Выбранная тема: ' + themeTranslations[theme];

  document.getElementById('themeSelection').style.display = 'none';  // Скрываем блок с выбором темы
  document.getElementById('game').style.display = 'block';  // Показываем блок с игрой
}

// Создаем кнопки с буквами
function createLetterButtons() {
  const letterButtonsContainer = document.getElementById('letterButtons');
  letterButtonsContainer.innerHTML = '';

  const russianAlphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'.split('');
  
  russianAlphabet.forEach(letter => {
      const button = document.createElement('button');  // Создаем кнопку
      button.innerText = letter;  // Устанавливаем текст кнопки
      button.onclick = () => guessLetter(letter, button);  // Добавляем обработчик клика
      letterButtonsContainer.appendChild(button);  // Добавляем кнопку в контейнер
  });
}

function guessLetter(letter, button) {
  button.disabled = true; // Делаем кнопку недоступной
  button.style.backgroundColor = '#ccc'; // Меняем цвет кнопки

  if (selectedWord.includes(letter)) {
      for (let i = 0; i < selectedWord.length; i++) {
          if (selectedWord[i] === letter) {
              guessedLetters[i] = letter;
          }
      }
      document.getElementById('wordDisplay').innerText = guessedLetters.join(' ');
      
      // Проверяем, выиграл ли пользователь
      if (!guessedLetters.includes('_')) {
          setTimeout(() => {
              alert('Поздравляем! Вы выиграли!');
              disableAllButtons(); // Отключаем все кнопки
              document.getElementById('restartButton').style.display = 'block';
          }, 500); // Задержка перед выводом сообщения о выигрыше
      }
  } else {
      attempts--;
      document.getElementById('remainingAttempts').innerText = attempts;
      updateHangmanImage(); // Обновляем изображение виселицы

      if (attempts === 0) {
        setTimeout(() => {
          alert(`Вы проиграли! Загаданное слово было "${selectedWord}".`);
          disableAllButtons(); // Отключаем все кнопки
          document.getElementById('restartButton').style.display = 'block';
        }, 500); // Задержка перед выводом сообщения о проигрыше
      }
  }
}

function disableAllButtons() {
  const letterButtonsContainer = document.getElementById('letterButtons');
  const buttons = letterButtonsContainer.getElementsByTagName('button');
  
  for (let button of buttons) {
      button.disabled = true; // Делаем все кнопки недоступными
      button.style.backgroundColor = '#ccc'; // Меняем цвет кнопок
  }
}

function updateHangmanImage() {
  const hangmanImage = document.getElementById('hangmanImage');
  hangmanImage.src = `images/hangman${6 - attempts}.png`; // Изменяем изображение в зависимости от оставшихся попыток
}

function restartGame() {
  // Сбрасываем состояние переменных
  selectedWord = '';
  attempts = 6;
  guessedLetters = [];
  
  // Обновляем интерфейс
  document.getElementById('themeSelection').style.display = 'block';
  document.getElementById('game').style.display = 'none';
  document.getElementById('restartButton').style.display = 'none';
  
  // Очищаем слово и оставшиеся попытки
  document.getElementById('wordDisplay').innerText = '';
  document.getElementById('remainingAttempts').innerText = '';
  
  // Очищаем кнопки букв
  const letterButtonsContainer = document.getElementById('letterButtons');
  letterButtonsContainer.innerHTML = '';
  
  // Очищаем выбранную тему
  document.getElementById('selectedTheme').innerText = '';

  // Убедимся, что темы расположены вертикально и по центру
  const themeSelection = document.getElementById('themeSelection');
  themeSelection.style.display = 'flex';   // Показать блок выбора темы
  themeSelection.style.justifyContent = 'center'; // Центрируем вертикально
  themeSelection.style.alignItems = 'center';    // Центрируем горизонтально
}