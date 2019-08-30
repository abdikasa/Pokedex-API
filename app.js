const interface = new UI();
const poke = new Pokedata(9);

document.addEventListener('DOMContentLoaded', function () {
    getPokemon()

    // //Add the animation to the pokemon div.
    // interface.pokemon.classList.toggle('animate-gengar');

    // //When animation is finished, delete the container
    // document.addEventListener('animationend', function () {
    //     interface.removeLoader().then((resolve) => {
    //         resolve.remove();
    //     });
    // })
})


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