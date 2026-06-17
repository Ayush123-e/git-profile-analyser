-- Database Creation
CREATE DATABASE IF NOT EXISTS `github_profile_analyser`;
USE `github_profile_analyser`;

-- Table structure for table `github_profiles`
CREATE TABLE IF NOT EXISTS `github_profiles` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255) NOT NULL UNIQUE,
    `name` VARCHAR(255) DEFAULT NULL,
    `avatar_url` VARCHAR(255) DEFAULT NULL,
    `bio` TEXT DEFAULT NULL,
    `public_repos` INT DEFAULT 0,
    `followers` INT DEFAULT 0,
    `following` INT DEFAULT 0,
    `github_created_at` DATETIME DEFAULT NULL,
    `analysis_data` JSON DEFAULT NULL,
    `created_at` DATETIME NOT NULL,
    `analyzed_at` DATETIME NOT NULL,
    UNIQUE KEY `idx_username_unique` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
