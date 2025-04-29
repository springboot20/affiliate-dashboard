import { classNames } from "@/utils";
import { Field } from "formik";

export const InputField: React.FC<{
  name: string;
  label: string;
  type?: string;
  disabled?: boolean;
  maxLength?: number;
  className?: string;
  fieldSet_class?: string;
}> = ({
  name,
  label,
  type = "text",
  disabled = false,
  maxLength,
  className = "",
  fieldSet_class = "",
}) => {
  return (
    <fieldset className={fieldSet_class}>
      <label htmlFor={name} className="capitalize text-xs font-normal text-affiliate-black">
        {label}
      </label>
      <Field
        type={type}
        name={name}
        id={name}
        disabled={disabled}
        maxLength={maxLength}
        className={classNames(
          "block w-full px-3 rounded-lg text-[#718EBF] py-2 focus:ring-2 focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none lg:py-3 border border-[#DFEAF2]",
          disabled ? "bg-gray-50 cursor-not-allowed" : "",
          className
        )}
      />
    </fieldset>
  );
};
