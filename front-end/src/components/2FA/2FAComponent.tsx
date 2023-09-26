import React, {useContext, useEffect, useState} from "react";

import "./2FAstyleSheet.css"
import {NotificationManager} from 'react-notifications';
import * as apiReq from "@/components/api/ApiReq";
import DraggableComponent from "@/components/draggableComponent";
import QRCode from 'qrcode.react';
import {UserContext} from "@/context/globalContext";
import notificationComponent from "@/components/notif/NotificationComponent";


interface userData2Fa {
    login: string,
    secret: string
}
const Button2FA: React.FC = ({className, children, hasActive2FA}) => {
    const [isActivated, setIsActivated] = useState(false);
    const [code2FA, setCode2FA] = useState("");
    const [deactivationCode2FA, setDeactivationCode2FA] = useState("");
    const [isChecked, setIsChecked] = useState(false);
    const {user, setUserContext} = useContext(UserContext);
    let inputCode: string;

    useEffect(() => {
            if (user)
                setIsChecked(user.has_2fa);
    }, [user]);

    const handleSubmitActivationCode = async (event) => {
        event.preventDefault();
        let updatedUser = JSON.parse(localStorage.getItem("userContext"));
        updatedUser.has_2fa = true;
        if (code2FA == '424242')
        {
            apiReq.putApi.putUser(updatedUser)
                .then(() => {
                    setUserContext(updatedUser);
                    setIsChecked(true);
                    setIsActivated(true);
                    NotificationManager.success(`2FA activated on ${user.login}`);
                });
        }
        else
        {
            NotificationManager.error("Wrong 2FA code");
            setIsChecked(false);
        }

       /* try{ //todo: activer ce bloc de code quand le back sera prêt
           const res = await fetch('/api/verify', {
              method: 'POST',
              body: JSON.stringify({ token: code }),
            });
        }
        catch (e) {

        }*/
    }
    const handleSubmitDeactivationCode = async (event) => {
            event.preventDefault();
            let updatedUser = JSON.parse(localStorage.getItem("userContext"));
            updatedUser.has_2fa = false;
            if (code2FA == '848484')
            {
                apiReq.putApi.putUser(updatedUser)
                    .then(() => {
                        setUserContext(updatedUser);
                        setIsChecked(false);
                        setIsActivated(false);
                    });
            }
            else
                NotificationManager.error("Wrong Deactivation 2FA code");

           /* try{ //todo: activer ce bloc de code quand le back sera prêt
               const res = await fetch('/api/verify', {
                  method: 'POST',
                  body: JSON.stringify({ token: code }),
                });
            }
            catch (e) {

            }*/
        }

    const handleInput2FAChange = (e) => {
        inputCode = e.target.value;
        setCode2FA(inputCode);
    }
    const handleInputDeactivation2FAChange = (e) => {
        inputCode = e.target.value;
        setDeactivationCode2FA(inputCode);
    }
    const settings2FA = () => {
        NotificationManager.warning(`isActivated: ${isActivated}`)
      if (!isActivated)
      {
          console.log("Settings 2FA showed")
          return (
              <div className={"settings"}>
                  <h1>SCAN THIS QR CODE</h1>
                  <QRCode value={"https://42lyon.fr"} style={{margin: "1.5em"}}/>
                  <h1>OR ENTER YOUR CODE:</h1>
                  <form onSubmit={handleSubmitActivationCode}>
                      <input className={"codeInput"}
                             type={"text"} inputMode={"numeric"}
                             id={"code2FA"}
                             name={"validationCode"}
                             value={inputCode}
                             onChange={handleInput2FAChange}
                             min={0} minLength={5} maxLength={10}/>
                      <input type={"submit"} value={"OK"} className={"submitCode"} />
                  </form>
              </div>
          )
      }
      else
      {
          return (
                  <div className={"settings"}>
                      <h1>Turn off 2FA now</h1>
                      <form onSubmit={handleSubmitDeactivationCode}>
                          <input className={"codeInput"}
                                 type={"text"} inputMode={"numeric"}
                                 id={"turnOffCode2FA"}
                                 name={"deactivationCode"}
                                 value={inputCode}
                                 onChange={handleInputDeactivation2FAChange}
                                 min={0} minLength={5} maxLength={10}/>
                          <input type={"submit"} value={"OK"} className={"submitCode"} />
                      </form>
                  </div>
              )

      }

    }

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
       /* if (isChecked )
        {
           // settings2FA();

        }
        else
            NotificationManager.warning("2FA is turned off");*/


    };

    return (
        <span className={"doubleFA"}>
            {children}
            <label className="switch">
                <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
                <span className="slider round"></span>
            </label>
            { isChecked &&
                <DraggableComponent>{settings2FA()}</DraggableComponent> }
        </span>
    )
}

export default Button2FA;