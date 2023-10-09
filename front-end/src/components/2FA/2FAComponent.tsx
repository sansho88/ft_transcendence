import React, {useContext, useEffect, useState} from "react";

import "./2FAstyleSheet.css"
import {NotificationManager} from 'react-notifications';
import * as apiReq from "@/components/api/ApiReq";
import DraggableComponent from "@/components/draggableComponent";
import QRCode from 'qrcode.react';
import {UserContext} from "@/context/globalContext";
import { Router } from "next/router";
import { getUserMe } from "@/app/auth/Auth";


interface userData2Fa {
    hasActive2FA: boolean
}
const Button2FA: React.FC<userData2Fa> = ({className, children, hasActive2FA}) => {

	const [qrCodeData, setQrCodeData] = useState(""); // État pour stocker les données du QR code
  	const [qrCodeGenerated, setQrCodeGenerated] = useState(false); // État pour suivre si le QR code a déjà été généré

    const [isActivated, setIsActivated] = useState(hasActive2FA);
    const [code2FA, setCode2FA] = useState("");
    const [deactivationCode2FA, setDeactivationCode2FA] = useState("");
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
		  const res = await apiReq.postApi.postGen2FA();
		  setQrCodeData(res.data.img);
		  setQrCodeGenerated(true);
		} catch (err) {
		  console.log(err);
		}
	};

	useEffect(() => {
		if (!isActivated && !qrCodeGenerated) {
		  // Appel de l'API seulement si le QR code n'a pas encore été généré
		  generateQRCode();
		}
	  }, [isActivated, qrCodeGenerated]);

    const handleSubmitActivationCode = async (event) => {
        event.preventDefault();
        
        await apiReq.postApi.postCheck2FA(code2FA).then((res) => {
            getUserMe(undefined).then((res) => {
                if (res) {
                    setUserContext(res);
                    NotificationManager.success(`2FA activated on ${res.login}`);
                } 
            });
            setIsChecked(true);
            setIsActivated(true);
            setOnProcess(false);
        }).catch((err) => {
            NotificationManager.error("Wrong 2FA code");
            setIsChecked(false);
        });
    }
	const handleSubmitDeactivationCode = async (event) => {
		event.preventDefault();

		await apiReq.postApi.postDisable2FA().then((res) => {
			getUserMe(undefined).then((res) => {
				if (res) {
					setUserContext(res);
					NotificationManager.success(`2FA activated on ${res.login}`);
				}
			});
			setIsChecked(false);
			setIsActivated(false);
			setOnProcess(false);
		}).catch((err) => {
			NotificationManager.error(`Wrong Deactivation 2FA code.\nThis is not ${deactivationCode2FA}`);
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
    const settings2FA = async () => {
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

    const handleCheckboxChange = (event) => {
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