<template>
  <div class="kinescope-player-wrapper">
    <iframe
      ref="playerIframeRef"
      :src="playerUrl"
      frameborder="0"
      allowfullscreen
      allow="autoplay; fullscreen"
      class="kinescope-iframe"
      @load="onIframeLoad"
    ></iframe>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

// ========================================
// PROPS
// ========================================

const props = defineProps({
  videoId: {
    type: String,
    required: true
  },
  autoplay: {
    type: Boolean,
    default: true
  },
  controls: {
    type: Boolean,
    default: true
  },
  muted: {
    type: Boolean,
    default: false
  }
})

// ========================================
// EMITS
// ========================================

const emit = defineEmits(['ready', 'timeupdate', 'ended', 'error'])

// ========================================
// REFS
// ========================================

const playerIframeRef = ref(null)

// ========================================
// STATE
// ========================================

const player = ref(null)
const isReady = ref(false)
const currentTime = ref(0)
const duration = ref(0)

// ========================================
// COMPUTED
// ========================================

const playerUrl = computed(() => {
  const params = new URLSearchParams({
    autoplay: props.autoplay ? '1' : '0',
    controls: props.controls ? '1' : '0',
    muted: props.muted ? '1' : '0',
    api: '1' // Включаем API для взаимодействия
  })
  
  return `https://kinescope.io/embed/${props.videoId}?${params.toString()}`
})

// ========================================
// LIFECYCLE
// ========================================

onMounted(() => {
  setupMessageListener()
})

onBeforeUnmount(() => {
  window.removeEventListener('message', handleMessage)
})

// ========================================
// METHODS
// ========================================

/**
 * Настраивает слушатель сообщений от Kinescope
 */
function setupMessageListener() {
  window.addEventListener('message', handleMessage)
}

/**
 * Обрабатывает сообщения от Kinescope плеера
 */
function handleMessage(event) {
  // Проверяем, что сообщение от Kinescope
  if (!event.origin.includes('kinescope.io')) return
  
  const data = event.data
  
  switch (data.type) {
    case 'ready':
      isReady.value = true
      emit('ready', data)
      break
      
    case 'timeupdate':
      currentTime.value = data.currentTime || 0
      duration.value = data.duration || 0
      emit('timeupdate', {
        currentTime: currentTime.value,
        duration: duration.value,
        seconds: currentTime.value
      })
      break
      
    case 'ended':
      emit('ended', data)
      break
      
    case 'error':
      emit('error', data)
      break
  }
}

/**
 * Обработчик загрузки iframe
 */
function onIframeLoad() {
  // Iframe загружен
}

/**
 * Отправляет сообщение в iframe плеера
 */
function sendMessage(message) {
  if (playerIframeRef.value && playerIframeRef.value.contentWindow) {
    playerIframeRef.value.contentWindow.postMessage(message, '*')
  }
}

/**
 * Управление воспроизведением
 */
function play() {
  sendMessage({ type: 'play' })
}

function pause() {
  sendMessage({ type: 'pause' })
}

function loadVideo(videoId) {
  emit('update:videoId', videoId)
}

function seekTo(time) {
  sendMessage({ type: 'seekTo', time: time })
}

function setVolume(volume) {
  sendMessage({ type: 'setVolume', volume: volume })
}

function setMuted(muted) {
  sendMessage({ type: 'setMuted', muted: muted })
}

// ========================================
// EXPOSE
// ========================================

// Экспортируем методы для использования в родительском компоненте
defineExpose({
  play,
  pause,
  loadVideo,
  seekTo,
  setVolume,
  setMuted,
  sendMessage
})
</script>

<style scoped>
.kinescope-player-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
}

.kinescope-iframe {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px;
}
</style>