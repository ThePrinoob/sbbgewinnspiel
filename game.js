// Globals
var ORT = {
   olten: 10137,
   bern: 10141,
   basel: 10140
};
var WINNER = [];
var POS = 0;
var END = 0;
var play = function(ort, callback) {
   var http = new XMLHttpRequest();
   var url = 'https://gewinnen.sbb.ch/api/get-participant';
   var params = JSON.stringify({
      participantHash: null,
      fingerprint: "",
      locale: "de"
   });
   http.open('POST', url, true);
   http.setRequestHeader('content-type', 'application/json;charset=UTF-8');
   http.setRequestHeader('accept', 'application/json');
   http.onreadystatechange = function() {
      if(http.readyState === 4 && http.status === 200) {
         var res = JSON.parse(http.responseText);
         var hash = res.participant.hash;
         var httpGame = new XMLHttpRequest();
         var urlGame = 'https://gewinnen.sbb.ch/api/play-game';
         var paramsGame = JSON.stringify({
            participantHash: hash,
            stationId: ORT[ort]
         });
         httpGame.open('POST', urlGame, true);
         httpGame.setRequestHeader('content-type', 'application/json;charset=UTF-8');
         httpGame.setRequestHeader('accept', 'application/json');
         httpGame.setRequestHeader('auth-key', hash);
         httpGame.onreadystatechange = function() {
            if(httpGame.readyState === 4 && httpGame.status === 200) {
               POS = POS + 1;
               var resGame = JSON.parse(httpGame.responseText);
               if(resGame.result === 'won') {
                  callback(res);
               }
               if(POS === END - 1) {
                  console.log(WINNER);
                  callback();
               }
            } else if(httpGame.readyState === 4) {
               POS = POS + 1;
               if(POS === END - 1) {
                  callback();
               }
            }
         };
         httpGame.send(paramsGame);
      }
   };
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
   var i, s;
   for(i = 0; i < count; i++) {
      play(ort, function(coupon) {
         var valid = new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000);
         var pValid = valid.getDate() + "." + (valid.getMonth()+1) + "." + valid.getFullYear();
         var lines = document.getElementById('lines');
         let l = document.createElement('tr');
         c = '<tr><td>'+ort+'</td><td>'+coupon.couponCode+'</td><td>'+coupon.couponCode+'</td><td><a href="https://gewinnen.sbb.ch/coupon/'+coupon.couponCode+'</td><td>'+pValid+'</td></tr>';
         l.innerHTML = c;
         lines.appendChild(l);
      });
   }
};