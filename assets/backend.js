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
  function client(){
    if(!enabled)return Promise.reject(new Error('backend not configured'));
    if(!clientP){
      clientP=loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js')
        .then(function(){return window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey)});
    }
    return clientP;
  }
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

    addAlbumPhoto:function(file,caption){
      return uploadPhoto(file).then(function(url){return insert('album',{caption:caption,photo_url:url})});
    },
    listAlbum:function(){return list('album')},

    listGuests:function(){return list('guests','created_at')},
    addGuest:function(g){
      return client().then(function(sb){
        return sb.from('guests').insert(g).select().single().then(function(r){
          if(r.error)throw r.error;
          return r.data;
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
