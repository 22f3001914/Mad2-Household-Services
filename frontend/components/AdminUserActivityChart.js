export default {
  template: `
    <div class="admin-dashboard-charts">
      <div class="chart-container1">
        <canvas ref="barChart" class="chart" width="400" height="200"></canvas>
      </div>
      <div class="chart-container">
      <canvas ref="stackedBarChart" class="chart" width="400" height="200"></canvas>
        <canvas ref="lineChart" class="chart" width="400" height="200"></canvas>
      </div>
      <div class="chart-container">
      <canvas ref="pieChart" class="chart" width="400" height="200"></canvas>
        <canvas ref="radarChart" class="chart" width="400" height="200"></canvas>
      </div>
      <div class="chart-container">
        <canvas ref="horizontalBarChart" class="chart" width="400" height="200"></canvas>
        <canvas ref="bubbleChart" class="chart" width="400" height="200"></canvas>
      </div>
    </div>
  `,
  data() {
    return {
      charts: {}, // Store chart instances
    };
  },
  mounted() {
    // Load Chart.js from CDN dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = this.fetchAndRenderCharts;
    document.head.appendChild(script);
  },
  methods: {
    async fetchAndRenderCharts() {
      try {
        const res = await fetch('/api/admin_dashboard_stats', {
          headers: {
            'Authentication-Token': this.$store.state.auth_token,
          },
        });
        const stats = await res.json();

        this.renderBarChart(stats);
        this.renderPieChart(stats);
        this.renderLineChart(stats);
        this.renderStackedBarChart(stats);
        this.renderRadarChart(stats);
        this.renderHorizontalBarChart(stats);
        this.renderBubbleChart(stats);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    renderBarChart(stats) {
      const ctx = this.$refs.barChart.getContext('2d');
      this.charts.barChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Total Users', 'SP', 'Customers', 'Services', 'Requests'],
          datasets: [{
            label: 'Counts',
            data: [stats.total_users, stats.num_of_sp, stats.num_of_customers, stats.num_of_services, stats.num_of_requests],
            backgroundColor: '#4BC0C0',
          }],
        },
        options: { responsive: true, scales: { y: { beginAtZero: true } } },
      });
    },
    renderPieChart(stats) {
      const ctx = this.$refs.pieChart.getContext('2d');
      this.charts.pieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['SP', 'Customers', 'Blocked Users'],
          datasets: [{
            data: [stats.num_of_sp, stats.num_of_customers, stats.num_of_blocked_users],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          }],
        },
        options: { responsive: true },
      });
    },
    renderLineChart(stats) {
      const ctx = this.$refs.lineChart.getContext('2d');
      this.charts.lineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Last Month', 'This Month'],
          datasets: [{
            label: 'User Growth',
            data: [stats.total_users - stats.users_more_than_last_month, stats.total_users],
            borderColor: '#36A2EB',
            fill: false,
          }],
        },
        options: { responsive: true },
      });
    },
    renderStackedBarChart(stats) {
      const ctx = this.$refs.stackedBarChart.getContext('2d');
      this.charts.stackedBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Total', 'Completed', 'Assigned', 'Active', 'Pending'],
          datasets: [{
            label: 'Requests',
            data: [stats.num_of_requests, stats.num_of_completed_requests, stats.num_of_assigned_requests, stats.num_of_active_requests, stats.pending_requests],
            backgroundColor: '#FF6384',
          }],
        },
        options: { responsive: true, scales: { x: { stacked: true }, y: { stacked: true } } },
      });
    },
    renderRadarChart(stats) {
      const ctx = this.$refs.radarChart.getContext('2d');
      this.charts.radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['Reviews', 'Active Customers', 'Active SP'],
          datasets: [{
            label: 'Engagement',
            data: [stats.num_of_reviews, stats.num_of_active_customers, stats.num_of_active_sp],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: '#36A2EB',
          }],
        },
        options: { responsive: true },
      });
    },
    renderHorizontalBarChart(stats) {
      const ctx = this.$refs.horizontalBarChart.getContext('2d');
      this.charts.horizontalBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Pending Requests', 'Pending Approvals'],
          datasets: [{
            label: 'Pending',
            data: [stats.pending_requests, stats.pending_approvals],
            backgroundColor: '#FFCE56',
          }],
        },
        options: { responsive: true, indexAxis: 'y' },
      });
    },
    renderBubbleChart(stats) {
      const ctx = this.$refs.bubbleChart.getContext('2d');
      this.charts.bubbleChart = new Chart(ctx, {
        type: 'bubble',
        data: {
          datasets: [{
            label: 'Services vs Reviews',
            data: [{ x: stats.num_of_services, y: stats.num_of_reviews, r: stats.num_of_active_customers }],
            backgroundColor: '#4BC0C0',
          }],
        },
        options: { responsive: true },
      });
    },
  },
  beforeUnmount() {
    // Destroy all charts to prevent memory leaks
    Object.values(this.charts).forEach(chart => chart.destroy());
  },
};