

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
import MyServicesPage from "../pages/MyServicesPage.js";
import MyCompletedService from "../components/MyCompletedService.js"
import ProfilePage from "../pages/ProfilePage.js";
import UserProfile from "../pages/UserProfile.js";
const routes = [
    {path : '/', component : HomePage},
    {path : '/login', component : LoginPage},
    {path : '/register', component : RegisterPage},
    {path : '/services/:id', component : ServiceDisplayPage, props : true , meta : {requiresLogin : true}} ,
    // {path : '/admin-dashboard', component : AdminDashboardPage, meta : {requiresLogin : true, role : "admin"}} ,
    {path : '/careers', component : CareersPage},
    {path : '/ad', component : AdminDashboard, meta : {requiresLogin : true, role : "admin"}},
    {path : '/pd', component : ProfessionalDashboard, meta : {requiresLogin : true, role : "professional"}},
    {path : '/my-services', component : MyServicesPage, meta : {requiresLogin : true}},
    {path : '/sp-my-services', component : MyCompletedService, meta : {requiresLogin: true, role : "professional"}},
    {path : '/sp-my-profile', component : ProfilePage, meta : {requiresLogin: true, role : "professional"}},
    {path : '/my-profile', component : UserProfile, meta : {requiresLogin: true, role : "user"}},

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
        }else if (to.path === '/' && store.state.loggedIn && store.state.role === 'professional')  {
            next({ path: '/pd' });
        }
         else {
            next();
        }
    }
});

export default router;