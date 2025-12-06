import { EyeClosed, Eye } from 'lucide-react';
import React, { forwardRef } from 'react'
import { AnimatePresence, motion } from "motion/react"

type InputProps = {
  label: string;
  children?: React.ReactNode;
  isPassword?: boolean;
  placeholder?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>((
  { placeholder, children, label, isPassword = false, error, ...props }, ref
) => {
  const [reveal, setReveal] = React.useState(false);
  
  return (
    <div className='flex flex-col gap-1'>
      <label className='w-full relative h-16 flex gap-2'>
        <div className='aspect-square rounded-md bg-secondary text-secondary-foreground flex justify-center items-center p-3 absolute top-1/2 -translate-y-1/2 left-2'> 
          {children}
        </div>
    
        <p className={`text-xs font-light absolute top-2 ${children ? 'left-18' : 'left-2'}`}>{label}</p> 
    
        <input
          {...props}
          ref={ref}
          type={!reveal && isPassword ? 'password' : 'text'}
          className='w-full h-full bg-secondary/10 rounded-md pl-18 text-md pt-4 pr-8 focus:border-primary transition-all'
          placeholder={placeholder}
          />
    
        {isPassword && (
          <div
            className='absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer p-2'
            onClick={() => setReveal(prev => !prev)}>
              <AnimatePresence mode="popLayout">
                {reveal ? (
                  <motion.div
                    key="eye"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Eye />
                  </motion.div>
                ) : (
                  <motion.div
                    key="eye-closed"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <EyeClosed />
                  </motion.div>
                )}
              </AnimatePresence>

          </div>
        )}
      </label>

      {error && <p className='text-xs font-light text-pink-600'>{ error }</p>}
    </div>
  )
})

Input.displayName = 'Input'

export default Input