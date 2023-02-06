let ayah =document.querySelector(".ayah") ;
let audioPlayer =document.querySelector(".audio-player") ;
let next =document.querySelector(".next") ;
let play =document.querySelector(".play") ;
let prev =document.querySelector(".backward") ;
let SurahsContainer = document.getElementsByTagName("main")[0];
getsurahs();
async function getsurahs(){
    const surahs = await fetch("https://quran-endpoint.vercel.app/quran");
    const response = await surahs.json();
    for(surah of response.data){
        SurahsContainer.innerHTML += `
        <div>
        <p> ${surah["asma"]["ar"]["long"]}</p>
        <p> ${surah["asma"]["en"]["long"]}</p>
        </div>
        `
    }
    let allsurahs = document.querySelectorAll("main div"),
    ayahsAudio,
    ayahsText;
    allsurahs.forEach((surah,index)=>{
        surah.addEventListener("click",()=>{
        fetch(`https://quran-endpoint.vercel.app/quran/${index+1}`)
        .then((response)=>{
            return response.json();
        })
        .then(data=>data.data.ayahs)
        .then((data=>{
            ayahsText=[];
            ayahsAudio=[];
            data.forEach((el)=>{
                ayahsText.push(el.text.ar);
                ayahsAudio.push(el.audio.url);
            });
            let Index =0 ;
            changeAyah(Index);
            audioPlayer.addEventListener("ended",()=>{
                Index++;
                if(Index<ayahsAudio.length){
                    changeAyah(Index);
                }
                else{
                    Index= 0 ;
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'surah has been ended',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    changeAyah(Index);
                    audioPlayer.pause();
                }
            })
            next.onclick=function(){
                if(Index<ayahsAudio.length-1){
                    Index++;
                    changeAyah(Index);
                }
            }
            prev.onclick=function(){
                if(Index>0){
                    Index--;
                    changeAyah(Index);
                }
            }
            let isplaying= false;
            togglePlay();
            function togglePlay(){
                if(isplaying){
                    audioPlayer.pause();
                    play.innerHTML=`<i class="fa-solid fa-play"></i>`;
                    isplaying=false;
                }
                else{
                    audioPlayer.play();
                    play.innerHTML=`<i class="fa-solid fa-pause"></i>`;
                    isplaying=true; 
                }
            }
            play.addEventListener("click",togglePlay)
            function changeAyah(index){
                audioPlayer.src=ayahsAudio[index];
                ayah.innerHTML=ayahsText[index];
            }
            
        }))

    })

    })
    
}
