import React from "react";

interface StatsProps {
    victories: bigint;
    defeats: bigint;
    rank: bigint;
    level: number;
}

interface MatchProps {
    opponent1: string;
    opponent2: string;
    scoreOpp1: bigint;
    scoreOpp2: bigint;
    date: string;
    id: bigint;
}
interface ProfileProps {
    avatar: string;
    login: string;
    nickname: string;
    status: string;
    statusColor?: string;
    stats: StatsProps;
    matchHistory?: MatchProps[];

}

const Profile: React.FC<ProfileProps> = ({className, avatar,login, nickname, status, statusColor, stats, matchHistory})=>{
    return (
        <>
            <div className={className}>
                <img className={"avatar"} src={avatar} alt="Avatar" style={{
                    borderWidth: "2px",
                    borderColor: statusColor,
                    boxShadow: `1px 2px 5px ${statusColor}`,
                    borderRadius: "8px",
                    width: "40%",
                    height: "50%"
                }}/>
                <div className={"infos"} style={{
                    fontFamily: "sans-serif",
                    color: "#880129",
                    lineHeight: "1.5em"
                }
                }>
                    <h2>{login}</h2>
                    <p>{nickname}</p>
                    <p>{status}</p>
                </div>
            </div>
        </>);
};

export default Profile;