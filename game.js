// Globals
var ORT = {
   olten: 10137,
   bern: 10141,
   basel: 10140
};

var products = {
   'https://gewinnen.sbb.ch/storage/images/products/_productGame/59_zopfzpfli_zopf-chnopf.jpg': {laden:'Zopf & Zöpfli',product:'Zopf-Chnopf'},
   'https://gewinnen.sbb.ch/storage/images/products/_productGame/100_hitzberger_chf_10_geschenkkarte.jpg': {laden:'Hitzberger',product:'CHF 10 Geschenkkarte'},
   'https://gewinnen.sbb.ch/storage/images/products/_productGame/102_Ovo-Drink_avec.jpg': {laden:'Avec',product:'OVO Drink'},
   'https://gewinnen.sbb.ch/storage/images/products/_productGame/91_lolipop_crunchy_mellowfizz.jpg': {laden:'Lolipop',product:'Crunchy Mellowfizz'},
   'https://gewinnen.sbb.ch/storage/images/products/_productGame/82_kkiosk_okmineralwater.jpg': {laden:'Kiosk',product:'OK Mineralwasser'},
   'https://gewinnen.sbb.ch/storage/images/products/_productGame/94_coop_icetea_50cl.jpg': {laden:'Coop',product:'Coop-Naturaplan Ice Tea (5 dl)'},
   'https://gewinnen.sbb.ch/storage/images/products/_productGame/81_kkiosk_okenergydrink.jpg': {laden:'Kiosk',product:'OK EnergyDrink classic/zero'},
   'https://gewinnen.sbb.ch/storage/images/products/_productGame/66_ilforno_hotpaninicaprese_olten.jpg': {laden:'Il Forno',product:'Hot Panino Caprese mit Mozzarella, Tomaten, Basilikum'},
   'https://gewinnen.sbb.ch/storage/images/products/_productGame/23_caffspettacolo_kaffee.jpg': {laden:'Caffe Spettacolo',product:'Kaffee'},
   'https://gewinnen.sbb.ch/storage/images/products/_productGame/19_sbbpersonalrestaurantpendolino_eistee_olten.jpg': {laden:'Pendolino',product:'Eistee «Freshly Made Today»'}
   //'': {laden:'',product:''},
};

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
               var resGame = JSON.parse(httpGame.responseText);
               if(resGame.result === 'won') {
                  callback(resGame);
               }
            }
         };
         httpGame.send(paramsGame);
      }
   };
   http.send(params);
};

var start = function(count) {
   if(typeof count === 'undefined') {
      count = 50;
   }
   var ort = document.getElementById('bahnhof').value;
   var i, s;
   for(i = 0; i < count; i++) {
      play(ort, function(coupon) {
         var valid = new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000);
         var pValid = valid.getDate() + "." + (valid.getMonth()+1) + "." + valid.getFullYear();
         var lines = document.getElementById('lines');
         let l = document.createElement('tr');
         c = '<td>'+ort+'</td><td><img src="'+coupon.productImage+'" width="50" height="50" /></td><td>'+products[coupon.productImage].laden+'</td><td>'+products[coupon.productImage].product+'</td><td><a href="https://gewinnen.sbb.ch/coupon/'+coupon.couponCode+'">Link</a></td><td>'+pValid+'</td>';
         l.innerHTML = c;
         lines.appendChild(l);
      });
   }
};