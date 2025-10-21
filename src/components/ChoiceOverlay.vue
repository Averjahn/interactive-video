<template>
  <div class="choices-overlay" :class="{ show: show }">
    <h2 class="choice-title">{{ title }}</h2>
    <div class="choices-buttons">
      <button
        v-for="(choice, index) in choices"
        :key="choice.id"
        class="choice-button"
        :class="getButtonClass(index)"
        @click="selectChoice(choice)"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        {{ choice.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// ========================================
// PROPS
// ========================================

const props = defineProps({
    title: {
      type: String,
      required: true
    },
    choices: {
      type: Array,
      required: true,
      validator: (choices) => {
        return choices.every(choice => 
          choice.id && choice.label && choice.videoId
        )
      }
    },
    show: {
      type: Boolean,
      default: false
    }
})

// ========================================
// EMITS
// ========================================

const emit = defineEmits(['choice-selected'])

// ========================================
// COMPUTED
// ========================================

/**
 * Возвращает CSS класс для кнопки в зависимости от индекса
 */
function getButtonClass(index) {
  const classes = ['choice-button']
  
  // Добавляем специфичные классы для разных позиций
  if (index === 0) {
    classes.push('choice-button--first')
  } else if (index === 1) {
    classes.push('choice-button--second')
  } else if (index === 2) {
    classes.push('choice-button--third')
  } else if (index === 3) {
    classes.push('choice-button--fourth')
  }
  
  return classes
}

// ========================================
// METHODS
// ========================================

/**
 * Обрабатывает выбор пользователя
 */
function selectChoice(choice) {
  emit('choice-selected', choice)
}
</script>

<style scoped>
.choices-overlay {
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
  z-index: 10;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.choices-overlay.show {
  opacity: 1;
  visibility: visible;
}

.choice-title {
  font-size: 40px;
  margin-bottom: 48px;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  font-weight: bold;
  background: linear-gradient(45deg, #fff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: fadeInUp 0.6s ease;
}

.choices-buttons {
  display: flex;
  gap: 24px;
  justify-content: center;
  max-width: 900px;
}

.choice-button {
  padding: 19px 40px;
  font-size: 21px;
  font-weight: bold;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  min-width: 280px;
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.6s ease;
  transform: translateY(20px);
  opacity: 0;
}

/* Анимация появления */
.choice-button:nth-child(1) {
  animation-delay: 0.1s;
  animation-fill-mode: forwards;
}

.choice-button:nth-child(2) {
  animation-delay: 0.2s;
  animation-fill-mode: forwards;
}

.choice-button:nth-child(3) {
  animation-delay: 0.3s;
  animation-fill-mode: forwards;
}

.choice-button:nth-child(4) {
  animation-delay: 0.4s;
  animation-fill-mode: forwards;
}

/* Стили для разных позиций кнопок */
.choice-button--first {
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
}

.choice-button--second {
  background: linear-gradient(45deg, #74b9ff, #0984e3);
}

.choice-button--third {
  background: linear-gradient(45deg, #00b894, #00a085);
}

.choice-button--fourth {
  background: linear-gradient(45deg, #fdcb6e, #e17055);
}

/* Эффект блеска при наведении */
.choice-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.choice-button:hover::before {
  left: 100%;
}

.choice-button:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.choice-button:active {
  transform: translateY(-1px) scale(1.02);
}

/* Анимации */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Адаптивность */
@media (max-width: 768px) {
  .choice-title {
    font-size: 29px;
    margin-bottom: 32px;
  }
  
  .choice-button {
    font-size: 18px;
    padding: 16px 32px;
    min-width: 180px;
  }
  
  .choices-buttons {
    align-items: center;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .choice-title {
    font-size: 24px;
    margin-bottom: 24px;
  }
  
  .choice-button {
    font-size: 16px;
    padding: 13px 24px;
    min-width: 160px;
  }
}
</style>