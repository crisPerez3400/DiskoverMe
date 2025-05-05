import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

export const useArtistsStore = defineStore('artists', () => {
  const profiles = ref({
    artist: null,
    tracks: []
  });
  
  const currentIndex = ref(0);
  const isLoading = ref(true); // Start with loading state true
  const currentUser = ref(null); // Agregamos el currentUser como un ref

  // Función para obtener el artista y sus top tracks desde el servidor Express
  const fetchProfiles = async () => {
    isLoading.value = true;
    try {
      const response = await axios.get('http://localhost:3000/api/artists-top-tracks');
      
      if (response.data.success) {
        // Asignar los detalles del artista
        profiles.value.artist = {
          name: response.data.artist.name,
          image: response.data.artist.image
        };
        
        // Asignar los tracks
        profiles.value.tracks = response.data.top_tracks.map(track => ({
          trackName: track.track_name,          // Nombre del track
          trackId: track.track_id,              // ID del track
          trackPreview: track.preview_urls && track.preview_urls.results && 
                       track.preview_urls.results[0] && 
                       track.preview_urls.results[0].previewUrls ? 
                       track.preview_urls.results[0].previewUrls[0] : null, // URL de vista previa
          albumImage: track.album_image,        // Imagen del álbum
          trackPopularity: track.popularity,    // Popularidad del track
          trackDuration: track.duration_ms      // Duración del track en milisegundos
        }));
        
        // Reiniciar el índice cuando se cargan nuevos perfiles
        currentIndex.value = 0;
        
        console.log('Perfiles cargados:', profiles.value);
      } else {
        console.error('Error al obtener los perfiles:', response.data.error);
        // Si hay un error, proporcionar datos de respaldo para pruebas
        useFallbackData();
      }
    } catch (error) {
      console.error('Error al obtener los perfiles:', error.message);
      // Si hay un error de conexión, proporcionar datos de respaldo para pruebas
      useFallbackData();
    } finally {
      isLoading.value = false;
    }
  };

  // Datos de respaldo para usar en caso de error o para desarrollo
  const useFallbackData = () => {
    profiles.value = {
      artist: {
        name: "Artista de prueba",
        image: "https://placehold.co/400"
      },
      tracks: [
        {
          trackName: "Canción de prueba 1",
          trackId: "test1",
          trackPreview: "https://p.scdn.co/mp3-preview/test.mp3",
          albumImage: "https://placehold.co/400",
          trackPopularity: 85,
          trackDuration: 180000
        },
        {
          trackName: "Canción de prueba 2",
          trackId: "test2",
          trackPreview: "https://p.scdn.co/mp3-preview/test2.mp3",
          albumImage: "https://placehold.co/400/orange",
          trackPopularity: 72,
          trackDuration: 210000
        }
      ]
    };
  };

  // Método para establecer el usuario actual
  const setCurrentUser = (user) => {
    currentUser.value = user;
    console.log('Usuario actual establecido en el store:', currentUser.value);
  };

  const visibleProfiles = computed(() => {
    if (profiles.value.tracks.length === 0) return [];
    return [profiles.value.tracks[currentIndex.value]];
  });

  // Función para cuando el usuario hace swipe a la izquierda (rechazar)
  const swipeLeft = async () => {
    // Aquí puedes usar currentUser.value si necesitas
    // Por ejemplo: console.log(`${currentUser.value.username} rechazó un track`);
    await fetchProfiles();
  };

  // Función para cuando el usuario hace swipe a la derecha (aceptar)
  const swipeRight = async () => {
    // Aquí puedes usar currentUser.value si necesitas
    // Por ejemplo: guardar la preferencia del usuario
    await fetchProfiles();
    
  };
  
  const nextTrack = () => {
    if (profiles.value.tracks.length <= 1) return;
    
    // Avanzar al siguiente track dentro del array actual
    if (currentIndex.value < profiles.value.tracks.length - 1) {
      currentIndex.value++;
    } else {
      // Volver al principio si estamos en el último track
      currentIndex.value = 0;
    }
  };

  // Llamar a fetchProfiles para obtener los perfiles/artistas al iniciar el store
  fetchProfiles();

  return {
    profiles,
    currentIndex,
    visibleProfiles,
    swipeLeft,
    swipeRight,
    nextTrack,
    isLoading,
    fetchProfiles,  // Exponemos la función para poder refrescar los datos manualmente
    currentUser,    // Exponemos currentUser como getter
    setCurrentUser  // Exponemos el método para establecer el usuario
  };
});