<template>
  <div class="video-container">
    <!-- Kinescope плеер -->
    <KinescopePlayer
      :video-id="interactiveStore.currentVideoId"
      :autoplay="true"
      :controls="true"
      :muted="false"
      @ready="onPlayerReady"
      @timeupdate="onTimeUpdate"
      @ended="onVideoEnded"
      @error="onPlayerError"
      ref="kinescopePlayerRef"
    />
    
    <!-- Оверлей с выбором -->
    <ChoiceOverlay
      v-if="interactiveStore.currentChoice"
      :title="interactiveStore.currentChoice.title"
      :choices="interactiveStore.currentChoice.options"
      :show="!!interactiveStore.currentChoice"
      @choice-selected="handleChoiceSelected"
    />
    
    <!-- Переход между видео (встроенный) -->
    <div v-if="interactiveStore.isTransitioning" class="video-transition">
      <div class="transition-overlay">
        <div class="loading-spinner"></div>
        <p class="transition-text">{{ interactiveStore.transitionText }}</p>
      </div>
    </div>
    
    <!-- Элементы управления (встроенные) -->
    <div v-if="!interactiveStore.currentChoice && !interactiveStore.isTransitioning" class="video-controls">
      <div class="progress-bar" @click="seekTo">
        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        <div class="choice-markers">
          <div
            v-for="(point, index) in interactiveStore.choicePoints"
            :key="index"
            class="choice-marker"
            :style="{ left: getMarkerPosition(point.time) + '%' }"
            :class="{ 
              active: index === interactiveStore.currentChoiceIndex, 
              passed: index < interactiveStore.currentChoiceIndex 
            }"
          ></div>
        </div>
      </div>
      
      <div class="controls-info">
        <span class="current-time">{{ formatTime(currentTime) }}</span>
        <span class="total-time">{{ formatTime(duration) }}</span>
      </div>
    </div>
    
    <!-- Индикатор загрузки -->
    <div v-if="isLoading" class="loading">
      Загрузка видео...
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useInteractiveStore } from '@/stores/interactiveStore'
import ChoiceOverlay from './ChoiceOverlay.vue'
import KinescopePlayer from './KinescopePlayer.vue'

// ========================================
// STORES
// ========================================

const interactiveStore = useInteractiveStore()

// ========================================
// REFS
// ========================================

const kinescopePlayerRef = ref(null)

// ========================================
// STATE
// ========================================

const isLoading = ref(false)
const currentTime = ref(0)
const duration = ref(0)

// ========================================
// COMPUTED
// ========================================

const progressPercentage = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

// ========================================
// LIFECYCLE
// ========================================

onMounted(() => {
    // Плеер инициализируется автоматически через компонент
})

// ========================================
// METHODS
// ========================================

/**
 * Обработчик готовности плеера
 */
function onPlayerReady() {
      console.log('Плеер готов к воспроизведению')
  isLoading.value = false
}

/**
 * Обработчик обновления времени
 */
function onTimeUpdate(event) {
  currentTime.value = event.seconds || event.currentTime || 0
  duration.value = event.duration || duration.value
      
      // Проверяем, нужно ли показать выбор
  if (interactiveStore.shouldShowChoice(currentTime.value)) {
    const choicePoint = interactiveStore.currentChoicePoint
    if (choicePoint && !interactiveStore.currentChoice) {
      showChoice(choicePoint)
    }
  }
}

/**
 * Показывает интерфейс выбора
 */
function showChoice(choicePoint) {
  interactiveStore.showChoice(choicePoint)
      
      // Приостанавливаем видео
  if (kinescopePlayerRef.value) {
    kinescopePlayerRef.value.pause()
  }
}

/**
 * Обрабатывает выбранный вариант
 */
async function handleChoiceSelected(choice) {
  const success = await interactiveStore.handleChoiceSelected(choice)
  
  if (success && kinescopePlayerRef.value) {
        // Воспроизводим видео
    kinescopePlayerRef.value.play()
  }
}

/**
 * Обработчик завершения видео
 */
function onVideoEnded() {
  console.log('Видео завершено')
  // Здесь можно добавить логику для завершения интерактивного видео
}

/**
 * Обработчик ошибок плеера
 */
function onPlayerError(error) {
  console.error('Ошибка плеера:', error)
  isLoading.value = false
}

/**
 * Вспомогательные методы для элементов управления
 */
function getMarkerPosition(time) {
  if (duration.value === 0) return 0
  return (time / duration.value) * 100
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function seekTo(event) {
  if (kinescopePlayerRef.value) {
    const rect = event.currentTarget.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const percentage = clickX / rect.width
    const newTime = percentage * duration.value
    kinescopePlayerRef.value.seekTo(newTime)
  }
}
</script>

<style scoped>
.video-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
}

.kinescope-player {
  width: 100%;
  height: 100%;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  z-index: 5;
  background: rgba(0, 0, 0, 0.8);
  padding: 1rem 2rem;
  border-radius: 8px;
}

/* Стили для встроенных элементов управления */
.video-transition {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 15;
}

.transition-overlay {
  text-align: center;
  color: white;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #ff6b6b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.transition-text {
  font-size: 1.2rem;
  font-weight: 500;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.video-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 1rem;
  z-index: 5;
}

.progress-bar {
  position: relative;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  margin-bottom: 0.5rem;
  overflow: hidden;
  cursor: pointer;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff6b6b, #74b9ff);
  border-radius: 3px;
  transition: width 0.1s ease;
}

.choice-markers {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
}

.choice-marker {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  background: rgba(255, 255, 255, 0.5);
  border: 2px solid #fff;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.choice-marker.passed {
  background: #00b894;
  border-color: #00b894;
}

.choice-marker.active {
  background: #ff6b6b;
  border-color: #ff6b6b;
  box-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: translateY(-50%) scale(1); }
  50% { transform: translateY(-50%) scale(1.2); }
}

.controls-info {
  display: flex;
  justify-content: space-between;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}
</style>