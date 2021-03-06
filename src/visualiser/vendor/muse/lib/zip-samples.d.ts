import { Observable } from 'rxjs';
import { EEGReading } from './muse-interfaces';
export interface EEGSample {
    index: number;
    timestamp: number;
    data: number[];
}
export declare function zipSamples(eegReadings: Observable<EEGReading>): Observable<EEGSample>;
