const interface = new UI();
const poke = new Pokedata("1");

document.addEventListener('DOMContentLoaded', function () {
    //Add the animation to the pokemon div.
    // interface.pokemon.classList.toggle('animate-gengar');
    getPokemon();
    //When animation is finished, delete the container
    // document.addEventListener('animationend', function () {
    //     interface.removeLoader().then((resolve) => {
    //         resolve.remove();
    //         getPokemon();
    //     });
    // })
})

Array.from(document.querySelector('.pkmn-search').children).forEach((item) => {
    item.addEventListener("keypress", (e) => {
        if (e.which === 13 || e.keyCode === 13) {
            //Check to see if output is correct.
            let type = poke.checkPokemonIDLW151(item.value);
            console.log(type);
            if (type === true || type === "string") {
                interface.clearUI();
                poke.changePokemon(Math.trunc(item.value));
                getPokemon();
            }
            Array.from((document.querySelector('.pkmn-search').children)).forEach((item) => {
                return clearInputs(item);
            });
        }
    })
})

//test
//Github pages won'tupdate my page after changes.

document.querySelector('.vertical-pokedex').addEventListener('click', (e) => {
    let curr = document.querySelector('.selected-num');
    if (e.target.parentElement.id === "prev-btn") {
        console.log("prev")
        interface.clearUI();
        poke.changePokemon(`${Number(curr.textContent) - Number("1")}`);
        getPokemon();
    } else if (e.target.parentElement.id === "next-btn") {
        interface.clearUI();
        poke.changePokemon(`${Number(curr.textContent) + Number("1")}`);
        getPokemon();
    } else {
        if(e.target.classList.value.includes('numbered-btn')){
            interface.clearUI();
            poke.changePokemon(e.target.textContent);
            getPokemon();
        }
    }
})

function clearInputs(input) {
    return input.value = '';
}

function getPokemon() {
    poke.fetchPokemon()
        .then(resolve => {
            console.log(resolve.pokePromise);
            console.log(resolve.speciesPromise);
            interface.paintUI(resolve.pokePromise, resolve.speciesPromise);
        })
        .catch(reject => {
            console.warn(reject)
        })
}