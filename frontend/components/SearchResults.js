import ServiceNameCard from './ServiceNameCard.js';

export default {
  props: ['searchQuery'],
  components: {
    ServiceNameCard
  },
  template: `
    <div class="m-5">
      <h1 class="mb-3">Search Results</h1>
      <div class="row d-flex">
        <div v-for="service in filteredServices" :key="service.id">
          <ServiceNameCard :title="service.name" :image="service.image" :id="service.id" />
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      services: []
    };
  },
  computed: {
    filteredServices() {
      if (!this.searchQuery) {
        return this.services;
      }
      const query = this.searchQuery.toLowerCase();
      return this.services.filter(service =>
        service.name.toLowerCase().includes(query)
      );
    }
  },
  async mounted() {
    try {
      const res = await fetch(location.origin + "/api/services");
      if (res.ok) {
        const data = await res.json();
        this.services = data;
      } else {
        console.error('Failed to fetch services:', res.statusText);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  }
};