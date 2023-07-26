//mis en commun back-front des ref routesApi, pour facilite' la maintenance/evoluabilite' des routes

//NOTA BENE: jai prevu toutes routes mais surments des changements a prevoir et des routes inutiles

	const serverApi = "http://localhost:8000/api" //TODO utiliser le context OriginNetwork
	
// definition des routes root 🫠
	const routeUsers = 					'users'
	const routeChannels = 			'channels'
	const routeMessages = 			'messages'
	const routeGame = 					'game';
	const routeMatchmaking = 		'matchmaking';
	const routeBanned = 				'banned';
	const routeChannelInvite = 	'channel-invite';
	const routeMute = 					'mute';
	const routeChallenge = 			'challenge';
	const routeFollow = 				'follow';
	const routeSubscribe = 			'subscribe';
	const routeBlock = 					'block';
	const routeJoined = 				'joined';
	const routeAdministrate = 	'administrate';
	const routePlay = 					'play';
	
//bible des routes
	export namespace strRoutes {

// +---------------------------------------------------------------------+
// |                              USERS                                  |
// +---------------------------------------------------------------------+

	export const getUsersAll=()							=>{return `${serverApi}/${routeUsers}`}
	export const getUserById = () 					=>{return `${serverApi}/${routeUsers}/`}
	export const getUserByLogin=()					=>{return `${serverApi}/${routeUsers}/login/`}
		
	export const postUser=()								=>{return `${serverApi}/${routeUsers}`}
	export const postUserCheckLogin=()			=>{return `${serverApi}/${routeUsers}/login/`}
		
	export const putUser=()									=>{return `${serverApi}/${routeUsers}/`}

	export const deleteUsersAll=()					=>{return `${serverApi}/${routeUsers}`}
	// export const deleteUsersAll=()					=>{return `http://localhost:8000/api/users`}
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

	export const getChannelsAll = () 				=> {return `${serverApi}/${routeChannels}`};								//list de tous les channels
	export const getChannelsAllPublic = ()	=> {return `${serverApi}/${routeChannels}/public`};	//list de tous les channels public
	export const getChannelById = () 				=> {return `${serverApi}/${routeChannels}/`};							//params: :Channel_Id
	
	export const postChannel = () 					=> {return `${serverApi}/${routeChannels}`};									
	
	export const putChannelById = () 				=> {return `${serverApi}/${routeChannels}/`};
	
	export const deleteChannelById = () 		=> {return `${serverApi}/${routeChannels}/`};

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
	export const postBannedById= () => {return `${serverApi}/${routeBanned}/`}; 					// params :{channel_Id, userId}
	export const deleteBannedById = () => {return `${serverApi}/${routeBanned}/`};				// params :{channel_Id, userId}

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
	
