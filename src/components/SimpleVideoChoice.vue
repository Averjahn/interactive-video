<template>
  <div class="simple-video-container">
    <div class="video-wrapper">
      <video
        ref="mainVideoRef"
        :src="videoStore.currentVideoSrc"
        @loadedmetadata="onVideoLoaded"
        @timeupdate="onTimeUpdate"
        @ended="onVideoEnded"
        @play="onPlay"
        @pause="onPause"
        @canplay="onCanPlay"
        @waiting="onWaiting"
        controls
        preload="auto"
      >
        Ваш браузер не поддерживает видео.
      </video>
      
      <!-- Индикатор загрузки и переходов -->
      <div v-if="videoStore.isLoading || videoStore.isTransitioning" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p>{{ videoStore.transitionText }}</p>
      </div>
      
      <!-- Оверлей с выбором -->
      <div v-if="videoStore.showChoices" class="choice-overlay">
        <div class="choice-buttons">
          <button 
            @click="playSecondVid" 
            class="choice-btn second-vid-btn" 
            :disabled="!videoStore.videosLoaded.second"
          >
            {{ videoStore.videosLoaded.second ? 'Запустить Second Video' : 'Загрузка...' }}
          </button>
          <button 
            @click="playThirdVid" 
            class="choice-btn third-vid-btn" 
            :disabled="!videoStore.videosLoaded.third"
          >
            {{ videoStore.videosLoaded.third ? 'Запустить Third Video' : 'Загрузка...' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Скрытые видео для предзагрузки -->
    <div class="preload-videos" style="display: none;">
      <video
        ref="secondVideoRef"
        :src="videoStore.videos.second"
        @loadedmetadata="onSecondVideoLoaded"
        @canplay="onSecondVideoCanPlay"
        preload="auto"
      ></video>
      <video
        ref="thirdVideoRef"
        :src="videoStore.videos.third"
        @loadedmetadata="onThirdVideoLoaded"
        @canplay="onThirdVideoCanPlay"
        preload="auto"
      ></video>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useVideoStore } from '@/stores/videoStore'

// ========================================
// STORES
// ========================================

const videoStore = useVideoStore()

// ========================================
// REFS
// ========================================

const mainVideoRef = ref(null)
const secondVideoRef = ref(null)
const thirdVideoRef = ref(null)

// ========================================
// LIFECYCLE
// ========================================

onMounted(() => {
  // Предзагружаем все видео при монтировании компонента
  videoStore.preloadVideos()
  
  // Настраиваем предзагрузку дополнительных видео
  setupPreloadVideos()
})

// ========================================
// METHODS
// ========================================

/**
 * Настраивает предзагрузку дополнительных видео
 */
function setupPreloadVideos() {
  // Предзагружаем второе видео
  if (secondVideoRef.value) {
    videoStore.preloadVideo('second')
    videoStore.setupVideoEventListeners(secondVideoRef.value, 'second')
  }
  
  // Предзагружаем третье видео
  if (thirdVideoRef.value) {
    videoStore.preloadVideo('third')
    videoStore.setupVideoEventListeners(thirdVideoRef.value, 'third')
  }
}

/**
 * Обработчик загрузки основного видео
 */
function onVideoLoaded() {
  if (mainVideoRef.value) {
    videoStore.updateDuration(mainVideoRef.value.duration)
    videoStore.addLoadingLog('main', 'metadata', `📊 Основное видео загружено (длительность: ${mainVideoRef.value.duration.toFixed(2)}с)`)
    
    // Сбрасываем флаг показа выбора при загрузке нового видео
    videoStore.resetChoiceState()
    videoStore.videosLoaded.main = true
  }
}

/**
 * Обработчик обновления времени воспроизведения
 */
function onTimeUpdate() {
  if (mainVideoRef.value) {
    videoStore.updateTime(mainVideoRef.value.currentTime)
    
    // Проверяем, нужно ли показать выбор на 5 секунде
    if (mainVideoRef.value.currentTime >= 5 && !videoStore.hasShownChoice) {
      videoStore.addLoadingLog('main', 'start', `⏰ Достигнута 5-я секунда, показываем выбор видео`)
      showChoice()
    }
  }
}

/**
 * Обработчик начала воспроизведения
 */
function onPlay() {
  videoStore.addLoadingLog('main', 'canplay', `▶️ Воспроизведение возобновлено`)
  
  // Скрываем выбор при возобновлении воспроизведения
  if (videoStore.showChoices) {
    videoStore.hideChoice()
    videoStore.addLoadingLog('main', 'start', `👁️ Скрываем интерфейс выбора при воспроизведении`)
  }
}

/**
 * Обработчик паузы
 */
function onPause() {
  videoStore.addLoadingLog('main', 'start', `⏸️ Воспроизведение приостановлено`)
}

/**
 * Обработчик завершения видео
 */
function onVideoEnded() {
  videoStore.addLoadingLog('main', 'canplay', `🏁 Видео завершено`)
}

/**
 * Обработчик готовности видео к воспроизведению
 */
function onCanPlay() {
  videoStore.setLoading(false)
  videoStore.addLoadingLog('main', 'canplay', `🎬 Текущее видео готово к воспроизведению`)
}

/**
 * Обработчик ожидания загрузки видео
 */
function onWaiting() {
  videoStore.setLoading(true)
  videoStore.addLoadingLog('main', 'start', `⏳ Ожидание загрузки видео...`)
}

/**
 * Обработчик загрузки второго видео
 */
function onSecondVideoLoaded() {
  videoStore.addLoadingLog('second', 'metadata', `📊 Second Video метаданные загружены`)
  videoStore.videosLoaded.second = true
  videoStore.preloadedVideos.second = secondVideoRef.value
}

/**
 * Обработчик загрузки третьего видео
 */
function onThirdVideoLoaded() {
  videoStore.addLoadingLog('third', 'metadata', `📊 Third Video метаданные загружены`)
  videoStore.videosLoaded.third = true
  videoStore.preloadedVideos.third = thirdVideoRef.value
}

/**
 * Обработчик готовности второго видео к воспроизведению
 */
function onSecondVideoCanPlay() {
  videoStore.addLoadingLog('second', 'canplay', `▶️ Second Video готово к воспроизведению`)
}

/**
 * Обработчик готовности третьего видео к воспроизведению
 */
function onThirdVideoCanPlay() {
  videoStore.addLoadingLog('third', 'canplay', `▶️ Third Video готово к воспроизведению`)
}

/**
 * Показывает интерфейс выбора видео
 */
function showChoice() {
  videoStore.showChoice()
  if (mainVideoRef.value) {
    mainVideoRef.value.pause()
  }
}

/**
 * Переход к определенному времени в видео
 */
function goToTime(time) {
  videoStore.addLoadingLog('main', 'start', `⏭️ Переход к ${time} секунде`)
  
  // Скрываем выбор
  videoStore.hideChoice()
  
  if (mainVideoRef.value) {
    // Переходим к указанному времени
    mainVideoRef.value.currentTime = time
    
    // Запускаем воспроизведение
    mainVideoRef.value.play()
  }
}

/**
 * Переключение на второе видео
 */
function playSecondVid() {
  if (videoStore.switchVideo('second', 'Загрузка Second Video...')) {
    // Автоматически запускаем воспроизведение
    nextTick(() => {
      setTimeout(() => {
        if (mainVideoRef.value) {
          videoStore.addLoadingLog('second', 'start', `▶️ Пытаемся запустить автовоспроизведение...`)
          mainVideoRef.value.play().then(() => {
            videoStore.addLoadingLog('second', 'canplay', `🎉 Автовоспроизведение успешно запущено!`)
            videoStore.setTransitioning(false)
          }).catch(error => {
            videoStore.addLoadingLog('second', 'error', `⚠️ Автозапуск заблокирован браузером: ${error.message}`)
            videoStore.setTransitioning(false)
          })
        }
      }, 50)
    })
  }
}

/**
 * Переключение на третье видео
 */
function playThirdVid() {
  if (videoStore.switchVideo('third', 'Загрузка Third Video...')) {
    // Автоматически запускаем воспроизведение
    nextTick(() => {
      setTimeout(() => {
        if (mainVideoRef.value) {
          videoStore.addLoadingLog('third', 'start', `▶️ Пытаемся запустить автовоспроизведение...`)
          mainVideoRef.value.play().then(() => {
            videoStore.addLoadingLog('third', 'canplay', `🎉 Автовоспроизведение успешно запущено!`)
            videoStore.setTransitioning(false)
          }).catch(error => {
            videoStore.addLoadingLog('third', 'error', `⚠️ Автозапуск заблокирован браузером: ${error.message}`)
            videoStore.setTransitioning(false)
          })
        }
      }, 50)
    })
  }
}
</script>

<style scoped>
.simple-video-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #000;
  padding: 2rem;
}

