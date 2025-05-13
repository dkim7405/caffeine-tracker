import Fuse from 'fuse.js';

class DrinksManager {
    constructor(drinks = []) {
        this.drinks = drinks;
        this.fuse = null;
    }

    load() {
        this.fuse = new Fuse(this.drinks, {
            keys: ['name', 'manufacturer_name', 'type_name'],
            threshold: 0.3,
            ignoreLocation: true,
            includeScore: true,
        });
        return this.drinks;
    }

    searchDrinks(term) {
        if (!this.fuse || !term.trim()) {
            return this.drinks;
        }

        const results = this.fuse.search(term.trim());
        return results.map(result => result.item);
    }

    getAllDrinks() {
        return this.drinks;
    }
}

export default DrinksManager;
