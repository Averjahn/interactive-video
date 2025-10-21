# 🚀 Пошаговая инструкция загрузки на GitHub

## Шаг 1: Подготовка проекта ✅

Проект уже готов:
- ✅ Все файлы созданы
- ✅ Сборка работает (`npm run build`)
- ✅ Настроен `.gitignore`
- ✅ Создан `vercel.json`
- ✅ Обновлен `README.md`

## Шаг 2: Инициализация Git

Откройте терминал в папке проекта и выполните:

```bash
cd /Users/user/Documents/Job/interactive-video-project
git init
git add .
git commit -m "Initial commit: Interactive video project with Vue 3, Pinia and Vite"
```

## Шаг 3: Создание репозитория на GitHub

1. Перейдите на [github.com](https://github.com)
2. Нажмите зеленую кнопку **"New"** или **"+"** → **"New repository"**
3. Заполните форму:
   - **Repository name**: `interactive-video-project`
   - **Description**: `Интерактивное видео на Vue 3 с выбором стиля и контента`
   - **Visibility**: Public (или Private по желанию)
   - **НЕ** ставьте галочки на "Add a README file", "Add .gitignore", "Choose a license" (они уже есть)
4. Нажмите **"Create repository"**

## Шаг 4: Подключение к GitHub

В терминале выполните (замените `YOUR_USERNAME` на ваш GitHub username):

```bash
git remote add origin https://github.com/YOUR_USERNAME/interactive-video-project.git
git branch -M main
git push -u origin main
```

## Шаг 5: Развертывание на Vercel

1. Перейдите на [vercel.com](https://vercel.com)
2. Нажмите **"Sign up"** и войдите через GitHub
3. Нажмите **"New Project"**
4. Найдите и выберите репозиторий `interactive-video-project`
5. Vercel автоматически определит настройки:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Нажмите **"Deploy"**

## 🎉 Готово!

После развертывания вы получите:
- 🔗 **URL проекта** (например: `https://interactive-video-project.vercel.app`)
- 📊 **Dashboard** для управления проектом
- 🔄 **Автоматические обновления** при каждом push

## 🔧 Если что-то пошло не так

### Ошибка при push
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Ошибка сборки на Vercel
1. Проверьте логи в Vercel Dashboard
2. Убедитесь, что все файлы загружены
3. Проверьте, что нет ошибок в коде

### Проблемы с видео
- Убедитесь, что URL видео доступны
- Проверьте, что видео файлы загружаются

## 📞 Поддержка

Если возникнут проблемы:
1. Проверьте логи в Vercel Dashboard
2. Убедитесь, что все зависимости установлены
3. Проверьте, что проект собирается локально (`npm run build`)

## 🎯 Следующие шаги

После успешного развертывания:
1. Протестируйте все функции
2. Проверьте работу на мобильных устройствах
3. Настройте домен (если нужно)
4. Добавьте аналитику (если нужно)
