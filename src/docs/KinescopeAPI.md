# Kinescope Player API - Полное руководство

## Обзор API

Kinescope предоставляет очень богатый JavaScript API для управления видеоплеером. API включает в себя множество методов, событий и настроек для полного контроля над воспроизведением видео.

## Основные методы управления

### Управление воспроизведением

```javascript
// Воспроизведение
player.play()

// Пауза
player.pause()

// Остановка
player.stop()

// Переключение воспроизведения/паузы
player.togglePlay()

// Проверка состояния воспроизведения
const isPlaying = player.isPlaying()
```

### Навигация по времени

```javascript
// Переход к определенному времени (в секундах)
player.seek(30) // Переход к 30-й секунде

// Получение текущего времени
const currentTime = player.getCurrentTime()

// Получение длительности видео
const duration = player.getDuration()

// Получение прогресса (0-1)
const progress = player.getProgress()
```

### Управление громкостью

```javascript
// Установка громкости (0-1)
player.setVolume(0.5)

// Получение текущей громкости
const volume = player.getVolume()

// Включение/выключение звука
player.mute()
player.unmute()
player.toggleMute()

// Проверка состояния звука
const isMuted = player.isMuted()
```

### Полноэкранный режим

```javascript
// Вход в полноэкранный режим
player.enterFullscreen()

// Выход из полноэкранного режима
player.exitFullscreen()

// Переключение полноэкранного режима
player.toggleFullscreen()

// Проверка полноэкранного режима
const isFullscreen = player.isFullscreen()
```

### Управление качеством

```javascript
// Получение доступных качеств
const qualities = player.getAvailableQualities()

// Установка качества
player.setQuality('720p')

// Получение текущего качества
const currentQuality = player.getCurrentQuality()

// Автоматическое качество
player.setQuality('auto')
```

## События плеера

### Основные события воспроизведения

```javascript
// Готовность плеера
player.on('ready', () => {
  console.log('Плеер готов к воспроизведению')
})

// Начало воспроизведения
player.on('play', () => {
  console.log('Воспроизведение началось')
})

// Пауза
player.on('pause', () => {
  console.log('Воспроизведение приостановлено')
})

// Окончание видео
player.on('ended', () => {
  console.log('Видео завершено')
})

// Ошибка воспроизведения
player.on('error', (error) => {
  console.error('Ошибка:', error)
})
```

### События времени

```javascript
// Обновление времени (срабатывает каждые 250мс)
player.on('timeupdate', (event) => {
  console.log('Текущее время:', event.currentTime)
  console.log('Длительность:', event.duration)
  console.log('Прогресс:', event.progress)
})

// Переход к определенному времени
player.on('seeked', (event) => {
  console.log('Переход к времени:', event.currentTime)
})

// Начало загрузки
player.on('loadstart', () => {
  console.log('Начало загрузки')
})

// Загрузка метаданных
player.on('loadedmetadata', (event) => {
  console.log('Метаданные загружены')
  console.log('Длительность:', event.duration)
  console.log('Размеры:', event.videoWidth, 'x', event.videoHeight)
})

// Загрузка данных
player.on('loadeddata', () => {
  console.log('Данные загружены')
})

// Может воспроизводиться
player.on('canplay', () => {
  console.log('Может воспроизводиться')
})

// Может воспроизводиться без буферизации
player.on('canplaythrough', () => {
  console.log('Может воспроизводиться без буферизации')
})
```

### События буферизации

```javascript
// Начало буферизации
player.on('waiting', () => {
  console.log('Буферизация...')
})

// Конец буферизации
player.on('playing', () => {
  console.log('Воспроизведение возобновлено')
})

// Прогресс загрузки
player.on('progress', (event) => {
  console.log('Загружено:', event.loaded)
  console.log('Всего:', event.total)
  console.log('Процент:', event.percent)
})
```

### События интерфейса

