function assignIds() {
    var chips = document.querySelectorAll('.chip');
    
    for (let i = 0; i < chips.length; i++) {
        chips[i].id = 'chip' + i;
        console.log(chips[i]);
    }
}

assignIds()

function allowDrop(ev) {
    ev.preventDefault();
}

function dragStart(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function dragDrop(ev, el) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    el.appendChild(document.getElementById(data));
    getValues();
}

function getValues() {
    var potValue = document.getElementById('potValue');
    var handValue = document.getElementById('handValue');

    var fives = document.getElementById('500count');
    var twos = document.getElementById('200count');
    var ones = document.getElementById('100count');

    var pot = document.querySelector('#pot');
    var chips = document.querySelector('#chips');

    var potChips = pot.querySelectorAll('.chip');
    var heldChips = chips.querySelectorAll('.chip');

    var valuePot = 0;
    var valueHeld = 0;

    var countFives = 0;
    var countTwos = 0;
    var countOnes = 0;

    potChips.forEach(chip => { 
        valuePot += parseInt(chip.getAttribute('data-value'));
    });
    
    heldChips.forEach(chip => { 
        valueHeld += parseInt(chip.getAttribute('data-value'));
        if (chip.getAttribute('data-value') == '500') {
            countFives++;
        } 
        else if (chip.getAttribute('data-value') == '200') {
            countTwos++;
        } 
        else if (chip.getAttribute('data-value') == '100') {
            countOnes++;
        } 
    });

    potValue.innerHTML = valuePot;
    handValue.innerHTML = valueHeld;
    fives.innerHTML = countFives;
    twos.innerHTML = countTwos;
    ones.innerHTML = countOnes;
}

getValues();

