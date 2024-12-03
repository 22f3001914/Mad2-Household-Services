import ProfessionalSideBar from "../components/ProfessionalSideBar.js";
import ServiceTableServiceProf from "../components/ServiceTableServiceProf.js";
import ProfessionalProfile from "../components/ProfessionalProfile.js";
import MyCompletedService from "../components/MyCompletedService.js";

export default {
  template: `
  <div>
    <div id="admin-page">
      <ProfessionalSideBar @page-changed="changePage" />
      <div class="admin-main-content">
        <component :is="currentComponent" :userId="userId"></component>
      </div>
    </div>
  </div>
  `,
  components: {
    ProfessionalSideBar,
    ServiceTableServiceProf,
    PastServices: MyCompletedService,
    ProfessionalProfile
  },
  data() {
    return {
      currentComponent: 'ServiceTableServiceProf',
      userId: JSON.parse(localStorage.getItem('user')).id // Extract only the ID
    };
  },
  methods: {
    changePage(page) {
      switch(page) {
        case 'service-requests':
          this.currentComponent = 'ServiceTableServiceProf';
          break;
        case 'completed-services':
          this.currentComponent = 'PastServices';
          break;
        case 'profile':
          this.currentComponent = 'ProfessionalProfile';
          break;
      }
    }
  }
};