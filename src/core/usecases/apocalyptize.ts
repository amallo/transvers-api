import {Readable} from 'stream'
import { DateService } from '../services/date.service'
export const makeApocalyptize = ({dateService} : {dateService: DateService})=>({input} : {input: Readable})=>{
    return Promise.resolve({
        at: dateService.nowIs().toISOString(),
        by: 'audie',
        id: 'job-id-0'
    })
}