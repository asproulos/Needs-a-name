/** 
 * @typedef {{
 *  characters: Array<Character>,
 *  dom: HTMLElement
 * }} Container
 */

/** @type {Container} */
let characterContainer = {
    characters: [],
    dom: document.querySelector(".allies")
}

let loadedCharacters = getCharactersFromLocalStorage();
characterContainer.characters = loadedCharacters;
characterContainer.characters.forEach(function (char) {
    createCharacterDom(char);
});

drawDoms();

function drawDoms() {
    characterContainer.dom.innerHTML = "";
    characterContainer.characters.forEach(function (char) {
        characterContainer.dom.appendChild(char.dom);
    });
}

/**
 * @param {Character} character 
 */
function createCharacterDom(character) {
    let container = document.createElement("div");
    character.dom = container;
    container.className = "character";

    let name = document.createElement("div");
    name.textContent = "\"" + character.name + "\"";
    name.className = "name";
    container.appendChild(name);

    let svg = document.createElement("svg");
    svg.innerHTML = character.image;
    svg.className = "image";
    container.appendChild(svg);

    let healthContainer = document.createElement("div");
    healthContainer.className = "health-container";

    let current = document.createElement("div");
    current.textContent = character.currentHealth;
    current.className = "current-health";
    healthContainer.appendChild(current);

    let max = document.createElement("div");
    max.textContent = "/" + character.maxHealth;
    max.className = "max-health";
    healthContainer.appendChild(max)

    container.appendChild(healthContainer);

    container.addEventListener("click", function (event) {
        /** @type {Character | null} */
        let sourceCharacter = window.sourceCharacter;
        if (sourceCharacter) {
            if (sourceCharacter === character) return;
            if (sourceCharacter.actions.length === 0) sourceCharacter.actions.push(new Action({ type: "damage", strength: 1 }));
            sourceCharacter.actions[0].apply(sourceCharacter, character);
            sourceCharacter.dom = createCharacterDom(sourceCharacter);
            character.dom = createCharacterDom(character);
            container.classList.remove("selected");
            window.sourceCharacter = null;
            drawDoms();
        } else {
            container.classList.add("selected");
            window.sourceCharacter = character;
        }
    });
    container.addEventListener("contextmenu", function (event) {
        event.preventDefault();
        window.sourceCharacter = null;
        container.classList.remove("selected");
    });

    return container;
}

/**
 * @returns {Array<Character>}
 */
function getCharactersFromLocalStorage() {
    let dataString = localStorage.getItem("saved-characters");
    /** @type {Array<{name:string, }>} */
    let data = [];
    try {
        if (dataString) {
            data = JSON.parse(dataString);
        }
    } catch (error) {
        data = [];
    }

    return data.map(function (item) {
        return new Character({
            image: item.image,
            maxHealth: item.maxHealth,
            name: item.name,
            tags: item.tags
        });
    });
}