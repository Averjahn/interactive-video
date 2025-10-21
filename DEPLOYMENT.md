# Инструкции по развертыванию

## 🚀 Загрузка на GitHub

### 1. Инициализация Git репозитория
```bash
cd /Users/user/Documents/Job/interactive-video-project
git init
```

### 2. Добавление файлов
```bash
git add .
git commit -m "Initial commit: Interactive video project"
```

### 3. Создание репозитория на GitHub
1. Перейдите на [github.com](https://github.com)
2. Нажмите "New repository"
3. Название: `interactive-video-project`
4. Описание: `Интерактивное видео на Vue 3 с выбором стиля и контента`
5. Выберите "Public" или "Private"
6. НЕ добавляйте README, .gitignore или лицензию (они уже есть)
7. Нажмите "Create repository"

### 4. Подключение к GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/interactive-video-project.git
git branch -M main
git push -u origin main
```

## 🌐 Развертывание на Vercel

### Автоматическое развертывание
1. Перейдите на [vercel.com](https://vercel.com)
2. Войдите через GitHub
3. Нажмите "New Project"
4. Выберите репозиторий `interactive-video-project`
5. Vercel автоматически определит настройки:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Нажмите "Deploy"

### Ручные настройки (если нужно)
- **Framework Preset**: Vite
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 🔧 Настройки Vercel

Проект уже настроен через `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 📝 Переменные окружения

Если понадобятся переменные окружения, добавьте их в настройках Vercel:
- `NODE_ENV=production`
- Любые другие переменные для API ключей и т.д.

## 🔄 Обновления

После каждого push в main ветку Vercel автоматически пересоберет и развернет проект.

## 🐛 Решение проблем

### Ошибка сборки
1. Проверьте логи в Vercel Dashboard
2. Убедитесь, что все зависимости в `package.json`
3. Проверьте, что нет ошибок в коде

### Проблемы с роутингом
- SPA роутинг настроен через `vercel.json`
- Все маршруты перенаправляются на `index.html`

### Проблемы с видео
- Убедитесь, что URL видео доступны
- Проверьте CORS настройки для видео файлов

## 📊 Мониторинг

После развертывания вы получите:
- URL для просмотра проекта
- Dashboard для мониторинга
- Логи сборки и развертывания
- Аналитика производительности

## 🔗 Полезные ссылки

- [Vercel Documentation](https://vercel.com/docs)
- [Vue 3 Deployment Guide](https://vuejs.org/guide/best-practices/production-deployment.html)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)
