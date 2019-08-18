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
        this.pkmnNameRight = document.querySelector('.pkmn-name');
        this.pkmnType = document.querySelector('type-container-r');
        this.stat = document.querySelector('.stat');
        this.pkmnNameRight = document.querySelector('.weakness-img-box');

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
        this.pkmnNameRight.textContent = resource.name;

        //Check how many abilities a pokemon had
        let abilitiesCount = resource.abilities;

        let abilityHtml;
        for (let i = 0; i < abilitiesCount.length; i++) {
            abilityHtml += `<li class="list-inline-item">${abilitiesCount[i].ability.name}</li>`;
        }

        this.abilities.insertAdjacentHTML('beforeend', abilityHtml);

        this.height.textContent = '0.' + resource.height + 'm';
        this.weight.textContent = `${resource.weight / 10}kg`;

        this.loc.textContent = `${resource2.pokedex_numbers[resource2.pokedex_numbers.length - 2].pokedex.name}`;

        this.kanji.textContent = `${resource2.names[10].name}`;

        this.pkmImage.src = `./sugimori artwork/${pokeId.textContent}.png`

        let typeCount = resource.types;
        let typeHTML, typeArr, typeNum;

        for (let i = 0; i < typeCount.length; i++) {
            typeHTML += `<div class="d-flex flex-column">
            <img src="./types/${typeCount[i].type.name}" alt="">
            <p class="lead artwork-lead center pkmn-type">${typeCount[i].type.name}</p>
        </div>`
            typeArr.push(typeCount[i].type.name);
        }

        this.pkmnType.insertAdjacentHTML('beforeend', typeHTML);

        let statHTML, statCount = 6;

        for (let i = statCount - 1; statCount - 1 > -1; i--) {
            statHTML += `<div class="test">
            <h5 class="atr">${resource.stats[i].stat.name}</h5>
            <h5 class="atr-val">${resource.stats[i].base_stat}</h5>
            <div class="outer">
                <div class="inner">
                    &nbsp;
                </div>
            </div>
        </div>`
        }

        this.stat.insertAdjacentHTML('beforend', statHTML);

        let typeRegex = new RegExp('[/]{1}[0-9]{1,2}[/]');

        fetch(`https://pokeapi.co/api/v2/type/`).then((response) => {
            return response.json();
        }).then((resolve) => {
            for (let i = 0; i < typeArr.length; i++) {
                for (let j = 0; j < resolve.results.length; j++) {
                    if (resolve.results[j].name === typeArr[i]) {
                        typeNum.push(typeRegex.exec(resolve.results[j].url)[0].split("/")[1]);
                    }
                }
            }
        })

        setTimeout(() => {
            for (let i = 0; i < typeNum.length; i++) {
                fetch(`https://pokeapi.co/api/v2/type/${Number(typeNum[i])}/`).then((response) => {
                    return response.json();
                }).then((resolve) => {
                    console.log(resolve);
                })
            }
        }, 500)




        // this.pkmnNameRight = document.querySelector('.weakness-img-box');


        // typePromises.push(fetch(`https://pokeapi.co/api/v2/type/1/`));
    }
}
