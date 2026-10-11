const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select"); 
const toCurr = document.querySelector(".to select"); 
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
    // Removed the semicolon that was breaking the loop and defined currCode
    for (let currCode in countryList) { 
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD"){
            newOption.selected = "selected";
        }
        select.append(newOption);
    }
    
    // Moved event listener inside the loop so 'select' is defined
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateFlag = (element) => {
    let currCode = element.value;
    // Accessed object properties using brackets, not parentheses
    let countryCode = countryList[currCode]; 
    // Used backticks (`) for string interpolation, not single quotes ('')
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`; 
    let img = element.parentElement.querySelector("img");
    if (img) img.src = newSrc;
};

btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    
    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1"; // Updates the input box visually
    }

    // Fixed API endpoint structure and used backticks for interpolation
    const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;
    
    try {
        let response = await fetch(URL);
        let data = await response.json();
        
        // The API returns the rates nested under the base currency name
        let fromCurrencyCode = fromCurr.value.toLowerCase();
        let toCurrencyCode = toCurr.value.toLowerCase();
        let rate = data[fromCurrencyCode][toCurrencyCode];
        
        let finalAmount = (amtVal * rate).toFixed(2);
        // Used backticks for string interpolation
        msg.innerText = `${amtVal}${fromCurr.value} = ${finalAmount}${toCurr.value}`; 
    } catch (error) {
        msg.innerText = "Failed to fetch exchange rate.";
        console.error(error);
    }
});