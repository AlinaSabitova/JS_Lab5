document.addEventListener('DOMContentLoaded', function() {
    const addTagButton = document.getElementById('addTagButton');
    const articleSelect = document.getElementById('articleSelect');
    const tagInput = document.getElementById('tagInput');
    const searchTagButton = document.getElementById('searchTagButton');
    const searchTagInput = document.getElementById('searchTagInput');

    addTagButton.addEventListener('click', function() {
        const selectedArticleId = articleSelect.value;
        const tagText = tagInput.value.trim();

        // Если статья выбрана и тег введен
        if (selectedArticleId && tagText) {
            const tagContainer = document.querySelector(`#${selectedArticleId} .tags`);   // Находим контейнер для тегов выбранной статьи
            const tag = document.createElement('span');  // Создаем новый тег
            tag.className = 'tag';
            tag.innerText = tagText;

            // Создаем кнопку удаления тега
            const removeButton = document.createElement('span');
            removeButton.className = 'remove-tag';
            removeButton.innerText = '×';  // Символ крестика для удаления
            // Удаление тега из DOM при нажатии на крестик
            removeButton.onclick = function() {
                tagContainer.removeChild(tag);
            };

            // Добавляем кнопку удаления в тег
            tag.appendChild(removeButton);
            tagContainer.appendChild(tag);

            // Сброс выбора и поля ввода после добавления тега
            articleSelect.selectedIndex = 0;
            tagInput.value = '';
        } else {
            alert('Пожалуйста, выберите статью и введите тег.');
        }
    });

    //Реализуем поиск по тегу
    searchTagButton.addEventListener('click', function() {
        const searchTag = searchTagInput.value.trim().toLowerCase();  // Получаем значение поискового тега, удаляя лишние пробелы и приводя к нижнему регистру

        if (searchTag) {
            const articles = document.querySelectorAll('.article');   // Находим все статьи на странице
            // Проходимся по каждой статье
            articles.forEach(article => {
                const tags = article.querySelectorAll('.tag');  // Находим все теги текущей статьи
                 // Проверяем наличие искомого тега среди тегов статьи
                const hasTag = Array.from(tags).some(tag => 
                    tag.innerText.toLowerCase().includes(searchTag)
                );

                // Показываем или скрываем статью в зависимости от наличия тега
                article.style.display = hasTag ? 'block' : 'none';
            });
        } else {
            alert('Пожалуйста, введите тег для поиска.');
        }
    });
});