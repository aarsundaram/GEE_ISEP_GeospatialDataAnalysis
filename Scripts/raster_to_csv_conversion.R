library(raster)
library(rgdal)
#setwd("~/Documents/GitHub/GEE_ISEP_GeospatialDataAnalysis/Data/processed/")
#write.csv(as.matrix(raster("op.tif"),"rainfall.csv"))

r <- raster('/W_GIOVANNI-g4.timeAvgMap.GLDAS_NOAH025_M_2_1_Rainf_f_tavg.20000101-20180131.180W_60S_180E_90N.tif')
pts <- rasterToPoints(r)
x <- as.data.frame(pts)
write.csv(x,"test2.csv")


