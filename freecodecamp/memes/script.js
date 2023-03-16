// https://youtu.be/zJSY8tbf_ys?t=46248 project
const TOKEN1 = "91VhuLXFxiv+bX2KDZGiDg==p7WkNX0Z4CPbVLzK" // api-ninjas.com your token
const MEMEAPILINK = "https://meme-api.com/gimme/50";
const JOKEAPILINK = "https://v2.jokeapi.dev/joke/Any?type=single&amount=10"
const QUOTEAPILINK = "https://api.api-ninjas.com/v1/quotes?limit=10"
const RIDDLEAPILINK = "https://api.api-ninjas.com/v1/riddles?limit=20"


let memeArray = Array(0);
let jokeArray = Array(0);
let quoteArray = Array(0);
let riddleArray = Array(0);
let riddle;


const memeSection = document.getElementById("meme-s");
const jokeSection = document.getElementById("joke-s")
const quoteSection = document.getElementById("quote-s");
const riddleSection = document.getElementById("riddle-s");
const riddleAnswerBtn = document.getElementById("riddle-answer-btn")



async function returnMemes(url) {
    return fetch(url).then(res => res.json())
        .then(res_json => res_json.memes)
}

async function returnJokes(url) {
    return fetch(url, undefined).then(res => res.json())
        .then(res_json => res_json.jokes)
}

async function returnQuotes(url) {
    return fetch(url, {
        method: 'GET',
        headers: {
            'X-Api-Key': TOKEN1,
        }
    }).then(res => res.json())
}

async function returnRiddles(url) {
    return fetch(url, {
        method: 'GET',
        headers: {
            'X-Api-Key': TOKEN1,
        }
    }).then(res => res.json())
}



async function returnItem(arr, returnFunc, apiLink) {
    if (arr.length == 0) {
        arr = await returnFunc(apiLink);
    }
    return arr.pop()
}



async function clearAll() {
    if (memeSection.innerHTML) {
        memeSection.innerHTML = "";
        console.log("Cleared img")
        return
    }

    if (jokeSection.innerHTML) {
        jokeSection.innerHTML = "";
        console.log("Cleared joke")
        return
    }

    if (quoteSection.innerHTML) {
        quoteSection.innerHTML = "";
        console.log("Cleared quote")
        return
    }

    if (riddleSection.innerHTML) {
        riddleSection.innerHTML = "";
        riddleAnswerBtn.style.display = "none";
        console.log("Cleared riddle")
        return
    }
}


async function showMeme() {
    // https://github.com/D3vd/Meme_Api
    await clearAll()
    const meme = await returnItem(memeArray, returnMemes, MEMEAPILINK)
    memeSection.innerHTML = `
    <a href="${meme.postLink}" target="_blank"><img src="${meme.url}"></a>
    `
}

async function showJoke() {
    // https://jokeapi.dev/
    await clearAll()
    const joke = await returnItem(jokeArray, returnJokes, JOKEAPILINK)
    jokeSection.innerHTML = `<p>${joke.joke}</p>`
}

async function showQuote() {
    // https://api-ninjas.com/api/quotes
    await clearAll()
    const quote = await returnItem(quoteArray, returnQuotes, QUOTEAPILINK)
    quoteSection.innerHTML = `<p>${quote.quote}</p><p>${"- " + quote.author}</p>`
}

async function showRiddle() {
    // https://api-ninjas.com/api/riddles
    await clearAll()
    riddle = await returnItem(riddleArray, returnRiddles, RIDDLEAPILINK)
    riddleSection.innerHTML = `<p>${riddle.title}</p><p>${riddle.question}</p>`
    riddleAnswerBtn.style.display = "block"
}

async function showRiddleAnswer() {
    if (riddleSection.children.length != 3) {
        const riddleAnwer = document.createElement("p")
        riddleAnwer.textContent = riddle.answer
        riddleSection.appendChild(riddleAnwer)
    }
}