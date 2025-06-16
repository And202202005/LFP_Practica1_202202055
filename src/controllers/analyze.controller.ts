import { Request, Response }  from "express";
import {LexicalAnalyzer } from "../Analizator/LexicalAnalyzer";
import { Token } from "../Analizator/Token";

export const analyze =(req: Request, res: Response) =>{

    const input =req.body;

    let lexicalAnalyzer: LexicalAnalyzer = new LexicalAnalyzer();

    let tokenList: Token[] = lexicalAnalyzer.scanner(input);

    res.json({
        "tokens": tokenList,
        "errors": lexicalAnalyzer.getErrorList()
    });
}