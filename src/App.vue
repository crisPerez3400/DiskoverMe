<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useArtistsStore } from './stores/useArtistsStore'; // Importa el store aquí

const router = useRouter();

// Estado para el menú desplegable
const isMenuOpen = ref(false);
// Estado para almacenar la información del usuario actual
const currentUser = ref(null);

// Función para obtener información del usuario actual
const fetchCurrentUser = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/current-user');
    const data = await response.json();
    if (data.success) {
      currentUser.value = data.data; // Cambiado de data.user a data.data
      console.log('Usuario actual:', currentUser.value);
    }
  } catch (error) {
    console.error('Error al obtener información del usuario:', error);
    // Si falla, establecemos el valor por defecto
    currentUser.value = { id: 'admin', username: 'admin', role: 'admin' };
  }
};

// Función para alternar el estado del menú
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// Función para cerrar el menú cuando se hace clic fuera de él
const closeMenu = () => {
  isMenuOpen.value = false;
};

// Navegar a la ruta seleccionada
const navigateTo = (route) => {
  router.push(route);
  closeMenu();
};

// Cargar información del usuario al montar el componente
onMounted(() => {
  fetchCurrentUser().then(() => {
    // Pasar el usuario actual al store
    const artistsStore = useArtistsStore();
    artistsStore.currentUser = currentUser.value;
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
        <div class="user-info" v-if="currentUser">
          <span class="username">{{ currentUser.username }}</span>
        </div>
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
            <li class="user-info-menu" v-if="currentUser">
              <span>Usuario: {{ currentUser.username }}</span>
            </li>
            <li><a href="#" @click.stop="closeMenu">Mi perfil</a></li>
            <li><a href="#" @click.stop="closeMenu">Configuración</a></li>
            <li><a href="#" @click.stop="closeMenu">Ayuda</a></li>
            <li><a href="#" @click.stop="closeMenu">Cerrar sesión</a></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Área principal donde se cargan las vistas -->
    <main class="main-content">
      <router-view :current-user="currentUser"></router-view>
    </main>

    <!-- Botones de navegación -->
    <div class="section-buttons-container">
      <router-link 
        to="/diskover" 
        custom 
        v-slot="{ isActive, navigate }">
        <button 
          @click="navigate" 
          class="section-button" 
          :class="{ 'active': isActive }">
          Diskover
        </button>
      </router-link>
      
      <router-link 
        to="/guardados" 
        custom 
        v-slot="{ isActive, navigate }">
        <button 
          @click="navigate" 
          class="section-button" 
          :class="{ 'active': isActive }">
          Guardados
        </button>
      </router-link>
      
      <router-link 
        to="/ranking" 
        custom 
        v-slot="{ isActive, navigate }">
        <button 
          @click="navigate" 
          class="section-button" 
          :class="{ 'active': isActive }">
          Ranking
        </button>
      </router-link>
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

/* Estilos para el usuario y menú de tres puntos */
.menu-container {
  display: flex;
  align-items: center;
  position: relative;
  gap: 10px;
}

.user-info {
  color: var(--blanco);
  font-size: 0.9rem;
}

.username {
  font-weight: 500;
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

.user-info-menu {
  padding: 12px 16px;
  background-color: #f9f9f9;
  color: #666;
  font-size: 0.9rem;
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

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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