class DBManager {
    constructor(base_url) {
        this.base_url = base_url;
    }

    async getDrinks() {
        // [id, name, mg_per_oz, image_url, manufacturer_id]

        try {
            const response = await fetch(`${this.base_url}/drinks`);
            if (!response.ok) {
                throw new Error(`HTTP Error Status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching drinks:', error);
            throw error;
        }
    }    
}

export default DBManager;