```javascript
// Изменение размера плеера
player.on('resize', (event) => {
  console.log('Новый размер:', event.width, 'x', event.height)
})

// Изменение громкости
player.on('volumechange', (event) => {
  console.log('Новая громкость:', event.volume)
  console.log('Звук выключен:', event.muted)
})

// Изменение качества
player.on('qualitychange', (event) => {
  console.log('Новое качество:', event.quality)
})

// Полноэкранный режим
player.on('fullscreenchange', (event) => {
  console.log('Полноэкранный режим:', event.fullscreen)
})
```

## Дополнительные возможности

### Управление субтитрами

```javascript
// Получение доступных субтитров
const subtitles = player.getSubtitles()

// Включение субтитров
player.setSubtitles('ru')

// Выключение субтитров
player.hideSubtitles()

// Показать субтитры
player.showSubtitles()
```

### Управление скоростью

```javascript
// Установка скорости воспроизведения
player.setPlaybackRate(1.5) // 1.5x скорость

// Получение текущей скорости
const rate = player.getPlaybackRate()

// Доступные скорости
const rates = player.getAvailableRates()
```

### Аналитика и метрики

```javascript
// Получение статистики
const stats = player.getStats()

// События аналитики
player.on('analytics', (data) => {
  console.log('Аналитика:', data)
})
```

## Настройки плеера

### Инициализация с настройками

```javascript
const player = new Kinescope.Player(container, {
  videoId: 'your-video-id',
  
  // Основные настройки
  autoplay: true,
  muted: false,
  loop: false,
  controls: true,
  
  // Размеры
  width: '100%',
  height: '100%',
  
  // Качество
  quality: 'auto',
  
  // Громкость
  volume: 1,
  
  // Начальное время
  startTime: 0,
  
  // Цвета и стили
  theme: 'dark',
  accentColor: '#ff6b6b',
  
  // Дополнительные настройки
  keyboard: true,
  fullscreen: true,
  pictureInPicture: true,
  
  // События
  onReady: () => console.log('Готов'),
  onPlay: () => console.log('Играет'),
  onPause: () => console.log('Пауза'),
  onEnded: () => console.log('Завершено')
})
```

## Продвинутые возможности

### Горячие клавиши

```javascript
// Включение/выключение горячих клавиш
player.enableKeyboard()
player.disableKeyboard()

// Настройка горячих клавиш
player.setKeyboardShortcuts({
  space: 'play/pause',
  left: 'seek(-10)',
  right: 'seek(10)',
  up: 'volume(0.1)',
  down: 'volume(-0.1)',
  f: 'fullscreen',
  m: 'mute'
})
```

### Программные элементы управления

```javascript
// Создание кастомных кнопок
const customButton = player.addButton({
  text: 'Моя кнопка',
  position: 'top-right',
  onClick: () => {
    console.log('Кастомная кнопка нажата')
  }
})

// Удаление кнопки
player.removeButton(customButton)
```

### Интерактивные элементы

```javascript
// Добавление аннотаций
player.addAnnotation({
  time: 30,
  text: 'Это важный момент!',
  duration: 5,
  style: {
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    color: 'white',
    fontSize: '16px'
  }
})

// Добавление CTA кнопки
player.addCTA({
  time: 60,
  text: 'Подписаться',
  url: 'https://example.com',
  style: {
    backgroundColor: '#ff6b6b',
    color: 'white'
  }
})
```

## Заключение

API Kinescope плеера действительно очень богатый и предоставляет:

- **20+ методов управления** воспроизведением, временем, громкостью, качеством
- **15+ событий** для отслеживания всех аспектов воспроизведения
- **Гибкие настройки** инициализации и кастомизации
- **Интерактивные элементы** (аннотации, CTA, кнопки)
- **Аналитику и метрики** для отслеживания поведения пользователей
- **Горячие клавиши** и программные элементы управления
- **Поддержку субтитров** и различных скоростей воспроизведения

Это делает Kinescope одним из самых функциональных видеоплееров для веб-разработки.
