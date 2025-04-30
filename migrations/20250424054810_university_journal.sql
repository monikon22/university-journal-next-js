-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS university_journal;
USE university_journal;

-- Create groups table
CREATE TABLE IF NOT EXISTS `groups` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Group number',
  `speciality_code` decimal(3,0) NOT NULL COMMENT 'Speciality code',
  `speciality_name` varchar(100) NOT NULL COMMENT 'Speciality name',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Group formation date',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Last modification date',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create students table
CREATE TABLE IF NOT EXISTS `students` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Student ID',
  `first_name` varchar(100) NOT NULL COMMENT 'Student first name',
  `last_name` varchar(100) NOT NULL COMMENT 'Student last name',
  `group_id` bigint(20) unsigned NOT NULL COMMENT 'Group ID the student belongs to',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Study start date',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Last modification date',
  PRIMARY KEY (`id`),
  UNIQUE KEY `first_name_last_name_group_id` (`first_name`,`last_name`,`group_id`),
  CONSTRAINT `fk_student_group` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create teachers table
CREATE TABLE IF NOT EXISTS `teachers` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Teacher ID',
  `first_name` varchar(100) NOT NULL COMMENT 'Teacher first name',
  `last_name` varchar(100) NOT NULL COMMENT 'Teacher last name',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Work start date',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Last modification date',
  PRIMARY KEY (`id`),
  UNIQUE KEY `first_name_last_name` (`first_name`,`last_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create subjects table
CREATE TABLE IF NOT EXISTS `subjects` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Subject ID',
  `name` varchar(100) NOT NULL COMMENT 'Subject name',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create grades table
CREATE TABLE IF NOT EXISTS `grades` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Record ID',
  `student_id` bigint(20) unsigned NOT NULL COMMENT 'Student ID',
  `teacher_id` bigint(20) unsigned NOT NULL COMMENT 'Teacher ID',
  `grade` int(11) NOT NULL COMMENT 'Grade on a 100-point scale',
  `subject_id` bigint(20) unsigned NOT NULL COMMENT 'Subject ID',
  `note` text DEFAULT NULL COMMENT 'Teacher notes',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Grade assignment date',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Last modification date',
  PRIMARY KEY (`id`),
  KEY `grades_student_id` (`student_id`),
  KEY `grades_teacher_id` (`teacher_id`),
  KEY `grades_subject_id` (`subject_id`),
  CONSTRAINT `fk_grade_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_grade_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_grade_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;