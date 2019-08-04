class Pokedata {
    constructor(id_name) {
        this.id_name = id_name;
    }

    async fetchPokemon() {
        // First we retreive the pokemon, then the species in order to see its evolutionary chain.

        const pokeResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${this.id_name}/`);
        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${this.id_name}/`);
        const speciesPromise = await speciesResponse.json();
        const pokePromise = await pokeResponse.json();

        return {
            pokePromise,
            speciesPromise
        }
    }


}