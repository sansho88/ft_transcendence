import React, {useContext, useEffect, useState} from "react";

import "./2FAstyleSheet.css"
import {NotificationManager} from 'react-notifications';
import * as apiReq from "@/components/api/ApiReq";
import DraggableComponent from "@/components/draggableComponent";
import QRCode from 'qrcode.react';
import {UserContext} from "@/context/globalContext";
import { getUserMe } from "@/app/auth/Auth";


interface userData2Fa {
    hasActive2FA: boolean
}
const Button2FA: React.FC<userData2Fa> = ({children, hasActive2FA}) => {

	const [qrCodeData, setQrCodeData] = useState("");
  	const [qrCodeGenerated, setQrCodeGenerated] = useState(false);

    const [isActivated, setIsActivated] = useState(hasActive2FA);
    const [code2FA, setCode2FA] = useState("");
    const [turnOffCode2FA, setDeactivationCode2FA] = useState("");
    const [isChecked, setIsChecked] = useState(hasActive2FA ? hasActive2FA : false);
    const [onProcess, setOnProcess] = useState(false);
    const {user, setUserContext} = useContext(UserContext);
    let inputCode: string;

    useEffect(() => {
            if (user)
                setIsChecked(user.has_2fa);
    }, [user]);

	const generateQRCode = async () => {
		try {
		  await apiReq.postApi.postGen2FA().then((res) => {
		    setQrCodeData(res.data.img);
		    setQrCodeGenerated(true);
          });
		} catch (err) {
		}
	};

	useEffect(() => {
		if (!isActivated && !qrCodeGenerated) {
		  generateQRCode();
            setQrCodeGenerated(true);
		}
	  }, [isActivated, qrCodeGenerated]);

    const handleSubmitActivationCode = async (event) => {
        event.preventDefault();
        
        await apiReq.postApi.postCheck2FA(code2FA).then((has_2fa) => {
            if (has_2fa.data === true) {
                getUserMe(undefined).then((res) => {
                    if (res) {
                        setUserContext(res);
                        NotificationManager.success(`2FA activated on ${res.login}`);
                    } 
                });
                setIsChecked(true);
                setIsActivated(true);
                setOnProcess(false);
            }
            else {
                NotificationManager.error("Wrong 2FA code");
                setIsChecked(false);
            }
        }).catch(() => {
            NotificationManager.error("Wrong 2FA code");
            setIsChecked(false);
        });
    }
	const handleSubmitDeactivationCode = async (event) => {
		event.preventDefault();

		await apiReq.postApi.postDisable2FA(turnOffCode2FA).then((res) => {
            if (res.data === true) {
                getUserMe(undefined).then((res) => {
                    if (res) {
                        res.has_2fa = false;
                        setUserContext(res);
                        NotificationManager.success(`2FA turned off on ${res.login}`);
                    }
                });
                setQrCodeGenerated(false);
                setIsChecked(false);
                setIsActivated(false);
                setOnProcess(false);
            }
            else {
                NotificationManager.error(`Wrong Deactivation 2FA code.`);
            }
		}).catch(() => {
			NotificationManager.error(`Wrong Deactivation 2FA code.`);
		});
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
      if (!isActivated)
      {
		  return (
			  <div className={"settings"}>
				  <h1>SCAN THIS QR CODE</h1>
				  <QRCode value={qrCodeData} style={{ margin: "auto" }} />
				  <h1>AND ENTER YOUR CODE:</h1>
				  <form onSubmit={handleSubmitActivationCode}>
					  <input className={"codeInput"}
						  type={"text"} inputMode={"numeric"}
						  id={"code2FA"}
						  name={"validationCode"}
						  value={inputCode}
						  onChange={handleInput2FAChange}
						  min={0} minLength={6} maxLength={6} />
					  <input type={"image"} value={"OK"} className={"submitCode"} src={"/confirm.svg"} />
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
                                 min={0} minLength={6} maxLength={6}/>
                          <input type={"image"} value={"OK"} className={"submitCode"} src={"/confirm.svg"}/>
                      </form>
                  </div>
              )

      }

    }

    const handleCheckboxChange = () => {
    };

    return (
        <span className={"doubleFA"}>
            {children}
            <label className="switch">
                <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} onClick={() => setOnProcess(!onProcess)}/>
                <span className="slider round"></span>
            </label>
            { onProcess &&
                <DraggableComponent>{settings2FA()}</DraggableComponent> }
        </span>
    )
}

export default Button2FA;