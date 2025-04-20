<script setup>
import { ref, computed } from 'vue';

// Props para recibir datos del componente padre
const props = defineProps({
  profiles: {
    type: Array,
    required: true
  },
  currentIndex: {
    type: Number,
    required: true
  }
});

// Emits para comunicar eventos al componente padre
const emit = defineEmits(['swipeLeft', 'swipeRight', 'startDrag', 'onDrag', 'endDrag']);

// Estado para el deslizamiento
const isDragging = ref(false);
const startX = ref(0);
const currentX = ref(0);
const swipeDirection = ref(null);
const cardContainer = ref(null);

// Calcular perfiles visibles (actual + siguiente)
const visibleProfiles = computed(() => {
  return props.profiles.slice(props.currentIndex, props.currentIndex + 2);
});

// Clase para el overlay durante el deslizamiento
const overlayClass = computed(() => {
  if (!isDragging.value) return '';
  return swipeDirection.value === 'right' ? 'like-overlay' : 'nope-overlay';
});

// Estilo para las tarjetas basado en la posición
const getCardStyle = (index) => {
  if (index !== 0) return { zIndex: 1 };
  
  if (isDragging.value) {
    const rotate = (currentX.value - startX.value) / 10;
    return {
      transform: `translateX(${currentX.value - startX.value}px) rotate(${rotate}deg)`,
      zIndex: 2
    };
  }
  
  return { zIndex: 2 };
};

// Iniciar el deslizamiento
const startDrag = (event) => {
  if (props.profiles.length === 0) return;
  
  isDragging.value = true;
  startX.value = event.type === 'touchstart' 
    ? event.touches[0].clientX 
    : event.clientX;
  currentX.value = startX.value;
  
  emit('startDrag', event);
};

// Durante el deslizamiento
const onDrag = (event) => {
  if (!isDragging.value) return;
  
  event.preventDefault();
  
  currentX.value = event.type === 'touchmove' 
    ? event.touches[0].clientX 
    : event.clientX;
  
  const diffX = currentX.value - startX.value;
  swipeDirection.value = diffX > 0 ? 'right' : 'left';
  
  emit('onDrag', event);
};

// Finalizar el deslizamiento
const endDrag = () => {
  if (!isDragging.value) return;
  
  const diffX = currentX.value - startX.value;
  const threshold = window.innerWidth * 0.3;
  
  if (Math.abs(diffX) > threshold) {
    if (diffX > 0) {
      emit('swipeRight');
    } else {
      emit('swipeLeft');
    }
  }
  
  isDragging.value = false;
  swipeDirection.value = null;
  
  emit('endDrag');
};
</script>

<template>
  <div class="card-container" ref="cardContainer">
    <div 
      v-for="(profile, index) in visibleProfiles" 
      :key="profile.id"
      class="card"
      :class="{ 'active': index === 0 }"
      :style="getCardStyle(index)"
      @touchstart="startDrag"
      @touchmove="onDrag"
      @touchend="endDrag"
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="endDrag"
      @mouseleave="endDrag"
    >
      <div class="card-image" :style="{ backgroundImage: `url(${profile.image})` }">
        <div class="card-gradient">
          <div class="profile-info">
            <h2>{{ profile.name }}, {{ profile.age }}</h2>
            <p>{{ profile.bio }}</p>
          </div>
        </div>
      </div>
      <div class="swipe-overlay" :class="overlayClass">
        <div v-if="swipeDirection === 'right'" class="like-badge">LIKE</div>
        <div v-if="swipeDirection === 'left'" class="nope-badge">NOPE</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  background-color: ;
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: first baseline;
  overflow: hidden;
}

.card {
  position: absolute;
  width: 100%;
  height: 70vh;
  max-height: 600px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
  touch-action: none;
}

.card-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.card-gradient {
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, transparent 60%, rgba(0, 0, 0, 0.8));
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.profile-info {
  padding: 1.5rem;
  color: white;
}

.profile-info h2 {
  font-size: 1.75rem;
  margin: 0;
  font-weight: bold;
}

.profile-info p {
  margin: 0.5rem 0 0;
  font-size: 1rem;
  opacity: 0.9;
}

.swipe-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}

.like-overlay {
  background-color: rgba(0, 200, 81, 0.2);
}

.nope-overlay {
  background-color: rgba(254, 60, 114, 0.2);
}

.like-badge, .nope-badge {
  padding: 0.5rem 1rem;
  border: 3px solid;
  border-radius: 5px;
  font-weight: bold;
  font-size: 2rem;
  transform: rotate(-20deg);
}

.like-badge {
  color: #00c851;
  border-color: #00c851;
}

.nope-badge {
  color: #fe3c72;
  border-color: #fe3c72;
}
</style>