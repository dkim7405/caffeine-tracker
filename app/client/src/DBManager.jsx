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

    async getDrinkDetails(drinkId) {
        // [id, name, mg_per_oz, image_url, manufacturer_name, drink_type]

        try {
            const response = await fetch(`${this.base_url}/drinks/${drinkId}`);
            if (!response.ok) {
                throw new Error(`HTTP Error Status: ${response.status}`);
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Error fetching drink details for ID ${drinkId}:`, error);
            throw error;
        }
    }

    async getServingSizes(drinkType) {
        // [serving_id, serving_name, amount_ml, amount_oz, drink_type]
    
        try {
            // Encode the drink type for url safety
            const encodedType = encodeURIComponent(drinkType);
            const response = await fetch(`${this.base_url}/servingsizes/${encodedType}`);
            if (!response.ok) {
                throw new Error(`HTTP Error Status: ${response.status}`);
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Error fetching serving sizes for type "${drinkType}":`, error);
            throw error;
        }
    }

    async addDrinkEntry(userId, drinkId, totalAmount) {
        try {
            const response = await fetch(`${this.base_url}/addDrink`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    drink_id: drinkId,
                    total_amount: totalAmount
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP Error Status: ${response.status}`);
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error adding drink entry:', error);
            throw error;
        }
    }    
}

export default DBManager;