class Pokedata {
    constructor(id_name) {
        this.id_name = id_name;
    }

    async fetchPokemon() {
        // First we retreive the pokemon, then the species in order to see its evolutionary chain.

        //pokePromise contains abilities, id, name, sprites, stats, type, height/weight.
        const pokeResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${this.id_name}/`);
        const pokePromise = await pokeResponse.json();

        //speciesPromise contains information about the color and kanji. 
        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${this.id_name}/`);
        const speciesPromise = await speciesResponse.json();

        return {
            pokePromise,
            speciesPromise,
        }
    }

    checkPokemonIDLW151(obj){
        if(typeof Number(obj) === "number"){
            return Number(obj) < 152 && Number(obj) != 0;
        }else if (typeof Number(obj) === NaN){
            return "string";
        }
    }

    changePokemon(poke) {
        let type = this.checkPokemonIDLW151(poke);
        console.log(type, poke);
        if(type === true || type === "string"){
            this.id_name = poke;
        }else{
            console.log("Pokemon entry is greater than 151");
        }
    }
}

