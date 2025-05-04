<script setup>
import { useArtistsStore } from './stores/useArtistsStore';
import { ref, computed, onMounted } from 'vue';
import SwipeCards from './components/SwipeCards.vue';

const artistsStore = useArtistsStore();

const profiles = computed(() => artistsStore.visibleProfiles);
const isLoading = computed(() => artistsStore.isLoading);

// Estado para el menú desplegable
const isMenuOpen = ref(false);

// Función para alternar el estado del menú
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// Función para cerrar el menú cuando se hace clic fuera de él
const closeMenu = () => {
  isMenuOpen.value = false;
};

onMounted(() => {
  // Añadir event listener para cerrar el menú cuando se hace clic fuera de él
  document.addEventListener('click', (event) => {
    const menu = document.querySelector('.menu-dropdown');
    const menuButton = document.querySelector('.menu-button');
    
    if (menu && !menu.contains(event.target) && !menuButton?.contains(event.target)) {
      closeMenu();
    }
  });
});
</script>

<template>
  <div class="diskover-container" @click="closeMenu">
    <div class="header">
      <div class="logo">
        <img src="./assets/diskoverMeLogo.png" alt="diskoverMe Logo" class="logo-img">
        <span>diskoverMe</span>
      </div>

      <!-- Menú de tres puntos -->
      <div class="menu-container">
        <button class="menu-button" @click.stop="toggleMenu">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="12" cy="5" r="1"></circle>
            <circle cx="12" cy="19" r="1"></circle>
          </svg>
        </button>
        
        <!-- Menú desplegable -->
        <div class="menu-dropdown" v-if="isMenuOpen">
          <ul>
            <li><a href="#" @click.stop="closeMenu">Mi perfil</a></li>
            <li><a href="#" @click.stop="closeMenu">Configuración</a></li>
            <li><a href="#" @click.stop="closeMenu">Ayuda</a></li>
            <li><a href="#" @click.stop="closeMenu">Cerrar sesión</a></li>
          </ul>
        </div>
      </div>
    </div>

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

    <div class="section-buttons-container">
      <button class="section-button active">Diskover</button>
      <button class="section-button">Guardados</button>
      <button class="section-button">Ranking</button>
    </div>
  </div>
</template>

<style scoped>
.diskover-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 480px;
  margin: 0 auto;
  background-color: #f5f7fa;
  position: relative;
  overflow: hidden;
}

.header {
  transform: translateZ(0);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--color-secundario);
  max-height: 63px;
  z-index: 9998;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
  font-size: 1.5rem;
  color: var(--blanco);
}

.logo-img {
  height: 40px;
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

/* Estilos para el menú de tres puntos */
.menu-container {
  position: relative;
}

.menu-button {
  background: none;
  border: none;
  color: var(--blanco);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.menu-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.menu-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 180px;
  z-index: 9999;
  margin-top: 8px;
  overflow: hidden;
}

.menu-dropdown ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-dropdown li {
  border-bottom: 1px solid #f0f0f0;
}

.menu-dropdown li:last-child {
  border-bottom: none;
}

.menu-dropdown a {
  display: block;
  padding: 12px 16px;
  color: #333;
  text-decoration: none;
  transition: background-color 0.2s;
}

.menu-dropdown a:hover {
  background-color: #f5f5f5;
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

.section-buttons-container {
  display: flex;
  justify-content: space-around;
  padding: 1rem;
  background-color: var(--color-secundario);
}

.section-button {
  background-color: transparent;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  color: var(--blanco);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.section-button.active {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>