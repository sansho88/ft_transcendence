import React from "react";

interface StatsProps {
    victories?: number;
    defeats?: number;
    rank?: number;
    level?: number;
}

const Stats: React.FC<StatsProps> = ({className, victories, defeats, rank, level})=>{
    return (
        <>
            <span className={className}>
                 <span style={{color: "green", marginInline: "4px"}}>{" " + victories + "🏆  "}</span>
                <span style={{color: "red", marginInline: "4px"}}>{" " +  defeats + " 🏳 "}</span>
                <span style={{color: "gold", marginInline: "4px"}}>{" " + rank +" 🎖 "}️</span>
                {" "}Lv<span style={{color: "grey"}}></span> {level}

            </span>
        </>
    );
};

export default Stats;