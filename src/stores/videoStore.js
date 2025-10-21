import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { videoConfig } from '@/config/videoConfig'

export const useVideoStore = defineStore('video', () => {
  // ========================================
  // STATE
  // ========================================
  
  const currentVideoSrc = ref(videoConfig.videoFragments.rh1)
  const currentTime = ref(0)
  const duration = ref(0)
  const isLoading = ref(false)
  const isTransitioning = ref(false)
  const showChoices = ref(false)
  const hasShownChoice = ref(false)
  const transitionText = ref('Загрузка видео...')
  const currentVideoId = ref('rh1')
  const videoHistory = ref([])
  
  // Конфигурация видео из config
  const videos = ref(videoConfig.videoFragments)
  
  // Состояние загрузки видео
  const videosLoaded = ref({
    rh1: false,
    rh2: false,
    rh3: false,
    rh4: false
  })
  
  // Предзагруженные видео элементы
  const preloadedVideos = ref({
    rh1: null,
    rh2: null,
    rh3: null,
    rh4: null
  })
  
  // Система логирования
  const loadingLogs = ref([])
  
  // ========================================
  // COMPUTED
  // ========================================
  
  const progressPercentage = computed(() => {
    if (duration.value === 0) return 0
    return (currentTime.value / duration.value) * 100
  })
  
  const allVideosLoaded = computed(() => {
    return Object.values(videosLoaded.value).every(loaded => loaded)
  })
  
  // ========================================
  // ACTIONS
  // ========================================
  
  /**
   * Добавляет лог с временной меткой для отслеживания процесса загрузки
   */
  function addLoadingLog(videoType, event, message, details = null) {
    const timestamp = new Date().toLocaleTimeString('ru-RU', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      fractionalSecondDigits: 3
    })
    
    const logEntry = {
      time: timestamp,
      video: videoType,
      event: event,
      message: message,
      timestamp: Date.now(),
      details: details
    }
    
    loadingLogs.value.push(logEntry)
    
    // Выводим в консоль с цветным форматированием
    const colors = {
      rh1: '#ff6b6b',
      rh2: '#00b894', 
      rh3: '#fdcb6e',
      rh4: '#a29bfe',
      main: '#ff6b6b',
      second: '#00b894', 
      third: '#fdcb6e',
      start: '#74b9ff',
      metadata: '#a29bfe',
      canplay: '#00b894',
      error: '#e17055',
      choice: '#9b59b6'
    }
    
    // Логирование отключено для продакшена
  }
  
  /**
   * Инициализирует предзагрузку всех видео
   */
  function preloadVideos() {
    addLoadingLog('main', 'start', '🚀 Инициализация системы предзагрузки видео')
    
    // Основное видео уже загружается через основной элемент
    videosLoaded.value.main = true
    addLoadingLog('main', 'metadata', '✅ Основное видео готово к воспроизведению')
    
    // Запускаем предзагрузку дополнительных видео
    addLoadingLog('second', 'start', '📥 Начинаем предзагрузку Second Video...')
    addLoadingLog('third', 'start', '📥 Начинаем предзагрузку Third Video...')
  }
  
  /**
   * Предзагружает конкретное видео
   */
  function preloadVideo(videoType) {
    addLoadingLog(videoType, 'start', `🔍 Находим элемент видео в DOM`)
    addLoadingLog(videoType, 'start', `📡 Отправляем запрос на загрузку видео файла`)
  }
  
  /**
   * Настраивает обработчики событий для отслеживания загрузки видео
   */
  function setupVideoEventListeners(videoElement, videoType) {
    // Событие: начало загрузки
    videoElement.addEventListener('loadstart', () => {
      addLoadingLog(videoType, 'start', `🌐 Начало загрузки с сервера`, {
        src: videoElement.src,
        networkState: videoElement.networkState,
        readyState: videoElement.readyState
      })
    })
    
    // Событие: загружены метаданные
    videoElement.addEventListener('loadedmetadata', () => {
      const duration = videoElement.duration
      const videoWidth = videoElement.videoWidth
      const videoHeight = videoElement.videoHeight
      addLoadingLog(videoType, 'metadata', `📊 Метаданные загружены (длительность: ${duration.toFixed(2)}с)`, {
        duration: duration,
        dimensions: `${videoWidth}x${videoHeight}`,
        readyState: videoElement.readyState
      })
    })
    
    // Событие: загружены первые кадры
    videoElement.addEventListener('canplay', () => {
      addLoadingLog(videoType, 'canplay', `▶️ Видео готово к воспроизведению`, {
        readyState: videoElement.readyState,
        networkState: videoElement.networkState,
        buffered: videoElement.buffered.length > 0 ? videoElement.buffered.end(0) : 0
      })
      videosLoaded.value[videoType] = true
      preloadedVideos.value[videoType] = videoElement
    })
    
    // Событие: видео полностью загружено
    videoElement.addEventListener('canplaythrough', () => {
      addLoadingLog(videoType, 'canplay', `🎯 Видео полностью загружено и готово к воспроизведению`, {
        readyState: videoElement.readyState,
        networkState: videoElement.networkState
      })
    })
    
    // Событие: ошибка загрузки
    videoElement.addEventListener('error', (error) => {
      const errorDetails = {
        error: error,
        code: videoElement.error?.code,
        message: videoElement.error?.message,
        networkState: videoElement.networkState,
        readyState: videoElement.readyState
      }
      addLoadingLog(videoType, 'error', `❌ Ошибка загрузки: ${error.message || 'Неизвестная ошибка'}`, errorDetails)
    })
    
    // Событие: прогресс загрузки
    videoElement.addEventListener('progress', () => {
      if (videoElement.buffered.length > 0) {
        const buffered = videoElement.buffered.end(0)
        const duration = videoElement.duration
        const progress = duration > 0 ? (buffered / duration * 100).toFixed(1) : 0
        addLoadingLog(videoType, 'start', `📈 Прогресс загрузки: ${progress}%`, {
          buffered: buffered,
          duration: duration,
          progress: progress
        })
      }
    })
    
    // Событие: приостановка загрузки
    videoElement.addEventListener('suspend', () => {
      addLoadingLog(videoType, 'start', `⏸️ Загрузка приостановлена`, {
        networkState: videoElement.networkState,
        readyState: videoElement.readyState
      })
    })
    
    // Событие: возобновление загрузки
    videoElement.addEventListener('stalled', () => {
      addLoadingLog(videoType, 'start', `⏳ Загрузка застряла`, {
        networkState: videoElement.networkState,
        readyState: videoElement.readyState
      })
    })
  }
  
  /**
   * Переключение между видео
   */
  function switchVideo(videoType, transitionText = 'Загрузка видео...') {
    const videoSrc = videos.value[videoType]
    const isLoaded = videosLoaded.value[videoType]
    
    addLoadingLog(videoType, 'start', `🔄 Пользователь запросил переключение на ${videoType} видео`)
    
    if (!isLoaded) {
      addLoadingLog(videoType, 'error', `❌ Видео еще не загружено, переключение невозможно`)
      return false
    }
    
    addLoadingLog(videoType, 'start', `✅ Видео готово, начинаем переключение`)
    
    // Скрываем выбор и показываем переход
    showChoices.value = false
    isTransitioning.value = true
    transitionText.value = transitionText
    addLoadingLog(videoType, 'start', `👁️ Скрываем интерфейс выбора, показываем переход`)
    
    // Переключаемся на выбранное видео
    currentVideoSrc.value = videoSrc
    hasShownChoice.value = false
    currentTime.value = 0
    addLoadingLog(videoType, 'start', `🎬 Меняем источник видео на: ${videoSrc}`)
    
    return true
  }
  
  /**
   * Обновляет время воспроизведения
   */
  function updateTime(time) {
    currentTime.value = time
  }
  
  /**
   * Обновляет длительность видео
   */
  function updateDuration(newDuration) {
    duration.value = newDuration
  }
  
  /**
   * Показывает интерфейс выбора
   */
  function showChoice() {
    showChoices.value = true
    hasShownChoice.value = true
    addLoadingLog('main', 'start', `🎯 Показываем интерфейс выбора видео, ставим на паузу`)
  }
  
  /**
   * Скрывает интерфейс выбора
   */
  function hideChoice() {
    showChoices.value = false
  }
  
  /**
   * Устанавливает состояние загрузки
   */
  function setLoading(loading) {
    isLoading.value = loading
  }
  
  /**
   * Устанавливает состояние перехода
   */
  function setTransitioning(transitioning) {
    isTransitioning.value = transitioning
  }
  
  /**
   * Сбрасывает состояние выбора при загрузке нового видео
   */
  function resetChoiceState() {
    hasShownChoice.value = false
  }
  
  /**
   * Переключает видео по ID
   */
  function switchToVideo(videoId, transitionMessage = 'Загрузка видео...') {
    const videoSrc = videos.value[videoId]
    
    if (!videoSrc) {
      addLoadingLog(videoId, 'error', `❌ Видео с ID ${videoId} не найдено`, {
        availableVideos: Object.keys(videos.value),
        requestedVideo: videoId
      })
      return false
    }
    
    addLoadingLog(videoId, 'start', `🔄 Переключение на видео ${videoId}`, {
      from: currentVideoId.value,
      to: videoId,
      src: videoSrc,
      isLoaded: videosLoaded.value[videoId]
    })
    
    // Добавляем в историю
    const historyEntry = {
      from: currentVideoId.value,
      to: videoId,
      timestamp: Date.now()
    }
    videoHistory.value.push(historyEntry)
    
    addLoadingLog('system', 'start', `📚 История переходов обновлена`, {
      totalTransitions: videoHistory.value.length,
      lastTransition: historyEntry
    })
    
    // Скрываем выбор и мгновенно переключаемся
    showChoices.value = false
    isTransitioning.value = true
    transitionText.value = transitionMessage
    
    // Мгновенное переключение на выбранное видео
    currentVideoSrc.value = videoSrc
    currentVideoId.value = videoId
    hasShownChoice.value = false
    currentTime.value = 0
    
    addLoadingLog(videoId, 'start', `🎬 Переключение на: ${videoSrc}`, {
      newSrc: videoSrc,
      newVideoId: videoId,
      transitionMessage: transitionMessage
    })
    
    return true
  }
  
  /**
   * Проверяет, нужно ли показать выбор в середине первого фрагмента
   */
  function shouldShowMidChoice(currentTime, videoId) {
    return videoId === 'rh1' && currentTime >= 15 && !hasShownChoice.value
  }
  
  /**
   * Проверяет, нужно ли показать выбор в конце видео
   */
  function shouldShowEndChoice(videoId) {
    return ['rh1', 'rh2', 'rh3', 'rh4'].includes(videoId)
  }
  
  /**
   * Получает тип выбора для текущего видео
   */
  function getChoiceType(videoId, isEndChoice = false) {
    if (videoId === 'rh1' && !isEndChoice) return 'style-choice'
    if (['rh1', 'rh2'].includes(videoId) && isEndChoice) return 'content-choice'
    if (['rh3', 'rh4'].includes(videoId)) return 'restart-choice'
    return null
  }
  
  /**
   * Сбрасывает к начальному состоянию
   */
  function resetToStart() {
    addLoadingLog('system', 'start', '🔄 Сброс к начальному состоянию')
    videoHistory.value = []
    switchToVideo('rh1', 'Возврат к началу...')
  }
  
  /**
   * Получает конфигурацию выборов из config
   */
  function getChoiceConfig() {
    return videoConfig.choicePoints
  }
  
  /**
   * Получает конфигурацию плеера из config
   */
  function getPlayerConfig() {
    return videoConfig.playerSettings
  }
  
  return {
    // State
    currentVideoSrc,
    currentTime,
    duration,
    isLoading,
    isTransitioning,
    showChoices,
    hasShownChoice,
    transitionText,
    currentVideoId,
    videoHistory,
    videos,
    videosLoaded,
    preloadedVideos,
    loadingLogs,
    
    // Computed
    progressPercentage,
    allVideosLoaded,
    
    // Actions
    addLoadingLog,
    preloadVideos,
    preloadVideo,
    setupVideoEventListeners,
    switchVideo,
    updateTime,
    updateDuration,
    showChoice,
    hideChoice,
    setLoading,
    setTransitioning,
    resetChoiceState,
    switchToVideo,
    shouldShowMidChoice,
    shouldShowEndChoice,
    getChoiceType,
    resetToStart,
    getChoiceConfig,
    getPlayerConfig
  }
})

