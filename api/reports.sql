-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jul 22, 2016 at 03:21 PM
-- Server version: 5.5.50-0ubuntu0.14.04.1
-- PHP Version: 5.5.9-1ubuntu4.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `mobile-map-io`
--

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE IF NOT EXISTS `reports` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `datetime_reported` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `what` text COMMENT 'What is it',
  `photo` text COMMENT 'URL to photo for this report',
  `which` tinyint(1) DEFAULT NULL COMMENT 'Which is it?',
  `why` varchar(255) DEFAULT NULL COMMENT 'Why?',
  `place` varchar(255) DEFAULT NULL COMMENT 'Friendly name of report place',
  `lat` decimal(10,8) DEFAULT NULL COMMENT 'Latitude of report place',
  `lng` decimal(11,8) DEFAULT NULL COMMENT 'Longitude of report place',
  `owner` int(11) NOT NULL COMMENT 'UID of user who owns this report',
  `visibility` enum('public','limited','closed') NOT NULL DEFAULT 'public' COMMENT 'Public ops are visible to all, limited ops are visible to owner and advisors, closed events are visible only to owner',
  `active` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Whether this posting is active as described',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=61 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
