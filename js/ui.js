
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
        this.pkmnType = document.querySelector('.type-container-r');
        this.stat = document.querySelector('.stat');
        this.weaknessSection = document.querySelector('.weakness-img-box');
        this.evolve_container = document.querySelector('.evolve-container');
        this.pokedexIndex = document.querySelector('.btn-numbered-class');
        this.body = document.body;
        this.pkmnSearch = document.querySelector(".pkmn-search");
        this.resistanceSection = document.querySelector(".resistance-img-box");
        this.third_col = document.querySelector('.third-col-left');
    }


    paintUI(pkmnData, speciesData) {
        const { id, name, abilities, height, weight, types, stats } = pkmnData;
        const { pokedex_numbers: dex, names, evolution_chain: evolChain } = speciesData;
        console.log(pkmnData);
        console.log(speciesData);
        this.assignBG(id);
        this.assignNameID(id, name);
        this.getAbilities(abilities);
        this.assignPokeBio(height, weight, { dex, names });
        const pokeType = this.pkmnTWS();
        this.getPokeStats(stats);

        const that = this;

        function getPokemonWRI() {
            let getTypes = types.map(({ type }) => {
                return pokeType.find(({ name }) => {
                    return type.name.toLowerCase() == name.toLowerCase();
                })
            })

            getTypes.sort((a, b) => { return a - b });

            let typeHTML = ``;
            for (let i = 0; i < getTypes.length; i++) {
                console.log(getTypes[i].name);
                typeHTML += `<div class="d-flex flex-column padded-lr">
                <img src="types-url/${(getTypes[i].name)}.png" alt="${getTypes[i].name}">
                <p class="lead artwork-lead center pkmn-type">${getTypes[i].name}</p>
            </div>`
            }

            that.pkmnType.insertAdjacentHTML('beforeend', typeHTML);

            //resist, no_dmg_to and weakTo
            let pokeW, pokeR, pokeI;

            pokeR = mergeDupes(getTypes.map((pokemonType) => {
                return pokemonType["resist"];
            }));

            pokeW = mergeDupes(getTypes.map((pokemonType) => { return pokemonType["weakTo"] }));

            pokeI = mergeDupes(getTypes.map((pokemonType) => {
                return pokemonType["no_dmg_from"];
            })).filter((type) => { return type != undefined });

            function mergeDupes(arr) {
                return [...new Set([].concat(...arr))];
            }

            let tempWeakness = pokeW;

            tempWeakness = tempWeakness.filter((item) => {
                return pokeR.indexOf(item) < 0 && pokeI.indexOf(item) <= -1;
            })

            pokeR = (mergeDupes(pokeR.concat(pokeW)).filter((pokeType) => {
                return pokeW.indexOf(pokeType) <= -1;
            })).sort();



            if (pokeR.length) {
                that.third_col.insertAdjacentHTML("beforeend", `<h3 id="weakness-h3">Resistances</h3>
                                    <div class="weakness-box center">
                                    <div class="resistance-img-box"></div>`);
                document.querySelector(".resistance-img-box").insertAdjacentHTML('beforeend', outputResults(pokeR));
            }


            document.querySelector(".weakness-img-box").insertAdjacentHTML('beforeend',
                outputResults(tempWeakness));

            if (pokeI.length) {
                that.third_col.insertAdjacentHTML("beforeend", `<h3 id="weakness-h3">Immunities</h3>
                    <div class="weakness-box center">
                    <div class="immunity-img-box"></div>`);
                document.querySelector(".immunity-img-box").insertAdjacentHTML('beforeend',
                    outputResults(pokeI));
            }

            function outputResults(array) {
                let resistancesHTML = ``;
                for (let resist of array) {
                    console.log(resist);
                    resistancesHTML += `<div class="weakness-img">
                                <img src="types-url/${resist}.png" alt="${resist}">
                                    <p class="artwork-lead lead center">${resist}</p>
                                    </div>`
                }
                return resistancesHTML;
            }
        }

        //W = weakness, R = resistance and I = Immunities (if any)
        getPokemonWRI();





        const evol = Promise.all([this.fetchJSON(`${speciesData.evolution_chain.url}`)]);

        evol.then((evolveData) => {
            const [{ chain }] = evolveData;
            const { evolves_to: evolve, species } = chain;

            //check if object is returned and can be used for
            //the following methods

            function isObjEmpty(obj) {
                for (let prop in obj) {
                    if (obj.hasOwnProperty(prop))
                        return false;
                }
                return true;
            }

            //Get the pokeid of pre-evolution (if any).
            //First we get the url and we split it to get the pokeId.

            function babyEvol(evolution) {
                let babyE = [];
                let i = 0;
                while (!isObjEmpty(evolution[i])) {
                    babyE.push(evolution[i].species.url);
                    i++;
                }
                babyE = babyE.map((url) => {
                    return convertURLTOID(url);
                })
                return babyE;
            }

            //Get the evolution from stage 1 to 2 and even to stage 3.
            //The function returns the pokemon name or id of each stage found in an array.
            function evol1to2(evolution, baby, key) {
                let i = 0;
                let pkmn = { chain: [] };
                while (!isObjEmpty(evolution[i])) {
                    //there is at least one evolution.
                    let next = evolution[i].species[key];
                    if (!isObjEmpty(evolution[i].evolves_to)) {
                        //if true, pokemon has at least 2 evolutions.
                        let j = 0;
                        while (!isObjEmpty(evolution[i].evolves_to[j])) {
                            let final = evolution[i].evolves_to[j].species[key];
                            pkmn.chain.push({ baby: baby[key], next, final })
                            j++;
                        }
                    } else {
                        pkmn.chain.push({ baby: baby[key], next })
                    }
                    i++;
                }
                return pkmn.chain;
            }

            //Very important function; used to determine the proper 
            //sequence of the evolution chain. Some pokemon have branched 
            //evolutions. Ex: A => b => (C or D)
            //but at let's say at D, it would not make sense for C to show up in the chain since it is branched.

            var groupBy = function (xs, key) {
                return xs.reduce(function (rv, x) {
                    (rv[x[key]] = rv[x[key]] || []).push(x);
                    return rv;
                }, {});
            };

            //Converts the url of the api call and returns the pokeid.
            //Can take an array or an url.
            function convertURLTOID(url) {
                let regex = /[/](\d)+[/]/;

                if (typeof url == "string") {
                    return regex.exec(url)[0].split('/')[1]
                } else {
                    url.forEach((url) => {
                        for (let key in url) {
                            url[key] = convertURLTOID(url[key]);
                        }
                    })
                    return url;
                }
            }


            function getEvolution(pokeName, evolved, { species }) {
                const secondStageName = evol1to2(evolved, species, "name");
                const secondStageID = convertURLTOID(evol1to2(evolved, species, "url"));
                let evolHTML = ``;
                const basic = babyEvol(evolved);
                //Check for no evolutions, return the species name
                if (basic.length == 0) {
                    //print the image of the baby here.
                    evolHTML += `<div class=pkmn-one-evol><div class="part-1"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeName}.png" alt=""><p class="lead artwork-lead" style="font-size:1.1=em; font-weight:600;">${pokeName}</p></div></div>`;
                } else if (secondStageID.length == 1) { //pokemon has a normal evo chain, no branches.
                    secondStageID.forEach((id) => {
                        for (let key in id) {
                            evolHTML += `<div class="part-1"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id[key]}.png" alt="">
                            <p class="lead artwork-lead" style="font-size:1.1=em; font-weight:600;">${secondStageName[0][key]}</p></div>`
                            //<div class="arr"><img src="./right-arrow.png" alt=""></div>`    
                        }
                    })
                } else if (secondStageID.length > 1) {
                    //poke 2nd or third stage has more than one branch.
                    //We must differentiate between the branches by speces.name
                    if (pokeName == convertURLTOID(species.url) || (secondStageID[0]["next"] == pokeName && secondStageName[0]["final"])) {
                        let array = [];
                        [...secondStageID, ...secondStageName].forEach((acc, index) => {
                            array[index] = [];
                            for (let key in acc) {
                                if (array[index].indexOf(acc[key]) < 0) {
                                    array[index].push(acc[key])
                                }
                            }
                        })

                        //remove duplicates if any.
                        array = Array.from(new Set(array.reduce((acc, curr) => { return acc.concat(curr) }, [])));

                        array = [array.splice(0, array.length / 2), array.splice(0, array.length)];

                        array[0].forEach((val, index) => {
                            evolHTML += `<div class="part-1"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${val}.png" alt="">
                            <p class="lead artwork-lead" style="font-size:1.1=em; font-weight:600;">${array[1][index]}</p></div>`
                        })

                    } else {

                        //Branched evolutions belong here.
                        //Let middle = pokemon with branched evolutions at the first stage.
                        //let final = pokemon with branched evolutions at the 2nd form.
                        let middle = groupBy(secondStageID, "next")[pokeName];
                        let final = groupBy(secondStageID, "final")[pokeName];

                        middle = middle || final;
                        let index = secondStageID.findIndex((obj) => {
                            if (obj.final == undefined) {
                                return obj.next == middle[0].next;
                            } else {
                                return obj.final == middle[0].final;
                            }
                        })

                        middle.forEach((id) => {
                            for (let key in id) {
                                evolHTML += `<div class="part-1"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id[key]}.png" alt="">
                                <p class="lead artwork-lead" style="font-size:1.1=em; font-weight:600;">${secondStageName[index][key]}</p>
                            </div>`;
                            }
                        })
                    }
                }
                return evolHTML;
            }
            const evolutionComplete = getEvolution(id, evolve, chain);
            this.evolve_container.insertAdjacentHTML('beforeend', evolutionComplete);
        })




        let numberedHTML = ``;
        //get the pokemon id
        let mined, maxed;
        mined = maxed = id;
        //Check the length
        if ((String(id).length != 1) && (String(id).charAt(String(id).length - 1) != ("0")) &&
            (String(id).charAt(String(id).length - 1) != ("1"))) {
            mined = mined - Number(mined.toString().charAt(String(mined).length - 1)) + 1;

            maxed = mined + 9;

        } else if (String(id).length != 1 && String(id).charAt(String(id).length - 1) === "0") {
            mined = mined - 10 + 1;
        } else if ((String(id).length != 1) && String(id).charAt(String(id).length - 1 === "1")) {
            maxed += 9;
        } else {
            mined = 1;
            maxed = 10;
        }

        //iterate through the buttons
        for (let i = mined; i < maxed + 1; i++) {
            if (i === Number(id)) {
                numberedHTML += `<button type="button" class="btn numbered-btn selected-num shadow-none">${i}</button>`;
            } else {
                numberedHTML += `<button type="button" class="btn numbered-btn shadow-none">${i}</button>`;
            }
        }

        this.pokedexIndex.insertAdjacentHTML('beforeend', numberedHTML);

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
        let abilityHTML = `<ul id=ul-ability>`;

        abilities.forEach(({ ability }, i) => {
            if (i === abilities.length - 1) {
                abilityHTML += `<li class="list-inline-item">${ability.name}.</li>`;
            } else {
                abilityHTML += `<li class="list-inline-item">${ability.name},</li>`;
            }
        })
        abilityHTML += "</ul>"
        this.abilitiesDOM.insertAdjacentHTML('beforeend', abilityHTML);
    }

    assignPokeBio(height, weight, { dex, names }) {
        /**
         * Pokemon Height, Weight, Region, Kanji, and Image are retreived here.
        */

        this.height.textContent = '0.' + height + 'm';
        this.weight.textContent = `${weight / 10}kg`;

        let dexRegion = dex[1].pokedex.name || dex[0].pokedex.name;
        let regex = /\b(?:original-|-coastal|-mountain|-central)\b/gi;

        if (dexRegion.match(regex)) {
            let index = dexRegion.indexOf(...dexRegion.match(regex));
            let found = dexRegion.match(regex)[0];
            console.log(index);
            console.log(found);
            switch (found) {
                case "original-":
                    dexRegion = dexRegion.slice(found.length);
                    break;
                case "-coastal":
                case "-mountain":
                case "-central":
                    dexRegion = dexRegion.slice(0, index);
                    break;
            }
        }
        console.log(dexRegion);
        this.loc.textContent = `${dexRegion}`;
        let kanji = names.filter(({language}) => {return language.name == "ja"});
        this.kanji.textContent = `${kanji[0].name}`


    }

    assignBG(id) {

        //Without this line, I would be "tainting" the canvas by loading from a cross origins domain.
        this.pkmImage.crossOrigin = "Anonymous";
        //this.pkmImage.src = `./pokemon/pokemonwebp/${id}.png.webp`;
        this.pkmImage.src = `./pokemon/${id}.png`;


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
            try {
                document.body.style.backgroundColor = swatches["DarkVibrant"].getHex();
            }
            catch (err) {
                document.body.style.backgroundColor = swatches["Muted"].getHex();
            }

            // document.body.style.backgroundColor = `${pallette[Math.floor(Math.random() * pallette.length)
            // ]}`;
        }).catch((err) => {
            console.error(`Path not found: ${err.path}`)
            console.error(`Status: ${err.status}`);
        })
    }

    getWeakOrEvol(promise, i) {
        return promise.then((test) => {
            return test[i];
        })
    }

    fetchJSON(url) {
        return fetch(url).then(function (response) {
            return response.json().then(function (data) {
                return data;
            })
        })
    }

    reduceArray(passed) {
        return passed.reduce((acc, curr) => acc.concat(curr), []);
    }

    getPokeStats(stats) {
        const attr = ['HP', 'ATK', 'DEF', 'SpA', 'SpD', 'Spe'];
        const pokeStats = [];
        for (let stat of stats) {
            pokeStats.push(stat.base_stat);
        }

        let statHTML = '';
        for (let [index, stat] of pokeStats.reverse().entries()) {
            statHTML += `<div class="stat-container">
                             <h5 class="atr">${attr[index]}</h5>
                             <h5 class="atr-val">${stat}</h5>
                             <div class="outer outer-${index}">
                                 <div class="inner-${index}" style="height: calc(100% - ${(stat / 130) * 100}%);">
                                     &nbsp;
                                </div>
                             </div>
                         </div>`;
        }
        this.stat.insertAdjacentHTML('beforeend', statHTML);
    }


    clearUI() {
        this.pokeId.textContent = ``;
        this.pokeName.textContent = ``;
        this.abilitiesDOM.textContent = ``;
        this.height.textContent = ``;
        this.weight.textContent = ``;
        this.loc.textContent = ``;
        this.kanji.textContent = ``;
        this.pkmImage.src = ``;
        this.pkmnType.textContent = ``;
        this.stat.textContent = ``;
        this.weaknessSection.textContent = ``;
        this.evolve_container.textContent = ``;
        this.pokedexIndex.textContent = ``;

        try {
            this.checkIfClassExists(".immunity-img-box");
            this.checkIfClassExists(".resistance-img-box");

        } catch (err) {
            console.log(err, "removed failure operation");
        }

    }

    checkIfClassExists(string) {
        if (document.querySelector(string) != null) {
            document.querySelector(string).parentElement.previousElementSibling.remove();
            document.querySelector(string).parentElement.remove();
        }
    }

    pkmnTWS() {

        return [{ "name": "Normal", "no_dmg_to": ["Ghost"], "weaknesses": ["Rock", "Steel"], "strengths": [], "no_dmg_from": ["Ghost"], "weakTo": ["Fighting"], "resist": [] },

        { "name": "Fire", "no_dmg_to": [], "weaknesses": ["Fire", "Water", "Rock", "Dragon"], "strengths": ["Grass", "Ice", "Bug", "Steel"], "weakTo": ["Ground", "Rock", "Water"], "resist": ["Bug", "Steel", "Fire", "Grass", "Ice"] },

        { "name": "Water", "no_dmg_to": [], "weaknesses": ["Water", "Grass", "Dragon"], "strengths": ["Fire", "Ground", "Rock"], "weakTo": ["Grass", "Electric"], "resist": ["Steel", "Fire", "Water", "Ice"] },

        {
            "name": "Electric", "no_dmg_to": ["Ground"], "weaknesses": ["Electric", "Grass", "Dragon"], "strengths": ["Water", "Flying"], "weakTo": ["Ground"],
            "resist": ["Flying", "Steel", "Electric"]
        },

        { "name": "Grass", "no_dmg_to": [], "weaknesses": ["Fire", "Grass", "Poison", "Flying", "Bug", "Dragon", "Steel"], "strengths": ["Water", "Ground", "Rock"], "weakTo": ["Flying", "Poison", "Bug", "Fire", "Ice"], "resist": ["Water", "Grass", "Electric", "Ground"] },

        {
            "name": "Ice", "no_dmg_to": [], "weaknesses": ["Fire", "Water", "Ice", "Steel"], "strengths": ["Grass", "Ground", "Flying", "Dragon"],
            "weakTo": ["Fighting", "Rock", "Steel", "Fire"], "resist": ["Ice"]
        },

        {
            "name": "Fighting", "no_dmg_to": ["Ghost"], "weaknesses": ["Poison", "Flying", "Psychic", "Bug", "Fairy"], "strengths": ["Normal", "Ice", "Rock",
                "Dark", "Steel"], "weakTo": ["Flying", "Psychic", "Fairy"], "resist": ["Rock", "Bug", "Dark"]
        },

        { "name": "Poison", "no_dmg_to": ["Steel"], "weaknesses": ["Poison", "Ground", "Rock", "Ghost"], "strengths": ["Grass", "Fairy"], "weakTo": ["Ground", "Psychic"], "resist": ["Fighting", "Poison", "Grass", "Fairy", "Bug"] },

        { "name": "Ground", "no_dmg_to": ["Flying"], "weaknesses": ["Grass", "Bug"], "strengths": ["Fire", "Electric", "Poison", "Rock", "Steel"], "no_dmg_from": ["Electric"], "weakTo": ["Water", "Grass", "Ice"], "resist": ["Poison", "Rock", "Electric"] },

        {
            "name": "Flying", "no_dmg_to": [], "weaknesses": ["Electric", "Rock", "Steel"], "strengths": ["Grass", "Fighting", "Bug"], "no_dmg_from": ["Ground"],
            "weakTo": ["Rock", "Electric", "Ice"], "resist": ["Fighting", "Bug", "Grass"]
        },

        {
            "name": "Psychic", "no_dmg_to": ["Dark"], "weaknesses": ["Psychic", "Steel"], "strengths": ["Fighting", "Poison"], "weakTo": ["Bug", "Ghost", "Dark"],
            "resist": ["Fighting", "Psychic"]
        },

        { "name": "Bug", "no_dmg_to": [], "weaknesses": ["Fire", "Fighting", "Poison", "Flying", "Ghost", "Steel", "Fairy"], "strengths": ["Grass", "Psychic", "Dark"], "weakTo": ["Flying", "Rock", "Fire"], "resist": ["Fighting", "Ground", "Grass"] },

        { "name": "Rock", "no_dmg_to": [], "weaknesses": ["Fighting", "Ground", "Steel"], "strengths": ["Fire", "Ice", "Flying", "Bug"], "weakTo": ["Fighting", "Ground", "Steel", "Water", "Grass"], "resist": ["Normal", "Flying", "Poison", "Fire"] },

        { "name": "Ghost", "no_dmg_to": ["Normal"], "weaknesses": ["Dark"], "strengths": ["Psychic", "Ghost"], "no_dmg_from": ["Normal", "Fighting"], "weakTo": ["Ghost", "Dark"], "resist": ["Poison", "Bug"] },

        { "name": "Dragon", "no_dmg_to": ["Fairy"], "weaknesses": ["Steel"], "strengths": ["Dragon"], "weakTo": ["Dragon", "Fairy"], "resist": ["Fire", "Water", "Grass", "Electric"] },

        { "name": "Dark", "no_dmg_to": [], "weaknesses": ["Fighting", "Dark", "Fairy"], "strengths": ["Psychic", "Ghost"], "no_dmg_from": ["Psychic"], "weakTo": ["Fighting", "Bug", "Fairy"], "resist": ["Ghost", "Dark"] },

        { "name": "Steel", "no_dmg_to": [], "weaknesses": ["Fire", "Water", "Electric", "Steel"], "strengths": ["Ice", "Rock", "Fairy"], "no_dmg_from": ["Poison"], "weakTo": ["Fighting", "Ground", "Fire"], "resist": ["Normal", "Flying", "Rock", "Bug", "Steel", "Grass", 'Psychic', 'Ice', 'Dragon', 'Fairy'] },

        {
            "name": "Fairy", "no_dmg_to": [], "weaknesses": ["Fire", "Poison", "Steel"], "strengths": ["Fighting", "Dragon", "Dark"], "no_dmg_from": ["Dragon"], "weakTo": [
                "Poison", "Steel"], "resist": ["Fighting", "Bug", "Dragon", "Dark"]
        }]
    }


}



