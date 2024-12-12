const currencySelect = document.getElementById('currency');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const fluctuationChartCanvas = document.getElementById('fluctuationChart');
const showChartButton = document.getElementById('showChartButton');
let fluctuationChart; // Объявляем переменную для графика

// Обработчик события клика по кнопке "Показать график"
showChartButton.addEventListener('click', () => {
    const currency = currencySelect.value;
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    // Проверка: выбраны ли даты
    if (!startDate || !endDate) {
        alert('Пожалуйста, выберите начальную и конечную даты.');
        return;
    }

    // Проверка: корректность дат
    const currentDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > currentDate) {
        alert('Начальная дата не может быть больше текущей даты.');
        return; // Останавливаем выполнение
    }

    if (end > currentDate) {
        alert('Конечная дата не может быть больше текущей даты.');
        return; // Останавливаем выполнение
    }

    if (start > end) {
        alert('Начальная дата не может быть позже конечной даты.');
        return; // Останавливаем выполнение
    }

    // Проверка: выбрана ли валюта
    if (!currency) {
        alert('Пожалуйста, выберите валюту.');
        return;
    }

    // Если все параметры выбраны, запрашиваем курсы обмена
    if (currency && startDate && endDate) {
        getExchangeRates(currency, startDate, endDate);  
    }
});

// Получаем данные за выбранный период, используя API-ключ
function getExchangeRates(currency, startDate, endDate) {
    const apiKey = '1lAL7V2bR4x6OG4e4QhTMBrp7IMKz5A1';
    const url = `https://api.apilayer.com/exchangerates_data/timeseries?start_date=${startDate}&end_date=${endDate}&base=RUB&symbols=${currency}`;  // Формируем URL для запроса данных

    // Опции запроса
    const requestOptions = {
        method: 'GET',  // Метод запроса
        headers: {
            apikey: apiKey,  // Заголовок с API-ключом
        },
    };

    // Выполняем запрос к API
    fetch(url, requestOptions)
        .then(response => response.json())  // Преобразуем ответ в JSON
        .then(data => {
            // Проверяем наличие ошибок в ответе
            if (data.error) {
                throw new Error(data.error.info);
            }

            // Преобразуем данные в удобный формат для графика
            const rates = Object.entries(data.rates).map(([date, rate]) => ({
                date,
                value: rate[currency],  // Получаем значение курса для выбранной валюты
            }));

            // Обновляем график с новыми данными
            updateChart(rates, currency);
        })
        .catch(error => {
            console.error('Ошибка получения данных:', error);
            alert('Не удалось получить данные. Попробуйте снова.');
        });
}

//Обновляем график при изменении пользователем параметров
function updateChart(rates, currency) {
    const labels = rates.map(rate => rate.date); 
    const data = rates.map(rate => rate.value); 

    // Если график уже существует, обновляем его данные и метки
    if (fluctuationChart) {  
        fluctuationChart.data.labels = labels;
        fluctuationChart.data.datasets[0].data = data;
        fluctuationChart.data.datasets[0].label = `Курс RUB к ${currency}`; 
        fluctuationChart.update();

    // Если график не существует, создаем новый график
    } else {
        fluctuationChart = new Chart(fluctuationChartCanvas, {
            type: 'line', 
            data: {
                labels: labels,
                datasets: [{
                    label: `Курс RUB к ${currency}`, 
                    data: data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 2,
                }],
            },
            options: {
                responsive: true,  // Адаптивный график
                plugins: {
                    legend: {
                        display: true,  // Отображение легенды графика
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Дата',  // Заголовок оси X
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Курс',  // Заголовок оси Y
                        },
                    },
                },
            },
        });
    }
}