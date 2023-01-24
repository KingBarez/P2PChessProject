class Piece{
    constructor(player, piece, iconUrl, justMove = false, countMove = 0){
        this.player = player;
        this.style = {backgroundImage: "url('"+iconUrl+"')"};
        this.piece = piece;
        this.justMove = justMove;
        this.countMove = countMove;
    }

    getPlayer(){
        return this.player;        
    }

    addMove(){
        this.countMove++;
    }

    getCountMove(){
        return this.countMove;
    }
    
    availableMoves(chessboard, source, currentPlayer, chessControl){
        return true;
    }
}

export class Bishop extends Piece{
    constructor(player, piece, iconUrl, justMove, countMove){
        super(player, piece, (player === 1? "https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg" : "https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg"), justMove, countMove);
    }

    availableMoves(chessboard, source, currentPlayer, chessControl){
        var dest = [];
      //  if(this.player == 1){
            for(let i = source + 8, j = source % 8 + 1; i < 64 && j < 8; i += 8, j++){
                if(chessboard[i + j - source % 8] == null){
                    dest.push(i + j - source % 8);
                }
                else if(chessboard[i + j - source % 8].player != this.player){
                    dest.push(i + j - source % 8);
                    break;
                }
                else{
                    break;
                }
            }
            for(let i = source - 8, j = source % 8 + 1; i >= 0 && j < 8; i -= 8, j++){
                if(chessboard[i + j - source % 8] == null){
                    dest.push(i + j - source % 8);
                }
                else if(chessboard[i + j - source % 8].player != this.player){
                    dest.push(i + j - source % 8);
                    break;
                }
                else{
                    break;
                }
            }
            for(let i = source + 8, j = source % 8 - 1; i < 64 && j >= 0; i += 8, j--){
                if(chessboard[i + j - source % 8] == null){
                    dest.push(i + j - source % 8);
                }
                else if(chessboard[i + j - source % 8].player != this.player){
                    dest.push(i + j - source % 8);
                    break;
                }
                else{
                    break;
                }
            }
            for(let i = source - 8, j = source % 8 - 1; i >= 0 && j >= 0; i -= 8, j--){
                if(chessboard[i + j - source % 8] == null){
                    dest.push(i + j - source % 8);
                }
                else if(chessboard[i + j - source % 8].player != this.player){
                    dest.push(i + j - source % 8);
                    break;
                }
                else{
                    break;
                }
     //       }
        }
        let i = 0;
        if(chessControl){
            while(i < dest.length){
                var chessboardTemp = chessboard.slice();
                var chessTemp = false;
                chessboardTemp[dest[i]] = chessboardTemp[source];
                chessboardTemp[source] = null;
                var destTemp = [];
                for(let j = 0; j < chessboardTemp.length; j++){
                    if(chessboardTemp[j] != null){
                        if(chessboardTemp[j].player != chessboardTemp[dest[i]].player){
                            destTemp = chessboardTemp[j].availableMoves(chessboardTemp, j, chessboardTemp[j].player, false);
                            for(let k = 0; k < destTemp.length; k++){
                                if(chessboardTemp[destTemp[k]] != null){
                                    if(chessboardTemp[destTemp[k]].constructor.name == "King"){
                                        chessTemp = true;
                                    }
                                }
                            }
                        }
                    }
                }
                if(chessTemp){
                    dest.splice(i, 1);
                }
                else{
                    i++;
                }
            }
        }
        return dest;
    }
}

export class King extends Piece{
    constructor(player, piece, justMove, countMove){
        super(player, piece, (player === 1? "https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg" : "https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg"), justMove, countMove);
        this.hasBeenMoved = false;
    }
    
    setAsMoved(){
        this.hasBeenMoved = true;
    }

