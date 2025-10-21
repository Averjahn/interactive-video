# Переключение между роликами в Kinescope

## ✅ Да, переключение между роликами по кнопкам JavaScript полностью поддерживается!

Kinescope предоставляет несколько способов переключения между видео через JavaScript API.

## 🎮 Основные методы переключения

### 1. Прямое переключение по ID

```javascript
// Переключение на конкретное видео
player.loadVideo('new-video-id')

// Или через обновление пропса в Vue
this.currentVideoId = 'new-video-id'
```

### 2. Программное управление

```javascript
// Следующее видео
function playNext() {
  const nextVideoId = getNextVideoId()
  player.loadVideo(nextVideoId)
}

// Предыдущее видео  
function playPrevious() {
  const prevVideoId = getPreviousVideoId()
  player.loadVideo(prevVideoId)
}

// Случайное видео
function playRandom() {
  const randomVideoId = getRandomVideoId()
  player.loadVideo(randomVideoId)
}
```

### 3. Переключение по событиям

```javascript
// Переключение при паузе
player.on('pause', () => {
  if (shouldSwitchOnPause) {
    playNext()
  }
})

// Переключение при окончании видео
player.on('ended', () => {
  playNext()
})

// Переключение при перемотке
player.on('seeked', () => {
  if (shouldSwitchOnSeek) {
    playNext()
  }
})
```

### 4. Автоматическое переключение

```javascript
// Переключение по таймеру
let autoSwitchTimer = setInterval(() => {
  playNext()
}, 30000) // каждые 30 секунд

// Остановка автопереключения
clearInterval(autoSwitchTimer)
```

## 🎯 Практические примеры

### Пример 1: Простое переключение

```javascript
// Список видео
const videoList = [
  'video-1-id',
  'video-2-id', 
  'video-3-id',
  'video-4-id'
]

let currentIndex = 0

// Переключение на следующее
function nextVideo() {
  currentIndex = (currentIndex + 1) % videoList.length
  player.loadVideo(videoList[currentIndex])
}

// Переключение на предыдущее
function prevVideo() {
  currentIndex = currentIndex === 0 
    ? videoList.length - 1 
    : currentIndex - 1
  player.loadVideo(videoList[currentIndex])
}
```

### Пример 2: Переключение с плейлистом

```javascript
const playlist = [
  { id: 'intro', title: 'Введение', duration: 120 },
  { id: 'main', title: 'Основная часть', duration: 300 },
  { id: 'conclusion', title: 'Заключение', duration: 90 }
]

let currentTrack = 0

function switchToTrack(index) {
  currentTrack = index
  player.loadVideo(playlist[index].id)
  updateUI()
}

function nextTrack() {
  if (currentTrack < playlist.length - 1) {
    switchToTrack(currentTrack + 1)
  }
}

function prevTrack() {
  if (currentTrack > 0) {
    switchToTrack(currentTrack - 1)
  }
}
```

### Пример 3: Умное переключение

```javascript
class VideoSwitcher {
  constructor(player, videos) {
    this.player = player
    this.videos = videos
    this.currentIndex = 0
    this.history = []
    this.setupEventListeners()
  }
  
  switchTo(index) {
    // Сохраняем текущее видео в историю
    this.history.push(this.currentIndex)
    
    // Переключаемся
    this.currentIndex = index
    this.player.loadVideo(this.videos[index].id)
    
    // Обновляем UI
    this.updateUI()
  }
  
  next() {
    const nextIndex = (this.currentIndex + 1) % this.videos.length
    this.switchTo(nextIndex)
  }
  
  previous() {
    if (this.history.length > 0) {
      const prevIndex = this.history.pop()
      this.switchTo(prevIndex)
    } else {
      const prevIndex = this.currentIndex === 0 
        ? this.videos.length - 1 
        : this.currentIndex - 1
      this.switchTo(prevIndex)
    }
  }
  
  random() {
    const randomIndex = Math.floor(Math.random() * this.videos.length)
    this.switchTo(randomIndex)
  }
  
  setupEventListeners() {
    // Переключение по клавишам
    document.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'ArrowRight':
          this.next()
          break
        case 'ArrowLeft':
          this.previous()
          break
        case ' ':
          e.preventDefault()
          this.player.togglePlay()
          break
      }
    })
    
    // Автопереключение при окончании
    this.player.on('ended', () => {
      this.next()
    })
  }
  
  updateUI() {
    // Обновляем интерфейс
    document.querySelector('.current-video').textContent = 
      this.videos[this.currentIndex].title
  }
}
```

