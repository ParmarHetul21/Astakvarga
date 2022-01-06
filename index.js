const inputTable = document.getElementById("input-table");
const submitBtn = document.getElementById("btn-submit");
const resetBtn = document.getElementById("btn-clear");
const ERROR_COLOR = "#e5523b";

const createRatio = (degree = 30, minutes = 60) => {
    const degreeRatio = (degree * 100) / 30;
    const minutesRatio = minutes / 60;
    return degreeRatio + minutesRatio;
};

submitBtn.onclick = async (e) => {
    e.preventDefault();
    var data = await fetch("table1.json");
    const table1 = await data.json();
    data = await fetch("table2.json");
    const table2 = await data.json();
    var totalNumber = 0;

    for (let index = 0; index < 8; index++) {
        const element = inputTable.children[index];
        const planet = element.firstElementChild.textContent.trim();
        const zodiac = element.children[3].firstElementChild.value.trim();
        var degree = element.children[1].firstElementChild.value;
        var minutes = element.children[2].firstElementChild.value;
        const numberElement = element.children[4];
        const nakshatraElement = element.children[5];
        const rulerElement = element.children[6];
        const currentRatio = createRatio(degree, minutes);
        if (!/\d/.test(degree) || !/\d/.test(minutes)) {
            element.style.backgroundColor = ERROR_COLOR;
            continue;
        } else {
            degree = Number(degree);
            minutes = Number(minutes);
        }
        element.style.backgroundColor = "white";
        switch (planet) {
            case "Saturn":
                if (currentRatio < 0 || currentRatio > createRatio(3, 45)) {
                    element.style.backgroundColor = ERROR_COLOR;
                    continue;
                }
                break;
            case "Jupiter":
                if (
                    currentRatio < createRatio(3, 45) ||
                    currentRatio > createRatio(7, 30)
                ) {
                    element.style.backgroundColor = ERROR_COLOR;
                    continue;
                }
                break;
            case "Mars":
                if (
                    currentRatio < createRatio(7, 30) ||
                    currentRatio > createRatio(11, 15)
                ) {
                    element.style.backgroundColor = ERROR_COLOR;
                    continue;
                }
                break;
            case "Sun":
                if (
                    currentRatio < createRatio(11, 15) ||
                    currentRatio > createRatio(15, 0)
                ) {
                    element.style.backgroundColor = ERROR_COLOR;
                    continue;
                }
                break;
            case "Venus":
                if (
                    currentRatio < createRatio(15, 0) ||
                    currentRatio > createRatio(18, 45)
                ) {
                    element.style.backgroundColor = ERROR_COLOR;
                    continue;
                }
                break;
            case "Mercury":
                if (
                    currentRatio < createRatio(18, 45) ||
                    currentRatio > createRatio(22, 30)
                ) {
                    element.style.backgroundColor = ERROR_COLOR;
                    continue;
                }
                break;
            case "Moon":
                if (
                    currentRatio < createRatio(22, 30) ||
                    currentRatio > createRatio(26, 15)
                ) {
                    element.style.backgroundColor = ERROR_COLOR;
                    continue;
                }
                break;
            case "Ascendant":
                if (
                    currentRatio < createRatio(26, 15) ||
                    currentRatio > createRatio(30, 0)
                ) {
                    element.style.backgroundColor = ERROR_COLOR;
                    continue;
                }
                break;
            default:
                break;
        }
        const number = table1[planet][zodiac];
        numberElement.textContent = number;
        totalNumber += number;

        const output2 = table2.filter((row) => {
            const [minDegree, minZodiac, minMinutes] = row.min.split(" ");
            const [maxDegree, maxZodiac, maxMinutes] = row.max.split(" ");
            const currentRatio = createRatio(degree, minutes);
            var minRatio = createRatio(minDegree, minMinutes);
            var maxRatio = createRatio(maxDegree, maxMinutes);
            if (minZodiac === zodiac) {
                if (maxZodiac !== zodiac) {
                    maxRatio = createRatio();
                }
            } else if (maxZodiac === zodiac) {
                minRatio = 0;
                maxRatio = createRatio(maxDegree, maxMinutes);
            } else {
                return false;
            }
            return currentRatio < maxRatio && minRatio <= currentRatio;
        });
        if (output2.length) {
            const [{ ruler, nakshatra }] = output2;
            rulerElement.textContent = ruler;
            nakshatraElement.textContent = nakshatra;
        }
    }
    document.getElementById("result").textContent = totalNumber;
};

resetBtn.onclick = () => {
    for (let index = 0; index < 8; index++) {
        element = inputTable.children[index];
        element.style.backgroundColor = "white";
        element.children[1].firstElementChild.value = "";
        element.children[2].firstElementChild.value = "";
        element.children[3].firstElementChild.value = "Ar";
        element.children[4].textContent = "";
        element.children[5].textContent = "";
        element.children[6].textContent = "";
        document.getElementById("result").textContent = "";
    }
};
