const main = document.querySelector("main");

const billSectionLabels = document.querySelector(".calcApp__billSection-label");
const billAmountWrapper = document.querySelector(".calcApp__billAmount-wrapper")
const billAmount = document.querySelector(".calcApp__billAmount");

const tipOptions = document.querySelectorAll(".tipOption");
const customTipOptionList = document.querySelector(".customTipOption-list");
const customTipOptionWrapper = document.querySelector(".customTipOption-wrapper");
const customTipOption = document.querySelector(".customTipOption");

const peopleSection = document.querySelector(".calcApp__peopleSelection");
const peopleSectionLabels = document.querySelector(".calcApp__peopleSelection-label")
const peopleSelectionValueWrapper = document.querySelector(".calcApp__peopleSelectionValue-wrapper");
const noOfPeople = document.querySelector(".calcApp__peopleSelectionValue");

const tipAmount = document.querySelector(".calcApp__tip-amount");
const totalAmount = document.querySelector(".calcApp__total-amount");
const resetButton = document.querySelector(".calcApp__resetButton");

let bill = 0;
let totalTip = 0;
let noOfIndividuals = 1;

function initializer() {
    initialAddEventListeners();
    disableUISections();
    setInitialSectionValues();
    defaultResultSectionDisplay();
}

function initialAddEventListeners() {
    window.addEventListener("resize", updateGridStyle);

    main.addEventListener("click", handleMainClick);

    billAmount.addEventListener("click", clearBillAlertMessage)
    billAmount.addEventListener("input", () => {
        checkBillAmountValidity();
        updateAndCalculateAmounts();
    });

    customTipOption.addEventListener("click", () => {
        clearSelectedTipOption();
    });

    customTipOption.addEventListener("input", () => {
        checkCustomTipValidity();
        updateAndCalculateAmounts();

    });

    tipOptions.forEach((option, i) => {
        handleSelectedTipOption(option, i);
    });

    noOfPeople.addEventListener("input", () => {
        checkNoOfPeopleValidity();
        updateAndCalculateAmounts();
    });
}


//Bill Section

function checkBillAmountValidity() {
    if (billAmount.value === "") {
        clearBillError();
        setInitialSectionValues();
        disableUISections();
        defaultResultSectionDisplay();
        defaultInputValues();
        tipAmount.classList.remove("text-break");
        totalAmount.classList.remove("text-break");
        return;
    }

    if (billAmountValidator(billAmount.value)) {
        clearBillError();
        bill = parseFloat(billAmount.value);
        updateAndCalculateAmounts();
        enableUISections();
        activateResetButton();
    } else {
        showBillError();
    }
}

function billAmountValidator(bill) {
    const billRegex = /^[0-9]*(\.[0-9]+)?$/;
    return billRegex.test(bill) && bill !== "" && Number(bill) > 0;
}

function showBillError() {
    clearBillError();
    const invalidBillAmount = document.createElement("p");
    invalidBillAmount.textContent = "Invalid Bill Amount";
    invalidBillAmount.classList.add("errorMessage-1");
    billSectionLabels.appendChild(invalidBillAmount);
    billSectionLabels.classList.add("errorFlex-1");
    billAmountWrapper.classList.add("errorAlert-1");

    activateResetButton();
}

function clearBillError() {
    const invalidBillAmount = document.querySelector(".errorMessage-1");
    const errorFlex = document.querySelector(".errorFlex-1");
    const errorAlert = document.querySelector(".errorAlert-1");

    if (errorAlert) {
        billAmountWrapper.classList.remove("errorAlert-1");
    }
    if (errorFlex) {
        billSectionLabels.classList.remove("errorFlex-1");
    }
    if (invalidBillAmount) {
        billSectionLabels.removeChild(invalidBillAmount);
    }
}


//Tip Options

function handleSelectedTipOption(option, i) {
    option.addEventListener("click", () => {
        if (billAmount.value !== "") {
            clearBillAlertMessage();
            clearCustomTipOptionError();
            customTipOption.value = "";
            activateSelectedTipOption(i);
            const tipOptionSelected = document.querySelector(".tipOptionSelected");
            const givenTip = parseInt(option.textContent.replace("%", "")) || 0;
            if (tipOptionSelected) {
                totalTip = (bill * givenTip) / 100;
                updateAndCalculateAmounts();
            }
        } else {
            enterTheBill();
        }
    })
};

function activateSelectedTipOption(i) {
    clearSelectedTipOption();
    tipOptions[i].classList.add("tipOptionSelected");
}

