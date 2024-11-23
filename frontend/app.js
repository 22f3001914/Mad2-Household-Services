import Navbar from "./components/Navbar.js";
import router from "./utlis/router.js";
import store from "./utlis/store.js";
import SearchBox from "./components/SearchBox.js";
import Footer from "./components/Footer.js";
const app = new Vue({
    el : '#app',
    template : `
        <div> 
            <Navbar />
            <router-view> </router-view>
            <Footer />
        
        </div>
    `,
    components : {
        Navbar,
        SearchBox,
        Footer
    },
    router,
    store,

});
