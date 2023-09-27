import React, {useState} from "react";

import "./2FAstyleSheet.css"
import {NotificationManager} from 'react-notifications';
import * as apiReq from "@/components/api/ApiReq";
import DraggableComponent from "@/components/draggableComponent";
import QRCode from 'qrcode.react';


interface userData2Fa {
    login: string,
    secret: string
}
const Button2FA: React.FC<userData2Fa> = ({className, children, login, secret}) => {
    const [isChecked, setIsChecked] = useState(false);
    const [isActivated, setIsActivated] = useState(true);
    const [code2FA, setCode2FA] = useState("");
    let inputCode: string;


    const handleSubmit = async (event) => {
        event.preventDefault();
        NotificationManager.success(`2FA code sent:${code2FA}`);
       /* try{ //todo: activer ce bloc de code quand le back sera prêt
           const res = await fetch('/api/verify', {
              method: 'POST',
              body: JSON.stringify({ token: code }),
            });
        }
        catch (e) {

        }*/
    }

    const handleChange = (e) => {
        inputCode = e.target.value;
        setCode2FA(inputCode);
    }
    const settings2FA = () => {
      if (isActivated)
      {
          console.log("Settings 2FA showed")
          return (
              <div className={"settings"}>
                  <h1>SCAN THIS QR CODE</h1>
                  {/*<img src={"/pong-logo.png"} alt={"PH QR Code"}/>*/}
                  <QRCode value={"https://42lyon.fr"} style={{margin: "1.5em"}}/>
                  <h1>OR ENTER YOUR CODE:</h1>
                  <form onSubmit={handleSubmit}>
                      <input className={"codeInput"}
                             type={"text"} inputMode={"numeric"}
                             id={"code2FA"}
                             name={"validationCode"}
                             value={inputCode}
                             onChange={handleChange}
                             min={0} minLength={5} maxLength={10}/>
                      <input type={"submit"} value={"OK"} className={"submitCode"} />
                  </form>
              </div>
          )
      }
      else
      {
          <h1>Turn off 2FA now</h1>
      }
    }

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
        if (!isChecked)
        {
            NotificationManager.success("2FA is turned on");
            return settings2FA();
        }
        else
            NotificationManager.warning("2FA is turned off");
    };

    return (
        <span className={"doubleFA"}>
            {children}
            <label className="switch">
                <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange}/>
                <span className="slider round"></span>
            </label>
            { isChecked &&
                <DraggableComponent>{settings2FA()}</DraggableComponent> }
        </span>
    )
}

export default Button2FA;