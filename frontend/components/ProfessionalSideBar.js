export default {
    template: `
    <div class="admin-sidebar">
    <ul class="admin-sidebar-menu">
      <li class="admin-sidebar-item" :class="{ 'admin-active': activePage === 'service-requests' }" @click="setActive('service-requests')">
        <i class="bi bi-list-task admin-icon"></i>
        <span>Service Requests</span>
      </li>
      <li class="admin-sidebar-item" :class="{ 'admin-active': activePage === 'completed-services' }" @click="setActive('completed-services')">
      <i class="bi bi-star admin-icon"></i>
        <span>Reviews</span>
      </li>
      <li class="admin-sidebar-item" :class="{ 'admin-active': activePage === 'profile' }" @click="setActive('profile')">
        <i class="bi bi-person admin-icon"></i>
        <span>Profile</span>
      </li>
    </ul>
  </div>
    `,
    data() {
      return {
        activePage: 'service-requests'  // Updated default active page
      };
    },
    methods: {
      setActive(page) {
        this.activePage = page;
        this.$emit('page-changed', page);
      }
    }
  };