import React, {useContext, useEffect, useState} from "react";
import {IMatch} from "@/shared/types";
import {getApi} from "@/components/api/ApiReq";
import {v4 as uuidv4} from "uuid";
import {SelectedUserContext} from "@/context/globalContext";

const MatchHistory : React.FC = () => {
    const [matchesList, setMatchesList] = useState<IMatch[]>([]);
    const {selectedUserContext, setSelectedUserContext} = useContext(SelectedUserContext);
    let matchElements : React.JSX.Element[] = [];

    useEffect(() => {
        if (selectedUserContext)
        {
            if (matchesList)
                getApi.getMatchHistoryFromUserId(selectedUserContext.UserID)
                    .then((res) => {
                        setMatchesList(res.data);
                    })
            const timer = setInterval(() => {
                console.log("user selected: " + selectedUserContext.login);
                getApi.getMatchHistoryFromUserId(selectedUserContext.UserID)
                    .then((res) => {
                        setMatchesList(res.data);
                    })
            }, 10000);

            return () => {
                clearInterval(timer);
            };
        }
    }, [selectedUserContext])


    if (matchesList.length > 0 && matchesList.at(0).ID >= 0){
        for (const match of matchesList) {
            const p1Color = match.player1.UserID == selectedUserContext.UserID ? "gold" : "white";
            const p2Color = p1Color == "white" ? "gold" : "white";

            matchElements.push(
                <li key={match.ID + "List" + uuidv4()}>
                    <div id={"match"}>
                        <span id={"winner"} style={{color:p1Color, cursor:"pointer"}} onClick={() => setSelectedUserContext(match.player1)}>
                            {match.player1.nickname}
                        </span>
                        <span id={"looser"} style={{color:p2Color, cursor:"pointer"}} onClick={() => setSelectedUserContext(match.player2)}>
                            {match.player2.nickname}
                        </span>
                        <br/>
                        <span id={"scorep1"}>{match.score1}</span>  <span id={"scorep2"}>{match.score2}</span>
                    </div>
                </li>
            )
        }
    }
    else {
        matchElements.push(
            <div key={"NoMatch" + uuidv4()}>No match played yet</div>
        )
    }

    return (
        <div className={"matchHistory"}>
            <h1>MATCHES HISTORY</h1>
            {selectedUserContext ?
                <ul>
                    {selectedUserContext.nickname} ({selectedUserContext.login})
                    {matchElements}
                </ul>
                : "No user selected"
        }
        </div>
    );
}

export default MatchHistory;