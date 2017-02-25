-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema game
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema game
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `game` DEFAULT CHARACTER SET utf8 ;
USE `game` ;

-- -----------------------------------------------------
-- Table `game`.`PLAYERS`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `game`.`PLAYERS` (
  `PID` INT(5) NOT NULL AUTO_INCREMENT,
  `login` VARCHAR(30) NOT NULL,
  `password` VARCHAR(30) NOT NULL,
  `e-mail` VARCHAR(50) NOT NULL,
  `rating` INT(5) NOT NULL,
  PRIMARY KEY (`PID`),
  UNIQUE INDEX `login_UNIQUE` (`login` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `game`.`FACTIONS`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `game`.`FACTIONS` (
  `FID` INT(1) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`FID`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `game`.`CARDS`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `game`.`CARDS` (
  `CID` INT(5) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `description` VARCHAR(150) NOT NULL,
  `cX` INT(3) NOT NULL,
  `HP` INT(3) NOT NULL,
  `DP` INT(3) NOT NULL,
  `AP` INT(2) NOT NULL,
  `FID` INT(1) NOT NULL,
  PRIMARY KEY (`CID`, `FID`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC),
  INDEX `cards_belong_to_factions_idx` (`FID` ASC),
  CONSTRAINT `cards_belong_to_factions`
    FOREIGN KEY (`FID`)
    REFERENCES `game`.`FACTIONS` (`FID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `game`.`PLAYERS_HAVE_CARDS`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `game`.`PLAYERS_HAVE_CARDS` (
  `PID` INT(5) NOT NULL,
  `CID` INT(5) NOT NULL,
  `num` INT(1) NOT NULL,
  INDEX `fk_players1_has_cards_cards1_idx` (`CID` ASC),
  INDEX `fk_players1_has_cards_players11_idx` (`PID` ASC),
  CONSTRAINT `fk_players1_has_cards_players11`
    FOREIGN KEY (`PID`)
    REFERENCES `game`.`PLAYERS` (`PID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_players1_has_cards_cards1`
    FOREIGN KEY (`CID`)
    REFERENCES `game`.`CARDS` (`CID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `game`.`DECKS`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `game`.`DECKS` (
  `DID` INT(5) NOT NULL AUTO_INCREMENT,
  `FID` INT(1) NOT NULL,
  `PID` INT(5) NOT NULL,
  `name` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`DID`, `PID`, `FID`),
  INDEX `deck_belongs_to_faction_idx` (`FID` ASC),
  INDEX `deck_belongs_to_player_idx` (`PID` ASC),
  CONSTRAINT `deck_belongs_to_faction`
    FOREIGN KEY (`FID`)
    REFERENCES `game`.`FACTIONS` (`FID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `deck_belongs_to_player`
    FOREIGN KEY (`PID`)
    REFERENCES `game`.`PLAYERS` (`PID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `game`.`DECKS_HAVE_CARDS`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `game`.`DECKS_HAVE_CARDS` (
  `DID` INT(5) NOT NULL,
  `CID` INT(5) NOT NULL,
  `num` INT(1) NOT NULL,
  INDEX `fk_decks_has_cards_cards1_idx` (`CID` ASC),
  INDEX `fk_decks_has_cards_decks1_idx` (`DID` ASC),
  CONSTRAINT `fk_decks_has_cards_decks1`
    FOREIGN KEY (`DID`)
    REFERENCES `game`.`DECKS` (`DID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_decks_has_cards_cards1`
    FOREIGN KEY (`CID`)
    REFERENCES `game`.`CARDS` (`CID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `game`.`BASES`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `game`.`BASES` (
  `BID` INT(1) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `description` VARCHAR(300) NOT NULL,
  `FID` INT(1) NOT NULL,
  PRIMARY KEY (`BID`, `FID`),
  INDEX `fk_heroes_factions1_idx` (`FID` ASC),
  CONSTRAINT `fk_heroes_factions1`
    FOREIGN KEY (`FID`)
    REFERENCES `game`.`FACTIONS` (`FID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

USE `game`;

DELIMITER $$
USE `game`$$
CREATE DEFINER = CURRENT_USER TRIGGER `game`.`PLAYERS_AFTER_INSERT` AFTER INSERT ON `PLAYERS`
FOR EACH ROW
BEGIN
  DECLARE did INT(5);

  INSERT INTO PLAYERS_HAVE_CARDS VALUES (new.PID, 1, 2),(new.PID, 2, 2),(new.PID, 3, 2),(new.PID, 4, 2),(new.PID, 5, 2),(new.PID, 6, 2),(new.PID, 7, 2),(new.PID, 8, 2),(new.PID, 9, 2),(new.PID, 10, 2),(new.PID, 11, 2),(new.PID, 12, 2),(new.PID, 13, 2),(new.PID, 14, 2),(new.PID, 15, 2),(new.PID, 16, 2),(new.PID, 17, 2),(new.PID, 18, 2),(new.PID, 19, 2),(new.PID, 20, 2),(new.PID, 21, 2),(new.PID, 22, 2),(new.PID, 23, 2),(new.PID, 24, 2),(new.PID, 25, 2),(new.PID, 26, 2),(new.PID, 27, 2),(new.PID, 28, 2),(new.PID, 29, 2),(new.PID, 30, 2),(new.PID, 31, 2),(new.PID, 32, 2),(new.PID, 33, 2),(new.PID, 34, 2),(new.PID, 35, 2),(new.PID, 36, 2),(new.PID, 37, 2),(new.PID, 38, 2),(new.PID, 39, 2),(new.PID, 40, 2),(new.PID, 41, 2),(new.PID, 42, 2),(new.PID, 43, 2),(new.PID, 44, 2),(new.PID, 45, 2),(new.PID, 46, 2),(new.PID, 47, 2),(new.PID, 48, 2),(new.PID, 49, 2),(new.PID, 50, 2),(new.PID, 51, 2),(new.PID, 52, 2),(new.PID, 53, 2),(new.PID, 54, 2),(new.PID, 55, 2),(new.PID, 56, 2),(new.PID, 57, 2),(new.PID, 58, 2),(new.PID, 59, 2),(new.PID, 60, 2);

  INSERT INTO DECKS VALUES (DEFAULT, 1, new.PID, 'Warriors Deck'),(DEFAULT, 2, new.PID, 'Scientists Deck'),(DEFAULT, 3, new.PID, 'Artists Deck');
  SELECT LAST_INSERT_ID() INTO @did;

  INSERT INTO DECKS_HAVE_CARDS VALUES 
  (@did, 1, 2),(@did, 2, 2),(@did, 3, 2),(@did, 4, 2),(@did, 5, 2),
  (@did, 6, 2),(@did, 7, 2),(@did, 8, 2),(@did, 9, 2),(@did, 10, 2),
  (@did, 11, 2),(@did, 12, 2),(@did, 13, 2),(@did, 14, 2),(@did, 15, 2),
  (@did+1, 21, 2),(@did+1, 22, 2),(@did+1, 23, 2),(@did+1, 24, 2),(@did+1, 25, 2),
  (@did+1, 26, 2),(@did+1, 27, 2),(@did+1, 28, 2),(@did+1, 29, 2),(@did+1, 30, 2),
  (@did+1, 31, 2),(@did+1, 32, 2),(@did+1, 33, 2),(@did+1, 34, 2),(@did+1, 35, 2),
  (@did+2, 41, 2),(@did+2, 42, 2),(@did+2, 43, 2),(@did+2, 44, 2),(@did+2, 45, 2),
  (@did+2, 46, 2),(@did+2, 47, 2),(@did+2, 48, 2),(@did+2, 49, 2),(@did+2, 50, 2),
  (@did+2, 51, 2),(@did+2, 52, 2),(@did+2, 53, 2),(@did+2, 54, 2),(@did+2, 55, 2);


END$$


DELIMITER ;

-- -----------------------------------------------------
-- Inserting initial information into the database
-- -----------------------------------------------------
INSERT INTO FACTIONS VALUES (1, 'Warriors'),
                            (2, 'Scientists'),
                            (3, 'Artists');

INSERT INTO BASES VALUES (1, 'The Castle', 'Base of Warriors', 1),
                         (2, 'The Lab', 'Base of Scientists', 2),
                         (3, 'The Cathedral', 'Base of Artists', 3);

INSERT INTO CARDS VALUES (1, 'Admiral Nelson', '', 0, 2, 1, 1, 1),
                         (2, 'Alexander the Great', '', 1, 2, 1, 1, 1),
                         (3, 'Attila the Hun', '', 2, 2, 1, 1, 1),
                         (4, 'Bruce Lee', '', 3, 2, 1, 1, 1),
                         (5, 'Julius Caesar', '', 4, 3, 2, 2, 1),
                         (6, 'Tsar Cannon', '', 5, 3, 2, 2, 1),
                         (7, "Shaquille O''Neal", '', 6, 3, 2, 2, 1),
                         (8, 'Napoleon Bonaparte', '', 7, 3, 2, 2, 1),
                         (9, 'Muhammad Ali', '', 8, 4, 3, 3, 1),
                         (10, 'Mao Zedong', '', 9, 4, 3, 3, 1),
                         (11, 'John Cena', '', 10, 4, 3, 3, 1),
                         (12, 'Jeanne d\'\'Arc', '', 11, 4, 3, 3, 1),
                         (13, 'Gennady Golovkin', '', 12, 5, 4, 4, 1),
                         (14, 'Dalai Lama', '', 13, 5, 4, 4, 1),
                         (15, 'Card #15', '', 14, 5, 4, 4, 1),
                         (16, 'Card #16', '', 15, 5, 4, 4, 1),
                         (17, 'Card #17', '', 16, 6, 5, 5, 1),
                         (18, 'Card #18', '', 17, 6, 5, 5, 1),
                         (19, 'Card #19', '', 18, 6, 5, 5, 1),
                         (20, 'Card #20', '', 19, 6, 5, 5, 1),
                         (21, 'Neil deGrasse Tyson', '', 20, 2, 1, 1, 2),
                         (22, 'Alan Turing', '', 21, 2, 1, 1, 2),
                         (23, 'Nikola Tesla', '', 22, 2, 1, 1, 2),
                         (24, 'Robert Oppenheimer', '', 23, 2, 1, 1, 2),
                         (25, 'Georg Simon Ohm', '', 24, 3, 2, 2, 2),
                         (26, 'Alfred Nobel', '', 25, 3, 2, 2, 2),
                         (27, 'Sir Isaac Newton', '', 26, 3, 2, 2, 2),
                         (28, 'Karl Marx', '', 27, 3, 2, 2, 2),
                         (29, 'Werner Heisenberg', '', 28, 4, 3, 3, 2),
                         (30, 'Alexander Fleming', '', 29, 4, 3, 3, 2),
                         (31, 'Michael Faraday', '', 30, 4, 3, 3, 2),
                         (32, 'Albert Einstein', '', 31, 4, 3, 3, 2),
                         (33, 'Charles Darwin', '', 32, 5, 4, 4, 2),
                         (34, 'Marie Curie', '', 33, 5, 4, 4, 2),
                         (35, 'George Boole', '', 34, 5, 4, 4, 2),
                         (36, 'Archimedes', '', 35, 5, 4, 4, 2),
                         (37, 'Card #37', '', 36, 6, 5, 5, 2),
                         (38, 'Card #38', '', 37, 6, 5, 5, 2),
                         (39, 'Card #39', '', 38, 6, 5, 5, 2),
                         (40, 'Card #40', '', 39, 6, 5, 5, 2),
                         (41, 'Emma Watson', '', 40, 2, 1, 1, 3),
                         (42, 'Andy Warhol', '', 41, 2, 1, 1, 3),
                         (43, 'Vincent van Gogh', '', 42, 2, 1, 1, 3),
                         (44, 'Quentin Tarantino', '', 43, 2, 1, 1, 3),
                         (45, 'Stan Lee', '', 44, 3, 2, 2, 3),
                         (46, 'William Shakespeare', '', 45, 3, 2, 2, 3),
                         (47, 'Mozart', '', 46, 3, 2, 2, 3),
                         (48, 'Metallica', '', 47, 3, 2, 2, 3),
                         (49, 'George Martin', '', 48, 4, 3, 3, 3),
                         (50, 'Kazimir Malevich', '', 49, 4, 3, 3, 3),
                         (51, 'Brothers Grimm', '', 50, 4, 3, 3, 3),
                         (52, 'Salvador Dali', '', 51, 5, 4, 4, 3),
                         (53, 'The Beatles', '', 52, 5, 4, 4, 3),
                         (54, 'Michael Bay', '', 53, 5, 4, 4, 3),
                         (55, 'Hans Andersen', '', 54, 5, 4, 4, 3),
                         (56, 'Alan Moore', '', 55, 5, 4, 4, 3),
                         (57, 'AC/DC', '', 56, 6, 5, 5, 3),
                         (58, 'Card #58', '', 57, 6, 5, 5, 3),
                         (59, 'Card #59', '', 58, 6, 5, 5, 3),
                         (60, 'Card #60', '', 59, 6, 5, 5, 3);

INSERT INTO PLAYERS VALUES (0, 'Nagibot', 'none', 'none', 99999);