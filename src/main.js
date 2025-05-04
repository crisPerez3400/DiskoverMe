import './style.css'
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// Crear la aplicación Vue
const app = createApp(App);

// Usar Pinia para el estado
app.use(createPinia());

// Usar el router
app.use(router);

// Montar la aplicación
app.mount('#app');
