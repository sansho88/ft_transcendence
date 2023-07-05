import React from "react";

interface ButtonProps {
   border: string;
   children?: React.ReactNode;
   color: string;
   image: string;
   height: string;
   width: string;
   radius: string;
   onClick: () => void;
}
const Button: React.FC<ButtonProps> = ({
   border,
   color,
    image,
   children,
   height,
   onClick,
   radius,
   width
}) => {
   return (
       <button onClick={onClick}
       style={{
          backgroundColor: color,
           backgroundImage: image,
          border,
          borderRadius: radius,
          height,
          width
       }}>
          {children}
       </button>);
}

export default Button;