.video-wrapper {
  position: relative;
  max-width: 800px;
  width: 100%;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.video-wrapper video {
  width: 100%;
  height: auto;
  display: block;
}

.choice-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.choice-buttons {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.choice-btn {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  min-width: 200px;
}

.choice-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  background: linear-gradient(45deg, #ff5252, #d63031);
}

.choice-btn:active {
  transform: translateY(0);
}

.choice-btn:nth-child(2) {
  background: linear-gradient(45deg, #74b9ff, #0984e3);
}

.choice-btn:nth-child(2):hover {
  background: linear-gradient(45deg, #0984e3, #74b9ff);
}

/* Стили для кнопок видео */
.second-vid-btn {
  background: linear-gradient(45deg, #00b894, #00a085) !important;
}

.second-vid-btn:hover {
  background: linear-gradient(45deg, #00a085, #00b894) !important;
}

.third-vid-btn {
  background: linear-gradient(45deg, #fdcb6e, #e17055) !important;
}

.third-vid-btn:hover {
  background: linear-gradient(45deg, #e17055, #fdcb6e) !important;
}

/* Стили для индикатора загрузки */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 15;
  color: white;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #ff6b6b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-overlay p {
  margin: 0;
  font-size: 1.1rem;
  font-weight: bold;
}

/* Стили для отключенных кнопок */
.choice-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.choice-btn:disabled:hover {
  transform: none !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3) !important;
}

@media (max-width: 768px) {
  .simple-video-container {
    padding: 1rem;
  }
  
  .choice-buttons {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .choice-btn {
    font-size: 1rem;
    padding: 0.8rem 1.5rem;
    min-width: 180px;
  }
}
</style>