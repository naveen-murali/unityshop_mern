import { VALIDATE_DATA } from "./vlidation";

// input handler
export const INPUT_HANDLER = (e, setFormData) => {
  setFormData((preFormData) => {
    const type = e.target.type;
    const name = e.target.name;
    let value = e.target.value;

    if (type === 'checkbox')
      value = e.target.checked;

    let data = VALIDATE_DATA(name, value);
    return { ...preFormData, [name]: data };
  });
};