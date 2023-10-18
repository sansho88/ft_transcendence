'use client'
import { useContext, useEffect, useRef, useState } from 'react'
import { UserContext, SocketContextGame, LoggedContext} from '@/context/globalContext'
import { useRouter } from 'next/navigation'
import { IUser } from '@/shared/types'
import * as PODGAME from '@/shared/typesGame'
import * as apiRoutes from '@/shared/routesApi'
import * as ClipLoader from 'react-spinners'
import SwitcherTheme from '@/components/game/SwitcherTheme'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import ChallengeList from './ChallengeList'

enum EStatusFrontGame {
  idle,
  modChoice,
  matchmakingRequest,
  gameSessionFind,
  waiting,
  countdown,
  gameInProgress,
  endOfGame
}

export default function Game({className, token}: {className: string, token: string}) {
  const socket      = useContext(SocketContextGame);
  const socketRef   = useRef(socket);
  
  // const {logged}    = useContext(LoggedContext);
  const userLogged  = useContext(UserContext);
  const {logged, setLogged} = useContext(LoggedContext);

  // const router      = useRouter();


  const tableRef    = useRef<HTMLDivElement>(null);
  const pad1Ref     = useRef<HTMLDivElement>(null);
  const pad2Ref     = useRef<HTMLDivElement>(null);
  const ballRef     = useRef<HTMLDivElement>(null);

  const [currentGameTheme, setCurrentGameTheme] = useState<string>('')



  const [nameGameSession, setNameGameSession] = useState<string>("");
  const [stepCurrentSession, setStepCurrentSession] = useState<EStatusFrontGame>(EStatusFrontGame.idle);
  const [remoteEvent, setRemoteEvent] = useState<string>("");
  
  const [p1Size, setP1Size]             = useState<PODGAME.IVector2D>({x: 10, y: 60}); //taille par default avant connection
  const [p2Size, setP2Size]             = useState<PODGAME.IVector2D>({x: 10, y: 60}); //taille par default avant connection
  const [ballSize, setBallSize]         = useState<PODGAME.IVector2D>({x: 18, y: 18}); //taille par default avant connection


  const [p1Position, setP1Position]     = useState<PODGAME.IVector2D>({x: -1, y: -1});
  const [p2Position, setP2Position]     = useState<PODGAME.IVector2D>({x: -1, y: -1});
  const [ballPosition, setBallPosition] = useState<PODGAME.IVector2D>({x: 0, y: 0});
  const [ballIsHidden, setBallIsHidden] = useState<boolean>(true);
  
  const [userP1, setUserP1]             = useState<Partial<IUser>>({});
  const [userP2, setUserP2]             = useState<Partial<IUser>>({});
  const [scoreP1, setScoreP1]           = useState<number>(0);
  const [scoreP2, setScoreP2]           = useState<number>(0);
  
  const titleGame: string = 'PONG-POD'
  const [infoMessage, setInfoMessage]   = useState<string>(titleGame);
  
  const coefTableServer                 = useRef<PODGAME.IVector2D>({x: 1, y: 1});

  const gameMod                         = useRef<PODGAME.EGameMod>(PODGAME.EGameMod.classic);


//   function changeTheme(themeName) {
//     setCurrentGameTheme(themeName);
// }




  useEffect(( ) => {
    if (logged === true) {
      if(socketRef.current){
        if (!token){
          const tokentmp = localStorage.getItem('token');
          if (tokentmp)
            token = tokentmp;
        }
        
        socketRef.current.auth = { type: `Bearer`, token: `${token}` };
        console.log('token2 ' + token)
        socketRef.current.connect();
      }
    }
    else
      socketRef.current?.disconnect();
  }, [logged])

	useEffect(() => {
	  if (nameGameSession === "") {
	    return;
	  }
	  console.log(
	    `Vous venez de rejoindre la session de jeu : ${nameGameSession}\nLe match va bientot commencer`
	  );
    setStepCurrentSession(EStatusFrontGame.gameSessionFind);
	}, [nameGameSession]);
	
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

    const reset = () => {
      setStepCurrentSession(EStatusFrontGame.idle);
      console.log(`WS RESET`);
      resetPositionPaddle();
      setInfoMessage(titleGame);
      setScoreP1(0);
      setScoreP2(0);
      setUserP1({});
      setUserP2({});
    }

	useEffect(() => {


    if (!socketRef.current?.connected) {
      console.log('CGame: socket non connecter, se connect');
  
      socketRef.current?.on('connect', () => {
        console.log('CGame: socket connecté YOUHOUUUUUUUU');
        // Autres opérations à faire une fois connecté
        
        socketRef.current?.on('info', (data) => {
          console.log(`WS info recu: ${JSON.stringify(data)}`);
        })
    
        socketRef.current?.on('infoGameSession', (data: PODGAME.IGameSessionInfo) => {
          // tableServerCoef.current = {x: data.startInitElement.tableServerSize.x / window. //taille en x de la div parent au component}
          setNameGameSession(data.gameName);
          setUserP1(data.player1);
          setUserP2(data.player2);
          setBallSize(data.startInitElement.ballSize);
          setP1Position({x: data.startInitElement.paddleP1Pos.x, y: data.startInitElement.paddleP1Pos.y})
          setP2Position({x: data.startInitElement.paddleP2Pos.x, y: data.startInitElement.paddleP2Pos.y})
          setBallIsHidden(data.ballIsHidden)
          console.log(`WS name session recu: ${JSON.stringify(data)}`);
        })
    
        //client 
        socketRef.current?.on('gameFind', (data) => {
          if (stepCurrentSession === EStatusFrontGame.matchmakingRequest) {
            setStepCurrentSession(EStatusFrontGame.gameSessionFind)
          }
          setRemoteEvent(data.remoteEvent)
          console.log(`WS gameFind recu: ${JSON.stringify(data)}`);
            let player2;
            if (!data.player2 || data.player1 == data.player2)
                player2 = "yourself";
            else
                player2 = data.player2.nickname;
            NotificationManager.info(`You'll play against ${player2}`, "GAME FOUND");
        })
  
  
        socketRef.current?.on('countdown', (data) => {
          if (stepCurrentSession !== EStatusFrontGame.countdown)
            setStepCurrentSession(EStatusFrontGame.countdown);
          setInfoMessage(data);
          // console.log(`WS countdown: ${JSON.stringify(data)}`);
        })
    
        socketRef.current?.on('alreadyInMatchmaking', () => {
          setStepCurrentSession(EStatusFrontGame.idle);
        })

        socketRef.current?.on('startGame', () => {
          setStepCurrentSession(EStatusFrontGame.gameInProgress);
          setBallIsHidden(false);
        })
  
        socketRef.current?.on('endgame', (data) => {
          if (stepCurrentSession !== EStatusFrontGame.endOfGame)
            setStepCurrentSession(EStatusFrontGame.endOfGame);
          setNameGameSession('');
          setRemoteEvent('');
          setBallIsHidden(true);
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
            NotificationManager.success(JSON.stringify(data), "GAME OVER");
        })
        
        socketRef.current?.on('reset', () => {
              reset();
        })
  
  
  
        socketRef.current?.on('setup', (data) => { //TODO: recup via ws le setup de la table
          console.log(`WS setup recu: ${JSON.stringify(data)}`); //recupere taille des elements paddle et balle
        })
    
  
        /*-----------------------------------------------------------------------------------------------------------*\
        |                                               TABLE UPDATE                                                  |
        /*-----------------------------------------------------------------------------------------------------------*/  
        socketRef.current?.on('updateTable', (data: PODGAME.IPodTable) => {
          // console.log(JSON.stringify(data))
          if(tableRef.current){
            // coefTableServer.current = {x:  tableRef.current?.offsetWidth / data.tableSize.x , y: tableRef.current?.offsetHeight / data.tableSize.y}
            calculCoefTableServer(data.tableSize);
            setP1Position({x: data.positionP1v.x * coefTableServer.current.x, y: data.positionP1v.y * coefTableServer.current.y})
            setP2Position({x: data.positionP2v.x * coefTableServer.current.x, y: data.positionP2v.y * coefTableServer.current.y})
            setP1Size({x: data.sizeP1.x * coefTableServer.current.x, y: data.sizeP1.y * coefTableServer.current.y})
            setP2Size({x: data.sizeP2.x * coefTableServer.current.x, y: data.sizeP2.y * coefTableServer.current.y})
            setBallPosition({x: data.positionBall.x * coefTableServer.current.x, y: data.positionBall.y * coefTableServer.current.y});
            setBallSize({x: data.sizeBall.x * coefTableServer.current.x, y: data.sizeBall.y * coefTableServer.current.y})
            setBallIsHidden(data.ballIsHidden)
          }
          if (gameMod.current !== PODGAME.EGameMod.trainning)
          {
            setScoreP1(data.scoreP1);
            setScoreP2(data.scoreP2);
          }
          else
          {
            setScoreP1(data.maxTrainningHit);
            setScoreP2(data.trainningHit);
          }
        })
      });
      
      if (socketRef.current)
      {
        socketRef.current.auth = { type: `Bearer`, token: `${token}` };
        console.log('token1 =' + token)
        socketRef.current?.connect();
      }
    }
    return () => {
      socketRef.current?.disconnect();
    }
	}, []);

	const arrowUp = useRef<boolean>(false);
	const arrowDown = useRef<boolean>(false);


	useEffect(() => {
    if (remoteEvent) {
			const keyDownHandler = (e) => {
				if (e.key === 'ArrowUp' && !arrowUp.current) {
					arrowUp.current = true;
					// console.log(`${remoteEvent.slice(-7)}: UP pressed`);
					socketRef.current?.emit(remoteEvent, PODGAME.EKeyEvent.arrowUpPressed);
        }
				if (e.key === 'ArrowDown' && !arrowDown.current) {
					arrowDown.current = true;
					// console.log(`${remoteEvent.slice(-7)}: DOWN pressed`);
					socketRef.current?.emit(
						remoteEvent,
						PODGAME.EKeyEvent.arrowDownPressed,
					);
				}
			};

			const keyUpHandler = (e) => {
				if (e.key === 'ArrowUp') {
					arrowUp.current = false;
					socketRef.current?.emit(
						remoteEvent,
						PODGAME.EKeyEvent.arrowUpRelease,
					);
				}
				if (e.key === 'ArrowDown') {
					arrowDown.current = false;
					socketRef.current?.emit(
						remoteEvent,
						PODGAME.EKeyEvent.arrowDownRelease,
					);
				}
			};

      const handleWindowFocus = () => {
        //si action specifique a faire a la reprise du focus..
      };
      const handleWindowBlur = () => {
					arrowUp.current = false;
					socketRef.current?.emit(
						remoteEvent,
						PODGAME.EKeyEvent.arrowUpRelease
            );
					arrowDown.current = false;
					socketRef.current?.emit(
						remoteEvent,
						PODGAME.EKeyEvent.arrowDownRelease,
					);
      };

			window.addEventListener('keydown', keyDownHandler);
			window.addEventListener('keyup', keyUpHandler);

      window.addEventListener('focus', handleWindowFocus);
      window.addEventListener('blur', handleWindowBlur);

			return () => {
				window.removeEventListener('keydown', keyDownHandler);
				window.removeEventListener('keyup', keyUpHandler);
      
        window.removeEventListener('focus', handleWindowFocus);
        window.removeEventListener('blur', handleWindowBlur);
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
      <div ref={tableRef} className={`${className} relative`} 
	    style={{
        boxShadow: "0 0 150px  40px rgba(170, 170, 255, 0.4)" 
      }}> 
      {/* <div className="relative pb-[75%]"></div> */}
      {/* <div className="absolute inset-0 flex items-center justify-center"></div> */}
        <div className='dottedLine absolute  left-1/2 h-full w-1'></div>
	      {children} 
	    </div>
	  )
	}
	
  const Ball = () => {
    return (
      <>
      <div ref={ballRef} className='ball' style={{
        position: 'absolute',
        width: `${ballSize.x}px`,
        height: `${ballSize.y}px`,
        top: `${ballPosition.y}px`,
        left: `${ballPosition.x}px`,
        // transform: 'translate(-50%, -50%)', // pour cebntrer le point de pivot de la balle par son centre
        borderRadius: '1%',
    }} >
      {/* <div className=' bg-red-500' style={{
        position: 'absolute',
        width: `800px`,
        height: `1px`,
        transform: 'translate(-50%, -50%)', // pour cebntrer le point de pivot de la balle par son centre

    }}/>
      <div className=' bg-green-500' style={{
        position: 'absolute',
        width: `1px`,
        height: `200px`,
        transform: 'translate(-50%, -50%)', // pour cebntrer le point de pivot de la balle par son centre

    }}/> */}

    </div>
    </>
    )
  }

	const Player = ({className, position, refDiv}: 
	  {className?: string, position: 'left' | 'right', refDiv: React.RefObject<HTMLDivElement>}) 
	    :React.JSX.Element => {
        const textP1: string = gameMod.current === PODGAME.EGameMod.trainning ? `your record` : `${userP1.nickname}`;
    return (
      <>
        {position === 'left' ? 

        <>
          <div  ref={refDiv} className={`${className}`} style={{height: p1Size.y, width: p1Size.x, top: `${p1Position.y}px`, left: `${p1Position.x}px`}} />
          {nameGameSession &&
          <div className=' game-scoreboard game-scoreboard-left'>{`${textP1}`}
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
    )
  }

  function dbgAddPlayerGoal() {
    socketRef.current?.emit(`${nameGameSession}GOAL`);
  }

  function stopGameAndLose() {
    socketRef.current?.emit(`${nameGameSession}STOP`);
    // setStepCurrentSession(EStatusFrontGame.idle);
  }

  function cancelMatchmaking() {
    console.log('gameMod = ' , gameMod.current)
    if (gameMod.current === PODGAME.EGameMod.classic)
      socketRef.current?.emit(apiRoutes.wsGameRoutes.removePlayerToMatchmaking(), userLogged.userContext);
    else
      socketRef.current?.emit(apiRoutes.wsGameRoutes.removePlayerToMatchmakingGhost(), userLogged.userContext);
    setStepCurrentSession(EStatusFrontGame.idle);
  }

  function handleSearchGame() {
    const login     = userLogged.userContext?.login
    let nickname    = userLogged.userContext?.nickname;
    let id_user     = userLogged.userContext?.UserID;
    if (nickname === undefined)
      nickname = userLogged.userContext?.nickname
    if (stepCurrentSession === EStatusFrontGame.modChoice) {
      setInfoMessage(titleGame);
      if (gameMod.current === PODGAME.EGameMod.classic) {
        socketRef.current?.emit(
          `${apiRoutes.wsGameRoutes.addPlayerToMatchmaking()}`,
					{
            id_user: id_user,
						login: login,
						nickname: nickname,
					},
				);
				setStepCurrentSession(EStatusFrontGame.matchmakingRequest);
				return;
			}
      else if (gameMod.current === PODGAME.EGameMod.ghost) {
        socketRef.current?.emit(
          `${apiRoutes.wsGameRoutes.addPlayerToMatchmakingGhost()}`,
					{
            id_user: id_user,
						login: login,
						nickname: nickname,
					},
				);
				setStepCurrentSession(EStatusFrontGame.matchmakingRequest);
				return;
			}
      else if (gameMod.current === PODGAME.EGameMod.trainning) {
        socketRef.current?.emit(
          `${apiRoutes.wsGameRoutes.createTrainningGame()}`,
					{
            id_user: id_user,
						login: login,
						nickname: nickname,
					},)
      }
      
		}
    else if (stepCurrentSession === EStatusFrontGame.matchmakingRequest) {
      setStepCurrentSession(EStatusFrontGame.gameSessionFind);
      return;
		}
    else if (stepCurrentSession === EStatusFrontGame.gameSessionFind) {
      socketRef.current?.emit(`${nameGameSession}ready`);
      setStepCurrentSession(EStatusFrontGame.waiting);
      return;
		}
    else if (stepCurrentSession === EStatusFrontGame.gameInProgress) {
      setStepCurrentSession(EStatusFrontGame.endOfGame);
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
    setCurrentGameTheme(new PODGAME.GameTheme().neon);
  }, []);

  useEffect(() => {
  }, [stepCurrentSession]);

  const [prevDimensions, setPrevDimensions] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (stepCurrentSession <= EStatusFrontGame.matchmakingRequest){
      if (tableRef.current)
      {
        const observer = new ResizeObserver(entries => {
          for (let entry of entries)
          {
            const { width, height } = entry.contentRect;
            if (width !== prevDimensions.width || height !== prevDimensions.height)
            {
              setP1Position({x: 6, y: height / 2 - (p1Size.y / 2)})
              setP2Position({x: width - (p2Size.x + 6), y: height / 2 - (p2Size.y / 2)})
              setPrevDimensions({width, height});
            }
          }
        });
        observer.observe(tableRef.current);
        
        return () => {
          observer.disconnect();
        }
      }
    }
  }, [tableRef.current])
  
  const challengeList = () => {
  
    return (
        <div>
          <ChallengeList/>
        </div>
      
      )
  }


  return (
    <div className={`${className} ${currentGameTheme} rounded-xl`}> 
    <>
      {/* {console.log('DIV GAME MONTER')} */}
    </>
      <Table tableRef={tableRef} className='table w-full h-full relative font-vt323'> 
        {stepCurrentSession === EStatusFrontGame.idle && challengeList()}
        {/* <Scoreboard/> // bugger*/}
        {/* <CenterDBG/> */}
        <Player className='paddle absolute ' position='left' refDiv={pad1Ref} /> 
        {stepCurrentSession === EStatusFrontGame.matchmakingRequest &&
            <div className='flex space-x-5 items-center justify-end pr-10 pl-10 pt-20'>
              keys:<br/>up: up arrow key<br/>down: down arrow key
            </div> }
        <Player className='paddle absolute'  position='right' refDiv={pad2Ref} />
        {!ballIsHidden && <Ball/>}
        {stepCurrentSession === EStatusFrontGame.idle &&
          <>
            <SwitcherTheme className=' absolute right-1 top-1' setThemeFunction={setCurrentGameTheme} ></SwitcherTheme>
            <div className='absolute -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2  game-info-message text-7xl'>{infoMessage}</div> 
          </>}
        {stepCurrentSession === EStatusFrontGame.countdown &&
          <div className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 game-info-message text-9xl'>{infoMessage}</div>  }
        {stepCurrentSession === EStatusFrontGame.endOfGame &&
          <div className='text-center absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2  game-info-message text-xl'>{infoMessage}</div>  }
      </Table>

        <div className='flex justify-center items-center left-1/2 text-xl text-gray-700 h-20'> 
          {stepCurrentSession === EStatusFrontGame.idle &&
            <button className='text-white' onClick={() => setStepCurrentSession(EStatusFrontGame.modChoice)}>PLAY</button> }
          {stepCurrentSession === EStatusFrontGame.modChoice &&
            <div className=' space-x-32'>
              <button className='text-white' onClick={() => {gameMod.current = PODGAME.EGameMod.classic;handleSearchGame()}}>CLASSIC</button> 
              <button className='text-white' onClick={() => {gameMod.current = PODGAME.EGameMod.ghost;handleSearchGame()}}>GHOST</button> 
              <button className='text-white' onClick={() => {gameMod.current = PODGAME.EGameMod.trainning;handleSearchGame()}}>SOLO TRAINING</button> 
            </div> }
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
            {/* {gameMod.current !== PODGAME.EGameMod.trainning &&
              <button className='text-red-800 absolute top-2 right-12' onClick={() => dbgAddPlayerGoal()}>GOAL +1 </button> 
            } */}

          </div>
          
        }
        {stepCurrentSession === EStatusFrontGame.gameSessionFind &&
          <button className='text-white' onClick={() => handleSearchGame()}>ARE YOU READY ?</button> }
          {/* {stepCurrentSession === EStatusFrontGame.endOfGame &&
          <button className='text-white' onClick={() => {reset()}}>END OF GAME</button> } */}

            </div>
    </div>
  )
}
