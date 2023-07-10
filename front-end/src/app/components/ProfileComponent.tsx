import React from "react";


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
    matchHistory?: MatchProps[];

}

const Profile: React.FC<ProfileProps> = ({children, className, avatar,login, nickname, status, statusColor})=>{
    return (
        <>
            <div className={className}>
                <img className={"avatar"} src={avatar} alt="Avatar" style={{
                    borderWidth: "2px",
                    borderColor: statusColor,
                    boxShadow: `1px 2px 5px ${statusColor}`,
                    transition: "1000ms",
                    borderRadius: "8px",
                    width: "5vw",
                    height: "10vh"
                }}/>
                <div className={"infos"} style={{
                    fontFamily: "sans-serif",
                    color: "#07C3FF",
                    lineHeight: "1.5em"
                }
                }>
                    <h2 id={"login"}>{login}</h2>
                    <p id={"nickname"}>{nickname}</p>
                    <p id={"status"} style={{color:statusColor}}>{status}</p>
                </div>
                <p id={"children"}>{children}</p>
            </div>
        </>);
};

export default Profile;