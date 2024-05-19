//  Get the module
const BookInstance = require("../models/bookinstance")
const asyncHandler = require("express-async-handler")

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
    res.send("NOT IMPLEMENTED: BookInstance create GET")
})

// Display BookInstance Create form on POST
exports.bookinstance_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: BookInstance create POST")
})

//  Display BookInstance Delete form on Get
exports.bookinstance_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: BookInstance delete GET")
})

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: BookInstance delete POST")
})

// Display BookInstance update form on GET.
exports.bookinstance_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: BookInstance update GET")
})

// Handle BookInstance update on POST.
exports.bookinstance_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: BookInstance update POST")
})

