// Globals
var ORT = {
   olten: 10137,
   bern: 10141,
   basel: 10140
};
var WINNER = [];
var POS = 0;
var END = 0;


var play = function(ort) {
   var http = new XMLHttpRequest();
   var url = '/api/get-participant';
   var params = JSON.stringify({
      participantHash: null,
      fingerprint: "",
      locale: "de"
   });
   http.open('POST', url, true);
   http.setRequestHeader('content-type', 'application/json;charset=UTF-8');
   http.setRequestHeader('accept', 'application/json');
   http.onreadystatechange = function() {
      if(http.readyState == 4 && http.status == 200) {
         var res = JSON.parse(http.responseText);
         var hash = res.participant.hash
         var http = new XMLHttpRequest();
         var url = '/api/play-game';
         var params = JSON.stringify({
            participantHash: hash,
            stationId: ORT[ort]
         });
         http.open('POST', url, true);
         http.setRequestHeader('content-type', 'application/json;charset=UTF-8');
         http.setRequestHeader('accept', 'application/json');
         http.setRequestHeader('auth-key', hash);
         http.onreadystatechange = function() {
            if(http.readyState == 4 && http.status == 200) {
               POS = POS + 1;
               var res = JSON.parse(http.responseText);
               if(res.result === 'won') {
                  WINNER.push(res.couponCode);
               }
               if(POS === END - 1) {
                  console.log(WINNER);
               }
            } else if(http.readyState == 4) {
               POS = POS + 1;
               if(POS === END - 1) {
                  console.log(WINNER);
               }
            }
         }
         http.send(params);
      }
   }
   http.send(params);
};

var start = function(ort, count) {
   if(typeof count === 'undefined') {
      count = 50;
   }
   if(typeof ort === 'undefined') {
      ort = 'bern';
   }
   END = count;
   POS = 0;
   for(var i = 0; i < count; i++) {
      play(ort);
   }
};