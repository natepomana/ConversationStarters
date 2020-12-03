
// helper consts
const questionBtn = document.getElementById('questionBtn');
const questionDiv = document.getElementById('question');
const localStorageQuestionsKey = 'conversationStarterQuestions';
const localStorageQuestionsAskedKey = 'conversationStarterQuestionsAsked';
let questions, questionsAnswered;

// load card objects
const loadDecks = async () => {
  console.log('loading decks');

  // check if local storage is enabled
  if (isLocalStorageEnabled()) {
    // check local storage first
    const isInLocalStorage = localStorage.hasOwnProperty(localStorageQuestionsKey);
    if (isInLocalStorage) {
      console.log('in local storage');
      getQuestions(true);
      getQuestionsAnswered(true);
    }
    else {
      console.log('not in local storage');
      await getQuestions().then(updateLocalStorage());
      getQuestionsAnswered();
    }
  }
  else {
    // no local storage, just leverage the questions
    console.log('no local storage.');
    getQuestions();
    getQuestionsAnswered();
  }

  console.log(questions, questionsAnswered);
}

// load next question
const loadNextQuestion = () => {
  console.log('loading next question');
  // modify questions answered 
  updateLocalStorage(true);
}

// reset asked questions
const reset = () => {
  console.log('resetting...')
}

// test if local storage works
const isLocalStorageEnabled = () => {
  const test = 'test';
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (err) {
    return false;
  }
}

const updateLocalStorage = (asked = false) => {
  if (asked) {
    localStorage.setItem(localStorageQuestionsAskedKey, questionsAnswered);
  }
  else {
    // wasn't asked, set main.
    console.log('Updating local storage');
    console.log(questions);
    localStorage.setItem(localStorageQuestionsKey, questions)
  }
}

// get questions answered
const getQuestionsAnswered = (isInLocalStorage = false) => {
  if (isInLocalStorage) {
    questionsAnswered = localStorage.getItem(localStorageQuestionsAskedKey);
  }
  else {
    questionsAnswered = [];
  }

}


// get questions
const getQuestions = async (isInLocalStorage = false) => {
  if (isInLocalStorage) {
    questions = localStorage.getItem(localStorageQuestionsKey);
  }
  else {
    try {
      questions = await fetchRequest();
    }
    catch (err) {
      console.log(err);
    }
  }

}


// fetch cards from source.
const fetchRequest = async () => {
  const url = 'https://raw.githubusercontent.com/natepomana/ConversationStarters/main/src/cards.json';
  let response = await fetch(url);
  let data = await response.json();
  return data;
}


(() => {
  console.log('index.js');
  loadDecks();
  questionBtn.onclick = loadNextQuestion;
})();