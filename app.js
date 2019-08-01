let interface = new UI();

document.addEventListener('DOMContentLoaded', function(){
    
    //Add the animation to the pokemon div.
    interface.pokemon.classList.toggle('animate-gengar');

    //When animation is finished, delete the container
    document.addEventListener('animationend', function() {
        interface.removeLoader().then((resolve) => {
            resolve.remove();
        });
    })
})