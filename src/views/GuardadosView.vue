<script setup>
import { useArtistsStore } from '../stores/useArtistsStore';
import { computed, onMounted } from 'vue';

const artistsStore = useArtistsStore();
const savedProfiles = computed(() => artistsStore.savedProfiles || []);

onMounted(() => {
  // Cargar perfiles guardados si es necesario
});
</script>

<template>
  <div class="guardados-view">
    <h2 class="section-title">Perfiles guardados</h2>
    
    <div v-if="savedProfiles.length === 0" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="empty-icon">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
      <h3>No hay perfiles guardados</h3>
      <p>Los perfiles que te gusten aparecerán aquí</p>
    </div>

    <div v-else class="saved-profiles-grid">
      <div v-for="(profile, index) in savedProfiles" :key="index" class="saved-profile-card">
        <div class="profile-image" :style="{ backgroundImage: `url(${profile.image})` }"></div>
        <div class="profile-info">
          <h3>{{ profile.name }}</h3>
          <p>{{ profile.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.guardados-view {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #333;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
}

.empty-icon {
  color: #fe3c72;
  opacity: 0.5;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.2rem;
  margin: 0 0 0.5rem;
  color: #333;
}

.empty-state p {
  color: #666;
  margin: 0;
}

.saved-profiles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.saved-profile-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-image {
  height: 150px;
  background-size: cover;
  background-position: center;
}

.profile-info {
  padding: 0.75rem;
}

.profile-info h3 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
}

.profile-info p {
  margin: 0;
  font-size: 0.8rem;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>