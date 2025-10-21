// Конфигурация интерактивного видео
export const videoConfig = {
  // URL фрагментов видео
  videoFragments: {
    rh1: 'https://med-game.ru/sites/default/files/video/rh/rh1.mp4', // Первый фрагмент (рисованный)
    rh2: 'https://med-game.ru/sites/default/files/video/rh/rh2.mp4', // Второй фрагмент (кукольный)
    rh3: 'https://med-game.ru/sites/default/files/video/rh/rh3.mp4', // Третий фрагмент (хроника 1934г)
    rh4: 'https://med-game.ru/sites/default/files/video/rh/rh4.mp4'  // Четвертый фрагмент (реконструкция 2025г)
  },
  
  // Точки выбора в видео
  choicePoints: [
    {
      time: 15, // секунда в середине первого фрагмента
      title: 'Выберите стиль видео:',
      type: 'style-choice',
      options: [
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
    },
    {
      time: 'end', // В конце воспроизведения первого/второго фрагмента
      title: 'Выберите что показать:',
      type: 'content-choice',
      options: [
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
    },
    {
      time: 'end', // В конце третьего/четвертого фрагмента
      title: 'Что делать дальше?',
      type: 'restart-choice',
      options: [
        { 
          id: 'watch-again', 
          label: 'Посмотреть ещё раз?', 
          videoId: 'rh1',
          description: 'Вернуться к началу и посмотреть заново'
        }
      ]
    }
  ],
  
  // Настройки плеера
  playerSettings: {
    width: '100%',
    height: '100%',
    autoplay: true,
    controls: true,
    muted: false,
    loop: false
  },
  
  // Настройки UI
  uiSettings: {
    showProgressBar: true,
    showChoiceMarkers: true,
    transitionDuration: 500, // мс
    choiceDisplayDuration: 5000, // мс (0 = до выбора)
    autoHideControls: true,
    controlsHideDelay: 3000 // мс
  },
  
  // Настройки анимаций
  animations: {
    choiceButtons: {
      entrance: 'fadeInUp',
      hover: 'scale',
      click: 'bounce'
    },
    transitions: {
      type: 'fade',
      duration: 300
    }
  }
}

// Вспомогательные функции
export const helpers = {
  // Форматирование времени
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  },
  
  // Получение прогресса в процентах
  getProgress(currentTime, duration) {
    if (duration === 0) return 0
    return (currentTime / duration) * 100
  },
  
  // Получение позиции маркера на прогресс-баре
  getMarkerPosition(time, duration) {
    if (duration === 0) return 0
    return (time / duration) * 100
  },
  
  // Проверка, нужно ли показать выбор
  shouldShowChoice(currentTime, choicePoint, currentChoiceIndex) {
    return currentTime >= choicePoint.time && 
           currentChoiceIndex < choicePoint.time
  }
}
