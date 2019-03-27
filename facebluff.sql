-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-12-2018 a las 19:56:18
-- Versión del servidor: 10.1.28-MariaDB
-- Versión de PHP: 7.1.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `facebluff`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `answer`
--

CREATE TABLE `answer` (
  `id_answer` int(11) NOT NULL,
  `id_question` int(11) NOT NULL,
  `text` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `answer`
--

INSERT INTO `answer` (`id_answer`, `id_question`, `text`) VALUES
(1, 1, 'Rojo'),
(2, 1, 'Azul'),
(3, 1, 'Verde'),
(4, 1, 'Amarillo'),
(5, 2, 'De perros'),
(6, 2, 'De gatos'),
(7, 2, 'Soy alérgico a los dos'),
(8, 2, 'De ambos'),
(9, 3, 'Matrix'),
(10, 3, 'Cadena perpetua'),
(11, 3, 'El rey León'),
(12, 3, 'El octavo pasajero'),
(13, 4, 'Nunca he ido a la playa'),
(14, 4, 'De montaña'),
(15, 4, 'De playa'),
(16, 4, 'Ninguna de las dos'),
(17, 5, 'Chocolate'),
(18, 5, 'Vainilla'),
(19, 5, 'Almendra'),
(20, 5, 'Fresa'),
(21, 6, 'Si'),
(22, 6, 'No'),
(23, 6, 'Es complicado'),
(24, 6, 'No lo sé'),
(25, 7, 'Juego de tronos'),
(26, 7, 'Hora de aventuras'),
(27, 7, 'Friends'),
(28, 7, 'Historias corrientes'),
(29, 6, 'May beee');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `friendship`
--

CREATE TABLE `friendship` (
  `id_user` int(11) NOT NULL,
  `id_friend` int(11) NOT NULL,
  `request` enum('accepted','waiting') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `friendship`
--

INSERT INTO `friendship` (`id_user`, `id_friend`, `request`) VALUES
(30, 29, 'accepted'),
(29, 30, 'accepted'),
(31, 29, 'accepted'),
(29, 31, 'accepted');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `myself`
--

CREATE TABLE `myself` (
  `id_user` int(11) NOT NULL,
  `id_question` int(11) NOT NULL,
  `id_answer` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `myself`
--

INSERT INTO `myself` (`id_user`, `id_question`, `id_answer`) VALUES
(31, 6, 29),
(29, 6, 22);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `other`
--

CREATE TABLE `other` (
  `id_user` int(11) NOT NULL,
  `id_friend` int(11) NOT NULL,
  `id_question` int(11) NOT NULL,
  `answer` enum('C','F') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `other`
--

INSERT INTO `other` (`id_user`, `id_friend`, `id_question`, `answer`) VALUES
(29, 31, 6, 'C'),
(31, 29, 6, 'F'),
(30, 29, 6, 'F');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `photo`
--

CREATE TABLE `photo` (
  `id_photo` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `photo` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `photo`
--

INSERT INTO `photo` (`id_photo`, `id_user`, `photo`, `description`) VALUES
(1, 29, '3c795ec6d9d9131f8e3c91ccfb9537b2', 'Pasándolo bien con los amigos en la playa! Feliz verano!'),
(2, 29, '12c413995aee7003ece19799d1e56484', 'Hace calor!'),
(3, 29, 'd81bade4fcfbda75ea345bd789fd91d4', 'Atardecer en las islas'),
(4, 30, 'fcdf827885787e946d90e0b9b0a0607b', 'En las nuevas clases de fotografía!'),
(5, 30, 'fe564f4595ac2edf8072f51f6f50f472', 'Mejorando cada día! con mucho ánimo!'),
(6, 31, 'dbcd63a02b1b3e8f263bde92502a5efa', 'Viajecito a China'),
(7, 31, '26aca4856b5be67463c654198e4e7634', 'Bonitos paisajes!');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `question`
--

CREATE TABLE `question` (
  `id_question` int(11) NOT NULL,
  `text` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `question`
--

INSERT INTO `question` (`id_question`, `text`) VALUES
(1, '¿Cuál es tu color favorito?'),
(2, '¿Eres de perros o de gatos?'),
(3, '¿Qué película te gusta más?'),
(4, '¿Eres de playa o de montaña?'),
(5, '¿Cuál es tu sabor de helado favorito?'),
(6, '¿Tienes pareja?'),
(7, '¿Cuál es tu serie de televisió');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('fLdnEZICbkm8BpZuezt1j4ZjZ9rdbMNz', 1544727359, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"currentUser\":{\"id_user\":30,\"email\":\"user2@gmail.com\",\"password\":\"123456\",\"name\":\"Robert\",\"gender\":\"M\",\"birthdate\":\"1990-02-14\",\"imgProfile\":\"a9f0fa75cae512f5da3800c37234cdab\",\"points\":200},\"findName\":\"\",\"questionId\":\"6\"}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `id_user` int(11) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(30) NOT NULL,
  `name` varchar(30) NOT NULL,
  `gender` enum('M','F','O') NOT NULL,
  `birthdate` date NOT NULL,
  `img_profile` varchar(255) NOT NULL,
  `points` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`id_user`, `email`, `password`, `name`, `gender`, `birthdate`, `img_profile`, `points`) VALUES
(29, 'user1@gmail.com', '123456', 'Lisa Smith', 'F', '2000-02-01', '6f9e78ad3d7a4fa63d08608e9e11ecf4', 450),
(30, 'user2@gmail.com', '123456', 'Robert', 'M', '1990-02-14', 'a9f0fa75cae512f5da3800c37234cdab', 200),
(31, 'user3@gmail.com', '123456', 'Alexis Brown', 'O', '1990-10-16', '095a3b08a4b2c8c2856aed7a0ae8dc01', 200),
(32, 'user4@gmail.com', '123456', 'Suji Park', 'F', '1989-08-30', '876b9ea603090a24c6eb93e949c66350', 0),
(33, 'user5@gmail.com', '123456', 'Alex Martinez', 'M', '1986-09-22', '62ff4c1e9c86657d1fa215fe3c6f866b', 0),
(34, 'user6@gmail.com', '123456', 'Lisa Suarez', 'F', '1993-07-29', '310ca82fb692d8de6ae551875565e20c', 0),
(35, 'user7@gmail.com', '123456', 'Hector Suarez', 'M', '1990-05-24', '9448b6aa7835668ab15b09044fd3bbb7', 0),
(36, 'user8@gmail.com', '123456', 'Minho Kim', 'M', '1996-12-27', '56b817deef3584f2c45f97b4aeb505ed', 0),
(37, 'user9@gmail.com', '123456', 'Jada Kim', 'M', '1979-09-21', '617edc52379c0ba58061af2fe0392d88', 0),
(38, 'user10@gmail.com', '123456', 'Hannah', 'F', '1989-02-01', '5b9afcadc926122e325e4ad86d025c0e', 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `answer`
--
ALTER TABLE `answer`
  ADD PRIMARY KEY (`id_answer`),
  ADD KEY `id_question` (`id_question`);

--
-- Indices de la tabla `friendship`
--
ALTER TABLE `friendship`
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_friend` (`id_friend`);

--
-- Indices de la tabla `myself`
--
ALTER TABLE `myself`
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_question` (`id_question`),
  ADD KEY `id_answer` (`id_answer`);

--
-- Indices de la tabla `other`
--
ALTER TABLE `other`
  ADD KEY `id_question` (`id_question`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_friend` (`id_friend`);

--
-- Indices de la tabla `photo`
--
ALTER TABLE `photo`
  ADD PRIMARY KEY (`id_photo`);

--
-- Indices de la tabla `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id_question`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `answer`
--
ALTER TABLE `answer`
  MODIFY `id_answer` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT de la tabla `photo`
--
ALTER TABLE `photo`
  MODIFY `id_photo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `question`
--
ALTER TABLE `question`
  MODIFY `id_question` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `answer`
--
ALTER TABLE `answer`
  ADD CONSTRAINT `answer_ibfk_1` FOREIGN KEY (`id_question`) REFERENCES `question` (`id_question`);

--
-- Filtros para la tabla `friendship`
--
ALTER TABLE `friendship`
  ADD CONSTRAINT `friendship_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`),
  ADD CONSTRAINT `friendship_ibfk_2` FOREIGN KEY (`id_friend`) REFERENCES `user` (`id_user`);

--
-- Filtros para la tabla `myself`
--
ALTER TABLE `myself`
  ADD CONSTRAINT `myself_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`),
  ADD CONSTRAINT `myself_ibfk_2` FOREIGN KEY (`id_question`) REFERENCES `question` (`id_question`),
  ADD CONSTRAINT `myself_ibfk_3` FOREIGN KEY (`id_answer`) REFERENCES `answer` (`id_answer`);

--
-- Filtros para la tabla `other`
--
ALTER TABLE `other`
  ADD CONSTRAINT `other_ibfk_1` FOREIGN KEY (`id_question`) REFERENCES `question` (`id_question`),
  ADD CONSTRAINT `other_ibfk_3` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`),
  ADD CONSTRAINT `other_ibfk_4` FOREIGN KEY (`id_friend`) REFERENCES `user` (`id_user`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
