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

    async login(username, password) {
        try {
            const response = await fetch(`${this.base_url}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async getTodayCaffeine(userId) {
        try {
            const response = await fetch(
                `${this.base_url}/api/today-caffeine?user_id=${userId}`
            );

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error fetching today’s caffeine for user ${userId}:`, error);
            throw error;
        }
    }

    async updateUserProfile(userData) {
        try {
            const response = await fetch(`${this.base_url}/api/user/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(userData)
            });
    
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }
            return data;
        } catch (error) {
            console.error('Update error:', error);
            throw error;
        }
    }

    async deleteUser(userId) {
        try {
            const response = await fetch(`${this.base_url}/api/user/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ userId })
            });
    
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }
            return data;
        } catch (error) {
            console.error('Delete error:', error);
            throw error;
        }
    }

    async register({
        username,
        password,
        first_name,
        last_name,
        middle_name,
        gender,
        body_weight,
        caffeine_limit,
        date_of_birth
    }) {
        try {
            const response = await fetch(`${this.base_url}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    username,
                    password,
                    first_name,
                    last_name,
                    middle_name,
                    gender,
                    body_weight,
                    caffeine_limit,
                    date_of_birth
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }
            
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }
}

export default DBManager;
