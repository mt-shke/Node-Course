```js
// Globals - no window
// __dirname => path to current directory
// __filename => file name
// require => function to use modules (commonJs)
// module => info about current module (file)
// process => info about env where the program is being executed
```

## I - Intro

<details>
<summary>Node Basics</summary>

```js

```

<details>
<summary>Node CLI</summary>

```js
const amount = 12;

if (amount < 12) {
	console.log("small number");
} else console.log("large number");
```

```bash
...path node file.js

output : 'large number'
```

</details>

<details>
<summary>__dirname</summary>

```js
console.log(__dirname);
// node file.js =>  output: path to file
```

</details>

<details>
<summary>module.exports / require</summary>

3-modules

```js
const names = require("./4-name");
const sayHi = require("./5-utils");
const data = require("./6- alt-module-export");
require("./7- mind-grenade");
sayHi(names.john);
sayHi(names.peter);

// cli node '.\3- modules.js' => output: 'require function , hello john, hello peter etc...'
// => require("./7- mind-grenade"); autoCall function called in module
```

4-name.js

```js
const john = "john";
const peter = "peter";

module.exports = { john, peter };
```

5-utils.js

```js
const sayHi = (name) => {
	console.log(`Hello ${name}`);
};

module.exports = sayHi;
// export default sayHi
```

6-alt-module-export

```js
// DIFFERENT WAY OF EXPORTING
// const items = ["item1", "item2"];
// module.exports = {items}
module.exports.items = ["item1", "item2"];

const person = {
	name: "bob",
};

module.exports.singlePerson = person;
```

</details>

<details>
<summary>Os Module</summary>

```js
const user = os.userInfo();

// method returns the system uptime in secondes
console.log(`THe system uptime is ${os.uptime()} seconds`);

const currentOS = {
	name: os.type(),
	release: os.release(),
	totalMem: os.totalmem(),
	freeMem: os.freemem(),
};
```

</details>

<details>
<summary>Path and module</summary>

```js
const filePath = path.join("/content", "subfolder", "test.txt");
const base = path.basename(filePath);
const absolute = path.resolve(__dirname, "content", "subfolder", "test.txt");
```

</details>

<details>
<summary>readFileSync, writeFileSync,  { flag: "a" }</summary>

```js
const { readFileSync, writeFileSync } = require("fs");

const first = readFileSync("./content/first.txt", "utf8");
const second = readFileSync("./content/second.txt", "utf8");

writeFileSync("./content/result-sync.txt", `Here is the result: ${first}, ${second}`, { flag: "a" });
// get fileData and rewrite in result-sync.txt
// {flag : 'a'} => save old text, if not => erase and write again
```

</details>

<details>
<summary>async readFile</summary>

```js
const { readFile, writeFile } = require("fs");

readFile("./content/first.txt", "utf8", (err, result) => {
	// read content
	if (err) {
		console.log(err);
		return;
	}

	const first = result;
	readFile("./content/second.txt", "utf8", (err, result) => {
		if (err) {
			console.log(err);
			return;
		}

		const second = result;
		writeFile("./content/result-async.txt", `Here is the result: ${first}, ${second}`, (err, result) => {
			if (err) {
				return;
			}
			console.log(result);
		});
	});
});
```

</details>

## II - NPM

<details>
<summary>Package.json, script cmd, nodemon, devDependencies</summary>

```js
const _ = require("lodash");

const items = [1, [2, [3, [4]]]];

const newItems = _.flattenDeep(items);

console.log(newItems);
console.log("hello");

// npm i nodemon -D
// devDependencies
```

````json
{
	"name": "tutorial-nodejs",
	"version": "1.0.0",
	"description": "```js\r // Globals - no window",
	"main": "index.js",
	"scripts": {
		"start": "nodemon app.js",
		"dev": "nodemon app.js"
	},
	"keywords": [],
	"author": "",
	"license": "ISC",
	"dependencies": {
		"lodash": "^4.17.21"
	},
	"devDependencies": {
		"nodemon": "^2.0.15"
	}
}

// npm start
// npm run dev
````

</details>

## III - Event loop, Async patterns, Events - Main concepts - Pre-build code

<details>
<summary>require('http')</summary>

