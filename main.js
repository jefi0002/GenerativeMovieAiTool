console.log('Thank you for using WebStorm 💙');

let OPENAI_API_KEY = null;

// ----------------------Reset API key immediately when the page loads-----------------//
function requestApiKey() {
    OPENAI_API_KEY = prompt("Enter your API key:");
    if (!OPENAI_API_KEY) {
        console.error("API key not provided! Reload the page to try again.");
    } else {
        console.log("API key set for this session.");
    }
}

// ------------------------ Call function on page reload ---------------------------------///
requestApiKey();

//------------------------------- Container and button const --------------------------------------//
const outputContainer = document.querySelector(".output-container");
const randomMovieButton = document.querySelector(".randomMovie");
const searchMovieButton = document.querySelector(".searchMovie"); // Correctly selected the searchMovie button

//-------------------------------------- Random movie function --------------------------------------//
function randomSuggestion() {
    const randomMovie = document.querySelector(".button"); // Get the button element (or another element you want)
    if (randomMovie) {
        const randomMovieText = randomMovie.textContent;  // Get text of the button
        fetchSuggestion(`${randomMovieText} Generate a random Movie and the camera that is used to film it`);
    } else {
        console.error("The Random movie button not found");
    }
}

//-------------------------------------- Search for movie function --------------------------------------//
function logSuggestion() {
    if (!OPENAI_API_KEY) {
        console.error("API key is not set. Reload the page and provide a key.");
        return;
    }

    const inputValue = document.querySelector("#searchbar").value;
    if (!inputValue.trim()) {
        console.error("Search input is empty. Please enter a movie name.");
        return;
    }

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
            // ---------------- create the new paragraph----------------//
            if (suggestionData && suggestionData.choices && suggestionData.choices.length > 0) {
                const newParagraph = document.createElement("p");
                newParagraph.className = "generated-paragraph";
                newParagraph.textContent = suggestionData.choices[0].message.content;  // Extracting AI's response
                outputContainer.appendChild(newParagraph); // Append paragraph to output container
                console.log("Response from AI:", suggestionData.choices[0].message.content);
            } else {
                console.error("Error: No valid response from AI.");
            }
        })
        .catch(error => console.error('Error:', error));  // Error handling
}

//-------------------------------- Search Movie Button --------------------------------------//
searchMovieButton.addEventListener("click", () => {
    logSuggestion(); // Call the logSuggestion function when searchMovieButton is clicked
});

//-------------------------------- Random Movie Button --------------------------------------//
randomMovieButton.addEventListener("click", () => {
    if (!OPENAI_API_KEY) {
        console.error("API key is not set. Reload the page and provide a key.");
        return;
    }

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
                content: `Give me a new random movie of the imdb list top 100 and the camera that is used. Only log title name and camera name + lens that is used`
            }],
            temperature: 0.7,  // Optional: Controls randomness of responses
            max_tokens: 150
        })
    })
        .then(response => response.json())
        .then(suggestionData => {
            // ------------ Create the new paragraph----------//
            if (suggestionData && suggestionData.choices && suggestionData.choices.length > 0) {
                const newParagraph = document.createElement("p");
                newParagraph.className = "generated-paragraph";
                newParagraph.textContent = suggestionData.choices[0].message.content;  // Extracting AI's response
                outputContainer.appendChild(newParagraph);  // Append paragraph to the output container
                console.log("Response from AI:", suggestionData.choices[0].message.content);
            } else {
                console.error("Error in response data:", suggestionData);
            }
        })
        .catch(error => console.error('Error:', error));  // Error handling
});
