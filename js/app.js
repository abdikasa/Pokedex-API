
const interface = new UI();
const poke = new Pokedata(`${Math.floor(Math.random() * 720) + 1}`);
//const poke = new Pokedata(462);

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
    return new Promise(resolve =>
        setTimeout(resolve, ms))
}

const hideShowLoader = function (string) {
    document.getElementById("loader-screen").style.display = string;
}

async function runProgram() {
    hideShowLoader("block");
    hideShowBody("none");
    interface.pkmnSearch.children[0].style.display = "none";

    setTimeoutPromise(200).then(getPokemon)
        .then(() => {
            hideShowBody("none")
        })
        .finally(() => {
            setTimeout(() => {
                hideShowLoader("none");
                interface.pkmnSearch.children[0].style.display = "block";
                hideShowBody("block");
            }, 800)
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
                console.log(item);
                $(item).blur()
                interface.clearUI();
                interface.body.style.backgroundColor = "white";
                poke.changePokemon(Math.abs(Math.trunc(item.value)));
                runProgram();
                this.scrollTo(0, 0);
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

function getPokemon() {

    poke.fetchPokemon()
        .then(resolve => {
            Promise.all(resolve).then((obj) => {
                interface.paintUI(obj[0], obj[1]);
            })
        })
        .catch(reject => {
            console.warn(reject);
        })
}

runProgram();
