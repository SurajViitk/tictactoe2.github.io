// HTML Elements
const statusDiv = document.querySelector('.status');
const resetDiv = document.querySelector('.reset');
const cellDivs = document.querySelectorAll('.game-cell');
const playerCoinDivs = document.querySelectorAll('.player-cell img');


// game variables
let gameIsLive = true;
let currentRed = true;
let currentSelectedIn = null;
let playedCoins=[];

class Coin{
    constructor(color,size){
        this.color = color;
        this.size = size;
    }
};

//initialize game state
var gameState = [];
for(let i=0; i<3 ;i++){
    gameState[i] = new Array(null,null,null);
}

var getMaxColorAndSize=(i,j)=>{
    if(!gameState[i][j]){
        return [null,null];
    }
    else{
        maxSize=-1;
        maxCol = null;
        for(c of gameState[i][j]){
            if(c.size > maxSize){
                maxSize = c.size;
                maxCol = c.color;
            }
        }
        return new Coin(maxCol,maxSize);
    }
}



const renderGrid=()=>{
    for(i=0;i<3;i++){
        for(j=0;j<3;j++){
            if(gameState[i][j]){
                // cellDivs[i*3+j].classList.add(gameState[i][j]);
                cellDivs[i*3+j].innerHTML='';
                var elem = document.createElement("img");
                elem.src = "asset/"+getMaxColorAndSize(i,j).color+"Circle.png";
                let sizeInP = null;
                switch(getMaxColorAndSize(i,j).size){
                    case 0: sizeInP="40%";break;
                    case 1: sizeInP="70%";break;
                    case 2: sizeInP="90%";break;
                }
                elem.setAttribute("height", sizeInP);
                elem.setAttribute("width", sizeInP);
                cellDivs[i*3+j].appendChild(elem);
            }
            else{ 
                cellDivs[i*3+j].classList.remove('won');
                cellDivs[i*3+j].innerHTML='';
            }  
        }
    }
} 

const checkSame = (i1,i2,j1,j2,k1,k2) => {
    return (gameState[i1][i2] && gameState[j1][j2] && gameState[k1][k2] && getMaxColorAndSize(i1,i2).color==getMaxColorAndSize(j1,j2).color && getMaxColorAndSize(i1,i2).color==getMaxColorAndSize(k1,k2).color);
}

const checkTied = () => {
    //Either all coins are gone, Or if the board is full, then maximum size of the coin on board whould be smaller than what is left
    if(playedCoins.size === 12)
        return true;
    for(i=0;i<3;i++)
        for(j=0;j<3 ;j++)
            if(!gameState[i][j])
                return false;
    // min size in coins on board
    minSizeInPlayedCoins = 3;
    for(i=0;i<3;i++){
        for(j=0;j<3;j++){
            if(minSizeInPlayedCoins>getMaxColorAndSize(i,j).size){
                minSizeInPlayedCoins=getMaxColorAndSize(i,j).size;
            }
        }
    }
    
    //max in remain coins
    remainingCoins = []
    for(let i=0; i<12 ; i++){
        if(!playedCoins.includes(i)){
            remainingCoins.push(i);
        }
    }
    maxSizeInRemainingCoins = -1;
    for(i in remainingCoins){
        if(maxSizeInRemainingCoins<i%3){
            maxSizeInRemainingCoins=i%3;
        }
    }
    if(maxSizeInRemainingCoins>minSizeInPlayedCoins)
        return false;
    return true;
}

const handleWin = () =>{
    gameIsLive = false;
    //remove all coins
    for(i=0;i<12;i++)
        if(playerCoinDivs[i].parentElement)
            playerCoinDivs[i].parentElement.innerHTML='';
    if(currentRed)
        statusDiv.innerHTML = 'Red has won!';
    else
        status.innerHTML = 'Blue has won!';    
}


