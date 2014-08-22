// Adds the functionality to check if an element has a class
HTMLElement.prototype.hasClass = function (className) {
    "use strict";
    if (this.classList) {
        return this.classList.contains(className);
    }
    return (-1 < this.className.indexOf(className));
};

// Adds the ability to remove classes from elements
HTMLElement.prototype.removeClass = function (className) {
    "use strict";
    if (this.classList) {
        this.classList.remove(className);
    }
    return this;
};

// Building BF_QUIZ Module according to the principles outlined here: http://yuiblog.com/blog/2007/06/12/module-pattern/
var BF_QUIZ = {};

BF_QUIZ.quiz = function () {
    "use strict";
    
    // Sets variables
    var highest_score, quiz_div, quiz_title, quiz_image, questions = [],
        results = [], inputs = [], answers = [], userAnswers = [],
    
    // Gets the Quiz "canvas"
    getQuizCanvas = function getQuizCanvas() {
        quiz_div = document.getElementById("bf-quiz");
    },
    
    // Parses the JSON data passed from the Loader
    getJSONData = function getJSONData(json_data) {
        //Main Quiz Title
        quiz_title = json_data[0].quiz_title;
        //Main Quiz Image
        quiz_image = json_data[0].quiz_image;
        //Populates questions arrary with questions from JSON file
        for (var i = 0; i < json_data[0].quiz_questions.length; i++) {
            questions.push(json_data[0].quiz_questions[i]);
        }
        //Populates results array with results from JSON file
        for (var j = 0; j < json_data[0].quiz_results.length; j++) {
            results.push(json_data[0].quiz_results[j]);
        }
    },
    
    // Writes the Quiz into the document
    writeQuiz = function writeQuiz() {
      	var newQuizWrapper, newTitle, newQuestionTextWrapper, newQuestionText,
            newAnswerForm, newAnswer, newAnswerImage, newAnswerTextWrapper, newAnswerInput,
            newAnswerText, newQuestion;
        newQuizWrapper = document.createElement("div");
        newQuizWrapper.className = "quiz-wrapper";
        newTitle = document.createElement("h1");
        newTitle.innerHTML = quiz_title;
        newQuizWrapper.appendChild(newTitle);
        for (var i = 0; i < questions.length; i++) {
            newQuestionTextWrapper = document.createElement("div");
            newQuestionTextWrapper.className = "quiz-question-text-wrapper";
            newQuestionText = document.createElement("h2");
            newQuestionText.innerHTML = questions[i].question.text;
            newQuestionTextWrapper.appendChild(newQuestionText);
            newAnswerForm = document.createElement("form");
            for (var j = 0; j < questions[i].question.question_answers.length; j++) {
                newAnswer = document.createElement("div");
                newAnswer.className = "quiz-answer";
                newAnswer.setAttribute("data-quizValue", 
                    questions[i].question.question_answers[j].answer.value);
                if (questions[i].question.question_answers[j].answer.image) {
                    newAnswerImage = document.createElement("img");
                    newAnswerImage.src = questions[i].question.question_answers[j].answer.image;
                    newAnswer.appendChild(newAnswerImage);
                }
                else{
                    //no image  
                }
                newAnswerTextWrapper = document.createElement("div");
                newAnswerTextWrapper.className = "quiz-answer-text-wrapper";
                newAnswerTextWrapper.id = "quiz-answer-text-wrapper";
                newAnswerInput = document.createElement("input");
                newAnswerInput.type = "radio";
                newAnswerInput.name = "answer";
                inputs.push(newAnswerInput);
                newAnswerText = document.createElement("label");
                newAnswerText.innerHTML = questions[i].question.question_answers[j].answer.text;
                newAnswerTextWrapper.appendChild(newAnswerInput);
                newAnswerTextWrapper.appendChild(newAnswerText);
                newAnswer.appendChild(newAnswerTextWrapper);
                answers.push(newAnswer);
                newAnswerForm.appendChild(newAnswer);
            }
            newQuestion = document.createElement("div");
            newQuestion.className = "quiz-question";
            newQuestion.appendChild(newQuestionTextWrapper);
            newQuestion.appendChild(newAnswerForm);
            newQuizWrapper.appendChild(newQuestion);
        }
        quiz_div.appendChild(newQuizWrapper);
    },
    
    //Checks all of the inputs to see if the
    checkInputs = function checkInputs() {
        var c = 0;
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].checked) {
                userAnswers.push(inputs[i].parentNode.parentNode.dataset.quizvalue);
                c++;
            }
        }
        if (c==questions.length) {
        		calcResult();
        }
    },
    
    calcResult = function calcResult() {
        var highest = 0;
        for (var i = 0; i < results.length; i++) {
            results[i].countof = 0;
            for (var j = 0; j < userAnswers.length; j++) {
                if (userAnswers[j] == results[i].result.id) {
                    results[i].countof++;
                }
            }
            if (results[i].countof > highest) {
                highest = results[i].countof;
                highest_score = results[i];
            }
        }
        //disable the inputs after the quiz is finished
        writeResult();
        disableAnswers();
    },
    
    writeResult = function writeResult() {
      	var newResult, newResultWrapper, newResultTitle, newResultText;
        newResult = document.createElement("div");
        newResult.className = "quiz-result";
        newResultWrapper = document.createElement("div");
        newResultWrapper.className = "quiz-result-text-wrapper";
        newResultTitle = document.createElement("h3");
        newResultTitle.innerHTML = highest_score.result.title;
        newResultText = document.createElement("p");
        newResultText.innerHTML = highest_score.result.text;
        newResultWrapper.appendChild(newResultTitle);
        newResultWrapper.appendChild(newResultText);
        newResult.appendChild(newResultWrapper);
        quiz_div.appendChild(newResult);
        console.log("print");
    },
    
    updateSelectedAnswer = function updateSelectedAnswer(element) {
        element.children.namedItem("quiz-answer-text-wrapper").firstChild.checked = true;
        for (var i = 0; i < element.parentNode.children.length; i++) {
            if (element.parentNode.children.item(i).hasClass("selected")) {
                element.parentNode.children.item(i).removeClass("selected");
            }
        }
        element.className = element.className + " selected";
    },
    
    addClickEvents = function addClickEvents() {
      	var onAnswerClick = function onAnswerClick() {
        		if (!this.hasAttribute("disabled")) {
            		updateSelectedAnswer(this);
            		checkInputs();
            }
        };
        for (var i = 0; i < answers.length; i++) {
            answers[i].addEventListener("click", onAnswerClick);
        }
    },
    
    disableAnswers = function disableAnswers() {
        for (var q = 0; q < answers.length; q++) {
            answers[q].setAttribute("disabled", true);
            answers[q].className = answers[q].className + " disabled";
        }
    };
    
    return {
        init: function (json_data) {
            getQuizCanvas();
            getJSONData(json_data);
            writeQuiz();
            addClickEvents();
        }
    };
}();

BF_QUIZ.quizLoader = function () {
    "use strict";

    var json_data, request,
    
    loadQuizJSON = function loadQuizJSON(json_url) {
        request = new XMLHttpRequest();
        request.open("GET", json_url, false);
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                // Success!
                json_data = JSON.parse(request.responseText);
            } else {
                // We reached our target server, but it returned an error
            }
        };
        request.onerror = function() {
            // There was a connection error of some sort
        };
        request.send();
    };
    
    return {
        init: function(json_url) {
            loadQuizJSON(json_url);
            console.log(json_data);
            BF_QUIZ.quiz.init(json_data);
        }
    };
}();

