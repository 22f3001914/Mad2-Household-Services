export default {
    props: ['service'],
    computed: {
        formattedDate() {
            return new Date(this.service.date_created).toLocaleDateString();
        },
        imageUrl() {
            return `/static/${this.service.image}`;
        }
    },
    template: `
    <div class="card" style="width: 18rem;">
        <img :src="imageUrl" class="card-img-top" alt="Service Image">
        <div class="card-body">
            <h5 @click="$router.push('/services/' + service.id)" class="card-title">{{ service.name }}</h5>
            <p class="card-text">{{ service.description }}</p>
            <p class="card-text"><strong>Time Required:</strong> {{ service.time_required }}</p>
            <p class="card-text"><strong>Cost:</strong> {{ service.base_price }}</p>
        </div>
    </div>
    `
};