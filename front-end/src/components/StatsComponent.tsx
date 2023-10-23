import React, {useContext, useEffect, useRef, useState} from "react";
import {getApi} from "@/components/api/ApiReq";
import {IGameStats, IUser} from "@/shared/types";
import getUserStatsById = getApi.getUserStatsById;
import {SocketContextChat} from "@/context/globalContext";

interface StatsProps {
    user: IUser;
}

const Stats: React.FC<StatsProps> = ({className, user})=>{

    const [stats, setStats] = useState<IGameStats>({nbWin:0, level:-1, rank:0, nbLoose:0, exp: 0});
    const socketChat      = useContext(SocketContextChat);
    const socketChatRef   = useRef(socketChat);

    useEffect(() => {
        if (stats.level < 0)
            getUserStatsById(user.UserID).then((result) => {
                setStats(result.data);
            })
                .catch((error) => console.error("Request for STATS failed: " + error));
        return () => {};
    })

    socketChatRef.current?.on("userUpdate", (data: IUser) => {
        if (data.UserID == user.UserID && data.status != user.status)
        {
            getUserStatsById(user.UserID).then((result) => {
                setStats(result.data);
            })
                .catch((error) => console.error("Request for STATS failed: " + error));
        }
    });
    socketChatRef.current?.off("userUpdate", () => {});


    return (
        <div className={className} style={{marginTop: "1ch"}}>
            <span style={{color: "green", marginInline: "4px", fontFamily: "sans-serif", lineHeight: "1.5em", transition: "1000ms"}}>{" " + stats.nbWin + "🏆  "}</span>
            <span style={{color: "red", marginInline: "4px", fontFamily: "sans-serif", lineHeight: "1.5em", transition: "1000ms"}}>{" " +  stats.nbLoose + " 🏳 "}</span>
            <span style={{color: "gold", marginInline: "4px", fontFamily: "sans-serif", lineHeight: "1.5em", transition: "1000ms"}}>{" " + stats.rank +" 🎖 "}️</span>
            {" "}<span style={{color: "rgb(52 135 255)"}}>Lv<span style={{fontFamily: "sans-serif", lineHeight: "1.5em", transition: "1000ms"}}></span> {stats.level}</span>
        </div>
    );
};

export default Stats;