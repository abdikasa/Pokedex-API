class UI {
    constructor() {
        this.loading = document.querySelector('.loader-screen');
        this.pokemon = document.querySelector('.pokemon');
        this.pokeId = document.querySelector('#poke-num');
        this.pokeName = document.querySelector('#poke-name');
        this.abilitiesDOM = document.querySelector('.abilities');
        this.height = document.querySelector('#height');
        this.weight = document.querySelector('#weight');
        this.loc = document.querySelector('#loc');
        this.kanji = document.querySelector('#kanji');
        this.pkmImage = document.querySelector('#pkm-image');
        this.pkmnName = document.querySelector('.pkmn-name');
        this.pkmnWType = document.querySelector('.pkmn_w_type');
        this.pkmnType = document.querySelector('.type-container-r');
        this.stat = document.querySelector('.stat');
        this.weaknessSection = document.querySelector('.weakness-img-box');
        this.evolve_container = document.querySelector('.evolve-container');
        this.pokedexIndex = document.querySelector('.btn-numbered-class');
        this.body = document.body;
        this.pkmnSearch = document.querySelector(".pkmn-search");
    }
  
  
    paintUI(pkmnData, speciesData) {
  
        const { id, name, abilities, height, weight, types, stats } = pkmnData;
        const { pokedex_numbers: dex, names, evolution_chain: evolChain } = speciesData;
        this.assignBG(id);
        this.assignNameID(id, name);
        this.getAbilities(abilities);
        this.assignPokeBio(height, weight, { dex, names });
        this.getPokemonType(pkmnData);
        this.getPokeStats(stats);
        //Promise.all([fetchJSON(`https://pokeapi.co/api/v2/type/`), fetchJSON(`${speciesData.evolution_chain.url}`)])
  
        //     /**
        //     * The goal is to get the pokemon's weaknesses by cross checking, removing any overlaps with their strengths, weaknesses, immunities.
        //     * First we do a generic call to retrieve all types, cross checking to  see if our type is found in the API.
        //     * Then we use Reg Expressions to cut the essential part of the data the id number from the url variable in the API.
        //     * Then we perform another fetch call to get the type's weaknesses, strengths, etc.
        //     * We push the data to an array and manipulate the data.
        //    */
  
       function getWeakOrEvol(promise, i){
        return promise.then((test) => {
                return test[i];
            })
        }
  
        function getWeaknesses(){
  
        }
  
   
        function fetchJSON(url) {
            return fetch(url).then(function (response) {
                return response.json().then(function (data) {
                    return data;
                })
            })
        }
  
        const xxx= Promise.all([fetchJSON(`https://pokeapi.co/api/v2/type/`), fetchJSON(`${speciesData.evolution_chain.url}`)]);
        getWeakOrEvol(xxx, 0).then(({results}) => {console.log(results)})
        getWeakOrEvol(xxx, 1).then(({chain}) => {console.log(chain)})
  
        //     let alltypes = [], dr_arr = [], typeRegex = new RegExp('[/]{1}[0-9]{1,2}[/]');
        //     fetch(`https://pokeapi.co/api/v2/type/`).then((response) => {
        //         return response.json();
        //     })
        //         .then((resolve) => {
        //             return resolve.results.filter((item) => {
        //                 if (item.name === typeArr[0] || item.name === typeArr[1]) {
        //                     return typeRegex.exec(item.url)[0].split("/")[1];
        //                 }
        //             })
        //         })
        //         .then((res) => {
        //             //Return the pokemon types
        //             //Now we need to get the Weaknesses, Resistances, Immunities.
        //             return Promise.all(res.map(async pokeType => {
        //                 const count = await fetch(pokeType.url);
        //                 const typee = await count.json();
        //                 return [typee.damage_relations.double_damage_from, typee.damage_relations.half_damage_from, typee.damage_relations.no_damage_from]
        //             }))
        //         })
        //         .then((dr_arr) => {
        //             return dr_arr.reduce((acc, curr) => { return acc.concat(curr) }, []);
        //         })
        //         .then((dr_arr) => {
        //             return this.separateWRI(dr_arr);
        //         })
        //         .then((dr_arr) => {
        //             // dr_arr = this.separateWRI(dr_arr);
        //             // console.log(dr_arr, "separated the strengths/weaknesses for clarity")
        //             dr_arr = this.compareTypeWRI(dr_arr);
        //             console.log(dr_arr, "Only the pokemon's weaknesses --- Data is to be outputted to the screen");
  
        //             dr_arr = this.doSomething(this.weaknessSection, 'weakness-img-box', dr_arr);
        //             console.log(dr_arr);
  
        //             let weaknessHTML = '';
  
        //             //Sort the objects by their type name.
        //             dr_arr = dr_arr.sort((a, b) => { return a.name > b.name ? 1 : -1 });
  
        //             for (let i = 0; i < dr_arr.length; i++) {
        //                 weaknessHTML += `<div class="weakness-img">
        //                     <img src="./types/${dr_arr[i].name}.webp" alt="${dr_arr[i].name}">
        //                         <p class="artwork-lead lead center">${dr_arr[i].name}</p>
        //                         </div>`
        //             }
        //             this.weaknessSection.insertAdjacentHTML('beforeend', weaknessHTML);
        //         })
        //         .catch((err) => {
        //             console.log(err);
        //         })
  
        //     fetch(`${speciesData.evolution_chain.url}`).then((res) => { return res.json() }).then((response) => {
  
        //         let chain = response;
        //         console.log(chain);
  
        //         let evol = [];
        //         let index = 0;
        //         while (chain.chain.evolves_to[index]) {
  
        //             //Pokemon With Branched evolutions or Unique Pokemon like Pokemon (133) ===> 7 evolutions
        //             if (chain.chain.evolves_to.length > 1) {
        //                 if (index === chain.chain.evolves_to.length - 1) {
        //                     this.branchedEvols(evol, chain.chain.species);
        //                 }
        //                 evol.push(chain.chain.evolves_to[index].species);
        //                 index++;
  
        //                 //Majority if not almost all pokemon will fall in this category.
        //                 //Returns an object with the whole pokemon evolution chain.
  
        //             } else if (chain.chain.evolves_to.length === 1) {
        //                 //If there is only one object  returned, there are no branched evolutions.
        //                 //So the object will first return the base pokemon evolution, the first form.
        //                 evol.push(chain.chain.species);
  
        //                 //Next check if the evolves_to.length === 1, pokemon with 2 evolutions.
        //                 //Example: Let A evolve into B.
        //                 if ((chain.chain.evolves_to[index].species.name === name) && (chain.chain.evolves_to[index].evolves_to.length === 0)) {
        //                     evol.push(chain.chain.evolves_to[index].species);
  
        //                     //Next check if the evolves_to.length === 1, pokemon with 2 evolutions and it's in its final form
        //                     //Example: Let A evolve into B.
        //                 } else if ((chain.chain.evolves_to[index].species.name != name) && (chain.chain.evolves_to[index].evolves_to.length === 0)) {
        //                     evol.push(chain.chain.evolves_to[index].species);
        //                 } else {
        //                     //Pokemon with three evolutions
        //                     evol.push(chain.chain.evolves_to[index].species); //2nd form
        //                     evol.push(chain.chain.evolves_to[index].evolves_to[index].species); //3rd form
        //                 }
        //                 break;
        //             }
        //         }
  
        //         console.log(evol);
  
        //         evol = this.doSomething(this.evolve_container, 'evolve-container', evol);
  
        //         let evolHTML = ``;
        //         // let regex = /[/](\d)+[/]/;
        //         if (evol.length != 0) {
        //             evol.forEach((item, index) => {
        //                 // evol[index].url = (regex.exec(item.url)[0].split('/')[1]);
        //                 // if (evol[index].url > 151) {
        //                 //     return;
        //                 // }
        //                 evolHTML +=
        //                     `<div class="part-1"><img src="./test/${item.url}.png.webp" alt="">
        //                                         <p class="lead artwork-lead" style="font-size:1.1=em; font-weight:600;">${item.name}</p>
        //                                         </div>`
        //                 // <div class="arr"><img src="./right-arrow.png" alt=""></div>
        //             })
        //         } else {
        //             evolHTML +=
        //                 `<div class="part-1"><img src="./test/${id}.png.webp" alt=""><p class="lead artwork-lead" style="font-size:1.1=em; font-weight:600;">${name}</p></div>`
        //             // <div class="arr"><img src="./right-arrow.png" alt=""></div>`
        //         }
  
        //         this.evolve_container.insertAdjacentHTML('beforeend', evolHTML);
        //         // this.evolve_container.removeChild(this.evolve_container.lastChild);
        //     })
  
        //     let numberedHTML = ``;
        //     //get the pokemon id
        //     let mined, maxed;
        //     mined = maxed = id;
        //     //Check the length
        //     if ((String(id).length != 1) && (String(id).charAt(String(id).length - 1) != ("0")) &&
        //     (String(id).charAt(String(id).length - 1) != ("1"))) {
        //         console.log("we out here", id);
        //         console.log(`pokedex id, length = ${mined.toString().length}`)
  
        //         mined = mined - Number(mined.toString().charAt(String(mined).length-1)) + 1;
  
        //         maxed = mined + 9;
  
        //     } else if (String(id).length != 1 && String(id).charAt(String(id).length-1) === "0") {
        //         console.log("last digit is 0")
        //         mined = mined - 10 + 1;
        //      } else if((String(id).length != 1) && String(id).charAt(String(id).length -1 === "1")){
        //         maxed += 9;
        //     } else {
        //         console.log("else option")
        //         mined = 1;
        //         maxed = 10;
        //     }
  
        //     console.log(mined, maxed);
        //     //iterate through the buttons
        //     for (let i = mined; i < maxed + 1; i++) {
        //         if(i === Number(id)) {
        //             numberedHTML += `<button type="button" class="btn numbered-btn selected-num shadow-none">${i}</button>`;
        //         }else{
        //             numberedHTML += `<button type="button" class="btn numbered-btn shadow-none">${i}</button>`;
        //         }
        //     }
  
        //     this.pokedexIndex.insertAdjacentHTML('beforeend', numberedHTML);
  
    }
  
    assignNameID(id, name) {
  
        /**
        * Get pokemon ID/pokedex number, if pokeID is less than 100.
        * Prepend 00 to the number.
       */
  
        if (id < 10) {
            this.pokeId.textContent = '#00' + id;
        } else if (id < 100) {
            this.pokeId.textContent = '#0' + id;
        } else {
            this.pokeId.textContent = '#' + id;
        }
  
        /**
        * Pokemon's name is stored here.
        */
  
        this.pokeName.textContent = name;
    }
  
    getAbilities(abilities) {
        /**
          * Get Pokemon's abilities.
         */
        let abilityHTML = ``;
  
        abilities.forEach(({ ability }, i) => {
            if (i === abilities.length - 1) {
                abilityHTML += `<li class="list-inline-item">${ability.name}.</li>`;
            } else {
                abilityHTML += `<li class="list-inline-item">${ability.name},</li>`;
            }
        })
        this.abilitiesDOM.insertAdjacentHTML('beforeend', abilityHTML);
    }
  
    assignPokeBio(height, weight, { dex, names }) {
        /**
         * Pokemon Height, Weight, Region, Kanji, and Image are retreived here.
        */
  
        this.height.textContent = '0.' + height + 'm';
        this.weight.textContent = `${weight / 10}kg`;
        this.loc.textContent = `${dex[dex.length - 2].pokedex.name}`;
        this.kanji.textContent = `${names[10].name}`;
    }
  
    assignBG(id) {
  
        //Without this line, I would be "tainting" the canvas by loading from a cross origins domain.
        this.pkmImage.crossOrigin = "Anonymous";
        this.pkmImage.src = `./test/${id}.png.webp`;
  
        //     //From Vibrant JS
        //     //Provides a unique color pallette.
  
        //let pallette = [];
  
        const checkImage = path => (
            new Promise((resolve, reject) => {
                this.pkmImage.onload = () => resolve({ path, status: 'ok' });
                this.pkmImage.onerror = () => reject({ path, status: 'error' });
                this.pkmImage.src = path;
            }));
  
        checkImage(this.pkmImage.src).then(() => {
            var vibrant = new Vibrant(this.pkmImage);
            var swatches = vibrant.swatches();
            console.log(swatches);
            try {
                document.body.style.backgroundColor = swatches["Vibrant"].getHex();
            }
            catch (err) {
                console.log("Changed to a different color since default is undefined");
                document.body.style.backgroundColor = swatches["Muted"].getHex();
            }
  
            // document.body.style.backgroundColor = `${pallette[Math.floor(Math.random() * pallette.length)
            // ]}`;
        }).catch((err) => {
            console.error(`Path not found: ${err.path}`)
            console.error(`Status: ${err.status}`);
        })
    }
  
    getPokemonType({ types, name, id }) {
  
        //     /**
        //     * Get the pokemon's type.
        //     * First sort the type by alphabetical order.
        //     * Get the pokemon's image, name and type stored in HTML format.
        //    */
  
        const pokeType = [];
        for (let { type } of types) {
            pokeType.push(type.name);
        }
  
        pokeType.sort((a, b) => { return a - b });
  
        let typeHTML = ``;
  
        for (let i = 0; i < pokeType.length; i++) {
            typeHTML += `<div class="d-flex flex-column padded-lr">
                <img src="./types/${pokeType[i]}.webp" alt="${pokeType[i]}">
                <p class="lead artwork-lead center pkmn-type">${pokeType[i]}</p>
            </div>`
        }
  
        this.pkmnType.insertAdjacentHTML('beforeend', typeHTML);
        this.pkmnType.insertAdjacentHTML('beforebegin', `<img src="./test/${id}.png.webp" alt="" class="artwork">
             <p class="lead artwork-lead pkmn-name">${name}</p>`)
    }
  
    getPokeStats(stats) {
        const attr = ['HP', 'ATK', 'DEF', 'SpA', 'SpD', 'Spe'];
        const pokeStats = [];
        for (let stat of stats) {
            pokeStats.push(stat.base_stat);
        }
        /**
             * Get the 6 Pokemon stats: HP, Attack, Defense, Special Attack, Special Defense and Speed.
             * Reverse order since the pokeAPI starts with speed instead of HP.
             * Store the abbreviations instead of the long format for stat names. Switch statment used.
             * Store data as HTML. Calculate the height for the bar graph's value, I used a ceiling of 150.
             * Output the data.
             */
  
        let statHTML = '';
        for (let [index, stat] of pokeStats.reverse().entries()) {
            statHTML += `<div class="stat-container">
                             <h5 class="atr">${attr[index]}</h5>
                             <h5 class="atr-val">${stat}</h5>
                             <div class="outer outer-${index}">
                                 <div class="inner-${index}" style="height: calc(100% - ${(stat / 150) * 100}%);">
                                     &nbsp;
                                </div>
                             </div>
                         </div>`;
        }
        this.stat.insertAdjacentHTML('beforeend', statHTML);
    }
  
    getPokeWeaknesses() { }
  
  
    compareTypeWRI(arr) {
        // for (let i = 0; i < arr[0].length; i++) {
        //     for (let j = 0; j < arr[1].length; j++) {
        //         if (arr[1][j].name === arr[0][i].name) {
        //             arr[0].splice(i, 1);
        //             i--;
        //         }
        //     }
        // }
        // return arr[0];
        return arr[0].filter((code) => arr[1].every((coded) => code.name !== coded.name))
    }
  
    separateWRI(arr) {
        let newArr = [];
        if (arr.length === 3) {
            newArr[0] = arr.slice(0, 1).reduce((acc, curr) => { return acc.concat(curr) }, []);
            newArr[1] = arr.slice(1, 3).reduce((acc, curr) => { return acc.concat(curr) }, []);
        } else {
            newArr[0] = arr[0].slice(0).concat(arr[3].slice(0)).reduce((acc, curr) => { return acc.concat(curr) }, []);
            console.log(newArr[0]);
            newArr[1] = arr.slice(1, 3).concat(arr.slice(4)).reduce((acc, curr) => { return acc.concat(curr) }, []);
            console.log("not 3")
        }
  
        //Check for duplicates, pokemon can have different weakness ratios to certain types
        //Like 4x effective, 4x not-effective, 2x, 1x, 0.5x, etc.
        //First, sort the types in alphabetical order.
        newArr.forEach((item, index) => {
            newArr[index].sort((a, b) => { return a.name > b.name ? 1 : -1 })
        })
  
        //Then, sort the objects by name and delete the duplicates.
        for (let i = 0; i < newArr.length; i++) {
            for (let j = 0; j < newArr[i].length - 1; j++) {
                if (newArr[i][j].name === newArr[i][j + 1].name) {
                    newArr[i].splice(j, 1);
                }
            }
        }
  
        return newArr;
    }
  
    branchedEvols(arr, passed) {
        return arr.unshift(passed);
    }
  
    removePokeFrom151Up(arr) {
        let regex = /[/](\d)+[/]/;
        // evol[index].url = (regex.exec(item.url)[0].split('/')[1]);
        arr.forEach((item, index) => {
            arr[index].url = (regex.exec(item.url)[0].split('/')[1]);
        })
  
        arr = arr.filter((item, index) => {
            if (Number(item.url) < 152) {
                return item;
            }
        })
        console.log(arr);
        return arr;
    }
  
    doSomething(domelem, classname, elem) {
        if (domelem.classList.item(domelem.classList.length - 1) != `${classname}`) {
            //Delete it
            domelem.classList.remove(domelem.classList.item(domelem.classList.length - 1));
        }
  
        elem = this.removePokeFrom151Up(elem);
  
        if (elem.length === 2) {
            domelem.classList.add('pkmn-two-evols');
        }
        else if (elem.length === 0 || elem.length === 1) {
            domelem.classList.add('pkmn-one-evol');
        }
        return elem;
    }
  
    clearUI() {
        // this.loading.textContent = ``;
        // this.pokemon.textContent = ``;
        this.pokeId.textContent = ``;
        this.pokeName.textContent = ``;
        this.abilitiesDOM.textContent = ``;
        this.height.textContent = ``;
        this.weight.textContent = ``;
        this.loc.textContent = ``;
        this.kanji.textContent = ``;
        this.pkmImage.src = ``;
        // this.pkmnName.textContent= ``;
        this.pkmnType.textContent = ``;
        this.stat.textContent = ``;
        this.weaknessSection.textContent = ``;
        this.evolve_container.textContent = ``;
        this.pokedexIndex.textContent = ``;
  
        Array.from(this.pkmnWType.children).forEach((item) => {
            if (item.src) { return item.parentElement.removeChild(item); }
            else { item.textContent = ''; }
        })
    }
  
  
 }
  
  
 