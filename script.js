const cards = document.getElementById("cards");
const searchInput = document.getElementById("search");

const fps = 60;
const duration = 200;
const totalSteps = Math.floor(duration / (100 / fps));

function printCards(filteredData, animate = true) {
    cards.innerHTML = ""; 

    const populationElements = [];

    filteredData.forEach(item => {
        const card = document.createElement("div");
        card.className = "max-w-xs p-6 rounded-md shadow-md dark:bg-gray-50 dark:text-gray-900";

        card.innerHTML = `
            <img src="${item.flag}" alt="" class="object-cover object-center w-full rounded-md h-72 dark:bg-gray-500">
            <div class="mt-6 mb-2">
                <span class="block text-xs tracking-widest uppercase font-bold dark:text-green-700">${item.region}</span>
                <h2 class="text-2xl font-bold truncate tracking-wide">${item.name}</h2>
                <h2 class="text-lg font-semibold truncate tracking-wide">${item.capital}</h2>
            </div>
            <p class="dark:text-gray-800 truncate"><b>Population:</b> <span class="population">${animate ? "0" : (item.population ? item.population.toLocaleString() : "N/A")}</span></p>
            <button class="select-btn mt-4 bg-violet-600 min-lg:hover:bg-violet-950 duration-300 min-lg:cursor-pointer text-white px-3 py-1 rounded">Seç</button>
        `;

        cards.appendChild(card);

        const popEl = card.querySelector(".population");
        populationElements.push({
            element: popEl,
            target: item.population,
            step: item.population / totalSteps,
            current: 0
        });
    });
 if (!animate) return;
    let currentStep = 0;
    const interval = setInterval(() => {
        currentStep++;
        populationElements.forEach(obj => {
            obj.current += obj.step;
            if (currentStep >= totalSteps) {
                obj.current = obj.target;
            }
            obj.element.textContent = Math.floor(obj.current).toLocaleString();
        });

        if (currentStep >= totalSteps) {
            clearInterval(interval);
        }
    }, 1000 / fps);
}

printCards(data, true);

searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase().trim();

    const filtered = data.filter(country =>
        country.name.toLowerCase().includes(searchTerm)
    );

    printCards(filtered, false);
});

const toggleBtn = document.getElementById('darkModeToggle');
const body = document.body;

if (localStorage.getItem("theme") === "dark") {
      body.classList.add("dark");
      toggleBtn.textContent = "☀️";
    }

    toggleBtn.addEventListener("click", () => {
      body.classList.toggle("dark");
      const isDark = body.classList.contains("dark");
      toggleBtn.textContent = isDark ? "☀️" : "🌙";
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
cards.addEventListener("click", (event) => {
    if (event.target.classList.contains("select-btn")) {
        const card = event.target.closest("div");
        const countryName = card.querySelector("h2").textContent;

        const selectedCountry = data.find(c => c.name === countryName);

        let selectedCountries = JSON.parse(localStorage.getItem("selectedCountries")) || [];

        const exists = selectedCountries.some(c => c.name === selectedCountry.name);
        if (!exists) {
            selectedCountries.push(selectedCountry);
            localStorage.setItem("selectedCountries", JSON.stringify(selectedCountries));
        }
    }
});
const burgerBtn = document.getElementById("burgerBtn");
const mobileMenu = document.getElementById("mobileMenu");

burgerBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

