'use client'
import { useContext, useEffect, useRef, useState } from 'react'
import { UserContext, SocketContextGame, LoggedContext} from '@/context/globalContext'
import { useRouter } from 'next/navigation'
import { IUser } from '@/shared/types'
import * as PODGAME from '@/shared/typesGame'
import * as apiRoutes from '@/shared/routesApi'
import * as ClipLoader from 'react-spinners'
import { table } from 'console'

enum EStatusFrontGame {
  idle,
  matchmakingRequest,
  gameSessionFind,
  waiting,
  countdown,
  gameInProgress,
  endOfGame
}

// interface scoringBoard{
//   P1: Partial<IUser>;
//   P2: Partial<IUser>;
//   scoreP1: 
// }

export default function Game({className}: {className: string}) {
  const socket      = useContext(SocketContextGame);
  const socketRef   = useRef(socket);
  
  const {logged}    = useContext(LoggedContext);
  const userLogged  = useContext(UserContext);
  const router      = useRouter();


  const tableRef    = useRef<HTMLDivElement>(null);
  const pad1Ref     = useRef<HTMLDivElement>(null);
  const pad2Ref     = useRef<HTMLDivElement>(null);
  const ballRef     = useRef<HTMLDivElement>(null);


  const [nameGameSession, setNameGameSession] = useState<string>("");
  const [stepCurrentSession, setStepCurrentSession] = useState<EStatusFrontGame>(EStatusFrontGame.idle);
  const [buttonText, setButtonText] = useState<string>("SEARCH GAME");
  const [remoteEvent, setRemoteEvent] = useState<string>("");
  // const remoteEvent = useRef<string>('');
  
  // const [paddleSize, setPaddleSize]  = useState<PODGAME.IVector2D>({x: 10, y: 60}); //taille par default
  const [p1Size, setP1Size]             = useState<PODGAME.IVector2D>({x: 10, y: 60}); //taille par default avant connection
  const [p2Size, setP2Size]             = useState<PODGAME.IVector2D>({x: 10, y: 60}); //taille par default avant connection
  const [ballSize, setBallSize]         = useState<PODGAME.IVector2D>({x: 18, y: 18}); //taille par default avant connection



  // const [p1Position, setP1Position]     = useState<number>(250);
  // const [p2Position, setP2Position]     = useState<number>(250);
  const [p1Position, setP1Position]     = useState<PODGAME.IVector2D>({x: -1, y: -1});
  const [p2Position, setP2Position]     = useState<PODGAME.IVector2D>({x: -1, y: -1});
  const [ballPosition, setBallPosition] = useState<PODGAME.IVector2D>({x: 0, y: 0});
  const [ballHidden, setBallHidden]     = useState<boolean>(true);
  
  const [userP1, setUserP1]             = useState<Partial<IUser>>({});
  const [userP2, setUserP2]             = useState<Partial<IUser>>({});
  const [scoreP1, setScoreP1]           = useState<number>(0);
  const [scoreP2, setScoreP2]           = useState<number>(0);
  
  const [infoMessage, setInfoMessage]   = useState<string>('PLAY');
  
  const coefTableServer                 = useRef<PODGAME.IVector2D>({x: 1, y: 1});

	useEffect(() => {
	  if (nameGameSession === "") {
	    return;
	  }
	  console.log(
	    `Vous venez de rejoindre la session de jeu : ${nameGameSession}\nLe match va bientot commencer`
	  );
    setStepCurrentSession(EStatusFrontGame.gameSessionFind);
	}, [nameGameSession]);
	
	useEffect(() => {
	  if (!logged) {
	    router.push('/auth'); // for dev
	    console.error("your are not logged!");
	  }
	}, [logged]);


  function calculCoefTableServer(servSize: PODGAME.IVector2D) {
    if (tableRef.current) {
      coefTableServer.current = {x:  tableRef.current?.offsetWidth / servSize.x , y: tableRef.current?.offsetHeight / servSize.y}
    }
  }
    /*-----------------------------------------------------------------------------------------------------------*\
    |                                                                                                             |
    |                                     SOCKET ON SUBCRITE EVENT                                                |
    |                                                                                                             |
    /*-----------------------------------------------------------------------------------------------------------*/ 
	useEffect(() => {
	  if (!socketRef.current?.connected)
	    socketRef.current?.connect();
	  if (socketRef.current?.connected && typeof socketRef.current !== 'string') {
	
	    socketRef.current.on('info', (data) => {
	      console.log(`WS info recu: ${JSON.stringify(data)}`);
	    })
	
	    socketRef.current.on('infoGameSession', (data: PODGAME.IGameSessionInfo) => {
        // tableServerCoef.current = {x: data.startInitElement.tableServerSize.x / window. //taille en x de la div parent au component}
        setNameGameSession(data.gameName);
        setUserP1(data.player1);
        setUserP2(data.player2);
        setBallSize(data.startInitElement.ballSize);
        setP1Position({x: data.startInitElement.paddleP1Pos.x, y: data.startInitElement.paddleP1Pos.y})
        setP2Position({x: data.startInitElement.paddleP2Pos.x, y: data.startInitElement.paddleP2Pos.y})
	      console.log(`WS name session recu: ${JSON.stringify(data)}`);
	    })
	
      //client 
	    socketRef.current.on('gameFind', (data) => {
	      if (stepCurrentSession === EStatusFrontGame.matchmakingRequest) {
	        setStepCurrentSession(EStatusFrontGame.gameSessionFind)
	      }
	      setRemoteEvent(data.remoteEvent)
	      console.log(`WS gameFind recu: ${JSON.stringify(data)}`);
	    })


	    socketRef.current.on('countdown', (data) => {
        if (stepCurrentSession !== EStatusFrontGame.countdown)
          setStepCurrentSession(EStatusFrontGame.countdown);
        setInfoMessage(data);
	      // console.log(`WS countdown: ${JSON.stringify(data)}`);
	    })
	
	    socketRef.current.on('startGame', () => {
        setStepCurrentSession(EStatusFrontGame.gameInProgress);
        setBallHidden(false);
	    })

	    socketRef.current.on('endgame', (data) => {
        if (stepCurrentSession !== EStatusFrontGame.endOfGame)
          setStepCurrentSession(EStatusFrontGame.endOfGame);
        setNameGameSession('');
        setRemoteEvent('');
        setBallHidden(true);
        if (tableRef && tableRef.current && tableRef.current.offsetHeight){
          const offsetHeight = tableRef.current.offsetHeight;
          setP1Position(prevState => ({
            x: prevState.x,
            y: (offsetHeight / 2)
          }));
          setP2Position(prevState => ({
            x: prevState.x,
            y: (offsetHeight / 2)
          }));;
        }
        setInfoMessage(data);
	      console.log(`WS endgame: ${JSON.stringify(data)}`);
	    })

	    socketRef.current.on('reset', () => {
	      console.log(`WS RESET`);
        resetPositionPaddle();
        setInfoMessage('PLAY');
        setScoreP1(0);
        setScoreP2(0);
        setUserP1({});
        setUserP2({});
        setStepCurrentSession(EStatusFrontGame.idle);
	    })



	    socketRef.current.on('setup', (data) => { //TODO: recup via ws le setup de la table
	      console.log(`WS setup recu: ${JSON.stringify(data)}`); //recupere taille des elements paddle et balle
	    })
	

    /*-----------------------------------------------------------------------------------------------------------*\
    |                                               TABLE UPDATE                                                  |
    /*-----------------------------------------------------------------------------------------------------------*/  
      socketRef.current.on('updateTable', (data: PODGAME.IPodTable) => {
        // console.log(JSON.stringify(data))
        if(tableRef.current){
          // coefTableServer.current = {x:  tableRef.current?.offsetWidth / data.tableSize.x , y: tableRef.current?.offsetHeight / data.tableSize.y}
          calculCoefTableServer(data.tableSize);
          setP1Position({x: data.positionP1v.x * coefTableServer.current.x, y: data.positionP1v.y * coefTableServer.current.y})
          setP2Position({x: data.positionP2v.x * coefTableServer.current.x, y: data.positionP2v.y * coefTableServer.current.y})
          setBallPosition({x: data.positionBall.x * coefTableServer.current.x, y: data.positionBall.y * coefTableServer.current.y});
          setP1Size({x: data.sizeP1.x * coefTableServer.current.x, y: data.sizeP1.y * coefTableServer.current.y})
          setP2Size({x: data.sizeP2.x * coefTableServer.current.x, y: data.sizeP2.y * coefTableServer.current.y})
          setBallSize({x: data.sizeBall.x * coefTableServer.current.x, y: data.sizeBall.y * coefTableServer.current.y})

        }
        setScoreP1(data.scoreP1);
        setScoreP2(data.scoreP2);

			//ball position
	      // console.log(`WS updateTable : ${JSON.stringify(data)}`); //recupere la position du paddles 1
        // console.log(`dim table x:${tableRef.current?.offsetWidth} y:${tableRef.current?.offsetHeight}`)
	    })
     }
  // return () => {socketRef.current?.close};
	}, []);

	const arrowUp = useRef<boolean>(false);
	const arrowDown = useRef<boolean>(false);


	useEffect(() => {
    if (remoteEvent) {
			const keyDownHandler = (e) => {
				if (e.key === 'ArrowUp' && !arrowUp.current) {
					arrowUp.current = true;
					console.log(`${remoteEvent.slice(-7)}: UP pressed`);
					socketRef.current?.emit(remoteEvent, PODGAME.EKeyEvent.arrowUpPressed);
        }
				if (e.key === 'ArrowDown' && !arrowDown.current) {
					arrowDown.current = true;
					console.log(`${remoteEvent.slice(-7)}: DOWN pressed`);
					socketRef.current?.emit(
						remoteEvent,
						PODGAME.EKeyEvent.arrowDownPressed,
					);
				}
			};

			const keyUpHandler = (e) => {
				if (e.key === 'ArrowUp') {
					arrowUp.current = false;
					console.log(`${remoteEvent.slice(-7)}: UP release`);
					socketRef.current?.emit(
						remoteEvent,
						PODGAME.EKeyEvent.arrowUpRelease,
					);
				}
				if (e.key === 'ArrowDown') {
					arrowDown.current = false;
					console.log(`${remoteEvent.slice(-7)}: DOWN release`);
					socketRef.current?.emit(
						remoteEvent,
						PODGAME.EKeyEvent.arrowDownRelease,
					);
				}
			};

			window.addEventListener('keydown', keyDownHandler);
			window.addEventListener('keyup', keyUpHandler);

			return () => {
				window.removeEventListener('keydown', keyDownHandler);
				window.removeEventListener('keyup', keyUpHandler);
			};
		}
	}, [remoteEvent]);
	
	
	useEffect(() => {
	  if (remoteEvent)
	    console.log(`YOU ARE ${remoteEvent.slice(-7)} , your remoteEvent is ${remoteEvent}`);
	}, [remoteEvent])
	
	
	interface TableProps {
	  className?: string;
	  tableRef: React.RefObject<HTMLDivElement>;
	  children?: React.ReactNode; // add this line
	}
	
	const Table: React.FC<TableProps> = ({className, tableRef, children}) => {
	  return (
      <div ref={tableRef} className={`${className} rounded-xl bg-blue-game`} 
	    style={{
        boxShadow: "0 0 150px  40px rgba(170, 170, 255, 0.4)" 
      }}> 
      {/* <div className="relative pb-[75%]"></div> */}
      {/* <div className="absolute inset-0 flex items-center justify-center"></div> */}
	      {children} 
	    </div>
	  )
	}
	
  const Ball = () => {
    return (
      <div ref={ballRef} style={{
        position: 'absolute',
        width: `${ballSize.x}px`,
        height: `${ballSize.y}px`,
        top: `${ballPosition.y}px`,
        left: `${ballPosition.x}px`,
        transform: 'translate(-50%, -50%)', // pour cebntrer le point de pivot de la balle par son centre
        borderRadius: '1%',
        backgroundColor: 'black',
    }} />
    )
  }

  const Scoreboard = () => {
    return (
      <div className=' game-scoreboard relative'>
        {nameGameSession &&
          <div className='game-scoreboard-left'>{`${userP1.nickname} `}
            <div className='game-scoreboard-left-score'>{`${scoreP1}`}</div>
          </div>
          }
          {nameGameSession && 
          <div className='game-scoreboard-right' >{`${userP2.nickname} `}
            <div className='scogame-scoreboard-right-score'>{`${scoreP2}`}
            </div>
          </div>
          }
      </div>
    )
  
  }

	const Player = ({className, position, refDiv}: 
	  {className?: string, position: 'left' | 'right', refDiv: React.RefObject<HTMLDivElement>}) 
	    :React.JSX.Element => {

        // if(p1Position.x < 0 || p1Position.y < 0)
        // {
        //   if(tableRef && tableRef.current) {
        //     setP1Position({x: tableRef.current?.offsetWidth * 0.014, y: (tableRef.current.offsetHeight / 2) - (p1Size.y / 2)});
        //     setP2Position({x: (tableRef.current.offsetWidth) - (tableRef.current?.offsetWidth * 0.014) - p2Size.y, y: (tableRef.current.offsetHeight / 2) - (p2Size.y / 2)});
        //   }
        // }
        //TODO: position x ??
    return (
      <>
        {position === 'left' ? 

        <>
          <div  ref={refDiv} className={`${className}`} style={{height: p1Size.y, width: p1Size.x, top: `${p1Position.y}px`, left: `${p1Position.x}px`}} />
          {nameGameSession &&
          <div className=' game-scoreboard game-scoreboard-left'>{`${userP1.nickname} `}
            <div className='game-scoreboard-score'>{`${scoreP1}`}</div>
          </div>
          }
        </>
        :
        <>
          <div ref={refDiv} className={`${className}`} style={{height: p2Size.y, width: p2Size.x, top: `${p2Position.y}px`, left: `${p2Position.x}px`}} />
          {nameGameSession && 
          <div className=' game-scoreboard game-scoreboard-right'>{`${userP2.nickname} `}
            <div className='game-scoreboard-score'>{`${scoreP2}`}
            </div>
          </div>
          }
        </>

        } 

      </>
      // <>HELLO PADLE</>
    )
  }

  function dbgAddPlayerGoal() {
    console.log('GOALASOOOOO');
    socketRef.current?.emit(`${nameGameSession}GOAL`);
  }

  function stopGameAndLose() {
    console.log('YOU LOSE');
    socketRef.current?.emit(`${nameGameSession}STOP`);
    setStepCurrentSession(EStatusFrontGame.idle);
  }

  function cancelMatchmaking() {
    console.log('CANCEL MATCHMAKING');
    socketRef.current?.emit(apiRoutes.wsGameRoutes.removePlayerToMatchnaking(), userLogged.userContext);
    setStepCurrentSession(EStatusFrontGame.idle);
  }

  function handleSearchGame() {
    const login     = userLogged.userContext?.login
    let nickname    = userLogged.userContext?.login;
    let id_user     = userLogged.userContext?.id_user;
    if (nickname === undefined)
      nickname = userLogged.userContext?.nickname
    if (stepCurrentSession === EStatusFrontGame.idle) {
      setInfoMessage('PLAY');
			socketRef.current?.emit(`${apiRoutes.wsGameRoutes.addPlayerToMatchnaking()}`, {
        id_user: id_user,
				login: login,
				nickname: nickname,
			});
      setStepCurrentSession(EStatusFrontGame.matchmakingRequest);
			console.log("Cancel matchmaking not implemented for the moment");
      return;
		}
    else if (stepCurrentSession === EStatusFrontGame.matchmakingRequest) {
      setStepCurrentSession(EStatusFrontGame.gameSessionFind);
			console.log("Match trouvé ! le jeu va bientot commencer, etes vous pret?");
      return;
		}
    else if (stepCurrentSession === EStatusFrontGame.gameSessionFind) {
      console.log(`GameSessionName = ${nameGameSession}`)
      socketRef.current?.emit(`${nameGameSession}ready`);
      setStepCurrentSession(EStatusFrontGame.waiting);
      console.log("le jeu a commencer.. Bonne chance !");
      return;
		}
    else if (stepCurrentSession === EStatusFrontGame.gameInProgress) {
      setStepCurrentSession(EStatusFrontGame.endOfGame);
      console.log("le jeu est terminé !"); 
      return;
		}
  }

  function resetPositionPaddle() {
    if(p1Position.x < 0 || p1Position.y < 0)
    {
      if(tableRef && tableRef.current) {
        setP1Position({x: tableRef.current?.offsetWidth * 0.014, 
                       y: (tableRef.current.offsetHeight / 2) - (p1Size.y / 2)});
        setP2Position({x: (tableRef.current.offsetWidth) - (tableRef.current?.offsetWidth * 0.014) - (p2Size.x), 
                       y: (tableRef.current.offsetHeight / 2) - (p2Size.y / 2)});
      }
    }
  }

  useEffect(() => {
    resetPositionPaddle();
  }, []);

  useEffect(() => {
    console.log(`CurrentStep = ${stepCurrentSession}`);
    // handleSearchGame();
  }, [stepCurrentSession]);

  return (
    <div className={`${className} `}>
      <Table tableRef={tableRef} className='w-full h-full relative font-vt323'>
        {/* <Scoreboard/> // bugger*/}

        <Player className='bg-black absolute ' position='left' refDiv={pad1Ref} /> 
        <Player className='bg-black absolute'  position='right' refDiv={pad2Ref} />
        {!ballHidden && <Ball/>}
        {stepCurrentSession === EStatusFrontGame.idle &&
            <div className='absolute -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2  text-gray-700 text-7xl'>{infoMessage}</div> }
        {stepCurrentSession === EStatusFrontGame.countdown &&
          <div className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-gray-700 text-9xl'>{infoMessage}</div>  }
        {stepCurrentSession === EStatusFrontGame.endOfGame &&
          <div className='text-center absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2  text-gray-700 text-xl'>{infoMessage}</div>  }
      </Table>

        <div className='flex justify-center items-center left-1/2 text-xl text-gray-700 h-20'> 
          {stepCurrentSession === EStatusFrontGame.idle &&
            <button className='text-white' onClick={() => handleSearchGame()}>PLAY</button> }
          {stepCurrentSession === EStatusFrontGame.matchmakingRequest &&
            <div className='flex space-x-5 items-center'>
              <button className='text-white' onClick={() => cancelMatchmaking()}>CANCEL MATCHMAKING</button><ClipLoader.ClipLoader color="#36d7b7" />
            </div> }
     
          {stepCurrentSession === EStatusFrontGame.waiting &&
            <>
              <div className='text-red-700 mr-4'>Waiting </div><ClipLoader.ClipLoader color="#36d7b7" />
            </>
          }
          {stepCurrentSession === EStatusFrontGame.gameInProgress &&
          <div className='flex flex-grow relative'>
            <button className='text-white justify-center items-center' onClick={() => stopGameAndLose()}>STOP GAME</button> 
          <button className='text-red-800 absolute top-2 right-12' onClick={() => dbgAddPlayerGoal()}>GOAL +1 </button> 

          </div>
          
        }
        {stepCurrentSession === EStatusFrontGame.gameSessionFind &&
          <button className='text-white' onClick={() => handleSearchGame()}>ARE YOU READY ?</button> }
          {stepCurrentSession === EStatusFrontGame.endOfGame &&
          <button className='text-white' onClick={() => handleSearchGame()}>END OF GAME</button> }

            </div>
    </div>
  )
}
