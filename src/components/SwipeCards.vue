<script setup>
import { ref, onMounted, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  profiles: {
    type: Array,
    required: true
  },
  artistName: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['swipeLeft', 'swipeRight', 'nextTrack']);

// Estado para manejar las animaciones 
const isDragging = ref(false);
const startX = ref(0);
const currentX = ref(0);
//const audioPlayer = ref(null);
const isPlaying = ref(false);
const audioLoaded = ref(false);
const tapStartTime = ref(0);
const tapTimeout = ref(null);

// Calcular el estilo de transformación basado en el arrastre
const cardStyle = (profile) => {
  if (!isDragging.value) return {};
  
  const rotation = currentX.value / 20; // Rotación suave basada en el arrastre
  const opacity = Math.max(0, Math.min(1, 1 - Math.abs(currentX.value) / 300));
  
  return {
    transform: `translateX(${currentX.value}px) rotate(${rotation}deg)`,
    opacity: opacity.toString()
  };
};

// Función para formatear la duración en formato mm:ss
const formatDuration = (ms) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

// Manejo de tap en la imagen
const handleImageTap = (event) => {
  // Si el usuario está arrastrando, no registrar como tap
  if (isDragging.value) return;
  
  // Detectar si es un clic en el botón de reproducción
  if (event.target.closest('.play-button')) {
    return;
  }
  
  // Registrar el tiempo de inicio del tap
  tapStartTime.value = Date.now();
  
  // Configurar un tiempo de espera corto para distinguir entre tap y arrastre
  clearTimeout(tapTimeout.value);
  tapTimeout.value = setTimeout(() => {
    // Si pasó poco tiempo, considerarlo un tap válido
    if (Date.now() - tapStartTime.value < 300) {
      emit('nextTrack');
    }
  }, 50);
};

// Iniciar el arrastre
const startDrag = (event) => {
  // No iniciar arrastre si el clic es en el botón de reproducción
  if (event.target.closest('.audio-controls')) return;
  
  isDragging.value = true;
  startX.value = event.touches ? event.touches[0].clientX : event.clientX;
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', endDrag);
  document.addEventListener('touchmove', onDrag);
  document.addEventListener('touchend', endDrag);
};

// Continuar el arrastre
const onDrag = (event) => {
  if (!isDragging.value) return;
  const clientX = event.touches ? event.touches[0].clientX : event.clientX;
  currentX.value = clientX - startX.value;
  
  // Si hay un movimiento significativo, cancelar el tap
  if (Math.abs(currentX.value) > 10) {
    clearTimeout(tapTimeout.value);
  }
};

// Finalizar el arrastre
const endDrag = () => {
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', endDrag);
  document.removeEventListener('touchmove', onDrag);
  document.removeEventListener('touchend', endDrag);
  
  // Determinar si el swipe fue lo suficientemente largo para una acción
  if (currentX.value < -100) {
    emit('swipeLeft');
  } else if (currentX.value > 100) {
    emit('swipeRight');
  }
  
  // Reset de valores
  isDragging.value = false;
  currentX.value = 0;
};

const toggleAudio = (profile, event) => {
  event.stopPropagation(); // Evitar que el clic se propague al contenedor
  
  // Buscar el elemento de audio en el DOM
  try {
    const audioElement = document.querySelector(`audio[data-track-id="${profile.trackId}"]`);
    
    if (!audioElement) {
      console.error('Audio element not found');
      return;
    }
    
    if (isPlaying.value) {
      audioElement.pause();
      isPlaying.value = false;
    } else {
      // Detener cualquier otro audio que se esté reproduciendo
      document.querySelectorAll('audio').forEach(audio => {
        if (audio !== audioElement) {
          audio.pause();
        }
      });
      
      // Reproducir el audio seleccionado
      audioElement.volume = 1.0;
      const playPromise = audioElement.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            isPlaying.value = true;
            console.log('Audio playing successfully');
          })
          .catch(error => {
            console.error('Error playing audio:', error);
            isPlaying.value = false;
          });
      }
    }
  } catch (error) {
    console.error('Error with audio playback:', error);
    isPlaying.value = false;
  }
};