    availableMoves(chessboard, source, currentPlayer, chessControl){
        var otherDest = [];
        var dest = [];
        var controlUp = false;
        var controlBottom = false;
        var controlLeft = false;
        var controlRight = false;
        if(currentPlayer == 1 && this.player == 1){
            for(let i = 0; i < 64; i++){
                if(chessboard[i] != null){
                    if(chessboard[i].player == 2){
                        var tempDest = chessboard[i].availableMoves(chessboard, i, currentPlayer, false);
                        for(let j = 0; j < tempDest.length; j++){
                            otherDest.push(tempDest[j]);
                        }
                    }
                }
            }
        }
        else if(currentPlayer == 2 && this.player == 2){
            for(let i in chessboard){
                if(chessboard[i] != null){
                    if(chessboard[i].player == 1){
                        var tempDest = chessboard[i].availableMoves(chessboard, i, currentPlayer, false);
                        for(let j in tempDest){
                            otherDest.push(tempDest[j]);
                        }
                    }
                }
            }
        }
        //if(this.player == 1){
            if(!this.hasBeenMoved && chessboard[source + 3] != null && chessboard[source + 3].constructor.name == "Rook" && !chessboard[source + 3].hasBeenMoved){
                if(chessboard[source + 1] == null && chessboard[source + 2] == null){
                    dest.push(source + 2);
                }
            }
            if(!this.hasBeenMoved && chessboard[source - 4] != null && chessboard[source - 4].constructor.name == "Rook" && !chessboard[source - 4].hasBeenMoved){
                if(chessboard[source - 1] == null && chessboard[source - 2] == null && chessboard[source - 3] == null){
                    dest.push(source - 2);
                }
            }
            if(source % 8 != 7){
                controlRight = true;
                if(chessboard[source + 1] == null || chessboard[source + 1].player != this.player){
                    dest.push(source + 1);
                }
            }
            if(source % 8 != 0){
                controlLeft = true;
                if(chessboard[source - 1] == null || chessboard[source - 1].player != this.player){
                    dest.push(source - 1);
                }
            }
            if(source >= 8){  
                controlUp = true; 
                if(chessboard[source - 8] == null || chessboard[source - 8].player != this.player){
                    dest.push(source - 8);         
                }
            }
            if(source < 56){  
                controlBottom = true;
                if(chessboard[source + 8] == null || chessboard[source + 8].player != this.player){
                    dest.push(source + 8);          
                }
            }
            if(controlBottom && controlRight){
                if(chessboard[source + 7] == null || chessboard[source + 7].player != this.player){
                    dest.push(source + 7); 
                }
            }
            if(controlBottom && controlLeft){
                if(chessboard[source + 9] == null || chessboard[source + 9].player != this.player){
                    dest.push(source + 9); 
                } 
            }
            if(controlUp && controlRight){
                if(chessboard[source - 9] == null || chessboard[source - 9].player != this.player){
                    dest.push(source - 9); 
                }
            }
            if(controlUp && controlLeft){
                if(chessboard[source - 7] == null || chessboard[source - 7].player != this.player){
                    dest.push(source - 7); 
                } 
        //    }
        }
        let i = 0;
        if(chessControl){
            while(i < dest.length){
                var chessboardTemp = chessboard.slice();
                var chessTemp = false;
                chessboardTemp[dest[i]] = chessboardTemp[source];
                chessboardTemp[source] = null;
                var destTemp = [];
                for(let j = 0; j < chessboardTemp.length; j++){
                    if(chessboardTemp[j] != null){
                        if(chessboardTemp[j].player != chessboardTemp[dest[i]].player){
                            destTemp = chessboardTemp[j].availableMoves(chessboardTemp, j, chessboardTemp[j].player, false);
                            for(let k = 0; k < destTemp.length; k++){
                                if(chessboardTemp[destTemp[k]] != null){
                                    if(chessboardTemp[destTemp[k]].constructor.name == "King"){
                                        chessTemp = true;
                                    }
                                }
                            }
                        }
                    }
                }
                if(chessTemp){
                    dest.splice(i, 1);
                }
                else{
                    i++;
                }
            }
        }
        return dest;
    }
}

export class Knight extends Piece{
    constructor(player, piece, justMove, countMove){
        super(player, piece, (player === 1? "https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg" : "https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg"), justMove, countMove);
    }

