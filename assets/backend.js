// The Story Garden — backend glue (Supabase).
// Loads only if assets/config.js has supabaseUrl + supabaseAnonKey filled in;
// otherwise SG.enabled is false and site.js falls back to demo behavior.
(function(){
  var cfg=window.STORY_GARDEN_CONFIG||{};
  var enabled=!!(cfg.supabaseUrl&&cfg.supabaseAnonKey);
  var clientP=null;

  function loadScript(src){
    return new Promise(function(res,rej){
      var s=document.createElement('script');
      s.src=src;s.onload=res;s.onerror=function(){rej(new Error('could not load '+src))};
      document.head.appendChild(s);
    });
  }
  function loadLib(){
    if(window.supabase)return Promise.resolve();
    return loadScript('assets/vendor/supabase.min.js').catch(function(){
      return loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js');
    });
  }
  function client(){
    if(!enabled)return Promise.reject(new Error('backend not configured'));
    if(!clientP){
      clientP=loadLib().then(function(){return window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey)});
      clientP.then(null,function(){clientP=null});
    }
    return clientP;
  }
  if(enabled)client().then(null,function(){});
  function insert(table,row){
    return client().then(function(sb){
      return sb.from(table).insert(row).then(function(r){
        if(r.error)throw r.error;
        return r.data;
      });
    });
  }
  function list(table,orderBy,asc){
    return client().then(function(sb){
      return sb.from(table).select('*').order(orderBy||'created_at',{ascending:asc!==false}).then(function(r){
        if(r.error)throw r.error;
        return r.data;
      });
    });
  }
  function uploadPhoto(file){
    return client().then(function(sb){
      var ext=(file.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'')||'jpg';
      var path=Date.now()+'-'+Math.random().toString(36).slice(2,8)+'.'+ext;
      return sb.storage.from('album').upload(path,file,{cacheControl:'3600'}).then(function(r){
        if(r.error)throw r.error;
        return sb.storage.from('album').getPublicUrl(path).data.publicUrl;
      });
    });
  }

  // --- host gate ---------------------------------------------------------
  // With Supabase: a real shared login (email in config, password chosen by
  // the hosts). Without: a SHA-256-checked password so the guest list isn't
  // one click away, remembered for the browser session.
  function sha256(text){
    if(!(window.crypto&&crypto.subtle))return Promise.reject(new Error('needs https or localhost'));
    return crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)).then(function(buf){
      return Array.from(new Uint8Array(buf)).map(function(b){return b.toString(16).padStart(2,'0')}).join('');
    });
  }
  function hostSignIn(password){
    if(enabled){
      return client().then(function(sb){
        return sb.auth.signInWithPassword({email:cfg.hostEmail,password:password}).then(function(r){
          if(r.error)throw r.error;
          return true;
        });
      });
    }
    return sha256(password.trim()).then(function(hex){
      if(hex!==cfg.hostPasswordHash)throw new Error('wrong password');
      sessionStorage.setItem('sg-host','1');
      return true;
    });
  }
  function hostSession(){
    if(enabled){
      return client().then(function(sb){
        return sb.auth.getSession().then(function(r){return !!(r.data&&r.data.session)});
      });
    }
    return Promise.resolve(sessionStorage.getItem('sg-host')==='1');
  }

  window.SG={
    enabled:enabled,
    hostSignIn:hostSignIn,
    hostSession:hostSession,

    submitRsvp:function(f){return insert('rsvps',f)},
    claimBook:function(name,title){return insert('book_claims',{guest_name:name,title:title})},
    listClaims:function(){return list('book_claims')},
    submitPrediction:function(f){return insert('predictions',f)},
    listPredictions:function(){return list('predictions')},

    signGuestbook:function(message,file){
      var p=file?uploadPhoto(file):Promise.resolve(null);
      return p.then(function(url){return insert('guestbook',{message:message,photo_url:url})});
    },
    listGuestbook:function(){return list('guestbook','created_at',false)},

    postAdvice:function(name,message){
      return client().then(function(sb){
        return sb.from('advice').insert({name:name,message:message}).select().single().then(function(r){
          if(r.error)throw r.error;
          return r.data;
        });
      });
    },
    listAdvice:function(){
      return client().then(function(sb){
        return sb.from('advice').select('*, advice_comments(*)').order('created_at',{ascending:false}).then(function(r){
          if(r.error)throw r.error;
          return r.data;
        });
      });
    },
    postComment:function(adviceId,message){return insert('advice_comments',{advice_id:adviceId,message:message})},

    voteQuiz:function(question,side){return insert('quiz_votes',{question:question,side:side})},
    quizTallies:function(){
      return client().then(function(sb){
        return sb.from('quiz_votes').select('question,side').then(function(r){
          if(r.error)throw r.error;
          var t={};
          r.data.forEach(function(v){
            t[v.question]=t[v.question]||{a:0,b:0};
            t[v.question][v.side]++;
          });
          return t;
        });
      });
    },

    addAlbumPhoto:function(file,caption,name){
      return uploadPhoto(file).then(function(url){
        var row={caption:caption,photo_url:url};
        if(name)row.name=name;
        return insert('album',row).catch(function(e){
          // the name column may not exist yet on an older album table;
          // retry without it so the photo still saves either way
          if(name&&e&&(e.code==='PGRST204'||/column/.test(e.message||''))){
            delete row.name;
            return insert('album',row);
          }
          throw e;
        });
      });
    },
    // the time capsule: words + photo + voice, readable only by the hosts
    addTimeCapsule:function(name,message,photoFile,audioFile){
      var pu=photoFile?uploadPhoto(photoFile):Promise.resolve(null);
      var au=audioFile?uploadPhoto(audioFile):Promise.resolve(null);
      return Promise.all([pu,au]).then(function(urls){
        return insert('future_messages',{name:name,message:message,photo_url:urls[0],audio_url:urls[1]});
      });
    },
    // the wall of contributors: names + photos only, never the sealed
    // message or the recording — reads from a safe public view
    listTimeCapsuleContributors:function(){return list('future_messages_public')},
    // the sealed capsule itself: rows only come back for a signed-in host
    listTimeCapsule:function(){return list('future_messages')},
    listAlbum:function(){return list('album')},

    // games
    addFace:function(name,babyFile,nowFile){
      return Promise.all([uploadPhoto(babyFile),uploadPhoto(nowFile)]).then(function(urls){
        return insert('faces',{name:name,baby_url:urls[0],now_url:urls[1]});
      });
    },
    // round-two face crops live in storage as crop2-<original>.jpg —
    // tight, centered, uniform face size. Swap them in wherever faces load.
    listFaces:function(){
      var RECROPPED={'1784075209778-tt5y8r.jpeg':1,'1784075209782-qx5xmf.jpeg':1,'1784138165860-wsxtj1.png':1,'1784138165861-6smd3e.png':1,'1784257616610-ye4v45.jpeg':1,'1784257616612-jp7wli.jpeg':1,'1784394863840-6jeopv.jpeg':1,'1784394863844-tunn7n.png':1,'1784401418659-9bbg34.jpeg':1,'1784401418661-fjn671.jpeg':1,'1784403394567-v70fjt.jpeg':1,'1784403394570-rl7xup.jpeg':1,'1784856255119-z69df0.jpeg':1,'1784856255125-siy33k.jpeg':1,'1785685021731-oqf63q.jpeg':1,'1785685021736-ttyn5v.jpeg':1,'1785818653523-itqoic.png':1,'1785818653527-olar7m.jpeg':1,'1785874682781-n4rd0s.jpg':1,'1785874682786-1kz5u4.jpg':1,'1785897645685-3krfnv.jpg':1,'1785897645697-mep2tg.jpg':1,'1785963657212-c99fb0.jpeg':1,'1785963657216-5r9i37.jpeg':1,'1786140877432-whk4pl.jpeg':1,'1786140877436-aimdlt.jpeg':1,'1786143292849-5vsafp.jpeg':1,'1786143292854-7gh7jj.jpeg':1,'1786209426794-uhpocl.jpeg':1,'1786209426797-3qfbiq.jpeg':1,'1786223111569-ul853u.png':1,'1786223111572-g7rzs8.png':1,'1786382296284-qfzrz8.jpeg':1,'1786382296294-xupb4t.jpeg':1,'1786393101227-ptglev.png':1,'1786393101229-ce5zqm.jpeg':1,'1786631845293-82f4aj.png':1,'1786631845295-gk7aeh.png':1,'1786663877729-vi5x0f.jpg':1,'1786663877735-ep910w.jpg':1};
      var recrop=function(u){
        if(!u)return u;
        var m=u.match(/\/album\/([^\/?]+)$/);
        if(!m||!RECROPPED[m[1]])return u;
        return u.replace(m[1],'crop2-'+m[1].replace(/\.[a-z]+$/i,'.jpg'));
      };
      return list('faces').then(function(rows){
        return rows.map(function(r){
          r.baby_url=recrop(r.baby_url);
          r.now_url=recrop(r.now_url);
          return r;
        });
      });
    },
    submitCareQuiz:function(name,answers){return insert('care_entries',{name:name,answers:answers})},
    listCareQuiz:function(){return list('care_entries')},
    submitFaceScore:function(name,score,total){return insert('face_scores',{name:name,score:score,total:total})},
    listFaceScores:function(){return list('face_scores')},
    addDollTime:function(name,seconds,attempt){return insert('doll_times',{name:name,seconds:seconds,attempt:attempt})},
    listDollTimes:function(){return list('doll_times')},

    listGuests:function(){return list('guests','created_at')},
    addGuest:function(g){
      return client().then(function(sb){
        return sb.from('guests').insert(g).select().single().then(function(r){
          if(r.error)throw r.error;
          return r.data;
        });
      });
    },
    deleteGuest:function(id){
      return client().then(function(sb){
        return sb.from('guests').delete().eq('id',id).then(function(r){
          if(r.error)throw r.error;
          return true;
        });
      });
    },
    updateGuest:function(id,fields){
      return client().then(function(sb){
        return sb.from('guests').update(fields).eq('id',id).then(function(r){
          if(r.error)throw r.error;
        });
      });
    },
    listRsvps:function(){return list('rsvps','created_at',false)}
  };
})();
