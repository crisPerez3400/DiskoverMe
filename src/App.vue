<script setup>
import { ref, computed, onMounted } from 'vue';
import SwipeCards from './components/SwipeCards.vue' // Ajusta la ruta según tu estructura

// Datos de ejemplo para los perfiles
const profiles = ref([
  {
    id: 1,
    name: 'Laura',
    age: 28,
    bio: 'Amante de los viajes y la fotografía',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 2,
    name: 'Carlos',
    age: 31,
    bio: 'Músico y aficionado a la cocina',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 3,
    name: 'Sofía',
    age: 26,
    bio: 'Yoga instructor. Me encanta la naturaleza',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 4,
    name: 'Miguel',
    age: 29,
    bio: 'Ingeniero y aventurero de fin de semana',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 5,
    name: 'Ana',
    age: 27,
    bio: 'Amante de los libros y el café',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  }
]);

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

// Estado para el deslizamiento
const currentIndex = ref(0);
const isDragging = ref(false);
const startX = ref(0);
const currentX = ref(0);
const swipeDirection = ref(null);
const cardContainer = ref(null);

// Calcular perfiles visibles (actual + siguiente)
const visibleProfiles = computed(() => {
  return profiles.value.slice(currentIndex.value, currentIndex.value + 2);
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
  if (profiles.value.length === 0) return;
  
  isDragging.value = true;
  startX.value = event.type === 'touchstart' 
    ? event.touches[0].clientX 
    : event.clientX;
  currentX.value = startX.value;
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
};

// Finalizar el deslizamiento
const endDrag = () => {
  if (!isDragging.value) return;
  
  const diffX = currentX.value - startX.value;
  const threshold = window.innerWidth * 0.3;
  
  if (Math.abs(diffX) > threshold) {
    if (diffX > 0) {
      swipeRight();
    } else {
      swipeLeft();
    }
  }
  
  isDragging.value = false;
  swipeDirection.value = null;
};

// Deslizar a la derecha (like)
const swipeRight = () => {
  if (profiles.value.length === 0) return;
  
  // Eliminar el perfil actual
  profiles.value.splice(currentIndex.value, 1);
  
  // Mostrar notificación o realizar acción de "match"
  console.log('¡Like!');
};

// Deslizar a la izquierda (dislike)
const swipeLeft = () => {
  if (profiles.value.length === 0) return;
  
  // Eliminar el perfil actual
  profiles.value.splice(currentIndex.value, 1);
  
  console.log('Nope');
};

onMounted(() => {
  // Añadir event listener para cerrar el menú cuando se hace clic fuera de él
  document.addEventListener('click', (event) => {
    const menu = document.querySelector('.menu-dropdown');
    const menuButton = document.querySelector('.menu-button');
    
    if (menu && !menu.contains(event.target) && !menuButton.contains(event.target)) {
      closeMenu();
    }
  });
});
</script>

<template>
  <div class="diskover-container" @click="closeMenu">
    <div class="header">
      <div class="logo">
        <img src="..\src\assets\diskoverMeLogo.png" alt="" class="logo">
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

    <SwipeCards
      :profiles="visibleProfiles"
      :getCardStyle="getCardStyle"
      :overlayClass="overlayClass"
      :currentIndex="currentIndex"
      @startDrag="startDrag"
      @onDrag="onDrag"
      @endDrag="endDrag"></SwipeCards>

    <div class="no-cards" v-if="profiles.length === 0">
      <div class="no-cards-content">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="empty-icon"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>
        <h3>No hay más perfiles</h3>
        <p>Has visto todos los perfiles disponibles</p>
      </div>
    </div>

    <div class="action-buttons">
      <button class="action-button dislike" @click="swipeLeft">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 16l-6-6 6-6"></path></svg>
      </button>
      <button class="action-button like" @click="swipeRight">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12H4"></path><path d="M20 12L14 6"></path><path d="M20 12L14 18"></path></svg>
      </button>
    </div>

    <div class="section-buttons-container">
      <button class="section-button">Diskover</button>
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
  justify-content: space-between; /* Cambiado para alinear logo y menú */
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
  height: 50px;
  color: var(--blanco)
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
  background-color: var(--color-secundario);
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
</style>