    availableMoves(chessboard, source, currentPlayer, chessControl){
        var dest = [];
        //if(this.player == 1){
            if(source % 8 < 7 && source < 48){
                if(chessboard[source + 17] == null){
                    dest.push(source + 17);
                }
                else if(chessboard[source + 17].player != this.player){
                    dest.push(source + 17);
                }
                
            }

            if(source % 8 > 0 && source < 48){
                if(chessboard[source + 15] == null){
                    dest.push(source + 15);
                }
                else if(chessboard[source + 15].player != this.player){
                    dest.push(source + 15);
                }
            }

            if(source % 8 < 6 && source < 56){
                if(chessboard[source + 10] == null){
                    dest.push(source + 10);
                }
                else if(chessboard[source + 10].player != this.player){
                    dest.push(source + 10);
                }
            }

            if(source % 8 > 1 && source < 56){
                if(chessboard[source + 6] == null){
                    dest.push(source + 6);
                }
                else if(chessboard[source + 6].player != this.player){
                    dest.push(source + 6);
                }
            }

            if(source % 8 > 0 && source >= 16){
                if(chessboard[source - 17] == null){
                    dest.push(source - 17);
                }
                else if(chessboard[source - 17].player != this.player){
                    dest.push(source - 17);
                }
            }

            if(source % 8 < 7 && source >= 16){
                if(chessboard[source - 15] == null){
                    dest.push(source - 15);
                }
                else if(chessboard[source - 15].player != this.player){
                    dest.push(source - 15);
                }
            }

            if(source % 8  < 6 && source >= 8){
                if(chessboard[source - 6] == null){
                    dest.push(source - 6);
                }
                else if(chessboard[source - 6].player != this.player){
                    dest.push(source - 6);
                }
            }

            if(source % 8 > 1 && source >= 8){
                if(chessboard[source - 10] == null){
                    dest.push(source - 10);
                }
                else if(chessboard[source - 10].player != this.player){
                    dest.push(source - 10);
                }
        }
        let i = 0;
        if(chessControl){
            while(i < dest.length){
                var chessboardTemp = chessboard.slice();
                var chessTemp = false;
                chessboardTemp[dest[i]] = chessboardTemp[source];
                chessboardTemp[source] = null;
                var destTemp = [];
                for(let j = 0; j < chessboardTemp.length; j++){
                    if(chessboardTemp[j] != null){
                        if(chessboardTemp[j].player != chessboardTemp[dest[i]].player){
                            destTemp = chessboardTemp[j].availableMoves(chessboardTemp, j, chessboardTemp[j].player, false);
                            for(let k = 0; k < destTemp.length; k++){
                                if(chessboardTemp[destTemp[k]] != null){
                                    if(chessboardTemp[destTemp[k]].constructor.name == "King"){
                                        chessTemp = true;
                                    }
                                }
                            }
                        }
                    }
                }
                if(chessTemp){
                    dest.splice(i, 1);
                }
                else{
                    i++;
                }
            }
        }
        return dest;
    }
}

export class Pawn extends Piece{
    constructor(player, piece, justMove, countMove){
        super(player, piece, (player === 1?  "https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg" : "https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg"), justMove, countMove);
    }

