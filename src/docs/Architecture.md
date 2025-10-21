# Архитектура интерактивного видео

## Проблема дублирования

**Было:** Дублирование конфигурации в двух местах:
- `src/config/videoConfig.js` - URL видео и настройки выборов
- `src/stores/videoStore.js` - те же URL видео в store

## Решение

### 1. Единый источник конфигурации
Все настройки теперь хранятся в `src/config/videoConfig.js`:

```javascript
export const videoConfig = {
  // URL фрагментов видео
  videoFragments: {
    rh1: 'https://med-game.ru/sites/default/files/video/rh/rh1.mp4',
    rh2: 'https://med-game.ru/sites/default/files/video/rh/rh2.mp4',
    rh3: 'https://med-game.ru/sites/default/files/video/rh/rh3.mp4',
    rh4: 'https://med-game.ru/sites/default/files/video/rh/rh4.mp4'
  },
  
  // Точки выбора в видео
  choicePoints: [...],
  
  // Настройки плеера
  playerSettings: {...}
}
```

### 2. Store использует конфигурацию
`src/stores/videoStore.js` теперь импортирует и использует конфигурацию:

```javascript
import { videoConfig } from '@/config/videoConfig'

// Используем конфигурацию из config
const videos = ref(videoConfig.videoFragments)
const currentVideoSrc = ref(videoConfig.videoFragments.rh1)
```

### 3. Методы доступа к конфигурации
Добавлены методы в store для доступа к конфигурации:

```javascript
// Получить конфигурацию выборов
function getChoiceConfig() {
  return videoConfig.choicePoints
}

// Получить настройки плеера
function getPlayerConfig() {
  return videoConfig.playerSettings
}
```

## Преимущества новой архитектуры

### ✅ Устранение дублирования
- URL видео определены только в одном месте
- Изменения в конфигурации применяются везде автоматически

### ✅ Единый источник истины
- Все настройки в `videoConfig.js`
- Store только использует конфигурацию, не дублирует её

### ✅ Легкость изменений
- Добавить новое видео - только в `videoConfig.js`
- Изменить URL - только в одном месте
- Настроить выборы - только в конфигурации

### ✅ Чистая архитектура
- Разделение ответственности: config = данные, store = логика
- Компоненты получают данные через store
- Конфигурация централизована

## Структура файлов

```
src/
├── config/
│   └── videoConfig.js          # 🎯 Единая конфигурация
├── stores/
│   └── videoStore.js           # 📦 Store (использует config)
├── components/
│   └── InteractiveVideoPlayer.vue # 🎬 Компонент (использует store)
└── App.vue                     # 🚀 Главный компонент
```

## Поток данных

```
videoConfig.js (конфигурация)
    ↓
videoStore.js (логика + состояние)
    ↓
InteractiveVideoPlayer.vue (UI)
    ↓
App.vue (приложение)
```

## Использование

### Изменение URL видео
```javascript
// Только в videoConfig.js
videoFragments: {
  rh1: 'https://new-url.com/video1.mp4'
}
```

### Добавление нового видео
```javascript
// Только в videoConfig.js
videoFragments: {
  rh1: '...',
  rh2: '...',
  rh3: '...',
  rh4: '...',
  rh5: 'https://new-video.mp4' // Новое видео
}
```

### Изменение настроек выборов
```javascript
// Только в videoConfig.js
choicePoints: [
  {
    time: 20, // Изменить время
    title: 'Новый заголовок',
    // ...
  }
]
```

Теперь архитектура чистая, без дублирования, и все изменения делаются в одном месте!
