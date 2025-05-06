<script setup>
import { ref, onMounted } from 'vue';

// Simulación de datos para el ranking
const topArtists = ref([
  { rank: 1, name: 'The Weeknd', image: '/api/placeholder/100/100', likes: 15243 },
  { rank: 2, name: 'Bad Bunny', image: '/api/placeholder/100/100', likes: 14921 },
  { rank: 3, name: 'Taylor Swift', image: '/api/placeholder/100/100', likes: 14753 },
  { rank: 4, name: 'Billie Eilish', image: '/api/placeholder/100/100', likes: 13892 },
  { rank: 5, name: 'Dua Lipa', image: '/api/placeholder/100/100', likes: 13567 },
  { rank: 6, name: 'Drake', image: '/api/placeholder/100/100', likes: 12983 },
  { rank: 7, name: 'BTS', image: '/api/placeholder/100/100', likes: 12745 },
  { rank: 8, name: 'Ariana Grande', image: '/api/placeholder/100/100', likes: 12532 },
  { rank: 9, name: 'Post Malone', image: '/api/placeholder/100/100', likes: 11987 },
  { rank: 10, name: 'Justin Bieber', image: '/api/placeholder/100/100', likes: 11756 }
]);

const isLoading = ref(true);

onMounted(() => {
  // Simular carga de datos
  setTimeout(() => {
    isLoading.value = false;
  }, 800);
});
</script>

<template>
  <div class="ranking-view">
    <h2 class="section-title">Top 10 Artistas</h2>
    
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando ranking...</p>
    </div>
    
    <div v-else class="ranking-list">
      <div v-for="artist in topArtists" :key="artist.rank" class="ranking-item">
        <div class="rank-number" :class="{'top-three': artist.rank <= 3}">{{ artist.rank }}</div>
        <div class="artist-image" :style="{ backgroundImage: `url(${artist.image})` }"></div>
        <div class="artist-info">
          <h3>{{ artist.name }}</h3>
          <p>{{ artist.likes.toLocaleString() }} likes</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ranking-view {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #333;
}

.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3rem;
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

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ranking-item {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 10px;
  padding: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.rank-number {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  border-radius: 50%;
  font-weight: bold;
  color: #333;
  margin-right: 12px;
}

.rank-number.top-three {
  background-color: #866aeb;
  color: white;
}

.artist-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  margin-right: 16px;
}

.artist-info {
  flex: 1;
}

.artist-info h3 {
  margin: 0 0 4px;
  font-size: 1rem;
}

.artist-info p {
  margin: 0;
  font-size: 0.85rem;
  color: #666;
}
</style>