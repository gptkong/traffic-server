-- CreateTable
CREATE TABLE `Server` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `serverId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `countryCode` VARCHAR(191) NULL,
    `platform` VARCHAR(191) NULL,
    `cpu` VARCHAR(191) NULL,
    `memTotal` BIGINT NULL,
    `diskTotal` BIGINT NULL,
    `arch` VARCHAR(191) NULL,
    `virtualization` VARCHAR(191) NULL,
    `bootTime` BIGINT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Server_serverId_key`(`serverId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServerState` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `serverId` INTEGER NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cpu` DOUBLE NULL,
    `memUsed` BIGINT NULL,
    `swapUsed` BIGINT NULL,
    `diskUsed` BIGINT NULL,
    `netInTransfer` BIGINT NULL,
    `netOutTransfer` BIGINT NULL,
    `netInSpeed` INTEGER NULL,
    `netOutSpeed` INTEGER NULL,
    `uptime` BIGINT NULL,
    `load1` DOUBLE NULL,
    `load5` DOUBLE NULL,
    `load15` DOUBLE NULL,
    `tcpConnCount` INTEGER NULL,
    `udpConnCount` INTEGER NULL,
    `processCount` INTEGER NULL,

    INDEX `ServerState_serverId_timestamp_idx`(`serverId`, `timestamp`),
    INDEX `ServerState_timestamp_idx`(`timestamp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ServerState` ADD CONSTRAINT `ServerState_serverId_fkey` FOREIGN KEY (`serverId`) REFERENCES `Server`(`serverId`) ON DELETE CASCADE ON UPDATE CASCADE;
