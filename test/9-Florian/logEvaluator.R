setwd("~/dev-uni/endstation/test/9-Florian")
library("data.table")

csvData <- read.csv("result.csv")
csvDataTable <- data.table(csvData)

numberOfParticipants <- 31
numberOfCesSpeedTest1 <- 4
numberOfCesSpeedTest2 <- 7
numberOfCesSpeedTest3 <- 7


# Descriptives
###############################


# Retreat Counts
################

# Helper Tables
retreatCountsByPersonAndTest <- csvData[csvData$type=="retreatCounts", c("person", "rightRetreats", "wrongRetreats", "duplicateRetreats", "test")]
meanRetreatCountsByTest <- aggregate(retreatCountsByPersonAndTest[,2:4], by=list(retreatCountsByPersonAndTest$test), mean)
colnames(meanRetreatCountsByTest) <- c("test", "meanRight", "meanWrong", "meanDuplicate")
sdRetreatCountsByTest <- aggregate(retreatCountsByPersonAndTest[,2:4], by=list(retreatCountsByPersonAndTest$test), sd)
colnames(sdRetreatCountsByTest) <- c("test", "sdRight", "sdWrong", "sdDuplicate")

# Main Table
# columns => test, person, rightRetreats, wrongRetreats, duplicateRetreats, meanRight (of test over all persons!), meanWrong, meanDuplicate, sdRight, sdWrong, sdDuplicate
retreatCountsWithMeanAndSd <- merge(merge(retreatCountsByPersonAndTest, meanRetreatCountsByTest), sdRetreatCountsByTest)

sumRetreatsByPerson <- aggregate(retreatCountsWithMeanAndSd[,3:5], by = list(retreatCountsWithMeanAndSd$person), sum)


# Click behaviors
#################

# Helper Tables
segueCountsByPersonAndTest <- csvData[csvData$type=="segueCounts", c("person", "clicksOnTableView", "clicksOnCeList", "clicksOnStatusWidget", "clicksOnAnotherGraph", "clicksOverall", "test")]
seguesWhileActiveByPersonAndTest <- csvData[csvData$type != "retreatCounts" & csvData$type != "segueCounts", c("person", "test", "type", "seguesWhileActive")]
sumSeguesWhileActiveByPersonAndTest <- aggregate(seguesWhileActiveByPersonAndTest[,4], by = list(seguesWhileActiveByPersonAndTest$test, seguesWhileActiveByPersonAndTest$person), sum)
colnames(sumSeguesWhileActiveByPersonAndTest) <- c("person", "test", "sumSeguesWhileActive")

# Main Table
# columns => test, person, sumSegueWhileActive, clicksOnTableView, clicksOnCeList, clicksOnStatusWidget, clicksOnAnotherGraph, clicksOverall
segues <- merge(sumSeguesWhileActiveByPersonAndTest, segueCountsByPersonAndTest)


# Component Test Data
#####################

# Helper Tables
componentTestData <- csvData[csvData$test=="componentTest" & csvData$type!="retreatCounts" & csvData$type!="segueCounts", c("person", "type", "onDetailView", "onGraph", "retreat", "onDetailViewUnimportant", "retreatUnimportant", "onDetailViewImportant", "retreatImportant")]

# Main Tables
# columns => type, onDetailView(#), onGraph(#), retreat(#), onDetailViewUnimportant(#), retreatUnimportant(#), onDetailViewImportant(#), retreatImportant(#)
componentTestCountsByType <- aggregate(componentTestData[3:9], by=list(componentTestData$type), function(x) length(which(!is.na(x))))
colnames(componentTestCountsByType)[1] <- c("type")


# Speed Test Data
#################

# Helper Tables
speedTestData <- csvData[csvData$test!="componentTest" & csvData$type!="retreatCounts" & csvData$type!="segueCounts", c("person", "test", "onDetailView", "retreat")]
speedTestMeansByTest <- aggregate(speedTestData[3:4], by=list(speedTestData$test), FUN=mean, na.rm = TRUE)
colnames(speedTestMeansByTest) <- c("test", "meanDetail", "meanRetreat")
speedTestSdByTest <- aggregate(speedTestData[3:4], by=list(speedTestData$test), FUN=sd, na.rm = TRUE)
colnames(speedTestSdByTest) <- c("test", "sdDetail", "sdRetreat")
speedTestCountsByPersonAndTest <- aggregate(speedTestData[3:4], by=list(speedTestData$person, speedTestData$test), function(x) length(which(!is.na(x)))/length(x))
colnames(speedTestCountsByPersonAndTest)[1:2] <- c("person", "test")
speedTestCountsByTest <- aggregate(speedTestData[3:4], by=list(speedTestData$test), function(x) length(which(!is.na(x)))/length(x))
colnames(speedTestCountsByTest)[1] <- c("test")

# Main Table
# columns => person, test, onDetailView(%), retreat(%), meanDetail, meanRetreat, sdDetail, sdRetreat
speedTestStatsByTest <- merge(merge(speedTestCountsByTest, speedTestMeansByTest), speedTestSdByTest)





# Remove useless variables

retreatCountsByPersonAndTest <- Nile
meanRetreatCountsByTest <- Nile
sdRetreatCountsByTest <- Nile
segueCountsByPersonAndTest <- Nile
seguesWhileActiveByPersonAndTest <- Nile
sumSeguesWhileActiveByPersonAndTest <- Nile