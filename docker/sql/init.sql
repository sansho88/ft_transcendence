CREATE TABLE GAME(
   Id_GAME SERIAL,
   P1_score INTEGER,
   P2_score INTEGER,
   game_type SMALLINT NOT NULL,
   start_date TIMESTAMP,
   PRIMARY KEY(Id_GAME)
);

CREATE TABLE MATCHMAKING(
   Id_MATCHMAKING SERIAL,
   PRIMARY KEY(Id_MATCHMAKING)
);

CREATE TABLE USERS(
   Id_USERS SERIAL,
   username VARCHAR(12)  NOT NULL,
   avatar_path VARCHAR(256) ,
   status SMALLINT NOT NULL,
   token_2FA VARCHAR(100) ,
   has_2FA BOOLEAN NOT NULL,
   Id_MATCHMAKING INTEGER,
   PRIMARY KEY(Id_USERS),
   FOREIGN KEY(Id_MATCHMAKING) REFERENCES MATCHMAKING(Id_MATCHMAKING)
);

CREATE TABLE CHANNELS(
   Id_CHANNEL SERIAL,
   type SMALLINT NOT NULL,
   password VARCHAR(61) ,
   Id_USERS INTEGER NOT NULL,
   PRIMARY KEY(Id_CHANNEL),
   FOREIGN KEY(Id_USERS) REFERENCES USERS(Id_USERS)
);

CREATE TABLE MESSAGES(
   Id_CHANNEL INTEGER,
   Id_USERS INTEGER,
   Id_Message SERIAL,
   date_msg TIMESTAMP NOT NULL,
   content VARCHAR(512)  NOT NULL,
   PRIMARY KEY(Id_CHANNEL, Id_USERS, Id_Message),
   FOREIGN KEY(Id_CHANNEL) REFERENCES CHANNELS(Id_CHANNEL),
   FOREIGN KEY(Id_USERS) REFERENCES USERS(Id_USERS)
);

CREATE TABLE BANNED(
   Id_CHANNEL INTEGER,
   Id_USERS INTEGER,
   Id_BANNED SERIAL,
   PRIMARY KEY(Id_CHANNEL, Id_USERS, Id_BANNED),
   FOREIGN KEY(Id_CHANNEL) REFERENCES CHANNELS(Id_CHANNEL),
   FOREIGN KEY(Id_USERS) REFERENCES USERS(Id_USERS)
);

CREATE TABLE CHANNEL_INVITE(
   Id_CHANNEL INTEGER,
   Id_USERS INTEGER,
   Id_INVITATION SERIAL,
   PRIMARY KEY(Id_CHANNEL, Id_USERS, Id_INVITATION),
   FOREIGN KEY(Id_CHANNEL) REFERENCES CHANNELS(Id_CHANNEL),
   FOREIGN KEY(Id_USERS) REFERENCES USERS(Id_USERS)
);

CREATE TABLE MUTE(
   Id_CHANNEL INTEGER,
   Id_USERS INTEGER,
   Id_MUTE SERIAL,
   PRIMARY KEY(Id_CHANNEL, Id_USERS, Id_MUTE),
   FOREIGN KEY(Id_CHANNEL) REFERENCES CHANNELS(Id_CHANNEL),
   FOREIGN KEY(Id_USERS) REFERENCES USERS(Id_USERS)
);

CREATE TABLE CHALLENGE(
   Id_USERS INTEGER,
   Id_USERS_1 INTEGER,
   Id_CHALLENGE SERIAL,
   accepted BOOLEAN NOT NULL,
   PRIMARY KEY(Id_USERS, Id_USERS_1, Id_CHALLENGE),
   FOREIGN KEY(Id_USERS) REFERENCES USERS(Id_USERS),
   FOREIGN KEY(Id_USERS_1) REFERENCES USERS(Id_USERS)
);

CREATE TABLE FOLLOW(
   Id_USERS INTEGER,
   Id_USERS_1 INTEGER,
   PRIMARY KEY(Id_USERS, Id_USERS_1),
   FOREIGN KEY(Id_USERS) REFERENCES USERS(Id_USERS),
   FOREIGN KEY(Id_USERS_1) REFERENCES USERS(Id_USERS)
);

CREATE TABLE SUBSCRIBE(
   Id_USERS INTEGER,
   Id_USERS_1 INTEGER,
   PRIMARY KEY(Id_USERS, Id_USERS_1),
   FOREIGN KEY(Id_USERS) REFERENCES USERS(Id_USERS),
   FOREIGN KEY(Id_USERS_1) REFERENCES USERS(Id_USERS)
);

CREATE TABLE BLOCK(
   Id_USERS INTEGER,
   Id_USERS_1 INTEGER,
   PRIMARY KEY(Id_USERS, Id_USERS_1),
   FOREIGN KEY(Id_USERS) REFERENCES USERS(Id_USERS),
   FOREIGN KEY(Id_USERS_1) REFERENCES USERS(Id_USERS)
);

CREATE TABLE JOINED(
   Id_USERS INTEGER,
   Id_CHANNEL INTEGER,
   PRIMARY KEY(Id_USERS, Id_CHANNEL),
   FOREIGN KEY(Id_USERS) REFERENCES USERS(Id_USERS),
   FOREIGN KEY(Id_CHANNEL) REFERENCES CHANNELS(Id_CHANNEL)
);

CREATE TABLE ADMINISTRATE(
   Id_USERS INTEGER,
   Id_CHANNEL INTEGER,
   PRIMARY KEY(Id_USERS, Id_CHANNEL),
   FOREIGN KEY(Id_USERS) REFERENCES USERS(Id_USERS),
   FOREIGN KEY(Id_CHANNEL) REFERENCES CHANNELS(Id_CHANNEL)
);

CREATE TABLE PLAY(
   Id_USERS INTEGER,
   Id_GAME INTEGER,
   PRIMARY KEY(Id_USERS, Id_GAME),
   FOREIGN KEY(Id_USERS) REFERENCES USERS(Id_USERS),
   FOREIGN KEY(Id_GAME) REFERENCES GAME(Id_GAME)
);