```js
const http = require("http");

const server = http.createServer((req, res) => {
	// res.writeHead(200, { "content-type": "text/plain" });

	res.writeHead(200, { "content-type": "text/html" });
	res.write("<p>Hey this is my response</p>");
	res.end();
});

server.listen(5000);
```

```js
const http = require("http");
const { readFileSync } = require("fs");

const homePage = readFileSync("./navbar-app/index.html");
const homeStyles = readFileSync("./navbar-app/styles.css");
const homeImage = readFileSync("./navbar-app/logo.svg");
const homeLogic = readFileSync("./navbar-app/browser-app.js");

const server = http.createServer((req, res) => {
	// res.writeHead(200, { "content-type": "text/plain" });

	const url = req.url;
	console.log(url);

	if (url === "/") {
		res.writeHead(200, { "content-type": "text/html" });
		res.write(homePage);
		res.end();
	} else if (url === "/styles.css") {
		res.writeHead(200, { "content-type": "text/css" });
		res.write(homeStyles);
		res.end();
	} else if (url === "/logo.svg") {
		res.writeHead(200, { "content-type": "image/svg+xml" });
		res.write(homeImage);
		res.end();
	} else if (url === "/browser-app.js") {
		res.writeHead(200, { "content-type": "text/javascript" });
		res.write(homeLogic);
		res.end();
	} else {
		res.writeHead(404, { "content-type": "text/html" });
		res.write("<h1>Page not found</h1>");
		res.end();
	}
});

server.listen(5000);
```

</details>

</details>

## II - Express

<details>
<summary>Express - Basics</summary>

<details>
<summary>Intro - App - use - all</summary>

```js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
	console.log("home page hitted");
	res.status(200).send("Home Page express");
});

app.get("/about", (req, res) => {
	res.status(200).send("About page this is");
});

app.all("*", (req, res) => {
	res.status(404).send("<h1>page not found not found really</h1>");
});

app.listen(5000, () => {
	console.log("Server is listening on port 5000");
});
```

```js
const express = require("express");
const path = require("path");

const app = express();

// use = setupMiddleware
app.use(express.static("./public"));

// app.get("/", (req, res) => {
// 	res.sendFile(path.resolve(__dirname, "./navbar-app/index.html"));
// });

app.all("*", (req, res) => {
	res.status(404).send("not found");
});

app.listen(5000, () => {
	console.log("server listening");
});
```

</details>

<details>
<summary>api params & query</summary>

```js
const express = require("express");
const app = express();
const { products } = require("./data");

app.get("/", (req, res) => {
	res.send(`<h1>Home Page</h1><a href='/api/products'>products</a>`);
});

app.get("/api/products", (req, res) => {
	const newProducts = products.map((product) => {
		const { id, name, image } = product;
		return { id, name, image };
	});
	res.json(newProducts);
});

app.get("/api/products/:productID", (req, res) => {
	// console.log(req.params);
	const { productID } = req.params;
	const singleProduct = products.find((product) => product.id === Number(productID));
	if (!singleProduct) {
		res.status(404).send("Product does not exist");
	}
	res.json(singleProduct);
});

app.get("/api/products/:productID/reviews/:reviewID", (req, res) => {
	res.send("hello world");
});

app.get("/api/v1/query", (req, res) => {
	console.log(req.query);
	const { search, limit } = req.query;
	let sortedProducts = [...products];

	// http://localhost:5000/api/v1/query?search=b&limit=1

	if (search) {
		sortedProducts = sortedProducts.filter((product) => {
			return product.name.startsWith(search);
		});
	}

	if (limit) {
		sortedProducts = sortedProducts.slice(0, Number(limit));
	}

	if (sortedProducts.length < 1) {
		return res.status(200).json({ success: true, data: [] });
	}

	return res.status(200).json(sortedProducts);
});

app.listen(5000, () => {
	console.log("server 5000");
});
```

</details>

<details>
<summary>middleware</summary>

