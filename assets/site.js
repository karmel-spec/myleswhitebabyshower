(function(){
  function $(id){return document.getElementById(id)}
  var DUE=new Date(2026,9,14,0,0,0);
  var SHOWER=new Date(2026,7,15,19,0,0);
  var SG=window.SG||{enabled:false};
  // Beau-or-Abby and Whose-baby-face stop needing a password once the party
  // is truly underway, so a phone with a dead battery or a late arrival
  // never blocks anyone from playing.
  var PW_FREE_AT=new Date(2026,7,15,17,0,0);
  var pwFree=function(){return /[?&]preview/.test(location.search)||new Date()>=PW_FREE_AT};

  function fmtTime(iso){
    var d=new Date(iso);
    var h=d.getHours(),m=d.getMinutes();
    var ap=h>=12?'pm':'am';
    h=h%12||12;
    return h+':'+(m<10?'0':'')+m+' '+ap;
  }
  function busy(btn,on,label){
    btn.disabled=on;
    if(on){btn.setAttribute('data-label',btn.textContent);btn.textContent=label||'Sending…'}
    else{btn.textContent=btn.getAttribute('data-label')||btn.textContent}
  }
  function oops(el){
    if(!el)return;
    el.textContent='hmm, that didn’t save — check your connection and try once more?';
    el.classList.add('show');
  }
  function showPreview(drop,file){
    var old=drop.querySelector('img.drop-preview');
    if(old)URL.revokeObjectURL(old.src);
    drop.innerHTML='';
    var img=document.createElement('img');
    img.className='drop-preview';
    img.alt='your photo, added';
    img.src=URL.createObjectURL(file);
    var tag=document.createElement('span');
    tag.className='drop-tag';
    tag.textContent='added · tap to change';
    drop.appendChild(img);
    drop.appendChild(tag);
  }
  function pickFile(drop,onPick,capture){
    var input=document.createElement('input');
    input.type='file';
    input.accept='image/*';
    // hints the phone to open the camera directly instead of the photo
    // library; ignored (falls back to a normal picker) where unsupported
    if(capture)input.setAttribute('capture',capture);
    input.style.display='none';
    document.body.appendChild(input);
    input.addEventListener('change',function(){
      if(input.files[0]){
        showPreview(drop,input.files[0]);
        onPick(input.files[0]);
      }
    });
    var open=function(){input.click()};
    drop.addEventListener('click',open);
    drop.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}});
  }

  if(document.body.hasAttribute('data-dayof')){
    var OPENS=new Date(2026,7,15,0,0,0);
    var sneakPeek=/[?&]preview/.test(location.search);
    if(!sneakPeek&&new Date()<OPENS){
      document.querySelectorAll('section.chapter,.top-next,nav.chapter-nav').forEach(function(el){el.style.display='none'});
      var lock=document.createElement('section');
      lock.className='chapter';
      lock.innerHTML='<div class="wrap" style="text-align:center;max-width:640px">'
        +'<header><p class="eyebrow">On the day of the shower</p>'
        +'<h2 style="letter-spacing:.12em;text-transform:uppercase">This page opens <span class="script" style="font-size:1.35em;text-transform:none;letter-spacing:0;vertical-align:-2px">August 15th</span></h2>'
        +'<p class="lede">The predictions, his portraits, the games, and the guest book all unlock the evening of the shower. Scan the code at your table that night and everything will be waiting.</p></header>'
        +'<a class="btn ghost" href="index.html#contents">Back to the table of contents</a>'
        +'</div>';
      var foot=document.querySelector('footer.colophon');
      document.body.insertBefore(lock,foot);
    }
  }

  if(document.querySelector('.cd-d')){
    var tick=function(){
      var ms=SHOWER-new Date();
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

  // --- the evening: games stay locked until the day of the shower ---------
  if($('games-block')){
    var PARTY=new Date(2026,7,15,0,0,0);
    var sneak=/[?&]preview/.test(location.search);
    if(new Date()<PARTY&&!sneak){
      $('games-block').style.display='none';
      $('games-daylock').hidden=false;
    }
  }

  // --- books for baby: claim a book -------------------------------------
  if($('claim-btn')){
    function addSpine(title){
      var s=document.createElement('div');
      s.className='spine claimed';
      s.textContent=title;
      $('shelf').appendChild(s);
    }
    if(SG.enabled){
      SG.listClaims().then(function(rows){rows.forEach(function(r){addSpine(r.title)})}).catch(function(){});
    }
    $('claim-btn').addEventListener('click',function(){
      var btn=this;
      var title=$('claim-title').value.trim();
      var name=$('claim-name')?$('claim-name').value.trim():'';
      if(SG.enabled){
        if(!title)return;
        busy(btn,true,'Claiming…');
        SG.claimBook(name,title).then(function(){
          addSpine(title);
          $('claim-title').value='';
          $('claim-confirm').textContent='thanks for helping our story grow';
          $('claim-confirm').classList.add('show');
        }).catch(function(){oops($('claim-confirm'))}).then(function(){busy(btn,false)});
        return;
      }
      if(title)addSpine(title);
      $('claim-confirm').classList.add('show');
    });
  }

  if($('shelf-wrap')){
    var sWrap=$('shelf-wrap'),sShelf=$('shelf');
    var sUpd=function(){
      var max=sShelf.scrollWidth-sShelf.clientWidth;
      sWrap.toggleAttribute('data-at-start',sShelf.scrollLeft<8);
      sWrap.toggleAttribute('data-at-end',sShelf.scrollLeft>max-8);
      var hint=document.querySelector('.shelf-hint');
      if(hint)hint.style.display=max>8?'':'none';
    };
    sShelf.addEventListener('scroll',sUpd,{passive:true});
    window.addEventListener('resize',sUpd);
    sUpd();
    setTimeout(sUpd,400);
    $('shelf-left').addEventListener('click',function(){sShelf.scrollBy({left:-220,behavior:'smooth'})});
    $('shelf-right').addEventListener('click',function(){sShelf.scrollBy({left:220,behavior:'smooth'})});
  }

  // --- hosts' preview key rides along on marked links ----------------------
  if(/[?&]preview/.test(location.search)){
    Array.prototype.forEach.call(document.querySelectorAll('a[data-pv]'),function(a){
      a.href+=(a.href.indexOf('?')>-1?'&':'?')+'preview';
    });
  }

  // --- the time capsule: a message for him to open someday -----------------
  if($('tc-btn')){
    var tcPhoto=null,tcAudio=null,tcRecorder=null,tcTimer=null,tcSecs=0;
    pickFile($('tc-photo'),function(f){tcPhoto=f;$('tc-photo').classList.add('picked')});
    var tcRecBtn=$('tc-rec');
    if(!(navigator.mediaDevices&&window.MediaRecorder)){
      tcRecBtn.disabled=true;
      $('tc-rec-note').textContent='this phone’s browser can’t record here — your written words carry it beautifully';
    }else{
      tcRecBtn.addEventListener('click',function(){
        if(tcRecorder&&tcRecorder.state==='recording'){tcRecorder.stop();return}
        navigator.mediaDevices.getUserMedia({audio:true}).then(function(stream){
          var chunks=[];
          tcRecorder=new MediaRecorder(stream);
          tcRecorder.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data)};
          tcRecorder.onstop=function(){
            stream.getTracks().forEach(function(t){t.stop()});
            clearInterval(tcTimer);
            var type=tcRecorder.mimeType||'audio/mp4';
            var blob=new Blob(chunks,{type:type});
            tcAudio=new File([blob],'voice.'+(type.indexOf('webm')>-1?'webm':'m4a'),{type:type});
            $('tc-play').src=URL.createObjectURL(blob);
            $('tc-play').hidden=false;
            tcRecBtn.textContent='● Record again';
            $('tc-rec-note').textContent='listen back below — recording again replaces it';
          };
          tcRecorder.start();
          tcSecs=0;
          tcRecBtn.textContent='■ Stop recording';
          $('tc-rec-note').textContent='recording… up to thirty seconds, tap stop when you’re done';
          tcTimer=setInterval(function(){
            tcSecs++;
            if(tcSecs>=30&&tcRecorder.state==='recording')tcRecorder.stop();
          },1000);
        }).catch(function(){
          $('tc-rec-note').textContent='the microphone said no — words on the page work beautifully too';
        });
      });
    }
    $('tc-btn').addEventListener('click',function(){
      var btn=this;
      if(btn.classList.contains('sent'))return;
      var name=$('tc-name').value.trim();
      var msg=$('tc-msg').value.trim();
      if(!msg&&!tcAudio&&!tcPhoto){$('tc-msg').focus();return}
      var finish=function(){
        $('tc-confirm').classList.add('show');
        btn.disabled=true;
        btn.textContent='Sealed 🌼';
        btn.classList.add('sent');
      };
      if(SG.enabled){
        busy(btn,true,'Sealing…');
        SG.addTimeCapsule(name,msg,tcPhoto,tcAudio).then(function(){busy(btn,false);finish()})
          .catch(function(){busy(btn,false);oops($('tc-confirm'))});
        return;
      }
      finish();
    });
  }

  // --- rsvp ---------------------------------------------------------------
  if($('rsvp-btn')){
    var faceBaby=null,faceNow=null,att='';
    if($('face-baby')){
      pickFile($('face-baby'),function(f){faceBaby=f;$('face-baby').classList.add('picked')});
      pickFile($('face-now'),function(f){faceNow=f;$('face-now').classList.add('picked')});
    }
    var setAtt=function(v){
      att=v;
      $('att-yes').classList.toggle('picked',v==='yes');
      $('att-no').classList.toggle('picked',v==='no');
      $('rsvp-more').hidden=(v==='no');
      $('att-need').style.display='none';
    };
    $('att-yes').addEventListener('click',function(){setAtt('yes')});
    $('att-no').addEventListener('click',function(){setAtt('no')});
    var markSent=function(btn){
      btn.disabled=true;
      btn.textContent='Sent 🌼';
      btn.classList.add('sent');
    };
    var showNext=function(){
      $('rsvp-next-lede').textContent=(att==='no')
        ?'We’ll miss you! If you’d like to send a little something his way, the gift table has the registry and Venmo —'
        :'The story doesn’t stop here —';
      $('rsvp-next').hidden=false;
    };
    $('rsvp-btn').addEventListener('click',function(){
      var btn=this;
      if(btn.classList.contains('sent'))return;
      var name=$('r-name').value.trim();
      if(!name){$('r-name').focus();return}
      if(!att){$('att-need').style.display='';return}
      if(SG.enabled){
        busy(btn,true,'Sending…');
        var ok=false;
        var row={
          name:name,
          party:att==='no'?null:$('r-party').value.trim()||null,
          cant_eat:att==='no'?'':$('r-food').value.trim(),
          address:'',
          attending:att
        };
        // if the attending column hasn't been added yet, retry without it,
        // carrying the regret in the party field so no reply is ever lost
        var sent=SG.submitRsvp(row).catch(function(e){
          if(e&&(e.code==='PGRST204'||/attending/.test(e.message||''))){
            delete row.attending;
            if(att==='no')row.party='sadly can’t come';
            return SG.submitRsvp(row);
          }
          throw e;
        });
        if(att==='yes'&&faceBaby&&faceNow){
          sent=sent.then(function(){return SG.addFace(name,faceBaby,faceNow)});
        }
        sent.then(function(){
          ok=true;
          $('rsvp-confirm').textContent=(att==='no')
            ?'thank you for telling us — you’ll be missed'
            :(faceBaby&&faceNow)
              ?'you are part of our story now, and you’re in the baby-face game'
              :'you are part of our story now';
          $('rsvp-confirm').classList.add('show');
          showNext();
        }).catch(function(){oops($('rsvp-confirm'))}).then(function(){
          busy(btn,false);
          if(ok)markSent(btn);
        });
        return;
      }
      $('rsvp-confirm').classList.add('show');
      showNext();
      markSent(btn);
    });
  }

  // --- predictions ---------------------------------------------------------
  document.querySelectorAll('.hair-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      document.querySelectorAll('.hair-btn').forEach(function(o){o.classList.remove('sel')});
      btn.classList.add('sel');
    });
  });
  if($('pred-btn')){
    $('pred-btn').addEventListener('click',function(){
      var btn=this;
      if(SG.enabled){
        var hair=document.querySelector('.hair-btn.sel');
        busy(btn,true,'Sending…');
        SG.submitPrediction({
          arrival:$('p-date').value.trim(),
          weight:$('p-weight').value.trim(),
          length:$('p-length').value.trim(),
          hair:hair?hair.textContent:''
        }).then(function(){
          $('pred-confirm').textContent='you’re on the board';
          $('pred-confirm').classList.add('show');
        }).catch(function(){oops($('pred-confirm'))}).then(function(){busy(btn,false)});
        return;
      }
      $('pred-confirm').classList.add('show');
    });
  }

  // --- the evening: group album --------------------------------------------
  if($('al-drop')){
    var albumFile=null;
    function albumTile(url,caption){
      var fig=document.createElement('figure');
      fig.className='album-tile';
      var im=document.createElement('img');
      im.src=url;im.alt=caption||'party photo';
      fig.appendChild(im);
      if(caption){
        var fc=document.createElement('figcaption');
        fc.textContent=caption;
        fig.appendChild(fc);
      }
      var firstEmpty=document.querySelector('#album .album-tile.empty');
      if(firstEmpty){firstEmpty.replaceWith(fig)}else{$('album').appendChild(fig)}
    }
    pickFile($('al-drop'),function(f){
      albumFile=f;
      $('al-drop').style.borderColor='#F9F5EA';
    });
    $('al-btn').addEventListener('click',function(){
      var btn=this;
      var cap=$('al-cap').value.trim()||'from tonight, under the string lights';
      var who=$('al-name')?$('al-name').value.trim():'';
      if(SG.enabled){
        if(!albumFile){$('al-drop').textContent='pick a photo first';return}
        if(!who){$('al-name').focus();return}
        busy(btn,true,'Adding…');
        SG.addAlbumPhoto(albumFile,cap,who).then(function(){
          albumTile(URL.createObjectURL(albumFile),cap);
          albumFile=null;
          $('al-drop').textContent='add another photo';
          $('al-cap').value='';
        }).catch(function(){$('al-drop').textContent='hmm, try that photo again?'}).then(function(){busy(btn,false)});
        return;
      }
      var fig=document.createElement('figure');
      fig.className='album-tile empty';
      var s=document.createElement('span');
      s.textContent='"'+cap+'" (your photo syncs to the screen)';
      fig.appendChild(s);
      var firstEmpty=document.querySelector('#album .album-tile.empty');
      if(firstEmpty){firstEmpty.replaceWith(fig)}else{$('album').appendChild(fig)}
      $('al-cap').value='';
    });
    if(SG.enabled){
      SG.listAlbum().then(function(rows){rows.forEach(function(r){albumTile(r.photo_url,r.caption)})}).catch(function(){});
    }
  }

  // --- the evening: guest book ---------------------------------------------
  if($('gb-drop')){
    var gbFile=null;
    pickFile($('gb-drop'),function(f){
      gbFile=f;
      $('gb-drop').style.borderColor='#F9F5EA';
    },'user');
    function gbEntry(message,photoUrl,when,prepend){
      var wrap=document.createElement('div');
      wrap.className='gb-entry';
      if(photoUrl){
        var im=document.createElement('img');
        im.src=photoUrl;im.alt='guest selfie';im.className='gb-photo';
        wrap.appendChild(im);
      }else{
        wrap.insertAdjacentHTML('afterbegin','<svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="20" fill="none" stroke="#C3CCDD" stroke-width="1.3"/><circle cx="16" cy="20" r="1.6" fill="#C3CCDD"/><circle cx="28" cy="20" r="1.6" fill="#C3CCDD"/><path d="M16 28 Q22 33 28 28" fill="none" stroke="#C3CCDD" stroke-width="1.3"/></svg>');
      }
      var p=document.createElement('p');
      p.textContent='"'+message+'"';
      var who=document.createElement('span');
      who.className='who';
      who.textContent=when;
      p.appendChild(who);
      wrap.appendChild(p);
      var box=document.querySelector('.gb-entries');
      if(prepend&&box.firstChild){box.insertBefore(wrap,box.firstChild)}else{box.appendChild(wrap)}
    }
    if($('gb-btn')){
      $('gb-btn').addEventListener('click',function(){
        var btn=this;
        if(SG.enabled){
          var msg=$('gb-msg').value.trim();
          if(!msg&&!gbFile){$('gb-msg').focus();return}
          busy(btn,true,'Signing…');
          var file=gbFile;
          SG.signGuestbook(msg,file).then(function(){
            gbEntry(msg||'…',file?URL.createObjectURL(file):null,fmtTime(new Date().toISOString()),true);
            gbFile=null;
            $('gb-msg').value='';
            $('gb-drop').textContent='add your selfie';
            $('gb-confirm').textContent='signed! See you in the album';
            $('gb-confirm').classList.add('show');
          }).catch(function(){oops($('gb-confirm'))}).then(function(){busy(btn,false)});
          return;
        }
        $('gb-confirm').classList.add('show');
      });
    }
    if(SG.enabled){
      SG.listGuestbook().then(function(rows){
        for(var i=rows.length-1;i>=0;i--){
          gbEntry(rows[i].message,rows[i].photo_url,fmtTime(rows[i].created_at),true);
        }
      }).catch(function(){});
    }
  }

  // --- the evening: advice wall ---------------------------------------------
  function adviceCard(text,name,id){
    var card=document.createElement('div');card.className='adv-card';
    if(id)card.setAttribute('data-id',id);
    var q=document.createElement('blockquote');q.textContent=text;
    var w=document.createElement('div');w.className='who';w.textContent=name;
    var cm=document.createElement('div');cm.className='adv-comments';
    cm.innerHTML='<div class="c-row"><input type="text" placeholder="Add your two cents" aria-label="Comment on this advice"><button class="btn small ghost c-post" type="button">Post</button></div>';
    card.appendChild(q);card.appendChild(w);card.appendChild(cm);
    return card;
  }
  function commentLine(text,who){
    var p=document.createElement('p');
    p.textContent=text+' ';
    var s=document.createElement('span');s.className='c-who';s.textContent='— '+who;
    p.appendChild(s);
    return p;
  }
  if($('adv-btn')){
    if(SG.enabled){
      SG.listAdvice().then(function(rows){
        for(var i=rows.length-1;i>=0;i--){
          var card=adviceCard(rows[i].message,rows[i].name||'A guest',rows[i].id);
          (rows[i].advice_comments||[]).forEach(function(c){
            var row=card.querySelector('.c-row');
            row.parentElement.insertBefore(commentLine(c.message,'a guest'),row);
          });
          $('adv-wall').prepend(card);
        }
      }).catch(function(){});
    }
    $('adv-btn').addEventListener('click',function(){
      var btn=this;
      var t=$('adv-text').value.trim();
      if(!t)return;
      var name=$('adv-name').value.trim()||'You';
      if(SG.enabled){
        busy(btn,true,'Posting…');
        SG.postAdvice(name,t).then(function(row){
          $('adv-wall').prepend(adviceCard(t,name,row.id));
          $('adv-text').value='';
        }).catch(function(){}).then(function(){busy(btn,false)});
        return;
      }
      $('adv-wall').prepend(adviceCard(t,name));
      $('adv-text').value='';
    });
  }
  document.addEventListener('click',function(e){
    if(!e.target.classList.contains('c-post'))return;
    var row=e.target.parentElement;
    var inp=row.querySelector('input');
    var v=inp.value.trim();
    if(!v)return;
    var card=e.target.closest('.adv-card');
    var id=card?card.getAttribute('data-id'):null;
    row.parentElement.insertBefore(commentLine(v,'you'),row);
    inp.value='';
    if(SG.enabled&&id)SG.postComment(id,v).catch(function(){});
  });

  // --- the evening: beau-or-abby quiz -----------------------------------------
  if($('quiz-unlock')){
    if(pwFree()){
      $('quiz').classList.add('open');
      $('quiz-lock').style.display='none';
    }else{
      $('quiz-unlock').addEventListener('click',function(){
        var v=$('quiz-pw').value.trim().toLowerCase();
        if(v==='karm0451'){
          $('quiz').classList.add('open');
          $('quiz-lock').style.display='none';
        }else{
          $('quiz-wrong').classList.add('show');
        }
      });
    }
  }
  var quizQs=document.querySelectorAll('.quiz-q');
  if(quizQs.length){
    var tallies={};
    quizQs.forEach(function(q,idx){
      var a=parseInt(q.getAttribute('data-a'),10);
      var b=parseInt(q.getAttribute('data-b'),10);
      if(SG.enabled){a=0;b=0}
      tallies[idx]={a:a,b:b};
      function paint(){
        var t=tallies[idx];
        var total=(t.a+t.b)||1;
        q.querySelector('.t-a').style.width=Math.round(t.a/total*70)+'%';
        q.querySelector('.t-b').style.width=Math.round(t.b/total*70)+'%';
        q.querySelector('.n-a').textContent=t.a;
        q.querySelector('.n-b').textContent=t.b;
      }
      q.paint=paint;
      q.querySelectorAll('.q-btn').forEach(function(btn){
        btn.addEventListener('click',function(){
          if(q.getAttribute('data-voted'))return;
          q.setAttribute('data-voted','1');
          var side=btn.getAttribute('data-side');
          tallies[idx][side]++;
          btn.classList.add('voted');
          paint();
          q.querySelector('.tally').classList.add('show');
          if(SG.enabled)SG.voteQuiz(idx,side).catch(function(){});
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
    if(SG.enabled){
      var refreshTallies=function(){
        SG.quizTallies().then(function(t){
          quizQs.forEach(function(q,idx){
            tallies[idx]={a:(t[idx]&&t[idx].a)||0,b:(t[idx]&&t[idx].b)||0};
            q.paint();
          });
        }).catch(function(){});
      };
      refreshTallies();
      setInterval(refreshTallies,5000);
    }
  }

  // --- guest list: host gate + crm ---------------------------------------------
  if($('gate')){
    var unlock=function(){
      $('gate').hidden=true;
      $('crm-app').hidden=false;
      if(SG.enabled)loadCrm();
    };
    SG.hostSession().then(function(ok){if(ok)unlock()});
    var tryPw=function(){
      var pw=$('gate-pw').value;
      if(!pw)return;
      var btn=$('gate-btn');
      busy(btn,true,'Checking…');
      SG.hostSignIn(pw).then(unlock).catch(function(){
        $('gate-wrong').classList.add('show');
      }).then(function(){busy(btn,false)});
    };
    $('gate-btn').addEventListener('click',tryPw);
    $('gate-pw').addEventListener('keydown',function(e){if(e.key==='Enter')tryPw()});
  }

  var crmBody=document.querySelector('#crm-table tbody');
  if(crmBody){
    var PILL={coming:'<span class="pill st-coming">Coming</span>',await:'<span class="pill st-await">Awaiting reply</span>',regret:'<span class="pill st-regret">Regrets</span>'};
    var crmStats=function(){
      var rows=Array.from(crmBody.querySelectorAll('tr'));
      var invited=rows.length;
      var coming=0,books=0,ty=0;
      rows.forEach(function(r){
        if(r.getAttribute('data-status')==='coming')coming++;
        var book=r.children[2]?r.children[2].textContent.trim():'';
        if(book&&book!=='—')books++;
        var cb=r.querySelector('.ty');
        if(cb&&cb.checked)ty++;
      });
      $('s-invited').textContent=invited;
      $('s-coming').textContent=coming;
      $('s-books').textContent=books;
      $('s-ty').textContent=ty;
    };
    // each message ends with its link: Messages only renders the big picture
    // preview (the page's og:image card) when the link sits at the very end
    var SEND_MSGS=(function(){
      var cfg=window.STORY_GARDEN_CONFIG||{};
      var link=cfg.siteUrl||'';
      return {
        invite:'You’re invited! 🌼 A baby shower for Baby Boy White, in honor of Abby White: Saturday, August 15th at 7pm, in Grandma’s garden, Orem. Five quick storybook pages, tap Next chapter through to the RSVP (the registry is inside too). 📖 Hope you can come!'
          +(link?' All the details & RSVP: '+link:''),
        nudge:'🌼 A little nudge from the “Story Garden Baby Boy Shower for Abby White”: we’re saving you a seat for Saturday, August 15th at 7pm. Kindly RSVP'
          +(link?': '+link+'/rsvp.html':'! Reply to this text and we’ll pencil you in.'),
        details:'🌙 Two days to go! Baby Boy White’s shower is Saturday at 7pm, Grandma’s garden, Orem. Bring a well-loved children’s book instead of a card.'
          +(link?' Everything else: '+link:'')
      };
    })();
    var composeMsg=function(kind){
      kind=kind||'invite';
      var inp=document.querySelector('.send-personal[data-kind="'+kind+'"]');
      var parts=[];
      if(inp&&inp.value.trim())parts.push(inp.value.trim());
      parts.push(SEND_MSGS[kind]);
      return parts.join('\n\n');
    };
    var smsHref=function(phone,kind){
      var digits=phone.replace(/\D/g,'');
      if(digits.length===10)digits='1'+digits;
      return 'sms:+'+digits+'?&body='+encodeURIComponent(composeMsg(kind));
    };
    var crmGuests=[];
    // tapping any text chip (or a row's "text invite" link) ticks the matching
    // texted column by itself, so the table tracks itself
    var KIND_FIELD={invite:'invite_texted',nudge:'nudge_texted',details:'twoday_texted'};
    var markTexted=function(g,field){
      if(!field||g[field])return;
      g[field]=true;
      if(SG.enabled&&g.id){var u={};u[field]=true;SG.updateGuest(g.id,u).catch(function(){})}
      if(g.id){
        var tr=crmBody.querySelector('tr[data-id="'+g.id+'"]');
        if(tr){var c=tr.querySelector('.txcb[data-field="'+field+'"]');if(c)c.checked=true;}
      }
    };
    var renderChips=function(){
      var FILTERS={
        invite:function(g){return !!g.phone},
        nudge:function(g){return !!g.phone&&g.status==='await'},
        details:function(g){return !!g.phone&&g.status==='coming'}
      };
      Object.keys(FILTERS).forEach(function(kind){
        var box=document.querySelector('.send-chips[data-kind="'+kind+'"]');
        if(!box)return;
        box.innerHTML='';
        var who=crmGuests.filter(FILTERS[kind]);
        if(!who.length){
          var EMPTY={
            invite:'no cell numbers yet. Add them above and names appear here',
            nudge:'no one to nudge — everyone with a number has replied',
            details:'no “coming” guests with a number yet. RSVPs mark a guest as coming when the names match — or change any status right in the table above'
          };
          var em=document.createElement('span');
          em.className='chip-empty';
          em.textContent=EMPTY[kind];
          box.appendChild(em);
          return;
        }
        who.forEach(function(g){
          var a=document.createElement('a');
          a.className='chip';
          a.href=smsHref(g.phone,kind);
          a.textContent=g.name;
          // rebuild at tap time so a personal line typed after render still rides along
          a.addEventListener('click',function(){this.href=smsHref(g.phone,kind);markTexted(g,KIND_FIELD[kind])});
          box.appendChild(a);
        });
      });
    };
    if($('send-bubble-invite')){
      var updBubbles=function(){
        $('send-bubble-invite').textContent=composeMsg('invite');
        $('send-bubble-nudge').textContent=composeMsg('nudge');
        $('send-bubble-details').textContent=composeMsg('details');
      };
      updBubbles();
      Array.prototype.forEach.call(document.querySelectorAll('.send-personal'),function(inp){
        inp.addEventListener('input',updBubbles);
      });
      renderChips();
    }
    var guestRow=function(g){
      var tr=document.createElement('tr');
      tr.setAttribute('data-status',g.status);
      if(g.id)tr.setAttribute('data-id',g.id);
      var tdName=document.createElement('td');tdName.className='g-name';tdName.textContent=g.name;
      if(g.phone){
        var sms=document.createElement('a');
        sms.className='sms-link';
        sms.href=smsHref(g.phone);
        sms.textContent='text invite';
        sms.addEventListener('click',function(){this.href=smsHref(g.phone);markTexted(g,'invite_texted')});
        tdName.appendChild(sms);
      }
      var tdStatus=document.createElement('td');
      var sel=document.createElement('select');
      sel.className='st-sel st-'+(g.status||'await');
      sel.setAttribute('aria-label','Status for '+g.name);
      [['coming','Coming'],['await','Awaiting reply'],['regret','Regrets']].forEach(function(o){
        var op=document.createElement('option');op.value=o[0];op.textContent=o[1];
        if((g.status||'await')===o[0])op.selected=true;
        sel.appendChild(op);
      });
      sel.addEventListener('change',function(){
        g.status=sel.value;
        sel.className='st-sel st-'+g.status;
        tr.setAttribute('data-status',g.status);
        crmStats();
        renderChips();
        if(SG.enabled&&g.id)SG.updateGuest(g.id,{status:g.status}).catch(function(){});
      });
      tdStatus.appendChild(sel);
      var tdBook=document.createElement('td');tdBook.textContent=g.book||'—';
      var textedCell=function(field,label){
        var td=document.createElement('td');
        var c=document.createElement('input');c.type='checkbox';c.className='txcb';
        c.setAttribute('data-field',field);
        c.checked=!!g[field];
        c.setAttribute('aria-label',label+' — '+g.name);
        td.appendChild(c);
        return td;
      };
      var tdInv=textedCell('invite_texted','Invite texted');
      var tdNud=textedCell('nudge_texted','Reminder nudge texted');
      var td2d=textedCell('twoday_texted','Two-day reminder texted');
      var tdTy=document.createElement('td');
      var cb=document.createElement('input');cb.type='checkbox';cb.className='ty';cb.checked=!!g.thank_you;
      cb.setAttribute('aria-label','Thank-you sent to '+g.name);
      tdTy.appendChild(cb);
      var tdDel=document.createElement('td');
      var del=document.createElement('button');
      del.className='row-del';
      del.type='button';
      del.textContent='×';
      del.setAttribute('aria-label','Remove '+g.name+' from the guest list');
      del.addEventListener('click',function(){
        if(!window.confirm('Remove '+g.name+' from the guest list?'))return;
        var finish=function(){
          var i=crmGuests.indexOf(g);
          if(i>-1)crmGuests.splice(i,1);
          tr.remove();
          crmStats();
          renderChips();
        };
        if(SG.enabled&&g.id){SG.deleteGuest(g.id).then(finish).catch(function(){})}
        else finish();
      });
      tdDel.appendChild(del);
      tr.appendChild(tdName);tr.appendChild(tdStatus);tr.appendChild(tdBook);tr.appendChild(tdInv);tr.appendChild(tdNud);tr.appendChild(td2d);tr.appendChild(tdTy);tr.appendChild(tdDel);
      return tr;
    };
    var normName=function(s){return (s||'').toLowerCase().replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim()};
    var isJunk=function(s){return /claude diagnostic|please ignore|\(test\)/i.test(s||'')};
    var loadCrm=function(){
      Promise.all([
        SG.listGuests().catch(function(){return []}),
        SG.listRsvps().catch(function(){return []}),
        SG.listFaces().catch(function(){return []})
      ]).then(function(res){
        var guests=res[0].filter(function(g){return !isJunk(g.name)});
        var rsvps=res[1].filter(function(r){return !isJunk(r.name)});
        var facesByName={};
        res[2].forEach(function(f){
          if(!isJunk(f.name))facesByName[normName(f.name)]=f;
        });
        rsvps.forEach(function(r){
          var rn=normName(r.name);
          if(!rn)return;
          r.regret=(r.attending==='no'||/sadly can.t come/i.test(r.party||''));
          var want=r.regret?'regret':'coming';
          var g=guests.find(function(g2){
            var gn=normName(g2.name);
            return !!gn&&(gn===rn||(rn.length>3&&gn.indexOf(rn)>-1)||(gn.length>3&&rn.indexOf(gn)>-1));
          });
          if(g){
            r.matched='matched';
            if(g.status!==want){
              g.status=want;
              if(SG.enabled&&g.id)SG.updateGuest(g.id,{status:want}).catch(function(){});
            }
          }else{
            var ng={name:r.name,phone:null,party:null,status:want};
            guests.push(ng);
            r.matched='added';
            if(SG.enabled)SG.addGuest(ng).then(function(saved){if(saved&&saved.id)ng.id=saved.id}).catch(function(){});
          }
        });
        crmBody.innerHTML='';
        guests.forEach(function(g){crmBody.appendChild(guestRow(g))});
        crmGuests=guests;
        crmStats();
        renderChips();
        if(rsvps.length){
          $('rsvp-inbox').hidden=false;
          var box=$('rsvp-inbox-list');
          box.innerHTML='';
          rsvps.forEach(function(r){
            var d=document.createElement('div');
            d.className='inbox-card';
            var strong=document.createElement('strong');strong.textContent=r.name;
            d.appendChild(strong);
            var bits=[];
            if(r.regret)bits.push('sadly can’t come 💌');
            if(r.party&&!/sadly can.t come/i.test(r.party))bits.push(r.party);
            if(r.cant_eat)bits.push('can’t eat: '+r.cant_eat);
            if(r.address)bits.push('address on file');
            var p=document.createElement('p');p.textContent=bits.join(' · ')||'no details';
            d.appendChild(p);
            var f=facesByName[normName(r.name)];
            if(f){
              var ph=document.createElement('span');
              ph.className='inbox-thumbs';
              [[f.baby_url,'as a baby'],[f.now_url,'these days']].forEach(function(u){
                if(!u[0])return;
                var im=document.createElement('img');
                im.src=u[0];
                im.alt=r.name+', '+u[1];
                im.loading='lazy';
                ph.appendChild(im);
              });
              d.appendChild(ph);
            }
            var when=document.createElement('span');when.className='who';
            when.textContent=new Date(r.created_at).toLocaleDateString()
              +(r.matched==='added'?' · added to the guest list as coming':' · marked coming in the guest list')
              +(f?' · baby-face photos in':'');
            d.appendChild(when);
            box.appendChild(d);
          });
        }
      });
    };
    crmStats();
    crmBody.addEventListener('change',function(e){
      var t=e.target,tr=t.closest('tr');
      var id=tr?tr.getAttribute('data-id'):null;
      if(t.classList.contains('ty')){
        crmStats();
        if(SG.enabled&&id)SG.updateGuest(id,{thank_you:t.checked}).catch(function(){});
      }else if(t.classList.contains('txcb')){
        var field=t.getAttribute('data-field');
        var g=crmGuests.find(function(x){return x.id&&String(x.id)===id});
        if(g)g[field]=t.checked;
        var u={};u[field]=t.checked;
        if(SG.enabled&&id)SG.updateGuest(id,u).catch(function(){});
      }
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
    $('add-btn').addEventListener('click',function(){
      var btn=this;
      var name=$('add-name').value.trim();
      if(!name)return;
      var g={name:name,party:null,phone:$('add-phone').value.trim()||null,status:$('add-status').value};
      var done=function(saved){
        crmBody.appendChild(guestRow(saved));
        $('add-name').value='';
        $('add-phone').value='';
        crmStats();
        crmGuests.push(saved);
        renderChips();
      };
      if(SG.enabled){
        busy(btn,true,'Adding…');
        SG.addGuest(g).then(done).catch(function(){}).then(function(){busy(btn,false)});
        return;
      }
      done(g);
    });
    var parseCsv=function(text){
      var rows=[],row=[],cur='',q=false;
      for(var i=0;i<text.length;i++){
        var c=text[i];
        if(q){
          if(c==='"'){if(text[i+1]==='"'){cur+='"';i++}else q=false}
          else cur+=c;
        }else if(c==='"')q=true;
        else if(c===','){row.push(cur);cur=''}
        else if(c==='\n'||c==='\r'){
          if(c==='\r'&&text[i+1]==='\n')i++;
          row.push(cur);rows.push(row);row=[];cur='';
        }else cur+=c;
      }
      if(cur!==''||row.length){row.push(cur);rows.push(row)}
      return rows.filter(function(r){return r.some(function(x){return x.trim()!==''})});
    };
    var csvStatus=function(v){
      v=(v||'').toLowerCase();
      if(/yes|coming|accept/.test(v))return 'coming';
      if(/no\b|regret|declin|can.t/.test(v))return 'regret';
      return 'await';
    };
    if($('csv-file')){
      $('csv-file').addEventListener('change',function(){
        var file=this.files[0];
        var input=this;
        if(!file)return;
        var note=$('csv-note');
        var reader=new FileReader();
        reader.onload=function(){
          var rows=parseCsv(String(reader.result));
          if(!rows.length){note.textContent='hmm, that file looks empty';return}
          var head=rows[0].map(function(h){return h.toLowerCase().trim()});
          var idx={name:-1,phone:-1,party:-1,status:-1};
          head.forEach(function(h,i){
            if(idx.name<0&&/name|guest/.test(h))idx.name=i;
            else if(idx.phone<0&&/phone|cell|mobile|number|text/.test(h))idx.phone=i;
            else if(idx.party<0&&/party|count|size|people|many/.test(h))idx.party=i;
            else if(idx.status<0&&/status|coming|rsvp|reply/.test(h))idx.status=i;
          });
          var hasHeader=idx.name>-1||idx.phone>-1;
          if(!hasHeader){idx.name=0;idx.phone=1;idx.party=2;idx.status=3}
          var data=hasHeader?rows.slice(1):rows;
          var pick=function(r,i){return i>-1&&r[i]?String(r[i]).trim():''};
          var guests=data.map(function(r){
            return {
              name:pick(r,idx.name),
              phone:pick(r,idx.phone)||null,
              party:null,
              status:csvStatus(pick(r,idx.status))
            };
          }).filter(function(g){return g.name});
          if(!guests.length){note.textContent='no guest names found in that file — is there a name column?';return}
          if(!SG.enabled){note.textContent='connect the backend first (assets/config.js)';return}
          var doneCount=0,failCount=0;
          var next=function(i){
            if(i>=guests.length){
              note.textContent='imported '+doneCount+' guest'+(doneCount===1?'':'s')+(failCount?' ('+failCount+' didn’t save — try those again)':'')+' 🌼';
              input.value='';
              loadCrm();
              return;
            }
            note.textContent='importing '+(i+1)+' of '+guests.length+'…';
            SG.addGuest(guests[i]).then(function(){doneCount++}).catch(function(){failCount++}).then(function(){next(i+1)});
          };
          next(0);
        };
        reader.readAsText(file);
      });
    }
  }

  // --- the games: baby care quiz ------------------------------------------------
  if($('cq-questions')){
    var CARE_Q=[
      {q:'How many hours a day does a brand-new baby sleep (in bits and pieces)?',opts:['About 8','14 to 17','A solid 12, all night'],ans:1},
      {q:'The safest way to lay a baby down to sleep is…',opts:['On his back','On his tummy','On his side'],ans:0},
      {q:'How many diapers will he go through in his first month?',opts:['Around 100','Around 200','Around 300'],ans:2},
      {q:'The umbilical cord stump usually falls off after…',opts:['2 or 3 days','1 to 3 weeks','2 months'],ans:1},
      {q:'Baby bathwater should be right about…',opts:['90 degrees','100 degrees','110 degrees'],ans:1},
      {q:'On day one, a newborn’s tummy is the size of…',opts:['A cherry','An orange','A cantaloupe'],ans:0},
      {q:'That first true smile usually arrives around…',opts:['Day 3','6 to 8 weeks','6 months'],ans:1},
      {q:'Which of these can newborns NOT do at first?',opts:['Sneeze','Hiccup','Cry real tears'],ans:2}
    ];
    var cqPicks=CARE_Q.map(function(){return -1});
    var cqRevealed=CARE_Q.map(function(){return false});
    var cqEntries=SG.enabled?[]:[
      {name:'Margaret E.',answers:[1,0,2,0,1,0,1,2]},
      {name:'Ruth',answers:[1,0,0,1,1,0,1,1]},
      {name:'Aunt Susan',answers:[0,0,2,1,1,1,1,2]}
    ];
    var cqRows=[],cqRevBtns=[];
    CARE_Q.forEach(function(item,qi){
      var card=document.createElement('div');
      card.className='quiz-q';
      var h=document.createElement('h4');
      h.textContent=(qi+1)+'. '+item.q;
      card.appendChild(h);
      var row=document.createElement('div');
      row.className='q-btns cq-btns';
      item.opts.forEach(function(opt,oi){
        var b=document.createElement('button');
        b.type='button';b.className='q-btn';b.textContent=opt;
        b.addEventListener('click',function(){
          if($('cq-submit').disabled)return;
          cqPicks[qi]=oi;
          row.querySelectorAll('.q-btn').forEach(function(o){o.classList.remove('voted')});
          b.classList.add('voted');
        });
        row.appendChild(b);
      });
      card.appendChild(row);
      var rev=document.createElement('button');
      rev.type='button';rev.className='reveal';rev.textContent='Host: reveal the answer';
      rev.addEventListener('click',function(){
        cqRevealed[qi]=true;
        row.children[item.ans].classList.add('correct');
        this.style.display='none';
        // broadcast the reveal (as quiz_votes rows 100+) so every phone and
        // the big-screen leaderboard see it within seconds
        if(SG.enabled)SG.voteQuiz(100+qi,'a').catch(function(){});
        cqRefresh();
      });
      card.appendChild(document.createElement('div')).appendChild(rev);
      cqRows[qi]=row;cqRevBtns[qi]=rev;
      $('cq-questions').appendChild(card);
    });
    var cqBoard=function(){
      var shown=cqRevealed.filter(Boolean).length;
      $('cq-progress').textContent=shown
        ?shown+' of '+CARE_Q.length+' answers revealed'
        :'no answers revealed yet. Scores appear as the host reveals them';
      var scored=cqEntries.map(function(e){
        var s=0;
        CARE_Q.forEach(function(item,qi){
          if(cqRevealed[qi]&&e.answers[qi]===item.ans)s++;
        });
        return {name:e.name,score:s};
      }).sort(function(a,b){return b.score-a.score||a.name.localeCompare(b.name)});
      var ol=$('cq-board');
      ol.innerHTML='';
      scored.forEach(function(e,i){
        var li=document.createElement('li');
        if(i===0&&shown&&e.score>0)li.className='lead';
        var nm=document.createElement('span');nm.className='b-name';nm.textContent=e.name;
        var sc=document.createElement('span');sc.className='b-score';
        sc.textContent=e.score+' right'+(i===0&&shown&&e.score>0?' · in the lead':'');
        li.appendChild(nm);li.appendChild(sc);
        ol.appendChild(li);
      });
      if(!scored.length){
        var li=document.createElement('li');
        li.className='b-empty';
        li.textContent='no players yet. Be the first to lock in';
        ol.appendChild(li);
      }
    };
    var cqRefresh=function(){
      if(SG.enabled){
        Promise.all([
          SG.listCareQuiz().catch(function(){return null}),
          SG.quizTallies().catch(function(){return null})
        ]).then(function(res){
          if(res[0])cqEntries=res[0].map(function(r){return {name:r.name,answers:r.answers}});
          if(res[1])Object.keys(res[1]).forEach(function(k){
            var qi=parseInt(k,10)-100;
            if(qi>=0&&qi<CARE_Q.length&&!cqRevealed[qi]){
              cqRevealed[qi]=true;
              cqRows[qi].children[CARE_Q[qi].ans].classList.add('correct');
              cqRevBtns[qi].style.display='none';
            }
          });
          cqBoard();
        });
      }else{cqBoard()}
    };
    $('cq-submit').addEventListener('click',function(){
      var btn=this;
      var name=$('cq-name').value.trim();
      if(!name){$('cq-name').focus();return}
      if(cqPicks.indexOf(-1)!==-1){
        $('cq-confirm').textContent='answer all eight first, no half experts';
        $('cq-confirm').classList.add('show');
        return;
      }
      var finish=function(){
        cqEntries.push({name:name,answers:cqPicks.slice()});
        btn.disabled=true;
        btn.textContent='Answers locked';
        $('cq-confirm').textContent='locked. Now watch the reveals';
        $('cq-confirm').classList.add('show');
        cqBoard();
      };
      if(SG.enabled){
        busy(btn,true,'Locking…');
        SG.submitCareQuiz(name,cqPicks.slice()).then(function(){busy(btn,false);finish()})
          .catch(function(){busy(btn,false);oops($('cq-confirm'))});
        return;
      }
      finish();
    });
    cqRefresh();
    if(SG.enabled)setInterval(cqRefresh,8000);
  }

  // --- the games: whose baby face? ------------------------------------------------
  if($('fm-grid')){
    var fmFaces=[];
    var fmScores=SG.enabled?[]:[{name:'Ruth',score:1,total:2},{name:'Kate M.',score:2,total:2}];
    var fmTime=function(s){
      if(!s.created_at)return'';
      try{return new Date(s.created_at).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})}catch(e){return''}
    };
    var fmBoard=function(){
      var best={};
      fmScores.forEach(function(s){
        // rows arrive oldest-first, so a strict > keeps each person's
        // earliest submission of their top score — the tie-break instant
        if(!(s.name in best)||s.score>best[s.name].score)best[s.name]=s;
      });
      var rows=Object.keys(best).map(function(k){return best[k]})
        .sort(function(a,b){return b.score-a.score||new Date(a.created_at)-new Date(b.created_at)});
      var ol=$('fm-board');
      ol.innerHTML='';
      var topScore=rows.length?rows[0].score:null;
      rows.forEach(function(s,i){
        var li=document.createElement('li');
        if(i===0)li.className='lead';
        var nm=document.createElement('span');nm.className='b-name';nm.textContent=s.name;
        var sc=document.createElement('span');sc.className='b-score';
        var tied=s.score===topScore;
        var time=fmTime(s);
        sc.textContent=s.score+' of '+s.total
          +(i===0?' · in the lead':'')
          +(tied&&time?' · '+time:'');
        li.appendChild(nm);li.appendChild(sc);
        ol.appendChild(li);
      });
      if(!rows.length){
        var li=document.createElement('li');
        li.className='b-empty';
        li.textContent='no matches locked in yet';
        ol.appendChild(li);
      }
    };
    var fmShuffle=function(arr){
      var a=arr.slice();
      for(var i=a.length-1;i>0;i--){
        var j=Math.floor(Math.random()*(i+1));
        var tmp=a[i];a[i]=a[j];a[j]=tmp;
      }
      return a;
    };
    var fmBuild=function(){
      var grid=$('fm-grid');
      grid.innerHTML='';
      // matching by face needs both photos; a guest with only one can't play
      var playable=fmFaces.filter(function(f){return f.baby_url&&f.now_url});
      if(!playable.length){
        var p=document.createElement('p');
        p.className='fm-empty';
        p.textContent='No baby faces yet. They arrive as guests RSVP with both photos.';
        grid.appendChild(p);
        return;
      }
      // once a grown-up is picked anywhere, gray them out everywhere else
      // so no two babies get matched to the same guest by mistake
      var fmOptsByName=function(name){
        return Array.from(grid.querySelectorAll('.fm-opt')).filter(function(b){return b.getAttribute('data-name')===name});
      };
      var fmSetUsed=function(name,ownerCard){
        fmOptsByName(name).forEach(function(b){
          var mine=b.closest('.fm-card')===ownerCard;
          b.classList.toggle('used',!!ownerCard&&!mine);
          b.disabled=!!ownerCard&&!mine;
        });
      };
      fmShuffle(playable).forEach(function(f){
        var card=document.createElement('div');
        card.className='fm-card';
        card.setAttribute('data-name',f.name);
        var baby=document.createElement('div');
        baby.className='fm-baby';
        var bim=document.createElement('img');
        bim.src=f.baby_url;bim.alt='a mystery baby';
        baby.appendChild(bim);
        card.appendChild(baby);
        var prompt=document.createElement('p');
        prompt.className='fm-prompt';
        prompt.textContent='Tap their grown-up face →';
        card.appendChild(prompt);
        var strip=document.createElement('div');
        strip.className='fm-strip';
        fmShuffle(playable).forEach(function(opt){
          var btn=document.createElement('button');
          btn.type='button';
          btn.className='fm-opt';
          btn.setAttribute('data-name',opt.name);
          var oim=document.createElement('img');
          oim.src=opt.now_url;oim.alt='';
          btn.appendChild(oim);
          var cap=document.createElement('span');
          cap.className='fm-opt-name';
          cap.textContent=opt.name;
          btn.appendChild(cap);
          btn.addEventListener('click',function(){
            if(btn.disabled)return;
            var prevPicked=card.getAttribute('data-picked');
            if(prevPicked)fmSetUsed(prevPicked,null);
            strip.querySelectorAll('.fm-opt').forEach(function(b){b.classList.remove('picked')});
            btn.classList.add('picked');
            card.setAttribute('data-picked',opt.name);
            fmSetUsed(opt.name,card);
          });
          strip.appendChild(btn);
        });
        card.appendChild(strip);
        grid.appendChild(card);
      });
    };
    var fmRefreshScores=function(){
      if(SG.enabled){
        SG.listFaceScores().then(function(rows){fmScores=rows;fmBoard()}).catch(function(){fmBoard()});
      }else{fmBoard()}
    };
    var fmDoUnlock=function(){
      $('fm-lock').style.display='none';
      $('fm-game').classList.add('open');
      if(SG.enabled){
        SG.listFaces().then(function(rows){
          fmFaces=rows.filter(function(r){return !/claude diagnostic|please ignore|\(test\)/i.test(r.name||'')});
          fmBuild();
        }).catch(function(){fmBuild()});
      }else{
        fmFaces=[
          {name:'Abby',baby_url:'assets/photos/baby-abby.jpg',now_url:null},
          {name:'Beau',baby_url:'assets/photos/baby-beau.jpg',now_url:null}
        ];
        fmBuild();
      }
      fmRefreshScores();
      if(SG.enabled)setInterval(fmRefreshScores,8000);
    };
    if(pwFree()){
      fmDoUnlock();
    }else{
      $('fm-unlock').addEventListener('click',function(){
        if($('fm-pw').value.trim().toLowerCase()==='karm0451'){
          fmDoUnlock();
        }else{
          $('fm-wrong').classList.add('show');
        }
      });
    }
    $('fm-submit').addEventListener('click',function(){
      var btn=this;
      var name=$('fm-name').value.trim();
      if(!name){$('fm-name').focus();return}
      var cards=Array.from(document.querySelectorAll('.fm-card'));
      if(!cards.length)return;
      if(cards.some(function(c){return !c.getAttribute('data-picked')})){
        $('fm-result').textContent='tap a face for every baby first';
        $('fm-result').classList.add('show');
        return;
      }
      var score=0;
      cards.forEach(function(c){
        if(c.getAttribute('data-picked')===c.getAttribute('data-name'))score++;
      });
      var finish=function(){
        fmScores.push({name:name,score:score,total:cards.length});
        $('fm-result').textContent='you matched '+score+' of '+cards.length+(score===cards.length?'. A perfect eye!':'');
        $('fm-result').classList.add('show');
        btn.disabled=true;
        btn.textContent='Matches locked';
        fmBoard();
      };
      if(SG.enabled){
        busy(btn,true,'Scoring…');
        SG.submitFaceScore(name,score,cards.length).then(function(){busy(btn,false);finish()})
          .catch(function(){busy(btn,false);oops($('fm-result'))});
        return;
      }
      finish();
    });
  }

  // --- the games: the dressing derby ------------------------------------------------
  if($('dd-board')){
    var ddFmt=function(sec){
      var m=Math.floor(sec/60);
      var s=(sec-m*60).toFixed(1);
      return m+':'+(s<10?'0':'')+s;
    };
    var ddParse=function(text){
      text=text.trim();
      var m=text.match(/^(\d+):(\d{1,2}(?:\.\d+)?)$/);
      if(m)return parseInt(m[1],10)*60+parseFloat(m[2]);
      var n=parseFloat(text);
      return isNaN(n)?null:n;
    };
    var ddTimes=SG.enabled?[]:[
      {name:'Margaret E.',seconds:61.8,attempt:1},
      {name:'Ruth',seconds:88.4,attempt:1},
      {name:'Ruth',seconds:73.2,attempt:2},
      {name:'Kate M.',seconds:95.7,attempt:1}
    ];
    var ddBoard=function(){
      var by={};
      ddTimes.forEach(function(t){
        var k=t.name.toLowerCase();
        if(!(k in by))by[k]={name:t.name,best:t.seconds,tries:0};
        by[k].tries++;
        if(t.seconds<by[k].best)by[k].best=t.seconds;
      });
      var rows=Object.keys(by).map(function(k){return by[k]})
        .sort(function(a,b){return a.best-b.best});
      var ol=$('dd-board');
      ol.innerHTML='';
      rows.forEach(function(r,i){
        var li=document.createElement('li');
        if(i===0)li.className='lead';
        var nm=document.createElement('span');nm.className='b-name';nm.textContent=r.name;
        var sc=document.createElement('span');sc.className='b-score';
        sc.textContent=ddFmt(r.best)+' · '+(r.tries===1?'first try':'best of '+r.tries+' tries')+(i===0?' · in the lead':'');
        li.appendChild(nm);li.appendChild(sc);
        ol.appendChild(li);
      });
      if(!rows.length){
        var li=document.createElement('li');
        li.className='b-empty';
        li.textContent='the doll waits, undefeated';
        ol.appendChild(li);
      }
    };
    var ddRefresh=function(){
      if(SG.enabled){
        SG.listDollTimes().then(function(rows){ddTimes=rows;ddBoard()}).catch(function(){ddBoard()});
      }else{ddBoard()}
    };
    var running=false,t0=0,timer=null;
    $('dd-start').addEventListener('click',function(){
      if(!running){
        running=true;t0=Date.now();
        this.textContent='Stop. Last snap snapped!';
        timer=setInterval(function(){
          $('dd-clock').textContent=ddFmt((Date.now()-t0)/1000);
        },100);
      }else{
        running=false;
        clearInterval(timer);
        var sec=(Date.now()-t0)/1000;
        $('dd-clock').textContent=ddFmt(sec);
        $('dd-time').value=ddFmt(sec);
        this.textContent='Start the clock';
      }
    });
    $('dd-log-btn').addEventListener('click',function(){
      var btn=this;
      var name=$('dd-name').value.trim();
      var sec=ddParse($('dd-time').value);
      if(!name){$('dd-name').focus();return}
      if(sec===null||sec<=0){$('dd-time').focus();return}
      var attempt=ddTimes.filter(function(t){return t.name.toLowerCase()===name.toLowerCase()}).length+1;
      var finish=function(){
        ddTimes.push({name:name,seconds:sec,attempt:attempt});
        $('dd-time').value='';
        $('dd-confirm').textContent='logged. Attempt '+attempt+' for '+name;
        $('dd-confirm').classList.add('show');
        ddBoard();
      };
      if(SG.enabled){
        busy(btn,true,'Logging…');
        SG.addDollTime(name,sec,attempt).then(function(){busy(btn,false);finish()})
          .catch(function(){busy(btn,false);oops($('dd-confirm'))});
        return;
      }
      finish();
    });
    ddRefresh();
    if(SG.enabled)setInterval(ddRefresh,8000);
  }

  // --- growing: week-by-week tracker -------------------------------------------
  if($('veg-icon')){
    function wcf(id,seed){return '<defs><filter id="'+id+'" x="-30%" y="-30%" width="160%" height="160%"><feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="3" seed="'+seed+'" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="9"/></filter></defs>'}
    function icoRound(fill,seed,stem){
      var id='fwr'+seed;
      return '<svg width="96" height="96" viewBox="0 0 96 96">'+wcf(id,seed)
        +'<circle cx="48" cy="54" r="30" fill="'+fill+'" opacity=".6" filter="url(#'+id+')"/>'
        +'<circle cx="42" cy="47" r="16" fill="#FFFDF6" opacity=".35" filter="url(#'+id+')"/>'
        +'<circle cx="48" cy="54" r="29" fill="none" stroke="#22304A" stroke-width="1.2"/>'
        +(stem?'<path d="M48 24 V14 M48 14 C43 8 36 10 39 16" fill="none" stroke="#3E5232" stroke-width="1.4"/>':'')
        +'</svg>';
    }
    var ICONS={
      banana:'<svg width="96" height="96" viewBox="0 0 96 96">'+wcf('fwba',4)+'<path d="M22 34 C22 62 44 78 70 72 C74 78 70 84 60 84 C32 84 12 60 16 32 Z" fill="#E9C46A" opacity=".65" filter="url(#fwba)"/><path d="M28 40 C32 58 46 70 62 72 C46 76 26 60 24 38 Z" fill="#B98F2E" opacity=".3" filter="url(#fwba)"/><path d="M22 35 C24 60 44 77 69 72 M69 72 C73 78 69 83 60 83 C34 83 14 60 17 35" fill="none" stroke="#22304A" stroke-width="1.2" stroke-linecap="round"/><path d="M20 30 l-3 -4 M24 30 l-2 -5" stroke="#22304A" stroke-width="1" stroke-linecap="round"/></svg>',
      carrot:'<svg width="96" height="96" viewBox="0 0 96 96">'+wcf('fwca',5)+'<path d="M40 30 L64 54 L28 78 Q22 60 40 30 Z" fill="#C77E4A" opacity=".6" filter="url(#fwca)"/><path d="M42 38 L58 52 L34 70 Q31 58 42 38 Z" fill="#A05C36" opacity=".3" filter="url(#fwca)"/><ellipse cx="52" cy="18" rx="7" ry="5" fill="#98A68B" opacity=".5" filter="url(#fwca)" transform="rotate(-30 52 18)"/><ellipse cx="64" cy="24" rx="7" ry="5" fill="#98A68B" opacity=".5" filter="url(#fwca)" transform="rotate(20 64 24)"/><path d="M41 31 L63 53 L29 77 Q23 60 41 31 Z" fill="none" stroke="#22304A" stroke-width="1.1" stroke-linecap="round"/><path d="M44 40 q4 2 6 5 M38 50 q4 2 6 5 M33 61 q4 2 6 5" fill="none" stroke="#22304A" stroke-width=".8"/><path d="M46 27 q-2 -10 5 -14 M52 30 q4 -10 13 -11 M56 36 q9 -7 17 -4" fill="none" stroke="#3E5232" stroke-width="1.2"/></svg>',
      corn:'<svg width="96" height="96" viewBox="0 0 96 96">'+wcf('fwco',6)+'<ellipse cx="48" cy="54" rx="16" ry="32" fill="#E9C46A" opacity=".65" filter="url(#fwco)"/><ellipse cx="52" cy="58" rx="10" ry="24" fill="#B98F2E" opacity=".25" filter="url(#fwco)"/><path d="M36 78 C28 70 26 52 32 38 C22 50 22 70 30 82 Z" fill="#98A68B" opacity=".55" filter="url(#fwco)"/><path d="M60 78 C68 70 70 52 64 38 C74 50 74 70 66 82 Z" fill="#98A68B" opacity=".55" filter="url(#fwco)"/><ellipse cx="48" cy="54" rx="15" ry="31" fill="none" stroke="#22304A" stroke-width="1.1"/><path d="M41 32 V76 M48 26 V80 M55 32 V76 M35 46 H61 M34 58 H62 M37 68 H59" stroke="#22304A" stroke-width=".7" fill="none"/><path d="M35 77 C28 68 26 52 31 39 M61 77 C68 68 70 52 65 39" fill="none" stroke="#3E5232" stroke-width="1"/></svg>',
      leafy:'<svg width="96" height="96" viewBox="0 0 96 96">'+wcf('fwle',7)+'<circle cx="48" cy="54" r="28" fill="#98A68B" opacity=".6" filter="url(#fwle)"/><path d="M26 50 C30 36 40 28 48 26 C40 40 38 52 40 66 Z" fill="#5C7046" opacity=".35" filter="url(#fwle)"/><path d="M70 50 C66 36 56 28 48 26 C56 40 58 52 56 66 Z" fill="#5C7046" opacity=".35" filter="url(#fwle)"/><circle cx="42" cy="46" r="12" fill="#FFFDF6" opacity=".3" filter="url(#fwle)"/><circle cx="48" cy="54" r="27" fill="none" stroke="#22304A" stroke-width="1.1"/><path d="M48 28 C37 36 33 48 37 62 M48 28 C59 36 63 48 59 62 M48 30 V78" fill="none" stroke="#22304A" stroke-width=".9"/></svg>',
      eggplant:'<svg width="96" height="96" viewBox="0 0 96 96">'+wcf('fweg',8)+'<path d="M60 30 C74 40 76 62 62 74 C46 86 28 76 28 60 C28 46 42 34 54 32 Z" fill="#4A4466" opacity=".6" filter="url(#fweg)"/><path d="M58 38 C68 46 70 60 60 70 C50 78 38 72 36 62 Z" fill="#2E2A44" opacity=".3" filter="url(#fweg)"/><path d="M59 31 C73 41 75 61 61 73 C46 84 29 75 29 60 C29 47 43 35 55 33" fill="none" stroke="#22304A" stroke-width="1.1" stroke-linecap="round"/><ellipse cx="60" cy="24" rx="8" ry="5" fill="#98A68B" opacity=".5" filter="url(#fweg)"/><path d="M56 30 q0 -11 10 -13 M52 33 q-9 -6 -8 -13" fill="none" stroke="#3E5232" stroke-width="1.3"/></svg>',
      squash:'<svg width="96" height="96" viewBox="0 0 96 96">'+wcf('fwsq',9)+'<path d="M42 22 C54 22 50 38 54 46 C64 50 70 58 70 66 C70 78 58 84 46 84 C32 84 24 74 26 62 C28 52 36 48 40 44 C42 36 34 22 42 22 Z" fill="#C9A87C" opacity=".65" filter="url(#fwsq)"/><path d="M50 52 C60 56 64 62 64 68 C64 76 56 80 48 80 C38 80 32 72 34 64 Z" fill="#8A6B42" opacity=".3" filter="url(#fwsq)"/><path d="M42 23 C53 23 49 38 53 46 C63 50 69 58 69 66 C69 77 58 83 46 83 C33 83 25 73 27 62 C29 52 37 48 41 44 C43 36 35 23 42 23 Z" fill="none" stroke="#22304A" stroke-width="1.1" stroke-linecap="round"/><path d="M44 30 q1 8 3 14 M48 52 q6 4 8 12" fill="none" stroke="#22304A" stroke-width=".7"/></svg>',
      melon:'<svg width="96" height="96" viewBox="0 0 96 96">'+wcf('fwme',10)+'<circle cx="48" cy="54" r="30" fill="#98A68B" opacity=".6" filter="url(#fwme)"/><circle cx="42" cy="46" r="14" fill="#FFFDF6" opacity=".3" filter="url(#fwme)"/><circle cx="56" cy="62" r="16" fill="#5C7046" opacity=".25" filter="url(#fwme)"/><circle cx="48" cy="54" r="29" fill="none" stroke="#22304A" stroke-width="1.1"/><path d="M48 26 C38 39 38 70 48 82 M48 26 C58 39 58 70 48 82 M29 40 C41 47 55 47 67 40 M27 66 C41 60 55 60 69 66" fill="none" stroke="#22304A" stroke-width=".8"/></svg>',
      pumpkin:'<svg width="96" height="96" viewBox="0 0 96 96">'+wcf('fwpu',11)+'<ellipse cx="48" cy="58" rx="32" ry="26" fill="#C77E4A" opacity=".65" filter="url(#fwpu)"/><ellipse cx="58" cy="62" rx="18" ry="20" fill="#A05C36" opacity=".3" filter="url(#fwpu)"/><ellipse cx="38" cy="50" rx="12" ry="12" fill="#FFFDF6" opacity=".25" filter="url(#fwpu)"/><ellipse cx="48" cy="58" rx="31" ry="25" fill="none" stroke="#22304A" stroke-width="1.1"/><ellipse cx="48" cy="58" rx="14" ry="25" fill="none" stroke="#22304A" stroke-width=".7"/><ellipse cx="48" cy="58" rx="23" ry="25" fill="none" stroke="#22304A" stroke-width=".7"/><path d="M48 32 C48 24 52 20 58 18" fill="none" stroke="#3E5232" stroke-width="2"/><ellipse cx="58" cy="19" rx="5" ry="3" fill="#98A68B" opacity=".5" filter="url(#fwpu)"/></svg>'
    };
    ICONS.grapefruit=icoRound('#E9C46A',12,false);
    ICONS.cabbage=icoRound('#98A68B',13,true);
    ICONS.coconut=icoRound('#8A6B42',14,false);

    var GROWTH={
      20:['a garden banana','banana','10 in','10 oz',['He can hear now, so the first read-alouds land.','Practicing swallows and little hiccups.']],
      21:['a fresh-pulled carrot','carrot','10½ in','12 oz',['Taste buds are working. He tastes what Abby eats.','Sleeping and waking in tiny cycles.']],
      22:['an ear of sweet corn','corn','11 in','15 oz',['Eyebrows and lashes are in.','His grip is already strong.']],
      23:['a garden grapefruit','grapefruit','11½ in','1.1 lb',['Movement rocks him. He can feel Abby dance.','Hearing sharpens; voices carry through.']],
      24:['a cantaloupe from the vine','melon','11¾ in','1.3 lb',['His face is fully formed.','Lungs are rehearsing breathing.']],
      25:['a head of cauliflower','leafy','13½ in','1.5 lb',['First hair is coming in.','He startles at loud noises now.']],
      26:['a head of garden lettuce','leafy','14 in','1.7 lb',['His eyes are opening this week.','He knows Beau’s and Abby’s voices. Read to him.']],
      27:['a glossy eggplant','eggplant','14½ in','1.9 lb',['He may know a favorite story’s rhythm already.','Regular sleep and wake times, often opposite Abby’s.']],
      28:['a butternut squash','squash','14¾ in','2.2 lb',['Eyes open, blinking, maybe even dreaming.','He turns toward light through the garden wall.']],
      29:['an acorn squash','squash','15¼ in','2.5 lb',['Muscles and lungs are bulking up.','Kicks strong enough for Beau to feel from across the couch.']],
      30:['a head of cabbage','cabbage','15¾ in','2.9 lb',['His brain is wrinkling beautifully and growing fast.','He holds his own feet for fun.']],
      31:['a coconut','coconut','16¼ in','3.3 lb',['All five senses are online.','He’s processing faces’ voices and sounds.']],
      32:['a bunch of kale','leafy','16¾ in','3.8 lb',['Practicing sucking his thumb.','Toenails in; hair thickening.']],
      33:['a pineapple','pumpkin','17¼ in','4.2 lb',['His pupils widen and narrow with light now.','Bones are hardening, except his clever soft skull.']],
      34:['a garden melon','melon','17¾ in','4.7 lb',['Cozy and waterproofed in vernix.','He can tell family voices apart.']],
      35:['a honeydew','melon','18¼ in','5.3 lb',['Kidneys and liver fully on the job.','Getting snug in there: more rolls than kicks.']],
      36:['a head of romaine','leafy','18¾ in','5.8 lb',['Likely head-down and getting ready.','Cheeks filling in, skin smoothing out.']],
      37:['a bunch of swiss chard','leafy','19 in','6.3 lb',['Officially early term, rehearsing everything.','Grip strong enough to hold a finger.']],
      38:['a winter squash','squash','19½ in','6.8 lb',['Brain adding connections by the million.','A firm little handshake is waiting.']],
      39:['a mini watermelon','melon','20 in','7.3 lb',['Lungs ready to announce himself.','Building fat to stay cozy in the world.']],
      40:['a little pumpkin','pumpkin','20¼ in','7.6 lb',['Ready for chapter one.','Any day now. The garden is waiting.']]
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
      $('g-week').textContent='Week '+viewWeek+' of 40'+(viewWeek===curWeek?' · this week':'');
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
      $('g-now-note').textContent='Baby Boy White is '+ga.week+' weeks, '+ga.day+(ga.day===1?' day':' days')+' along, with '+ga.toGo+' days until October 14th.';
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
