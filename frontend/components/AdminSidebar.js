export default {
    template : `
    <div class="admin-sidebar">
    <h3>Admin Dashboard</h3>
    <ul>
      <li :class="{ 'admin-active': isActive('overview') }" @click="navigate('overview')">Overview</li>
      <li :class="{ 'admin-active': isActive('user-management') }" @click="navigate('user-management')">User Management</li>
      <li :class="{ 'admin-active': isActive('service-management') }" @click="navigate('service-management')">Service Management</li>
    </ul>
  </div>
    `,
    data() {
        return {
          currentView: 'overview',
        };
      },
      methods: {
        navigate(view) {
          this.currentView = view;
          this.$emit('view-change', view);
        },
        isActive(view) {
          return this.currentView === view;
        },
      },

};