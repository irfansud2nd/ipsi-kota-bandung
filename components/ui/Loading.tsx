import { BiLoader } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";
import { RiLoader2Fill } from "react-icons/ri";

type Props = {
  full?: boolean;
  success?: boolean;
  text?: string;
  className?: string;
};

const Loading = ({ full, text, className, success }: Props) => {
  if (full)
    return (
      <div
        className={`w-full h-full flex justify-center items-center ${className}`}
      >
        <div className="flex flex-col gap-3 items-center">
          {success ? (
            <FaCheckCircle className="text-green-500 size-10 sm:size-20" />
          ) : (
            <BiLoader className="animate-spin size-10 sm:size-20" />
          )}
          <h1 className="text-xl sm:text-3xl font-bold text-center">
            {text ?? "Memuat data"}
          </h1>
        </div>
      </div>
    );

  return (
    <span className={`flex items-center ${className}`}>
      <RiLoader2Fill className="size-6 animate-spin" /> {text}
    </span>
  );
};
export default Loading;
