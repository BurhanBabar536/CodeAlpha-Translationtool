 

const inputText    = document.getElementById('input-text');     
const outputText   = document.getElementById('output-text');     
const sourceLang   = document.getElementById('source-lang');     
const targetLang   = document.getElementById('target-lang');     
const translateBtn = document.getElementById('translate-btn');   
const copyBtn      = document.getElementById('copy-btn');       
const speakBtn     = document.getElementById('speak-btn');      
const clearBtn     = document.getElementById('clear-btn');      
const statusMsg    = document.getElementById('status-message');  


/ 

async function translateText() {

     const text = inputText.value.trim();  

     if (text === '') {
        showStatus('Please enter some text first!', 'red');
        return;  
    }

     
    const from = sourceLang.value; 
    const to   = targetLang.value;  

     if (from === to) {
        showStatus('Source and target language are the same!', 'red');
        return;
    }

     showStatus('Translating...', 'gray');

     translateBtn.disabled = true;

    try {
        
        const langPair = `${from}|${to}`;
        const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;

        
        const response = await fetch(apiUrl);

        // If the internet request itself failed
        if (!response.ok) {
            throw new Error('Network error. Check your internet connection.');
        }

         const data = await response.json();

         if (data.responseStatus === 200) {
             outputText.value = data.responseData.translatedText;
            showStatus('Translation complete!', 'green');
        } else {
             throw new Error(data.responseDetails || 'Translation failed.');
        }

    } catch (error) {
         showStatus('Error: ' + error.message, 'red');
        outputText.value = '';
    }

     translateBtn.disabled = false;
}


 

function copyTranslation() {
    const text = outputText.value.trim();

     if (text === '') {
        showStatus('Nothing to copy yet!', 'red');
        return;
    }

     navigator.clipboard.writeText(text)
        .then(() => {
            showStatus('Copied to clipboard!', 'green');
        })
        .catch(() => {
            showStatus('Could not copy. Try manually selecting the text.', 'red');
        });
}


 

function speakTranslation() {
    const text = outputText.value.trim();

    // Nothing to speak if output is empty
    if (text === '') {
        showStatus('Nothing to speak yet!', 'red');
        return;
    }

    // Create a new speech object
    const speech = new SpeechSynthesisUtterance();

    // Set the text to read aloud
    speech.text = text;

    // Set the language so the voice matches (e.g. "ur" for Urdu)
    speech.lang = targetLang.value;

    // Set a comfortable speed (1 = normal, 0.8 = slightly slower)
    speech.rate = 0.9;

    // Stop any speech already playing, then start new one
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);

    showStatus('Speaking...', 'gray');
}


 
function clearAll() {
    inputText.value  = '';  // Clear the input box
    outputText.value = '';  // Clear the output box
    showStatus('', '');     // Clear the status message

     window.speechSynthesis.cancel();

     inputText.focus();
}


 

function showStatus(message, color) {
    statusMsg.textContent = message;

     if (color === 'green') {
        statusMsg.style.color = '#10b981'; // Green for success
    } else if (color === 'red') {
        statusMsg.style.color = '#ef4444'; // Red for errors
    } else {
        statusMsg.style.color = '#6b7280'; // Gray for info
    }
}




translateBtn.addEventListener('click', translateText);
copyBtn.addEventListener('click', copyTranslation);
speakBtn.addEventListener('click', speakTranslation);
clearBtn.addEventListener('click', clearAll);


 

inputText.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'Enter') {
        translateText();
    }
});