```js
const express = require("express");
const morgan = require("morgan");
const app = express();
const authorize = require("./authorize");
const logger = require("./logger");

// req => middleware => res

// 1. route vs app.use

// app.get("/", logger, (req, res) => {
// 	res.send("Home");
// });
// app.use("/api", logger); // only this specific path

// 2. options : our own / express / third party

// app.use([logger, authorize]);
// app.use(express.static("./public")); // using express static method
// app.use(morgan("tiny")); // using third party

app.get("/", (req, res) => {
	res.send("Home");
});

app.get("/about", (req, res) => {
	res.send("About");
});

app.get("/api/items", (req, res) => {
	console.log(req.user);
	res.send("Items");
});

app.listen(5000, () => {
	console.log("Server is listening");
});
```

authorize.js

```js
module.exports = authorize = (req, res, next) => {
	const { user } = req.query;

	if (user === "john") {
		req.user = { name: "john", id: 3 };
		next();
	} else {
		res.status(401).send("Unauthorized");
	}
};
```

logger.js

```js
const logger = (req, res, next) => {
	const method = req.method;
	const url = req.url;
	const time = new Date().getFullYear();
	console.log(method, url, time);
	// res.send("testing");
	next();
};

module.exports = logger;
```

</details>

<details>
<summary>CRUD</summary>

```js
const express = require("express");
const app = express();

let { people } = require("./data");

app.use(express.static("./methods-public"));
// parse payload
app.use(express.urlencoded({ extended: false }));
// parse json
app.use(express.json());

app.get("/api/people", (req, res) => {
	res.status(200).json({ success: true, data: people });
});

// POST Method
app.post("/api/people", (req, res) => {
	const { name } = req.body;
	if (!name) {
		return res.status(400).json({ success: false, msg: "Please provide name value" });
	}

	return res.status(201).json({ success: true, person: name });
});

app.post("/api/postman/people", (req, res) => {
	const { name } = req.body;
	if (!name) {
		return res.status(400).json({ success: false, msg: "Please provide name value" });
	}
	return res.status(201).json({ success: true, data: [...people, name] });
});

app.post("/login", (req, res) => {
	const { name } = req.body;
	if (name) {
		return res.status(200).send(`Welcome ${name}`);
	}
	res.status(401).send("Please provide credentials");
});

// PUT - UPDATE Method
app.put("/api/people/:id", (req, res) => {
	const { id } = req.params;
	const { name } = req.body;

	const person = people.find((person) => person.id === Number(id));
	if (!person) {
		return res.status(400).json({ success: false, msg: "No person with this id" });
	}

	const newPeople = people.map((person) => {
		if (person.id === Number(id)) {
			person.name = name;
		}
		return person;
	});
	res.status(201).send({ data: newPeople });
});

// DELETE Method
app.delete("/api/people/:id", (req, res) => {
	const person = people.find((person) => person.id === Number(req.params.id));
	if (!person) {
		return res.status(400).json({ success: false, msg: "No person with this id" });
	}
	const newPeople = people.filter((person) => person.id !== Number(req.params.id));
	return res.status(200).json({ success: true, data: newPeople });
});

app.listen(5000, () => {
	console.log("Server is listening");
});
```

</details>

<details>
<summary>Router - routes</summary>

app.js

```js
const express = require("express");
const app = express();
const people = require("./routes/people");
const login = require("./routes/auth");

app.use(express.static("./methods-public"));
// parse payload
app.use(express.urlencoded({ extended: false }));
// parse json
app.use(express.json());

app.use("/api/people", people);
app.use("/login", login);

app.listen(5000, () => {
	console.log("Server is listening");
});
```

routes/people.js

```js
const express = require("express");
const router = express.Router();

const {
	getPeople,
	createPerson,
	createPersonPostman,
	updatePerson,
	deletePerson,
} = require("../controllers/people");

// router.get("/", getPeople);
// router.post("/", createPerson);
// router.post("/postman", createPersonPostman);
// router.put("/:id", updatePerson);
// router.delete("/:id", deletePerson);

router.route("/").get(getPeople).post(createPerson);
router.route("/postman").post(createPersonPostman);
router.route("/:id").put(updatePerson).delete(deletePerson);

module.exports = router;
```

controllers/people.js