// Evento cuando el audio se carga
const onAudioLoad = () => {
  audioLoaded.value = true;
};

// Evento cuando el audio termina
const onAudioEnded = () => {
  isPlaying.value = false;
};

watch(() => props.profiles, () => {
  isPlaying.value = false;
  document.querySelectorAll('audio').forEach(audio => {
    audio.pause();
  });
}, { deep: true });


onMounted(() => {
  // Limpiar eventos al desmontar
  return () => {
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('touchmove', onDrag);
    document.removeEventListener('touchend', endDrag);
    clearTimeout(tapTimeout.value);
    
    document.querySelectorAll('audio').forEach(audio => {
      audio.pause();
    });
  };
});
</script>

<template>
  <div class="swipe-cards-container">
    <div 
      v-for="profile in profiles" 
      :key="profile.trackId" 
      class="swipe-card"
      @mousedown="startDrag"
      @touchstart="startDrag"
      :style="cardStyle(profile)"
    >
      <div class="card-image" @click="handleImageTap">
        <img :src="profile.albumImage" :alt="profile.trackName">
        <!-- <div class="image-overlay">
          <div class="tap-indicator">
            <span>Tap para navegar</span>
          </div>
        </div> -->
        <div class="audio-controls" v-if="profile.trackPreview">
          <button class="play-button" @click="(e) => toggleAudio(profile, e)">
            <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          </button>
          <audio 
  :data-track-id="profile.trackId"
  :src="profile.trackPreview" 
  @ended="onAudioEnded"
  preload="auto"
></audio>
        </div>
      </div>
      <div class="card-info">
        <h1>{{ artistName }}</h1>
        <h2 class="track-name">{{ profile.trackName }}</h2>
        <div class="track-details">
          <span class="track-duration">{{ formatDuration(profile.trackDuration) }}</span>
          <div class="track-popularity">
            <span>Popularidad: {{ profile.trackPopularity }}</span>
            <div class="popularity-bar">
              <div class="popularity-fill" :style="{width: `${profile.trackPopularity}%`}"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Indicadores de swipe -->
      <div class="swipe-indicator left" :class="{ active: currentX.value < -50 }">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </div>
      <div class="swipe-indicator right" :class="{ active: currentX.value > 50 }">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.swipe-cards-container {
  flex: 1;
  position: relative;
  padding: 1rem;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.swipe-card {
  position: absolute;
  width: 100%;
  max-width: 600px;
  height: 610px;
   background-color: white;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  touch-action: pan-y;
  user-select: none;
  transition: transform 0.2s ease, opacity 0.2s ease;
    max-width:463px;

}

.card-image {
  position: relative;
  height: 75%;
  overflow: hidden;
  cursor: pointer;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3));
  opacity: 0;
  transition: opacity 0.3s;
}

.card-image:hover .image-overlay {
  opacity: 1;
}

.tap-indicator {
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  text-align: center;
}

.audio-controls {
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 10;
}

.play-button {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.card-info {
  padding: rem;
  height: 25%;
}

.track-name {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-details {
  color: #666;
  font-size: 0.9rem;
}

.track-duration {
  display: block;
  margin-bottom: 0.5rem;
}

.popularity-bar {
  height: 6px;
  background-color: #eee;
  border-radius: 3px;
  margin-top: 4px;
  overflow: hidden;
}

.popularity-fill {
  height: 100%;
  background-color: var(--color-tercero);
}

.swipe-indicator {
  position: absolute;
  top: 40%;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.swipe-indicator.left {
  left: 1rem;
  color: #fe3c72;
}

.swipe-indicator.right {
  right: 1rem;
  color: #4CAF50;
}

.swipe-indicator.active {
  opacity: 0.9;
}
</style>