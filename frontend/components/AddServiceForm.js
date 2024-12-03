export default {
    template: `
    <div class="form-container">
      <h2 class="form-title">Add a New Service</h2>

      <input type="text" v-model="service.name" class="input-field" placeholder="Service Name" required />
      <span v-if="errors.name" class="error-message">{{ errors.name }}</span>

      <input type="number" v-model="service.base_price" class="input-field" step="0.01" placeholder="Base Price" required />
      <span v-if="errors.base_price" class="error-message">{{ errors.base_price }}</span>

      <input type="text" v-model="service.time_required" class="input-field" placeholder="Time Required (e.g., 1 hour)" />
      <span v-if="errors.time_required" class="error-message">{{ errors.time_required }}</span>

      <textarea v-model="service.description" class="input-field" placeholder="Enter service description"></textarea>
      <span v-if="errors.description" class="error-message">{{ errors.description }}</span>

      <input type="file" @change="onFileChange" class="input-field" />
      <span v-if="errors.image" class="error-message">{{ errors.image }}</span>

      <button @click="validateForm" class="submit-button">
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
            },
            errors: {}
        };
    },
    methods: {
        onFileChange(e) {
            this.service.image = e.target.files[0];
        },
        validateForm() {
            this.errors = {};

            if (!this.service.name) {
                this.errors.name = 'Service name is required.';
            }
            if (!this.service.base_price) {
                this.errors.base_price = 'Base price is required.';
            } else if (isNaN(this.service.base_price) || this.service.base_price <= 0) {
                this.errors.base_price = 'Base price must be a positive number.';
            }
            if (!this.service.time_required) {
                this.errors.time_required = 'Time required is required.';
            }
            if (!this.service.description) {
                this.errors.description = 'Description is required.';
            }

            if (Object.keys(this.errors).length === 0) {
                this.registerService();
            }
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