import React from "react";

interface ButtonProps {
   border?: string;
   children?: React.ReactNode;
   color?: string;
   image: string;
   height?: string;
   width?: string;
   radius?: string;
   onClick: (event: any | undefined) => void;
   alt: string;
   title?: string;
    margin?: string;
}
const Button: React.FC<ButtonProps> = ({
    color,
    image,
    children,
    height,
    width,
    onClick,
    alt,
    className,
    id,
    margin,
    title
}) => {
   return (
       <button id={id} className={className} onClick={onClick} title={title}
       style={{
          backgroundColor: color,
          height: height,
          width: width,
           margin: margin
       }}><img src={image} alt={alt}/>
          {children}
       </button>);
}

export default Button;