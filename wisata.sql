-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.6.4-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.2.0.6213
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for pariwisata
CREATE DATABASE IF NOT EXISTS `pariwisata` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `pariwisata`;

-- Dumping structure for table pariwisata.penginapan
CREATE TABLE IF NOT EXISTS `penginapan` (
  `id_peng` int(11) NOT NULL,
  `nama_peng` varchar(50) DEFAULT NULL,
  `lokasi_peng` text DEFAULT NULL,
  `keterangan_peng` text DEFAULT NULL,
  PRIMARY KEY (`id_peng`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table pariwisata.penginapan: ~3 rows (approximately)
/*!40000 ALTER TABLE `penginapan` DISABLE KEYS */;
INSERT INTO `penginapan` (`id_peng`, `nama_peng`, `lokasi_peng`, `keterangan_peng`) VALUES
	(1, 'Cendana', 'jl.perintis', 'harga per malam Rp.500.00'),
	(2, 'Permadai', 'jl.lontar', 'harga per malam Rp.250.000'),
	(3, 'Aston', 'jl.geragas', 'harga per malam Rp.400.00');
/*!40000 ALTER TABLE `penginapan` ENABLE KEYS */;

-- Dumping structure for table pariwisata.retaurant
CREATE TABLE IF NOT EXISTS `retaurant` (
  `id_rest` int(11) NOT NULL DEFAULT 0,
  `nama_rest` varchar(50) DEFAULT NULL,
  `lokasi_rest` text DEFAULT NULL,
  `keterangan_rest` text DEFAULT NULL,
  PRIMARY KEY (`id_rest`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table pariwisata.retaurant: ~3 rows (approximately)
/*!40000 ALTER TABLE `retaurant` DISABLE KEYS */;
INSERT INTO `retaurant` (`id_rest`, `nama_rest`, `lokasi_rest`, `keterangan_rest`) VALUES
	(1, 'Palapa', 'jl.Kejora', 'harga nasi goreng = Rp.20.000'),
	(2, 'Suka makan', 'jl.malio', 'harga nasi goreng = Rp.25.000'),
	(3, 'Swakarya', 'jl.suratim', 'harga nasi goreng = Rp.25.000');
/*!40000 ALTER TABLE `retaurant` ENABLE KEYS */;

-- Dumping structure for table pariwisata.tb_admin
CREATE TABLE IF NOT EXISTS `tb_admin` (
  `id_admin` int(11) NOT NULL,
  `nama` text DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `telepon` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_admin`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table pariwisata.tb_admin: ~13 rows (approximately)
/*!40000 ALTER TABLE `tb_admin` DISABLE KEYS */;
INSERT INTO `tb_admin` (`id_admin`, `nama`, `alamat`, `telepon`, `email`, `password`) VALUES
	(1, 'Agusto Fraga', 'Kupang', '081236337444', 'agusto@gmail.com', '123456'),
	(2, 'Abastasia Bao', 'Kupang', '081262734734', 'bao23@gmail.com', '334455'),
	(3, 'Muhamad Yadi', 'Alor', '081211623822', 'muhammad56@gmail.com', '223954'),
	(4, 'Tobias Soman', 'Maumere', '081233527449', 'soman67@gmail.com', '999263'),
	(5, 'Flafiana Rona', 'Maumere', '081266329000', 'rona67@gmail.com', '963223'),
	(6, 'Maria Roja', 'Maumere', '081233526111', 'roja45@gmail.com', '885462'),
	(7, 'Katharina Kesik', 'Atambua', '081244251000', 'katharina99@gmail.com', '888324'),
	(8, 'Bonefasius Nukar', 'Atambua', '082125739845', 'nurak@gmail.com', '999995'),
	(9, 'Theresia Advenia Nurak', 'Rote', '081247364099', 'nurak98@gmail.com', '999234'),
	(10, 'Yohanes Eustakhius Botha', 'Rote', '081299993266', 'botha3456@gmail.com', '333456'),
	(11, 'George Koroh', 'Kupang', '081236670551', 'alexkoroh14@gmail.com', '343454'),
	(12, 'Aflorency Anamila', 'Sumba', '082144034514', 'anamilarency@gmail.com', '123421'),
	(13, 'Karel Katihara', 'jalur 40', '081234565443', 'karel@gmail.com', '343454');
/*!40000 ALTER TABLE `tb_admin` ENABLE KEYS */;

-- Dumping structure for table pariwisata.tb_bukutamu
CREATE TABLE IF NOT EXISTS `tb_bukutamu` (
  `id_tamu` int(11) NOT NULL,
  `tanggal` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `komentar` text DEFAULT NULL,
  PRIMARY KEY (`id_tamu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table pariwisata.tb_bukutamu: ~11 rows (approximately)
/*!40000 ALTER TABLE `tb_bukutamu` DISABLE KEYS */;
INSERT INTO `tb_bukutamu` (`id_tamu`, `tanggal`, `email`, `komentar`) VALUES
	(1, '02 Maret 2021', 'anita67@gmail.com', 'Fitur kurang menarik'),
	(2, '04 Maret 2021', 'sasa.tanu@gmail.com', 'Kalau bisa tambahkan fitur pencarian'),
	(3, '04 Maret 2021', 'malik.sanusi85@gmail.com', 'Good'),
	(4, '06 Maret 2021', 'anita67@gmail.com', 'Bagus'),
	(5, '07 Maret 2021', 'sukro@yahoo.com', 'Bagus'),
	(6, '07 Maret 2021', 'sukro@yahoo.com', 'Kurang Update'),
	(7, '07 Maret 2021', 'romansha45@yahoo.com', 'Tolong fotonya diganti'),
	(8, '10 Maret 2021', 'roja45@gmail.com', 'Hai'),
	(9, '11 Maret 2021', 'yanto.sin6@gmail.com', 'Testing'),
	(10, '12 Maret 2021', 'yanto.sin6@gmail.com', 'Selamat pagi'),
	(11, '13 Maret 2021', 'alexkoroh14@gmail.com', 'kurang menarik');
/*!40000 ALTER TABLE `tb_bukutamu` ENABLE KEYS */;

-- Dumping structure for table pariwisata.tb_ow
CREATE TABLE IF NOT EXISTS `tb_ow` (
  `id_ow` int(11) NOT NULL,
  `nama_ow` text DEFAULT NULL,
  `lokasi` text DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `tarif` varchar(50) DEFAULT NULL,
  `gambar` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id_ow`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table pariwisata.tb_ow: ~11 rows (approximately)
/*!40000 ALTER TABLE `tb_ow` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_ow` ENABLE KEYS */;

-- Dumping structure for table pariwisata.users
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` varchar(25) NOT NULL,
  `user_nama` varchar(25) DEFAULT NULL,
  `user_password` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table pariwisata.users: ~3 rows (approximately)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`user_id`, `user_nama`, `user_password`) VALUES
	('admin', 'Administrator', '21232f297a57a5a743894a0e4a801fc3'),
	('alex', 'Alexander Koroh', 'alex'),
	('koroh', 'George', 'koroh');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
