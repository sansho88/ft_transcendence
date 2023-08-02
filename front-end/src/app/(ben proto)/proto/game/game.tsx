'use client'
import { useContext, useEffect, useRef, useState } from 'react'
import { UserContext, SocketContextGame, LoggedContext} from '@/context/globalContext'
import { useRouter } from 'next/navigation'
import * as PODGAME from '@/shared/typesGame'
import * as wsRoute from '@/shared/routesApi'
import { cursorTo } from 'readline'
import * as ClipLoader from 'react-spinners'
import { removeListener } from 'process'


enum EStatusFrontGame {
  idle,
  matchmakingRequest,
  gameSessionFind,
  gameInProgress,
  endOfGame
}


export default function Game({className}: {className: string}) {
  const socket = useContext(SocketContextGame);
  const socketRef = useRef(socket);

  const isLogged = useContext(LoggedContext);
  const userLogged = useContext(UserContext);
  const router = useRouter();

  const tableRef = useRef<HTMLDivElement>(null);
  const pad1Ref = useRef<HTMLDivElement>(null);
  const pad2Ref = useRef<HTMLDivElement>(null);

  const [nameGameSession, setNamegameSession] = useState<string>("");
  const [paddleSize, setPaddleSize] = useState<PODGAME.IVector2D>({
    x: 10,
    y: 60,
  });
  const [stepCurrentSession, setStepCurrentSession] = useState<EStatusFrontGame>(
    EStatusFrontGame.idle
  );
  const [buttonText, setButtonText] = useState<string>("SEARCH GAME");
  const [remoteEvent, setRemoteEvent] = useState<string>("");
  // const remoteEvent = useRef<string>('');

 const [p1Position, setP1Position] = useState<number>(0);
  const [p2Position, setP2position] = useState<number>(0);


	useEffect(() => {
	  if (nameGameSession === "") {
	    return;
	  }
	  console.log(
	    `Vous venez de rejoindre la session de jeu : ${nameGameSession}\nLe match va bientot commencer`
	  );
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
	
	    socketRef.current.on('play', (data) => {
	      if (stepCurrentSession === EStatusFrontGame.matchmakingRequest) {
	        setStepCurrentSession(EStatusFrontGame.gameSessionFind)
	      }
	      setRemoteEvent(data.remoteEvent)
	      console.log(`WS play recu: ${JSON.stringify(data)}`);
	    })
	
	    socketRef.current.on('setup', (data) => { //TODO: recup via ws le setup de la table
	      console.log(`WS setup recu: ${JSON.stringify(data)}`); //recupere taille des elements paddle et balle
	    })
	
	    socketRef.current.on('updateTable', (data: PODGAME.ITable) => {
	      setP1Position(data.posPaddleP1.y);
	      setP2position(data.posPaddleP2.y);
			//ball position
	      console.log(`WS moveP1 : ${JSON.stringify(data.posPaddleP1.y)}`); //recupere la position du paddles 1
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
	    window.addEventListener('keypress', (e) => {
			if (e.key === 'ArrowUp') {
					if (arrowUp.current === false){
						console.log(`${remoteEvent.slice(-8)}: UP pressed`)
						arrowUp.current = true;
						setTimeout(() => { arrowUp.current = false; console.log(`${remoteEvent.slice(-8)}: UP release`)})
					}
					// socketRef.current?.emit(remoteEvent, PODGAME.EKeyEvent.arrowUpPressed)
			}
			if (e.key === 'ArrowDown') {
			  console.log(`${remoteEvent.slice(-8)}: DOWN pressed`)
	        socketRef.current?.emit(remoteEvent, PODGAME.EKeyEvent.arrowDownPressed)
	      }
	    })
	    window.addEventListener('keyup', (e) => {
			if (e.key === 'ArrowUp') {
			  console.log(`${remoteEvent.slice(-8)}: UP release`)
			  socketRef.current?.emit(remoteEvent, PODGAME.EKeyEvent.arrowUpRelease)
			}
			if (e.key === 'ArrowDown') {
			  console.log(`${remoteEvent.slice(-8)}: DOWN release`)
	        socketRef.current?.emit(remoteEvent, PODGAME.EKeyEvent.arrowDownRelease)
	      }
	    })
	
	    return () => {
	        window.removeEventListener('keypress', (e) => {
				if (e.key === 'ArrowUp') {
					console.log(`${remoteEvent.slice(-8)}: UP pressed`)
					socketRef.current?.emit(remoteEvent, PODGAME.EKeyEvent.arrowUpPressed)
				  }
				  if (e.key === 'ArrowDown') {
					console.log(`${remoteEvent.slice(-8)}: DOWN pressed`)
				  socketRef.current?.emit(remoteEvent, PODGAME.EKeyEvent.arrowDownPressed)
				}
			})
			window.removeEventListener('keyup', (e) => {
				if (e.key === 'ArrowUp') {
					console.log(`${remoteEvent.slice(-8)}: UP release`)
					socketRef.current?.emit(remoteEvent, PODGAME.EKeyEvent.arrowUpRelease)
				  }
				  if (e.key === 'ArrowDown') {
					console.log(`${remoteEvent.slice(-8)}: DOWN release`)
				  socketRef.current?.emit(remoteEvent, PODGAME.EKeyEvent.arrowDownRelease)
				}
			})
	    }
	  }
  
	},[remoteEvent])
	
	
	useEffect(() => {
	  console.log(`position P1: ${p1Position}`);
	}, [p1Position])
	
	useEffect(() => {
	  if (remoteEvent)
	    console.log(`YOU HAVE REMOTE EVENT: ${remoteEvent}`);
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
	
	
	
	const Player = ({className, position, refDiv, dim}: 
	  {className?: string, position: 'left' | 'right', refDiv: React.RefObject<HTMLDivElement>, dim: PODGAME.IVector2D}) 
	    :React.JSX.Element => {
	    // tableRef.current.off
	      // let x:number; 
	      // let y: number;
		
	      if(tableRef.current){
	      // x =  paddleSize;
	      // y = (tableRef.current.offsetHeight * dim.y) / 100;
		
	    }
	
  return (
    <>
      {position === 'left' ? 
      
      <div ref={refDiv} className={`${className}`} 
      style={{height: paddleSize.y, width: paddleSize.x, top: `${p1Position}px`}} />
      :
      <div ref={refDiv} className={`${className}`} 
      style={{height: paddleSize.y, width: paddleSize.x, top: `${p2Position}px`}} />
      
      } 
    </>
    // <>HELLO PADLE</>
  )
}


  function handleSearchGame() {
    const login   = userLogged.userContext?.login
    let nickname  = userLogged.userContext?.login;
    if (nickname === undefined)
      nickname = userLogged.userContext?.nickname
    if (stepCurrentSession === EStatusFrontGame.idle) {
			socketRef.current?.emit(`${wsRoute.wsGameRoutes.addPlayerToMatchnaking()}`, {
				login: login,
				nickname: nickname, 
			});
      setStepCurrentSession(EStatusFrontGame.matchmakingRequest);
			setButtonText("CANCEL MATCHMAKING");
			console.log("Cancel matchmaking not implemented for the moment");
      return;
		} else if (stepCurrentSession === EStatusFrontGame.matchmakingRequest) {
      setStepCurrentSession(EStatusFrontGame.gameSessionFind);
			console.log("Match trouvé ! le jeu va bientot commencer");
      return;
		} else if (stepCurrentSession === EStatusFrontGame.gameSessionFind) {
      setStepCurrentSession(EStatusFrontGame.gameInProgress);
      console.log("le jeu a commencer.. Bonne chance !");
      return;
		} else if (stepCurrentSession === EStatusFrontGame.gameInProgress) {
      setStepCurrentSession(EStatusFrontGame.endOfGame);
      console.log("le jeu est terminé !"); 
      return;
		} else if (stepCurrentSession === EStatusFrontGame.endOfGame)
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
        <Player className='bg-black mr-2 absolute right-0' dim={{x:2, y:10}} position='right' refDiv={pad1Ref} /> 
      </Table>
      <div className='flex justify-center'>
        {stepCurrentSession === EStatusFrontGame.idle &&
          <button className='text-white' onClick={() => handleSearchGame()}>PLAY</button> }
        {stepCurrentSession === EStatusFrontGame.matchmakingRequest &&
          <div className='flex space-x-5 items-center'>
            <button className='text-white' onClick={() => handleSearchGame()}>CANCEL MATCHMAKING</button><ClipLoader.ClipLoader color="#36d7b7" />
          </div> }
        {stepCurrentSession === EStatusFrontGame.gameSessionFind &&
          <button className='text-white' onClick={() => {handleSearchGame()}}>GAME FIND! READY ?</button> }
        {stepCurrentSession === EStatusFrontGame.gameInProgress &&
          <button className='text-white' onClick={() => handleSearchGame()}>STOP GAME</button> }
        {stepCurrentSession === EStatusFrontGame.endOfGame &&
          <button className='text-white' onClick={() => handleSearchGame()}>END OF GAME</button> }
      </div>
    </div>
  )
}