```js
let { people } = require("../data");

const getPeople = (req, res) => {
	res.status(200).json({ success: true, data: people });
};

const createPerson = (req, res) => {
	const { name } = req.body;
	if (!name) {
		return res.status(400).json({ success: false, msg: "Please provide name value" });
	}

	return res.status(201).json({ success: true, person: name });
};

const createPersonPostman = (req, res) => {
	const { name } = req.body;
	if (!name) {
		return res.status(400).json({ success: false, msg: "Please provide name value" });
	}
	return res.status(201).json({ success: true, data: [...people, name] });
};

const updatePerson = (req, res) => {
	const { id } = req.params;
	const { name } = req.body;

	const person = people.find((person) => person.id === Number(id));
	if (!person) {
		return res.status(400).json({ success: false, msg: "No person with this id" });
	}

	const newPeople = people.map((person) => {
		if (person.id === Number(id)) {
			person.name = name;
		}
		return person;
	});
	res.status(201).send({ data: newPeople });
};

const deletePerson = (req, res) => {
	const person = people.find((person) => person.id === Number(req.params.id));
	if (!person) {
		return res.status(400).json({ success: false, msg: "No person with this id" });
	}
	const newPeople = people.filter((person) => person.id !== Number(req.params.id));
	return res.status(200).json({ success: true, data: newPeople });
};

module.exports = { getPeople, createPerson, createPersonPostman, updatePerson, deletePerson };
```

</details>

</details>

## III - Project - CRUD + async, error-handler Middleware - Mongoose

<details>
<summary>Simple CRUD using Mongoose & Schema</summary>

<details>
<summary>Connection</summary>

app.js

```js
const express = require("express");
const app = express();
const tasks = require("./components/routes/tasks");
const connectDB = require("./db/connect");
require("dotenv").config();

// middleware
app.use(express.json());

// routes
app.get("/hello", (req, res) => {
	res.send("Task Manager App");
});

app.use("/api/v1/tasks", tasks);

const port = 3000;
const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(port, console.log("Server is listening on port:", port));
	} catch (error) {
		console.log(error);
	}
};

start();
```

connection

```js
const mongoose = require("mongoose");
const connectionString =
	"mongodb+srv://node:nodepass@cluster0.chfbj.mongodb.net/03-TASK-MANAGER?retryWrites=true&w=majority";

const connectDB = (url) => {
	return mongoose.connect(url);
};

module.exports = connectDB;
```

.env

```js
MONGO_URI=mongodb+srv://... etc

```

</details>

<details>
<summary>Schema - CRUD</summary>

```js
// const task = await Task.create(req.body);
// const tasks = await Task.find({});
// const task = await Task.findOne({ _id: taskID });
// const task = await Task.findOneAndDelete({ _id: taskID });
// <!-- UPDATE : Option = new & runValidators  -->
// const task = await Task.findOneAndUpdate({ _id: taskID }, req.body, { new: true, runValidators: true });
```

models/Task.js

```js
const mongoose = require("mongoose");
// https://mongoosejs.com/docs/models.html#compiling

const TaskSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "must provide name"],
		trim: true,
		maxlength: [20, "name can not be more than 20 characters"],
	},
	// completed: Boolean,
	completed: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model("Task", TaskSchema);
```

controller/task

```js
const Task = require("../models/Task");

const getAllTasks = async (req, res) => {
	try {
		const tasks = await Task.find({});
		res.status(200).json({ tasks });
	} catch (error) {
		res.status(500).json({ message: error });
	}
};

const createTask = async (req, res) => {
	try {
		const task = await Task.create(req.body);
		res.status(201).json({ task });
	} catch (error) {
		res.status(500).json({ message: error });
	}
};

const getTask = async (req, res) => {
	try {
		const { id: taskID } = req.params;
		const task = await Task.findOne({ _id: taskID });
		if (!task) {
			return res.status(404).json({ message: `No task with this id: ${taskID}` });
		}
		res.status(200).json({ task });
	} catch (error) {
		res.status(500).json({ message: error });
	}
};

const deleteTask = async (req, res) => {
	try {
		const { id: taskID } = req.params;
		const task = await Task.findOneAndDelete({ _id: taskID });
		if (!task) {
			return res.status(404).json({ message: `No task with this id: ${taskID}` });
		}
		res.status(200).json({ task });
		// res.status(200).send();
		// res.status(200).json({ task: null, status: "success" });
	} catch (error) {
		res.status(500).json({ message: error });
	}
};

const updateTask = async (req, res) => {
	try {
		const { id: taskID } = req.params;
		const task = await Task.findOneAndUpdate({ _id: taskID }, req.body, { new: true, runValidators: true });
		if (!task) {
			return res.status(404).json({ message: `No task with this id: ${taskID}` });
		}
		res.status(200).json({ task });
	} catch (error) {
		res.status(500).json({ message: error });
	}
};

module.exports = { getAllTasks, createTask, getTask, updateTask, deleteTask };
```

