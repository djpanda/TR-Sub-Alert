class NerdLoader{constructor(){this.resources={}}async load(assets=[]){const scripts=[],images=[],sounds=[],videos=[],jsons=[];
    return assets.forEach(asset=>{"string"==typeof asset&&(asset={name:asset,url:asset}),asset.name||(asset.name=asset.url);
    const ext=((asset.url||"").match(/\.([^.]*?)(?=\?|#|$)/)||[])[1];/(js)$/.test(ext)?scripts.push(asset):/(jpe?g|gif|png|svg|webp)$/.test(ext)?images.push(asset):/(3gp|mpg|mpeg|mp4|m4v|m4p|ogv|ogg|mov|webm)$/.test(ext)?videos.push(asset):/(mp3)$/.test(ext)?sounds.push(asset):/(json)$/.test(ext)&&jsons.push(asset)}),await Promise.all(scripts.map(asset=>this.loadScript(asset))),window.gsap&&window.gsap.globalTimeline.getChildren().forEach(animation=>animation.kill()),await Promise.all([...sounds.map(asset=>this.loadSound(asset)),...videos.map(asset=>this.loadVideo(asset)),...images.map(asset=>this.loadImage(asset)),...jsons.map(asset=>this.loadJson(asset))]),this.resources}loadJson({name:name,url:url}){return new Promise(async(resolve,reject)=>{const cachedUrl=await this.checkCache(url),response=await fetch(cachedUrl),json=await response.json();
    this.resources[name]=json,resolve(json)})}loadImage({name:name,url:url}){return new Promise(async(resolve,reject)=>{const cachedUrl=await this.checkCache(url),imageElement=new Image;function fulfill(){imageElement.onload=null,imageElement.onerror=null,resolve(imageElement)}imageElement.crossOrigin="Anonymous",imageElement.src=cachedUrl,this.resources[name]=imageElement,imageElement.complete?resolve(imageElement):(imageElement.onload=fulfill,imageElement.onerror=fulfill)})}loadVideo({name:name,url:url,target:target}){return new Promise(async(resolve,reject)=>{const cachedUrl=await this.checkCache(url),mediaElement=document.querySelector(target)||document.createElement("video");
    function fulfill(){return mediaElement.oncanplaythrough=null,mediaElement.onerror=null,resolve(mediaElement)}mediaElement.muted=!0,mediaElement.crossOrigin="Anonymous",mediaElement.src=cachedUrl,this.resources[name]=mediaElement,mediaElement.readyState>3?resolve(mediaElement):(mediaElement.oncanplaythrough=fulfill,mediaElement.onerror=fulfill)})}loadScript({name:name,url:url}){return new Promise(async(resolve,reject)=>{const cachedUrl=await this.checkCache(url),scriptElements=Array.from(document.querySelectorAll("script"));
    let script=scriptElements.filter(scriptElement=>scriptElement.src===cachedUrl)[0];
    if(script)return fulfill();
    function fulfill(){return script.onload=null,script.onerror=null,resolve(script)}script=document.createElement("script"),document.head.appendChild(script),this.resources[name]=script,script.onerror=fulfill,script.onload=fulfill,script.src=cachedUrl})}loadSound({name:name,url:url}){return new Promise(async(resolve,reject)=>{const cachedUrl=await this.checkCache(url),sound=new Howl({src:cachedUrl,autoplay:!1,mute:!0,onloaderror:()=>resolve(sound),onload:()=>resolve(sound)});
    this.resources[name]=sound})}checkCache(url){return new Promise((resolve,reject)=>{console.log("*** Checking cache",url),fetch(url).then(()=>resolve(url)).catch(()=>{if(-1!==url.indexOf("nocache"))return reject(`Cache failed: ${String(url)}`);
    resolve(this.checkCache(`${url}?_nocache=${this.uniqueID()}`))})})}uniqueID(){return Date.now()+Math.random().toString(16).slice(2)}static async load(assets){return(new NerdLoader).load(assets)}}
    
    (async () => {
        
      const alertVolume = 50 * .01;
      const delayTime = 0;
          
      const resources = await NerdLoader.load([
        "https://ext-assets.streamlabs.com/users/140067/gsap-3-5-1.min.js",
        "https://ext-assets.streamlabs.com/users/140067/EasePack-3-5-1.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.7.1/lottie.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.0/howler.min.js",
        { name: "alertSound", url: "https://uploads.twitchalerts.com/000/533/735/358/mech-tech-alert-4a.mp3" },
        { name: "lottieData", url: "https://ext-assets.streamlabs.com/users/140067/mech-alert.json" }
      ]);
     
      const alertSound = resources.alertSound.mute(false).volume(alertVolume);
      
      const lottieAnimation = bodymovin.loadAnimation({
        wrapper: document.querySelector("#animationWindow"),
        animType: "svg",
        loop: false,
        prerender: true,
        autoplay: false,
        animationData: resources.lottieData
      });
      
      gsap.registerPlugin(RoughEase);
      
      const tl = gsap.timeline()
        .set("#alertHolder", {autoAlpha: 1})
        .add(() => alertSound.play())
        .add(() => lottieAnimation.play())
        .from("#iconHolder", {duration: .8, scale: 0, opacity: 0, delay: 1.4})
        .to("#topText", {duration: .5, opacity: 1, ease: "rough({strength: 3, points: 30, template: strong.inOut, taper: both, randomize: true})"}, "-=.2")
        .to("#botText", {duration: .5, opacity: 1, delay: 0.6, ease: "rough({strength: 3, points: 30, template: strong.inOut, taper: both, randomize: true})"})
        .from("#alert-user-message", {duration: .6, opacity: 0}, "-=.2")
        .to("#iconHolder", {duration: .1, opacity: 0}, 9.8)
        .to("#alertHolder", {delay: delayTime, duration: 1, opacity: 0, ease: "rough({strength: 3, points: 30, template: strong.inOut, taper: both, randomize: true})"})
      ;
    })();
    