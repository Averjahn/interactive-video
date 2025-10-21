<template>
  <div class="interactive-video-container">
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
        <div class="choice-content">
          <h3 class="choice-title">{{ currentChoiceTitle }}</h3>
          <div class="choice-buttons">
            <button 
              v-for="option in currentChoiceOptions"
              :key="option.id"
              @click="handleChoice(option)"
              class="choice-btn"
              :class="getButtonClass(option.id)"
              :disabled="!isOptionAvailable(option)"
            >
              {{ option.label }}
              <span v-if="option.description" class="choice-description">
                {{ option.description }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Скрытые видео для предзагрузки -->
    <div class="preload-videos" style="display: none;">
      <video
        v-for="(videoSrc, videoId) in videoStore.videos"
        :key="videoId"
        :ref="el => setVideoRef(el, videoId)"
        :src="videoSrc"
        @loadedmetadata="() => onVideoPreloaded(videoId)"
        @canplay="() => onVideoCanPlay(videoId)"
        preload="auto"
      ></video>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useVideoStore } from '@/stores/videoStore'

// ========================================
// STORES
// ========================================

const videoStore = useVideoStore()

// ========================================
// REFS
// ========================================

const mainVideoRef = ref(null)
const videoRefs = ref({})
const isEndChoice = ref(false)

// ========================================
// COMPUTED
// ========================================

const currentChoiceTitle = computed(() => {
  const choiceType = videoStore.getChoiceType(videoStore.currentVideoId, isEndChoice.value)
  
  switch (choiceType) {
    case 'style-choice':
      return 'Выберите стиль видео:'
    case 'content-choice':
      return 'Выберите что показать:'
    case 'restart-choice':
      return 'Что делать дальше?'
    default:
      return 'Сделайте выбор:'
  }
})

const currentChoiceOptions = computed(() => {
  const choiceType = videoStore.getChoiceType(videoStore.currentVideoId, isEndChoice.value)
  
  switch (choiceType) {
    case 'style-choice':
      return [
        { 
          id: 'continue-drawn', 
          label: 'Продолжить рисованный', 
          videoId: 'rh1',
          description: 'Продолжить просмотр рисованного видео'
        },
        { 
          id: 'switch-puppet', 
          label: 'Перейти на кукольный', 
          videoId: 'rh2',
          description: 'Переключиться на кукольное видео'
        }
      ]
    case 'content-choice':
      return [
        { 
          id: 'show-chronicle', 
          label: 'Показать хронику 1934г', 
          videoId: 'rh3',
          description: 'Просмотр исторической хроники'
        },
        { 
          id: 'show-reconstruction', 
          label: 'Показать реконструкцию 2025г', 
          videoId: 'rh4',
          description: 'Просмотр современной реконструкции'
        }
      ]
    case 'restart-choice':
      return [
        { 
          id: 'watch-again', 
          label: 'Посмотреть ещё раз?', 
          videoId: 'rh1',
          description: 'Вернуться к началу и посмотреть заново'
        }
      ]
    default:
      return []
  }
})

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
 * Устанавливает ссылку на видео элемент
 */
function setVideoRef(el, videoId) {
  if (el) {
    videoRefs.value[videoId] = el
  }
}

/**
 * Настраивает предзагрузку всех видео
 */
function setupPreloadVideos() {
  Object.keys(videoStore.videos).forEach(videoId => {
    if (videoRefs.value[videoId]) {
      videoStore.preloadVideo(videoId)
      videoStore.setupVideoEventListeners(videoRefs.value[videoId], videoId)
    }
  })
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
    isEndChoice.value = false
    videoStore.videosLoaded[videoStore.currentVideoId] = true
  }
}

/**
 * Обработчик обновления времени воспроизведения
 */
