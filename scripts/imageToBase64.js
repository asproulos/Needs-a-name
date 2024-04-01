initInput();
function initInput() {
    /** @type {HTMLInputElement} */
    let input = document.querySelector("#image-file-input");
    if (!input) return;

    input.addEventListener("change", function (event) {
        let file = input.files[0];
        // if (!file || file.type !== "image/png") {
        //     console.warn("No png provided.");
        //     return;
        // }

        // let reader = new FileReader();
        // reader.onload = (event) => {
        //     handleFileResult(reader.result, file.type);
        // };
        // reader.onerror = (event) => {
        //     console.error("Error");
        //     console.error(event);
        // };

        // reader.readAsArrayBuffer(file);

        const reader = new FileReader();

        reader.onloadend = function () {
            handleFileResult(reader.result);
        };

        reader.readAsDataURL(file);
    });
}

/**
 * @param {ArrayBuffer} arrayBuffer 
 */
function handleFileResult(arrayBuffer) {
    const base64 = arrayBuffer;
    let image = document.createElement("img");
    image.src = base64;
    document.body.appendChild(image);
}

// /**
//  * @param {ArrayBuffer} data 
//  * @returns {string} 
//  */
// function getBase64FromBuffer(data) {
//     const BASE64_CHARACTER_MAP = [
//         "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
//         "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
//         "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/"
//     ];

//     let byteArray = new Uint8Array(data);
//     let binaries = [];
//     for (let i = 0; i < byteArray.length; i++) {
//         binaries.push(decToBin(byteArray[i]));
//     }

//     let b64BitSplit = splitAndPad(binaries.join(""), 6);

//     let base64 = [];
//     for (let i = 0; i < b64BitSplit.length; i++) {
//         base64.push(BASE64_CHARACTER_MAP[binToDec(b64BitSplit[i])]);
//     }

//     while (base64.length % 4 != 0) {
//         base64.push("=");
//     }

//     return base64.join("");
// }

// /**
//  * @param {string} string 
//  * @param {number} chunkSize 
//  * @param {number} padSize 
//  * @returns {Array<string>}
//  */
// function splitAndPad(string, chunkSize, padSize = 8) {
//     let array = [];
//     for (let i = 0; i < string.length / chunkSize; i++) {
//         array.push(string.substring(i * chunkSize, (i * chunkSize) + chunkSize).padStart(padSize, "0"));
//     }
//     return array;
// }


// /**
//  * @param {number} dec < 256
//  * @returns {number}
//  */
// function decToBin(dec) {
//     return dec.toString(2)//.PadLeft(8, '0');
// }

// /**
//  * @param {number} bin 
//  * @returns {number} 
//  */
// function binToDec(bin) {
//     let num = bin.toString();
//     let dec_value = 0;

//     // Initializing base value to 1,
//     // i.e 2^0
//     let base1 = 1;

//     let len = num.length;
//     for (let i = len - 1; i >= 0; i--) {
//         if (num[i] == '1')
//             dec_value += base1;
//         base1 = base1 * 2;
//     }

//     return dec_value;
// }