function clearSelectedTipOption() {
    const tipOptionSelected = document.querySelector(".tipOptionSelected");
    if (tipOptionSelected) {
        tipOptionSelected.classList.remove("tipOptionSelected");
    }
}


//Custom Tip Option

function checkCustomTipValidity() {
    if (customTipValidator(customTipOption.value)) {
        clearCustomTipOptionError();
        const customTip = parseInt(customTipOption.value || 0);
        totalTip = (bill * customTip) / 100;
    } else {
        showCustomTipOptionError(customTipOption.value);
    }
}

function customTipValidator(tip) {
    const customOptionRegex = /^[0-9]*(\.[0-9]+)?$/;
    return customOptionRegex.test(tip) && tip !== "" && Number(tip) > 0;
}

function showCustomTipOptionError(tip) {
    clearCustomTipOptionError();
    let errorElement = document.createElement("p");
    errorElement.classList.add("errorMessage-2");

    if (tip === "") {
        errorElement.textContent = "required";
        totalTip = 0;
    } else {
        errorElement.textContent = "invalid!";
        customTipOptionWrapper.classList.add("errorAlert-2");
    }
    customTipOptionList.appendChild(errorElement);
    customTipOptionList.classList.add("errorFlex-2");

    activateResetButton();
}

function clearCustomTipOptionError() {
    const errorMessages = document.querySelectorAll(".errorMessage-2");
    const errorAlert = document.querySelector(".errorAlert-2");
    const errorFlex = customTipOptionList.classList.contains("errorFlex-2");

    errorMessages.forEach((message) => message.remove());

    if (errorAlert) {
        customTipOptionWrapper.classList.remove("errorAlert-2");
    }
    if (errorFlex) {
        customTipOptionList.classList.remove("errorFlex-2");
    }
}


//People Selection

function checkNoOfPeopleValidity() {
    if (noOfPeople.value === "") {
        clearCountError();
        noOfIndividuals = 1;
        return;
    }

    if (noOfPeopleValidator(noOfPeople.value)) {
        clearCountError();
        noOfIndividuals = parseInt(noOfPeople.value);
    } else {
        showCountError();
    }
}

function noOfPeopleValidator(count) {
    const peopleRegex = /^[0-9]+$/;
    return peopleRegex.test(count) && Number(count) > 0;
}

function showCountError() {
    clearCountError();
    const invalidCount = document.createElement("p");
    invalidCount.textContent = "Can't be zero";
    invalidCount.classList.add("errorMessage-3");
    peopleSectionLabels.appendChild(invalidCount);
    peopleSectionLabels.classList.add("errorFlex-3");
    peopleSelectionValueWrapper.classList.add("errorAlert-3");

    activateResetButton();
}

function clearCountError() {
    const invalidCount = document.querySelector(".errorMessage-3");
    const errorFlex = document.querySelector(".errorFlex-3");
    const errorAlert = document.querySelector(".errorAlert-3");

    if (errorAlert) {
        peopleSelectionValueWrapper.classList.remove("errorAlert-3");
    }
    if (errorFlex) {
        peopleSectionLabels.classList.remove("errorFlex-3");
    }
    if (invalidCount) {
        peopleSectionLabels.removeChild(invalidCount);
    }
}


//Result Section

function updateAndCalculateAmounts() {
    if (!bill || bill === 0 || isNaN(bill)) {
        tipAmount.textContent = "$0.00";
        totalAmount.textContent = "$0.00";
        return;
    }
    tipAmountPerPerson();
    totalAmountPerPerson();
    updateGridStyle();
}

function tipAmountPerPerson() {
    const tipPerIndividual = totalTip / noOfIndividuals;
    tipAmount.textContent = formatAmount(tipPerIndividual);
}

function totalAmountPerPerson() {
    const totalAmountPerIndividual = (bill + totalTip) / noOfIndividuals;
    totalAmount.textContent = formatAmount(totalAmountPerIndividual);
}

function formatAmount(amount) {
    return amount % 1 === 0 ? `$${amount.toFixed(0)}` : `$${amount.toFixed(2)}`;
}

function activateResetButton() {
    resetButton.classList.remove("noReset");
    resetButton.addEventListener("click", reset);
}

function reset() {
    clearBillAlertMessage();
    setInitialSectionValues();
    defaultResultSectionDisplay();
    defaultInputValues();
    disableUISections();

    main.classList.add("calcApp__main-section");
    main.classList.remove('update__grid-style');

    tipAmount.classList.remove("text-break");
    totalAmount.classList.remove("text-break");
}


//UI Logic Handlers

