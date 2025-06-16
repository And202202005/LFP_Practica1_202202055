enum Type {
    UNKNOW,
    BRACK_OPEN,
    BRACK_CLOSE,
    COLON,
    BRACE_OPEN,
    BRACE_CLOSE,
    PAR_OPEN,
    PAR_CLOSE,
    SEMICOLON,
    RESERVERD_WORD,
    NUMBER,
    STRING,
    COMMA
}

class Token {

    private row: number;
    private column: number;
    private lexeme: string;
    private typeToken: Type;
    private typeTokenString: string;
    

    constructor(typeToken: Type, lexeme: string, row: number, column: number){
        this.typeToken = typeToken;
        this.typeTokenString = Type[typeToken];
        this.lexeme = lexeme;
        this.row = row;
        this.column = column;
    }
}

export { Token, Type}
