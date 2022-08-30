import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/HomeView.vue";
import Event from "../views/Event.vue";
import Ticket from "../views/Ticket.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/event/:id",
    name: "Event",
    component: Event,
  },
  {
    path: "/ticket/:id",
    name: "Ticket",
    component: Ticket,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
