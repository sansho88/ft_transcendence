import { MouseEventHandler } from "react";
import './btn_dbg.css'

interface ButtonDBG {
	f: MouseEventHandler<HTMLButtonElement>;
	text: string;
}

export default function ButtonDBG({param}: {param: ButtonDBG}) {
  return (
    <button  className='button_dbg' onClick={param.f} >{param.text}</button>
  );
}
//'bg-indigo-700 h-10 w-40'
