class Pokedata {
    constructor(id_name) {
        this.id_name = id_name;
    }
  
    async fetchPokemon() {
       
        const pokeResponse = fetch(`https://pokeapi.co/api/v2/pokemon/${this.id_name}/`);
        const speciesResponse = fetch(`https://pokeapi.co/api/v2/pokemon-species/${this.id_name}/`);
        const response = await Promise.all([pokeResponse, speciesResponse])
        console.log(response);
        const prom = response.map((test) => {return test.json()});
  
        return {
            pokePromise: await prom[0],
            speciesPromise: await prom[1]
        }
       
        // const urls = [`https://pokeapi.co/api/v2/pokemon/${this.id_name}/`,
        // `https://pokeapi.co/api/v2/pokemon-species/${this.id_name}/`];
    }
  
    checkPokemonIDLW151(obj) {
        if (typeof Number(obj) === "number") {
            return Number(obj) < 152 && Number(obj) != 0;
        } else if (typeof Number(obj) === NaN) {
            return "string";
        }
    }
  
    changePokemon(poke) {
        let type = this.checkPokemonIDLW151(poke);
        console.log(type, poke);
        if (type === true || type === "string") {
            this.id_name = poke;
        } else {
            console.log("Pokemon entry is greater than 151");
        }
    }
 }
  
  
 