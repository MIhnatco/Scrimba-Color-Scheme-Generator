

const theInput = document.getElementById("color");
const btn = document.querySelector('button')

const colorScheme = document.getElementById("colorScheme")
const colorDisplay = document.getElementById("colorSchemeDisplay")

/**
 * Copies the hex value to clipboard
 * @param {string} text - The hex value of a color
 */

function copyToClipboard(text){
    navigator.clipboard.writeText(text);
}


/**
 * Displays the color scheme
 * @param {*} colors - The colors from API response
 */
function displayColorScheme(colors){

    colorDisplay.innerHTML = "";  //Clear any previous color scheme display

    /**
     * Looping through colors
     */
    colors.forEach(color => {
        const schemeContainer = document.createElement("div");
        
        //displaying the color
        const swatch = document.createElement('div');
        swatch.style.backgroundColor = color.hex.value;
        swatch.className = 'color-swatch';

        //displaying the hex value
        const hexValue = document.createElement("p");
        hexValue.innerText = color.hex.value;
        hexValue.className = 'color-hex';


        /**
         * copy to clipboard
         */
        hexValue.addEventListener('click', () => {
            copyToClipboard(color.hex.value);
            alert(`Copied to clipboard: ${color.hex.value}`)
        })


        /**
         * Display
         */
        schemeContainer.appendChild(swatch);
        schemeContainer.appendChild(hexValue);

        colorDisplay.appendChild(schemeContainer)

    })
}

/**
 * An object to map option values to the desired count
 */
    const colorSchemeCounts = {
        analogic: 5,
        monochrome: 5,
        'monochrome-dark': 5,
        'monochrome-light': 5,
        complement: 5,
        'analogic-complement': 4,
        triad: 3,
        quad: 4,
    };


    /**
     * Generating colors from API
     */
    function colSchemeGenerator(){

        const baseColor = theInput.value.slice(1);
        let option = colorScheme.value;

        /**
         * Get the count based on the selected scheme
         */
        const count = colorSchemeCounts[option];   


        /**
         * fetchs the data
         */
        if(count !== undefined){
            fetch(`https://www.thecolorapi.com/scheme?hex=${baseColor}&mode=${option}&count=${count}`)
                 .then(response => {
                        if(!response.ok){
                            throw new Error("Network response was not ok");
                        }

                        return response.json()
                 })
                 .then(data => {
                    if(data.colors){
                        displayColorScheme(data.colors);
                    } else {
                        throw new Error("Received invalid data from the API.")
                    }
                 })
                 .catch(error => {
                    showError(error.message)
                 });
        } else {
            showError("Invalid color scheme option or count not specified.")
        }

    }

    /**
     * Error message function
     * @param errorMessage
     */

    function showError(errorMessage){
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.innerText = `Error: ${errorMessage}`;
        errorElement.innerHTML = "";
        colorDisplay.appendChild(errorElement);
    }


    /**
     * run the generator
     */

    btn.addEventListener('click', colSchemeGenerator);