export default {
    template: `
    <div class="admin-dashboard-overview">
    <div class="admin-card" v-for="item in overviewItems" :key="item.label">
      <div>{{ item.label }}</div>
      <div class="admin-count">{{ item.count }}</div>
      <div class="admin-info">{{ item.info }}</div>
    </div>
  </div>
    `,
    data() {
        return {
          overviewItems: [
            { label: 'Total Users', count: '2,345', info: '+180 from last month' },
            { label: 'Pending Approvals', count: '15', info: 'Service professionals' },
            { label: 'Blocked Accounts', count: '23', info: '+3 this week' },
            { label: 'Service Categories', count: '12', info: '2 new categories added' },
          ],
        };
      },

}