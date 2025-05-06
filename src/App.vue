<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// Estado para el menú desplegable
const isMenuOpen = ref(false);
// Estado para almacenar la información del usuario actual
const currentUser = ref(null);
// Estado para el slider de géneros
const sliderPosition = ref(1); // Posición inicial (1, 2, o 3)
// Estado para los géneros seleccionados
const selectedGenres = ref([]);

const router = useRouter();

// Función para obtener información del usuario actual
const fetchCurrentUser = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/current-user');
    const data = await response.json();
    if (data.success) {
      currentUser.value = data.data;
      console.log('Usuario actual:', currentUser.value);
    }
  } catch (error) {
    console.error('Error al obtener información del usuario:', error);
    // Si falla, establecemos el valor por defecto
    currentUser.value = { id: 'admin', username: 'admin', role: 'admin' };
  }
};

// Función para alternar el estado del menú
const toggleMenu = (event) => {
  event.stopPropagation();
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

// Función para cambiar la posición del slider
const setSliderPosition = (position) => {
  sliderPosition.value = position;
};

// Función para manejar la selección de géneros
const toggleGenre = (genre) => {
  const index = selectedGenres.value.indexOf(genre);
  if (index === -1) {
    // Si el género no está seleccionado, lo añadimos
    selectedGenres.value.push(genre);
  } else {
    // Si ya está seleccionado, lo quitamos
    selectedGenres.value.splice(index, 1);
  }
  console.log('Géneros seleccionados:', selectedGenres.value);
};

// Verificar si un género está seleccionado
const isGenreSelected = (genre) => {
  return selectedGenres.value.includes(genre);
};

// Cargar información del usuario al montar el componente
onMounted(() => {
  fetchCurrentUser();
  
  // Agregar evento para cerrar el menú al hacer clic fuera
  document.addEventListener('click', closeMenu);
  
  // Limpiar el evento al desmontar
  return () => {
    document.removeEventListener('click', closeMenu);
  };
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
        
        <!-- Menú desplegable con géneros musicales y slider -->
        <div class="menu-dropdown" v-if="isMenuOpen" @click.stop>
          <div class="genre-buttons">
            <button 
              v-for="genre in ['Rock', 'Pop', 'Hip-Hop', 'Electrónica', 'Jazz', 'Clásica', 'Reggaeton', 'Metal']" 
              :key="genre"
              class="genre-button" 
              :class="{ 'selected': isGenreSelected(genre) }"
              @click="toggleGenre(genre)"
            >
              {{ genre }}
            </button>
          </div>
          
          <!-- Slider de 3 posiciones -->
          <div class="slider-container">
            <div class="slider-label">Preferencia:</div>
            <div class="slider-track">
              <div 
                class="slider-position" 
                :class="{ 'active': sliderPosition === 1 }"
                @click.stop="setSliderPosition(1)"
              >
                <span class="slider-text">Baja</span>
              </div>
              <div 
                class="slider-position" 
                :class="{ 'active': sliderPosition === 2 }"
                @click.stop="setSliderPosition(2)"
              >
                <span class="slider-text">Media</span>
              </div>
              <div 
                class="slider-position" 
                :class="{ 'active': sliderPosition === 3 }"
                @click.stop="setSliderPosition(3)"
              >
                <span class="slider-text">Alta</span>
              </div>
            </div>
          </div>
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
/* Variables CSS */
:root {
  --color-secundario: #6200ea;
  --blanco: #ffffff;
}

/* Estilos base para móvil */
.diskover-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 100%;
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
  width: 250px;
  z-index: 9999;
  margin-top: 8px;
  overflow: hidden;
  padding: 12px;
}

/* Estilos para los botones de géneros */
.genre-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.genre-button {
  background-color: #f0f0f0;
  border: none;
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 0.85rem;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
}

.genre-button:hover {
  background-color: #e0e0e0;
}

.genre-button.selected {
  background-color: var(--color-secundario);
  color: white;
}

/* Estilos para el slider de 3 posiciones */
.slider-container {
  margin-top: 12px;
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
}

.slider-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
}

.slider-track {
  display: flex;
  background-color: #f0f0f0;
  border-radius: 20px;
  height: 36px;
  position: relative;
  overflow: hidden;
}

.slider-position {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  color: #666;
}

.slider-position.active {
  background-color: var(--color-secundario);
  color: white;
  font-weight: 500;
}

.slider-text {
  font-size: 0.85rem;
  z-index: 2;
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

/* Media queries para hacer la aplicación responsive */
@media (min-width: 768px) {
  .diskover-container {
    max-width: 90%;
    margin: 0 auto;
    height: 100vh;
    border-radius: 0;
    box-shadow: none;
  }
  
  .header {
    padding: 1rem 2rem;
  }
  
  .logo {
    font-size: 1.75rem;
  }
  
  .logo-img {
    height: 45px;
  }
  
  .menu-dropdown {
    width: 300px;
  }
  
  .genre-buttons {
    gap: 10px;
  }
  
  .genre-button {
    padding: 8px 14px;
    font-size: 0.9rem;
  }
  
  .section-button {
    font-size: 1.1rem;
    padding: 0.6rem 1.5rem;
  }
}

@media (min-width: 1024px) {
  .diskover-container {
    max-width: 1200px;
    margin: 20px auto;
    height: calc(100vh - 40px);
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .header {
    padding: 1rem 2.5rem;
  }
  
  .section-buttons-container {
    padding: 1.2rem;
  }
  
  .section-button {
    padding: 0.7rem 2rem;
  }
  
  .menu-dropdown {
    width: 350px;
    padding: 16px;
  }
  
  .genre-buttons {
    gap: 12px;
  }
  
  .slider-track {
    height: 40px;
  }
  
  .slider-text {
    font-size: 0.95rem;
  }
}

@media (min-width: 1440px) {
  .diskover-container {
    max-width: 1400px;
  }
  
  .header {
    padding: 1.2rem 3rem;
  }
  
  .logo {
    font-size: 2rem;
  }
  
  .logo-img {
    height: 50px;
  }
}


</style>