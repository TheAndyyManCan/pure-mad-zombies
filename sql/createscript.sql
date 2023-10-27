create table highscores (
    score_id int(3) not null auto_increment,
    username varchar(100) not null,
    round int(3) not null,
    kills int(3) not null,
    primary key(score_id)
);
