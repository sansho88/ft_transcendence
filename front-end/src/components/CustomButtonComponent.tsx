import React from "react";

interface ButtonProps {
   border?: string;
   children?: React.ReactNode;
   color?: string;
   image: string;
   height?: string;
   width?: string;
   radius?: string;
   onClick: () => void;
   alt: string;
}
const Button: React.FC<ButtonProps> = ({
    color,
    image,
    children,
    height,
    width,
    onClick,
    alt,
    className
}) => {
   return (
       <button className={className} onClick={onClick}
       style={{
          backgroundColor: color,
          height: height,
          width: width
       }}><img src={image} alt={alt}/>
          {children}
       </button>);
}

export default Button;