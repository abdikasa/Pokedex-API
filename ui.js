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

        if (resource.id < 100 && resource.id != 100) {
            this.pokeId.textContent = '00' + resource.id;
        } else {
            this.pokeId.textContent = resource.id;
        }

        this.pokeName.textContent = resource.name;
        this.pkmnName.textContent = resource.name;

        //Check how many abilities a pokemon had
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

        this.height.textContent = '0.' + resource.height + 'm';
        this.weight.textContent = `${resource.weight / 10}kg`;

        this.loc.textContent = `${resource2.pokedex_numbers[resource2.pokedex_numbers.length - 2].pokedex.name}`;

        this.kanji.textContent = `${resource2.names[10].name}`;

        this.pkmImage.src = `./sugimori artwork/${resource.id}.png`

        let typeCount = resource.types.sort((a, b) => { return a.slot - b.slot });

        let typeHTML = ``, typeArr = [];

        for (let i = 0; i < typeCount.length; i++) {
            // sortedTypes.push(typeCount[i].type.name);
            // sortedTypes.sort();
            typeHTML += `<div class="d-flex flex-column padded-lr">
            <img src="./types/${typeCount[i].type.name}.png" alt="${typeCount[i].type.name}">
            <p class="lead artwork-lead center pkmn-type">${typeCount[i].type.name}</p>
        </div>`
            typeArr.push(typeCount[i].type.name);
        }
        // console.log(sortedTypes);
        this.pkmnType.insertAdjacentHTML('beforeend', typeHTML);

        let statHTML = '', statName;

        for (let i = 5; i > -1; i--) {
            let abbrev = { ATK: 'Attack', DEF: 'Defense', SpA: 'Special-Attack', SpD: 'Special-Defense', Spe: 'Speed' }
            //resource.stats[i].stat.name.toLowerCase()
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
            <div class="outer">
                <div class="inner">
                    &nbsp;
                </div>
            </div>
        </div>`
        }

        this.stat.insertAdjacentHTML('beforeend', statHTML);

        let alltypes = [], dr_arr = [], typeRegex = new RegExp('[/]{1}[0-9]{1,2}[/]');

        fetch(`https://pokeapi.co/api/v2/type/`).then((response) => {
            return response.json();
        }).then((resolve) => {

            // old
            // for (let i = 0; i < typeArr.length; i++) {
            //     for (let j = 0; j < resolve.results.length; j++) {
            //         if (resolve.results[j].name === typeArr[i]) {
            //             typeNum.push(typeRegex.exec(resolve.results[j].url)[0].split("/")[1]);
            //         }
            //     }
            // }

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

            }, 100)
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
        newArr[0] = arr.slice(0, 1).concat(arr[3].slice(0)).reduce((acc, curr) => { return acc.concat(curr) }, []);
        newArr[1] = arr.slice(1, 3).concat(arr.slice(4)).reduce((acc, curr) => { return acc.concat(curr) }, []);
        return newArr;
    }

}
