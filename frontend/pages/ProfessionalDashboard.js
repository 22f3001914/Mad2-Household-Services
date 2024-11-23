
import SideBar from "../components/SideBar.js";
import ServiceTableServiceProf from "../components/ServiceTableServiceProf.js";

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

    SideBar,
    ServiceTableServiceProf
  },
  data() {
    return {
      currentComponent: 'ServiceTableServiceProf' // Set default component to AdminDashboardOverview
    };
  },
  methods: {
    changePage(page) {
      // Map page names to component names
      const pageComponentMap = {
        'overview': 'ServiceTableServiceProf',
      };
      this.currentComponent = pageComponentMap[page];
    }
  }
};