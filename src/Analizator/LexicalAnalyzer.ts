import { Token, Type } from "./Token";

class LexicalAnalyzer{

    private row: number;
    private column: number;
    private auxChar: string;
    private state: number;
    private tokenList: Token[];
    private errorList: Token[];
    private reserverdWords: String[];

    constructor(){
        this.row = 1;
        this.column =1;
        this.auxChar = '';
        this.state = 0;
        this.tokenList = [];
        this.errorList = [];
        this.reserverdWords = ['carrera','semestre','curso','nombre','area','prerrequisitos'];

    }

    scanner(input: string){

        input += '#';
        let char: string;

        for(let i: number = 0; i < input.length; i++){

            char = input[i];

            switch(this.state){
                case 0:
                    switch(char){
                        case '[':
                            this.state = 1;
                            this.addCharacter(char);
                            break;
                        case ']':
                            this.state = 2;
                            this.addCharacter(char);
                            break;
                        case '{':
                            this.state = 3;
                            this.addCharacter(char);
                            break;
                        case '}':
                            this.state = 4;
                            this.addCharacter(char);
                            break;
                        case '(':
                            this.state = 5;
                            this.addCharacter(char);
                            break;
                        case ')':
                            this.state = 6;
                            this.addCharacter(char);
                            break;
                        case ':':
                            this.state = 7;
                            this.addCharacter(char);
                            break;
                        case ';':
                            this.state = 8;
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
                            if (/[a-z]/.test(char)){
                                //es una letra
                                this.state = 9;
                                this.addCharacter(char);
                                continue;
                            }

                            if (/\d/.test(char)){
                                //es un digito
                                this.state = 10;
                                this.addCharacter(char);
                                continue;
                            }

                            if (char == '#' && i == input.length -1){
                                //se termino el analisis
                                console.log("analyze finished");
                            }else{
                                //erro lexico
                                this.addError(Type.UNKNOW, char, this.row, this.column);
                                this.column++;
                            }

                            break;
                        case '"':
                            this.state = 11;
                            this.addCharacter(char);
                            break;
                        case ',':
                            this.state = 13;
                            this.addCharacter(char);
                            break;
                    }

                    break;
                case 1:
                    //aceptacion
                    this.addToken(Type.BRACK_OPEN, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.clean();
                    i--;
                    break;
                case 2:
                    //aceptacion
                    this.addToken(Type.BRACK_CLOSE, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.clean();
                    i--;
                    break;
                case 3:
                    //aceptacion
                    this.addToken(Type.BRACE_OPEN, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.clean();
                    i--;
                    break;
                case 4:
                    //aceptacion
                    this.addToken(Type.BRACE_CLOSE, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.clean();
                    i--;
                    break;
                case 5:
                    //aceptacion
                    this.addToken(Type.PAR_OPEN, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.clean();
                    i--;
                    break;
                case 6:
                    //aceptacion
                    this.addToken(Type.BRACK_CLOSE, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.clean();
                    i--;
                    break;
                case 7:
                    //aceptacion
                    this.addToken(Type.COLON, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.clean();
                    i--;
                    break;
                case 8:
                    //aceptacion
                    this.addToken(Type.SEMICOLON, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.clean();
                    i--;
                    break;
                case 9:
                    //aceptacion

                    if(/[A-Za-z0-9]/.test(char)){
                        //sigue siendo un identificador
                        this.addCharacter(char);
                        continue;
                    }

                    if(this.reserverdWords.includes(this.auxChar)){
                        this.addToken(Type.RESERVERD_WORD, this.auxChar, this.row, this.column - this.auxChar.length);
                        this.clean();
                        i--;
                        continue;
                    }

                    //error lexico
                    this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.clean();
                    i--;

                    break;
                case 10:
                    //aceptacion

                    if(/\d/.test(char)){
                        //sigue siendo un digito
                        this.addCharacter(char);
                        continue;
                    }
                    
                    this.addToken(Type.NUMBER, this.auxChar, this.row, this.column - this.auxChar.length);
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
                    this.addToken(Type.COMMA, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.clean();
                    i--;
                    break;        
            }

        }

        return this.tokenList;

    }

    private addCharacter(char: String){
        this.auxChar += char;
        this.column++;
    }

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

    getErrorList(){
        return this.errorList;
    }

}

export{ LexicalAnalyzer }