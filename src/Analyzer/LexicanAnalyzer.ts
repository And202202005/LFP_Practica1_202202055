import { Token, Type } from "./Token";

class LexicalAnalyzer{

    private row: number;
    private column: number;
    private auxChar: string;
    private state: number;
    private tokenList: Token[];
    private errorList: Token[];

    constructor(){
        this.row = 1;
        this.column =1;
        this.auxChar = '';
        this.state = 0;
        this.tokenList = [];
        this.errorList = [];
    }

    scanner(input: string){

        input += '#';
        let char: string;

        for (let i: number = 0; i < input.length; i++){

            char = input[i];

            switch(this.state){
                case 0:
                    switch(char){
                        case ';':
                            this.state = 10;
                            this.addCharacter(char);
                            break;
                        case ')':
                            this.state = 9;
                            this.addCharacter(char);
                            break;
                        case '(':
                            this.state = 8;
                            this.addCharacter(char);
                            break;
                        case ']':
                            this.state = 7;
                            this.addCharacter(char);
                            break;
                        case ':':
                            this.state = 1;
                            this.addCharacter(char);
                            break;
                        case '[':
                            this.state = 6;
                            this.addCharacter(char);
                            break;
                        case '}':
                            this.state = 5;
                            this.addCharacter(char);
                            break;
                        case '{':
                            this.state = 4;
                            this.addCharacter(char);
                            break;
                        case '=':
                            this.state = 3;
                            this.addCharacter(char);
                            break;
                        case '"':
                            this.state = 11;
                            this.addCharacter(char);
                            break;
                        case 'j':
                            this.state = 14;
                            this.addCharacter(char);
                            break;
                        case 'a':
                            this.state = 21;
                            this.addCharacter(char);
                            break;
                        case 'f':
                            this.state = 30;
                            this.addCharacter(char);
                            break;
                        case 'd':
                            this.state = 35;
                            this.addCharacter(char);
                            break;
                        case 's':
                            this.state = 47;
                            this.addCharacter(char);
                            break;
                        case 'n':
                            this.state = 52;
                            this.addCharacter(char);
                            break;
                        case 'p':
                            this.state = 58;
                            this.addCharacter(char);
                            break;
                        case ' ':
                            this.column++;
                            break;
                        case '\n':
                        case '\r':
                            this.row++;
                            this.column = 1;
                            break;
                        case '\t':
                            this.column += 4;
                            break;
                        default:
                            if(/\d/.test(char)){
                                //es un digito
                                this.state = 13;
                                this.addCharacter(char);

                            }else if (char == '#' && i == input.length - 1){
                                //se termino el analisis
                                console.log("Anakyze finised");
                            }else{
                                //error lexico
                                this.addError(Type.UNKNOW, char, this.row, this.column);
                                this.column++;
                            }
                            break;
                    }

                    break;
                case 1:
                    //aceptacion
                    if( char == '='){
                        this.state = 2;
                        this.addCharacter(char);
                        continue;
                    }

                    this.addToken(Type.COLON, this.auxChar, this.row ,this.column - this.auxChar.length);
                    this.clean();
                    i--;
                    break;
                case 2:
                    //aceptacion
                    this.addToken(Type.ASSIGN, this.auxChar, this.row ,this.column - this.auxChar.length);
                    this.clean();
                    i--;
                    break;
                case 3:
                    //aceptacion
                    this.addToken(Type.EQUAL, this.auxChar, this.row ,this.column - this.auxChar.length);
                    this.clean();
                    i--;
                    break;
                case 4:
                    //aceptacion
                    this.addToken(Type.BRACE_OPEN, this.auxChar, this.row ,this.column - this.auxChar.length);
                    this.clean();
                    i--;
                    break;
                case 5:
                    //aceptacion
                    this.addToken(Type.BRACE_CLOSE, this.auxChar, this.row ,this.column - this.auxChar.length);
                    this.clean();
                    i--;
                    break;
                case 6:
                    //aceptacion
                    this.addToken(Type.BRACK_OPEN, this.auxChar, this.row ,this.column - this.auxChar.length);
                    this.clean();
                    i--;
                    break;
                case 7:
                    //aceptacion
                    this.addToken(Type.BRACE_CLOSE, this.auxChar, this.row ,this.column - this.auxChar.length);
                    this.clean();
                    i--;
                    break;
                case 8:
                    //aceptacion
                    this.addToken(Type.PAR_OPEN, this.auxChar, this.row ,this.column - this.auxChar.length);
                    this.clean();
                    i--;
                    break;
                case 9:
                    //aceptacion
                    this.addToken(Type.PAR_CLOSE, this.auxChar, this.row ,this.column - this.auxChar.length);
                    this.clean();
                    i--;
                    break;
                case 10:
                    //aceptacion
                    this.addToken(Type.SEMICOLON, this.auxChar, this.row ,this.column - this.auxChar.length);
                    this.clean();
                    i--;
                    break;
                case 11:
                    if(char == '"'){
                        this.state = 12;
                        this.addCharacter(char);
                        continue;
                    }

                    this.addCharacter(char);
                    break;
                case 12:
                    //aceptacion
                    this.addToken(Type.STRING, this.auxChar, this.row ,this.column - this.auxChar.length);
                    this.clean();
                    i--;
                    break;
                case 13:
                    //aceptacion
                    if(/\d/.test(char)){
                        this.addCharacter(char);
                        continue;
                    }

                    this.addToken(Type.NUMBER, this.auxChar, this.row ,this.column - this.auxChar.length);
                    this.clean();
                    i--;
                    break;
                case 14:
                    if(char != 'u'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 15;
                    break;
                case 15:
                    if(char != 'g'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 16;
                    break;
                case 16:
                    if(char != 'a'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 17;
                    break;
                case 17:
                    if(char != 'd'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 18;
                    break;
                case 18:
                    if(char != 'o'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 19;
                    break;
                case 19:
                    if(char != 'r'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 20;
                    break;
                case 20:
                    //aceptacion
                    this.addToken(Type.RESERVERD_WORD, this.auxChar, this.row ,this.column - this.auxChar.length);
                    this.clean();
                    i--;
                    break;
                case 21:
                    if(char != 't'){
                        
                        if(char != 'g'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                        }

                        this.addCharacter(char);
                        this.state = 27;
                        break;

                    }

                    this.addCharacter(char);
                    this.state = 22;
                    break;
                case 22:
                    if(char != 'a'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 23;
                    break;
                case 23:
                    if(char != 'q'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 24;
                    break;
                case 24:
                    if(char != 'u'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 25;
                    break;
                case 25:
                    if(char != 'e'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 26;
                    break;  
                case 26:
                    //aceptacion
                    this.addToken(Type.RESERVERD_WORD, this.auxChar, this.row ,this.column - this.auxChar.length);
                    this.clean();
                    i--;
                    break; 
                case 27:
                    if(char != 'u'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 28;
                    break; 
                case 28:
                    if(char != 'a'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 29;
                    break; 
                case 29:
                    //aceptacion
                    this.addToken(Type.RESERVERD_WORD, this.auxChar, this.row ,this.column - this.auxChar.length);
                    this.clean();
                    i--;
                    break;
                case 30:
                    if(char != 'u'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 31;
                    break;  
                case 31:
                    if(char != 'e'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 32;
                    break;    
                case 32:
                    if(char != 'g'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 33;
                    break;
                case 33:
                    if(char != 'o'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 34;
                    break;
                case 34:
                    //aceptacion
                    this.addToken(Type.RESERVERD_WORD, this.auxChar, this.row ,this.column - this.auxChar.length);
                    this.clean();
                    i--;
                    break;
                case 35:
                    if(char != 'e'){
                        
                        if(char != 'r'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                        }

                        this.addCharacter(char);
                        this.state = 42;
                        break;

                    }

                    this.addCharacter(char);
                    this.state = 36;
                    break;
                case 36:
                    if(char != 'f'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 37;
                    break;
                case 37:
                    if(char != 'e'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 38;
                    break;
                case 38:
                    if(char != 'n'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 39;
                    break;
                case 39:
                    if(char != 's'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 40;
                    break;
                case 40:
                    if(char != 'a'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 41;
                    break;
                case 41:
                    //aceptacion
                    this.addToken(Type.RESERVERD_WORD, this.auxChar, this.row ,this.column - this.auxChar.length);
                    this.clean();
                    i--;
                    break;
                case 42:
                    if(char != 'a'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 43;
                    break;
                case 43:
                    if(char != 'g'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 44;
                    break;
                case 44:
                    if(char != 'o'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 45;
                    break;
                case 45:
                    if(char != 'n'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 46;
                    break; 
                case 46:
                    //aceptacion
                    this.addToken(Type.RESERVERD_WORD, this.auxChar, this.row ,this.column - this.auxChar.length);
                    this.clean();
                    i--;
                    break; 
                case 47:
                    if(char != 'a'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 48;
                    break;  
                case 48:
                    if(char != 'l'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 49;
                    break;
                case 49:
                    if(char != 'u'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 50;
                    break;
                case 50:
                    if(char != 'd'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 51;
                    break;
                case 51:
                    //aceptacion
                    this.addToken(Type.RESERVERD_WORD, this.auxChar, this.row ,this.column - this.auxChar.length);
                    this.clean();
                    i--;
                    break;
                case 52:
                    if(char != 'o'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 53;
                    break;
                case 53:
                    if(char != 'r'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 54;
                    break;
                case 54:
                    if(char != 'm'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 55;
                    break;
                case 55:
                    if(char != 'a'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 56;
                    break;
                case 56:
                    if(char != 'l'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 57;
                    break;
                case 57:
                    //aceptacion
                    this.addToken(Type.RESERVERD_WORD, this.auxChar, this.row ,this.column - this.auxChar.length);
                    this.clean();
                    i--;
                    break;
                case 58:
                    if(char != 's'){
                        
                        if(char != 'l'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                        }

                        this.addCharacter(char);
                        this.state = 66;
                        break;

                    }

                    this.addCharacter(char);
                    this.state = 59;
                    break;
                case 59:
                    if(char != 'i'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 60;
                    break;
                case 60:
                    if(char != 'q'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 61;
                    break;
                case 61:
                    if(char != 'u'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 62;
                    break;
                case 62:
                    if(char != 'i'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 63;
                    break;
                case 63:
                    if(char != 'c'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 64;
                    break;
                case 64:
                    if(char != '0'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 65;
                    break;
                case 65:
                    //aceptacion
                    this.addToken(Type.RESERVERD_WORD, this.auxChar, this.row ,this.column - this.auxChar.length);
                    this.clean();
                    i--;
                    break;
                case 66:
                    if(char != 'a'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 67;
                    break;
                case 67:
                    if(char != 'n'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 68;
                    break;
                case 68:
                    if(char != 't'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 69;
                    break; 
                case 69:
                    if(char != 'a'){
                        //error lexico
                        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    this.addCharacter(char);
                    this.state = 70;
                    break;    
                case 70:
                    //aceptacion
                    this.addToken(Type.RESERVERD_WORD, this.auxChar, this.row ,this.column - this.auxChar.length);
                    this.clean();
                    i--;
                    break; 
            }
        }

        return this.tokenList;
    }

    private addCharacter(char: string){
        this.auxChar += char;
        this.column++;
    }

    //Funcion de retorno
    private clean(){
        this.state = 0;
        this.auxChar ='';
    }

    private addToken(type: Type, lexeme: string, row: number, column: number){
        this.tokenList.push(new Token(type, lexeme, row, column));
    }

    private addError(type: Type, lexeme: string, row: number, column: number){
        this.errorList.push(new Token(type, lexeme, row, column));
    }

    getErroList(){
        return this.errorList;
    }
}

export {LexicalAnalyzer};