//  Get the module
const BookInstance = require("../models/bookinstance")
const Book = require("../models/book")
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator")

//  Display a list of all book instances
exports.bookinstance_list = asyncHandler(async (req, res, next) => {
    const allBookInstances = await BookInstance.find().populate("book").exec()

    res.render("bookinstance_list", {title: "Book Instance List", bookinstance_list: allBookInstances})
})

//  Display details of an individual book instance
exports.bookinstance_detail = asyncHandler(async (req, res, next) => {
    const bookInstance = await BookInstance.findById(req.params.id).populate("book").exec();

    if (bookInstance == null)
    {
        const err = new Error("Book Copy not found")
        err.status = 404;
        return next(err)
    }

    res.render("bookinstance_detail", {title: "Book: ", bookinstance: bookInstance})
})

// Display BookInstance create form on GET.
exports.bookinstance_create_get = asyncHandler(async (req, res, next) => {
    const allBooks = await Book.find({}, "title").sort({title: 1}).exec()

    res.render("bookinstance_form", {
        title: "Create BookInstance", 
        book_list: allBooks
    })
})



// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
    // Validate and sanitize fields.
    body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
    body("imprint", "Imprint must be specified")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("status").escape(),
    body("due_back", "Invalid date")
      .optional({ values: "falsy" })
      .isISO8601()
      .toDate(),
  
    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create a BookInstance object with escaped and trimmed data.
      const bookInstance = new BookInstance({
        book: req.body.book,
        imprint: req.body.imprint,
        status: req.body.status,
        due_back: req.body.due_back,
      });
  
      if (!errors.isEmpty()) {
        // There are errors.
        // Render form again with sanitized values and error messages.
        const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec();
  
        res.render("bookinstance_form", {
          title: "Create BookInstance",
          book_list: allBooks,
          selected_book: bookInstance.book._id,
          errors: errors.array(),
          bookinstance: bookInstance,
        });
        return;
      } else {
        // Data from form is valid
        await bookInstance.save();
        res.redirect(bookInstance.url);
      }
    }),
];
  

//  Display BookInstance Delete form on Get
exports.bookinstance_delete_get = asyncHandler(async (req, res, next) => {
    const bookInstance = await BookInstance.findById(req.params.id).populate("book").exec()

    if (bookInstance == null) {
        res.redirect("/catalog/bookinstances")
    }

    res.render("bookinstance_delete", {
      title: "Delete Book Instance", 
      bookinstance: bookInstance
    })
})

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = asyncHandler(async (req, res, next) => {
    await BookInstance.findByIdAndDelete(req.body.bookinstanceid).exec()
    res.redirect("/catalog/bookinstances")
})

// Display BookInstance update form on GET.
exports.bookinstance_update_get = asyncHandler(async (req, res, next) => {
    //  Get book instance details and all books
    const [bookInstance, allBooks] = await Promise.all([
      BookInstance.findById(req.params.id).populate("book").exec(),
      Book.find({}, "title").exec(),
    ])
    res.render("bookinstance_form", {
      title: "Update Book Instance",
      bookinstance: bookInstance,
      book_list: allBooks
    })
})

// Handle BookInstance update on POST.
exports.bookinstance_update_post = [
  //  Validate and sanitize fields
  body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
    body("imprint", "Imprint must be specified")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("status").escape(),
    body("due_back", "Invalid date")
      .optional({ values: "falsy" })
      .isISO8601()
      .toDate(),
    
    //  Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
      //  Extract the validation errors from a request
      const errors = validationResult(req);

      //  Create a BookInstance object with escaped and trimmed data
      const bookInstance = new BookInstance({
        book: req.body.book,
        imprint: req.body.imprint,
        status: req.body.status,
        due_back: req.body.due_back,
      });

      if (!errors.isEmpty()) {
        //  There are errors
        //  Render form again with sanitized values and error messages
        const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec();

        res.render("bookinstance_form", {
          title: "Update Book Instance",
          book_list: allBooks,
          selected_book: bookInstance.book._id,
          errors: errors.array(),
          bookinstance: bookInstance,
        });
        return;
      } else {
        //  Data from form is valid
        await BookInstance.findByIdAndUpdate(req.params.id, bookInstance, {});
        res.redirect(bookInstance.url);
      }
    })
]

