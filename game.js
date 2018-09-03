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
   'https://gewinnen.sbb.ch/storage/images/products/_productGame/19_sbbpersonalrestaurantpendolino_eistee_olten.jpg': {laden:'Pendolino',product:'Eistee «Freshly Made Today»'},
   'https://gewinnen.sbb.ch/storage/images/products/_productGame/99_baekerei_reinhard_chf_5_geschenkkarte.jpg': {laden:'Reinhard',product:'CHF 5 Geschenkkarte'},
   'https://gewinnen.sbb.ch/storage/images/products/_productGame/47_vgeleshoes_cap.jpg': {laden:'Vögele',product:'1 Cap nach Wahl'},
   'https://gewinnen.sbb.ch/storage/images/products/_productGame/Egli_salzige-UEberraschung.jpg': {laden:'Egli',product:'Salzige Überraschung'},
   'https://gewinnen.sbb.ch/storage/images/products/_productGame/101_Ovo-Rocks_avec.jpg': {laden:'Ave',product:'OVO Rocks'},
   'https://gewinnen.sbb.ch/storage/images/products/_productGame/12_bckereireinhard_bern.jpg': {laden:'Reinhard',product:'Berliner'},
   'https://gewinnen.sbb.ch/storage/images/products/_productGame/30_flyingtibercopenhaben_kokosbar_bern.jpg': {laden:'Copenhagen',product:'Kokosbar'},
   'https://gewinnen.sbb.ch/storage/images/products/_productGame/Egli_Ueberraschung_suess.jpg': {laden:'Egli',product:'Süsse Überraschung'},
   'https://gewinnen.sbb.ch/storage/images/products/_productGame/Egli_Naturkosmetik.jpg': {laden:'Egli',product:'natürliche Kosmetik-Überraschung'},
   'https://gewinnen.sbb.ch/storage/images/products/_productGame/27_tibits_cucumbersplash_luzern.jpg': {laden:'Tibits',product:'Cucumbersplash'},
   'https://gewinnen.sbb.ch/storage/images/products/_productGame/10_coop_cooptogo_bn_biel_thun.jpg': {laden:'Coop To Go',product:'Heissgetränk'},
   //'': {laden:'',product:''},
   
};

var getInfo = function(url) {
   if (url in products) {
      return products[url];
   }
   return {laden:'?',product:'?'};
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
         var info = getInfo(coupon.productImage)
         c = '<td>'+(ort.charAt(0).toUpperCase() + ort.slice(1))+'</td><td><img src="'+coupon.productImage+'" width="50" height="50" /></td><td>'+info.laden+'</td><td>'+info.product+'</td><td><a href="https://gewinnen.sbb.ch/coupon/'+coupon.couponCode+'">Link</a></td><td>'+pValid+'</td>';
         l.innerHTML = c;
         lines.appendChild(l);
      });
   }
};