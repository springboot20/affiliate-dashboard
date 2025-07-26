import * as yup from "yup";

export const passwordRule = /^(?=.*[a-z])(?=.*[A-Z]*)(?=.*\d)(?=.*[-.+@_&]).{6,}$/;
const phoneRule = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s./0-9]*$/;

export const registerSchema = yup.object({
  firstname: yup.string().required("firstname is required"),
  lastname: yup.string().required("lastname is required"),
  email: yup.string().email("Invalid email format entered").required("email is required"),
  phone_number: yup.string().required("phone number is required").matches(phoneRule, {
    message: "❌ Invalid phone number. Ensure it includes the country code (e.g., +123456789).",
  }),
  password: yup
    .string()
    .matches(passwordRule, {
      message:
        "password must be at least 6 long in length and it is expected to contain digits, letter",
    })
    .required("password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});
