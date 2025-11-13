# Web Development Fundamentals

## Table of Contents

1. [Introduction to Web Development](#introduction)
2. [HTML Essentials](#html-essentials)
3. [CSS & Styling](#css-styling)
4. [JavaScript Fundamentals](#javascript)
5. [DOM Manipulation](#dom)
6. [Responsive Design](#responsive)
7. [Web Performance](#performance)
8. [Modern Web Tools](#modern-tools)

## Introduction to Web Development

Web development is the process of building and maintaining websites. It encompasses everything from simple static pages to complex, interactive applications. This course covers the fundamental technologies that power the web.

### The Web Stack

Modern web development consists of three core technologies:

1. **HTML (HyperText Markup Language)**: Structure and content
2. **CSS (Cascading Style Sheets)**: Styling and layout
3. **JavaScript**: Interactivity and behavior

### How the Web Works

Understanding the request-response cycle:

```
1. User enters URL in browser
2. Browser makes HTTP request to server
3. Server processes request
4. Server sends HTML/CSS/JavaScript response
5. Browser parses and renders content
6. JavaScript executes for interactivity
```

### Learning Path

This course progresses from basic HTML structure through CSS styling to JavaScript interactivity, covering the foundations you need to build modern websites.

## HTML Essentials

### Document Structure

Every HTML document follows a standard structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title</title>
</head>
<body>
    <header>
        <nav>Navigation</nav>
    </header>
    <main>
        <article>Content</article>
    </main>
    <footer>Footer</footer>
</body>
</html>
```

### Semantic HTML

Using semantic tags improves accessibility and SEO:

```html
<!-- Good: Semantic HTML -->
<article>
    <header>
        <h1>Article Title</h1>
        <time datetime="2024-01-15">January 15, 2024</time>
    </header>
    <section>
        <p>Article content here...</p>
    </section>
    <footer>
        <p>Written by Author Name</p>
    </footer>
</article>

<!-- Poor: Non-semantic -->
<div class="article">
    <div class="header">
        <div class="title">Article Title</div>
    </div>
    <div class="content">Content</div>
</div>
```

### Forms & Input

Creating interactive forms:

```html
<form action="/submit" method="POST">
    <label for="username">Username:</label>
    <input type="text" id="username" name="username" required>

    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required>

    <label for="message">Message:</label>
    <textarea id="message" name="message" rows="4"></textarea>

    <label for="subscribe">
        <input type="checkbox" id="subscribe" name="subscribe">
        Subscribe to newsletter
    </label>

    <button type="submit">Submit</button>
    <button type="reset">Clear</button>
</form>
```

### Media Elements

Embedding images, videos, and audio:

```html
<!-- Images -->
<img src="photo.jpg" alt="Description of photo" width="300" height="200">

<!-- Responsive images -->
<picture>
    <source media="(min-width: 768px)" srcset="large.jpg">
    <source media="(min-width: 480px)" srcset="medium.jpg">
    <img src="small.jpg" alt="Responsive image">
</picture>

<!-- Video -->
<video width="320" height="240" controls>
    <source src="movie.mp4" type="video/mp4">
    Your browser does not support the video tag.
</video>

<!-- Audio -->
<audio controls>
    <source src="audio.mp3" type="audio/mpeg">
    Your browser does not support the audio element.
</audio>
```

## CSS & Styling

### Selectors & Specificity

Understanding CSS selector types:

```css
/* Element selector */
p { color: blue; }

/* Class selector */
.highlight { background-color: yellow; }

/* ID selector */
#main-title { font-size: 2em; }

/* Attribute selector */
input[type="email"] { border: 2px solid blue; }

/* Pseudo-class selector */
a:hover { color: red; }

/* Combinators */
div > p { margin: 10px; }        /* Child combinator */
div p { margin: 10px; }          /* Descendant combinator */
h1 + p { margin-top: 0; }        /* Adjacent sibling */
h1 ~ p { line-height: 1.6; }     /* General sibling */
```

### Box Model

Understanding layout fundamentals:

```css
.box {
    /* Content dimensions */
    width: 200px;
    height: 150px;

    /* Padding: inside the border */
    padding: 20px;

    /* Border */
    border: 2px solid black;

    /* Margin: outside the border */
    margin: 30px;

    /* Box sizing */
    box-sizing: border-box;
}
```

### Flexbox Layout

Modern flexible layouts:

```css
.container {
    display: flex;
    flex-direction: row;           /* row | column */
    justify-content: space-between; /* Main axis alignment */
    align-items: center;           /* Cross axis alignment */
    gap: 20px;                     /* Space between items */
}

.item {
    flex: 1;        /* Grow equally */
    flex-grow: 1;   /* Growth factor */
    flex-shrink: 1; /* Shrink factor */
    flex-basis: auto; /* Base size */
}
```

### Grid Layout

Two-dimensional layouts:

```css
.grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 100px 200px;
    gap: 20px;
}

.item-1 {
    grid-column: 1 / 2;
    grid-row: 1 / 3;
}

.item-2 {
    grid-column: 2 / 4;
}
```

### Transforms & Animations

Dynamic effects:

```css
/* Transforms */
.box {
    transform: translateX(50px) rotate(45deg) scale(1.2);
    transition: transform 0.3s ease;
}

.box:hover {
    transform: translateX(100px) rotate(90deg) scale(1.5);
}

/* Animations */
@keyframes slide-in {
    from {
        opacity: 0;
        transform: translateX(-100px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.animated {
    animation: slide-in 0.5s ease-out;
}
```

## JavaScript Fundamentals

### Variables & Data Types

JavaScript's type system:

```javascript
// Variable declaration
const name = "Alice";           // String
let age = 30;                   // Number
var isActive = true;            // Boolean

// Arrays
const colors = ["red", "green", "blue"];

// Objects
const person = {
    name: "Alice",
    age: 30,
    greet: function() {
        console.log(`Hello, I'm ${this.name}`);
    }
};

// Template literals
const message = `My name is ${person.name} and I'm ${person.age} years old`;
```

### Functions

Defining and using functions:

```javascript
// Function declaration
function add(a, b) {
    return a + b;
}

// Function expression
const multiply = function(a, b) {
    return a * b;
};

// Arrow function
const divide = (a, b) => a / b;

// Function with default parameters
function greet(name = "Guest") {
    console.log(`Hello, ${name}!`);
}

// Higher-order function
function compose(f, g) {
    return (x) => f(g(x));
}
```

### Control Flow

Decision making and loops:

```javascript
// If/else statements
if (age >= 18) {
    console.log("Adult");
} else if (age >= 13) {
    console.log("Teenager");
} else {
    console.log("Child");
}

// Switch statement
switch (day) {
    case "Monday":
        console.log("Start of week");
        break;
    case "Friday":
        console.log("Almost weekend");
        break;
    default:
        console.log("Regular day");
}

// Loops
for (let i = 0; i < 5; i++) {
    console.log(i);
}

// Array iteration
const numbers = [1, 2, 3, 4, 5];
numbers.forEach((num) => console.log(num * 2));

// Map, filter, reduce
const doubled = numbers.map((n) => n * 2);
const evens = numbers.filter((n) => n % 2 === 0);
const sum = numbers.reduce((acc, n) => acc + n, 0);
```

### Async JavaScript

Handling asynchronous operations:

```javascript
// Promises
const fetchData = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Data loaded");
    }, 1000);
});

fetchData
    .then((data) => console.log(data))
    .catch((error) => console.error(error));

// Async/await
async function loadData() {
    try {
        const response = await fetch("/api/data");
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Error:", error);
    }
}

// Fetch API
fetch("/api/users")
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
```

## DOM Manipulation

### Selecting Elements

Finding DOM elements:

```javascript
// By ID
const header = document.getElementById("main-header");

// By class
const buttons = document.querySelectorAll(".btn");

// By tag
const paragraphs = document.getElementsByTagName("p");

// Modern way (recommended)
const container = document.querySelector(".container");
const items = document.querySelectorAll(".item");
```

### Creating & Modifying Elements

Dynamic DOM changes:

```javascript
// Create elements
const newDiv = document.createElement("div");
newDiv.textContent = "Hello, World!";
newDiv.className = "greeting";

// Add to DOM
document.body.appendChild(newDiv);

// Modify content
element.textContent = "New text";
element.innerHTML = "<p>HTML content</p>";

// Modify attributes
element.setAttribute("data-id", "123");
element.removeAttribute("disabled");

// Modify classes
element.classList.add("active");
element.classList.remove("inactive");
element.classList.toggle("highlighted");
```

### Event Handling

Responding to user interactions:

```javascript
// Add event listeners
button.addEventListener("click", function(event) {
    console.log("Button clicked");
    event.preventDefault();
});

// Common events
element.addEventListener("change", handleChange);
input.addEventListener("input", handleInput);
window.addEventListener("scroll", handleScroll);
document.addEventListener("keydown", handleKeyPress);

// Event delegation
container.addEventListener("click", function(event) {
    if (event.target.matches(".item")) {
        console.log("Item clicked:", event.target);
    }
});
```

## Responsive Design

### Media Queries

Adapting to different screen sizes:

```css
/* Mobile first approach */
.container {
    width: 100%;
    padding: 20px;
}

/* Tablet */
@media (min-width: 768px) {
    .container {
        max-width: 720px;
        margin: 0 auto;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .container {
        max-width: 960px;
    }
}

/* Large screens */
@media (min-width: 1440px) {
    .container {
        max-width: 1200px;
    }
}
```

### Viewport Meta Tag

Essential for mobile optimization:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Mobile-Friendly Images

Responsive images for all screen sizes:

```html
<img 
    srcset="small.jpg 480w, medium.jpg 768w, large.jpg 1024w"
    sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
    src="medium.jpg"
    alt="Responsive image"
>
```

## Web Performance

### Optimization Techniques

Improving loading speed:

```javascript
// Lazy loading images
const images = document.querySelectorAll("img[data-src]");
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
            observer.unobserve(img);
        }
    });
});

images.forEach((img) => imageObserver.observe(img));
```

### Caching Strategies

Browser caching headers:

```
Cache-Control: public, max-age=31536000 (1 year for static assets)
Cache-Control: no-cache, must-revalidate (for HTML)
Cache-Control: max-age=3600 (1 hour for API responses)
```

## Modern Web Tools

### Build Tools

Essential development tools:

- **Package managers**: npm, yarn, pnpm
- **Bundlers**: Webpack, Vite, Esbuild
- **Task runners**: npm scripts, Gulp
- **Linters**: ESLint, Stylelint
- **Testing**: Jest, Vitest, Cypress

### Development Workflow

```bash
# Initialize project
npm init

# Install dependencies
npm install express axios

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Conclusion

You now have a solid foundation in web development. Practice these concepts by building real projects, and gradually increase in complexity. The web development landscape continues to evolve, so keep learning and stay updated with new technologies and best practices.