function handleMainClick() {
    clearCustomTipOptionError();
    if (customTipValidator(customTipOption.value)) {
        return;
    } else {
        customTipOption.value = "";
    }

    clearBillError();
    if (billAmountValidator(billAmount.value)) {
        return;
    } else {
        billAmount.value = "";
    }

    clearCountError();
    if (noOfPeopleValidator(noOfPeople.value)) {
        return;
    } else {
        noOfPeople.value = "";
    }
};

function setInitialSectionValues() {
    bill = 0;
    noOfIndividuals = 1;
    totalTip = 0;
}

function defaultResultSectionDisplay() {
    tipAmount.textContent = "$0.00";
    totalAmount.textContent = "$0.00";
    resetButton.classList.add("noReset");
}

function defaultInputValues() {
    billAmount.value = "";
    clearSelectedTipOption();
    customTipOption.value = "";
    noOfPeople.value = "";
}

function enterTheBill() {
    clearBillAlertMessage();
    const alertMessage = document.createElement("p");
    alertMessage.textContent = "Please enter the bill";
    alertMessage.classList.add("alertMessage");
    billSectionLabels.appendChild(alertMessage);
    billSectionLabels.classList.add("alertFlex");
    activateResetButton();
}

function clearBillAlertMessage() {
    const alertMessage = document.querySelector(".alertMessage");
    if (alertMessage) {
        billSectionLabels.removeChild(alertMessage);
        billSectionLabels.classList.remove("alertFlex");
    }
}

function disableUISections() {
    disableCustomTipOption();
    disablePeopleSelection();
}

function disableCustomTipOption() {
    customTipOption.value === "";
    customTipOptionList.removeChild(customTipOptionWrapper);
    const temporaryFieldWrapper1 = document.createElement("div");
    const temporaryField1 = document.createElement("p");
    temporaryField1.textContent = "Custom";
    temporaryField1.classList.add("temporaryField-1");
    temporaryFieldWrapper1.appendChild(temporaryField1);
    temporaryFieldWrapper1.classList.add("temporaryField-wrapper-1");
    customTipOptionList.appendChild(temporaryFieldWrapper1);

    if (window.innerWidth <= 1400) {
        temporaryField1.style.maxWidth = "6.968rem";
        temporaryFieldWrapper1.style.padding = "0.375rem 1.083rem 0.375rem 1.188rem";
    }

    temporaryFieldWrapper1.addEventListener("click", enterTheBill);
    temporaryField1.addEventListener("click", enterTheBill);
}

function disablePeopleSelection() {
    noOfPeople.value === "";
    peopleSection.removeChild(peopleSelectionValueWrapper);
    const temporaryFieldWrapper2 = document.createElement("div");
    const temporaryField2 = document.createElement("p");
    temporaryField2.classList.add("temporaryField-2");
    temporaryFieldWrapper2.appendChild(temporaryField2);
    temporaryFieldWrapper2.classList.add("temporaryField-wrapper-2");
    peopleSection.appendChild(temporaryFieldWrapper2);
    temporaryFieldWrapper2.addEventListener("click", enterTheBill);
}

function enableUISections() {
    enableCustomTipOption();
    enablePeopleSelection();
}

function enableCustomTipOption() {
    customTipOptionList.appendChild(customTipOptionWrapper);
    const temporaryFieldWrapper1 = document.querySelector(".temporaryField-wrapper-1");
    customTipOptionList.removeChild(temporaryFieldWrapper1);
    clearBillAlertMessage();
}

function enablePeopleSelection() {
    peopleSection.appendChild(peopleSelectionValueWrapper);
    const temporaryFieldWrapper2 = document.querySelector(".temporaryField-wrapper-2");
    peopleSection.removeChild(temporaryFieldWrapper2);
    clearBillAlertMessage();
}

function updateGridStyle() {
    if (window.innerWidth >= 1400) {
        if (billAmount.value.length >= 4) {
            main.classList.add("update__grid-style");
            main.classList.remove("calcApp__main-section");
            tipAmount.classList.remove("text-break");
            totalAmount.classList.remove("text-break");
        } else {
            main.classList.remove("update__grid-style");
            main.classList.add("calcApp__main-section");
        }
    } else {
        if (billAmount.value.length >= 4) {
            main.classList.remove("update__grid-style");
            main.classList.add("calcApp__main-section");
            totalAmount.classList.add("text-break");
            const tipOptionSelected = document.querySelector(".tipOptionSelected");
            if (tipOptionSelected || customTipOption.value !== "")
                tipAmount.classList.add("text-break");
        }
        else {
            tipAmount.classList.remove("text-break");
            totalAmount.classList.remove("text-break");
        }
    }
}


initializer();


