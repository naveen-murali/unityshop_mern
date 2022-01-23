
export const VALIDATE_DATA = (name, value) => {
  const data = {
    value,
    error: false
  };

  switch (name) {
    case "name":
      return nameValidation(data);

    case "email":
      return emailValidation(data);

    case "phone":
      return phoneValidation(data);

    case "password":
      return passwordValidation(data);

    case "confirmPassword":
      return passwordValidation(data);

    case "address":
      return addressValidation(data);

    case "city":
      return cityValidation(data);

    case "postalCode":
      return postalCodeValidation(data);

    case "contry":
      return countryValidation(data);

    default:
      return data;
  }
};

function nameValidation(data) {
  let pattern = /^[a-zA-Z ]{3,}$/i;
  if (!data.value.match(pattern))
    data.error = true;

  return data;
}

function emailValidation(data) {
  let pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  data.value = data.value.trim();

  if (!data.value.match(pattern)) {
    data.error = true;
  }

  return data;
}

function phoneValidation(data) {
  data.value = data.value.trim();

  if (!data.value.match(/^[0-9]{10}$/i))
    data.error = true;

  return data;
}

function passwordValidation(data) {
  data.value = data.value.trim();

  let pattern = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-z]).*$/i;
  if (!data.value.match(pattern))
    data.error = true;

  return data;
}

const addressValidation = (data) => {
  if (data.value.length < 6)
    data.error = true;

  return data;
};

const cityValidation = (data) => {
  return data;
};

const postalCodeValidation = (data) => {
  data.value.trim();

  if (!data.value.match(/^[0-9]{6}$/i))
    data.error = true;

  return data;
};

const countryValidation = (data) => {
  return data;
};