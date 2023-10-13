import React, {useEffect, useState} from "react";
import {getApi} from "@/components/api/ApiReq";
import {IGameStats, IUser} from "@/shared/types";
import getUserStatsById = getApi.getUserStatsById;

interface StatsProps {
    user: IUser;
}

const Stats: React.FC<StatsProps> = ({className, user})=>{

    const [stats, setStats] = useState<IGameStats>({nbWin:0, level:-1, rank:0, nbLoose:0, exp: 0});

    useEffect(() => {
        if (stats.level >= 0 )
            getUserStatsById(user.UserID).then((result) => {
                setStats(result.data);
            })
            .catch((error) => console.error("Request for STATS failed: " + error));
    })

    return (
        <div className={className}>
            <span style={{color: "green", marginInline: "4px"}}>{" " + stats.nbWin + "🏆  "}</span>
            <span style={{color: "red", marginInline: "4px"}}>{" " +  stats.nbLoose + " 🏳 "}</span>
            <span style={{color: "gold", marginInline: "4px"}}>{" " + stats.rank +" 🎖 "}️</span>
            {" "}Lv<span style={{color: "grey"}}></span> {stats.level}
        </div>
    );
};

export default Stats;