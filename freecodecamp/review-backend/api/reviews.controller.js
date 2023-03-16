import RevirewsDAO from "../dao/reviewsDAO.js";

export default class ReviewsController {
    static async apiPostReview(req, res, next) {
        try {
            const movieId = parseInt(req.body.movieId);
            const review = req.body.review;
            const user = req.body.user;

            const reviewResponse = await RevirewsDAO.addReview(
                movieId,
                user,
                review
            );
            res.json({ status: "success" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        };
    };

    static async apiGetReview(req, res, next) {
        try {
            let reviewId = req.params.id || {};
            let review = await RevirewsDAO.getReview(reviewId);
            if (!review) {
                res.status(404).json({ error: "Not found" });
                return;
            };
            res.json(review);
        } catch (err) {
            console.log(`api, ${err}`);
            res.status(500).json({ error: err });
        };
    };

    static async apiUpdateReview(req, res, next) {
        try {
            const reviewId = req.params.id;
            const review = req.body.review;
            const user = req.body.user;

            const reviewResponse = await RevirewsDAO.updateReview(
                reviewId,
                user,
                review
            );

            var { error } = reviewResponse
            if (error) {
                res.status(400).json({ error });
            };

            if (reviewResponse.modifiedContent === 0) {
                throw new Error(
                    "unable to update review",
                );
            };

            res.json({ status: "success" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        };
    };

    static async apiDeleteReview(req, res, next) {
        try {
            const reviewId = req.params.id;
            const reviewResponse = await RevirewsDAO.deleteReview(reviewId);
            res.json({ status: "success" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        };
    }

    static async apiGetReviews(req, res, next) {
        try {
            let movieId = req.params.id || {};
            let reviews = await RevirewsDAO.getReviewsByMovieId(movieId);
            if (!reviews) {
                res.status(404).json({ error: "Not found" });
                return;
            }
            res.json(reviews);
        } catch (err) { 
            console.log(`api, ${err}`);
            res.status(500).json({ error: err });
        };
    };
}