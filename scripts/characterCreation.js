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
            console.log(next.value);
            console.log(data.get(next.value));
            characterData[next.value] = data.get(next.value);
            next = keys.next();
        }

        getSRCFromFile(characterData.image).then(function (data) {
            characterData.image = data;

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

    });
}

/**
 * @param {File} file
 * @returns {Promise<string>}
 */
function getSRCFromFile(file) {
    return new Promise(function (resolve, reject) {
        if (!file || !file.type.includes("image/png")) {
            let errorMsg = "No png provided."
            console.warn(errorMsg);
            reject(errorMsg);
            return;
        }
        const reader = new FileReader();

        reader.onloadend = function () {
            resolve(reader.result);
        };

        reader.readAsDataURL(file);
    });
}