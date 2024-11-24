console.log('Thank you for using WebStorm 💙');

function resetApiKey() {
    localStorage.removeItem("OPENAI_API_KEY");
    OPENAI_API_KEY = prompt("Put in new API key:");
    if (OPENAI_API_KEY) {
        localStorage.setItem("OPENAI_API_KEY", OPENAI_API_KEY);
        console.log("API key updated successfully.");
    } else {
        console.error("API key not provided!");
    }
}


// Check if the API key is already stored
let OPENAI_API_KEY = localStorage.getItem("OPENAI_API_KEY");

if (!OPENAI_API_KEY) {
    // If not found, prompt the user to input the API key
    OPENAI_API_KEY = prompt("Put in API key:");
    if (OPENAI_API_KEY) {
        localStorage.setItem("OPENAI_API_KEY", OPENAI_API_KEY);
    } else {
        console.error("API key not provided!");
    }
} else {
    console.log("API key loaded from localStorage.");
}

console.log("Your API key is:", OPENAI_API_KEY);


// Få inpout fra search
function randomSuggestion() {
    const randomMovie = document.querySelector(".button"); // Get the button element (or another element you want)
    if (randomMovie) {
        const randomMovieText = randomMovie.textContent;  // Get text of the button
        fetchSuggestion(`${randomMovieText} Generate a random Movie and the camera that is used to film it`);
    } else {
        console.error("Random movie button not found");
    }
}

const outputContainer = document.querySelector(".output-container");
const randomMovieButton = document.querySelector(".randomMovie");

//-------------------------------------- Search for movie --------------------------------------//
function logSuggestion() {
    const inputValue = document.querySelector("#searchbar").value;
    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{
                role: 'user',
                content: `${inputValue} What camera is used and only give me the camera details`
            }],
            temperature: 0.7,  // Optional: Controls randomness of responses
            max_tokens: 150
        })
    })
        .then(response => response.json())
        .then(suggestionData => {
            // Now that suggestionData is available, create the new paragraph
            if (suggestionData && suggestionData.choices && suggestionData.choices.length > 0) {
                const newParagraph = document.createElement("p");
                newParagraph.className = "generated-paragraph";
                newParagraph.textContent = suggestionData.choices[0].message.content;  // Extracting AI's response
                outputContainer.appendChild(newParagraph);// Appending paragraph to the body (or another element of your choice)
                console.log("Response from AI:", suggestionData.choices[0].message.content);
            } else {
                console.error("Error in response data:", suggestionData);
            }
        })
        .catch(error => console.error('Error:', error));  // Error handling

}

//-------------------------------------- Random Movie Button --------------------------------------//
randomMovieButton.addEventListener("click", () => {
    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{
                role: 'user',
                content: `Give me a random movie of the imdb list top 100 and the camera that is used. Only log title name and camera name + lens that is used`
            }],
            temperature: 0.7,  // Optional: Controls randomness of responses
            max_tokens: 150
        })
    })
        .then(response => response.json())
        .then(suggestionData => {
            // Now that suggestionData is available, create the new paragraph
            if (suggestionData && suggestionData.choices && suggestionData.choices.length > 0) {
                const newParagraph = document.createElement("p");
                newParagraph.textContent = suggestionData.choices[0].message.content;  // Extracting AI's response
                document.body.appendChild(newParagraph);  // Appending paragraph to the body (or another element of your choice)
                console.log("Response from AI:", suggestionData.choices[0].message.content);
            } else {
                console.error("Error in response data:", suggestionData);
            }
        })
        .catch(error => console.error('Error:', error));  // Error handling
});


// Attach the function to the button
function getSuggestions() {
    logSuggestion();  // Call the logSuggestion function when the button is clicked
}

// Adding a button for resetting the API key in the UI
const resetButton = document.createElement("button");
resetButton.textContent = "Reset API Key";
resetButton.addEventListener("click", resetApiKey);
document.body.appendChild(resetButton);