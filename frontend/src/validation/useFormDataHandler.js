import { useState } from "react"
import { INPUT_HANDLER } from "./inputHander";

export const useFormDataHandler = (DEFAULT_FORM_DATA) => {
    const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

    const inputHandler = (e) => INPUT_HANDLER(e, setFormData);

    return { formData, inputHandler, setFormData };
}