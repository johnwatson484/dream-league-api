-- Manager Keepers (2 per manager: 1 active, 1 substitute)
-- Teams from mock videprinter: Barnsley(26), Bolton(16), Derby(33), Portsmouth(20),
-- Oxford(74), Blackpool(63), Peterborough(27), Charlton(24), Wigan(28), Reading(41), Exeter(60), Lincoln(6)

INSERT INTO "managerKeepers" ("managerId", "teamId", "substitute") VALUES (1, 26, false);
INSERT INTO "managerKeepers" ("managerId", "teamId", "substitute") VALUES (1, 16, true);
INSERT INTO "managerKeepers" ("managerId", "teamId", "substitute") VALUES (2, 33, false);
INSERT INTO "managerKeepers" ("managerId", "teamId", "substitute") VALUES (2, 20, true);
INSERT INTO "managerKeepers" ("managerId", "teamId", "substitute") VALUES (3, 74, false);
INSERT INTO "managerKeepers" ("managerId", "teamId", "substitute") VALUES (3, 63, true);
INSERT INTO "managerKeepers" ("managerId", "teamId", "substitute") VALUES (4, 27, false);
INSERT INTO "managerKeepers" ("managerId", "teamId", "substitute") VALUES (4, 24, true);
INSERT INTO "managerKeepers" ("managerId", "teamId", "substitute") VALUES (5, 28, false);
INSERT INTO "managerKeepers" ("managerId", "teamId", "substitute") VALUES (5, 41, true);
INSERT INTO "managerKeepers" ("managerId", "teamId", "substitute") VALUES (6, 60, false);
INSERT INTO "managerKeepers" ("managerId", "teamId", "substitute") VALUES (6, 6, true);
INSERT INTO "managerKeepers" ("managerId", "teamId", "substitute") VALUES (7, 16, false);
INSERT INTO "managerKeepers" ("managerId", "teamId", "substitute") VALUES (7, 26, true);
INSERT INTO "managerKeepers" ("managerId", "teamId", "substitute") VALUES (8, 20, false);
INSERT INTO "managerKeepers" ("managerId", "teamId", "substitute") VALUES (8, 33, true);
INSERT INTO "managerKeepers" ("managerId", "teamId", "substitute") VALUES (9, 63, false);
INSERT INTO "managerKeepers" ("managerId", "teamId", "substitute") VALUES (9, 74, true);
INSERT INTO "managerKeepers" ("managerId", "teamId", "substitute") VALUES (10, 24, false);
INSERT INTO "managerKeepers" ("managerId", "teamId", "substitute") VALUES (10, 27, true);
INSERT INTO "managerKeepers" ("managerId", "teamId", "substitute") VALUES (11, 41, false);
INSERT INTO "managerKeepers" ("managerId", "teamId", "substitute") VALUES (11, 28, true);
INSERT INTO "managerKeepers" ("managerId", "teamId", "substitute") VALUES (12, 6, false);
INSERT INTO "managerKeepers" ("managerId", "teamId", "substitute") VALUES (12, 60, true);

-- Manager Players (13 active + 4 subs per manager: 3 DEF, 4 MID, 6 FWD active; 1 DEF, 1 MID, 1 FWD sub)
-- Key: Players with mock-matching lastNames on mock-matching teams are distributed across managers
-- so the videprinter fuzzy matcher can find them.

