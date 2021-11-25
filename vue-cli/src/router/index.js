import Vue from "vue";
import VueRouter from "vue-router";
import Index from "../pages/Index.vue";

Vue.use(VueRouter);

const routes = [{ name: "Index", path: "/", component: Index }];

const router = new VueRouter({
    mode: "history",
    routes,
});

export default router;
