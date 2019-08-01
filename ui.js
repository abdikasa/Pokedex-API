class UI {
    constructor() {
        this.loading = document.querySelector('.loader-screen');
        this.pokemon = document.querySelector('.pokemon');
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
}
