export default {
  template: `
  <div class="admin-sidebar">
  <ul class="admin-sidebar-menu">
    <li class="admin-sidebar-item" :class="{ 'admin-active': activePage === 'overview' }" @click="setActive('overview')">
      <i class="bi bi-grid admin-icon"></i>
      <span>Overview</span>
    </li>
    <li class="admin-sidebar-item" :class="{ 'admin-active': activePage === 'user-management' }" @click="setActive('user-management')">
      <i class="bi bi-people admin-icon"></i>
      <span>User Management</span>
    </li>
    <li class="admin-sidebar-item" :class="{ 'admin-active': activePage === 'service-management' }" @click="setActive('service-management')">
      <i class="bi bi-gear admin-icon"></i>
      <span>Service Management</span>
    </li>
    <li class="admin-sidebar-item" :class="{ 'admin-active': activePage === 'service-request' }" @click="setActive('service-request')">
      <i class="bi bi-gear admin-icon"></i>
      <span>Service Requests</span>
    </li>
  </ul>
</div>
  `,
  data() {
    return {
      activePage: 'overview'
    };
  },
  methods: {
    setActive(page) {
      this.activePage = page;
      this.$emit('page-changed', page);
    }
  }
};
