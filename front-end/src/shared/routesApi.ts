'use client'
//mis en commun back-front des ref routesApi, pour facilite' la maintenance/evoluabilite' des routes

//NOTA BENE: jai prevu toutes routes mais surments des changements a prevoir et des routes inutiles
const IP_HOST = () => {
	if (typeof window !== `undefined`) {
		return window.location.hostname;
	} else
		return `localhost`
}

const serverApi = `http://${IP_HOST()}:8000/api` //TODO utiliser le context OriginNetwork

// definition des routes root 🫠
const routeUsers = 'users'
const routeChannels = 'channel'
const routeMessages = 'messages'
const routeGame = 'game';
const routeMatchmaking = 'matchmaking';

const routeWsGame = 'game';


// +---------------------------------------------------------------------+
// |                       		EVENTS GAME WS              	             |
// +---------------------------------------------------------------------+

export namespace wsGameRoutes {
	export const addNewPlayerToServer = () => {
		return `${routeWsGame}_addPlayerToServer`
	}
	export const addPlayerToMatchmaking = () => {
		return `${routeWsGame}_addPlayerToMatchmaking`
	}
	export const addPlayerToMatchmakingGhost = () => {
		return `${routeWsGame}_addPlayerToMatchmakingGhost`
	}
	export const removePlayerToMatchmaking = () => {
		return `${routeWsGame}_removePlayerToMatchmaking`
	}
	export const removePlayerToMatchmakingGhost = () => {
		return `${routeWsGame}_removePlayerToMatchmakingGhost`
	}
	export const createTrainningGame = () => {
		return `${routeWsGame}_createTrainningGame`
	}

	export const serverGameInfo = () => {
		return `${routeWsGame}_serverGameInfo`
	} //retour message concernant le process de matchmaking
	export const serverGameCurrentSession = () => {
		return `${routeWsGame}_serverGameCurrentSession`
	} //list des games en cours
	export const statusUpdate = () => {
		return `statusUpdate`
	} //Update Status en temps reel

}

// +---------------------------------------------------------------------+
// |                       		EVENTS CHAT WS              	             |
// +---------------------------------------------------------------------+
export namespace wsChatRoutesBack {
	export const infoRoom = () => {
		return `infoRoom`
	} //retour message concernant les channel
	export const createRoom = () => {
		return `createRoom`
	}
	export const joinRoom = () => {
		return `joinRoom`
	}
	export const updateRoom = () => {
		return `updateRoom`
	}
	export const leaveRoom = () => {
		return `leaveRoom`
	}
	export const sendMsg = () => {
		return `sendMsg`
	}
	export const createMP = () => {
		return `createMP`
	}
	export const createChallenge = () => {
		return `createChallenge`
	}
	export const responseChallenge = () => {
		return `challengeResponse`
	}

}
export namespace wsChatRoutesClient {
	export const updateChannel = () => {
		return `createRoom`
	}
	export const updateChannelsJoined = () => {
		return `updateChannelsJoined`
	}
	export const nameChannelsHasChanged = () => {
		return `nameChannelsHasChanged`
	}
	export const proposeChallenge = () => {
		return `proposeChallenge`
	}
	export const updateBlockedList = () => {
		return `updateBlocked`
	}


}

//bible des routes
export namespace strRoutes {

// +---------------------------------------------------------------------+
// |                               2FA                                   |
// +---------------------------------------------------------------------+

	export const postGenerate2FA = () => {
		return `${serverApi}/auth/2fa/generate`
	};
	export const postCheck2FA = (token: string) => {
		return `${serverApi}/auth/2fa/check/${token}`
	};
	export const postDisable2FA = (token: string) => {
		return `${serverApi}/auth/2fa/disable/${token}`
	};

// +---------------------------------------------------------------------+
// |                            USERS 42                                 |
// +---------------------------------------------------------------------+

	export const postUser42 = (token: string | null) => {
		return `${serverApi}/auth/42/connect/${token}`
	}
	export const getIntraURL = () => {
		return `${serverApi}/auth/42/getIntraURL/`
	}


// +---------------------------------------------------------------------+
// |                              USERS                                  |
// +---------------------------------------------------------------------+

	export const getIsNicknameIsUsed = () => {
		return `${serverApi}/${routeUsers}/get/nicknameUsed/`
	}
	export const getMe = () => {
		return `${serverApi}/${routeUsers}/me`
	}
	export const getMyRelationships = () => {
		return `${serverApi}/${routeUsers}/me/getRelationships`
	}
	export const getOtherRelationships = (targetId: number) => {
		return `${serverApi}/${routeUsers}/get/Relationships/${targetId}`
	}
	export const getUsersAll = () => {
		return `${serverApi}/${routeUsers}/get/`
	}
	export const getUserById = () => {
		return `${serverApi}/${routeUsers}/get/`
	}
	export const getUserByLogin = () => {
		return `${serverApi}/${routeUsers}/get/`
	}

	export const postUploadAvatar = () => {
		return `${serverApi}/${routeUsers}/upload/avatar`
	}

	export const postUser = () => {
		return `${serverApi}/auth/visit/sign`
	}
	export const postUserCheckLogin = () => {
		return `${serverApi}/auth/visit/login`
	}

	export const putUser = () => {
		return `${serverApi}/${routeUsers}/`
	}

	export const deleteUsersAll = () => {
		return `${serverApi}/${routeUsers}`
	}
	export const deleteUserById = () => {
		return `${serverApi}/${routeUsers}/`
	}



// +---------------------------------------------------------------------+
// |                              GAME                                   |
// +---------------------------------------------------------------------+

