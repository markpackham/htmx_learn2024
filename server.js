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

// Start server
// http://localhost:3000/
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