</details>

<details>
<summary>Middleware - notFound asyncWrapper errorHandler</summary>

<details>
<summary>notFound</summary>

app.js

```js
const notFound = require("./middleware/not-found");

// middleware
app.use(express.static("./public"));
app.use(express.json());

// routes
app.use("/api/v1/tasks", tasks);
app.use(notFound);
```

middleware/not-found

```js
const notFound = (req, res) => res.status(404).send("Route does not exist");
module.exports = notFound;
```

</details>

<details>
<summary>asyncWrapper </summary>

middleware/asyncWrapper

```js
const asyncWrapper = (fn) => {
	return async (req, res, next) => {
		try {
			await fn(req, res, next);
		} catch (error) {
			next(error);
		}
	};
};

module.exports = asyncWrapper;
```

tasks

```js
const Task = require("../models/Task");
const asyncWrapper = require("../middleware/asyncWrapper");

const getAllTasks = asyncWrapper(async (req, res) => {
	const tasks = await Task.find({});
	// res.status(200).json({ tasks, amount: tasks.length });
	res.status(200).json({ success: true, data: { tasks, nbHits: tasks.length } });
});

const createTask = asyncWrapper(async (req, res) => {
	const task = await Task.create(req.body);
	res.status(201).json({ task });
});
```

</details>

<details>
<summary>error handler</summary>

middleware/error-handler

```js
const errorHandlerMiddleware = (err, req, res, next) => {
	return res.status(500).json({ message: err });
};

module.exports = errorHandlerMiddleware;
```

app

```js
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");

// middleware
app.use(express.static("./public"));
app.use(express.json());

// routes
app.use("/api/v1/tasks", tasks);
app.use(notFound);
app.use(errorHandler);
```

</details>

<details>
<summary>Custom error handler</summary>

error/custom-error

```js
class CustomAPIError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.statusCode = statusCode;
	}
}

const createCustomError = (msg, statusCode) => {
	return new CustomAPIError(msg, statusCode);
};

module.exports = { createCustomError, CustomAPIError };
```

tasks

```js
const getTask = asyncWrapper(async (req, res, next) => {
	const { id: taskID } = req.params;
	const task = await Task.findOne({ _id: taskID });
	if (!task) {
		// try catch method
		// return res.status(404).json({ message: `No task with this id: ${taskID}` });

		// asyncWrapper error handler method
		// const error = new Error("Not Found");
		// error.status = 404;
		// return next(error);

		// custom error method
		return next(createCustomError(`No task with this id: ${taskID}`, 404));
	}
	res.status(200).json({ task });
});
```

middleware/error-handler

```js
// express use ony by default

// but we can create and use our own custom error handler this way
// plus importing in app

const { CustomAPIError } = require("../errors/custom-error");

const errorHandlerMiddleware = (err, req, res, next) => {
	if (err instanceof CustomAPIError) {
		return res.status(err.statusCode).json({ message: err.message });
	}

	// return res.status(err.status).json({ message: err.message });
	return res.status(500).json({ message: "Something went wrong error" });
};

module.exports = errorHandlerMiddleware;
```

</details>

</details>

</details>

## IV - Project - Store API

<details>
<summary>Express async error package - Mongoose</summary>

<details>
<summary>Etablishing new project</summary>

```js
require("dotenv").config();
// express async error package
require("express-async-errors");

const express = require("express");
const app = express();

const connectDB = require("./db/connect");
const productsRouter = require("./routes/products");

// middeware
const notFound = require("./middleware/not-found");
const errorMiddeware = require("./middleware/error-handler");

app.use(express.json());

// Route
app.get("/", (req, res) => {
	res.send('<h1>Store API</h1><a href="/api/v1/products">Products route</a>');
});

app.use("/api/v1/products", productsRouter);

app.use(notFound);
app.use(errorMiddeware);

const port = process.env.PORT || 3000;

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(port, console.log("Server listening..."));
	} catch (error) {
		console.log(error);
	}
};

start();
```

