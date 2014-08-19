var BF_QUIZ = {};

BF_QUIZ.quiz = function () {

    var
    highest_score, quiz_div, quiz_title, questions = [], results = [], inputs = [],
        
    getQuizCanvas = function getQuizCanvas() {
        quiz_div = document.getElementById("bf-quiz");
    },
    
    getJSONData = function getJSONData(json_data) {
        quiz_title = json_data[0].quiz_title;
        for (var i = 0; i < json_data[0].quiz_questions.length; i++) {
            questions.push(json_data[0].quiz_questions[i]);
        }
        for (var i = 0; i < json_data[0].quiz_results.length; i++) {
            results.push(json_data[0].quiz_results[i]);
        }
    },
    
    writeQuiz = function writeQuiz() {
        newTitle = document.createElement('h1');
        newTitle.innerHTML = quiz_title;
        quiz_div.appendChild(newTitle);
        for (var i = 0; i < questions.length; i++) {
            newQuestion = document.createElement('div');
            newQuestion.className = 'quiz-question';
            newQuestionWrapper = document.createElement('div');
            newQuestionWrapper.className = 'quiz-question-text-wrapper';
            newQuestionText = document.createElement('h2');
            newQuestionText.innerHTML = questions[i].question.text;
            newQuestionWrapper.appendChild(newQuestionText);
            newQuestion.appendChild(newQuestionWrapper);
            quiz_div.appendChild(newQuestion);
            newAnswerForm = document.createElement('form');
            for (var j = 0; j < questions[i].question.question_answers.length; j++) {
                newAnswer = document.createElement('div');
                newAnswer.className = 'quiz-answer';
                newAnswer.setAttribute('data-quizValue', 
                    questions[i].question.question_answers[j].answer.value);
                newAnswerWrapper = document.createElement('div');
                newAnswerWrapper.className = 'quiz-answer-text-wrapper';
                newAnswerText = document.createElement('p');
                newAnswerText.innerHTML = questions[i].question.question_answers[j].answer.text;
                newAnswerInput = document.createElement('input');
                newAnswerInput.type = 'radio';
                inputs.push(newAnswerInput);
                newAnswerWrapper.appendChild(newAnswerText);
                newAnswerWrapper.appendChild(newAnswerInput);
                newAnswer.appendChild(newAnswerWrapper);
                newAnswerForm.appendChild(newAnswer);
            }
            quiz_div.appendChild(newAnswerForm);
        }
    }
    
    checkInputs = function checkInputs() {
        userAnswers = [];
        var c = 0;
        for (var i = 0; i < inputs.length; i++) {
            if(inputs[i].checked) {
                userAnswers.push(inputs[i].parentNode.parentNode.dataset.quizvalue);
                c++;
            }
        }
        if (c==questions.length) { calcResult() }
    },
    
    calcResult = function calcResult() {
        results = results
        highest = 0;
        for (var i = 0; i < results.length; i++) {
            results[i]["countof"] = 0;
            for (var j = 0; j < userAnswers.length; j++) {
                if (userAnswers[j] == results[i].result.id) {
                    results[i].countof++;
                }
            }
            if (results[i].countof > highest) {
                highest = results[i].countof;
                highest_score = results[i]
            }
        }
        //disable the inputs after the quiz is finished
        writeResult();
        for (var q = 0; q < inputs.length; q++) {
            inputs[q].disabled = true;
        }
    },
    
    writeResult = function writeResult() {
        newResult = document.createElement('div');
        newResult.className = 'quiz-result';
        newResultWrapper = document.createElement('div');
        newResultWrapper.className = 'quiz-result-text-wrapper';
        newResultTitle = document.createElement('h3');
        newResultTitle.innerHTML = highest_score.result.title;
        newResultText = document.createElement('p');
        newResultText.innerHTML = highest_score.result.text;
        newResultWrapper.appendChild(newResultTitle);
        newResultWrapper.appendChild(newResultText);
        newResult.appendChild(newResultWrapper);
        quiz_div.appendChild(newResult);
        console.log('print');
    }
    
    addClickEvents = function addClickEvents() {
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('click', function() {
                checkInputs()
            });
        }
    }
    
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

    var 
    json_data,
    
    loadQuizJSON = function loadQuizJSON(json_url) {
        request = new XMLHttpRequest();
        request.open('GET', json_url, false);
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
    }
    
    return {
        init: function(json_url) {
            loadQuizJSON(json_url);
            BF_QUIZ.quiz.init(json_data);
        }
    };
}();

