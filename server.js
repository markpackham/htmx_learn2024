import experess from "express";

const app = experess();

// Public folder
app.use(experess.static("public"));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(experess.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(experess.json());

// Routes

// GET users
app.get("/users", async (req, res) => {
  //   const users = [
  //     { id: 1, name: "John Doe" },
  //     { id: 2, name: "Bob Williams" },
  //     { id: 3, name: "Shannon Jackson" },
  //   ];

  // We just add a timeout so we can see the loading animation gif
  setTimeout(async () => {
    // Limit sent via "hx-vals", use 10 if not sent
    // use +req to convert string to number
    const limit = +req.query.limit || 10;

    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users?_limit=${limit}`
    );
    const users = await response.json();

    res.send(`
    <h1 class="text-2xl font-bold my-4">Users</h1>
    <ul>
      ${users.map((user) => `<li>${user.name}</li>`).join("")}
    </ul>
  `);
  }, 2000);
});

// POST request for temp conversion
// http://localhost:3000/temperature.html
app.post("/convert", (req, res) => {
  setTimeout(() => {
    const fahrenheit = parseFloat(req.body.fahrenheit);
    const celsius = (fahrenheit - 32) * (5 / 9);

    res.send(`
        <p>
          ${fahrenheit} degrees Farenheit is equal to ${celsius.toFixed(
      2
    )} degrees Celsius
        </p>
      `);
  }, 2000);
});

// GET request for polling
// http://localhost:3000/polling.html
let counter = 0;

app.get("/poll", (req, res) => {
  counter++;
  const data = { value: counter };

  // Putting json in browser purely for demo purposes
  res.json(data);
});

// GET request for weather
// http://localhost:3000/weather.html
let currentTemperature = 20;

app.get("/weather", (req, res) => {
  // Random temperature change
  currentTemperature += Math.random() * 2 - 1;
  res.send(currentTemperature.toFixed(2) + " degrees Celsius");
});

// POST request for contacts search
// http://localhost:3000/search.html

const contacts = [
  { name: "John Doe", email: "john@example.com" },
  { name: "Jane Doe", email: "jane@example.com" },
  { name: "Alice Smith", email: "alice@example.com" },
  { name: "Bob Williams", email: "bob@example.com" },
  { name: "Mary Harris", email: "mary@example.com" },
  { name: "David Mitchell", email: "david@example.com" },
];

app.post("/search", (req, res) => {
  const searchTerm = req.body.search.toLowerCase();

  if (!searchTerm) {
    return res.send("<tr>Person does not exist</tr>");
  }

  const searchResults = contacts.filter((contact) => {
    const name = contact.name.toLowerCase();
    const email = contact.email.toLowerCase();

    return name.includes(searchTerm) || email.includes(searchTerm);
  });

  // Optional delay just to show off loader with 1 second timeout
  setTimeout(() => {
    const searchResultsHtml = searchResults
      .map(
        (contact) => `<tr>
      <td>
    <div className="my-4 p-2">
    ${contact.name}
    </div>
    </td>
    <td>
    <div className="my-4 p-2">
    ${contact.email}
    </div>
    </td>
    </tr>`
      )
      .join("");
    res.send(searchResultsHtml);
  }, 1000);
});

// POST request for contacts search from jsonplaceholder (very similiar to the one above)
app.post("/search-api", async (req, res) => {
  const searchTerm = req.body.search.toLowerCase();

  if (!searchTerm) {
    return res.send("<tr></tr>");
  }

  const response = await fetch(`https://jsonplaceholder.typicode.com/users`);
  const contacts = await response.json();

  const searchResults = contacts.filter((contact) => {
    const name = contact.name.toLowerCase();
    const email = contact.email.toLowerCase();

    return name.includes(searchTerm) || email.includes(searchTerm);
  });

  setTimeout(() => {
    const searchResultHtml = searchResults
      .map(
        (contact) => `
      <tr>
        <td><div class="my-4 p-2">${contact.name}</div></td>
        <td><div class="my-4 p-2">${contact.email}</div></td>
      </tr>
    `
      )
      .join("");

    res.send(searchResultHtml);
  }, 1000);
});

// POST email validation
// http://localhost:3000/validation.html
app.post("/contact/email", (req, res) => {
  const submittedEmail = req.body.email;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isValid = {
    message: "Email is valid!",
    class: "text-green-700",
  };

  const isInvalid = {
    message: "Email is NOT valid!!!",
    class: "text-red-700",
  };

  // If email not valid replace the entire div
  if (!emailRegex.test(submittedEmail)) {
    res.send(`
    <div class="mb-4" hx-target="this" hx-swap="outerHTML">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="email"
      >Email Address</label
    >
    <input
      name="email"
      hx-post="/contact/email"
      class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
      type="email"
      id="email"
      value="${submittedEmail}"
      required
    />
    <div class="${isInvalid.class}">${isInvalid.message}</div>
  </div>
    `);
  }
  // If email valid
  else {
    return res.send(
      `
      <div class="mb-4" hx-target="this" hx-swap="outerHTML">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="email"
        >Email Address</label
      >
      <input
        name="email"
        hx-post="/contact/email"
        class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
        type="email"
        id="email"
        value="${submittedEmail}"
        required
      />
      <div class="${isValid.class}">${isValid.message}</div>
    </div>
      `
    );
  }
});

// Start server
// http://localhost:3000/
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
