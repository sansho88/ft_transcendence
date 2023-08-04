'use client'
import { useContext, useEffect, useRef, useState } from 'react'
import { UserContext, SocketContextGame, LoggedContext} from '@/context/globalContext'
import { useRouter } from 'next/navigation'
import * as PODGAME from '@/shared/typesGame'
import * as apiRoutes from '@/shared/routesApi'
import { cursorTo } from 'readline'
import * as ClipLoader from 'react-spinners'
import { removeListener } from 'process'
import { EStepLogin, IUser } from '@/shared/types'

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

  const isLogged    = useContext(LoggedContext);
  const userLogged  = useContext(UserContext);
  // const router      = useRouter();

  const tableRef    = useRef<HTMLDivElement>(null);
  const pad1Ref     = useRef<HTMLDivElement>(null);
  const pad2Ref     = useRef<HTMLDivElement>(null);
  const ballRef     = useRef<HTMLDivElement>(null);


  const [nameGameSession, setNameGameSession] = useState<string>("");
  const [paddleSize, setPaddleSize] = useState<PODGAME.IVector2D>({
    x: 10, //TODO: recup la taille x y  depuis le server
    y: 60,  // avec coef (== taille server ratio taille div front)
  });
  const [stepCurrentSession, setStepCurrentSession] = useState<EStatusFrontGame>(
    EStatusFrontGame.idle
  );
  const [buttonText, setButtonText] = useState<string>("SEARCH GAME");
  const [remoteEvent, setRemoteEvent] = useState<string>("");
  // const remoteEvent = useRef<string>('');

  const [p1Position, setP1Position]     = useState<number>(250);
  const [p2Position, setP2Position]     = useState<number>(250);
  const [ballPosition, setBallPosition] = useState<PODGAME.IVector2D>({x: 0, y: 0});
  const [ballHidden, setBallHidden]     = useState<boolean>(true);

  const [userP1, setUserP1] = useState<Partial<IUser>>({});
  const [userP2, setUserP2] = useState<Partial<IUser>>({});
  const [scoreP1, setScoreP1] = useState<number>(0);
  const [scoreP2, setScoreP2] = useState<number>(0);

  const [infoMessage, setInfoMessage]   = useState<string>('');


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
	  if (!isLogged) {
	    // router.push('/auth'); // for dev
	    console.error("your are not logged!");
	  }
	}, [isLogged]);

	useEffect(() => {
	  if (!socketRef.current?.connected)
	    socketRef.current?.connect();
	  if (socketRef.current?.connected && typeof socketRef.current !== 'string') {
	
	    socketRef.current.on('info', (data) => {
	      console.log(`WS info recu: ${JSON.stringify(data)}`);
	    })
	
	    // socketRef.current.on('nameSession', (data) => {
      //   setNameGameSession(data);
	    //   console.log(`WS name session recu: ${JSON.stringify(data)}`);
	    // })
	
	    socketRef.current.on('infoGameSession', (data: PODGAME.IGameSessionInfo) => {
        setNameGameSession(data.gameName);
        setUserP1(data.player1);
        setUserP2(data.player2);
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
	      console.log(`WS countdown: ${JSON.stringify(data)}`);
	    })
	
	    socketRef.current.on('startGame', (data) => {
        setStepCurrentSession(EStatusFrontGame.gameInProgress);
        setBallHidden(false);
        // setInfoMessage('');
	      console.log(`WS GAME IS RUNNING: ${JSON.stringify(data)}`);
	    })
	    socketRef.current.on('ENDGAME', (data) => {
        setBallHidden(true);
        setP1Position(250);
        setP2Position(250);
        setScoreP1(0);
        setScoreP2(0);
        setNameGameSession('');
        setUserP1({});
        setUserP2({});
        setStepCurrentSession(EStatusFrontGame.idle);
        // setInfoMessage('');
	      console.log(`WS GAME IS RUNNING: ${JSON.stringify(data)}`);
	    })



	    socketRef.current.on('setup', (data) => { //TODO: recup via ws le setup de la table
	      console.log(`WS setup recu: ${JSON.stringify(data)}`); //recupere taille des elements paddle et balle
	    })
	
	    socketRef.current.on('updateTable', (data: PODGAME.IPodTable) => {
	      setP1Position(data.positionP1);
	      setP2Position(data.positionP2);
        setBallPosition(data.positionBall);
        setScoreP1(data.scoreP1);
        setScoreP2(data.scoreP2);
			//ball position
	      console.log(`WS updateTable : ${JSON.stringify(data)}`); //recupere la position du paddles 1
	    })
     }
 	console.log(`dim table x:${tableRef.current?.offsetWidth} y:${tableRef.current?.offsetHeight}`)
  // return () => {socketRef.current?.close};
	}, []);

	const arrowUp = useRef<boolean>(false);
	const arrowDown = useRef<boolean>(false);

	function eventListen(){
	}

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
	  console.log(`position P1: ${p1Position}`);
	}, [p1Position])
	
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
	    <div ref={tableRef} className={`${className} flex rounded-xl bg-blue-game`} 
	    style={{
	      boxShadow: "0 0 150px  40px rgba(170, 170, 255, 0.4)" 
	  }}> 
	      {children} 
	    </div>
	  )
	}
	
  const Ball = () => {
    return (
      <div ref={ballRef} style={{
        position: 'absolute',
        width: '18px',
        height: '18px',
        top: `${ballPosition.y}px`,
        left: `${ballPosition.x}px`,
        transform: 'translate(-50%, -50%)', // pour cebntrer le point de pivot de la balle par son centre
        borderRadius: '1%',
        backgroundColor: 'black',
    }} />
    )
  }

	const Player = ({className, position, refDiv, dim}: 
	  {className?: string, position: 'left' | 'right', refDiv: React.RefObject<HTMLDivElement>, dim: PODGAME.IVector2D}) 
	    :React.JSX.Element => {
	
  
        //TODO: A REFACTO...
  return (
    <>
      {position === 'left' ? 
      
      <>
        <div  ref={refDiv} className={`${className}`} style={{height: paddleSize.y, width: paddleSize.x, top: `${p1Position}px`}} />
        {nameGameSession &&
        <div className=' absolute text-gray-500 font-semibold text-xl flex flex-col items-center justify-center' style={{top: '20px', left: '140px'}}>{`${userP1.nickname} `}
          <div className='text-6xl' style={{top: '20px', right: '120px'}}>{`${scoreP1}`} 
          </div>
        </div>
        }
      </>
      :
      <>
        <div ref={refDiv} className={`${className}`} style={{height: paddleSize.y, width: paddleSize.x, top: `${p2Position}px`}} />
        {nameGameSession && 
        <div className=' absolute text-gray-500 font-semibold text-xl flex flex-col items-center justify-center' style={{top: '20px', right: '140px'}}>{`${userP2.nickname} `}
          <div className='text-6xl' style={{top: '20px', right: '120px'}}>{`${scoreP2}`}
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
    const login   = userLogged.userContext?.login
    let nickname  = userLogged.userContext?.login;
    let id_user  = userLogged.userContext?.id_user;
    if (nickname === undefined)
      nickname = userLogged.userContext?.nickname
    if (stepCurrentSession === EStatusFrontGame.idle) {
			socketRef.current?.emit(`${apiRoutes.wsGameRoutes.addPlayerToMatchnaking()}`, {
        id_user: id_user,
				login: login,
				nickname: nickname,
			});
      setStepCurrentSession(EStatusFrontGame.matchmakingRequest);
			setButtonText("CANCEL MATCHMAKING");
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
    else if (stepCurrentSession === EStatusFrontGame.endOfGame)
      setStepCurrentSession(EStatusFrontGame.idle);
    return;
  }

  useEffect(() => {
    console.log(`CurrentStep = ${stepCurrentSession}`);
    // handleSearchGame();
  }, [stepCurrentSession]);

  return (
    <div className={className}>
      <Table tableRef={tableRef} className='w-[700px] h-[600px] relative'>
        <Player className='bg-black ml-2 absolute left-0' dim={{x:2, y:10}} position='left' refDiv={pad1Ref} /> 
        <Player className='bg-black mr-2 absolute right-0' dim={{x:2, y:10}} position='right' refDiv={pad2Ref} />
        {!ballHidden && <Ball/>}
        {stepCurrentSession === EStatusFrontGame.countdown &&
          <div className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 font-black text-gray-700 text-9xl'>{infoMessage}</div>  }
          <button className='text-red-800 absolute bottom-2 left-1/2 -translate-x-1/2 font-extrabold' onClick={() => dbgAddPlayerGoal()}><br/>CHEAT: GOAL +1 </button> 
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
              <div className='text-red-700'>Waiting </div><ClipLoader.ClipLoader color="#36d7b7" />
            </>
          }
          {stepCurrentSession === EStatusFrontGame.gameInProgress &&
          <div className='flex '>
            <button className='text-white' onClick={() => stopGameAndLose()}>STOP GAME</button> 
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
