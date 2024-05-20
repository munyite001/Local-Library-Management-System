const Genre = require("../models/genre")
const Book = require("../models/book")
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator");


// Display list of all Genre
exports.genre_list = asyncHandler(async (req, res, next) => {
    const allGenres = await Genre.find().sort({name: 1}).exec()
    res.render("genre_list", {title: "Genres List", genre_list: allGenres})
})

//  Display detail page of a specific genre
exports.genre_detail = asyncHandler(async (req, res, next) => {
    const [genre, booksInGenre] = await Promise.all([
        Genre.findById(req.params.id),
        Book.find({genre: req.params.id}, "title summary").exec()
    ]);

    if (genre === null) {
        const err = new Error("Genre not found")
        err.status = 404
        return next(err)
    }

    res.render("genre_detail", {title: "Genre Detail", genre: genre, genre_books: booksInGenre})
})

//  Display Genre create form on GET
exports.genre_create_get = (req, res, next) => {
    res.render("genre_form", {title: "Create Genre"})
}

//  Handle Genre create on POST
exports.genre_create_post = [
    //  Vlidate form and sanitize the name field
    body("name", "Genre name must contain at least 3 characters").trim().isLength({min: 3}).escape(),

    //  Process the request after validation and sanitization
    asyncHandler(async (req, res, next) => {

        //  Extract the validation errors from a request
        const errors = validationResult(req);

         // Create a genre object with escaped and trimmed data.
        const genre = new Genre({name: req.body.name})

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages
            res.render("genre_form", {title: "Create Genre", genre: genre, errors: errors.array()})
            return;
        } else {
            //  Data from the form is valid
            //  Check if a genre with the same name exists
            const genreExists = await Genre.findOne({name:req.body.name}).collation({locale: "en", strength: 2}).exec()

            if (genreExists) {
                // Genre exists, redirect to its detail page.
                res.redirect(genreExists.url);
            } else {
                await genre.save()
                //  New Genre Saved Redirect to the genre detail page
                res.redirect(genre.url)
            }
        }

    })
]

//  Display Genre delete form on GET
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
    //  Get details of all books in this genre
    const [genre, allGenreBooks] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Book.find({genre: req.params.id}, "title summary").exec()
    ]);

    //  If genre not found redirect to genre list
    if (genre === null) {
        res.redirect("/catalog/genres")
    }

    res.render("genre_delete", {
        title: "Delete Genre",
        genre: genre,
        genre_books: allGenreBooks
    })
})

//  Handle Genre delete on POST
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
    //  Get details of all books in this genre
    const [genre, allGenreBooks] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Book.find({genre: req.params.id}, "title summary").exec()
    ]);

    if (allGenreBooks.length > 0) {
    //  Genre has books. Render in same way as for GET route
    res.render("genre_delete", {
        title: "Delete Genre",
        genre: genre,
        genre_books: allGenreBooks
    })
      return;  
    } else {
        //  Genre has no books. Delete object and redirect to the list of genres
        await Genre.findByIdAndDelete(req.body.genreid)
        res.redirect("/catalog/genres")
    }
})

//  Display Genre update form on GET
exports.genre_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Genre update GET")
})

//  Handle Genre update on POST
exports.genre_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Genre update POST")
})