    availableMoves(chessboard, source, currentPlayer, chessControl){
        var dest = [];
        if(this.player == 1){
            if(source >= 8){
                if(source % 8 == 0){
                    if(chessboard[source - 7] != null && chessboard[source - 7].player != this.player){
                        dest.push(source - 7);
                    }
                }
                else if(source % 8 == 7){
                    if(chessboard[source - 9] != null && chessboard[source - 9].player != this.player){
                        dest.push(source - 9);
                    }
                }
                else{
                    if(chessboard[source - 7] != null){
                        if(chessboard[source - 7].player != this.player){
                            dest.push(source - 7);
                        }
                    }
                    if(chessboard[source - 9] != null){
                        if(chessboard[source - 9].player != this.player){
                            dest.push(source - 9);
                        }
                    }
                }
            }
            if(source < 56 && source >= 48){

                if(chessboard[source - 8] == null){
                    dest.push(source - 8);
                    if(chessboard[source - 16] == null){
                        dest.push(source - 16);
                    }
                }
            }
            else if(source >= 8){
                if(chessboard[source - 8] == null){
                    dest.push(source - 8); 
                }
            }
            if(source >= 24 && source < 31){
                if(chessboard[source + 1] != null){
                    if(chessboard[source + 1].player != this.player && chessboard[source + 1].constructor.name == "Pawn" && chessboard[source + 1].countMove == 1){
                        dest.push(source - 7);
                    }
                }   
            }
            if(source > 24 && source < 32){
                if(chessboard[source - 1] != null){
                    if(chessboard[source - 1].player != this.player && chessboard[source - 1].constructor.name == "Pawn" && chessboard[source - 1].countMove == 1){
                        dest.push(source - 9);
                    }
                }   
            }
        }
        else{
            if(source < 56){
                if(source % 8 == 0){
                    if(chessboard[source + 9] != null && chessboard[source + 9].player != this.player){
                        dest.push(source + 9);
                    }
                }
                else if(source % 8 == 7){
                    if(chessboard[source + 7] != null && chessboard[source + 7].player != this.player){
                        dest.push(source + 7);
                    }
                }
                else{
                    if(chessboard[source + 7] != null){
                        if(chessboard[source + 7].player != this.player){
                            dest.push(source + 7);
                        }
                    }
                    if(chessboard[source + 9] != null){
                        if(chessboard[source + 9].player != this.player){
                            dest.push(source + 9);
                        }
                    }
                }
            }
            if(source < 16 && source >= 8){

                if(chessboard[source + 8] == null){
                    dest.push(source + 8);
                    if(chessboard[source + 16] == null){
                        dest.push(source + 16);
                    }
                }
            }
            else if(source < 56){
                if(chessboard[source + 8] == null){
                    dest.push(source + 8);
                }
            }
            if(source >= 32 && source < 39){
                if(chessboard[source + 1] != null){
                    if(chessboard[source + 1].player != this.player && chessboard[source + 1].constructor.name == "Pawn" && chessboard[source + 1].countMove == 1){
                        dest.push(source + 9);
                    }
                }   
            }
            if(source > 32 && source < 40){
                if(chessboard[source - 1] != null){
                    if(chessboard[source - 1].player != this.player && chessboard[source - 1].constructor.name == "Pawn" && chessboard[source - 1].countMove == 1){
                        dest.push(source + 7);
                    }
                }   
            }
        }
        let i = 0;
        if(chessControl){
            while(i < dest.length){
                var chessboardTemp = chessboard.slice();
                var chessTemp = false;
                chessboardTemp[dest[i]] = chessboardTemp[source];
                chessboardTemp[source] = null;
                var destTemp = [];
                for(let j = 0; j < chessboardTemp.length; j++){
                    if(chessboardTemp[j] != null){
                        if(chessboardTemp[j].player != chessboardTemp[dest[i]].player){
                            destTemp = chessboardTemp[j].availableMoves(chessboardTemp, j, chessboardTemp[j].player, false);
                            for(let k = 0; k < destTemp.length; k++){
                                if(chessboardTemp[destTemp[k]] != null){
                                    if(chessboardTemp[destTemp[k]].constructor.name == "King"){
                                        chessTemp = true;
                                    }
                                }
                            }
                        }
                    }
                }
                if(chessTemp){
                    dest.splice(i, 1);
                }
                else{
                    i++;
                }
            }
        }
        return dest;
    }
}

export class Queen extends Piece{
    constructor(player, piece, justMove, countMove){
        super(player, piece, (player === 1? "https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg" : "https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg"), justMove, countMove);
    }

    availableMoves(chessboard, source, currentPlayer, chessControl){
        var dest = [];
      //  if(this.player == 1){
            for(let i = source + 8; i < 64; i += 8){
                if(chessboard[i] == null){
                    dest.push(i);
                }
                else if(chessboard[i].player != this.player){
                    dest.push(i);
                    break;
                }
                else{
                    break;
                }
            }
            for(let i = source - 8; i >= 0; i -= 8){
                if(chessboard[i] == null){
                    dest.push(i);
                }
                else if(chessboard[i].player != this.player){
                    dest.push(i);
                    break;
                }
                else{
                    break;
                }
            }
            for(let i = source % 8 + 1; i < 8; i++){
                if(chessboard[source + i  -source % 8] == null){
                    dest.push(source+i-source%8);
                }
                else if(chessboard[source + i - source % 8].player != this.player){
                    dest.push(source + i - source % 8);
                    break;
                }
                else{
                    break;
                }
            }
            for(let i = source % 8 - 1; i >= 0; i--){
                if(chessboard[source + i - source % 8] == null){
                    dest.push(source + i - source % 8);
                }
                else if(chessboard[source + i - source % 8].player != this.player){
                    dest.push(source + i - source % 8);
                    break;
                }
                else{
                    break;
                }
            }
            for(let i = source + 8, j = source % 8 + 1; i < 64 && j < 8; i += 8, j++){
                if(chessboard[i + j - source % 8] == null){
                    dest.push(i + j - source % 8);
                }
                else if(chessboard[i + j - source % 8].player != this.player){
                    dest.push(i + j - source % 8);
                    break;
                }
                else{
                    break;
                }
            }
            for(let i = source - 8, j = source % 8 + 1; i >= 0 && j < 8; i -= 8, j++){
                if(chessboard[i + j - source % 8] == null){
                    dest.push(i + j - source % 8);
                }
                else if(chessboard[i + j - source % 8].player != this.player){
                    dest.push(i + j - source % 8);
                    break;
                }
                else{
                    break;
                }
            }
            for(let i = source + 8, j = source % 8 - 1; i < 64 && j >= 0; i += 8, j--){
                if(chessboard[i + j - source % 8] == null){
                    dest.push(i + j - source % 8);
                }
                else if(chessboard[i + j - source % 8].player != this.player){
                    dest.push(i + j - source % 8);
                    break;
                }
                else{
                    break;
                }
            }
            for(let i = source - 8, j = source % 8 -1; i >= 0 && j >= 0; i -= 8, j--){
                if(chessboard[i + j - source % 8] == null){
                    dest.push(i + j - source % 8);
                }
                else if(chessboard[i + j - source % 8].player != this.player){
                    dest.push(i + j -source % 8);
                    break;
                }
                else{
                    break;
                }
      //      }
        }
        let i = 0;
        if(chessControl){
            while(i < dest.length){
                var chessboardTemp = chessboard.slice();
                var chessTemp = false;
                chessboardTemp[dest[i]] = chessboardTemp[source];
                chessboardTemp[source] = null;
                var destTemp = [];
                for(let j = 0; j < chessboardTemp.length; j++){
                    if(chessboardTemp[j] != null){
                        if(chessboardTemp[j].player != chessboardTemp[dest[i]].player){
                            destTemp = chessboardTemp[j].availableMoves(chessboardTemp, j, chessboardTemp[j].player, false);
                            for(let k = 0; k < destTemp.length; k++){
                                if(chessboardTemp[destTemp[k]] != null){
                                    if(chessboardTemp[destTemp[k]].constructor.name == "King"){
                                        chessTemp = true;
                                    }
                                }
                            }
                        }
                    }
                }
                if(chessTemp){
                    dest.splice(i, 1);
                }
                else{
                    i++;
                }
            }
        }
        return dest;
    }
}

