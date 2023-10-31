--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3 (Debian 15.3-1.pgdg120+1)
-- Dumped by pg_dump version 15.3 (Debian 15.3-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: Channels_type_enum; Type: TYPE; Schema: public; Owner: username42
--

CREATE TYPE public."Channels_type_enum" AS ENUM (
    '0',
    '1',
    '2',
    '3'
);


ALTER TYPE public."Channels_type_enum" OWNER TO username42;

--
-- Name: User Status; Type: TYPE; Schema: public; Owner: username42
--

CREATE TYPE public."User Status" AS ENUM (
    '2',
    '1',
    '0'
);


ALTER TYPE public."User Status" OWNER TO username42;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AdminList; Type: TABLE; Schema: public; Owner: username42
--

CREATE TABLE public."AdminList" (
    "channelsChannelID" integer NOT NULL,
    "userUserID" integer NOT NULL,
    "userLogin" character varying(10) NOT NULL
);


ALTER TABLE public."AdminList" OWNER TO username42;

--
-- Name: Banned; Type: TABLE; Schema: public; Owner: username42
--

CREATE TABLE public."Banned" (
    "bannedID" integer NOT NULL,
    "endTime" timestamp without time zone,
    "userUserID" integer,
    "userLogin" character varying(10),
    "channelChannelID" integer
);


ALTER TABLE public."Banned" OWNER TO username42;

--
-- Name: Banned_bannedID_seq; Type: SEQUENCE; Schema: public; Owner: username42
--

CREATE SEQUENCE public."Banned_bannedID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Banned_bannedID_seq" OWNER TO username42;

--
-- Name: Banned_bannedID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: username42
--

ALTER SEQUENCE public."Banned_bannedID_seq" OWNED BY public."Banned"."bannedID";


--
-- Name: Blocked; Type: TABLE; Schema: public; Owner: username42
--

CREATE TABLE public."Blocked" (
    "userUserID_1" integer NOT NULL,
    "userLogin_1" character varying(10) NOT NULL,
    "userUserID_2" integer NOT NULL,
    "userLogin_2" character varying(10) NOT NULL
);


ALTER TABLE public."Blocked" OWNER TO username42;

--
-- Name: ChannelCredential; Type: TABLE; Schema: public; Owner: username42
--

CREATE TABLE public."ChannelCredential" (
    id integer NOT NULL,
    password character varying(60)
);


ALTER TABLE public."ChannelCredential" OWNER TO username42;

--
-- Name: ChannelCredential_id_seq; Type: SEQUENCE; Schema: public; Owner: username42
--

CREATE SEQUENCE public."ChannelCredential_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ChannelCredential_id_seq" OWNER TO username42;

--
-- Name: ChannelCredential_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: username42
--

ALTER SEQUENCE public."ChannelCredential_id_seq" OWNED BY public."ChannelCredential".id;


--
-- Name: Channels; Type: TABLE; Schema: public; Owner: username42
--

CREATE TABLE public."Channels" (
    "channelID" integer NOT NULL,
    name character varying(20) NOT NULL,
    type public."Channels_type_enum" NOT NULL,
    mp boolean NOT NULL,
    archive boolean DEFAULT false NOT NULL,
    "ownerUserID" integer,
    "ownerLogin" character varying(10),
    "Credential" integer
);


ALTER TABLE public."Channels" OWNER TO username42;

--
-- Name: Channels_channelID_seq; Type: SEQUENCE; Schema: public; Owner: username42
--

CREATE SEQUENCE public."Channels_channelID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Channels_channelID_seq" OWNER TO username42;

--
-- Name: Channels_channelID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: username42
--

ALTER SEQUENCE public."Channels_channelID_seq" OWNED BY public."Channels"."channelID";


--
-- Name: Credential; Type: TABLE; Schema: public; Owner: username42
--

CREATE TABLE public."Credential" (
    id integer NOT NULL,
    password character varying(60) NOT NULL,
    token_2fa character varying(100)
);


ALTER TABLE public."Credential" OWNER TO username42;

--
-- Name: Credential_id_seq; Type: SEQUENCE; Schema: public; Owner: username42
--

CREATE SEQUENCE public."Credential_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Credential_id_seq" OWNER TO username42;

--
-- Name: Credential_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: username42
--

ALTER SEQUENCE public."Credential_id_seq" OWNED BY public."Credential".id;


--
-- Name: Games; Type: TABLE; Schema: public; Owner: username42
--

CREATE TABLE public."Games" (
    "ID" integer NOT NULL,
    score1 integer NOT NULL,
    score2 integer NOT NULL,
    starting_date timestamp without time zone NOT NULL,
    "player1UserID" integer,
    "player1Login" character varying(10),
    "player2UserID" integer,
    "player2Login" character varying(10)
);


ALTER TABLE public."Games" OWNER TO username42;

--
-- Name: Games_ID_seq; Type: SEQUENCE; Schema: public; Owner: username42
--

CREATE SEQUENCE public."Games_ID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Games_ID_seq" OWNER TO username42;

--
-- Name: Games_ID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: username42
--

ALTER SEQUENCE public."Games_ID_seq" OWNED BY public."Games"."ID";


--
-- Name: Invites; Type: TABLE; Schema: public; Owner: username42
--

CREATE TABLE public."Invites" (
    "inviteID" integer NOT NULL,
    "userUserID" integer,
    "userLogin" character varying(10),
    "channelChannelID" integer,
    "senderUserID" integer,
    "senderLogin" character varying(10)
);


ALTER TABLE public."Invites" OWNER TO username42;

--
-- Name: Invites_inviteID_seq; Type: SEQUENCE; Schema: public; Owner: username42
--

CREATE SEQUENCE public."Invites_inviteID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Invites_inviteID_seq" OWNER TO username42;

--
-- Name: Invites_inviteID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: username42
--

ALTER SEQUENCE public."Invites_inviteID_seq" OWNED BY public."Invites"."inviteID";


--
-- Name: Messages; Type: TABLE; Schema: public; Owner: username42
--

CREATE TABLE public."Messages" (
    id integer NOT NULL,
    "sendTime" timestamp without time zone NOT NULL,
    content character varying(256) NOT NULL,
    "authorUserID" integer,
    "authorLogin" character varying(10),
    "channelChannelID" integer
);


ALTER TABLE public."Messages" OWNER TO username42;

--
-- Name: Messages_id_seq; Type: SEQUENCE; Schema: public; Owner: username42
--

CREATE SEQUENCE public."Messages_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Messages_id_seq" OWNER TO username42;

--
-- Name: Messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: username42
--

ALTER SEQUENCE public."Messages_id_seq" OWNED BY public."Messages".id;


--
-- Name: Mute; Type: TABLE; Schema: public; Owner: username42
--

CREATE TABLE public."Mute" (
    "muteID" integer NOT NULL,
    "endTime" timestamp without time zone,
    "userUserID" integer,
    "userLogin" character varying(10),
    "channelChannelID" integer
);


ALTER TABLE public."Mute" OWNER TO username42;

--
-- Name: Mute_muteID_seq; Type: SEQUENCE; Schema: public; Owner: username42
--

CREATE SEQUENCE public."Mute_muteID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Mute_muteID_seq" OWNER TO username42;

--
-- Name: Mute_muteID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: username42
--

ALTER SEQUENCE public."Mute_muteID_seq" OWNED BY public."Mute"."muteID";


--
-- Name: Subscriber; Type: TABLE; Schema: public; Owner: username42
--

CREATE TABLE public."Subscriber" (
    "userUserID_1" integer NOT NULL,
    "userLogin_1" character varying(10) NOT NULL,
    "userUserID_2" integer NOT NULL,
    "userLogin_2" character varying(10) NOT NULL
);


ALTER TABLE public."Subscriber" OWNER TO username42;

--
-- Name: User; Type: TABLE; Schema: public; Owner: username42
--

CREATE TABLE public."User" (
    "UserID" integer NOT NULL,
    login character varying(10) NOT NULL,
    nickname character varying(12) NOT NULL,
    visit boolean NOT NULL,
    has_2fa boolean DEFAULT false NOT NULL,
    avatar_path character varying(256),
    status public."User Status" DEFAULT '1'::public."User Status" NOT NULL,
    "credentialId" integer
);


ALTER TABLE public."User" OWNER TO username42;

--
-- Name: UserList; Type: TABLE; Schema: public; Owner: username42
--

CREATE TABLE public."UserList" (
    "channelsChannelID" integer NOT NULL,
    "userUserID" integer NOT NULL,
    "userLogin" character varying(10) NOT NULL
);


ALTER TABLE public."UserList" OWNER TO username42;

--
-- Name: User_UserID_seq; Type: SEQUENCE; Schema: public; Owner: username42
--

CREATE SEQUENCE public."User_UserID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_UserID_seq" OWNER TO username42;

--
-- Name: User_UserID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: username42
--

ALTER SEQUENCE public."User_UserID_seq" OWNED BY public."User"."UserID";


--
-- Name: Banned bannedID; Type: DEFAULT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Banned" ALTER COLUMN "bannedID" SET DEFAULT nextval('public."Banned_bannedID_seq"'::regclass);


--
-- Name: ChannelCredential id; Type: DEFAULT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."ChannelCredential" ALTER COLUMN id SET DEFAULT nextval('public."ChannelCredential_id_seq"'::regclass);


--
-- Name: Channels channelID; Type: DEFAULT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Channels" ALTER COLUMN "channelID" SET DEFAULT nextval('public."Channels_channelID_seq"'::regclass);


--
-- Name: Credential id; Type: DEFAULT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Credential" ALTER COLUMN id SET DEFAULT nextval('public."Credential_id_seq"'::regclass);


--
-- Name: Games ID; Type: DEFAULT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Games" ALTER COLUMN "ID" SET DEFAULT nextval('public."Games_ID_seq"'::regclass);


--
-- Name: Invites inviteID; Type: DEFAULT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Invites" ALTER COLUMN "inviteID" SET DEFAULT nextval('public."Invites_inviteID_seq"'::regclass);


--
-- Name: Messages id; Type: DEFAULT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Messages" ALTER COLUMN id SET DEFAULT nextval('public."Messages_id_seq"'::regclass);


--
-- Name: Mute muteID; Type: DEFAULT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Mute" ALTER COLUMN "muteID" SET DEFAULT nextval('public."Mute_muteID_seq"'::regclass);


--
-- Name: User UserID; Type: DEFAULT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."User" ALTER COLUMN "UserID" SET DEFAULT nextval('public."User_UserID_seq"'::regclass);


--
-- Name: Banned PK_01d5262280ca0474c9187fbe733; Type: CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Banned"
    ADD CONSTRAINT "PK_01d5262280ca0474c9187fbe733" PRIMARY KEY ("bannedID");


--
-- Name: ChannelCredential PK_32053333cf6a7bc32d62f5551be; Type: CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."ChannelCredential"
    ADD CONSTRAINT "PK_32053333cf6a7bc32d62f5551be" PRIMARY KEY (id);


--
-- Name: Subscriber PK_42742ec3768c9623ac5695775cb; Type: CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Subscriber"
    ADD CONSTRAINT "PK_42742ec3768c9623ac5695775cb" PRIMARY KEY ("userUserID_1", "userLogin_1", "userUserID_2", "userLogin_2");


--
-- Name: User PK_65f16ed27251a53509a588d51c9; Type: CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "PK_65f16ed27251a53509a588d51c9" PRIMARY KEY ("UserID", login);


--
-- Name: UserList PK_743ea49d585dde8e7a9825c4ba8; Type: CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."UserList"
    ADD CONSTRAINT "PK_743ea49d585dde8e7a9825c4ba8" PRIMARY KEY ("channelsChannelID", "userUserID", "userLogin");


--
-- Name: Games PK_79e45bae1d86f5937e92e71a327; Type: CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Games"
    ADD CONSTRAINT "PK_79e45bae1d86f5937e92e71a327" PRIMARY KEY ("ID");


--
-- Name: Credential PK_93b7d234b9750b1259b86647296; Type: CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Credential"
    ADD CONSTRAINT "PK_93b7d234b9750b1259b86647296" PRIMARY KEY (id);


--
-- Name: Blocked PK_98fc88621e5c12a6fd3e45eb785; Type: CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Blocked"
    ADD CONSTRAINT "PK_98fc88621e5c12a6fd3e45eb785" PRIMARY KEY ("userUserID_1", "userLogin_1", "userUserID_2", "userLogin_2");


--
-- Name: Mute PK_9adfcbd368c1bb64eb3c345e354; Type: CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Mute"
    ADD CONSTRAINT "PK_9adfcbd368c1bb64eb3c345e354" PRIMARY KEY ("muteID");


--
-- Name: Channels PK_d5c58f77cc8ee903a16556775ad; Type: CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Channels"
    ADD CONSTRAINT "PK_d5c58f77cc8ee903a16556775ad" PRIMARY KEY ("channelID");


--
-- Name: AdminList PK_ecbe70c1b9654c38a3c47828bbc; Type: CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."AdminList"
    ADD CONSTRAINT "PK_ecbe70c1b9654c38a3c47828bbc" PRIMARY KEY ("channelsChannelID", "userUserID", "userLogin");


--
-- Name: Messages PK_ecc722506c4b974388431745e8b; Type: CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "PK_ecc722506c4b974388431745e8b" PRIMARY KEY (id);


--
-- Name: Invites PK_eedb33c0075cac795a3d1680260; Type: CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Invites"
    ADD CONSTRAINT "PK_eedb33c0075cac795a3d1680260" PRIMARY KEY ("inviteID");


--
-- Name: Channels REL_22ec5b9eb6e7c117bc81dc6398; Type: CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Channels"
    ADD CONSTRAINT "REL_22ec5b9eb6e7c117bc81dc6398" UNIQUE ("Credential");


--
-- Name: User REL_29593c7f03118ea9ae6107df1a; Type: CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "REL_29593c7f03118ea9ae6107df1a" UNIQUE ("credentialId");


--
-- Name: IDX_17880270f47ad452433a416418; Type: INDEX; Schema: public; Owner: username42
--

CREATE INDEX "IDX_17880270f47ad452433a416418" ON public."AdminList" USING btree ("channelsChannelID");


--
-- Name: IDX_34059311810b620aa88723b2df; Type: INDEX; Schema: public; Owner: username42
--

CREATE INDEX "IDX_34059311810b620aa88723b2df" ON public."Blocked" USING btree ("userUserID_2", "userLogin_2");


--
-- Name: IDX_360a70d8db095ab16f6aef7dd8; Type: INDEX; Schema: public; Owner: username42
--

CREATE INDEX "IDX_360a70d8db095ab16f6aef7dd8" ON public."UserList" USING btree ("userUserID", "userLogin");


--
-- Name: IDX_6143fed65980074379774ebbdc; Type: INDEX; Schema: public; Owner: username42
--

CREATE INDEX "IDX_6143fed65980074379774ebbdc" ON public."AdminList" USING btree ("userUserID", "userLogin");


--
-- Name: IDX_946f4c9d6d705a032e649817cc; Type: INDEX; Schema: public; Owner: username42
--

CREATE INDEX "IDX_946f4c9d6d705a032e649817cc" ON public."UserList" USING btree ("channelsChannelID");


--
-- Name: IDX_ba65b968de82f646dc28a2c0b7; Type: INDEX; Schema: public; Owner: username42
--

CREATE INDEX "IDX_ba65b968de82f646dc28a2c0b7" ON public."Subscriber" USING btree ("userUserID_2", "userLogin_2");


--
-- Name: IDX_c1d066a4388ef0bab79f050464; Type: INDEX; Schema: public; Owner: username42
--

CREATE INDEX "IDX_c1d066a4388ef0bab79f050464" ON public."Blocked" USING btree ("userUserID_1", "userLogin_1");


--
-- Name: IDX_ff6296fe81a3ced57ee1924a71; Type: INDEX; Schema: public; Owner: username42
--

CREATE INDEX "IDX_ff6296fe81a3ced57ee1924a71" ON public."Subscriber" USING btree ("userUserID_1", "userLogin_1");


--
-- Name: Invites FK_0a146408b2c91b63e402a9f2010; Type: FK CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Invites"
    ADD CONSTRAINT "FK_0a146408b2c91b63e402a9f2010" FOREIGN KEY ("userUserID", "userLogin") REFERENCES public."User"("UserID", login);


--
-- Name: Messages FK_0a865b3df1e1aa5bf6322d47c6a; Type: FK CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "FK_0a865b3df1e1aa5bf6322d47c6a" FOREIGN KEY ("authorUserID", "authorLogin") REFERENCES public."User"("UserID", login);


--
-- Name: AdminList FK_17880270f47ad452433a4164185; Type: FK CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."AdminList"
    ADD CONSTRAINT "FK_17880270f47ad452433a4164185" FOREIGN KEY ("channelsChannelID") REFERENCES public."Channels"("channelID") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Channels FK_22ec5b9eb6e7c117bc81dc6398c; Type: FK CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Channels"
    ADD CONSTRAINT "FK_22ec5b9eb6e7c117bc81dc6398c" FOREIGN KEY ("Credential") REFERENCES public."ChannelCredential"(id);


--
-- Name: Mute FK_234235bbf45ae8534ad2b2ceb13; Type: FK CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Mute"
    ADD CONSTRAINT "FK_234235bbf45ae8534ad2b2ceb13" FOREIGN KEY ("userUserID", "userLogin") REFERENCES public."User"("UserID", login);


--
-- Name: User FK_29593c7f03118ea9ae6107df1a1; Type: FK CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "FK_29593c7f03118ea9ae6107df1a1" FOREIGN KEY ("credentialId") REFERENCES public."Credential"(id);


--
-- Name: Blocked FK_34059311810b620aa88723b2dfc; Type: FK CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Blocked"
    ADD CONSTRAINT "FK_34059311810b620aa88723b2dfc" FOREIGN KEY ("userUserID_2", "userLogin_2") REFERENCES public."User"("UserID", login) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Games FK_347661c6cc66b93ec417b9ed714; Type: FK CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Games"
    ADD CONSTRAINT "FK_347661c6cc66b93ec417b9ed714" FOREIGN KEY ("player2UserID", "player2Login") REFERENCES public."User"("UserID", login);


--
-- Name: UserList FK_360a70d8db095ab16f6aef7dd82; Type: FK CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."UserList"
    ADD CONSTRAINT "FK_360a70d8db095ab16f6aef7dd82" FOREIGN KEY ("userUserID", "userLogin") REFERENCES public."User"("UserID", login);


--
-- Name: Invites FK_5a8e961411aa99b6126864db160; Type: FK CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Invites"
    ADD CONSTRAINT "FK_5a8e961411aa99b6126864db160" FOREIGN KEY ("channelChannelID") REFERENCES public."Channels"("channelID");


--
-- Name: Invites FK_5c1db1a93ba36fc251706042867; Type: FK CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Invites"
    ADD CONSTRAINT "FK_5c1db1a93ba36fc251706042867" FOREIGN KEY ("senderUserID", "senderLogin") REFERENCES public."User"("UserID", login);


--
-- Name: AdminList FK_6143fed65980074379774ebbdc3; Type: FK CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."AdminList"
    ADD CONSTRAINT "FK_6143fed65980074379774ebbdc3" FOREIGN KEY ("userUserID", "userLogin") REFERENCES public."User"("UserID", login);


--
-- Name: Banned FK_86659080dcbb26809ff55a7109a; Type: FK CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Banned"
    ADD CONSTRAINT "FK_86659080dcbb26809ff55a7109a" FOREIGN KEY ("channelChannelID") REFERENCES public."Channels"("channelID");


--
-- Name: Games FK_867ad421c499b5dbedcec101f3a; Type: FK CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Games"
    ADD CONSTRAINT "FK_867ad421c499b5dbedcec101f3a" FOREIGN KEY ("player1UserID", "player1Login") REFERENCES public."User"("UserID", login);


--
-- Name: Banned FK_9284be95436d9a7e4679e7db2fa; Type: FK CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Banned"
    ADD CONSTRAINT "FK_9284be95436d9a7e4679e7db2fa" FOREIGN KEY ("userUserID", "userLogin") REFERENCES public."User"("UserID", login);


--
-- Name: UserList FK_946f4c9d6d705a032e649817ccb; Type: FK CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."UserList"
    ADD CONSTRAINT "FK_946f4c9d6d705a032e649817ccb" FOREIGN KEY ("channelsChannelID") REFERENCES public."Channels"("channelID") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Subscriber FK_ba65b968de82f646dc28a2c0b7d; Type: FK CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Subscriber"
    ADD CONSTRAINT "FK_ba65b968de82f646dc28a2c0b7d" FOREIGN KEY ("userUserID_2", "userLogin_2") REFERENCES public."User"("UserID", login);


--
-- Name: Blocked FK_c1d066a4388ef0bab79f0504645; Type: FK CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Blocked"
    ADD CONSTRAINT "FK_c1d066a4388ef0bab79f0504645" FOREIGN KEY ("userUserID_1", "userLogin_1") REFERENCES public."User"("UserID", login) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Messages FK_d344df97ece5bbd200623c177be; Type: FK CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "FK_d344df97ece5bbd200623c177be" FOREIGN KEY ("channelChannelID") REFERENCES public."Channels"("channelID");


--
-- Name: Channels FK_e48680a5348fd94a463084551c0; Type: FK CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Channels"
    ADD CONSTRAINT "FK_e48680a5348fd94a463084551c0" FOREIGN KEY ("ownerUserID", "ownerLogin") REFERENCES public."User"("UserID", login);


--
-- Name: Mute FK_e862a8312b8e5f61e47e9a480a9; Type: FK CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Mute"
    ADD CONSTRAINT "FK_e862a8312b8e5f61e47e9a480a9" FOREIGN KEY ("channelChannelID") REFERENCES public."Channels"("channelID");


--
-- Name: Subscriber FK_ff6296fe81a3ced57ee1924a71f; Type: FK CONSTRAINT; Schema: public; Owner: username42
--

ALTER TABLE ONLY public."Subscriber"
    ADD CONSTRAINT "FK_ff6296fe81a3ced57ee1924a71f" FOREIGN KEY ("userUserID_1", "userLogin_1") REFERENCES public."User"("UserID", login) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

