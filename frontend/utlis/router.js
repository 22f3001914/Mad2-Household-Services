

import LoginPage from "../pages/LoginPage.js"; 
import RegisterPage from "../pages/RegisterPage.js";
import ServicePage from "../components/ServiceListPage.js";
import ServiceDisplayPage from "../pages/ServiceDisplayPage.js";
import store from "./store.js";
import AdminDashboardPage from "../pages/AdminDashboardPage.js";
import HomePage from "../pages/HomePage.js";
import CareersPage from "../pages/CareersPage.js";
import AdminDashboard from "../pages/AdminDashboard.js";
import ProfessionalDashboard from "../pages/ProfessionalDashboard.js";
const routes = [
    {path : '/', component : HomePage},
    {path : '/login', component : LoginPage},
    {path : '/register', component : RegisterPage},
    {path : '/services/:id', component : ServiceDisplayPage, props : true , meta : {requiresLogin : true}} ,
    {path : '/admin-dashboard', component : AdminDashboardPage, meta : {requiresLogin : true, role : "admin"}} ,
    {path : '/careers', component : CareersPage},
    {path : '/ad', component : AdminDashboard, meta : {requiresLogin : true, role : "admin"}},
    {path : '/pd', component : ProfessionalDashboard, meta : {requiresLogin : true, role : "professional"}}

]

const router = new VueRouter({
    routes
})

//navigation guard
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresLogin)) {
        if (!store.state.loggedIn) {
            next({ path: '/login' });
        } else if (to.meta.role && to.meta.role !== store.state.role) {
            alert('You are not authorized to view this page');
            next({ path: '/' });
        } else {
            next();
        }
    } else {
        if (to.path === '/' && store.state.loggedIn && store.state.role === 'admin') {
            next({ path: '/ad' });
        } else {
            next();
        }
    }
});

export default router;