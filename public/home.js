let display = document.querySelector(".display");

const apiId = "77208387";
const apiKey = "1c5cfc5d88de0fa9218ce39d96fabcd3";
const baseUrl = "https://api.edamam.com/search";


let defaultQuery = "chicken";

document.addEventListener('DOMContentLoaded', () => {
    retrieveData(defaultQuery);
});

async function retrieveData(query) {
    const from = 0;
    const to = 9; 
    const url = `${baseUrl}?q=${encodeURIComponent(query)}&app_id=${apiId}&app_key=${apiKey}&from=${from}&to=${to}`;
    console.log("Fetching URL:", url);
    try {
        const response = await fetch(url);
        const data = await response.json();
        add(data);
    } catch (error) {
        console.error("Error", error);
    }
}

function clear() {
    while (display.firstChild) {
        display.removeChild(display.firstChild);
    }
}

function add(data) {
    clear();
    data.hits.forEach((hit) => {
        let box = document.createElement("div");
        box.className = "box";

        let label = document.createElement("h1");
        label.id = "label";
        label.innerText = hit.recipe.label;

        let source = document.createElement("h5");
        source.innerText = hit.recipe.source;
        source.id = "source";

        let resource = document.createElement("a");
        resource.text = "Find out more :)";
        resource.href = hit.recipe.url;
        resource.id = "resource";

        let head = document.createElement("h4");
        head.innerText = "Ingredients:";
        head.id = "head";

        let ingredients = document.createElement("p");
        ingredients.innerText = hit.recipe.ingredientLines.join(', ');
        ingredients.id = "ingredients";

        let image = document.createElement("img");
        image.src = hit.recipe.image;
        image.alt = hit.recipe.label;
        image.id = "recipeimg";

        let footer = document.createElement("div");
        footer.id = "footer";

        let count = document.createElement("p");
        count.innerText = `Ingredients: ${hit.recipe.ingredientLines.length}`;
        count.id = "count";

        footer.append(count);

        box.append(label);
        box.append(image);
        box.append(source);
        box.append(resource);
        box.append(head);
        box.append(ingredients);
        box.append(footer);

        display.append(box);
    });
}