</details>

<details>
<summary>Mongoose - queryObject</summary>

```js
const products = await Product.find({ name: "vase table" }); // specific name
const products = await Product.find(req.query); // Query
// Query containing regex
const products = await Product.find({ name: { $regex: search, $options: "i" } });

const getAllProducts = async (req, res) => {
	const { featured, company, name } = req.query;
	const queryObject = {};

	if (featured) {
		queryObject.featured = featured === "true" ? true : false;
	}
	if (company) {
		queryObject.company = company;
	}
	if (name) {
		queryObject.name = { $regex: name, $options: "i" };
	}

	const products = await Product.find(queryObject);
	res.status(200).json({ products, nbHits: products.length });
};
```

</details>

<details>
<summary>Mongoose - sorting limit skip pagination</summary>

```js
// sort by name and lower price first
const products = await Product.find({}).sort("name -price").limit(4).skip(2);
```

```js
const page = Number(req.query.page) || 1;
const limit = Number(req.query.limit) || 10;
const skip = (page - 1) * limit;

result = result.skip(skip).limit(limit);

const products = await result;
```

</details>

<details>
<summary>numericFilters</summary>

```js
if (numericFilters) {
	const operatorMap = {
		">": "$gt",
		">=": "$gte",
		"=": "$e",
		"<": "$lt",
		"<=": "$lte",
	};

	const regEx = /\b(<|>|>=|=|<|<=)\b/g;
	let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`);
	const options = ["price", "rating"];

	filters = filters.split(",").forEach((item) => {
		const [field, operator, value] = item.split("-");
		if (options.includes(field)) {
			queryObject[field] = { [operator]: Number(value) };
		}
	});
}
```

</details>

</details>

## V - Authentication - JWT

<details>
<summary>Path</summary>

<details>
<summary>Pattern</summary>

controller

```js
const CustomeAPIError = require("../errors/custom-error");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) {
		throw new CustomeAPIError("Please provide email and password", 400);
	}
	const id = new Date().getDate();
	const token = jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: "30d" });
	res.status(200).json({ msg: "user created", token });
};

const dashboard = async (req, res) => {
	console.log(req.user);

	const luckyNumber = Math.floor(Math.random() * 100);
	res
		.status(200)
		.json({ msg: `Hello ${req.user.username}`, secret: `Here is your lucky number ${luckyNumber}` });
};

module.exports = { login, dashboard };
```

routes

```js
const { dashboard, login } = require("../controllers/main");

const router = require("express").Router();

const authMiddleware = require("../middleware/auth");

router.route("/dashboard").get(authMiddleware, dashboard);
router.route("/login").post(login);
```

</details>

<details>
<summary>Custom error classes - routeErrorMiddleware - http-status-code package</summary>

```js
// npm i http-status-codes
```

errors/custom-error

```js
class CustomAPIError extends Error {
	constructor(message, statusCode) {
		super(message);
	}
}

module.exports = CustomAPIError;
```

errors/unauthicated

```js
const CustomAPIError = require("./custom-error");
const { StatusCodes } = require("http-status-codes");

class UnauthenticatedError extends CustomAPIError {
	constructor(message, statusCode) {
		super(message);
		this.statusCode = StatusCodes.UNAUTHORIZED;
	}
}
```

middleware/auth

```js
const { UnauthenticatedError } = require("../errors");

const authenticationMiddleware = async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		throw new UnauthenticatedError("No token provided");
	}
	cons
```

</details>

</details>

## VI - Jobs API

<details>
<summary>Path</summary>

<details>
<summary>Register User : Model/Schema - bcrypt - mongoose Middleware</summary>

models/User

```js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please provide a name"],
		minlength: 3,
		maxlength: 50,
	},
	email: {
		type: String,
		required: [true, "Please provide valid email"],
		match: [
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			"Please provide valid email",
		],
		unique: true,
	},
	password: {
		type: String,
		required: [true, "Please provide password"],
		minlength: 6,
	},
});

