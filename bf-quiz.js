var quizPrototype = {
    questions: document.getElementsByClassName("quiz-question"),
    results: document.getElementsByClassName("quiz-result"),
    inputs: document.getElementsByTagName("input"),
    
    checkInputs: function checkInputs() {
        var that = this;
        this.userAnswers = [];
        var c = 0;
        for (var i = 0; i < this.inputs.length; i++) {
            if(this.inputs.item(i).checked) {
                this.userAnswers.push(this.inputs.item(i).parentNode.parentNode.dataset.quizvalue);
                c++;
            }
        }
        if (c==this.questions.length) { that.calcResult() }
    },
    
    calcResult: function calcResult() {
        results = this.results;
        highest = 0;
        for (var i = 0; i < results.length; i++) {
            results.item(i)["countof"] = 0;
            for (var j = 0; j < this.userAnswers.length; j++) {
                if (this.userAnswers[j] == results.item(i).dataset.quizresult) {
                    results.item(i).countof++;
                }
            }
            console.log(results.item(i).dataset.quizresult+": "+results.item(i).countof);
            if (results.item(i).countof > highest) {
                highest = results.item(i).countof;
                highest_score = results.item(i)
            }
        }
        highest_score.classList.toggle('hidden');
        //disable the inputs after the quiz is finished
        for (var q = 0; q < this.inputs.length; q++) {
            this.inputs.item(q).disabled = true;
        }
    },
    
    addClickEvents: function addClickEvents() {
        var that = this;
        for (var i = 0; i < this.inputs.length; i++) {
            this.inputs.item(i).addEventListener('click', function() {
                that.checkInputs()
            });
        }
    }
}