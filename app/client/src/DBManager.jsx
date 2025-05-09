class DBManager {
    constructor(base_url) {
        this.base_url = base_url;
    }

    async getDrinks() {
        try {
            const response = await fetch(`${this.base_url}/drinks`);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching drinks:', error);
            throw error;
        }
    }

    async getDrinkDetails(drinkId) {
        try {
            const response = await fetch(`${this.base_url}/drinks/${drinkId}`);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error fetching drink ID ${drinkId}:`, error);
            throw error;
        }
    }

    async getServingSizes(drinkType) {
        try {
            const encodedType = encodeURIComponent(drinkType);
            const response = await fetch(`${this.base_url}/servingsizes/${encodedType}`);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error fetching serving sizes for "${drinkType}":`, error);
            throw error;
        }
    }

    async getUserAdds(userId) {
        try {
            const response = await fetch(`${this.base_url}/users/${userId}/adds`);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error fetching adds for user ${userId}:`, error);
            throw error;
        }
    }

    async addDrinkEntry(userId, drinkId, totalAmount) {
        try {
            const response = await fetch(`${this.base_url}/users/${userId}/adds`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    drink_id: drinkId,
                    total_amount: totalAmount
                })
            });

            if (!response.ok) {
                throw new Error((await response.json()).error || `HTTP Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error adding drink entry:', error);
            throw error;
        }
    }

    async updateDrinkEntry(userId, timeAdded, newDrinkId, newTotalAmount) {
        try {
            const response = await fetch(`${this.base_url}/users/${userId}/adds/${encodeURIComponent(timeAdded)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    new_drink_id: newDrinkId,
                    new_total_amount: newTotalAmount
                })
            });

            if (!response.ok) {
                throw new Error((await response.json()).error || `HTTP Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating drink entry:', error);
            throw error;
        }
    }

    async deleteDrinkEntry(userId, timeAdded) {
        try {
            const response = await fetch(`${this.base_url}/users/${userId}/adds/${encodeURIComponent(timeAdded)}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error((await response.json()).error || `HTTP Error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error deleting drink entry:', error);
            throw error;
        }
    }
}

export default DBManager;
