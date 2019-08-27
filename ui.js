class UI {
    constructor() {
        this.loading = document.querySelector('.loader-screen');
        this.pokemon = document.querySelector('.pokemon');
        this.pokeId = document.querySelector('#poke-num');
        this.pokeName = document.querySelector('#poke-name');
        this.abilities = document.querySelector('.abilities');
        this.height = document.querySelector('#height');
        this.weight = document.querySelector('#weight');
        this.loc = document.querySelector('#loc');
        this.kanji = document.querySelector('#kanji');
        this.pkmImage = document.querySelector('#pkm-image');
        this.pkmnName = document.querySelector('.pkmn-name');
        this.pkmnType = document.querySelector('.type-container-r');
        this.stat = document.querySelector('.stat');
        this.weaknessSection = document.querySelector('.weakness-img-box');
        this.evolve_container = document.querySelector('.evolve-container');
    }

    removeLoader() {
        this.loading.classList.toggle('fadeToWhite');

        //instead of setTimeout, we execute a promise-like object/value.
        //let thiss = this;
        // function removeGengar(callback) {
        //     setTimeout(() => {
        //         callback(thiss.loading.remove());
        //     }, 1001)
        // }
        // removeGengar((item) => {});

        return new Promise(resolve => {
            setTimeout(() => {
                resolve(this.loading)
            }, 1100)
        })
    }

    paintUI(resource, resource2) {

        /** 
        * Get pokemon ID/pokedex number, if pokeID is less than 100.
        * Prepend 00 to the number.
       */

        if (resource.id < 100 && resource.id != 100) {
            this.pokeId.textContent = '00' + resource.id;
        } else {
            this.pokeId.textContent = resource.id;
        }

        /** 
        * Pokemon's name is stored here.
       */

        this.pokeName.textContent = resource.name;

        /** 
        * Get Pokemon's abilities.
       */
        let abilitiesCount = resource.abilities;

        let abilityHtml = '';
        for (let i = 0; i < abilitiesCount.length; i++) {
            if (i === abilitiesCount.length - 1) {
                abilityHtml += `<li class="list-inline-item">${abilitiesCount[i].ability.name}.</li>`;
            } else {
                abilityHtml += `<li class="list-inline-item">${abilitiesCount[i].ability.name},</li>`;
            }
        }
        this.abilities.insertAdjacentHTML('beforeend', abilityHtml);

        /** 
         * Pokemon Height, Weight, Region, Kanji, and Image are retreived here.
        */
        this.height.textContent = '0.' + resource.height + 'm';
        this.weight.textContent = `${resource.weight / 10}kg`;

        this.loc.textContent = `${resource2.pokedex_numbers[resource2.pokedex_numbers.length - 2].pokedex.name}`;

        this.kanji.textContent = `${resource2.names[10].name}`;

        this.pkmImage.src = `./sugimori artwork/${resource.id}.png`


        /** 
        * Get the pokemon's type.
        * First sort the type by alphabetical order.
        * Get the pokemon's image, name and type stored in HTML format.
       */

        let typeCount = resource.types.sort((a, b) => { return a.slot - b.slot });

        let typeHTML = ``, typeArr = [];

        for (let i = 0; i < typeCount.length; i++) {

            typeHTML += `<div class="d-flex flex-column padded-lr">
            <img src="./types/${typeCount[i].type.name}.png" alt="${typeCount[i].type.name}">
            <p class="lead artwork-lead center pkmn-type">${typeCount[i].type.name}</p>
        </div>`
            typeArr.push(typeCount[i].type.name);
        }
        this.pkmnType.insertAdjacentHTML('beforeend', typeHTML);
        this.pkmnType.insertAdjacentHTML('beforebegin', `<img src="./sugimori artwork/${resource.id}.png" alt="" class="artwork">
        <p class="lead artwork-lead pkmn-name">${resource.name}</p>`)


        /** 
        * Get the 6 Pokemon stats: HP, Attack, Defense, Special Attack, Special Defense and Speed.
        * Reverse order since the pokeAPI starts with speed instead of HP.
        * Store the abbreviations instead of the long format for stat names. Switch statment used.
        * Store data as HTML. Calculate the height for the bar graph's value, I used a ceiling of 150.
        * Output the data.
        */

        let statHTML = '', statName;

        for (let i = 5; i > -1; i--) {
            let abbrev = { ATK: 'Attack', DEF: 'Defense', SpA: 'Special-Attack', SpD: 'Special-Defense', Spe: 'Speed' }
            switch (resource.stats[i].stat.name.toLowerCase()) {
                case abbrev[Object.keys(abbrev)[0]].toLowerCase():
                    statName = Object.keys(abbrev)[0];
                    break;
                case abbrev[Object.keys(abbrev)[1]].toLowerCase():
                    statName = Object.keys(abbrev)[1];
                    break;
                case abbrev[Object.keys(abbrev)[2]].toLowerCase():
                    statName = Object.keys(abbrev)[2];
                    break;
                case abbrev[Object.keys(abbrev)[3]].toLowerCase():
                    statName = Object.keys(abbrev)[3];
                    break;
                case abbrev[Object.keys(abbrev)[4]].toLowerCase():
                    statName = Object.keys(abbrev)[4];
                    break;
                case "HP".toLowerCase():
                    statName = 'HP';
                    break;
            }

            statHTML += `<div class="test">
            <h5 class="atr">${statName}</h5>
            <h5 class="atr-val">${resource.stats[i].base_stat}</h5>
            <div class="outer outer-${i}">
                <div class="inner-${i}" style="height: calc(100% - ${(resource.stats[i].base_stat / 150) * 100}%);">
                    &nbsp;
                </div>
            </div>
        </div>`
        }

        this.stat.insertAdjacentHTML('beforeend', statHTML);

        /** 
        * The goal is to get the pokemon's weaknesses by cross checking, removing any overlaps with their strengths, weaknesses, immunities.
        * First we do a generic call to retrieve all types, cross checking to  see if our type is found in the API.
        * Then we use Reg Expressions to cut the essential part of the data the id number from the url variable in the API.
        * Then we perform another fetch call to get the type's weaknesses, strengths, etc.
        * We push the data to an array and manipulate the data. 
       */

        let alltypes = [], dr_arr = [], typeRegex = new RegExp('[/]{1}[0-9]{1,2}[/]');

        fetch(`https://pokeapi.co/api/v2/type/`).then((response) => {
            return response.json();
        }).then((resolve) => {

            alltypes = resolve.results.filter((item) => {
                if (item.name === typeArr[0] || item.name === typeArr[1]) {
                    return typeRegex.exec(item.url)[0].split("/")[1];
                }
            })
            console.log(alltypes);

            alltypes.map((item) => {
                fetch(item.url).then((re) => { return re.json() }).then((res) => {
                    return dr_arr.push([res.damage_relations.double_damage_from], [res.damage_relations.half_damage_from], [res.damage_relations.no_damage_from]);
                })
            })
            setTimeout(() => {
                console.log(dr_arr)
                //Before: dr_arr === [Arr(1)...Arr(1)]
                dr_arr = dr_arr.reduce((acc, curr) => { return acc.concat(curr) }, []);
                console.log(dr_arr, "reduced");

                dr_arr = this.separateWRI(dr_arr);
                console.log(dr_arr, "separated the strengths/weaknesses")

                dr_arr = this.compareTypeWRI(dr_arr);
                console.log(dr_arr, "final weakness");

                //After: dr_arr === [Arr(2)...Arr(n)]
                // dr_arr = this.clearEmpty(dr_arr);
                let weaknessHTML = '';

                //Sort the objects by their type name.
                dr_arr = dr_arr.sort((a, b) => { return a.name > b.name ? 1 : -1 });

                for (let i = 0; i < dr_arr.length; i++) {
                    weaknessHTML += `<div class="weakness-img">
                        <img src="./types/${dr_arr[i].name}.png" alt="${dr_arr[i].name}">
                            <p class="artwork-lead lead center">${dr_arr[i].name}</p>
                            </div>`
                }
                this.weaknessSection.insertAdjacentHTML('beforeend', weaknessHTML);

                fetch(`${resource2.evolution_chain.url}`).then((res) => { return res.json() }).then((response) => {

                    let chain = response;
                    console.log(chain);

                    let evol = [];
                    let index = 0;
                    while (chain.chain.evolves_to[index]) {
                        if (chain.chain.evolves_to.length > 1) {
                            // evol.push(chain.chain.species, chain.chain.evolves_to[index].species);
                            index++;
                        } else if (chain.chain.evolves_to.length === 1) {
                            //If there is only one object  returned, there are no branched evolutions.
                            //So the object will first return the base pokemon evolution, the first form.
                            evol.push(chain.chain.species);

                            //Next check if the evolves_to.length != 0, pokemon with 2 evolutions
                            if (chain.chain.evolves_to[index].species.name === resource.name &&         chain.chain.evolves_to[index].evolves_to.length === 0) {
                                evol.push(chain.chain.evolves_to[index].species);
                            } else {
                                //Pokemon with three evolutions
                                evol.push(chain.chain.evolves_to[index].species);
                                evol.push(chain.chain.evolves_to[index].evolves_to[index].species);
                            }

                            break;
                        }
                    }
                    console.log(evol);

                    // let regex = /[/](\d)+[/]/.exec(`${string}`)[0].split("/")[1])
                    let evolHTML = ``
                    if (evol != []) {
                        evol.forEach((item, index) => {
                            evol[index].url = (/[/](\d)+[/]/.exec(item.url)[0].split("/")[1]);
                            if (evol[index].url > 151) {
                                return;
                            }
                            evolHTML +=
                                `<div class="part-${index + 1}"><img src="./sugimori artwork/${item.url}.png" alt="">
                                <p class="lead artwork-lead" style="font-size:1.1=em; font-weight:600;">${item.name}</p>
                                </div><div class="arr"><img src="./right-arrow.png" alt=""></div>`
                        })
                    }
                    this.evolve_container.insertAdjacentHTML('beforeend', evolHTML);
                    this.evolve_container.removeChild(this.evolve_container.lastChild);
                })




            }, 1000)
        })



        // old
        // setTimeout(() => {
        //     for (let i = 0; i < typeNum.length; i++) {
        //         fetch(`https://pokeapi.co/api/v2/type/${Number(typeNum[i])}/`).then((response) => {
        //             return response.json();
        //         }).then((resolve) => {
        //             console.log(resolve);
        //         })
        //     }
        // }, 500)
    }

    //Replaced with reduce built in function.
    // clearEmpty(arr) {
    //     arr.forEach((item, index) => {
    //         if (item.length === 0) {
    //             console.log(item, index);
    //             return arr.splice(index, 1);
    //         }
    //     })
    //     return arr;
    // }

    compareTypeWRI(arr) {
        for (let i = 0; i < arr[0].length; i++) {
            for (let j = 0; j < arr[1].length; j++) {
                if (arr[0][i].name === arr[1][j].name) {
                    arr[0].splice(i, 1);
                }
            }
        }
        return arr[0];
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
        return newArr;
    }

}
