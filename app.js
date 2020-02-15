const interface = new UI();
<<<<<<< HEAD
const poke = new Pokedata(`${Math.floor(Math.random() * 151) + 1}`);
=======
//const poke = new Pokedata(`${Math.floor(Math.random() * 151) + 1}`);
const poke = new Pokedata(103);
>>>>>>> 2c17d02d5e55c9560dc19c116adf4410f2b17472

function hideShowBody(string) {
    let body = Array.prototype.slice.call(interface.body.children)
    body = body.filter((item) => {
        return item.id != "loader-screen";
    }).filter((scripts) => {
        return scripts.nodeName != "SCRIPT";
    })

    body.forEach((item) => {
        item.style.display = `${string}`;
    })
}

const setTimeoutPromise = ms => {
<<<<<<< HEAD
    return new Promise(resolve => 
        setTimeout(resolve, ms))}
=======
    return new Promise(resolve =>
        setTimeout(resolve, ms))
}
>>>>>>> 2c17d02d5e55c9560dc19c116adf4410f2b17472

const hideShowLoader = function (string) {
    document.getElementById("loader-screen").style.display = string;
}

async function runProgram() {
    hideShowLoader("block");
    hideShowBody("none");
    interface.pkmnSearch.children[0].style.display = "none";
<<<<<<< HEAD
    
    setTimeoutPromise(400).then(getPokemon)
    .then(() => {
        hideShowBody("none")
        console.log("ran")      
    })
=======

    setTimeoutPromise(300).then(getPokemon)
        .then(() => {
            hideShowBody("none")
        })
>>>>>>> 2c17d02d5e55c9560dc19c116adf4410f2b17472
        .finally(() => {
            setTimeout(() => {
                hideShowLoader("none");
                interface.pkmnSearch.children[0].style.display = "block";
                hideShowBody("block");
<<<<<<< HEAD
            }, 500)
=======
            }, 700)
>>>>>>> 2c17d02d5e55c9560dc19c116adf4410f2b17472
        })
}

Array.from(interface.pkmnSearch.children).forEach((item) => {
    item.addEventListener("keypress", (e) => {
        if (e.which === 13 || e.keyCode === 13) {
            //Check to see if output is correct.
            let type = poke.checkPokemonIDLW151(item.value);
            console.log(type);
            if (type === true || type === "string") {
                if (item.value == poke.id_name) {
                    return;
                }
                interface.clearUI();
                interface.body.style.backgroundColor = "white";
                poke.changePokemon(Math.trunc(item.value));
                runProgram();
            }
            Array.from(interface.pkmnSearch.children).forEach((item) => {
                return clearInputs(item);
            });
        }
    })
})

document.querySelector('.vertical-pokedex').addEventListener('click', (e) => {
    let curr = document.querySelector('.selected-num');
    if (e.target.parentElement.id === "prev-btn") {
        console.log("prev")
        interface.clearUI();
        poke.changePokemon(`${Number(curr.textContent) - Number("1")}`);
        runProgram();
    } else if (e.target.parentElement.id === "next-btn") {
        interface.clearUI();
        poke.changePokemon(`${Number(curr.textContent) + Number("1")}`);
        runProgram();
    } else {
        if (e.target.classList.value.includes('numbered-btn')) {
            interface.clearUI();
            poke.changePokemon(e.target.textContent);
            runProgram();
        }
    }
})

function clearInputs(input) {
    return input.value = '';
}

async function getPokemon() {
  
    poke.fetchPokemon()
        .then(async resolve => {
            let prom = await Promise.all(resolve);
            interface.paintUI(prom[0], prom[1]);
<<<<<<< HEAD
            finish = Date.now() - start;
            console.log(`${finish}ms`)
=======
>>>>>>> 2c17d02d5e55c9560dc19c116adf4410f2b17472
        })
        .catch(reject => {
            console.warn(reject);
        })
}

runProgram();
