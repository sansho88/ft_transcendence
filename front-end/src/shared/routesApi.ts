'use client'
//mis en commun back-front des ref routesApi, pour facilite' la maintenance/evoluabilite' des routes

//NOTA BENE: jai prevu toutes routes mais surments des changements a prevoir et des routes inutiles
  const IP_HOST = () => {
    if (typeof window !== `undefined`){
        return window.location.hostname;
    }
    else
      return `localhost`
  }

	const serverApi = `http://${IP_HOST()}:8000/api` //TODO utiliser le context OriginNetwork
	
// definition des routes root 🫠
	const routeUsers = 					'users'
	const routeChannels = 			'channel'
	const routeMessages = 			'messages'
	const routeGame = 					'game';
	const routeMatchmaking = 		'matchmaking';
	const routeBanned = 				'banned';
	// const routeChannelInvite = 	'channel-invite';
	// const routeMute = 					'mute';
	// const routeChallenge = 			'challenge';
	// const routeFollow = 				'follow';
	// const routeSubscribe = 			'subscribe';
	// const routeBlock = 					'block';
	// const routeJoined = 				'joined';
	// const routeAdministrate = 	'administrate';
	// const routePlay = 					'play';
	
  const routeWsGame =          'game';
  const routeWsChat =          'chat'


// +---------------------------------------------------------------------+
// |                       		EVENTS GAME WS              	             |
// +---------------------------------------------------------------------+

  export namespace wsGameRoutes {
    export const addNewPlayerToServer=()           => {return `${routeWsGame}_addPlayerToServer`}
    export const addPlayerToMatchmaking=()         => {return `${routeWsGame}_addPlayerToMatchmaking`}
    export const addPlayerToMatchmakingGhost=()    => {return `${routeWsGame}_addPlayerToMatchmakingGhost`}
    export const removePlayerToMatchmaking=()      => {return `${routeWsGame}_removePlayerToMatchmaking`}
    export const removePlayerToMatchmakingGhost=() => {return `${routeWsGame}_removePlayerToMatchmakingGhost`}
    export const createTrainningGame=()            => {return `${routeWsGame}_createTrainningGame`}
		
    export const serverGameInfo=()                 => {return `${routeWsGame}_serverGameInfo`} //retour message concernant le process de matchmaking 
    export const serverGameCurrentSession=()       => {return `${routeWsGame}_serverGameCurrentSession`} //list des games en cours
    export const statusUpdate=()       						 => {return `statusUpdate`} //Update Status en temps reel
	
}

// +---------------------------------------------------------------------+
// |                       		EVENTS CHAT WS              	             |
// +---------------------------------------------------------------------+
export namespace wsChatRoutesBack {
	export const infoRoom=()      						  	=> {return `infoRoom`} //retour message concernant les channel
	export const createRoom=()      						  	=> {return `createRoom`} 
	export const joinRoom=()      						   		=> {return `joinRoom`} 
	export const leaveRoom=()      						   		=> {return `leaveRoom`} 
	export const sendMsg=()      						   			=> {return `sendMsg`} 
	
}
export namespace wsChatRoutesClient {
	export const updateChannel=()      						  	=> {return `createRoom`} 
	export const updateChannelsJoined=()    					=> {return `updateChannelsJoined`} 


}

