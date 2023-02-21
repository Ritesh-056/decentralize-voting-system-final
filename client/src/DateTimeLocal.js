//get unix time stamp and return datetime string
function getLocalDateTime(unixTimestamp){

     var dateFromUnixTimeStamp  = new Date(unixTimestamp *1000);
     var localDateStr  = dateFromUnixTimeStamp.toLocaleDateString("default");
     var localTimeStr  = dateFromUnixTimeStamp.toLocaleTimeString("default");

     var showAbleDateTime = localDateStr+" "+localTimeStr;
     return showAbleDateTime; 
}

export { getLocalDateTime };