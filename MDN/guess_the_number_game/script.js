const n_user_guess = document.getElementById('user-guess');
const b_restart_game = document.getElementById('restart-game');
const p_prev_guesses = document.getElementById('prev-guesses');
const p_guess_accuracy = document.getElementById('guess-accuracy');
const b_submit = document.getElementById('n-submit');

n_user_guess.focus();

let prev_user_guesses = Array();
// let prev_user_guesses = [1, 2, 3, 4, 5, 6, 7, 8];
let rand_num = rand();


// b_submit.onclick = some;
b_submit.addEventListener("click", checkGuess);
// b_restart_game.onclick = restart;
b_restart_game.addEventListener("click", restart);


function checkGuess() {
    let res;

    n_user_guess.focus();

    if (!n_user_guess.value) {
        p_guess_accuracy.textContent = "Pls, enter your guess";
        p_guess_accuracy.style.backgroundColor = "yellow"
        return
    }

    prev_user_guesses.push(n_user_guess.value);

    // 10 attempts to guess the number
    if (n_user_guess.value == rand_num) {
        res = "right. You win!!!";
        end_game("lightgreen");
        // b_restart_game.focus();

    } else if (prev_user_guesses.length == 10) {
        res = "wrong. You lose( Try again."
        end_game("yellow");

    } else if (n_user_guess.value < rand_num) {
        res = "too low."
        p_guess_accuracy.style.backgroundColor = "lightblue";

    } else {
        res = "too high."
        p_guess_accuracy.style.backgroundColor = "red";
    }

    n_user_guess.value = null;

    p_prev_guesses.textContent = "Previous guesses: " + prev_user_guesses.join(", ");
    p_guess_accuracy.textContent = "Last guess was " + res;

    return
}

/**
 * 
 * @param {string} color
 * @return
 */
function end_game(color) {
    b_submit.disabled = true;
    p_guess_accuracy.style.backgroundColor = color;
    b_restart_game.style.display = "inline";
    b_restart_game.disabled = false;
    b_restart_game.focus();
}

function restart() {
    prev_user_guesses = Array();
    rand_num = rand();

    n_user_guess.value = null;

    p_prev_guesses.textContent = "";

    p_guess_accuracy.textContent = "";
    p_guess_accuracy.style.backgroundColor = "transparent";

    b_submit.disabled = false;

    b_restart_game.style.display = "none";
    b_restart_game.disabled = true;

    n_user_guess.focus();
}

function rand() {
    return Math.floor(Math.random() * 100) + 1
}