const checkWinner = () =>{
    if(checkSame(0,0,0,1,0,2)){
        handleWin();
        cellDivs[0].classList.add('won');
        cellDivs[1].classList.add('won');
        cellDivs[2].classList.add('won');
    }
    else if(checkSame(1,0,1,1,1,2)){
        handleWin();
        cellDivs[3].classList.add('won');
        cellDivs[4].classList.add('won');
        cellDivs[5].classList.add('won');
    }
    else if(checkSame(2,0,2,1,2,2)){
        handleWin();
        cellDivs[6].classList.add('won');
        cellDivs[7].classList.add('won');
        cellDivs[8].classList.add('won');
    }
    else if(checkSame(0,0,1,0,2,0)){
        handleWin();
        cellDivs[0].classList.add('won');
        cellDivs[3].classList.add('won');
        cellDivs[6].classList.add('won');
    }
    else if(checkSame(0,1,1,1,2,1)){
        handleWin();
        cellDivs[1].classList.add('won');
        cellDivs[4].classList.add('won');
        cellDivs[7].classList.add('won');
    }
    else if(checkSame(0,2,1,2,2,2)){
        handleWin();
        cellDivs[2].classList.add('won');
        cellDivs[5].classList.add('won');
        cellDivs[8].classList.add('won');
    }
    else if(checkSame(0,0,1,1,2,2)){
        handleWin();
        cellDivs[0].classList.add('won');
        cellDivs[4].classList.add('won');
        cellDivs[8].classList.add('won');
    }
    else if(checkSame(2,0,1,1,0,2)){
        handleWin();
        cellDivs[2].classList.add('won');
        cellDivs[4].classList.add('won');
        cellDivs[6].classList.add('won');
    }
    else if(checkTied()){
        gameIsLive = false;
        statusDiv.innerHTML = 'Game is tied!';
    }else {
        currentRed = !currentRed;
        if(currentRed)
            statusDiv.innerHTML = 'Red is next';
        else
            statusDiv.innerHTML = 'Blue is next';
    }


}



//get current cell index from class name
function getClassIndex(selector, element) {
    var list = document.querySelectorAll(selector);
    for (var i = 0; i < selector.length; ++i)
      if (list[i] === element) return i;
    return -1;
}

const getCellLocation = (element) =>{
    console.log(element);
    if(element.tagName==='IMG')
        element = element.parentElement;
    const index = getClassIndex('.game-cell',element);
    console.log(index);
    return [Math.floor(index/3), index%3];
};

const handleCellClick = (e) => {
    [i,j] = getCellLocation(e.target);
    console.log(i,j);
    if(gameIsLive && currentSelectedIn!=null && (!gameState[i][j] || getMaxColorAndSize(i,j).size<(currentSelectedIn%3))){
        if(!gameState[i][j])    
            gameState[i][j]=[]; 
        if(currentRed){
            gameState[i][j].push(new Coin("red",currentSelectedIn%3));
        }
        else{    
            gameState[i][j].push(new Coin("blue",currentSelectedIn%3));
        }
        //update Played coins
        playedCoins.push(currentSelectedIn);
        //remove coin from player
        playerCoinDivs[currentSelectedIn].parentElement.innerHTML='';
        currentSelectedIn=null;
        renderGrid();
        checkWinner();
    }
}

for (const cellDiv of cellDivs) {
    cellDiv.addEventListener('click', handleCellClick);
  }

  
//reset
resetDiv.addEventListener('click', (e)=>{
    for(let i=0 ;i<3 ;i++){
        for(let j=0 ;j<3 ; j++){
            gameState[i][j]=null;
        }
    }
    currentRed = true;
    statusDiv.innerHTML = 'Red is next';
    gameIsLive = true;
    currentSelectedIn = null;
    playedCoins=[];
    renderGrid();

    //repopulate players coins
    let pc = document.querySelectorAll('.player-cell');
    for (let i=0;i<pc.length;i++) {
        color=null;
        size=null;
        if(i<6)
            color="red";
        else
            color="blue";
        switch(i%3){
            case 0: size="50%";break;
            case 1: size="70%";break;
            case 2: size="100%";break;
        }
        pc[i].innerHTML=('<img src="asset/'+color+'Circle.png" height='+size+' width='+size+'>');
    }

});

isRedClicked = (e) => {
    for(let i=0 ; i<6 ; ++i){
        if(e.target === playerCoinDivs[i])
            return true;
    }
    return false;
}


handleCoinClick= (e) =>{
    if((currentRed && isRedClicked(e))||(!currentRed && !isRedClicked(e))){
        for (let i=0;i<playerCoinDivs.length;i++) {
            playerCoinDivs[i].classList.remove('currentSelected');
        }
        if(e.target)
        e.target.classList.add('currentSelected');
        for(let i=0 ;i<12 ; i++){
            if(e.target === playerCoinDivs[i]){
                currentSelectedIn = i;
            }
        }
    }
}

for(const coinDiv of playerCoinDivs){
    coinDiv.addEventListener('click', handleCoinClick);
}

