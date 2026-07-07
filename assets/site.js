(function(){
  function $(id){return document.getElementById(id)}
  var DUE=new Date(2026,9,14,0,0,0);

  if(document.querySelector('.cd-d')){
    var tick=function(){
      var ms=DUE-new Date();
      if(ms<0)ms=0;
      var d=Math.floor(ms/86400000);
      var h=Math.floor(ms%86400000/3600000);
      var m=Math.floor(ms%3600000/60000);
      var s=Math.floor(ms%60000/1000);
      document.querySelectorAll('.cd-d').forEach(function(e){e.textContent=d});
      document.querySelectorAll('.cd-h').forEach(function(e){e.textContent=h});
      document.querySelectorAll('.cd-m').forEach(function(e){e.textContent=m});
      document.querySelectorAll('.cd-s').forEach(function(e){e.textContent=s});
    };
    tick();
    setInterval(tick,1000);
  }

  if($('claim-btn')){
    $('claim-btn').addEventListener('click',function(){
      var title=$('claim-title').value.trim();
      if(title){
        var s=document.createElement('div');
        s.className='spine s-sage claimed';
        s.textContent=title;
        $('shelf').appendChild(s);
      }
      $('claim-confirm').classList.add('show');
    });
  }

  if($('rsvp-btn')){
    $('rsvp-btn').addEventListener('click',function(){
      $('rsvp-confirm').classList.add('show');
    });
  }

  document.querySelectorAll('.hair-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      document.querySelectorAll('.hair-btn').forEach(function(o){o.classList.remove('sel')});
      btn.classList.add('sel');
    });
  });
  if($('pred-btn')){
    $('pred-btn').addEventListener('click',function(){
      $('pred-confirm').classList.add('show');
    });
  }

  if($('al-drop')){
    $('al-drop').addEventListener('click',function(){
      this.textContent='photo added';
      this.style.color='#F9F5EA';
      this.style.borderColor='#F9F5EA';
    });
    $('al-btn').addEventListener('click',function(){
      var cap=$('al-cap').value.trim()||'from tonight, under the string lights';
      var fig=document.createElement('figure');
      fig.className='album-tile empty';
      var s=document.createElement('span');
      s.textContent='"'+cap+'" — your photo syncs to the screen';
      fig.appendChild(s);
      var firstEmpty=document.querySelector('#album .album-tile.empty');
      if(firstEmpty){firstEmpty.replaceWith(fig)}else{$('album').appendChild(fig)}
      $('al-cap').value='';
    });
  }

  if($('gb-drop')){
    $('gb-drop').addEventListener('click',function(){
      this.textContent='selfie added';
      this.style.color='#F9F5EA';
      this.style.borderColor='#F9F5EA';
    });
  }
  if($('gb-btn')){
    $('gb-btn').addEventListener('click',function(){
      $('gb-confirm').classList.add('show');
    });
  }

  if($('adv-btn')){
    $('adv-btn').addEventListener('click',function(){
      var t=$('adv-text').value.trim();
      if(!t)return;
      var name=$('adv-name').value.trim()||'You';
      var card=document.createElement('div');card.className='adv-card';
      var q=document.createElement('blockquote');q.textContent=t;
      var w=document.createElement('div');w.className='who';w.textContent=name;
      var cm=document.createElement('div');cm.className='adv-comments';
      cm.innerHTML='<div class="c-row"><input type="text" placeholder="Add your two cents" aria-label="Comment on this advice"><button class="btn small ghost c-post" type="button">Post</button></div>';
      card.appendChild(q);card.appendChild(w);card.appendChild(cm);
      $('adv-wall').prepend(card);
      $('adv-text').value='';
    });
  }
  document.addEventListener('click',function(e){
    if(!e.target.classList.contains('c-post'))return;
    var row=e.target.parentElement;
    var inp=row.querySelector('input');
    var v=inp.value.trim();
    if(!v)return;
    var p=document.createElement('p');
    p.textContent=v+' ';
    var s=document.createElement('span');s.className='c-who';s.textContent='— you';
    p.appendChild(s);
    row.parentElement.insertBefore(p,row);
    inp.value='';
  });

  if($('quiz-unlock')){
    $('quiz-unlock').addEventListener('click',function(){
      var v=$('quiz-pw').value.trim().toLowerCase();
      if(v==='fireflies'){
        $('quiz').classList.add('open');
        $('quiz-lock').style.display='none';
      }else{
        $('quiz-wrong').classList.add('show');
      }
    });
  }
  document.querySelectorAll('.quiz-q').forEach(function(q){
    var a=parseInt(q.getAttribute('data-a'),10);
    var b=parseInt(q.getAttribute('data-b'),10);
    function paint(){
      var total=(a+b)||1;
      q.querySelector('.t-a').style.width=Math.round(a/total*70)+'%';
      q.querySelector('.t-b').style.width=Math.round(b/total*70)+'%';
      q.querySelector('.n-a').textContent=a;
      q.querySelector('.n-b').textContent=b;
    }
    q.querySelectorAll('.q-btn').forEach(function(btn){
      btn.addEventListener('click',function(){
        if(q.getAttribute('data-voted'))return;
        q.setAttribute('data-voted','1');
        if(btn.getAttribute('data-side')==='a'){a++}else{b++}
        btn.classList.add('voted');
        paint();
        q.querySelector('.tally').classList.add('show');
      });
    });
    q.querySelector('.reveal').addEventListener('click',function(){
      var ans=q.getAttribute('data-ans');
      q.querySelectorAll('.q-btn').forEach(function(btn){
        if(btn.getAttribute('data-side')===ans)btn.classList.add('correct');
      });
      this.style.display='none';
    });
  });

  var crmBody=document.querySelector('#crm-table tbody');
  if(crmBody){
    var crmStats=function(){
      var rows=Array.from(crmBody.querySelectorAll('tr'));
      var invited=rows.length;
      var coming=0,books=0,ty=0;
      rows.forEach(function(r){
        if(r.getAttribute('data-status')==='coming'){
          var n=parseInt(r.querySelector('td.num').textContent,10);
          if(!isNaN(n))coming+=n;
        }
        var book=r.children[3].textContent.trim();
        if(book&&book!=='—')books++;
        if(r.querySelector('.ty').checked)ty++;
      });
      $('s-invited').textContent=invited;
      $('s-coming').textContent=coming;
      $('s-books').textContent=books;
      $('s-ty').textContent=ty;
    };
    crmStats();
    crmBody.addEventListener('change',function(e){
      if(e.target.classList.contains('ty'))crmStats();
    });
    document.querySelectorAll('.filter-btn').forEach(function(btn){
      btn.addEventListener('click',function(){
        document.querySelectorAll('.filter-btn').forEach(function(o){o.classList.remove('active')});
        btn.classList.add('active');
        var f=btn.getAttribute('data-f');
        crmBody.querySelectorAll('tr').forEach(function(r){
          r.style.display=(f==='all'||r.getAttribute('data-status')===f)?'':'none';
        });
      });
    });
    var PILL={coming:'<span class="pill st-coming">Coming</span>',await:'<span class="pill st-await">Awaiting reply</span>',regret:'<span class="pill st-regret">Regrets</span>'};
    $('add-btn').addEventListener('click',function(){
      var name=$('add-name').value.trim();
      if(!name)return;
      var party=$('add-party').value.trim()||'—';
      var status=$('add-status').value;
      var tr=document.createElement('tr');
      tr.setAttribute('data-status',status);
      var tdName=document.createElement('td');tdName.className='g-name';tdName.textContent=name;
      var tdParty=document.createElement('td');tdParty.className='num';tdParty.textContent=party;
      var tdStatus=document.createElement('td');tdStatus.innerHTML=PILL[status];
      var tdBook=document.createElement('td');tdBook.textContent='—';
      var tdAddr=document.createElement('td');tdAddr.textContent='—';
      var tdTy=document.createElement('td');
      var cb=document.createElement('input');cb.type='checkbox';cb.className='ty';
      cb.setAttribute('aria-label','Thank-you sent to '+name);
      tdTy.appendChild(cb);
      tr.appendChild(tdName);tr.appendChild(tdParty);tr.appendChild(tdStatus);tr.appendChild(tdBook);tr.appendChild(tdAddr);tr.appendChild(tdTy);
      crmBody.appendChild(tr);
      $('add-name').value='';
      $('add-party').value='';
      crmStats();
    });
  }

  if($('veg-icon')){
    function icoRound(fill,stem){return '<svg width="96" height="96" viewBox="0 0 96 96"><circle cx="48" cy="54" r="30" fill="'+fill+'"/>'+(stem?'<path d="M48 24 V14 M48 14 C43 8 36 10 39 16" fill="none" stroke="#5C7046" stroke-width="3"/>':'')+'</svg>'}
    var ICONS={
      banana:'<svg width="96" height="96" viewBox="0 0 96 96"><path d="M22 34 C22 62 44 78 70 72 C74 78 70 84 60 84 C32 84 12 60 16 32 Z" fill="#E9C46A" stroke="#B98F2E" stroke-width="2"/></svg>',
      carrot:'<svg width="96" height="96" viewBox="0 0 96 96"><path d="M40 30 L64 54 L28 78 Q22 60 40 30 Z" fill="#C77E4A"/><path d="M46 26 q-2 -12 6 -16 M52 30 q4 -12 14 -12 M56 36 q10 -8 18 -4" fill="none" stroke="#5C7046" stroke-width="3"/></svg>',
      corn:'<svg width="96" height="96" viewBox="0 0 96 96"><ellipse cx="48" cy="54" rx="16" ry="32" fill="#E9C46A"/><path d="M40 32 V76 M48 26 V80 M56 32 V76 M34 46 H62 M33 58 H63 M36 68 H60" stroke="#B98F2E" stroke-width="1.5" fill="none"/><path d="M36 78 C28 70 26 52 32 38 C22 50 22 70 30 82 Z M60 78 C68 70 70 52 64 38 C74 50 74 70 66 82 Z" fill="#98A68B"/></svg>',
      leafy:'<svg width="96" height="96" viewBox="0 0 96 96"><circle cx="48" cy="54" r="28" fill="#98A68B"/><path d="M48 26 C36 34 32 48 36 62 M48 26 C60 34 64 48 60 62 M48 28 V80" fill="none" stroke="#5C7046" stroke-width="2.5"/><path d="M26 50 C30 36 40 28 48 26 C40 40 38 52 40 66 Z M70 50 C66 36 56 28 48 26 C56 40 58 52 56 66 Z" fill="#7C8A6E"/></svg>',
      eggplant:'<svg width="96" height="96" viewBox="0 0 96 96"><path d="M60 30 C74 40 76 62 62 74 C46 86 28 76 28 60 C28 46 42 34 54 32 Z" fill="#4A4466"/><path d="M56 30 q0 -12 10 -14 M52 34 q-10 -6 -8 -14" fill="none" stroke="#5C7046" stroke-width="3"/></svg>',
      squash:'<svg width="96" height="96" viewBox="0 0 96 96"><path d="M42 22 C54 22 50 38 54 46 C64 50 70 58 70 66 C70 78 58 84 46 84 C32 84 24 74 26 62 C28 52 36 48 40 44 C42 36 34 22 42 22 Z" fill="#C9A87C" stroke="#8A6B42" stroke-width="2"/></svg>',
      melon:'<svg width="96" height="96" viewBox="0 0 96 96"><circle cx="48" cy="54" r="30" fill="#98A68B"/><path d="M48 24 C38 38 38 70 48 84 M48 24 C58 38 58 70 48 84 M28 38 C40 46 56 46 68 38 M26 66 C40 60 56 60 70 66" fill="none" stroke="#5C7046" stroke-width="2"/></svg>',
      pumpkin:'<svg width="96" height="96" viewBox="0 0 96 96"><ellipse cx="48" cy="58" rx="32" ry="26" fill="#C77E4A"/><ellipse cx="48" cy="58" rx="14" ry="26" fill="none" stroke="#8A6B42" stroke-width="1.5"/><ellipse cx="48" cy="58" rx="24" ry="26" fill="none" stroke="#8A6B42" stroke-width="1.5"/><path d="M48 32 C48 24 52 20 58 18" fill="none" stroke="#5C7046" stroke-width="4"/></svg>'
    };
    ICONS.grapefruit=icoRound('#E9C46A',false);
    ICONS.cabbage=icoRound('#98A68B',true);
    ICONS.coconut=icoRound('#8A6B42',false);

    var GROWTH={
      20:['a garden banana','banana','10 in','10 oz',['He can hear now — the first read-alouds land.','Practicing swallows and little hiccups.']],
      21:['a fresh-pulled carrot','carrot','10½ in','12 oz',['Taste buds are working — he tastes what Abby eats.','Sleeping and waking in tiny cycles.']],
      22:['an ear of sweet corn','corn','11 in','15 oz',['Eyebrows and lashes are in.','His grip is already strong.']],
      23:['a garden grapefruit','grapefruit','11½ in','1.1 lb',['Movement rocks him — he can feel Abby dance.','Hearing sharpens; voices carry through.']],
      24:['a cantaloupe from the vine','melon','11¾ in','1.3 lb',['His face is fully formed.','Lungs are rehearsing breathing.']],
      25:['a head of cauliflower','leafy','13½ in','1.5 lb',['First hair is coming in.','He startles at loud noises now.']],
      26:['a head of garden lettuce','leafy','14 in','1.7 lb',['His eyes are opening this week.','He knows Beau’s and Abby’s voices — read to him.']],
      27:['a glossy eggplant','eggplant','14½ in','1.9 lb',['He may know a favorite story’s rhythm already.','Regular sleep and wake times — often opposite Abby’s.']],
      28:['a butternut squash','squash','14¾ in','2.2 lb',['Eyes open, blinking — maybe even dreaming.','He turns toward light through the garden wall.']],
      29:['an acorn squash','squash','15¼ in','2.5 lb',['Muscles and lungs are bulking up.','Kicks strong enough for Beau to feel from across the couch.']],
      30:['a head of cabbage','cabbage','15¾ in','2.9 lb',['His brain is wrinkling beautifully — growing fast.','He holds his own feet for fun.']],
      31:['a coconut','coconut','16¼ in','3.3 lb',['All five senses are online.','He’s processing faces’ voices and sounds.']],
      32:['a bunch of kale','leafy','16¾ in','3.8 lb',['Practicing sucking his thumb.','Toenails in; hair thickening.']],
      33:['a pineapple','pumpkin','17¼ in','4.2 lb',['His pupils widen and narrow with light now.','Bones hardening — except his clever soft skull.']],
      34:['a garden melon','melon','17¾ in','4.7 lb',['Cozy and waterproofed in vernix.','He can tell family voices apart.']],
      35:['a honeydew','melon','18¼ in','5.3 lb',['Kidneys and liver fully on the job.','Getting snug — more rolls than kicks.']],
      36:['a head of romaine','leafy','18¾ in','5.8 lb',['Likely head-down and getting ready.','Cheeks filling in, skin smoothing out.']],
      37:['a bunch of swiss chard','leafy','19 in','6.3 lb',['Officially early term — rehearsing everything.','Grip strong enough to hold a finger.']],
      38:['a winter squash','squash','19½ in','6.8 lb',['Brain adding connections by the million.','A firm little handshake is waiting.']],
      39:['a mini watermelon','melon','20 in','7.3 lb',['Lungs ready to announce himself.','Building fat to stay cozy in the world.']],
      40:['a little pumpkin','pumpkin','20¼ in','7.6 lb',['Ready for chapter one.','Any day now — the garden is waiting.']]
    };
    function gaInfo(){
      var daysToDue=Math.ceil((DUE-new Date())/86400000);
      var gaDays=280-daysToDue;
      return {week:Math.floor(gaDays/7),day:gaDays%7,toGo:daysToDue};
    }
    var ga=gaInfo();
    var curWeek=Math.max(20,Math.min(40,ga.week));
    var viewWeek=curWeek;
    function renderWeek(){
      var g=GROWTH[viewWeek];
      $('veg-icon').innerHTML=ICONS[g[1]];
      $('g-week').textContent='Week '+viewWeek+' of 40'+(viewWeek===curWeek?' — this week':'');
      $('g-size').textContent='about the size of '+g[0];
      $('g-stats').textContent=g[2]+' long · around '+g[3];
      var notes=$('g-notes');
      notes.innerHTML='';
      var lbl=document.createElement('span');
      lbl.className='n-label';
      lbl.textContent=(viewWeek===curWeek?'New this week':'What was new in week '+viewWeek);
      notes.appendChild(lbl);
      g[4].forEach(function(n){
        var li=document.createElement('li');
        li.textContent=n;
        notes.appendChild(li);
      });
      $('wk-label').textContent='week '+viewWeek;
    }
    renderWeek();
    if(ga.toGo>0){
      $('g-now-note').textContent='Myles is '+ga.week+' weeks, '+ga.day+(ga.day===1?' day':' days')+' along — '+ga.toGo+' days until October 14th.';
    }else{
      $('g-now-note').textContent='He’s here! The next chapter has begun.';
    }
    $('wk-prev').addEventListener('click',function(){
      if(viewWeek>20){viewWeek--;renderWeek();}
    });
    $('wk-next').addEventListener('click',function(){
      if(viewWeek<40){viewWeek++;renderWeek();}
    });
    $('wk-now').addEventListener('click',function(){
      viewWeek=curWeek;renderWeek();
    });
  }
})();
