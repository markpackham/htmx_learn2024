import experess from "express";

const app = experess();

// Public folder
app.use(experess.static("public"));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(experess.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(experess.json());

// Start server
// http://localhost:3000/
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
