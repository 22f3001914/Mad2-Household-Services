import ServiceRow from './ServiceRow.js'; // Import the ServiceRow component
export default {
    template: `
    <div class="service-list ">
    <h2>Available Services</h2>
    <table class="service-table  ">
      <thead>
        <tr>
          <th>Service Name</th>
          <th>Base Price</th>
          <th>Time Required</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <ServiceRow
          v-for="service in services"
          :key="service.id"
          :service="service"
        />
      </tbody>
    </table>
  </div>
    `,
    components: {
        ServiceRow
      },
      data() {
        return {
          services: [] // Array to store service data
        };
      },
      created() {
        this.fetchServices();
      },
      methods: {
        async fetchServices() {
          // Fetch service data from API (or mock data for testing)
          try {
            const response = await fetch(location.origin + '/api/services'); // Adjust API endpoint as necessary
            this.services = await response.json();
          } catch (error) {
            console.error('Error fetching services:', error);
          }
        },

      }

}