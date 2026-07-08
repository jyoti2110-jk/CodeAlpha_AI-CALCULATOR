const display = document.getElementById("display");
const historyList = document.querySelector("#history ul");
const clearHistoryBtn = document.getElementById("clearHistory");
const copyBtn = document.getElementById("copyBtn");
const voiceBtn = document.getElementById("voiceBtn");
const aiMessage = document.getElementById("aiMessage");
let history = JSON.parse(localStorage.getItem("calcHistory")) || [];

function appendValue(value) {

    display.value += value;

    aiMessage.textContent = "🤖 AI Assistant: Building your expression...";

}

function clearDisplay() {

    display.value = "";

    aiMessage.textContent = "🤖 AI Assistant: Screen cleared.";

}

function backspace() {
    display.value = display.value.slice(0, -1);
}

function loadHistory(){

    historyList.innerHTML = "";

    history.forEach(item => {

        const li = document.createElement("li");

        li.textContent = item;

        historyList.appendChild(li);

    });

}

function calculate(){

    if(display.value === ""){

        aiMessage.textContent = "🤖 AI Assistant: Please enter a calculation.";

        return;

    }

    try{

        const expression = display.value;

        const result = eval(expression);


        // Check division by zero

        if(result === Infinity || result === -Infinity){

            display.value = "Error";

            aiMessage.textContent = "🤖 AI Assistant: Cannot divide by zero.";

            return;

        }


        // Check invalid result

        if(Number.isNaN(result)){

            display.value = "Error";

            aiMessage.textContent = "🤖 AI Assistant: Invalid calculation.";

            return;

        }


        // Add calculation to history

        const date = new Date().toLocaleString();


const calculation = `${expression} = ${result} (${date})`;

history.unshift(calculation);


// Save history

localStorage.setItem(
    "calcHistory",
    JSON.stringify(history)
);


loadHistory();


        // Display result

        display.value = result;

        aiMessage.textContent = `🤖 AI Assistant: Answer is ${result}`;

    }


    catch{

        display.value = "Error";

        aiMessage.textContent = "🤖 AI Assistant: Invalid expression.";


        setTimeout(()=>{

            display.value = "";

        },1500);

    }

}

const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("light");

    if(document.body.classList.contains("light")){
        themeBtn.innerHTML = "☀️";
    }else{
        themeBtn.innerHTML = "🌙";
    }

});


// Keyboard Support

document.addEventListener("keydown", (event)=>{

    const key = event.key;


    // Numbers and operators

    if(
        (key >= "0" && key <= "9") ||
        ["+","-","*","/","."].includes(key)
    ){

        appendValue(key);

    }


    // Calculate

    if(key === "Enter"){

        calculate();

    }


    // Delete last character

    if(key === "Backspace"){

        backspace();

        aiMessage.textContent="🤖 AI Assistant: Character removed.";

    }


    // Clear

    if(key === "Escape"){

        clearDisplay();

    }

});

loadHistory();

clearHistoryBtn.addEventListener("click",()=>{


    history=[];


    localStorage.removeItem("calcHistory");


    loadHistory();


    aiMessage.textContent="🤖 AI Assistant: History cleared.";

});

copyBtn.addEventListener("click",()=>{

    navigator.clipboard.writeText(display.value);

    aiMessage.textContent="🤖 AI Assistant: Result copied.";

});

// Voice Calculator

voiceBtn.addEventListener("click",()=>{


const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;


if(!SpeechRecognition){

    aiMessage.textContent =
    "🤖 AI Assistant: Voice not supported in this browser.";

    return;

}


const recognition = new SpeechRecognition();


recognition.start();


aiMessage.textContent =
"🤖 AI Assistant: Listening...";


recognition.onresult = (event)=>{


let speech = event.results[0][0].transcript.toLowerCase();


speech = speech.replace(/plus/g,"+");
speech = speech.replace(/minus/g,"-");
speech = speech.replace(/multiply|times/g,"*");
speech = speech.replace(/divide|divided by/g,"/");


display.value = speech;


aiMessage.textContent =
"🤖 AI Assistant: Processing voice command...";


setTimeout(()=>{

calculate();

},500);


};


recognition.onerror=()=>{

aiMessage.textContent =
"🤖 AI Assistant: Could not understand voice.";

};


});
