
const readline = require('readline');

const questions = [
    {
        question: "What is the capital of France?",
        choices: ["London", "Berlin", "Paris", "Madrid"],
        answer: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        choices: ["Venus", "Mars", "Jupiter", "Saturn"],
        answer: 1
    },
    {
        question: "What is the largest mammal?",
        choices: ["Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
        answer: 1
    },
    {
        question: "Who painted the Mona Lisa?",
        choices: ["Van Gogh", "Picasso", "Da Vinci", "Michelangelo"],
        answer: 2
    },
    {
        question: "What is the chemical symbol for gold?",
        choices: ["Go", "Gd", "Au", "Ag"],
        answer: 2
    }
];

const game = {
    score: 0,
    currentQuestion: 0,
    timeLeft: 10,
    timer: null,
    playing: false
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function showWelcome() {
    console.clear();
    console.log("=== TRIVIA GAME ===");
    console.log("\nHow to play:");
    console.log("- You have 10 seconds per question");
    console.log("- Type 1, 2, 3, or 4 to answer");
    console.log("- Try to get the highest score!\n");
}

function startGame() {
    game.score = 0;
    game.currentQuestion = 0;
    game.playing = true;
    
    console.log("Game starting...\n");
    
    askQuestion();
}

function askQuestion() {
    if (!game.playing || game.currentQuestion >= questions.length) {
        endGame();
        return;
    }
    
    const q = questions[game.currentQuestion];
    
    console.log(`Question ${game.currentQuestion + 1}/${questions.length}`);
    console.log(`\n${q.question}\n`);
    
    q.choices.forEach((choice, index) => {
        console.log(`${index + 1}. ${choice}`);
    });
    
    console.log(`\nTime: ${game.timeLeft} seconds`);
    
    startTimer();
    
    rl.question("\nYour answer: ", checkAnswer);
}

function startTimer() {
    game.timeLeft = 10;
    
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
    
    const choice = parseInt(input);
    const q = questions[game.currentQuestion];
    
    if (choice === q.answer + 1) {
        game.score++;
        console.log("\n✓ Correct!");
    } else {
        console.log("\n✗ Wrong!");
        console.log(`Correct answer: ${q.answer + 1}. ${q.choices[q.answer]}`);
    }
    
    showScore();
    nextQuestion();
}

function showCorrectAnswer() {
    const q = questions[game.currentQuestion];
    console.log(`Correct answer: ${q.answer + 1}. ${q.choices[q.answer]}`);
}

function showScore() {
    const percent = Math.round((game.score / (game.currentQuestion + 1)) * 100);
    console.log(`Score: ${game.score}/${game.currentQuestion + 1} (${percent}%)\n`);
}

function nextQuestion() {
    setTimeout(() => {
        game.currentQuestion++;
        if (game.currentQuestion < questions.length) {
            askQuestion();
        } else {
            endGame();
        }
    }, 2000);
}

function endGame() {
    game.playing = false;
    
    console.log("\n=== GAME OVER ===");
    console.log(`Final score: ${game.score}/${questions.length}`);
    
    const percent = Math.round((game.score / questions.length) * 100);
    
    if (percent === 100) {
        console.log("Perfect! You're amazing!");
    } else if (percent >= 80) {
        console.log("Great job!");
    } else if (percent >= 60) {
        console.log("Good work!");
    } else {
        console.log("Keep practicing!");
    }
    
    const easyQuestions = questions.filter(q => {
        const easyWords = ["capital", "planet", "largest"];
        return easyWords.some(word => q.question.includes(word));
    });
    
    const hardQuestions = questions.filter(q => {
        const hardWords = ["painted", "chemical"];
        return hardWords.some(word => q.question.includes(word));
    });
    
    console.log(`\nGame stats:`);
    console.log(`- Easy questions: ${easyQuestions.length}`);
    console.log(`- Hard questions: ${hardQuestions.length}`);
    
    rl.question("\nPlay again? (yes/no): ", (answer) => {
        if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
            startGame();
        } else {
            console.log("\nThanks for playing!");
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
        console.log("\n\nGame stopped. Goodbye!");
        rl.close();
        process.exit(0);
    });
}

main();