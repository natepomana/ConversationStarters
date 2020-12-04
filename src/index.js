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
      await getQuestions(true);
      getQuestionsAnswered(true);
    }
    else {
      console.log('not in local storage');
      await getQuestions();
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
  // modify questions answered 
  if (questions.questions.length - questionsAnswered.length === 5) {
    reset();
  }
  else {
    const id = Math.floor(Math.random() * questions.questions.length);
    const question = questions.questions[id];
    if (questionsAnswered.includes(question)) {
      // redo, already been answered
      loadNextQuestion();
    }
    else {
      // pick it!
      questionDiv.innerHTML = question;
      questionsAnswered.push(question);
      updateLocalStorage(true);
      return;
    }
  }
}

// reset asked questions
const reset = () => {
  console.log('resetting...')
  questionsAnswered = [];
  updateLocalStorage(true);
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

const updateLocalStorage = async (asked = false) => {
  if (asked) {
    localStorage.setItem(localStorageQuestionsAskedKey, JSON.stringify(questionsAnswered));
  }
  else {
    // wasn't asked, set main.
    console.log('Updating local storage');
    console.log(questions);
    localStorage.setItem(localStorageQuestionsKey, JSON.stringify(questions));
  }
}

// get questions answered
const getQuestionsAnswered = (isInLocalStorage = false) => {
  if (isInLocalStorage) {
    questionsAnswered = JSON.parse(localStorage[localStorageQuestionsAskedKey]);
  }
  else {
    questionsAnswered = [];
    updateLocalStorage(true);
  }
}

// get questions
const getQuestions = async (isInLocalStorage = false) => {
  if (isInLocalStorage) {
    questions = JSON.parse(localStorage[localStorageQuestionsKey]);
  }
  else {
    try {
      questions = await fetchRequest();
      await updateLocalStorage();
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
  loadDecks();
  questionBtn.onclick = loadNextQuestion;
})();