## 🎨 UI компоненты для переключения

### Кнопки переключения

```html
<div class="video-controls">
  <button @click="playPrevious">⏮️ Предыдущее</button>
  <button @click="playNext">⏭️ Следующее</button>
  <button @click="playRandom">🎲 Случайное</button>
  <button @click="playFirst">⏮️⏮️ Первое</button>
  <button @click="playLast">⏭️⏭️ Последнее</button>
</div>
```

### Список видео

```html
<div class="video-list">
  <div 
    v-for="(video, index) in videoList" 
    :key="video.id"
    class="video-item"
    :class="{ active: currentIndex === index }"
    @click="switchToVideo(index)"
  >
    <img :src="video.thumbnail" :alt="video.title" />
    <h4>{{ video.title }}</h4>
    <p>{{ video.duration }}</p>
  </div>
</div>
```

### Прогресс-бар с маркерами

```html
<div class="progress-container">
  <div class="progress-bar" @click="seekTo">
    <div class="progress-fill" :style="{ width: progress + '%' }"></div>
    <div class="video-markers">
      <div 
        v-for="(video, index) in videoList"
        :key="index"
        class="video-marker"
        :style="{ left: getMarkerPosition(video.startTime) + '%' }"
        @click="switchToVideo(index)"
      ></div>
    </div>
  </div>
</div>
```

## ⚡ Продвинутые возможности

### Переключение по условиям

```javascript
// Переключение в зависимости от времени просмотра
player.on('timeupdate', (event) => {
  if (event.currentTime > 60 && !hasSwitched) {
    playNext()
    hasSwitched = true
  }
})

// Переключение по качеству интернета
function checkConnection() {
  if (navigator.connection) {
    if (navigator.connection.effectiveType === 'slow-2g') {
      switchToLowQualityVideo()
    } else {
      switchToHighQualityVideo()
    }
  }
}
```

### Переключение с анимациями

```javascript
function switchWithAnimation(newVideoId) {
  // Плавное исчезновение
  player.fadeOut(500).then(() => {
    // Переключение видео
    player.loadVideo(newVideoId)
    
    // Плавное появление
    player.fadeIn(500)
  })
}
```

### Переключение с предзагрузкой

```javascript
class SmartVideoSwitcher {
  constructor(player, videos) {
    this.player = player
    this.videos = videos
    this.preloadedVideos = new Set()
  }
  
  preloadNext() {
    const nextIndex = (this.currentIndex + 1) % this.videos.length
    const nextVideo = this.videos[nextIndex]
    
    if (!this.preloadedVideos.has(nextVideo.id)) {
      // Предзагружаем следующее видео
      this.preloadVideo(nextVideo.id)
      this.preloadedVideos.add(nextVideo.id)
    }
  }
  
  preloadVideo(videoId) {
    // Создаем скрытый плеер для предзагрузки
    const preloadPlayer = new Kinescope.Player(document.createElement('div'), {
      videoId: videoId,
      autoplay: false,
      muted: true
    })
    
    preloadPlayer.on('ready', () => {
      console.log(`Видео ${videoId} предзагружено`)
    })
  }
}
```

## 🎯 Заключение

**Да, переключение между роликами по кнопкам JavaScript полностью поддерживается!**

Kinescope предоставляет:
- ✅ Метод `loadVideo(videoId)` для переключения
- ✅ События для автоматического переключения
- ✅ Полный контроль через JavaScript API
- ✅ Возможность создания сложных плейлистов
- ✅ Интеграция с любыми UI компонентами

В нашем проекте реализованы все основные способы переключения:
1. **Прямые кнопки** - клик по видео в списке
2. **Навигационные кнопки** - следующее/предыдущее
3. **Автоматическое переключение** - по таймеру
4. **Переключение по событиям** - при паузе, перемотке
5. **Клавиатурные сокращения** - стрелки, пробел
6. **Программное управление** - через методы класса

Это делает Kinescope отличным выбором для создания интерактивных видео-приложений!
