
const questionNumber = document.querySelector(".question-number");
const questionText = document.querySelector(".question-text");
const optionContainer = document.querySelector(".option-container");
const answersIndicatorContainer = document.querySelector(".answers-indicator");
const homeBox = document.querySelector(".home-box");
const homeBox2 = document.querySelector(".home-box2");
const homeBox3 = document.querySelector(".home-box3");
const homeBox4 = document.querySelector(".home-box4");
const quizBox = document.querySelector(".quiz-box");
const resultBox = document.querySelector(".result-box");

let availableQuestions = [];
let availableOptions = [];
let correctAnswers = 0;
let attempt = 0;
let questionLimit = 0;
let questionCounter = 0;
let currentQuestion = {};


function getQuestion() {
    return  fetch( 'js/fe.json')
        .then((res) => res.json())
        .then((loadQuestions) => {
            questions = loadQuestions.results.map((loadQuestion) => {
                const formatQuestion = {
                    question: loadQuestion.question
                };

                const answerChoices = [...loadQuestion.incorrect_answers];
                formatQuestion.answer = Math.floor(Math.random() * 2) + 1;
                answerChoices.splice(formatQuestion.answer-1, 0, loadQuestion.correct_answer);
                answerChoices.forEach((choice, index) => {
                    formatQuestion['choice' + (index+1)] = choice;
                });

                return formatQuestion;
            })

            return questions;
        })
        .catch((error) => {
            console.error(error);
        })
}

async function startQuiz(){

    homeBox.classList.add("hide");
    quizBox.classList.remove("hide");

    const useQuestion = await getQuestion();
    availableQuestions = [...useQuestion];

    questionLimit = availableQuestions.length;

    getNewQuestion();

    answersIndicator();
}

const questionIndex = Math.floor(Math.random() * questionLimit);
function getNewQuestion(){
    
    questionNumber.innerHTML = "Question " + (questionCounter + 1) + " of " + questionLimit;

    const questionIndex = Math.floor(Math.random() * questionLimit);
    currentQuestion = availableQuestions[questionIndex];
    //console.log(currentQuestion);
    questionText.innerHTML = currentQuestion.question;

    optionContainer.innerHTML = null;

    let animationDelay = 0.15
    const totalChoice = 2;
    for (let i=0; i<totalChoice; i++) {
        const option = document.createElement("div");
        option.className = "option";
        option.style.animationDelay = animationDelay + 's';
        animationDelay = animationDelay + 0.2;
        option.dataset.number = i + 1;
        optionContainer.appendChild(option)
        option.setAttribute("onclick","getResult(this)")
    }

    const chooseChoice = document.querySelectorAll('.option');
    let number = 0 
    chooseChoice.forEach((choice) => {
        number++;
        choice.innerText = currentQuestion['choice' + number];
    })
    
    if(currentQuestion.hasOwnProperty("img")){
        const img = document.createElement("img");
        img.src = currentQuestion.img;
        questionText.appendChild(img);
    }

    availableQuestions.splice(questionIndex, 1);

    questionCounter++
}

function getResult(e) {

    const selectedChoice = e;
    const selectedAnswer = selectedChoice.dataset.number;

    let classToApply = '';
    if (selectedAnswer == currentQuestion.answer) {
        classToApply = 'correct';
    } else {
        classToApply = 'incorrect';
    }


    if (classToApply === 'correct') {
        selectedChoice.classList.add("correct");
        updateAnswersIndicator("correct");
        correctAnswers++;  
    } else {
        selectedChoice.classList.add("wrong");
        updateAnswersIndicator("wrong");
        const optionLen = optionContainer.children.length;
        for(let i=0; i<optionLen; i++){
            if (optionContainer.children[i].dataset.number == currentQuestion.answer) {
                optionContainer.children[i].classList.add("correct");
            }
        }
    }
    attempt++;
    unclickableOptions();
}

function answersIndicator(){
    answersIndicatorContainer.innerHTML = null;
    const totalQuestion = questions.length;
    for(let i=0; i<totalQuestion; i++){
        const indicator = document.createElement("div");
        answersIndicatorContainer.appendChild(indicator)
    }
}

function unclickableOptions(){
    const optionLen = optionContainer.children.length;
    for(let i=0 ; i<optionLen; i++){
        optionContainer.children[i].classList.add("already-answered");
    }
}

function updateAnswersIndicator(markType) {
    answersIndicatorContainer.children[questionCounter-1].classList.add(markType);
}


function next(){
    setTimeout(() => {
        if(questionCounter === questionLimit){
            quizOver();
        }
        else{
            getNewQuestion();
        }
    }, 100);
}

function quizOver(){
    // hide quiz quizBox
    quizBox.classList.add("hide");
    // show result Box
    resultBox.classList.remove("hide");
    quizResult();
}

function quizResult(){
    resultBox.querySelector(".total-question").innerHTML = questionLimit;
    resultBox.querySelector(".total-attempt").innerHTML = attempt;
    resultBox.querySelector(".total-correct").innerHTML = correctAnswers
    resultBox.querySelector(".total-wrong").innerHTML = attempt - correctAnswers;
    const percentage = (correctAnswers/questionLimit)*100;
    resultBox.querySelector(".percentage").innerHTML = percentage.toFixed(2) + "%";
    resultBox.querySelector(".total-score").innerHTML = correctAnswers + " / " + questionLimit;
}

function resetQuiz(){
    questionCounter = 0;
    correctAnswers = 0;
    attempt = 0;
    availableQuestions = [];
}

function tryAgainQuiz(){
    // hide the resultBox
    resultBox.classList.add("hide");
    // show the quizBox
    quizBox.classList.remove("hide");
    resetQuiz();
    startQuiz();
}

function goToHome(){
    // hide resultBox
    resultBox.classList.add("hide");
    // show home box
    homeBox.classList.remove("hide");
    resetQuiz();
    location.replace("../../home.html");
}

// window.onload = function (){
//     homeBox.querySelector(".total-question").innerHTML = questionLimit;
// }
