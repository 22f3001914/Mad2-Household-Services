import AdminUserActivityChart from "./AdminUserActivityChart.js";
export default {
  props : ["user"],
    template: `
    <div>
    <div class="button-container">
    <button class="btn btn-dark export-button" @click="create_csv">Export Services Data</button>
  </div>
    <div class="admin-dashboard-overview">
   
    <div class="admin-card" v-for="item in overviewItems" :key="item.label">
      <div>{{ item.label }}</div>
      <div class="admin-count">{{ item.count }}</div>
      <div class="admin-info">{{ item.info }}</div>
    </div>
  </div>
  <AdminUserActivityChart />
  </div>
    `,
    created() {
      this.fetchOverviewData(); // Fetch overview data when the component is created
    },
    components:{
      AdminUserActivityChart

    },
    data() {
        return {
          overviewItems: [],
        };
      },
      methods: {
        async fetchOverviewData() {
          try {
            const res = await fetch('/api/admin_dashboard_stats', {
              headers: {
                "Authentication-Token": this.$store.state.auth_token,
              },
            });
            console.log(res);
            if (res.ok) {
              const response = await res.json();
              this.overviewItems = [
                { label: 'Total Users', count: response.total_users, info: `+${response.users_more_than_last_month} from last month` },
                { label: 'Pending Approvals', count: response.pending_approvals, info: 'Service professionals' },
                { label: 'Blocked Accounts', count: response.num_of_blocked_users, info: `${response.num_of_active_customers} active users` },
                { label: 'Service Categories', count: response.num_of_services, info: '2 new categories added' },
                { label: 'Completed Requests', count: response.num_of_completed_requests, info: `${response.pending_requests} requests pending` },
              ];


              // this.overviewItems = await res.json();
            } else {
              console.error("Failed to fetch overview data");
            }
          } catch (error) {
            console.error("Error fetching overview data:", error);
          }
        },
        async create_csv(){
          const res = await fetch(location.origin + '/create-csv')
          const task_id = (await res.json()).task_id

          const interval = setInterval(async() => {
              const res = await fetch(`${location.origin}/get-celery-data/${task_id}`)
              if (res.ok){
                  console.log('data is ready')
                  window.open(`${location.origin}/get-celery-data/${task_id}`)
                  clearInterval(interval)
              }

          }, 100)
          
      },
      },

}