-- Manager 1 (John Watson) - Has Brown(1727,FWD,Barnsley) who will match mock "Brown" scoring for "Barnsley"
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (1, 1727, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (1, 1728, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (1, 1730, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (1, 1731, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (1, 1732, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (1, 1733, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (1, 957, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (1, 959, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (1, 294, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (1, 292, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (1, 296, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (1, 960, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (1, 961, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (1, 1726, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (1, 962, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (1, 297, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (1, 1729, true);

-- Manager 2 (Lee Gordon) - Has Evans(1152,MID,Derby) who will match mock "Evans" scoring for "Derby"
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (2, 1152, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (2, 1843, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (2, 1844, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (2, 1845, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (2, 1846, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (2, 1847, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (2, 1153, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (2, 1154, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (2, 361, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (2, 362, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (2, 363, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (2, 1155, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (2, 1156, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (2, 1848, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (2, 1157, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (2, 364, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (2, 1849, true);

-- Manager 3 (Scott Dormand) - Has Jones(669,DEF,Oxford) who will match mock "Jones" scoring for "Oxford"
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (3, 669, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (3, 670, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (3, 671, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (3, 1744, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (3, 1745, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (3, 1746, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (3, 1747, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (3, 1748, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (3, 1749, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (3, 1075, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (3, 1076, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (3, 1077, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (3, 1078, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (3, 672, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (3, 1079, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (3, 673, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (3, 1080, true);

-- Manager 4 (Billy Gordon) - Has Taylor(1815,FWD,Charlton) who will match mock "Taylor" scoring for "Charlton"
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (4, 1815, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (4, 1809, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (4, 1810, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (4, 1811, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (4, 1812, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (4, 1813, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (4, 1081, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (4, 1082, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (4, 1083, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (4, 1084, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (4, 430, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (4, 431, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (4, 432, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (4, 1814, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (4, 1085, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (4, 433, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (4, 1086, true);

-- Manager 5 (Tommy Gordon) - Has Evans(1696,MID,Wigan) who will match mock "Evans" scoring for "Wigan"
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (5, 1696, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (5, 1697, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (5, 1698, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (5, 1699, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (5, 1860, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (5, 1861, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (5, 1862, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (5, 1863, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (5, 1864, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (5, 1865, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (5, 500, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (5, 501, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (5, 502, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (5, 1866, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (5, 1700, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (5, 503, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (5, 1701, true);

-- Manager 6 (David Brown) - Has Taylor(1184,MID,Exeter) + Brown(454,DEF,Exeter)
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (6, 1184, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (6, 454, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (6, 455, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (6, 456, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (6, 1185, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (6, 1186, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (6, 1187, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (6, 1928, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (6, 1929, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (6, 1860, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (6, 563, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (6, 564, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (6, 565, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (6, 1188, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (6, 457, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (6, 566, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (6, 1189, true);

-- Manager 7 (Bob Brown) - Has Johnson(292,DEF,Bolton)
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (7, 1750, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (7, 1751, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (7, 1752, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (7, 1485, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (7, 1486, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (7, 1487, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (7, 1488, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (7, 696, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (7, 697, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (7, 698, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (7, 1489, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (7, 699, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (7, 700, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (7, 1490, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (7, 701, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (7, 1491, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (7, 702, true);

-- Manager 8 (Darren Brown) - Has Evans(1485,MID,Portsmouth)
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (8, 2065, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (8, 2066, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (8, 2067, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (8, 2068, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (8, 2069, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (8, 2070, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (8, 1196, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (8, 1197, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (8, 1198, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (8, 1199, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (8, 605, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (8, 606, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (8, 607, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (8, 2071, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (8, 1200, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (8, 608, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (8, 1201, true);

-- Manager 9 (Michael Richardson)
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (9, 1252, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (9, 1253, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (9, 1254, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (9, 1255, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (9, 1822, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (9, 1823, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (9, 1824, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (9, 1825, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (9, 1826, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (9, 1827, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (9, 750, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (9, 751, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (9, 752, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (9, 1828, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (9, 1256, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (9, 753, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (9, 1257, true);

-- Manager 10 (Rob Doloughan)
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (10, 1345, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (10, 1346, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (10, 1347, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (10, 1350, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (10, 1910, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (10, 1911, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (10, 1912, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (10, 1913, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (10, 1914, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (10, 1915, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (10, 836, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (10, 837, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (10, 838, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (10, 1916, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (10, 1351, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (10, 839, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (10, 1352, true);

-- Manager 11 (Ben Scott) - Has Smith(2065,FWD,Reading)
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (11, 1968, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (11, 1969, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (11, 1970, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (11, 1971, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (11, 1972, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (11, 1973, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (11, 1472, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (11, 1473, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (11, 1474, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (11, 1475, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (11, 694, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (11, 695, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (11, 821, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (11, 1974, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (11, 1476, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (11, 822, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (11, 1477, true);

-- Manager 12 (Tucker Brazier) - Has Smith(563,DEF,Lincoln)
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (12, 1134, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (12, 1135, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (12, 1136, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (12, 1137, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (12, 2033, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (12, 2034, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (12, 2035, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (12, 2036, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (12, 2037, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (12, 2038, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (12, 410, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (12, 411, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (12, 412, false);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (12, 2039, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (12, 1138, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (12, 413, true);
INSERT INTO "managerPlayers" ("managerId", "playerId", "substitute") VALUES (12, 1139, true);
