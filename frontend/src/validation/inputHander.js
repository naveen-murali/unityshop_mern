import { VALIDATE_DATA } from "./vlidation";

// input handler
export const INPUT_HANDLER = (e, setFormData) => {
    setFormData((preFormData) => {
      const name = e.target.name;
      const value = e.target.value;
      
      let data = VALIDATE_DATA(name, value);
      return { ...preFormData, [name]: data }
    });
}