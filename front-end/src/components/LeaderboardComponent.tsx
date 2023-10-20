import React, {useEffect, useState} from "react";
import {ILeaderboard} from "@/shared/types";
import {getApi} from "@/components/api/ApiReq";
import {v4 as uuidv4} from "uuid";
import Profile from "@/components/ProfileComponent";

const Leaderboard : React.FC = () => {
    const [leaderboard, setLeaderboard] = useState<ILeaderboard[]>([]);
    let leaderboardElements: React.JSX.Element[] = [];

    useEffect(() => {
            if (leaderboard && leaderboard.length == 0)
                getApi.getLeaderboard()
                    .then((res) => {
                        setLeaderboard(res.data);
                    })
            const timer = setInterval(() => {
                getApi.getLeaderboard()
                    .then((res) => {
                        setLeaderboard(res.data);
                    })
            }, 30000);

            return () => {
                clearInterval(timer);
            };
    }, )


    if (leaderboard.length > 0 ){
        const rankColorsArray = ["gold", "silver", "sienna"]
        for (const competitor of leaderboard) {
            let rankColor= "rgba(0, 0, 0, 0)";
            if (competitor.rank <= 3)
                rankColor = rankColorsArray[competitor.rank - 1];

            if (competitor.user.UserID > 1)
                leaderboardElements.push(
                    <li key={competitor.user.login + "List" + uuidv4()}>
                        <div style={{ margin:"10px 0", color: rankColor}}>
                            <span className={"leaderboard_rank"} style={{color: rankColor}}>
                                {competitor.rank}
                            </span>
                            <span>
                               <Profile className={"leaderboard_user"} user={competitor.user} avatarSize={"medium"} showStats={false}/>
                            </span>
                        </div>
                    </li>
                )
        }
    }
    else {
        leaderboardElements.push(
            <div key={"NoMatch" + uuidv4()}>No match played yet</div>
        )
    }

    return (
        <div className={"leaderboard"}>
            <h1>LEADERBOARD</h1>

                <ul>
                    {leaderboardElements}
                </ul>


        </div>
    );
}

export default Leaderboard;