import { jest } from '@jest/globals';
import { ResumesRepository } from '../../../src/repositories/resumes.repository';}

let mockPrisma = {
    resumes : {
        findMany : jest.fn(),
        findUnique : jest.fn(),
        create : jest.fn(),
        update : jest.fn(),
        delete : jest.fn(),
    },
};

let resumesRepository = new ResumesRepository(mockPrisma);
describe('Posts Repository Unit Test', () => {
    // 테스트 실행시키기 전에 실행...
    beforeEach(()=>{
        jest.resetAllMocks(); // Mock 초기화
    })

    // 테스트 시작!
    test('findAllResumes Method', async () => {
        console.log('test');
    });

    test('createResume Method', async () => {
        console.log('test');
    });
    test('findResumeById Method', async () => {
        console.log('test');
    });

    test('updateResume Method', async () => {
        console.log('test');
    });

    test('deleteResume Method', async () => {
        console.log('test');
    });
});
