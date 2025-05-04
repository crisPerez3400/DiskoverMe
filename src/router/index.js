import { createRouter, createWebHistory } from 'vue-router';

// Importar vistas
import DiskoverView from '../views/DiskoverView.vue';
import GuardadosView from '../views/GuardadosView.vue';
import RankingView from '../views/RankingView.vue';

const routes = [
  {
    path: '/',
    redirect: '/diskover'
  },
  {
    path: '/diskover',
    name: 'Diskover',
    component: DiskoverView
  },
  {
    path: '/guardados',
    name: 'Guardados',
    component: GuardadosView
  },
  {
    path: '/ranking',
    name: 'Ranking',
    component: RankingView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;