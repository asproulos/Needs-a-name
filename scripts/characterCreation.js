initializeForm();

function initializeForm() {
    let form = document.querySelector("#create-character");
    if (!form) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        let data = new FormData(form);
        let characterData = {};
        let keys = data.keys();
        let next = keys.next();
        while (!next.done) {
            characterData[next.value] = data.get(next.value);
            next = keys.next();
        }

        let tags = new Tags({
            healBoost: characterData.healBoost,
            shieldBoost: characterData.shieldBoost,
            thorns: characterData.thorns
        });

        let newCharacter = new Character({
            maxHealth: characterData.maxHealth,
            name: characterData.name,
            image: characterData.image,
            tags: tags
        });

        createCharacterDom(newCharacter);
        characterContainer.characters.push(newCharacter);
        drawDoms();

        form.querySelectorAll("[name]").forEach(function (dom) {
            dom.value = "";
        });

    });
}