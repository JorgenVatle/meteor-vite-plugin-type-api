import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { routes } from 'vue-router/auto-routes';
import AppComponent from '../imports/ui/App.vue';
import './styles.css';

const Router = createRouter({
    history: createWebHistory(),
    routes,
});

const App = createApp(AppComponent)
    .use(Router)
    .mount('#app');