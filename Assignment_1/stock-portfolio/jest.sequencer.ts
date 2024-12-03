import Sequencer from '@jest/test-sequencer';
import type { Test } from '@jest/test-result';

class CustomSequencer extends Sequencer {
    async sort(tests: Test[]): Promise<Test[]> {
        return [...tests].sort((testA, testB) => {
            if (testA.path.includes('docker.test')) return 1;
            if (testB.path.includes('docker.test')) return -1;
            return testA.path > testB.path ? 1 : -1;
        });
    }
}

export default CustomSequencer;