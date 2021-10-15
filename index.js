// CRYPTO_DATA taken from ./crypto-data.js
if (!CRYPTO_DATA) {
    throw new Error("No data available!");
}

const LOCAL_KEY = "crypto-prices";
const TIME_KEY = "crypto-time";
const CURRENCY = "usd";
const COINS = CRYPTO_DATA.map((crypto) => crypto.id);
const ROOT_URL = "https://api.coingecko.com/api/v3/";
const PRICE_ENDPOINT = "simple/price";

const PRICE_DATA = `?ids=${COINS.join(",")}&vs_currencies=${CURRENCY}`;

const currDate = new Date();

if (localStorage.getItem(TIME_KEY)) {
    const prevDate = new Date(localStorage.getItem(TIME_KEY));
    const diff = Math.abs(currDate - prevDate);

    const secondsDiff = Math.floor(diff / 1000);
    const minutesDiff = Math.floor(diff / (1000 * 60));
    const hoursDiff = Math.floor(diff / (1000 * 60 * 60));
    const daysDiff = Math.floor(diff / (1000 * 60 * 60 * 24));

    addTimeDifference(secondsDiff, minutesDiff, hoursDiff, daysDiff);
}

localStorage.setItem(TIME_KEY, currDate.toString());

fetch(ROOT_URL + PRICE_ENDPOINT + PRICE_DATA)
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        if (localStorage.getItem(LOCAL_KEY)) {
            const previousValues = JSON.parse(localStorage.getItem(LOCAL_KEY));
            for (let [crypto, price] of Object.entries(previousValues)) {
                if (!data[crypto]) {
                    // Crypto data is not returned
                    continue;
                }

                let increase = data[crypto].usd - price.usd;
                let difference = (increase / price.usd) * 100;

                addCryptoDifference(crypto, data[crypto].usd, difference.toFixed(2));
            }
        }
        localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
    });

function addCryptoDifference(crypto, price, difference) {
    let element = document.createElement("li");

    let nameElement = document.createElement("span");
    nameElement.innerText = crypto;

    let priceElement = document.createElement("span");
    priceElement.innerText = `$${price}`;

    let diffElement = document.createElement("span");
    diffElement.innerText = `${difference}%`;

    if (difference > 0) {
        element.classList.add("increase");
    } else if (difference < 0) {
        element.classList.add("decrease");
    }

    element.appendChild(nameElement);
    element.appendChild(diffElement);
    element.appendChild(priceElement);

    document.getElementById("crypto-list").append(element);
}

function addTimeDifference(seconds, minutes, hours, days) {
    let element = document.getElementById("crypto-time");

    let secondsElement = document.createElement("span");
    secondsElement.innerText = `${seconds} seconds.`;
    let minutesElement = document.createElement("span");
    minutesElement.innerText = `${minutes} minutes.`;
    let hoursElement = document.createElement("span");
    hoursElement.innerText = `${hours} hours.`;
    let daysElement = document.createElement("span");
    daysElement.innerText = `${days} days.`;

    element.appendChild(secondsElement);
    element.appendChild(minutesElement);
    element.appendChild(hoursElement);
    element.appendChild(daysElement);
}