function onTimeUpdate() {
  if (mainVideoRef.value) {
    videoStore.updateTime(mainVideoRef.value.currentTime)
    
    // Проверяем, нужно ли показать выбор в середине первого фрагмента
    if (videoStore.shouldShowMidChoice(mainVideoRef.value.currentTime, videoStore.currentVideoId)) {
      videoStore.addLoadingLog('main', 'start', `⏰ Достигнута 15-я секунда, показываем выбор стиля`)
      isEndChoice.value = false
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
  
  // Проверяем, нужно ли показать выбор в конце
  if (videoStore.shouldShowEndChoice(videoStore.currentVideoId)) {
    videoStore.addLoadingLog('main', 'start', `🎯 Показываем выбор в конце видео`)
    isEndChoice.value = true
    showChoice()
  }
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
 * Обработчик предзагрузки видео
 */
function onVideoPreloaded(videoId) {
  videoStore.addLoadingLog(videoId, 'metadata', `📊 ${videoId} метаданные загружены`)
  videoStore.videosLoaded[videoId] = true
  videoStore.preloadedVideos[videoId] = videoRefs.value[videoId]
}

/**
 * Обработчик готовности видео к воспроизведению
 */
function onVideoCanPlay(videoId) {
  videoStore.addLoadingLog(videoId, 'canplay', `▶️ ${videoId} готово к воспроизведению`)
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
 * Обрабатывает выбор пользователя
 */
function handleChoice(option) {
  videoStore.addLoadingLog('choice', 'start', `🎯 Пользователь выбрал: ${option.label}`, {
    optionId: option.id,
    optionLabel: option.label,
    targetVideoId: option.videoId,
    currentVideoId: videoStore.currentVideoId,
    isEndChoice: isEndChoice.value,
    choiceContext: {
      isContinue: option.videoId === 'rh1' && videoStore.currentVideoId === 'rh1',
      isSwitch: option.videoId !== videoStore.currentVideoId,
      isRestart: option.id === 'watch-again'
    }
  })
  
  if (option.videoId === 'rh1' && videoStore.currentVideoId === 'rh1') {
    // Если выбрали продолжить рисованный, просто продолжаем воспроизведение
    videoStore.addLoadingLog('choice', 'start', `▶️ Продолжаем воспроизведение текущего видео`)
    videoStore.hideChoice()
    if (mainVideoRef.value) {
      mainVideoRef.value.play()
      videoStore.addLoadingLog('choice', 'canplay', `🎬 Воспроизведение возобновлено`)
    }
  } else {
    // Переключаемся на выбранное видео
    if (videoStore.switchToVideo(option.videoId, `Загрузка ${option.label}...`)) {
      // Автоматически запускаем воспроизведение
      nextTick(() => {
        setTimeout(() => {
          if (mainVideoRef.value) {
            videoStore.addLoadingLog(option.videoId, 'start', `▶️ Пытаемся запустить автовоспроизведение...`, {
              videoElement: !!mainVideoRef.value,
              videoSrc: mainVideoRef.value.src,
              readyState: mainVideoRef.value.readyState
            })
            mainVideoRef.value.play().then(() => {
              videoStore.addLoadingLog(option.videoId, 'canplay', `🎉 Автовоспроизведение успешно запущено!`, {
                currentTime: mainVideoRef.value.currentTime,
                duration: mainVideoRef.value.duration,
                readyState: mainVideoRef.value.readyState
              })
              videoStore.setTransitioning(false)
            }).catch(error => {
              videoStore.addLoadingLog(option.videoId, 'error', `⚠️ Автозапуск заблокирован браузером: ${error.message}`, {
                error: error,
                errorName: error.name,
                errorMessage: error.message,
                videoSrc: mainVideoRef.value.src,
                readyState: mainVideoRef.value.readyState
              })
              videoStore.setTransitioning(false)
            })
          }
        }, 50)
      })
    }
  }
}

/**
 * Получает CSS класс для кнопки
 */
function getButtonClass(optionId) {
  const classes = {
    'continue-drawn': 'continue-btn',
    'switch-puppet': 'switch-btn',
    'show-chronicle': 'chronicle-btn',
    'show-reconstruction': 'reconstruction-btn',
    'watch-again': 'restart-btn'
  }
  return classes[optionId] || 'default-btn'
}

/**
 * Проверяет, доступна ли опция
 */
function isOptionAvailable(option) {
  return videoStore.videosLoaded[option.videoId] || false
}
</script>

<style scoped>
.interactive-video-container {
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
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.choice-content {
  text-align: center;
  max-width: 600px;
  padding: 2rem;
}

.choice-title {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.choice-buttons {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.choice-btn {
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  min-width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.choice-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.choice-btn:active {
  transform: translateY(0);
}

.choice-description {
  font-size: 0.9rem;
  font-weight: normal;
  opacity: 0.9;
}

/* Стили для разных типов кнопок */
.continue-btn {
  background: linear-gradient(45deg, #00b894, #00a085);
}

.continue-btn:hover {
  background: linear-gradient(45deg, #00a085, #00b894);
}

.switch-btn {
  background: linear-gradient(45deg, #74b9ff, #0984e3);
}

.switch-btn:hover {
  background: linear-gradient(45deg, #0984e3, #74b9ff);
}

.chronicle-btn {
  background: linear-gradient(45deg, #fdcb6e, #e17055);
}

.chronicle-btn:hover {
  background: linear-gradient(45deg, #e17055, #fdcb6e);
}

.reconstruction-btn {
  background: linear-gradient(45deg, #a29bfe, #6c5ce7);
}

.reconstruction-btn:hover {
  background: linear-gradient(45deg, #6c5ce7, #a29bfe);
}

.restart-btn {
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
}

.restart-btn:hover {
  background: linear-gradient(45deg, #ee5a24, #ff6b6b);
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
  .interactive-video-container {
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
  
  .choice-title {
    font-size: 1.2rem;
  }
}
</style>
