CREATE TABLE IF NOT EXISTS "GameConfig" (
	"ID"	TEXT NOT NULL,
	"Value"	TEXT,
	PRIMARY KEY("ID")
);
CREATE TABLE IF NOT EXISTS "ModDependencies" (
	"ID"	TEXT NOT NULL,
	"Title"	TEXT NOT NULL,
	PRIMARY KEY("ID")
);
CREATE TABLE IF NOT EXISTS "ModText" (
	"Language"	TEXT NOT NULL,
	"ID"	TEXT NOT NULL,
	"Value"	TEXT,
	PRIMARY KEY("Language","ID")
);
CREATE TABLE IF NOT EXISTS "ModSettings_Items" (
	"Type"	TEXT NOT NULL,
	"ID"	TEXT NOT NULL,
	"Name"	TEXT NOT NULL,
	"Value"	TEXT,
	PRIMARY KEY("Type","ID","Name","Value")
);
CREATE TABLE IF NOT EXISTS "ModSettings_Properties" (
	"Type"	TEXT NOT NULL,
	"ID"	TEXT NOT NULL,
	"Name"	TEXT NOT NULL,
	"Value"	TEXT,
	PRIMARY KEY("Type","ID","Name","Value")
);
CREATE TABLE IF NOT EXISTS "ModSettings" (
	"Type"	TEXT NOT NULL,
	"ID"	TEXT NOT NULL,
	PRIMARY KEY("Type","ID")
);
CREATE TABLE IF NOT EXISTS "ModComponent_Items" (
	"Type"	TEXT NOT NULL,
	"ID"	TEXT NOT NULL,
	"Name"	TEXT NOT NULL,
	"Value"	TEXT,
	PRIMARY KEY("Type","ID","Name","Value")
);
CREATE TABLE IF NOT EXISTS "ModComponent_Properties" (
	"Type"	TEXT NOT NULL,
	"ID"	TEXT NOT NULL,
	"Name"	TEXT NOT NULL,
	"Value"	TEXT,
	PRIMARY KEY("Type","ID","Name","Value")
);
CREATE TABLE IF NOT EXISTS "ModComponents" (
	"Type"	TEXT NOT NULL,
	"ID"	TEXT NOT NULL,
	PRIMARY KEY("Type","ID")
);
CREATE TABLE IF NOT EXISTS "ModProperties" (
	"Name"	TEXT NOT NULL,
	"Value"	TEXT,
	PRIMARY KEY("Name","Value")
);
CREATE TABLE IF NOT EXISTS "PlayerAttributes" (
	"ID"	INTEGER NOT NULL,
	"Type"	TEXT NOT NULL,
	"Name"	TEXT NOT NULL,
	"Value"	TEXT,
	PRIMARY KEY("ID","Type","Name")
);
CREATE TABLE IF NOT EXISTS "Players" (
	"ID"	INTEGER NOT NULL,
	"CivilizationType"	TEXT,
	"LeaderType"	TEXT,
	"CivilizationLevelType"	TEXT,
	"AgendaType"	TEXT,
	"Status"	TEXT,
	"Handicap"	TEXT,
	"StartingPosition"	TEXT,
	"Color"	TEXT,
	"Initialized"	BOOLEAN,
	PRIMARY KEY("ID")
);
CREATE TABLE IF NOT EXISTS "Buildings" (
	"BuildingType"	TEXT NOT NULL,
	"Plot"	INTEGER NOT NULL,
	PRIMARY KEY("BuildingType","Plot")
);
CREATE TABLE IF NOT EXISTS "DistrictAttributes" (
	"ID"	INTEGER NOT NULL,
	"Type"	TEXT NOT NULL,
	"Name"	TEXT NOT NULL,
	"Value"	TEXT,
	PRIMARY KEY("ID","Type","Name")
);
CREATE TABLE IF NOT EXISTS "Districts" (
	"DistrictType"	TEXT NOT NULL,
	"CityID"	INTEGER NOT NULL,
	"Plot"	INTEGER NOT NULL,
	PRIMARY KEY("Plot")
);
CREATE TABLE IF NOT EXISTS "CityAttributes" (
	"ID"	INTEGER NOT NULL,
	"Type"	TEXT NOT NULL,
	"Name"	TEXT NOT NULL,
	"Value"	TEXT,
	PRIMARY KEY("ID","Type","Name")
);
CREATE TABLE IF NOT EXISTS "Cities" (
	"Owner"	INTEGER NOT NULL,
	"Plot"	INTEGER NOT NULL,
	"Name"	TEXT,
	PRIMARY KEY("Plot")
);
CREATE TABLE IF NOT EXISTS "UnitAttributes" (
	"ID"	INTEGER NOT NULL,
	"Type"	TEXT NOT NULL,
	"Name"	TEXT NOT NULL,
	"Value"	TEXT,
	PRIMARY KEY("ID","Type","Name")
);
CREATE TABLE IF NOT EXISTS "Units" (
	"ID"	INTEGER NOT NULL,
	"UnitType"	TEXT NOT NULL,
	"Owner"	INTEGER NOT NULL,
	"Plot"	INTEGER NOT NULL,
	"Name"	TEXT,
	PRIMARY KEY("ID")
);
CREATE TABLE IF NOT EXISTS "StartPositions" (
	"Plot"	INTEGER NOT NULL,
	"Type"	STRING NOT NULL,
	"Value"	STRING NOT NULL,
	PRIMARY KEY("Plot")
);
CREATE TABLE IF NOT EXISTS "RevealedPlots" (
	"ID"	INTEGER NOT NULL,
	"Player"	INTEGER,
	PRIMARY KEY("ID","Player")
);
CREATE TABLE IF NOT EXISTS "PlotOwners" (
	"ID"	INTEGER NOT NULL,
	"Owner"	INTEGER,
	"CityOwner"	INTEGER,
	"CityWorking"	INTEGER,
	PRIMARY KEY("ID")
);
CREATE TABLE IF NOT EXISTS "PlotRoutes" (
	"ID"	INTEGER NOT NULL,
	"RouteType"	TEXT,
	"RouteEra"	TEXT,
	"IsRoutePillaged"	BOOLEAN,
	PRIMARY KEY("ID")
);
CREATE TABLE IF NOT EXISTS "PlotImprovements" (
	"ID"	INTEGER NOT NULL,
	"ImprovementType"	TEXT,
	"ImprovementOwner"	INTEGER,
	PRIMARY KEY("ID")
);
CREATE TABLE IF NOT EXISTS "PlotFeatures" (
	"ID"	INTEGER NOT NULL,
	"FeatureType"	TEXT,
	PRIMARY KEY("ID")
);
CREATE TABLE IF NOT EXISTS "PlotResources" (
	"ID"	INTEGER NOT NULL,
	"ResourceType"	TEXT,
	"ResourceCount"	INTEGER,
	PRIMARY KEY("ID")
);
CREATE TABLE IF NOT EXISTS "PlotCliffs" (
	"ID"	INTEGER NOT NULL,
	"IsNEOfCliff"	BOOLEAN,
	"IsWOfCliff"	BOOLEAN,
	"IsNWOfCliff"	BOOLEAN,
	PRIMARY KEY("ID")
);
CREATE TABLE IF NOT EXISTS "PlotRivers" (
	"ID"	INTEGER NOT NULL,
	"IsNEOfRiver"	BOOLEAN,
	"IsWOfRiver"	BOOLEAN,
	"IsNWOfRiver"	BOOLEAN,
	"EFlowDirection"	INTEGER,
	"SEFlowDirection"	INTEGER,
	"SWFlowDirection"	INTEGER,
	PRIMARY KEY("ID")
);
CREATE TABLE IF NOT EXISTS "PlotAttributes" (
	"ID"	INTEGER NOT NULL,
	"Name"	TEXT NOT NULL,
	"Value"	TEXT,
	PRIMARY KEY("ID","Name")
);
CREATE TABLE IF NOT EXISTS "Plots" (
	"ID"	INTEGER NOT NULL,
	"TerrainType"	TEXT NOT NULL,
	"ContinentType"	TEXT,
	"IsImpassable"	BOOLEAN,
	PRIMARY KEY("ID")
);
CREATE TABLE IF NOT EXISTS "MapAttributes" (
	"Name"	TEXT NOT NULL,
	"Value"	TEXT,
	PRIMARY KEY("Name")
);
CREATE TABLE IF NOT EXISTS "Map" (
	"ID"	TEXT NOT NULL,
	"Width"	INTEGER,
	"Height"	INTEGER,
	"TopLatitude"	INTEGER,
	"BottomLatitude"	INTEGER,
	"WrapX"	BOOLEAN,
	"WrapY"	BOOLEAN,
	"MapSizeType"	TEXT,
	PRIMARY KEY("ID")
);
CREATE TABLE IF NOT EXISTS "MetaData" (
	"Name"	TEXT NOT NULL,
	"Value"	TEXT,
	PRIMARY KEY("Name")
);