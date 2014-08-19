bf-quiz
==================================================
Pure Javascript/JSON BuzzFeed Quiz Clone

Originally developed for use by the University of Chicago Outreach department.

Demo
----
http://sandbox.bierfeldt.me/quiz/

Features
--------

* Make Quizzes in JSON Files


How to use
----------
Add the JS file to your page, make a JSON Quiz, and add the ``<div id="bf-quiz"></div>`` element to your HTML.

```
  #HTML
  <head>
  ....
  <!-- Include bf-quiz javascript -->
  <script type="text/javascript" src="pathtojs/bf-quiz.js"></script>
  ....
  </head>
  <!-- run quizloader.init with your JSON file on body load -->
  <body onload=BF_QUIZ.quizLoader.init('quiz1.json')>
  
  <!-- Include the bf-quiz div -->
  <div id="bf-quiz"></div>
  ....
```
