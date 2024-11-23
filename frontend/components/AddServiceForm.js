export default {
    template: `
    <div class="form-container">
      <h2 class="form-title">Add a New Service</h2>

      <input type="text" v-model="service.name" class="input-field" placeholder="Service Name" required />
      <input type="number" v-model="service.base_price" class="input-field" step="0.01" placeholder="Base Price" required />
      <input type="text" v-model="service.time_required" class="input-field" placeholder="Time Required (e.g., 1 hour)" />
      <textarea v-model="service.description" class="input-field" placeholder="Enter service description"></textarea>
      <input type="file" @change="onFileChange" class="input-field" />

      <button @click="registerService" class="submit-button">
        <i class="bi bi-check-circle login-icon mr-2"></i> Add Service
      </button>
    </div>
    `,
    data() {
        return {
            service: {
                name: '',
                base_price: null,
                time_required: '',
                description: '',
                image: null
            }
        };
    },
    methods: {
        onFileChange(e) {
            this.service.image = e.target.files[0];
        },
        async registerService() {
            const formData = new FormData();
            formData.append('name', this.service.name);
            formData.append('base_price', this.service.base_price);
            formData.append('time_required', this.service.time_required);
            formData.append('description', this.service.description);
            if (this.service.image) {
                formData.append('image', this.service.image);
            }

            try {
                const response = await fetch('/api/services', {
                    method: 'POST',
                    headers: {
                      'Authentication-Token': this.$store.state.auth_token,
                    },
                    body: formData,
                });
                if (response.ok) {
                    const responseData = await response.json();
                    alert('Service registered successfully!');
                    
                    // Emit an event with the added service data
                    this.$emit('service-added');

                    this.resetForm();
                } else {
                    alert('Error registering service.');
                }
            } catch (error) {
                console.error(error);
                alert('An error occurred.');
            }
        },
        resetForm() {
            this.service = {
                name: '',
                base_price: null,
                time_required: '',
                description: '',
                image: null
            };
            document.querySelector('input[type="file"]').value = null;
        }
    }
};
