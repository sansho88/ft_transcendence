import React, {useContext, useEffect, useState} from "react";
import {UserContext} from '@/context/globalContext';
import "../utils/usefulFuncs"
import {Colors, getEnumNameByIndex} from "@/utils/usefulFuncs";

export interface avatarProps {
	path?:string;
	width:string;
	height:string;
	playerStatus:number;
}


const Avatar: React.FC<avatarProps> = ({path, width, height, playerStatus}) => {

	const [statusColor, setStatusColor] = useState(getEnumNameByIndex(Colors, playerStatus));
	const {userContext, setUserContext} = useContext(UserContext);
	const [isUploading, setIsUploading] = useState(false);

	const handleImageClick = () => {
    if (!isUploading) {
      // Ouvrir la boîte de dialogue de sélection de fichier lorsque l'utilisateur clique sur l'avatar
      const fileInput = document.getElementById('file-input');
      if (fileInput) {
        fileInput.click();
      }
    }
  };

	const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setIsUploading(true);
      const selectedFile = event.target.files[0];
      const formData = new FormData();
      formData.append('avatar', selectedFile);

      axios.post('http://localhost:8000/upload', formData)
        .then(response => {
          const newImagePath = response.data; // Assurez-vous que la réponse contient le chemin de la nouvelle image
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

	if (userContext.avatar_path == undefined || userContext.avatar_path?.length == 0)
		path = "/tests/avatar.jpg"

	return (
		<div style={{ position: 'relative' }}>
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
      {isUploading && <div className="upload-progress">Uploading...</div>}
      <input
        type="file"
        id="file-input"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
	)
}

export default Avatar;