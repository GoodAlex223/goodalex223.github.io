// import validator from "validator";

const url = new URL(location.href);
const movieId = url.searchParams.get("id")
const movieTitle = url.searchParams.get("title")

const APILINK = "http://localhost:8000/api/v1/reviews/";

const main = document.getElementById("section");
const title = document.getElementById("title");

title.innerText = movieTitle;

new_review = document.createElement("div")

new_review.innerHTML = `
            <div class="column">
                <div class="row">
                    <div class="card">
                        <h2>Add your review</h2>
                        <label for="review-text">Review:
                            <textarea class="review-input" type="text" name="review-text" id="new-review" placeholder="I think..."></textarea>
                        </label>
                        <label for="user-name">Username:
                            <input class="card-input" type="text" name="user-name" id="new-user">
                        </label>
                        <a href="#" onclick="saveReview('new-review', 'new-user')">Save</a>
                    </div>
                </div>
            </div>
`

main.appendChild(new_review)

returnReviews(APILINK);

function returnReviews(url) {
    fetch(url + "movie/" + movieId).then(res => res.json())
        .then(function (data) {
            console.log(data);
            data.forEach(review => {

                const div_card = document.createElement("div");
                
                div_card.innerHTML = `
                        <div class="row">
                            <div class="column">
                                <div class="card" id="${review._id}">
                                    <h3>Review:</h3>
                                    <p class="review-text">${review.review}</p>
                                    <h3>User:</h3>
                                    <p>${review.user}</p>
                                    <p><a href="#${review._id}" onclick="editReview('${review._id}', '${review.review}', '${review.user}')">Edit</a> <a href="#" onclick="deleteReview('${review._id}')">Delete</a></p>
                                </div>
                            </div>
                        </div>
                `

                main.appendChild(div_card);

            })
        })
}

function editReview(id, review, user) {
    const element = document.getElementById(id);
    const reviewInputId = "review" + id;
    const userInputId = "user" + id;

    element.innerHTML = `
        <p><strong>Review: </strong>
            <textarea type="text" id="${reviewInputId}" rows=${Math.ceil(review.length / 25)}>${review}</textarea>
        </p>
        <p><strong>User: </strong>
            <input class="card-input" type="text" id="${userInputId}" value="${user}">
        </p>
        <p><a href="#" onclick="saveReview('${reviewInputId}', '${userInputId}', '${id}')">Save</a>
        </p>
    `
};

function saveReview(reviewInputId, userInputId, id=null) {
    // add validation here
    const review = document.getElementById(reviewInputId).value;
    const user = document.getElementById(userInputId).value;

    if (id) {
        fetch(APILINK + id, {
            method: "PUT",
            headers: {
                "Accept": 'application/json, text/plain, */*',
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({ "user": user, "review": review })
        }).then(res => res.json())
            .then(res => {
                console.log(res);
                location.reload();
                document.getElementById(reviewInputId).scrollIntoView()
            })
    } else {
        fetch(APILINK + "new", {
            method: "POST",
            headers: {
                "Accept": 'application/json, text/plain, */*',
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({ "user": user, "review": review, "movieId": movieId })
        }).then(res => res.json())
            .then(res => {
                console.log(res);
                location.reload();
                // document.getElementById(reviewInputId).scrollIntoView()
            })
    }

    // fetch(APILINK + id, {
    //     method: "PUT",
    //     headers: {
    //         "Accept": 'application/json, text/plain, */*',
    //         "Content-Type": 'application/json'
    //     },
    //     body: JSON.stringify({"user": user, "review": review})
    // }).then(res => res.json())
    //   .then(res => {
    //       console.log(res);
    //       location.reload();
    //       document.getElementById(reviewInputId).scrollIntoView()
    //    })
};



function deleteReview(id) {
    fetch(APILINK + id, {
        method: "DELETE"
    }).then(res => res.json())
        .then(res => {
            console.log(res);
            location.reload();
        });
};