// Using mongoose middleware
UserSchema.pre("save", async function () {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", UserSchema);
```

controllers/auth

```js
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");

const register = async (req, res) => {
	// without mongoose middleware method
	// const { name, email, password } = req.body;
	// const salt = await bcrypt.genSalt(10);
	// const hashedPassword = await bcrypt.hash(password, salt);
	// const tempUser = { name, email, password: hashedPassword };
	// if (!name || !email || !password) {
	// 	throw new BadRequestError("Please verify check required fields");
	// }
	// const user = await User.create({ ...tempUser });
	const user = await User.create({ ...req.body });
	res.status(StatusCodes.CREATED).json({ user });
};

const login = async (req, res) => {
	res.send("login user");
};

module.exports = { register, login };
```

</details>

<details>
<summary>Register - Token - custom Schema.methods</summary>

controllers/auth

```js
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
	const user = await User.create({ ...req.body });
	const token = jwt.sign({ userId: user._id, name: user.name }, "jwtSecret", { expiresIn: "30d" });
	res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};
```

models/User

```js
// Using mongoose middleware - token
UserSchema.methods.getName = function () {
	return this.name;
};
UserSchema.methods.createJWT = function () {
	return jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_LIFETIME,
	});
};
```

```js
// MONGO_URI=mongodb+srv://node:nodepass@cluster0.chfbj.mongodb.net/06-JOBS-API?retryWrites=true&w=majority
// JWT_SECRET=+KbPeShVmYq3t6w9z$C&E)H@McQfTjWn
// # allkeysgenerator.com => encyption key => 256 bit
// JWT_LIFETIME=30d
```

</details>

<details>
<summary>Pattern middleware jobs</summary>

app

```js
const authenticatedUser = require("./middleware/authentication");

// routers
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticatedUser, jobsRouter);
```

models/Job

```js
const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
	{
		company: {
			type: String,
			required: [true, "Please provide company name"],
			maxlength: 50,
		},
		position: {
			type: String,
			required: [true, "Please provide position"],
			maxlength: 100,
		},
		status: {
			type: String,
			enum: ["interview", "declined", "pending"],
			default: "pending",
		},
		createdBy: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: [true, "Please provide user"],
		},
	},
	// createdAt && updatedAt by default
	{ timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
```

controllers/jobs

```js
const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
	const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
	res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
	res.send("Get job");
};
const createJob = async (req, res) => {
	req.body.createdBy = req.user.userId;
	const job = await Job.create(req.body);

	res.status(StatusCodes.CREATED).json({ job });
};
const updateJob = async (req, res) => {
	res.send("update Job ");
};
const deleteJob = async (req, res) => {
	res.send("delete Job ");
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
```

</details>

<details>
<summary>More error handling</summary>

middleware/error-handler

```js
const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
	let customError = {
		// set default
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		msg: err.message || "Something went wrong",
	};

	// if (err instanceof CustomAPIError) {
	// 	return res.status(err.statusCode).json({ msg: err.message });
	// }

	if (err.name === "ValidationError") {
		customError.msg = Object.values(err.errors)
			.map((item) => item.message)
			.join(", ");
		customError.statusCode = 400;
	}

	if (err.code && err.code === 11000) {
		customError.msg = `Duplicate value entered for ${Object.keys(
			err.keyValue
		)} field, please choose another value`;
		customError.statusCode = 400;
	}

	if (err.name === "CastError") {
		customError.msg = `No item found with this id: ${err.value}`;
		customError.statusCode = 404;
	}

	// return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
	return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
```

</details>

<details>
<summary>Security: helmet / cors / xss clean / express rate limit</summary>

```js
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

// connectDB
const connectDB = require("./db/connect");
const authenticatedUser = require("./middleware/authentication");

// routers
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// extra packages
app.set("trust proxy", 1);
app.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	})
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(rateLimiter());
```

heroku/package.json

```js
	"engines": {
		"node": "16.x"
	}
```

Procfile

```js
web: node app.js
```

heroku-cmd
```js
// heroku create jobs-api-mt

// sending .env 
// heroku config:set JWT_LIFETIME=30d
// 

```


</details>

</details>
