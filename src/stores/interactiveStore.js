import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useInteractiveStore = defineStore('interactive', () => {
  // ========================================
  // STATE
  // ========================================
  
  const currentVideoId = ref('your-initial-video-id')
  const currentChoice = ref(null)
  const currentChoiceIndex = ref(0)
  const isTransitioning = ref(false)
  const transitionText = ref('Загрузка следующего видео...')
  
  // Конфигурация точек выбора
  const choicePoints = ref([
    {
      time: 10, // секунда, на которой появляется выбор
      title: 'Выберите свой путь:',
      options: [
        { id: 'video-1', label: 'Пойти налево', videoId: 'video-left-id' },
        { id: 'video-2', label: 'Пойти направо', videoId: 'video-right-id' }
      ]
    },
    {
      time: 25,
      title: 'Что делать дальше?',
      options: [
        { id: 'video-3', label: 'Сражаться', videoId: 'video-fight-id' },
        { id: 'video-4', label: 'Убежать', videoId: 'video-run-id' },
        { id: 'video-5', label: 'Попытаться договориться', videoId: 'video-talk-id' }
      ]
    }
  ])
  
  // История выбранных вариантов
  const choiceHistory = ref([])
  
  // ========================================
  // COMPUTED
  // ========================================
  
  const hasMoreChoices = computed(() => {
    return currentChoiceIndex.value < choicePoints.value.length
  })
  
  const currentChoicePoint = computed(() => {
    if (currentChoiceIndex.value < choicePoints.value.length) {
      return choicePoints.value[currentChoiceIndex.value]
    }
    return null
  })
  
  const totalChoices = computed(() => {
    return choicePoints.value.length
  })
  
  // ========================================
  // ACTIONS
  // ========================================
  
  /**
   * Проверяет, нужно ли показать выбор в текущий момент
   */
  function shouldShowChoice(currentTime) {
    if (!hasMoreChoices.value) return false
    
    const choicePoint = currentChoicePoint.value
    return currentTime >= choicePoint.time
  }
  
  /**
   * Показывает интерфейс выбора
   */
  function showChoice(choicePoint) {
    currentChoice.value = choicePoint
    console.log('Показываем выбор:', choicePoint.title)
  }
  
  /**
   * Обрабатывает выбранный вариант
   */
  async function handleChoiceSelected(choice) {
    console.log('Выбран вариант:', choice)
    
    // Добавляем в историю
    choiceHistory.value.push({
      choice: choice,
      timestamp: Date.now(),
      videoId: currentVideoId.value
    })
    
    // Скрываем выбор
    currentChoice.value = null
    
    // Показываем переход
    isTransitioning.value = true
    transitionText.value = `Загружаем: ${choice.label}...`
    
    try {
      // Небольшая задержка для плавности
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Загружаем новое видео
      await loadVideo(choice.videoId)
      
      // Переходим к следующей точке выбора
      currentChoiceIndex.value++
      
      // Скрываем переход
      isTransitioning.value = false
      
      return true
    } catch (error) {
      console.error('Ошибка загрузки видео:', error)
      isTransitioning.value = false
      return false
    }
  }
  
  /**
   * Загружает новое видео
   */
  async function loadVideo(videoId) {
    return new Promise((resolve, reject) => {
      try {
        // Обновляем ID видео
        currentVideoId.value = videoId
        
        // Имитируем загрузку
        setTimeout(() => {
          resolve()
        }, 1000)
        
      } catch (error) {
        reject(error)
      }
    })
  }
  
  /**
   * Сбрасывает состояние интерактивности
   */
  function resetInteractiveState() {
    currentChoiceIndex.value = 0
    currentChoice.value = null
    choiceHistory.value = []
    isTransitioning.value = false
  }
  
  /**
   * Обновляет конфигурацию точек выбора
   */
  function updateChoicePoints(newChoicePoints) {
    choicePoints.value = newChoicePoints
    resetInteractiveState()
  }
  
  /**
   * Добавляет новую точку выбора
   */
  function addChoicePoint(choicePoint) {
    choicePoints.value.push(choicePoint)
  }
  
  /**
   * Удаляет точку выбора по индексу
   */
  function removeChoicePoint(index) {
    if (index >= 0 && index < choicePoints.value.length) {
      choicePoints.value.splice(index, 1)
    }
  }
  
  /**
   * Получает статистику выбранных вариантов
   */
  function getChoiceStatistics() {
    const stats = {}
    choiceHistory.value.forEach(entry => {
      const choiceId = entry.choice.id
      stats[choiceId] = (stats[choiceId] || 0) + 1
    })
    return stats
  }
  
  return {
    // State
    currentVideoId,
    currentChoice,
    currentChoiceIndex,
    isTransitioning,
    transitionText,
    choicePoints,
    choiceHistory,
    
    // Computed
    hasMoreChoices,
    currentChoicePoint,
    totalChoices,
    
    // Actions
    shouldShowChoice,
    showChoice,
    handleChoiceSelected,
    loadVideo,
    resetInteractiveState,
    updateChoicePoints,
    addChoicePoint,
    removeChoicePoint,
    getChoiceStatistics
  }
})

