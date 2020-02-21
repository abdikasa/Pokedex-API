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
                    evolHTML += `<div class="part-1"><img src="./test/${pokeName}.png.webp" alt=""><p class="lead artwork-lead" style="font-size:1.1=em; font-weight:600;">${pokeName}</p></div>`
                } else if (pokeName == convertURLTOID(species.url) || secondStageID.length == 1) { //pokemon has a normal evo chain, no branches.
                    if (secondStageID.length > 1) {
                        basic.unshift(convertURLTOID(species.url));
                        basic.forEach((ids, index) => {
                            evolHTML += `<div class="part-1"><img src="./test/${ids}.png.webp" alt="">
                                <p class="lead artwork-lead" style="font-size:1.1=em; font-weight:600;">${secondStageName[index]}</p></div>`
                            //<div class="arr"><img src="./right-arrow.png" alt=""></div>`    
                        })
                    }
                    else {
                        secondStageID.forEach((id) => {
                            for (let key in id) {
                                evolHTML += `<div class="part-1"><img src="./test/${id[key]}.png.webp" alt="">
                                <p class="lead artwork-lead" style="font-size:1.1=em; font-weight:600;">${secondStageName[0][key]}</p></div>`
                                //<div class="arr"><img src="./right-arrow.png" alt=""></div>`    
                            }
                        })
                    }
                } else if (secondStageID.length > 1) { //poke 2nd or third stage has more than one branch.
                    //We must differentiate between the branches by speces.name
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
                            evolHTML += `<div class="part-1"><img src="./test/${id[key]}.png.webp" alt="">
                                <p class="lead artwork-lead" style="font-size:1.1=em; font-weight:600;">${secondStageName[index][key]}</p>
                            </div>`
                            //<div class="arr"><img src="./right-arrow.png" alt=""></div>`    
                        }
                    })
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
                <img src="./types/${pokeType[i]}.webp" alt="${pokeType[i]}">
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

                function outputResults(array) {
                    let resistancesHTML = ``;
                    for (let resist of array) {
                        resistancesHTML += `<div class="weakness-img">
                        <img src="./types/${resist}.webp" alt="${resist}">
                            <p class="artwork-lead lead center">${resist}</p>
                            </div>`
                    }
                    return resistancesHTML;
                }

                function testImmuneResist(resist, immune){
                    console.log(resist)
                    console.log(immune)
                    if(!resist.length){
                        return outputResults(immune);
                    }else if(!immune.length){
                        return outputResults(resist);
                    }else {
                        return [outputResults(resist), outputResults(immune)];
                    }
                }

                const indicators = [resistances, immunities];
                let weaknessHTML = outputResults(defWeakness);
                //let resistancesHTML = outputResults(resistances);
                this.weaknessSection.insertAdjacentHTML('beforeend', weaknessHTML);

                const printIR = testImmuneResist(indicators[0], indicators[1]);
                console.log(printIR[1])

                if(printIR.length > 1){
                    this.third_col.insertAdjacentHTML("beforeend", `<h3 id="weakness-h3">Resistances</h3>
                    <div class="weakness-box center">
                    <div class="resistance-img-box">
    
                    </div>
                </div>`)
    
                    this.third_col.insertAdjacentHTML("beforeend", `<h3 id="weakness-h3">Immunities</h3>
                    <div class="weakness-box center">
                    <div class="immunity-img-box">
    
                    </div>
                </div>`);

                document.querySelector(".resistance-img-box").insertAdjacentHTML('beforeend', printIR[0]);
                document.querySelector(".immunity-img-box").insertAdjacentHTML('beforeend', printIR[1]);
                }else if(printIR[0].indexOf("resistance") > -1){
                document.querySelector(".resistance-img-box").insertAdjacentHTML('beforeend', printIR[0]);
                }else{
                    document.querySelector(".immunity-img-box").insertAdjacentHTML('beforeend', printIR[1]);
                }

                

            })
            .catch((err) => {
                console.log(err);
            })
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
        this.resistanceSection.textContent = "";

        try {
            checkIfClassExists(".immunity-img-box");
            checkIfClassExists(".resistance-img-box");

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