//bible des routes
	export namespace strRoutes {

// +---------------------------------------------------------------------+
// |                            USERS 42                                 |
// +---------------------------------------------------------------------+
	export const postUser42=()							=>{return `${serverApi}/auth/42/connect/`}
	export const getIntraURL=()							=>{return `${serverApi}/auth/42/getIntraURL/`}


// +---------------------------------------------------------------------+
// |                              USERS                                  |
// +---------------------------------------------------------------------+

	export const getIsNicknameIsUsed = () 	=>{return `${serverApi}/${routeUsers}/get/nicknameUsed/`}


	export const getUsersAll=()							=>{return `${serverApi}/${routeUsers}/get/`}
	export const getUserById = () 					=>{return `${serverApi}/${routeUsers}/get/`}
	export const getUserByLogin=()					=>{return `${serverApi}/${routeUsers}/get/`}
		
	export const postUser=()								=>{return `${serverApi}/auth/visit/sign`}
	export const postUserCheckLogin=()			=>{return `${serverApi}/auth/visit/login/`}
		
	export const putUser=()									=>{return `${serverApi}/${routeUsers}/`}

	export const deleteUsersAll=()					=>{return `${serverApi}/${routeUsers}`}
	export const deleteUserById=()					=>{return `${serverApi}/${routeUsers}/`}

// +---------------------------------------------------------------------+
// |                              GAME                                   |
// +---------------------------------------------------------------------+

	export const getGamesAllHistory = () 		=> {return `${serverApi}/${routeGame}`};		// return: [game] list des games terminées
	export const getGamesAllCurrent= () 		=> {return `${serverApi}/${routeGame}`};		// return: [game] list des en cours
	export const getGameById = () 					=> {return `${serverApi}/${routeGame}/`}; 				// params: :gameId
	export const getGamesByUserId = () 			=> {return `${serverApi}/${routeGame}/`};		// params: :User_id return array gamesHistory dun user (system de page ?)

	export const postGame = ()							=> {return `${serverApi}/${routeGame}`};							// params: creer une game

	export const putGameById = () 					=> {return `${serverApi}/${routeGame}/`};					// params: {P1_score P2_score ...etc}
	
	export const deleteGameById = () 				=> {return `${serverApi}/${routeGame}/`};			// si game avortée ?

// +---------------------------------------------------------------------+
// |                           MATCHMAKING                               |
// +---------------------------------------------------------------------+

	export const getMatchmaking = () 				=> {return `${serverApi}/${routeMatchmaking}/`}; 				//List des Match en attente
	export const postMatchmaking = () 			=> {return `${serverApi}/${routeMatchmaking}`};					//creer un list attente de game
	export const putMatchmakingById=() 			=> {return `${serverApi}/${routeMatchmaking}/`};			
	export const deleteMatchmakingById=() 	=> {return `${serverApi}/${routeMatchmaking}/`};	

// +---------------------------------------------------------------------+
// |                             CHANNELS                                |
// +---------------------------------------------------------------------+
export namespace channel {
	// export const postCreateChannel = () 																					=> {return `${serverApi}/${routeChannels}/create`} use WS event
	export const getAll = () 																											=> {return `${serverApi}/${routeChannels}/get`};
	export const getUsersChannel = (channelID: number)														=> {return `${serverApi}/${routeChannels}/get/list/${channelID}`};
	// export const getMsgsChannel = (channelID: number, timestamp: number)					=> {return `${serverApi}/${routeChannels}/get/${channelID}`};
	export const getChannelJoined = ()																						=> {return `${serverApi}/${routeChannels}/channelJoined`};
	export const getAllMessagesChannel = (channelID: number)											=> {return `${serverApi}/${routeChannels}/msg/${channelID}`};


}

// +---------------------------------------------------------------------+
// |                             MESSAGES                                |
// +---------------------------------------------------------------------+

	// export const getMessagesAll = () 		=> {return `${serverApi}/${routeMessages}`};
	// export const getMessageById = () 		=> {return `${serverApi}/${routeMessages}/`};
	export const getMessagesByChannelId=() 	=> {return `${serverApi}/${routeChannels}/`}; 	//all messages in channel_id

	export const postMessage = () 					=> {return `${serverApi}/${routeMessages}`};

	export const putMessageById = () 				=> {return `${serverApi}/${routeMessages}/`}; 			//feature ? 	params: message_id

	export const deleteMessageById = () 		=> {return `${serverApi}/${routeMessages}/`};		// feature ?	params: message_id

// +---------------------------------------------------------------------+
// |                              BANNED                                 |
// +---------------------------------------------------------------------+
		/* services channels */
		/* route ban et unban un user dun channel */
	// export const getBannedByChannelId = () => {return `${serverApi}/${routeBanned}/`}; // params :channelId
	// export const getBannedByUserId = () => {return `${serverApi}/${routeBanned}/`};		// params :userId			| return: Array de tous les chan ou user est ban
	// export const postBannedById= () => {return `${serverApi}/${routeBanned}/`}; 					// params :{channel_Id, userId}
	// export const deleteBannedById = () => {return `${serverApi}/${routeBanned}/`};				// params :{channel_Id, userId}

// +---------------------------------------------------------------------+
// |                         CHANNEL INVITE                              |
// +---------------------------------------------------------------------+
		/* services channels */
	// export const getChannelInviteByChannelId = () => {return `${serverApi}/${routeChannelInvite}/channel/`};
	// export const getChannelInviteByUserId = () => {return `${serverApi}/${routeChannelInvite}/user/`};
	// export const postChannelInvite = () => {return `${serverApi}/${routeChannelInvite}`};
	// export const deleteChannelInviteById = () => {return `${serverApi}/${routeChannelInvite}/`};

// +---------------------------------------------------------------------+
// |                               MUTE                                  |
// +---------------------------------------------------------------------+

	// export const getMuteByChannelId = () => {return `${serverApi}/${routeMute}/channel/`};
	// export const getMuteByUserId = () => {return `${serverApi}/${routeMute}/user/`};
	// export const postMute = () => {return `${serverApi}/${routeMute}`};
	// export const deleteMuteById = () => {return `${serverApi}/${routeMute}/`};

// +---------------------------------------------------------------------+
// |                            CHALLENGE                                |
// +---------------------------------------------------------------------+

	// export const getChallengeByUserId = () => {return `${serverApi}/${routeChallenge}/user/`};
	// export const postChallenge = () => {return `${serverApi}/${routeChallenge}`};
	// export const deleteChallengeById = () => {return `${serverApi}/${routeChallenge}/`};

// +---------------------------------------------------------------------+
// |                             FOLLOW                                  |
// +---------------------------------------------------------------------+

	// export const getFollowByUserId = () => {return `${serverApi}/${routeFollow}/user/`};
	// export const postFollow = () => {return `${serverApi}/${routeFollow}`};
	// export const deleteFollowById = () => {return `${serverApi}/${routeFollow}/`};

// +---------------------------------------------------------------------+
// |                            SUBSCRIBE                                |
// +---------------------------------------------------------------------+

	// export const getSubscribeByUserId = () => {return `${serverApi}/${routeSubscribe}/user/`};
	// export const postSubscribe = () => {return `${serverApi}/${routeSubscribe}`};
	// export const deleteSubscribeById = () => {return `${serverApi}/${routeSubscribe}/`};

// +---------------------------------------------------------------------+
// |                              BLOCK                                  |
// +---------------------------------------------------------------------+

	// export const getBlockByUserId = () => {return `${serverApi}/${routeBlock}/user/`};
	// export const postBlock = () => {return `${serverApi}/${routeBlock}`};
	// export const deleteBlockById = () => {return `${serverApi}/${routeBlock}/`};

// +---------------------------------------------------------------------+
// |                             JOINED                                  |
// +---------------------------------------------------------------------+

	// export const getJoinedByUserId = () => {return `${serverApi}/${routeJoined}/user/`};
	// export const postJoined = () => {return `${serverApi}/${routeJoined}`};
	// export const deleteJoinedById = () => {return `${serverApi}/${routeJoined}/`};

// +---------------------------------------------------------------------+
// |                          ADMINISTRATE                               |
// +---------------------------------------------------------------------+

	// export const getAdministrateByUserId = () => {return `${serverApi}/${routeAdministrate}/user/`};
	// export const postAdministrate = () => {return `${serverApi}/${routeAdministrate}`};
	// export const deleteAdministrateById = () => {return `${serverApi}/${routeAdministrate}/`};

// +---------------------------------------------------------------------+
// |                               PLAY                                  |
// +---------------------------------------------------------------------+

	// export const getPlayByUserId = () => {return `${serverApi}/${routePlay}/user/`};
	// export const postPlay = () => {return `${serverApi}/${routePlay}`};
	// export const deletePlayById = () => {return `${serverApi}/${routePlay}/`};

}
	

