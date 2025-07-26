import * as yup from "yup";

export const passwordRule = /^(?=.*[a-z])(?=.*[A-Z]*)(?=.*\d)(?=.*[-.+@_&]).{6,}$/;

export const registerSchema = yup.object({
  firstname: yup.string().required("firstname is required"),
  lastname: yup.string().required("lastname is required"),
  email: yup.string().email("Invalid email format entered").required("email is required"),
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
