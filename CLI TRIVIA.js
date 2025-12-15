const readline = require('readline');

const kenyaQuestions = [
    {
        question: "What is the capital city of Kenya?",
        choices: ["Mombasa", "Nairobi", "Kisumu", "Nakuru"],
        answer: 1,
        category: "Geography"
    },
    {
        question: "Which mountain is the highest in Kenya?",
        choices: ["Mount Elgon", "Mount Kenya", "Mount Kilimanjaro", "Mount Longonot"],
        answer: 1,
        category: "Geography"
    },
    {
        question: "What is the official language of Kenya?",
        choices: ["Swahili", "English", "Kikuyu", "Swahili and English"],
        answer: 3,
        category: "Culture"
    },
    {
        question: "Which lake in Kenya is famous for flamingos?",
        choices: ["Lake Victoria", "Lake Nakuru", "Lake Naivasha", "Lake Turkana"],
        answer: 1,
        category: "Wildlife"
    },
    {
        question: "In which year did Kenya gain independence?",
        choices: ["1957", "1960", "1963", "1965"],
        answer: 2,
        category: "History"
    }
];

const game = {
    score: 0,
    currentQuestion: 0,
    timeLeft: 15,
    timer: null,
    playing: false,
    totalTime: 0
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function showWelcome() {
    console.clear();
    console.log("=== KENYA TRIVIA GAME ===");
    console.log("\nTest your knowledge about Kenya!");
    console.log("\nRules:");
    console.log("- You have 15 seconds per question");
    console.log("- Type 1, 2, 3, or 4 to answer");
    console.log("- Try to get all questions right!\n");
}

function startGame() {
    game.score = 0;
    game.currentQuestion = 0;
    game.playing = true;
    game.totalTime = 0;
    
    console.log("Game starting...\n");
    
    askQuestion();
}

function askQuestion() {
    if (!game.playing || game.currentQuestion >= kenyaQuestions.length) {
        endGame();
        return;
    }
    
    const q = kenyaQuestions[game.currentQuestion];
    
    console.log(`Question ${game.currentQuestion + 1}/${kenyaQuestions.length}`);
    console.log(`Category: ${q.category}`);
    console.log(`\n${q.question}\n`);
    
    q.choices.forEach((choice, index) => {
        console.log(`${index + 1}. ${choice}`);
    });
    
    console.log(`\nTime: ${game.timeLeft} seconds`);
    
    startTimer();
    
    rl.question("\nYour answer: ", checkAnswer);
}

function startTimer() {
    game.timeLeft = 15;
    
    if (game.timer) {
        clearInterval(game.timer);
    }
    
    game.timer = setInterval(() => {
        game.timeLeft--;
        
        if (game.timeLeft <= 0) {
            clearInterval(game.timer);
            console.log("\nTime's up!");
            showCorrectAnswer();
            nextQuestion();
        }
    }, 1000);
}

function checkAnswer(input) {
    clearInterval(game.timer);
    
    const userAnswer = parseInt(input);
    const q = kenyaQuestions[game.currentQuestion];
    
    if (isNaN(userAnswer) || userAnswer < 1 || userAnswer > 4) {
        console.log("\nPlease enter a number between 1 and 4");
        askQuestion();
        return;
    }
    
    if (userAnswer === q.answer + 1) {
        game.score++;
        console.log("\nCorrect! Well done!");
    } else {
        console.log("\nWrong answer!");
        console.log(`The correct answer is: ${q.answer + 1}. ${q.choices[q.answer]}`);
    }
    
    showScore();
    nextQuestion();
}

function showCorrectAnswer() {
    const q = kenyaQuestions[game.currentQuestion];
    console.log(`The correct answer is: ${q.answer + 1}. ${q.choices[q.answer]}`);
}

function showScore() {
    const percent = Math.round((game.score / (game.currentQuestion + 1)) * 100);
    console.log(`Score: ${game.score}/${game.currentQuestion + 1} (${percent}%)\n`);
}

function nextQuestion() {
    setTimeout(() => {
        game.currentQuestion++;
        if (game.currentQuestion < kenyaQuestions.length) {
            askQuestion();
        } else {
            endGame();
        }
    }, 2000);
}

function endGame() {
    game.playing = false;
    
    console.log("\n=== GAME OVER ===");
    console.log(`Final score: ${game.score}/${kenyaQuestions.length}`);
    
    const percent = Math.round((game.score / kenyaQuestions.length) * 100);
    
    if (percent === 100) {
        console.log("Perfect! You know Kenya very well!");
    } else if (percent >= 80) {
        console.log("Excellent! You're almost an expert!");
    } else if (percent >= 60) {
        console.log("Good job! You know a lot about Kenya!");
    } else if (percent >= 40) {
        console.log("Not bad! Keep learning!");
    } else {
        console.log("Keep exploring Kenya's rich culture!");
    }
    
    const geographyQuestions = kenyaQuestions.filter(q => q.category === "Geography");
    const cultureQuestions = kenyaQuestions.filter(q => q.category === "Culture");
    
    console.log(`\nGame stats:`);
    console.log(`- Geography questions: ${geographyQuestions.length}`);
    console.log(`- Culture questions: ${cultureQuestions.length}`);
    
    const allCategories = kenyaQuestions.map(q => q.category);
    console.log(`- All categories: ${allCategories.join(", ")}`);
    
    rl.question("\nPlay again? (yes/no): ", (answer) => {
        if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
            startGame();
        } else {
            console.log("\nAsante sana for playing! Goodbye!");
            rl.close();
        }
    });
}

function main() {
    showWelcome();
    
    rl.question("Press ENTER to start: ", () => {
        startGame();
    });
    
    process.on('SIGINT', () => {
        console.log("\n\nGame stopped. Kwaheri!");
        rl.close();
        process.exit(0);
    });
}

main();