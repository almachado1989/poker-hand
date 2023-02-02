var cardNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
var cardSuits = ['club', 'heart', 'spade', 'diamond'];
var deck = [];
var hand = [];
var newCards = [];
var swap = document.getElementById('mulligan');  


function assignIds() {
    var chips = document.querySelectorAll('.chip');
    
    for (let i = 0; i < chips.length; i++) {
        chips[i].id = 'chip' + i;
    }
}

function createCards(suits, numbers, deck) {
    for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < numbers.length; j++) {
            deck.push({
                suit: suits[i],
                number: numbers[j]
            }) 
        }
    }
}

function getCards(deck, hand, number) {
    for (let i = 0; i < number;) {
        var offeredCard = deck[Math.floor(Math.random() * deck.length)];
        if (hand.indexOf(offeredCard) === -1) {
            hand[i] = offeredCard;
            i++;
        }
        else {
            continue;
        }
    }
}

function getNewCards(deck, elements, number) {

    var cards = document.querySelectorAll('.card');

    cards.forEach(card => {
            card.style.animation = 0;
        });
    
    swap.style.display = 'none';

    for (i = 0; i < elements.length; i++) {
        newCards.push({
            suit: elements[i].getAttribute('data-suit'),
            number: elements[i].getAttribute('data-number')
        }) 
    }

    for (let j = 0; j < number;) {
        var offeredCard = deck[Math.floor(Math.random() * deck.length)];
        if (
            newCards.indexOf(offeredCard) === -1 
            && hand.indexOf(offeredCard) === -1
            ){
            newCards[j] = offeredCard;
            j++;
        }
        else {
            continue;
        } 
    }
}

function makeCards(array) {
    var hand = document.querySelector('.hand');

    var cardBody = '';
    var lastSuit = '';
    var topNumber;
    var color = '';

    for (let i = 0; i < array.length; i++) {
        var iconCount = array[i].number;
        topNumber = array[i].number;

        if (array[i].suit === 'heart' || array[i].suit === 'diamond') {
                color = 'red';
            }
        
        if (iconCount%2 == 1 && iconCount != 1) {
            iconCount -= 1;
        }  
        else if (iconCount == 10) {
            iconCount -= 2;
        } 

        for (let j = 0; j < iconCount; j++) {
            if (array[i].number > 10 || array[i].number == 1) {
                if (array[i].number == 11) {
                    cardBody += `<span class="royal">J</span>`;
                    topNumber = 'J';
                    break;

                } else if (array[i].number == 12) {
                    cardBody += `<span class="royal">Q</span>`;
                    topNumber = 'Q';
                    break;
                
                } else if (array[i].number == 13) {
                    cardBody += `<span class="royal">K</span>`;
                    topNumber = 'K';
                    break;
                }   

                else if (array[i].number == 1) {
                    cardBody += `<span class="royal">&${array[i].suit}suit;</span>`;
                    topNumber = '1';
                    break;
                }
            }
            else if (array[i].number%2 == 1) {
                lastSuit = `<span class="middle ${color}">&${array[i].suit}suit;</span>`
            }
            else if (array[i].number == 10) {
                lastSuit = `
                    <span class="middle ${color}">&${array[i].suit}suit;<br>&${array[i].suit}suit;</span>
                    `
            }

            cardBody += `<span>&${array[i].suit}suit;</span>`
        }

        hand.innerHTML  += `
        <div class="card" onclick="selectCard(this)" data-suit="${array[i].suit}" data-number="${array[i].number}">
        <span class="icon top"><span class="${color}">&${array[i].suit}suit; </span>${topNumber}</span>
        <span class="icon bottom"><span class="${color}">&${array[i].suit}suit; </span>${topNumber}</span>
        <div class="card-body ${color}">` + cardBody + `</div>` + lastSuit + `</div>`;

        cardBody = '';
        lastSuit = '';
        color = '';
    }
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

function selectCard(element) {
    if (element.classList.contains('selected')) {
        element.classList.remove('selected');
    }
    else {
        element.classList.add('selected');
    }
}  

swap.addEventListener('click', function() {
    newCards = [];
    var target = document.getElementById('discard');
    var toSwap = document.querySelectorAll('.selected');
    var number = toSwap.length;
    toSwap.forEach(card => {
        card.style.animation = 0;
        card.style.transform = 'translate(0, 0) rotate(0)';
        card.classList.remove('selected');
        card.classList.add('blackout');
        target.insertAdjacentElement('beforeend', card);     
    });
    getNewCards(deck, toSwap, number);
    makeCards(newCards);
}.bind(newCards));

assignIds();
createCards(cardSuits, cardNumbers, deck);
getValues();

function sortHand() {
    var currentHand = document.querySelector('.hand').children;
    var currentHandArray = Array.from(currentHand);
    let sorted = currentHandArray.sort(sorter);
    function sorter(a,b) {
        return b.dataset.number - a.dataset.number;
    }

    checkSameValue(sorted);
    checkHighCard(sorted);
}

function checkHighCard(sortedArray) {
    
    return 'high card is ' + sortedArray[0].dataset.number 
    + ' ' + sortedArray[0].dataset.suit; 
}

function checkSameValue(sortedArray) {
    var count = 0;
    for (let i = 0; i < sortedArray.length; i++) {
        for (let j = i; j < sortedArray.length; j++) {
            if (i == j) {
                continue;
            } else if (
                sortedArray[i].dataset.number == sortedArray[j].dataset.number
                ){
                count++;
            };
        } 
    }

    if (count == 1) {
        alert('pair');
        return 1;

    } else if (count == 2) {
        alert('two pair');
        return 1;
    }

    else if (count == 3) {
        alert('three of a kind');
        return 1;
    }
}

function deal() {
    var currentHand = document.querySelector('.hand');
    var discarded =  document.querySelector('.discard');
    
    currentHand.innerHTML = '';
    discarded.innerHTML = '';
    
    getCards(deck, hand, 5);
    makeCards(hand); 
    
    swap.style.display = 'block';
}






/////////// Drag drop functions ///////////

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