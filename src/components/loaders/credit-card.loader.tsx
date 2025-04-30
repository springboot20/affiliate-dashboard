import { Children } from "react";
import Skeleton from "react-loading-skeleton";

export const CreditCardLoader: React.FC<{
  length?: number;
  classname?:string
}> = ({ length = 2, classname = "" }) => {
  return Children.toArray(
    Array.from({ length }, (_) => (
      <Skeleton
        className="h-full"
        borderRadius={30}
        containerClassName={classname}
      />
    ))
  );
};
