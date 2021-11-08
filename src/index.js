import schemaBuilder from "./schemaBuilder.js";
import validate from "./validator.js";
import postData from "./httpService.js";

const API_URL = "https://przeprogramowani.pl/projekt-walidacja";

const inputFields = document.querySelectorAll("form input");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const passwordConfirmInput = document.querySelector("#confirm");
const rodoInput = document.querySelector("#rodo");
const submitButton = document.querySelector("form > button[type=submit]");
const schema = {
  [nameInput.id]: schemaBuilder.required().alphabetic().min(2).label("Name"),
  [emailInput.id]: schemaBuilder.required().email().label("Email"),
  [passwordInput.id]: schemaBuilder
    .required()
    .password()
    .min(8)
    .label("Password"),
  [rodoInput.id]: schemaBuilder.required().boolean().label("Rodo acceptance"),
};

submitButton.addEventListener("click", handleSubmit);

async function handleSubmit(event) {
  event.preventDefault();
  restoreUIToDefault();
  const data = collectData();
  const validationResult = validate(data, schema);
  const allFieldsAreValid = Object.values(validationResult).every(
    (result) => result.isValid
  );
  if (allFieldsAreValid) {
    const confirmValidation = validatePasswordConfirm();
    if (confirmValidation.isValid) {
      await sendData(data);
    } else {
      insertErrorMessageAfter(passwordConfirmInput, confirmValidation.error);
    }

    return;
  }

  insertErrorMessages(validationResult);
}

function collectData() {
  return {
    [nameInput.id]: nameInput.value,
    [emailInput.id]: emailInput.value,
    [passwordInput.id]: passwordInput.value,
    [rodoInput.id]: rodoInput.checked,
  };
}

function validatePasswordConfirm() {
  return validate(
    {
      [passwordConfirmInput.id]: passwordConfirmInput.value,
    },
    {
      [passwordConfirmInput.id]: schemaBuilder
        .required()
        .allows(passwordInput.value)
        .label("Password confirm"),
    }
  )[passwordConfirmInput.id];
}

async function sendData(data) {
  try {
    const response = await postData(API_URL, {
      ...data,
      [passwordConfirmInput.id]: passwordConfirmInput.value,
    });

    if (response.status >= 400) {
      alert(`Failed to send data. Error code: ${response.status}.`);
    } else {
      clearInputs();
      alert("Data sent.");
    }
  } catch (error) {
    alert(`Failed to send data. Error code: ${error}.`);
  }
}

function insertErrorMessages(validationResult) {
  Object.entries(validationResult).forEach(([id, result]) => {
    if (!result.isValid) {
      insertErrorMessageAfter(document.querySelector(`#${id}`), result.error);
    }
  });
}

function insertErrorMessageAfter(referenceNode, message) {
  const errorElement = document.createElement("p");
  errorElement.classList.add("error");
  errorElement.innerText = message;
  referenceNode.classList.add("m-b-0");
  insertAfter(referenceNode, errorElement);
}

function insertAfter(existingNode, newNode) {
  existingNode.parentElement.insertBefore(newNode, existingNode.nextSibling);
}

function restoreUIToDefault() {
  const errorElements = document.querySelectorAll(".error");
  errorElements.forEach((element) => {
    element.remove();
  });

  inputFields.forEach((input) => {
    input.classList.remove("m-b-0");
  });
}

function clearInputs() {
  inputFields.forEach((input) => {
    if (input.type === "checked") {
      input.checked = false;
    } else {
      input.value = "";
    }
  });
}
