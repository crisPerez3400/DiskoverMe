<script setup>
import { useArtistsStore } from '../stores/useArtistsStore';
import { computed, onMounted } from 'vue';
import SwipeCards from '../components/SwipeCards.vue';

const artistsStore = useArtistsStore();

const profiles = computed(() => artistsStore.visibleProfiles);
const isLoading = computed(() => artistsStore.isLoading);
const currentUser = computed(() => artistsStore.currentUser); // Acceso al usuario desde el store

onMounted(() => {
  // Cargar datos específicos para la vista Diskover si es necesario
  console.log('Usuario en DiskoverView:', currentUser.value);
});
</script>

<template>
  <div class="diskover-view">
    
    <!-- Loading indicator -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando perfil...</p>
    </div>

    <!-- Componente SwipeCards con los perfiles -->
    <SwipeCards
      v-else
      :profiles="artistsStore.visibleProfiles"
      :artistName="artistsStore.profiles.artist ? artistsStore.profiles.artist.name : ''"
      @swipeLeft="artistsStore.swipeLeft"
      @swipeRight="artistsStore.swipeRight"
      @nextTrack="artistsStore.nextTrack" />

    <!-- Mostrar cuando no hay más perfiles -->
    <div class="no-cards" v-if="!isLoading && artistsStore.profiles.tracks.length === 0">
      <div class="no-cards-content">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="empty-icon"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>
        <h3>No hay más perfiles</h3>
        <p>Has visto todos los perfiles disponibles</p>
      </div>
    </div>

    <div class="action-buttons">
      <button class="action-button dislike" @click="artistsStore.swipeLeft">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 16l-6-6 6-6"></path></svg>
      </button>
      <button class="action-button like" @click="artistsStore.swipeRight">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12H4"></path><path d="M20 12L14 6"></path><path d="M20 12L14 18"></path></svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* User greeting styling */
.user-greeting {
  text-align: center;
  padding: 0.5rem;
  background-color: white;
  color: var(--color-secundario);
  font-weight: 500;
  border-bottom: 1px solid #eee;
}

/* Loading indicator */
.loading-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--color-secundario);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 1.5rem;
  background-color: white;
}

.action-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.action-button:hover {
  transform: scale(1.1);
}

.dislike {
  background-color: white;
  color: #fe3c72;
  border: 1px solid #fe3c72;
}

.like {
  background-color: #fe3c72;
  color: white;
}

.no-cards {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  z-index: 0;
}

.no-cards-content {
  text-align: center;
  padding: 2rem;
}

.empty-icon {
  color: #fe3c72;
  opacity: 0.5;
  margin-bottom: 1rem;
}

.no-cards h3 {
  font-size: 1.5rem;
  margin: 0 0 0.5rem;
  color: #333;
}

.no-cards p {
  color: #666;
  margin: 0;
}

.diskover-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}
</style>