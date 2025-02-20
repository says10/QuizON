export const gkQuiz={
    questions:[
        {
            question:"Which planet is closest to the Sun?",
        
          choices:[
                         "Venus",
                         "Mercury",
                         "Earth",
                         "Mars",

          ],
          type:"MCQS",
          correctAnswer:"Mercury",
        },

        {
            question:" Which data structure organizes items in a First-In, First-Out (FIFO) manner?",
            choices: [
                "Stack",
                "Queue",
                "Tree",
                 "Graph",
            ],
            type:"MCQS",
            correctAnswer:"Queue",
        },

        {
           question:"Which of the following is primarily used for structuring web pages?",
           choices: [
            "Python",
            "Java",
            "HTML",
            "C++",
            ],
            type:"MCQS",
            correctAnswer:"HTML",
        },

        {
            question:"Which chemical symbol stands for Gold?",

            choices:[
                "Au",
                "Gd",
                "Ag",
                "Pt",
            ],
            type:"MCQS",
            correctAnswer:"Au",
        },

        {
            question:" Which of these processes is not typically involved in refining petroleum?",
            choices: [
                "Fractional Distillation",
                "Cracking",
                "Polymerisation",
                "Filtration",
            ],
            type:"MCQS",
            correctAnswer:"Filtration",
        },
        // Adding input or numerical value based questions
        {
            question:"What is the value of 12+28?",
        
        type:"INPUT",
        correctAnswer:40,
        },

        {
            question:"How many states are there in the United States?",
            type:"INPUT",
            correctAnswer:50,
        },
        {
            question:" In which year was the Declaration of Independence signed?",
            type:"INPUT",
            correctAnswer:1776,
        },
        {
            question:"What is the value of pi rounded to the nearest integer?",
            type:"INPUT",
            correctAnswer:3,
        },
        {
            question:". If a car travels at 60 mph for 2 hours, how many miles does it travel?",
            type:"INPUT",
            correctAnswer:120,
        },
    ]
}

export const resultInitialState={
    score:0,
    correct:0,
    wrongAnswers:0,
    

}