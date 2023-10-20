import React, {useContext, useEffect, useState} from "react";
import {UserContext} from '@/context/globalContext';
import "../utils/usefulFuncs"
import {Colors, getEnumNameByIndex} from "@/utils/usefulFuncs";
import { postApi } from "./api/ApiReq";

export interface avatarProps {
	path?:string;
	width:string;
	height:string;
	playerStatus:number;
  isMainProfile?: boolean;
}


const Avatar: React.FC<avatarProps> = ({path, width, height, playerStatus, isMainProfile}) => {


	const [statusColor, setStatusColor] = useState(getEnumNameByIndex(Colors, playerStatus));
	const {userContext, setUserContext} = useContext(UserContext);
	const [isUploading, setIsUploading] = useState(false);
  

	const handleImageClick = () => {
    if (isMainProfile) {
      if (!isUploading) {
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
          fileInput.click();
        }
      }
    }
  };

	const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setIsUploading(true);
      const selectedFile = event.target.files[0];
      const formData = new FormData();
      formData.append('avatar', selectedFile);

      postApi.postUploadAvatar(formData)
        .then(response => {
          const newImagePath = response.data;
          setUserContext({ ...userContext, avatar_path: newImagePath });
          setIsUploading(false);
        })
        .catch(error => {
          console.error('Erreur lors de l\'upload de l\'image', error);
          setIsUploading(false);
        });
    }
  };

	useEffect(() => {
		setStatusColor(getEnumNameByIndex(Colors, playerStatus));
	}, [playerStatus]);

	path = !path ? "/tests/avatar.jpg" : path;
  isMainProfile = isMainProfile === undefined ? false : isMainProfile;
  
	return (
		<div style={{ position: 'relative', float: "left" }}>
      <img
        className={"avatar"}
        src={path}
        alt="Avatar"
        style={{
          borderWidth: "0.15em",
					borderColor: statusColor,
					boxShadow: `0.1em 0.2em 0.5em ${statusColor}`,
					justifyContent: "center",
					alignItems: "center",
					overflow: "hidden",
					transition: "1000ms",
					borderRadius: "8px",
					width: height > width ? width : height,
					height: width > height ? height : width,
					display: "inline-block",
					maxHeight: "100%",
					maxWidth: "100%",
					objectFit: "cover",
					cursor: "pointer",
					marginTop: "20px"
        }}
        onClick={handleImageClick}
      />
      {isMainProfile && isUploading && <div className="upload-progress">Uploading...</div>}
      {isMainProfile && <input
        name="avatar"
        type="file"
        id="file-input"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />}
      
    </div>
	)
}

export default Avatar;