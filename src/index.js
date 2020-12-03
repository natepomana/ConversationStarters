
// helper consts
const questionBtn = document.getElementById('questionBtn');
const questionDiv = document.getElementById('question');


// load card objects
const loadDecks = () => {
    console.log('loading decks');
    // check local storage first

    // if not in local storage fetch from server
}

// load next question
const loadNextQuestion = () => {
    console.log('loading next question');
}

// reset asked questions
const reset = () => {
    console.log('resetting...')
}


const fetchRequest = async () => {
    const url = '/Users/nathanpomana/Documents/git/conversations/src/cards.json';
    let response = await fetch(url);
    let data = await response.json();
    console.log(data);
    return data;
}


(() => {
    console.log('index.js');
    loadDecks();


    questionBtn.onclick = loadNextQuestion;
})();