export class Rook extends Piece{
    constructor(player, piece, justMove, countMove){
        super(player, piece, (player === 1? "https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg" : "https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg"), justMove, countMove);
        this.hasBeenMoved = false;
    }

    setAsMoved(){
        this.hasBeenMoved = true;
    }


    availableMoves(chessboard, source, currentPlayer, chessControl){
        var dest = [];
     //   if(this.player == 1){
            for(let i = source + 8; i < 64; i += 8){
                if(chessboard[i] == null){
                    dest.push(i);
                }
                else if(chessboard[i].player != this.player){
                    dest.push(i);
                    break;
                }
                else{
                    break;
                }
            }
            for(let i = source - 8; i >= 0; i -= 8){
                if(chessboard[i] == null){
                    dest.push(i);
                }
                else if(chessboard[i].player != this.player){
                    dest.push(i);
                    break;
                }
                else{
                    break;
                }
            }
            for(let i = source % 8 + 1; i < 8; i++){
                if(chessboard[source + i - source % 8] == null){
                    dest.push(source + i - source % 8);
                }
                else if(chessboard[source + i - source % 8].player != this.player){
                    dest.push(source + i - source % 8);
                    break;
                }
                else{
                    break;
                }
            }
            for(let i = source % 8 - 1; i>= 0; i--){
                if(chessboard[source + i - source % 8] == null){
                    dest.push(source + i - source % 8);
                }
                else if(chessboard[source + i - source % 8].player != this.player){
                    dest.push(source + i - source % 8);
                    break;
                }
                else{
                    break;
                }
      //      }
        }
        let i = 0;
        if(chessControl){
            while(i < dest.length){
                var chessboardTemp = chessboard.slice();
                var chessTemp = false;
                chessboardTemp[dest[i]] = chessboardTemp[source];
                chessboardTemp[source] = null;
                var destTemp = [];
                for(let j = 0; j < chessboardTemp.length; j++){
                    if(chessboardTemp[j] != null){
                        if(chessboardTemp[j].player != chessboardTemp[dest[i]].player){
                            destTemp = chessboardTemp[j].availableMoves(chessboardTemp, j, chessboardTemp[j].player, false);
                            for(let k = 0; k < destTemp.length; k++){
                                if(chessboardTemp[destTemp[k]] != null){
                                    if(chessboardTemp[destTemp[k]].constructor.name == "King"){
                                        chessTemp = true;
                                    }
                                }
                            }
                        }
                    }
                }
                if(chessTemp){
                    dest.splice(i, 1);
                }
                else{
                    i++;
                }
            }
        }
        return dest;
    }
}