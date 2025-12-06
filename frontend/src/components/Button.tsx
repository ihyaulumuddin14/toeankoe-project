import Loader from "./Loader";

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'link';
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  isLoading?: boolean;
  disabled?: boolean;
}

export default function Button({ isLoading = false, disabled, type = 'button', variant = 'primary', children }: ButtonProps ) {
  return (
    <button
      disabled={isLoading || disabled}
      type={type}
      className={`
        mt-10 w-full h-12 rounded-full text-md font-bold transition-colors ${isLoading || disabled ? 'cursor-not-allowed bg-secondary/50' : 'bg-secondary hover:bg-secondary/90 cursor-pointer'}
        text-secondary-foreground flex justify-center items-center
      `}>
        {isLoading ? <Loader/> : children}
    </button>
  )
}
