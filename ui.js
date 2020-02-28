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
        console.log(pkmnData, speciesData);
        const { id, name, abilities, height, weight, types, stats } = pkmnData;
        const { pokedex_numbers: dex, names, evolution_chain: evolChain } = speciesData;
        this.assignBG(id);
        this.assignNameID(id, name);
        this.getAbilities(abilities);
        this.assignPokeBio(height, weight, { dex, names });
        const pokeType = this.getPokemonType(pkmnData);
        this.getPokeStats(stats);
        //console.log(pkmnData);
        //console.log(speciesData);
        // //Promise.all([fetchJSON(`https://pokeapi.co/api/v2/type/`), fetchJSON(`${speciesData.evolution_chain.url}`)])

        const typeAndEvol = Promise.all([this.fetchJSON(`https://pokeapi.co/api/v2/type/`), this.fetchJSON(`${speciesData.evolution_chain.url}`)]);
        this.getPokeWeaknesses(typeAndEvol, pokeType);

        this.getWeakOrEvol(typeAndEvol, 1).then(({ chain }) => {
            console.log(chain)
            const { evolves_to: evolve, species } = chain;

            function isObjEmpty(obj) {
                for (let prop in obj) {
                    if (obj.hasOwnProperty(prop))
                        return false;
                }
                return true;
            }

            function babyEvol(obj) {
                let babyE = [];
                let i = 0;
                while (!isObjEmpty(obj[i])) {
                    babyE.push(obj[i].species.url);
                    i++;
                }

                babyE = babyE.map((url) => {
                    return convertURLTOID(url);
                })

                console.log(babyE);

                return babyE;
            }

            function evol1to2(obj, baby, key) {
                let i = 0;
                let object = { chain: [] };
                while (!isObjEmpty(obj[i])) {
                    let next = obj[i].species[key];
                    if (!isObjEmpty(obj[i].evolves_to)) {
                        let j = 0;
                        while (!isObjEmpty(obj[i].evolves_to[j])) {
                            let final = obj[i].evolves_to[j].species[key];;
                            object.chain.push({ baby: baby[key], next, final })
                            j++;
                        }
                    } else {
                        object.chain.push({ baby: baby[key], next })
                    }
                    i++;
                }

                console.log(object.chain)
                return object.chain;
            }

            var groupBy = function (xs, key) {
                return xs.reduce(function (rv, x) {
                    (rv[x[key]] = rv[x[key]] || []).push(x);
                    return rv;
                }, {});
            };

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
                    evolHTML += `<div class=pkmn-one-evol><div class="part-1"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeName}.png" alt=""><p class="lead artwork-lead" style="font-size:1.1=em; font-weight:600;">${pokeName}</p></div></div>`
                } else if (secondStageID.length == 1) { //pokemon has a normal evo chain, no branches.
                    secondStageID.forEach((id) => {
                        for (let key in id) {
                            evolHTML += `<div class="part-1"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id[key]}.png" alt="">
                                <p class="lead artwork-lead" style="font-size:1.1=em; font-weight:600;">${secondStageName[0][key]}</p></div>`
                            //<div class="arr"><img src="./right-arrow.png" alt=""></div>`    
                        }
                    })
                } else if (secondStageID.length > 1) { //poke 2nd or third stage has more than one branch.
                    //We must differentiate between the branches by speces.name
                    if (pokeName == convertURLTOID(species.url) || (secondStageID[0]["next"] == pokeName && secondStageName[0]["final"])) {
                        let array = [];
                        [...secondStageID, ...secondStageName].forEach((acc, index) => {
                            console.log(acc, index)
                            array[index] = [];
                            for (let key in acc) {
                                if (array[index].indexOf(acc[key]) < 0) {
                                    array[index].push(acc[key])
                                }
                            }
                        })

                        array = Array.from(new Set(array.reduce((acc, curr) => {return acc.concat(curr)}, [])));

                        array = [array.splice(0, array.length/2), array.splice(0, array.length)];
                        console.log(array)
                        
                        array[0].forEach((val, index) => {
                            evolHTML += `<div class="part-1"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${val}.png" alt="">
                                <p class="lead artwork-lead" style="font-size:1.1=em; font-weight:600;">${array[1][index]}</p></div>`
                        })

                    } else {
                        let middle = groupBy(secondStageID, "next")[pokeName];
                        let final = groupBy(secondStageID, "final")[pokeName];
                        middle = middle || final;
                        let index = secondStageID.findIndex((obj, index) => {
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
                                </div>`
                                //<div class="arr"><img src="./right-arrow.png" alt=""></div>`    
                            }
                        })
                    }
                }
                console.log(evolHTML)
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
            console.log("we out here", id);
            console.log(`pokedex id, length = ${mined.toString().length}`)

            mined = mined - Number(mined.toString().charAt(String(mined).length - 1)) + 1;

            maxed = mined + 9;

        } else if (String(id).length != 1 && String(id).charAt(String(id).length - 1) === "0") {
            console.log("last digit is 0")
            mined = mined - 10 + 1;
        } else if ((String(id).length != 1) && String(id).charAt(String(id).length - 1 === "1")) {
            maxed += 9;
        } else {
            console.log("else option")
            mined = 1;
            maxed = 10;
        }

        console.log(mined, maxed);
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
        abilityHTML+="</ul>"
        this.abilitiesDOM.insertAdjacentHTML('beforeend', abilityHTML);
    }

    assignPokeBio(height, weight, { dex, names }) {
        /**
         * Pokemon Height, Weight, Region, Kanji, and Image are retreived here.
        */

        this.height.textContent = '0.' + height + 'm';
        this.weight.textContent = `${weight / 10}kg`;
        const locationData = dex[dex.length - 2] || dex[0];
        console.log(locationData["pokedex"]["name"]);
        
        if(locationData["pokedex"]["name"].indexOf("extended-") > -1 || locationData["pokedex"]["name"].indexOf("original-") > -1){
            let temp = ``;
            let index = 0;
            if(locationData["pokedex"]["name"].indexOf("extended-") > -1){
                temp = "extended-";
                index = locationData["pokedex"]["name"].indexOf("extended-");
            }else{
                index = locationData["pokedex"]["name"].indexOf("original-");
                temp = "original-"
            }
            console.log(index, locationData["pokedex"]["name"]);
            temp = locationData["pokedex"]["name"].split("").splice(9);
            locationData["pokedex"]["name"] = temp.join("");
        }
        this.loc.textContent = `${locationData["pokedex"]["name"]}`;
        const kanji = `${names[10]}` || `${names[9]}`;
        this.kanji.textContent = kanji["name"];
    }

    assignBG(id) {

        //Without this line, I would be "tainting" the canvas by loading from a cross origins domain.
        this.pkmImage.crossOrigin = "Anonymous";
        this.pkmImage.src = `./test/${id}.png`;


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
                console.log("Attempting to chnage background color to defult")
                document.body.style.backgroundColor = swatches["DarkVibrant"].getHex();
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

    getPokemonType({ types }) {
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
                <img src="./types-url/${this.capitalize(pokeType[i])}.png" alt="${pokeType[i]}">
                <p class="lead artwork-lead center pkmn-type">${pokeType[i]}</p>
            </div>`
        }

        this.pkmnType.insertAdjacentHTML('beforeend', typeHTML);

        return pokeType;
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

    getPokeWeaknesses(passed, pokeType) {
        this.getWeakOrEvol(passed, 0).then(({ results }) => {
            let filtered = [];
            filtered =
                results.filter(({ name }) => {
                    return pokeType.indexOf(name) > -1;
                }).map((obj) => { return obj.url })

            return (Promise.all(filtered.map((res) => {
                return this.fetchJSON(res);
            })))
        })
            .then((damage_relations) => {
                let damage = damage_relations.map((res) => { return res.damage_relations })
                let weakness = [];
                let dmgFrom = [];
                let immune = [];
                damage.forEach((val) => {
                    for (let i in val) {
                        if (i.indexOf("double_damage_from") > -1) {
                            weakness.push(val[i]);
                        } else if (i.indexOf("half_damage_from") > -1) {
                            dmgFrom.push(val[i]);
                        } else if (i.indexOf("no_damage_from") > -1 && (val[i].length)) {
                            immune.push(val[i]);
                        }
                    }
                })

                let defWeakness = this.reduceArray(dmgFrom.concat(immune));
                defWeakness = Array.from(new Set(defWeakness.map(({ name }) => { return name })));
                weakness = this.reduceArray(weakness);
                weakness = Array.from(new Set(weakness.map(({ name }) => name)));
                immune = this.reduceArray(immune);
                immune = Array.from(new Set(immune.map(({ name }) => name)));

                let resistances = defWeakness.filter((type) => immune.indexOf(type) < 0)
                    .filter((res) => weakness.indexOf(res) < 0);
                let immunities = defWeakness.filter((type) => immune.indexOf(type) > -1);

                defWeakness = weakness.filter((test) => {
                    return defWeakness.indexOf(test) < 0
                })

                const that = this;

                function outputResults(array) {
                    let resistancesHTML = ``;
                    for (let resist of array) {
                        resistancesHTML += `<div class="weakness-img">
                        <img src="./types-url/${that.capitalize(resist)}.png" alt="${resist}">
                            <p class="artwork-lead lead center">${resist}</p>
                            </div>`
                    }
                    return resistancesHTML;
                }

                function testImmuneResist(resist, immune) {
                    if (!resist.length) {
                        let immunities = outputResults(immune);
                        that.third_col.insertAdjacentHTML("beforeend", `<h3 id="weakness-h3">Immunities</h3>
                        <div class="weakness-box center">
                        <div class="immunity-img-box"></div>`);
                        document.querySelector(".immunity-img-box").insertAdjacentHTML('beforeend', immunities);

                    } else if (!immune.length) {
                        let resistances = outputResults(resist);
                        that.third_col.insertAdjacentHTML("beforeend", `<h3 id="weakness-h3">Resistances</h3>
                        <div class="weakness-box center">
                        <div class="resistance-img-box"></div>`)
                        document.querySelector(".resistance-img-box").insertAdjacentHTML('beforeend', resistances);
                    } else {
                        const arr = [outputResults(resist), outputResults(immune)];
                        that.third_col.insertAdjacentHTML("beforeend", `<h3 id="weakness-h3">Resistances</h3>
                        <div class="weakness-box center">
                        <div class="resistance-img-box"></div>`)
                        document.querySelector(".resistance-img-box").insertAdjacentHTML('beforeend', arr[0]);
                        that.third_col.insertAdjacentHTML("beforeend", `<h3 id="weakness-h3">Immunities</h3>
                        <div class="weakness-box center">
                        <div class="immunity-img-box"></div>`);
                        document.querySelector(".immunity-img-box").insertAdjacentHTML('beforeend', arr[1]);
                    }
                }
                let weaknessHTML = outputResults(defWeakness);
                //let resistancesHTML = outputResults(resistances);
                this.weaknessSection.insertAdjacentHTML('beforeend', weaknessHTML);
                testImmuneResist(resistances, immunities)
            })
            .catch((err) => {
                console.log(err);
            })
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
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


}



