import ServiceNameCard from './ServiceNameCard.js';

export default {
    components: {
        ServiceNameCard
    },
    template: `
    <div class="m-5">
      <h1 class="mb-3">Our Services</h1>
      <div class="row d-flex">
        <div style="width:220px" v-for="service in services" :key="service.id">
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
    async mounted() {
        const res = await fetch(location.origin + "/api/services");

        if (res.ok) {
            const data = await res.json();
            this.services = data;

        }
        
    },
    methods: {}
};