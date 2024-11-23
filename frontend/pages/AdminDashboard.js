import AdminSidebar from "../components/AdminSidebar.js";
import AdminHeader from "../components/AdminHeader.js";
import AdminDashboardOverview from "../components/AdminDashboardOverview.js";
import SideBar from "../components/SideBar.js";
import Usertable from "../components/Usertable.js";
import NewServiceTable from "../components/NewServiceTable.js";

export default {
  template: `
    <div id="admin-page">

      <SideBar @page-changed="changePage" />
      <div class="admin-main-content">
        <component :is="currentComponent"></component>
      </div>
    </div>
  `,
  components: {
    AdminSidebar,
    AdminHeader,
    AdminDashboardOverview,
    SideBar,
    Usertable,
    NewServiceTable,
  },
  data() {
    return {
      currentComponent: 'AdminDashboardOverview' // Set default component to AdminDashboardOverview
    };
  },
  methods: {
    changePage(page) {
      // Map page names to component names
      const pageComponentMap = {
        'overview': 'AdminDashboardOverview',
        'user-management': 'Usertable',
        'service-management': 'NewServiceTable'
      };
      this.currentComponent = pageComponentMap[page];
    }
  }
};