	export namespace game {
		export const getGamesAllHistory = () => {
			return `${serverApi}/${routeGame}`
		};		// return: [game] list des games terminées
		export const getGamesAllCurrent = () => {
			return `${serverApi}/${routeGame}`
		};		// return: [game] list des en cours
		export const getGameById = () => {
			return `${serverApi}/${routeGame}/`
		}; 				// params: :gameId
		export const getGamesByUserId = () => {
			return `${serverApi}/${routeGame}/`
		};		// params: :User_id return array gamesHistory dun user (system de page ?)

		export const postGame = () => {
			return `${serverApi}/${routeGame}`
		};							// params: creer une game

		export const putGameById = () => {
			return `${serverApi}/${routeGame}/`
		};					// params: {P1_score P2_score ...etc}

		export const deleteGameById = () => {
			return `${serverApi}/${routeGame}/`
		};			// si game avortée ?

		export const getStatsFromAllUsers = () => {
			return `${serverApi}/${routeGame}/stats/`
		};
		export const getUserStatsById = (userId: number) => {
			return `${serverApi}/${routeGame}/stats/${userId}`
		};
		export const getMyChallenges = () => {
			return `${serverApi}/${routeGame}/myChallenges`
		};

		export const getMatchHistory = () => {
			return `${serverApi}/${routeGame}/myGame`;
		}
		export const getMatchHistoryFromUserId = (userId: number) => {
			return `${serverApi}/${routeGame}/users/${userId}`;
		}

		export const getLeaderboard = () => {
			return `${serverApi}/${routeGame}/leaderboard`
		}
	}

// +---------------------------------------------------------------------+
// |                           MATCHMAKING                               |
// +---------------------------------------------------------------------+

	export const getMatchmaking = () => {
		return `${serverApi}/${routeMatchmaking}/`
	}; 				//List des Match en attente
	export const postMatchmaking = () => {
		return `${serverApi}/${routeMatchmaking}`
	};					//creer un list attente de game
	export const putMatchmakingById = () => {
		return `${serverApi}/${routeMatchmaking}/`
	};
	export const deleteMatchmakingById = () => {
		return `${serverApi}/${routeMatchmaking}/`
	};



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
	export const putModifChannel = (channelID: number)														=> {return `${serverApi}/${routeChannels}/modif/${channelID}`};
	
	export const getMyInvite = ()																									=> {return `/channel/myinvite`};
	export const getInviteChannel = (channelID: number )													=> {return `/channel/invite/${channelID}`};
	export const putInviteChannelRemove = (inviteID: number )										=> {return `/channel/invite/remove/${inviteID}`};
	export const putAddInvite = (channelID: number, userID: number)								=> {return `/channel/invite/add/${channelID}/${userID}`};

	export const putMuteUser = (channelID: number, userID: number, duration: number)		=> {return `${serverApi}/${routeChannels}/mute/${channelID}/${userID}/${duration}`};
	export const putUnmuteUser = (muteID: number)																				=> {return `${serverApi}/${routeChannels}/unmute/${muteID}`};

	export const getAllMuteFromChannel = (channelID: number)														=> {return `${serverApi}/${routeChannels}/get/mute/${channelID}`};

	export const putKickUser = (channelID: number, userID: number)											=> {return `${serverApi}/${routeChannels}/kick/${channelID}/${userID}`};

	export const getAllBanFromChannel = (channelID: number)															=> {return `${serverApi}/${routeChannels}/get/ban/${channelID}`};
	export const putBanUser = (channelID: number, userID: number, duration: number)			=> {return `${serverApi}/${routeChannels}/ban/${channelID}/${userID}/${duration}`};
	export const putUnbanUser = (banID: number)																					=> {return `${serverApi}/${routeChannels}/pardon/${banID}`};

	export const getAllAdminFromChannel = (channelID: number)														=> {return `${serverApi}/${routeChannels}/get/admin/${channelID}`};
	export const putGrantAdmin = (channelID: number, userID: number)										=> {return `${serverApi}/${routeChannels}/grant/admin/${channelID}/${userID}`};
	export const putRevokeAdmin = (channelID: number, userID: number)										=> {return `${serverApi}/${routeChannels}/revoke/admin/${channelID}/${userID}`};
}


// +---------------------------------------------------------------------+
// |                             MESSAGES                                |
// +---------------------------------------------------------------------+

	export const getMessagesByChannelId = ()	=> {return `${serverApi}/${routeChannels}/`}; 	//all messages in channel_id

	export const postMessage = () 						=> {return `${serverApi}/${routeMessages}`};

	export const putMessageById = () 					=> {return `${serverApi}/${routeMessages}/`}; 			//feature ? 	params: message_id

	export const deleteMessageById = () 			=> {return `${serverApi}/${routeMessages}/`};		// feature ?	params: message_id


// +---------------------------------------------------------------------+
// |                             FOLLOW                                  |
// +---------------------------------------------------------------------+
	export namespace relationships {
		export const getAllMyFollowers = () => {
			return `${serverApi}/${routeUsers}/mysubs/`
		};
		export const followUser = (userID: number) => {
			return `${serverApi}/${routeUsers}/follow/${userID}`
		};
		export const unfollowUser = (userID: number) => {
			return `${serverApi}/${routeUsers}/unfollow/${userID}`
		};
		export const blockUser = (userID: number) => {
			return `${serverApi}/${routeUsers}/block/${userID}`
		};
		export const unblockUser = (userID: number) => {
			return `${serverApi}/${routeUsers}/unblock/${userID}`
		};
		export const getBlockedList = ()=> {
			return `${serverApi}/${routeUsers}/block/`};
	}

}
	

