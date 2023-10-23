import { IUser } from '@/shared/types'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import UserList  from '@/components/UserListComponent'
import * as apiReq from '@/components/api/ApiReq'
import Profile from '@/components/ProfileComponent';
import {v4 as uuidv4} from "uuid";


export default function AddUserPrivateChannel({ className, currentChannel, channelID}: 
	{ 
		className: string,
		currentChannel: number,
		channelID: number
	}) {
  const [userListFollo, setUserListFollo] = useState<IUser[]>([]);
  const [userListChan, setUserListChan] = useState<IUser[]>([]);
  const [userList, setUserList] = useState<IUser[]>([]);
  const [popupIsVisible, setPopupIsVisible] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
	const [defineClassName, setDefineClassName] = useState<string>('flex-col')




	const elementClickable = (user: IUser) => { //FIXME: check is good
		function queryInvite(userID: number){
			apiReq.putApi.inviteUserInChannel(userID, channelID)
			.then(() => {})
			.catch((e) => {})
		} 

		return (
			<div key={uuidv4()} className={defineClassName} onClick={() => queryInvite(user.UserID)} >
				<Profile user={user} avatarSize={"medium"}></Profile>
			</div>
			)
	}

	useLayoutEffect(() =>{
		apiReq.getApi.getAllUsersFromChannel(channelID, new Date)
		.then((res) => {
			setUserList(res.data)
		})
	
	}, [])

	useLayoutEffect(() => {
		if (popupIsVisible){

			apiReq.getApi.getAllUsersFromChannel(channelID, new Date)
			.then((res) => {
				const lst = res.data
				setUserListChan(lst)
			})
			apiReq.getApi.getAllMyFollowers()
			.then((res) => {
				// console.log(JSON.stringify(res));
				const tmpLst: IUser[] = res.data.filter((user) => !userList.includes(user))
				setUserListFollo(tmpLst);
			})
		}
	
	}, [popupIsVisible])


  function handleAddUser() {
    return (
			<div className=' h-52 user_private_list'>
				{userListFollo.filter((user) => {return userListChan.filter((chan) => user.UserID !== chan.UserID)}).map((user) => {
					return elementClickable(user)
				})}

			</div>
			)
		// return <UserList adminMode={false} channelID={currentChannel} />;
  }

  return (
    <>
      <div
        className={className}
        onClick={(event) => {
          event.stopPropagation();
          const x = event.clientX;
          const y = event.clientY;
          setPosition({ x, y });
					// console.log('pos x y = ' , position.x , ' ' , position.y)
					if (popupIsVisible === false)
          	setPopupIsVisible(true);
					else
						setPopupIsVisible(false);
        }}
      >
        ➕
      </div>
      {popupIsVisible && (
        <div className='  chat_new_channel_popup_inviteChan translate-y-[-40px] '>
          {handleAddUser()}
        </div>
      )}
    </>
  );
}

