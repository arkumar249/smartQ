const userId="";
async function fetchTokens(){
    const res=await fetch(`/api/tokens/${userId}`);
    console.log(res); 
}