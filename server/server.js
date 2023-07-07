const express = require("express");
const cors = require("cors");
const config = require("./config");
const {
    router: passwordResetRoutes,
} = require("./app/routes/password-reset.routes");
const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/static", express.static("app/static"));
app.set("trust proxy", true);

app.get("/", (req, res) => {
    const help = `
      <pre>
        Welcome to the API!
        Use an x-access-token header to work with your own data:
        fetch(url, { headers: { 'x-access-token': 'whatever-you-want' }})
        The following endpoints are available:
      </pre>
    `;

    res.send(help);
});

const baseAPIPath = "/api/v1";
app.use(baseAPIPath, require("./app/routes/signup.routes"));
app.use(baseAPIPath, require("./app/routes/login.routes"));
app.use(baseAPIPath, require("./app/routes/client.routes"));
app.use(baseAPIPath, require("./app/routes/myself.routes"));
app.use(baseAPIPath, passwordResetRoutes);
app.use(baseAPIPath, require("./app/routes/dashboard.routes"));
app.use(baseAPIPath, require("./app/routes/catalog.routes"));
app.use(baseAPIPath, require("./app/routes/patient.routes"));
app.use(baseAPIPath, require("./app/routes/order.routes"));

app.listen(config.port).on("listening", () => {
    console.log(`API is live on ${config.port}`);
});
