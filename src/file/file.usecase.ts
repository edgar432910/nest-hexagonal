import * as chokidar from 'chokidar';
import fs from 'fs';
import  es from 'event-stream';
import { UserModel } from '../user/domain/user.model';
import { UserUseCase } from 'src/user/application/user.usecase';
import { Injectable } from '@nestjs/common';
const folderToWatch = __dirname + '/path';
const delayToAttempts = 10000;
const maxAttempts = 3;
@Injectable()
export class FileUseCase{
    constructor(private userUseCase:UserUseCase){
        console.log('START')
        // if you test try Attempts, send  this.watchPath(true)
        this.watchPath()
    }
    private watchPath(testError:boolean = false){
        const watcher = chokidar.watch( folderToWatch, {
            persistent: true
        }); 
        console.log('watchPath', folderToWatch)
        watcher
        .on('add', (filePath) => {
            console.log('add')
            const nameFile = filePath.split('/').slice(-1)
            console.log(`a file has been uploaded : ${nameFile}`);
            const isCsv = filePath.endsWith('.csv') ;
            if(!isCsv) return;
            const PATH_FILE_CORRUPT = 'archivo_que_no_existe.txt'

            this.saveValidDocument(testError ? PATH_FILE_CORRUPT:filePath)
        })
        .on('error', (error) => {
            console.error(error)
        })
    }
    private saveValidDocument(PATH_FILE:string, attempts:number = 0):Promise<void>{
        return new Promise((resolve, reject) => {
            if(attempts>=maxAttempts){
                const nameFile = PATH_FILE.split('/').slice(-1)
                reject(new Error(`Max Attempts exceeded with this file: ${nameFile}`))
                return ;
            }

            fs.createReadStream(PATH_FILE, "utf-8")
            .on('error', (error) => {
                console.log('intempts: ',attempts+1,{error})
                setTimeout(() => {
                    this.saveValidDocument(PATH_FILE, attempts + 1)
                        .then(resolve)
                        .catch(reject)
                }, delayToAttempts);
            })
            .pipe(es.split())
            .on('data',async(data)=>{
                const value = data.split(',');
                const user:UserModel = {
                    dni: value[0],
                    name:  value[1],
                    lastname:  value[2],
                    active: true
                }
                this.userUseCase.insert(user)
            })
            .on('end', () => {
                resolve()
            })
            
        })
    }

}